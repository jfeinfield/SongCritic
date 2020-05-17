import React, {useState} from "react";
import Parse from "parse";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

import {Artist as ArtistClass} from "./parseClasses";
import AuthInfo from "./components/AuthInfo";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ArtistList from "./components/ArtistList";
import RecentReviews from "./components/RecentReviews";
import SubmitSong from "./components/SubmitSong";
import Search from "./components/Search";
import SongPage from "./components/SongPage";

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
      <div style={{width: "80vw", margin: "0 auto"}}>
        <h1>Song Critic</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/auth">Authentication</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/">
            <>
              <Search />
              {currentUser && currentUser.get("isArtist")
                    && <SubmitSong currentUser={currentUser} />}
              <ArtistList />
              <RecentReviews />
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
          <Route path="*">
            <h2>404 - Page not found!</h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
