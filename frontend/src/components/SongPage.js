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
import Review from "./Review";

const SongPage = (props) => {
  const {currentUser} = props;
  const {songId} = useParams();
  const [reviews, setReviews] = useState([]);
  const [songName, setSongName] = useState("");
  const [songArt, setSongArt] = useState("");
  const [artistName, setArtistName] = useState("");
  const [fetchingSong, setFetchingSong] = useState(true);
  const [foundSong, setFoundSong] = useState(false);
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

        const results = reviewArray.map((r) => r.toJSON().objectId);

        setReviews(await results);
        setFoundSong(true);
        setFetchingSong(false);
      } catch {
        // error while fetching data -> navigate to 404 page
        setFoundSong(false);
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
          <strong>by: {artistName}</strong>
          {isCurrentUserTheArtist
            && <UpdateSong
              songId={songId}
              songName={songName}
              songArt={songArt}
            />
          }
          <SubmitReview currentUser={currentUser} songId={songId} />
          <section>
            <h3>Reviews</h3>
            {reviews.length !== 0
              ? <>
                {reviews.map((r) => (
                  <Review
                    key={r}
                    currentUser={currentUser}
                    reviewId={r}
                    isListing
                  />
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
