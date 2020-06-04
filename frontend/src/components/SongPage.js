import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {useParams, Redirect, Link} from "react-router-dom";
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
  const [artistId, setArtistId] = useState("");
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
        setArtistId(artist.id);
        setArtistName(artist.get("name"));

        const reviewQuery = new Parse.Query(ReviewClass);
        reviewQuery.equalTo(
          "song",
          {
            "__type": "Pointer",
            "className": "song",
            "objectId": songId
          }
        );
        reviewQuery.addDescending("updatedAt");
        const reviewArray = await reviewQuery.find();

        const results = reviewArray.map((r) => r.toJSON().objectId);

        setReviews(await results);
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
          currentUser !== null &&
            currentUser.toPointer().objectId === song.get("artist").id
        );
      } catch {
        setFoundSong(false);
        setFetchingSong(false);
      }
    })();
  }, [songId, currentUser]);

  const updateReviewsState = async (objectId) => {
    setReviews([objectId].concat(reviews));
  };

  const updateSongState = (newSongName, newSongArt) => {
    setSongName(newSongName);
    setSongArt(newSongArt);
  };

  return (
    <div>
      {!fetchingSong && !foundSong && <Redirect to="/404" />}
      {fetchingSong
        ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading song {songId} and its reviews...</p>
          </div>
        )
        : <>
          <div className="mb-5">
            <h2>{songName}</h2>
            <p>
              <strong>
                by: <Link to={`/user/${artistId}`}>{artistName}</Link>
              </strong>
            </p>
            {foundArt && songArt !== "" && (
              <div className="my-3">
                <img
                  alt="The artist's specified album art could not be displayed."
                  className="img-thumbnail"
                  height="256"
                  src={songArt}
                  title={`Album art for ${songName}`}
                  width="256"
                />
              </div>
            )}
          </div>
          {isCurrentUserTheArtist
            && <UpdateSong
              songId={songId}
              songName={songName}
              songArt={songArt}
              handleSongUpdate={updateSongState}
            />
          }
          <SubmitReview
            currentUser={currentUser}
            songId={songId}
            handleSubmitReview={updateReviewsState}
          />
          <section className="mb-5">
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
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  })
};

SongPage.defaultProps = {
  currentUser: null
};

export default SongPage;
