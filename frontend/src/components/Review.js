import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const Review = (props) => {
  const {artistName, song, authorId, authorName, rating, review} = props;

  return (
    <>
      {artistName !== null
        && song !== null
        && authorId !== null
        && authorName !== null
        && rating !== null
        && review !== null
        && (
          <div className="review">
            <h3>{song}</h3>
            <p>Artist: {artistName}</p>
            <p>By: <Link to={`/user/${authorId}`}>{authorName}</Link></p>
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
  authorId: PropTypes.string,
  authorName: PropTypes.string,
  rating: PropTypes.number,
  review: PropTypes.string
};

Review.defaultProps = {
  artistName: null,
  song: null,
  authorId: null,
  authorName: null,
  rating: null,
  review: null
};

export default Review;
