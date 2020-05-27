import React, {useState, useEffect} from "react";
import Parse from "parse";

import {
  Review as ReviewClass,
} from "../parseClasses";
import Review from "./Review";

const RecentReviews = () => {
  const numReviews = 5;
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
    <div>
      <h2>Recent Reviews</h2>
      {recentReviews.map((r) => (
        <Review key={r} reviewId={r} showLinkToSong />
      ))}
    </div>
  );
};

export default RecentReviews;
