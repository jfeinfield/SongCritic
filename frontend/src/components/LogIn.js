import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

const LogIn = (props) => {
  const {register, handleSubmit, errors} = useForm();
  const {
    errorMsg: errorMsgFromParse
  } = props;

  const onSubmit = (data) => {
    const {logInUsername, logInPassword} = data;

    props.handleLogIn(logInUsername, logInPassword);
  };

  return (
    <div className="mb-5">
      <h3>Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="logInUsername">
            Username (required):
            <input
              className={
                `form-control \
                ${errors.logInUsername ? "is-invalid" : ""}`
              }
              type="text"
              id="logInUsername"
              name="logInUsername"
              ref={register({required: true, minLength: 4})}
            />
            {errors.logInUsername?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
            {errors.logInUsername?.type === "minLength" && (
              <div className="invalid-feedback">
                This field must contain at least 4 characters
              </div>
            )}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="logInPassword">
            Password (required):
            <input
              className={
                `form-control \
                ${errors.logInPassword ? "is-invalid" : ""}`
              }
              type="password"
              id="logInPassword"
              name="logInPassword"
              ref={register({required: true, minLength: 4})}
            />
            {errors.logInPassword?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
            {errors.logInPassword?.type === "minLength" && (
              <div className="invalid-feedback">
                This field must contain at least 4 characters
              </div>
            )}
          </label>
        </div>
        <input
          className="btn btn-primary"
          type="submit"
          value="Log In"
        />
      </form>
      {errorMsgFromParse !== "" && (
        <p className="text-danger mt-3">
          <strong>Error {errorMsgFromParse.split(" ")[0]}</strong><br />
          {errorMsgFromParse.split(" ").slice(1).join(" ")}
        </p>
      )}
    </div>
  );
};

LogIn.propTypes = {
  handleLogIn: PropTypes.func.isRequired,
  errorMsg: PropTypes.string
};

LogIn.defaultProps = {
  errorMsg: ""
};

export default LogIn;
