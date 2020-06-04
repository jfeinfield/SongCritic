import React, {useState} from "react";
import Parse from "parse";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  NavLink
} from "react-router-dom";

import {Artist as ArtistClass} from "./parseClasses";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import RecentReviews from "./components/RecentReviews";
import SubmitSong from "./components/SubmitSong";
import Search from "./components/Search";
import SongPage from "./components/SongPage";
import UserPage from "./components/UserPage";
import SongDir from "./components/SongDir";
import ArtistDir from "./components/ArtistDir";
import TopSongs from "./components/TopSongs";

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
        <div className="container d-flex justify-content-between">
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
                exact
                to="/"
              >
                Home
              </NavLink>
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
              <NavLink
                className="nav-item nav-link"
                activeClassName="active"
                to="/topSongs"
              >
                Top Rated
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                activeClassName="active"
                to="/search"
              >
                Search
              </NavLink>
            </div>
          </div>
          {currentUser ? (
            <div className="navbar-nav">
              {currentUser && (
                <NavLink
                  className="nav-item nav-link mr-3"
                  activeClassName="active"
                  to={`/user/${currentUser.id}`}
                >
                  {currentUser.get("name")}
                </NavLink>
              )}
              <button
                className="btn btn-secondary"
                onClick={logOut}
                type="button"
              >
                Log Out
              </button>
            </div>
          ) : (
            <NavLink
              className="nav-item nav-link"
              to="/auth"
            >
              Log In / Sign Up
            </NavLink>
          )}
        </div>
      </nav>
      <div>
        {logOutErrorMsg !== "" && <p>{logOutErrorMsg}</p>}
      </div>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <>
              {!currentUser && (
                <div className="jumbotron">
                  <h1 className="display-4">
                    Welcome to our music community!
                  </h1>
                  <p className="lead">
                    Song Critic is the desination for music lovers and creators
                    to connect with other artists and listeners.
                  </p>
                  <p>
                    Browse the latest reviews below, see our community&apos;s
                    top songs using the <em>Top Rated</em> link above, or browse
                    all songs using the <em>Songs</em> or <em>Search</em> links
                    above.
                  </p>
                  <p>
                    <strong>Create an account</strong> or log in using the link
                    in the upper right-hand corner
                    <strong> to post your own songs and reviews!</strong>
                  </p>
                </div>
              )}
              {currentUser && !currentUser.get("isArtist") && (
                <div className="jumbotron">
                  <h1 className="display-4">
                    Hello, {currentUser.get("name")}!
                  </h1>
                  <p className="lead">
                    Browse the latest reviews below, see our community&apos;s
                    top songs using the <em>Top Rated</em> link above, or browse
                    all songs using the <em>Songs</em> or <em>Search</em> links
                    above and vist any song&apos;s page to write your own
                    review!
                  </p>
                </div>
              )}
              {currentUser && currentUser.get("isArtist") && (
                <>
                  <div className="jumbotron">
                    <h1 className="display-4">
                      Hello, {currentUser.get("name")}!
                    </h1>
                    <p className="lead">
                      Post one of your songs for the community to review below,
                      or vist any song&apos;s page to write your own review!
                    </p>
                  </div>
                  <SubmitSong currentUser={currentUser} />
                </>
              )}
              <RecentReviews currentUser={currentUser}/>
            </>
          </Route>
          <Route path="/auth">
            {currentUser ? (
              <Redirect to="/" />
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <LogIn
                    handleLogIn={logIn}
                    errorMsg={logInErrorMsg}
                  />
                </div>
                <div className="col-md-6">
                  <SignUp
                    handleSignUp={signUp}
                    errorMsg={signUpErrorMsg}
                  />
                </div>
              </div>
            )}
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
          <Route path="/topSongs">
            <TopSongs />
          </Route>
          <Route path="/search">
            <Search />
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
