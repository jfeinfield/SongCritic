import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Parse from "parse";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";

import {
  Review as ReviewClass,
  Song as SongClass,
  User as UserClass
} from "../parseClasses";

const Review = (props) => {
  const {reviewId, isListing, showLinkToSong, currentUser} = props;
  const {register, handleSubmit, errors} = useForm();
  const [reviewObj, setReviewObj] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [isReviewDeleted, setIsReviewDeleted] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const query = new Parse.Query(ReviewClass);
        const resultWithPointers = await query.get(reviewId);
        const result = await (async (r) => {
          const {
            objectId,
            author: {objectId: authorId},
            song: {objectId: songId},
            review: ReviewText,
            rating
          } = r.toJSON();

          let song = await new Parse.Query(SongClass).get(songId);
          song = song.toJSON();

          const userQuery = new Parse.Query(UserClass);

          let author = await userQuery.get(authorId);
          author = author.toJSON();

          let artist = await userQuery.get(song.artist.objectId);
          artist = artist.toJSON();

          const review = {objectId, review: ReviewText, rating, authorId};
          review.author = author.name;
          review.song = song.name;
          review.songId = songId;
          review.artist = artist.name;
          review.artistId = song.artist.objectId;
          return review;
        })(resultWithPointers);

        setReviewObj(result);
        if (currentUser && result.authorId === currentUser.id)
          setIsCurrentUserAuthor(true);
      } catch (error) {
        setFetchError(`${error.code} ${error.message}`);
      }
    })();
  }, [reviewId, setReviewObj, currentUser, fetchError]);

  const updateReview = async (songRating, songReview) => {
    try {
      const query = new Parse.Query(ReviewClass);
      const resultWithPointers = await query.get(reviewId);

      resultWithPointers.set("rating", parseFloat(songRating));
      resultWithPointers.set("review", songReview);

      await resultWithPointers.save();

      setIsEditingReview(false);
      setReviewObj({
        ...reviewObj,
        review: songReview,
        rating: songRating
      });
    } catch (error) {
      setUpdateError(`${error.code} ${error.message}`);
    }
  };

  const onSubmit = (data) => {
    const {
      songRating,
      songReview,
    } = data;

    updateReview(songRating, songReview);
  };

  const deleteReview = async () => {
    try {
      const query = new Parse.Query(ReviewClass);
      const resultWithPointers = await query.get(reviewId);

      await resultWithPointers.destroy();

      setIsReviewDeleted(true);
      setReviewObj(null);
    } catch (error) {
      setDeleteError(`${error.code} ${error.message}`);
    }
  };

  if (fetchError)
    return (
      <div className="card text-white bg-danger mb-3">
        <div className="card-header">ERROR</div>
        <div className="card-body">
          <p className="card-text">{fetchError}</p>
        </div>
      </div>
    );
  if (reviewObj) {
    return (
      <div className="card mb-3">
        {isListing
          ? (
            <div className="card-body">
              <Link to={`/user/${reviewObj.authorId}`}>
                <h5 className="card-title">{reviewObj.author}</h5>
              </Link>
              <p className="card-text">{reviewObj.rating} stars</p>
              <p className="card-text">{reviewObj.review}</p>
            </div>
          ) : (
            <div className="card-body">
              <h5 className="card-title">{reviewObj.song}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {reviewObj.artist}
              </h6>
              <p className="card-text">
                <strong>Reviewer:</strong> <em>{reviewObj.author}</em><br />
                <strong>Rating:</strong> {reviewObj.rating}<br />
                <strong>Review:</strong><br />{reviewObj.review}
              </p>
              <Link className="card-link" to={`/song/${reviewObj.songId}`}>
                Visit {reviewObj.song}
              </Link>
              <Link className="card-link" to={`/user/${reviewObj.artistId}`}>
                Visit {reviewObj.artist}&apos;s page
              </Link>
              <Link className="card-link" to={`/user/${reviewObj.authorId}`}>
                Visit {reviewObj.author}&apos;s page
              </Link>
            </div>
          )}
        {isCurrentUserAuthor
          && (
            <div className="card-footer">
              {isEditingReview
                ? (
                  <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group">
                        <label htmlFor="songRating">
                          Rating:
                          <input
                            className={
                              `form-control \
                              ${errors.songRating ? "is-invalid" : ""}`
                            }
                            defaultValue={reviewObj.rating}
                            id="songRating"
                            name="songRating"
                            type="number"
                            step=".5"
                            ref={
                              register({
                                required: true,
                                min: 0,
                                max: 5,
                              })
                            }
                          />
                          {errors.songRating?.type === "required" && (
                            <div className="invalid-feedback">
                              This field is required
                            </div>
                          )}
                          {errors.songRating?.type === "min" && (
                            <div className="invalid-feedback">
                              Please enter a positive value
                            </div>
                          )}
                          {errors.songRating?.type === "max" && (
                            <div className="invalid-feedback">
                              Please enter a value less than or equal to 5
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="form-group">
                        <label htmlFor="songReview">
                          Review:
                          <textarea
                            className={
                              `form-control \
                              ${errors.songReview ? "is-invalid" : ""}`
                            }
                            defaultValue={reviewObj.review}
                            id="songReview"
                            name="songReview"
                            ref={register({required: true})}
                          />
                          {errors.songReview?.type === "required" && (
                            <div className="invalid-feedback">
                              This field is required
                            </div>
                          )}
                        </label>
                      </div>
                      <button
                        className="btn btn-secondary m-2"
                        type="button"
                        onClick={() => setIsEditingReview(false)}
                      >
                        Cancel Update
                      </button>
                      <input
                        className="btn btn-primary m-2"
                        type="submit"
                        value="Update Review"
                      />
                      {updateError && <p>{updateError}</p>}
                    </form>
                    <button
                      className="btn btn-danger m-2"
                      type="button"
                      onClick={() => deleteReview()}
                    >
                      Delete Review
                    </button>
                    {deleteError && <p>{deleteError}</p>}
                  </>
                ) : (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setIsEditingReview(true)}
                  >
                    Edit Review
                  </button>
                )
              }
              <br />
            </div>
          )}
      </div>
    );
  }
  if (isReviewDeleted)
    return (
      <div className="card text-white bg-secondary mb-3">
        <div className="card-header">DELETED</div>
        <div className="card-body">
          <p className="card-text">This review has been removed.</p>
        </div>
      </div>
    );
  return (
    <div className="card bg-light mb-3">
      <div className="card-header">LOADING</div>
      <div className="card-body">
        <p className="card-text">Loading rating and review text...</p>
      </div>
    </div>
  );
};

Review.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string
  }),
  reviewId: PropTypes.string.isRequired,
  isListing: PropTypes.bool,
  showLinkToSong: PropTypes.bool
};

Review.defaultProps = {
  currentUser: null,
  isListing: false,
  showLinkToSong: false
};

export default Review;
