import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

const LogIn = (props) => {
  const {register, handleSubmit, reset, errors} = useForm();
  const {
    errorMsg: errorMsgFromParse
  } = props;

  const onSubmit = (data) => {
    const {logInUsername, logInPassword} = data;

    props.handleLogIn(logInUsername, logInPassword);
    reset();
  };

  return (
    <div>
      <h3>Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="logInUsername">
            Username:
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
            Password:
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
      {errorMsgFromParse !== "" && <p>{errorMsgFromParse}</p>}
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
