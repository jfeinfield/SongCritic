import React, {useState} from "react";
import Parse from "parse";

import SignUp from "./SignUp";
import LogIn from "./LogIn";

const Authentication = () => {
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
    <div>
      <h2>Authentication</h2>
      <div>
        <h3>Info</h3>
        <p>Username: {currentUser ? currentUser.getUsername() : "n/a"}</p>
        <p>
          Session Token: {currentUser ? currentUser.getSessionToken() : "n/a"}
        </p>
        <p>
          Authenticated: {
            currentUser && currentUser.authenticated() ? "Yes" : "No"
          }
        </p>
        {errorMsg !== "" && <p>Error: {errorMsg}</p>}
      </div>
      <SignUp handleSignUp={signUp} />
      <LogIn handleLogIn={logIn} />
      <button
        disabled={!currentUser}
        type="button"
        onClick={logOut}
      >
        Log Out
      </button>
    </div>
  );
};

export default Authentication;
