import React from "react";
import PropTypes from "prop-types";

const Review = (props) => {
  const {artist, song, userId, rating, review} = props;
  return (
    <>
      {artist !== null
        && song !== null
        && userId !== null
        && rating !== null
        && review !== null
        && (
          <div className="review">
            <h3>{song}</h3>
            <p>Artist: {artist}</p>
            <p>By user: {userId}</p>
            <p>Rating: {rating}</p>
            <p>Review: {review}</p>
          </div>
        )}
    </>
  );
};

Review.propTypes = {
  artist: PropTypes.string,
  song: PropTypes.string,
  userId: PropTypes.string,
  rating: PropTypes.number,
  review: PropTypes.string
};

Review.defaultProps = {
  artist: null,
  song: null,
  userId: null,
  rating: null,
  review: null
};

export default Review;
