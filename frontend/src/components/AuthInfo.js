import React from "react";
import PropTypes from "prop-types";

const AuthInfo = (props) => {
  const {currentUser, errorMsg} = props;
  return (
    <div>
      <h3>Info</h3>
      <p>Username: {currentUser ? currentUser.getUsername() : "n/a"}</p>
      <p>Display Name: {currentUser ? currentUser.get("name") : "n/a"}</p>
      <p>Is an artist: {currentUser ?
        (currentUser.get("isArtist") && "Yes" || "No") : "n/a"}</p>
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
  );
};

AuthInfo.propTypes = {
  currentUser: PropTypes.shape({
    authenticated: PropTypes.func,
    getSessionToken: PropTypes.func,
    getUsername: PropTypes.func,
    get: PropTypes.func
  }),
  errorMsg: PropTypes.string.isRequired
};

AuthInfo.defaultProps = {
  currentUser: null
};

export default AuthInfo;
