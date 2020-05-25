import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useParams, Redirect} from "react-router-dom";
import Parse from "parse";

import {
  Song as SongClass,
  User as UserClass,
  Review as ReviewClass} from "../parseClasses";
import SubmitReview from "./SubmitReview";
import UpdateSong from "./UpdateSong";

const SongPage = (props) => {
  const {currentUser} = props;
  const {songId} = useParams();
  const [reviews, setReviews] = useState([]);
  const [songName, setSongName] = useState("");
  const [songArt, setSongArt] = useState("");
  const [artistName, setArtistName] = useState("");
  const [fetchingSong, setFetchingSong] = useState(true);
  const [foundSong, setFoundSong] = useState(false);
  const [foundArt, setFoundArt] = useState(false);
  const [isCurrentUserTheArtist, setIsCurrentUserTheArtist] = useState(false);

  useEffect(() => {
    (async () => {
      const songQuery = new Parse.Query(SongClass);

      try {
        const song = await songQuery.get(songId);
        setSongName(song.get("name"));
        setSongArt(song.get("art"));

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
        setFoundSong(true);
        setFoundArt(true);
        setFetchingSong(false);
      } catch {
        // error while fetching data -> navigate to 404 page
        setFoundSong(false);
        setFoundArt(false);
        setFetchingSong(false);
      }
    })();
  }, [songId]);

  useEffect(() => {
    (async () => {
      const songQuery = new Parse.Query(SongClass);

      try {
        const song = await songQuery.get(songId);
        setIsCurrentUserTheArtist(
          currentUser.toPointer().objectId === song.get("artist").id
        );
      } catch {
        // TODO: handle error
      }
    })();
  }, [songId, currentUser]);

  return (
    <div>
      {!fetchingSong && !foundSong && <Redirect to="/404" />}
      {fetchingSong
        ? <p>Loading song and reviews...</p>
        : <>
          <h2>{songName}</h2>
          {foundArt && songArt !== "" && <img src={songArt}
            height="250"
            width="270"
          />}
          <br />
          <strong>by: {artistName}</strong>
          {isCurrentUserTheArtist
            && <UpdateSong
              songId={songId}
              songName={songName}
              songArt={songArt}
            />
          }
          {currentUser
            ? <SubmitReview currentUser={currentUser} songId={songId} />
            : <div>
              <h3>Write a Review</h3>
              <p>Must be signed in to write a review</p>
            </div>
          }
          <section>
            <h3>Reviews</h3>
            {reviews.length !== 0
              ? <>
                {reviews.map((r) => (
                  <div key={r.objectId}>
                    <h4>{r.author}</h4>
                    <p>{r.rating} stars</p>
                    <p>{r.review}</p>
                    <p />
                  </div>
                ))}
              </>
              : <p>Be the first to write a review!</p>
            }
          </section>
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
