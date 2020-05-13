import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Parse from "parse";

import {
  Song as SongClass,
  Review as ReviewClass,
  User as UserClass
} from "../parseClasses";

const SubmitReview = (props) => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [songRating, setRating] = useState("");
  const [songReview, setReview] = useState("");
  const [reviewPosted, setReviewPosted] = useState(false);

  useEffect(() => {
    (async () => {
      let songQuery = await new Parse.Query(SongClass).get(props.songId);
      songQuery = songQuery.toJSON();
      let artistQuery = await new Parse.Query(UserClass)
        .get(songQuery.artist.objectId);
      artistQuery = artistQuery.toJSON();

      setSong(songQuery.name);
      setArtist(artistQuery.name);
    })();
  }, [
    props.songId, // eslint-disable-line react/destructuring-assignment
    song,
    artist
  ]);

  const saveReview = async () => {
    const review = new ReviewClass();
    const songQuery = await new Parse.Query(SongClass).get(props.songId);

    review.set("author", props.currentUser.toPointer());
    review.set("song", songQuery.toPointer());
    review.set("rating", parseFloat(songRating));
    review.set("review", songReview);

    try {
      await review.save();

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
      <h2>Review: {song} by {artist}</h2>
      <form name="reviewForm" onSubmit={handleSubmit}>
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
          disabled={songRating === "" || songReview === ""}
          type="submit"
          value="Submit Review"
        />
      </form>
      {reviewPosted && <div>Review posted successfully!</div>}
    </div>
  );
};

SubmitReview.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
  songId: PropTypes.string.isRequired
};

export default SubmitReview;
