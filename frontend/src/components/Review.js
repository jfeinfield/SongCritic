import React from "react";
import PropTypes from "prop-types";

const Review = (props) => {
  const {artistName, song, authorName, rating, review} = props;
  return (
    <>
      {artistName !== null
        && song !== null
        && authorName !== null
        && rating !== null
        && review !== null
        && (
          <div className="review">
            <h3>{song}</h3>
            <p>Artist: {artistName}</p>
            <p>By: {authorName}</p>
            <p>Rating: {rating}</p>
            <p>Review: {review}</p>
          </div>
        )}
    </>
  );
};

Review.propTypes = {
  artistName: PropTypes.string,
  song: PropTypes.string,
  authorName: PropTypes.string,
  rating: PropTypes.number,
  review: PropTypes.string
};

Review.defaultProps = {
  artistName: null,
  song: null,
  authorName: null,
  rating: null,
  review: null
};

export default Review;
