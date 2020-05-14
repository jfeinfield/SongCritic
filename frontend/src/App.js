import React, {useState} from "react";
import Parse from "parse";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import {Artist as ArtistClass} from "./parseClasses";
import AuthInfo from "./components/AuthInfo";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ArtistList from "./components/ArtistList";
import SubmitReview from "./components/SubmitReview";
import RecentReviews from "./components/RecentReviews";
import SubmitSong from "./components/SubmitSong";
import Search from "./components/Search";
import SongPage from "./components/SongPage";


function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  const [currentUser, setCurrentUser] = useState(Parse.User.current());
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = async (isArtist, displayName, username, password) => {
    const user = new Parse.User();

    user.set("isArtist", isArtist);
    user.set("name", displayName);
    user.set("username", username);
    user.set("password", password);

    try {
      setCurrentUser(await user.signUp());
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(`${error.code} ${error.message}`);
      return;
    }

    if (isArtist) {
      const artist = new ArtistClass();

      artist.set("user", user.toPointer());

      try {
        await artist.save();
      } catch (error) {
        setErrorMsg(`${error.code} ${error.message}`);
      }
    }
  };

  const logIn = async (username, password) => {
    try {
      setCurrentUser(await Parse.User.logIn(username, password));
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(`${error.code} ${error.message}`);
    }
  };

  const logOut = async () => {
    try {
      await Parse.User.logOut(currentUser);
      setCurrentUser(null);
    } catch (error) {
      setErrorMsg(`${error.code} ${error.message}`);
    }
  };

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/song/songId">SongPage</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/song/:songId">
          <SongPage />
        </Route>
        <Route path="/">
          <div style={{width: "80vw", margin: "0 auto"}}>
            <h1>Song Critic</h1>
            <h2>Authentication</h2>
            <AuthInfo currentUser={currentUser} errorMsg={errorMsg}/>
            {currentUser
              ? <>
                <button
                  type="button"
                  onClick={logOut}
                >
                  Log Out
                </button>
                <SubmitReview currentUser={currentUser} songId="lvdeaaILDE" />
                {currentUser.get("isArtist")
                  && <SubmitSong currentUser={currentUser} />}
                <Search />
                <ArtistList />
                <RecentReviews />
              </>
              : <>
                <SignUp handleSignUp={signUp} />
                <LogIn handleLogIn={logIn} />
              </>
            }
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
