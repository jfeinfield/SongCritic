import React, {useState} from "react";
import PropTypes from "prop-types";

const LogIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleLogIn(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h3>Log In</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="logInUsername">
          Username:
          <input
            type="text"
            id="logInUsername"
            name="logInUsername"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="logInPassword">
          Password:
          <input
            type="password"
            id="logInPassword"
            name="logInPassword"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input
          disabled={username === "" || password === ""}
          type="submit"
          value="Log In"
        />
      </form>
    </div>
  );
};

LogIn.propTypes = {
  handleLogIn: PropTypes.func.isRequired
};

export default LogIn;
