import React, { useState } from 'react';
import PropTypes from "prop-types";
import Parse from 'parse';

const SubmitReview = (props) => {
  const [song, setSong] = useState("");
  const [songRating, setRating] = useState("");
  const [songReview, setReview] = useState("");
  const [reviewPosted, setReviewPosted] = useState(false);

  const saveReview = async () => {
    const item = {
      userId: props.userId,
      songName: song,
      rating: songRating,
      review: songReview
    };
    const Review = Parse.Object.extend("review");
    const r = new Review();

    await r.save(item);
  
    setSong("");
    setRating("");
    setReview("");
    setReviewPosted(true);
  };

  return (
    <div className="container">
      <h2>Write a Review</h2>
      <label htmlFor="txtSongName">
        Song name:
        <input id="txtSongName" value={song} onChange={(e) => setSong(e.target.value)} />
      </label>
      <br />
      <label htmlFor="txtRating">
        Rating:
        <input
          id="txtRating"
          type="number"
          min="0"
          max="5"
          step="0.5"
          value={songRating}
          onChange={(e) => setRating(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor="txtSongReview">
        Review:
        <br />
        <textarea id="txtSongReview" value={songReview} onChange={(e) => setReview(e.target.value)} />
      </label>
      <br />
      <button
        disabled={song === "" || songRating === "" || songReview === ""}
        type="button"
        onClick={() => saveReview()}
      >
        Submit Review
      </button>
      <br />
      <div hidden={!reviewPosted}>Review posted successfully!</div>
    </div>
  );
};

SubmitReview.propTypes = {
  userId: PropTypes.number.isRequired
};

export default SubmitReview;
