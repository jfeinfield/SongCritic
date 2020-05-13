import React, {useState} from "react";
import PropTypes from "prop-types";

const SignUp = (props) => {
  const [isArtist, setIsArtist] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSignUp(isArtist, displayName, username, password);
    setIsArtist(false);
    setDisplayName("");
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="signUpIsArtist">
          I am an artist
          <input
            type="checkbox"
            id="signUpIsArtist"
            name="signUpIsArtist"
            checked={isArtist}
            onChange={() => setIsArtist(!isArtist)}
          />
        </label>
        <br />
        <label htmlFor="signUpDisplayName">
          Display Name:
          <input
            type="text"
            id="signUpDisplayName"
            name="signUpDisplayName"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="signUpUsername">
          Username:
          <input
            type="text"
            id="signUpUsername"
            name="signUpUsername"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="signUpPassword">
          Password:
          <input
            type="password"
            id="signUpPassword"
            name="signUpPassword"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input
          disabled={displayName === "" || username === "" || password === ""}
          type="submit"
          value="Sign Up"
        />
      </form>
    </div>
  );
};

SignUp.propTypes = {
  handleSignUp: PropTypes.func.isRequired
};

export default SignUp;
