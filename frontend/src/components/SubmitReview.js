import React, {useState} from "react";
import PropTypes from "prop-types";
import Parse from "parse";
import {useForm} from "react-hook-form";

import {
  Song as SongClass,
  Review as ReviewClass,
} from "../parseClasses";

const SubmitReview = (props) => {
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");

  const {register, handleSubmit, reset, errors} = useForm();
  const {
    currentUser: user,
    songId
  } = props;

  const saveReview = async (songRating, songReview) => {
    const review = new ReviewClass();
    let songQuery;

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
      await review.save();
      reset();
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

  return (
    <div>
      {user ? (
        <div>
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="songRating">
              Rating:
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
              type="submit"
              value="Submit Review"
            />
          </form>
          {submitErrorMsg !== "" && <p>{submitErrorMsg}</p>}
        </div>
      ) : (
        <div>
          <h3>Write a Review</h3>
          <p>Must be signed in to write a review</p>
        </div>
      )}
    </div>
  );
};

SubmitReview.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
  songId: PropTypes.string.isRequired,
};

export default SubmitReview;
