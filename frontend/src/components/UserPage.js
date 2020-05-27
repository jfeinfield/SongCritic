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
        ? <p>Loading user page...</p>
        : <>
          <h1>{username}</h1>
          {isArtist && <section>
            <h2>Songs</h2>
            {songs.length !== 0
              ? <>
                {songs.map((song) => (
                  <p key={song.objectId}>
                    <Link to={`/song/${song.objectId}`}>{song.name}</Link>
                  </p>
                ))}
              </>
              : <>
                {personalPage
                  ? <p>You have not posted any songs yet.</p>
                  : <p>{username} has not posted any songs yet.</p>
                }
              </>
            }
          </section>}
          <section>
            <h2>Reviews</h2>
            {reviews.length !== 0
              ? <>
                {reviews.map((r) => (
                  <Review key={r} reviewId={r} showLinkToSong />
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
