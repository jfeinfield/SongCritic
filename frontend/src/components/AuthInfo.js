import React from "react";
import PropTypes from "prop-types";

const AuthInfo = (props) => {
  const {currentUser} = props;
  return (
    <div>
      <h3>Info</h3>
      <p>Username: {currentUser ? currentUser.getUsername() : "n/a"}</p>
      <p>Display Name: {currentUser ? currentUser.get("name") : "n/a"}</p>
      {currentUser
        ? <p>Is an artist: {(currentUser.get("isArtist") ? "Yes" : "No")}</p>
        : <p>Is an artist: n/a</p>}
      <p>
        Session Token: {currentUser ? currentUser.getSessionToken() : "n/a"}
      </p>
      <p>
        Authenticated: {
          currentUser && currentUser.authenticated() ? "Yes" : "No"
        }
      </p>
    </div>
  );
};

AuthInfo.propTypes = {
  currentUser: PropTypes.shape({
    authenticated: PropTypes.func,
    getSessionToken: PropTypes.func,
    getUsername: PropTypes.func,
    get: PropTypes.func
  })
};

AuthInfo.defaultProps = {
  currentUser: null
};

export default AuthInfo;
