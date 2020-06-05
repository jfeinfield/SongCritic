import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Parse from "parse";

import {
  Review as ReviewClass,
} from "../parseClasses";
import Review from "./Review";

const RecentReviews = (props) => {
  const numReviews = 5;
  const {currentUser} = props;
  const [recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const query = new Parse.Query(ReviewClass);
      query.limit(numReviews).addDescending("createdAt").exists("review");

      const resultsWithPointers = await query.find();
      const results = resultsWithPointers.map((r) => r.toJSON().objectId);

      setRecentReviews(results);
    })();
  }, []);

  return (
    <div className="mb-5">
      <h2>Recent Reviews</h2>
      {recentReviews.map((r) => (
        <Review
          key={r}
          currentUser={currentUser}
          reviewId={r}
        />
      ))}
    </div>
  );
};

RecentReviews.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string
  })
};

RecentReviews.defaultProps = {
  currentUser: null
};

export default RecentReviews;
