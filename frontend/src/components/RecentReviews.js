import React, {useState, useEffect} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";

import {
  Review as ReviewClass,
  Song as SongClass,
  User as UserClass
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
      const results = resultsWithPointers.map(async (r) => {
        const {
          objectId,
          author: {objectId: authorId},
          song: {objectId: songId},
          review: ReviewText,
          rating
        } = r.toJSON();

        let song = await new Parse.Query(SongClass).get(songId);
        song = song.toJSON();
        const userQuery = new Parse.Query(UserClass);
        let author = await userQuery.get(authorId);
        const aId = author.id;
        author = author.toJSON();
        let artist = await userQuery.get(song.artist.objectId);
        artist = artist.toJSON();

        const review = {objectId, review: ReviewText, rating};
        review.authorId = aId;
        review.author = author.name;
        review.song = song.name;
        review.songId = songId;
        review.artist = artist.name;
        return review;
      });

      setRecentReviews(await Promise.all(results));
    })();
  },[]);

  return (
    <div>
      <h2>Recent Reviews</h2>
      {recentReviews.map((r) => (
        <div key={r.objectId}>
          <Review
            artistName={r.artist}
            song={r.song}
            authorId={r.authorId}
            authorName={r.author}
            rating={r.rating}
            review={r.review}
          />
          <Link to={`/song/${r.songId}`}>Visit song page for {r.song}</Link>
        </div>
      ))}
    </div>
  );
};

export default RecentReviews;
