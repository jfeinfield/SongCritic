import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useParams, Redirect, Link} from "react-router-dom";
import Parse from "parse";
import {
  Song as SongClass,
  User as UserClass,
  Review as ReviewClass} from "../parseClasses";
import Review from "./Review";

const UserPage = (props) => {
  const {userId} = useParams();
  const {currentUser} = props;
  const [username, setUsername] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [songs, setSongs] = useState([]);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [foundUser, setFoundUser] = useState(false);
  const [personalPage, setPersonalPage] = useState(false);

  useEffect(() => {
    (async () => {
      const userQuery = new Parse.Query(UserClass);
      try {
        const user = await userQuery.get(userId);
        setUsername(user.get("name"));
        setIsArtist(user.get("isArtist"));

        if (user.get("isArtist")) {
          setIsArtist(true);
          const songQuery = new Parse.Query(SongClass);
          songQuery.addDescending("name").equalTo("artist",
            {"__type": "Pointer", "className":"_User", "objectId": userId});
          const songArray = await songQuery.find();
          setSongs(songArray.map((s) => s.toJSON()));
        }

        const reviewQuery = new Parse.Query(ReviewClass);
        reviewQuery.equalTo("author",
          {"__type": "Pointer", "className": "_User", "objectId": userId});
        const reviewArray = await reviewQuery.find();
        const results = reviewArray.map((r) => r.toJSON().objectId);

        setReviews(await results);
        setFoundUser(true);
        setFetchingUser(false);
      } catch (error){
        setFetchingUser(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if(currentUser && currentUser.id === userId){
      setPersonalPage(true);
    }
  }, [userId, currentUser]);

  return (
    <div>
      {!fetchingUser && !foundUser && <Redirect to="/404" />}
      {fetchingUser
        ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading page for user {userId}...</p>
          </div>
        ) : (
          <>
            <h2>{username}</h2>
            {isArtist && (
              <section className="mb-5">
                <h2>Songs</h2>
                {songs.length !== 0
                  ? (
                    <ul className="list-group">
                      {songs.map((song) => (
                        <Link
                          key={song.objectId}
                          className="list-group-item list-group-item-action"
                          to={`/song/${song.objectId}`}
                        >
                          {song.name}
                        </Link>
                      ))}
                    </ul>
                  )
                  : (
                    <>
                      {personalPage
                        ? <p>You have not posted any songs yet.</p>
                        : <p>{username} has not posted any songs yet.</p>
                      }
                    </>
                  )
                }
              </section>
            )}
            <section className="mb-5">
              <h2>Reviews</h2>
              {reviews.length !== 0
                ? <>
                  {reviews.map((r) => (
                    <Review
                      key={r}
                      currentUser={currentUser}
                      reviewId={r}
                      hideUser
                    />
                  ))}
                </>
                : <>
                  {personalPage
                    ? <p>You have not written any reviews yet.</p>
                    : <p>{username} has not written any reviews yet.</p>
                  }
                </>
              }
            </section>
          </>
        )
      }
    </div>
  );
};

UserPage.propTypes = {
  currentUser: PropTypes.instanceOf(Parse.User)
};

UserPage.defaultProps = {
  currentUser: null
};

export default UserPage;
