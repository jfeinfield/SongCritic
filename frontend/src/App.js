import React, {useState} from "react";
import Parse from "parse";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";

import {Artist as ArtistClass} from "./parseClasses";
import AuthInfo from "./components/AuthInfo";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import RecentReviews from "./components/RecentReviews";
import SubmitSong from "./components/SubmitSong";
import Search from "./components/Search";
import SongPage from "./components/SongPage";
import UserPage from "./components/UserPage";
import SongDir from "./components/SongDir";
import ArtistDir from "./components/ArtistDir";

function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  const [currentUser, setCurrentUser] = useState(Parse.User.current());
  const [signUpErrorMsg, setSignUpErrorMsg] = useState("");
  const [logInErrorMsg, setLogInErrorMsg] = useState("");
  const [logOutErrorMsg, setLogOutErrorMsg] = useState("");

  const signUp = async (isArtist, displayName, username, password) => {
    const user = new Parse.User();

    user.set("isArtist", isArtist);
    user.set("name", displayName);
    user.set("username", username);
    user.set("password", password);

    try {
      setCurrentUser(await user.signUp());
      setSignUpErrorMsg("");
    } catch (error) {
      setSignUpErrorMsg(`${error.code} ${error.message}`);
      return;
    }

    if (isArtist) {
      const artist = new ArtistClass();

      artist.set("user", user.toPointer());

      try {
        await artist.save();
      } catch (error) {
        setSignUpErrorMsg(`${error.code} ${error.message}`);
      }
    }
  };

  const logIn = async (username, password) => {
    try {
      setCurrentUser(await Parse.User.logIn(username, password));
      setLogInErrorMsg("");
    } catch (error) {
      setLogInErrorMsg(`${error.code} ${error.message}`);
    }
  };

  const logOut = async () => {
    try {
      await Parse.User.logOut(currentUser);
      setCurrentUser(null);
    } catch (error) {
      setLogOutErrorMsg(`${error.code} ${error.message}`);
    }
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">Song Critic</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink
                className="nav-item nav-link"
                activeClassName="active"
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                to="/auth"
              >
                Authentication
              </NavLink>
              {currentUser && (
                <NavLink
                  className="nav-item nav-link"
                  activeClassName="active"
                  to={`/user/${currentUser.id}`}
                >
                  Account
                </NavLink>
              )}
              <NavLink
                className="nav-item nav-link"
                activeClassName="active"
                to="/artists"
              >
                Artists
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                activeClassName="active"
                to="/songs"
              >
                Songs
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <>
              <Search />
              {currentUser && currentUser.get("isArtist")
                    && <SubmitSong currentUser={currentUser} />}
              <RecentReviews currentUser={currentUser}/>
            </>
          </Route>
          <Route path="/auth">
            <>
              <h2>Authentication</h2>
              <AuthInfo currentUser={currentUser}/>
              {currentUser
                ? <>
                  <button
                    type="button"
                    onClick={logOut}
                  >
                    Log Out
                  </button>
                  {logOutErrorMsg !== "" && <p>{logOutErrorMsg}</p>}
                </>
                : <>
                  <SignUp
                    handleSignUp={signUp}
                    errorMsg={signUpErrorMsg}
                  />
                  <LogIn
                    handleLogIn={logIn}
                    errorMsg={logInErrorMsg}
                  />
                </>
              }
            </>
          </Route>
          <Route path="/song/:songId">
            <SongPage currentUser={currentUser} />
          </Route>
          <Route path="/user/:userId">
            <UserPage currentUser={currentUser} />
          </Route>
          <Route path="/songs">
            <SongDir />
          </Route>
          <Route path="/artists">
            <ArtistDir />
          </Route>
          <Route path="*">
            <h2>404 - Page not found!</h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
