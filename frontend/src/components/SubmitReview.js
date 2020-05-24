import React, {useState, useEffect} from "react";
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

  const saveReview = async (songRating, songReview) => {
    const review = new ReviewClass();
    let songQuery;

    setSubmitErrorMsg("");

    try {
      songQuery = await new Parse.Query(SongClass).get(props.songId);
    } catch (error) {
      setSubmitErrorMsg(`${error.code} ${error.message}`);
      return; // we can't run the rest of the save if this fails
    }

    review.set("author", props.currentUser.toPointer());
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
      <h3>Write a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="songRating">
        Rating:
          <input
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
          && <span>Please enter a value less than or equal to 5</span>}
        <br />
        <label htmlFor="songReview">
        Review:
          <br />
          <textarea
            id="songReview"
            name="songReview"
            ref={register({required: true})}
          />
        </label>
        {errors.songReview?.type === "required"
          && <span>This field is required</span>}
        <br />
        <input
          type="submit"
          value="Submit Review"
        />
      </form>
      {submitErrorMsg !== "" && <p>{submitErrorMsg}</p>}
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
