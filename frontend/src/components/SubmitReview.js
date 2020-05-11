import React, {useState} from "react";
import PropTypes from "prop-types";
import {Review as ReviewClass} from "../parseClasses";

const SubmitReview = (props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [songRating, setRating] = useState("");
  const [songReview, setReview] = useState("");
  const [reviewPosted, setReviewPosted] = useState(false);

  const saveReview = async () => {
    const review = new ReviewClass();

    try {
      await review.save({
        userId: props.currentUser.id,
        songName: song,
        artistName: artist,
        rating: songRating,
        review: songReview
      });

      setSong("");
      setArtist("");
      setRating("");
      setReview("");
      setReviewPosted(true);
    } catch {
      // TODO: handle submission error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveReview();
  };

  return (
    <div>
      <h2>Write a Review</h2>
      <form name="reviewForm" onSubmit={handleSubmit}>
        <label htmlFor="txtSongName">
        Song name:
          <input
            id="txtSongName"
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="txtArtistName">
        Artist:
          <input
            id="txtArtistName"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
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
          <textarea
            id="txtSongReview"
            value={songReview}
            onChange={(e) => setReview(e.target.value)}
          />
        </label>
        <br />
        <input
          disabled={song === "" || songRating === "" || songReview === ""
          || artist === ""}
          type="submit"
          value="Submit Review"
        />
        <br />
        {reviewPosted && <div>Review posted successfully!</div>}
      </form>
    </div>
  );
};

SubmitReview.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

export default SubmitReview;
