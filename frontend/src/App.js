import React, {useState} from 'react';
import Parse from 'parse';

import AuthInfo from "./components/AuthInfo";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import AddItem from "./AddItem";
import ArtistList from "./ArtistList";
import SubmitReview from "./SubmitReview";
import RecentReviews from "./RecentReviews";

import './App.css';

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
      await user.signUp();
      setCurrentUser(user);
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
      await Parse.User.logOut(currentUser)
      setCurrentUser(null);
    } catch (error) {
      setErrorMsg(`${error.code} ${error.message}`);
    }
  };

  return (
    <div style={{width: "80vw", margin: "0 auto"}}>
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
      <AddItem />
      <ArtistList />
      <SubmitReview userId={1} />
      <RecentReviews />
    </div>
  );
}

export default App;
