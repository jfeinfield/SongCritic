import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useParams, Link} from "react-router-dom";
import Parse from "parse";
import {
  Song as SongClass,
  User as UserClass,
  Review as ReviewClass} from "../parseClasses";
import SubmitReview from "./SubmitReview";

const SongPage = (props) => {
  const {currentUser} = props;
  const {songId} = useParams();
  const [reviews, setReviews] = useState([]);
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songIdFound, setSongIdFound] = useState(true);

  useEffect(() => {
    (async () => {
      let found = true;
      const songQuery = new Parse.Query(SongClass);

      const song = await songQuery.get(songId).catch(() => {
        found = false;
        setSongIdFound(false);
      });

      if(found) {
        setSongName(song.get("name"));

        const artistQuery = new Parse.Query(UserClass);
        const artist = await artistQuery.get(song.get("artist").id);

        setArtistName(artist.get("name"));

        const reviewQuery = new Parse.Query(ReviewClass);
        reviewQuery.equalTo("song",
          {"__type": "Pointer", "className": "song", "objectId": songId});
        const reviewArray = await reviewQuery.find();

        const results = reviewArray.map(async (r) => {
          const {
            objectId,
            author: {objectId: authorId},
            review: ReviewText,
            rating
          } = r.toJSON();

          const userQuery = new Parse.Query(UserClass);
          let author = await userQuery.get(authorId);
          author = author.toJSON();

          const review = {objectId, review: ReviewText, rating};
          review.author = author.name;

          return review;
        });

        setReviews(await Promise.all(results));
      }
    })();
  }, [songId]);

  return (
    <div>
      {songIdFound
        ? <>
          <h1>{songName}</h1>
          <h3>By: {artistName}</h3>
          {currentUser
            ? <>
              <SubmitReview currentUser={currentUser} songId={songId} />
            </>
            :<>
              <h4>Write a Review</h4>
              <p>Must be signed in to write a review</p>
            </>
          }
          <h4>Reviews</h4>
          {reviews.length !== 0
            ? <>
              {reviews.map((r) => (
                <div key={r.objectId}>
                  <h5>{r.author}</h5>
                  <p>{r.rating} stars</p>
                  <p>{r.review}</p>
                  <p />
                </div>
              ))}
            </>
            : <>
              <p>Be the first to write a review!</p>
            </>
          }
        </>
        : <>
          <p>Error: Page not found. Go back <Link to="/">home</Link>.</p>
        </>
      }
    </div>
  );
};

SongPage.propTypes = {
  currentUser: PropTypes.instanceOf(Parse.User)
};

SongPage.defaultProps = {
  currentUser: null
};

export default SongPage;
