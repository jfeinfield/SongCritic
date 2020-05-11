import React, {useState} from "react";
import Parse from "parse";

import AuthInfo from "./components/AuthInfo";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import AddItem from "./components/AddItem";
import ArtistList from "./components/ArtistList";
import SubmitReview from "./components/SubmitReview";
import RecentReviews from "./components/RecentReviews";
import UploadSong from "./components/UploadSong";
import Search from "./components/Search";

function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  const [currentUser, setCurrentUser] = useState(Parse.User.current());
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = async (username, password) => {
    const user = new Parse.User();

    user.set("username", username);
    user.set("password", password);

    try {
      setCurrentUser(await user.signUp());
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(`${error.code} ${error.message}`);
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
    <div style={{width: "80vw", margin: "0 auto"}}>
      <h1>Song Critic</h1>
      <section>
        <h2>Authentication</h2>
        <AuthInfo currentUser={currentUser} errorMsg={errorMsg}/>
        <SignUp handleSignUp={signUp} />
        <LogIn handleLogIn={logIn} />
        <button
          disabled={!currentUser}
          type="button"
          onClick={logOut}
        >
          Log Out
        </button>
      </section>
      {currentUser && <AddItem currentUser={currentUser} />}
      {currentUser && <SubmitReview currentUser={currentUser} />}
      {currentUser && <UploadSong currentUser={currentUser} />}
      <ArtistList />
      <RecentReviews />
      <Search />
    </div>
  );
}

export default App;
