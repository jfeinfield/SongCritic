import React, { useState, useEffect } from 'react';
import Parse from 'parse';

import Review from "./Review";

const RecentReviews = () => {
  const numReviews = 5;
  const[recentReviews, setRecentReviews] = useState([]);

  useEffect(() => {
    (async () => {
      const query = new Parse.Query(Parse.Object.extend("review"));
      query.limit(numReviews).addDescending("createdAt").exists("review");
  
      const results = await query.find();
  
      setRecentReviews(results.map((r) => {
        let review = r.toJSON();
        review.id = r.id;
        return review;
      }));
    })();
  },[]);

  return (
    <div>
      <h2>Recent Reviews</h2>
      {recentReviews.map((reviews) => {
        return (
          <Review 
            key={reviews.id}
            artist={reviews.artist}
            song={reviews.song}
            userId={reviews.userId}
            rating={reviews.rating}
            review={reviews.review}
          />
      )})}
    </div>
  )
}

export default RecentReviews;