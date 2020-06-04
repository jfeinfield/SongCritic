import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Parse from "parse";
import {useForm} from "react-hook-form";

import {
  Song as SongClass,
  Review as ReviewClass,
} from "../parseClasses";

const SubmitReview = (props) => {
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [hasReviewed, setHasReviewed] = useState(true);
  const {register, handleSubmit, reset, errors} = useForm();
  const {
    currentUser: user,
    songId
  } = props;

  useEffect(() => {
    (async () => {
      const reviewQuery = new Parse.Query(ReviewClass);
      reviewQuery.equalTo(
        "song",
        {
          "__type": "Pointer",
          "className": "song",
          "objectId": songId
        }
      );
      reviewQuery.equalTo("author", user.toPointer());

      const reviewArray = await reviewQuery.find();

      if (!reviewArray.length)
        setHasReviewed(false);
    })();
  });

  const saveReview = async (songRating, songReview) => {
    const review = new ReviewClass();
    let songQuery;

    setSubmitMsg("");
    setSubmitErrorMsg("");

    try {
      songQuery = await new Parse.Query(SongClass).get(songId);
    } catch (error) {
      setSubmitErrorMsg(`${error.code} ${error.message}`);
      return; // we can't run the rest of the save if this fails
    }

    review.set("author", user.toPointer());
    review.set("song", songQuery.toPointer());
    review.set("rating", parseFloat(songRating));
    review.set("review", songReview);

    try {
      await review.save().then((object) => {
        props.handleSubmitReview(object.id);
      });
      reset();
      setSubmitMsg("Review submitted successfully!");
    } catch (error) {
      setSubmitErrorMsg(`${error.code} ${error.message}`);
    }

  };

  const onSubmit = (data) => {
    const {
      songRating,
      songReview,
    } = data;

    saveReview(
      songRating,
      songReview,
    );
  };

  if (hasReviewed)
    return (
      <div className="mb-5">
        <h3>Write a Review</h3>
        <p>You have already reviewed this song.</p>
        <p>
          If you have deleted your review, refresh this page to write a new
          review.
        </p>
      </div>
    );
  if (!user)
    return (
      <div className="mb-5">
        <h3>Write a Review</h3>
        <p>Sign up or log in to write a review!</p>
      </div>
    );
  return (
    <div className="mb-5">
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="songRating">
          Rating (required):
            <input
              className={
                `form-control \
              ${errors.songRating ? "is-invalid" : ""}`
              }
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
            <small className="form-text text-muted">
              {
                "Ratings are from 0 to 5 inclusive, in increments of 0.5 " +
                "(e.g. 2.5)"
              }
            </small>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="songReview">
          Review (required):
            <textarea
              className={
                `form-control \
              ${errors.songReview ? "is-invalid" : ""}`
              }
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
        <input
          className="btn btn-primary"
          disabled={
            errors.songRating?.type
            || errors.songReview?.type
          }
          type="submit"
          value="Submit Review"
        />
      </form>
      {submitMsg !== "" && (
        <p className="text-success my-3">{submitMsg}</p>
      )}
      {submitErrorMsg !== "" && (
        <p className="text-danger mt-3">
          <strong>Error {submitErrorMsg.split(" ")[0]}</strong><br />
          {submitErrorMsg.split(" ").slice(1).join(" ")}
        </p>
      )}
    </div>
  );
};

SubmitReview.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
  songId: PropTypes.string.isRequired,
  handleSubmitReview: PropTypes.func.isRequired
};

export default SubmitReview;
