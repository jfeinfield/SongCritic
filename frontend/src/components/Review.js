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
    return <p>{fetchError}</p>;
  if (reviewObj) {
    return (
      <div className="review">
        {isListing
          ? (
            <>
              <Link to={`/user/${reviewObj.authorId}`}>
                <h4>{reviewObj.author}</h4>
              </Link>
              <p>{reviewObj.rating} stars</p>
              <p>{reviewObj.review}</p>
            </>
          ) : (
            <>
              <h3>{reviewObj.song}</h3>
              <p>
                {"Artist: "}
                {isListing
                  ? reviewObj.artist
                  : (
                    <Link to={`/user/${reviewObj.artistId}`}>
                      {reviewObj.artist}
                    </Link>
                  )}
              </p>
              <p>
                {"By: "}
                <Link to={`/user/${reviewObj.authorId}`}>
                  {reviewObj.author}
                </Link>
              </p>
              <p>Rating: {reviewObj.rating}</p>
              <p>Review: {reviewObj.review}</p>
            </>
          )}
        {isCurrentUserAuthor
          && (
            <div>
              {isEditingReview
                ? (
                  <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <label htmlFor="songRating">
                      Rating:
                        <input
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
                      </label>
                      {errors.songRating?.type === "required"
                        && <span>This field is required</span>}
                      {errors.songRating?.type === "min"
                        && <span>Please enter a positive value</span>}
                      {errors.songRating?.type === "max"
                        && (
                          <span>
                            Please enter a value less than or equal to 5
                          </span>
                        )
                      }
                      <br />
                      <label htmlFor="songReview">
                      Review:
                        <br />
                        <textarea
                          defaultValue={reviewObj.review}
                          id="songReview"
                          name="songReview"
                          ref={register({required: true})}
                        />
                      </label>
                      {errors.songReview?.type === "required"
                        && <span>This field is required</span>}
                      <br />
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setIsEditingReview(false)}
                      >
                        Cancel
                      </button>
                      <input
                        className="btn btn-primary"
                        type="submit"
                        value="Update Review"
                      />
                      {updateError && <p>{updateError}</p>}
                    </form>
                    <button
                      className="btn btn-danger"
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
        {showLinkToSong &&
          <Link to={`/song/${reviewObj.songId}`}>
            Visit song page for {reviewObj.song}
          </Link>}
      </div>
    );
  }
  if (isReviewDeleted)
    return <p><em>This review has been removed.</em></p>;
  return <p>Loading review...</p>;
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
