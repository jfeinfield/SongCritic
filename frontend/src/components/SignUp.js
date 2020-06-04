import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

const SignUp = (props) => {
  const {register, handleSubmit, errors} = useForm();
  const {
    errorMsg: errorMsgFromParse
  } = props;

  const onSubmit = (data) => {
    const {
      signUpIsArtist,
      signUpDisplayName,
      signUpUsername,
      signUpPassword
    } = data;

    props.handleSignUp(
      signUpIsArtist,
      signUpDisplayName,
      signUpUsername,
      signUpPassword
    );
  };

  return (
    <div className="mb-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="signUpIsArtist"
            name="signUpIsArtist"
            ref={register()}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="form-check-label" htmlFor="signUpIsArtist">
            I am an artist
          </label>
          <small className="form-text text-muted">
            Artists are able to post their songs for the community to
            review<br />NOTE: You <strong>cannot</strong> change your account
            type after signing up
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="signUpDisplayName">
            Display name (required, at least 4 characters):
            <input
              className={
                `form-control \
                ${errors.signUpDisplayName ? "is-invalid" : ""}`
              }
              type="text"
              id="signUpDisplayName"
              name="signUpDisplayName"
              ref={register({required: true, minLength: 4})}
            />
            {errors.signUpDisplayName?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
            {errors.signUpDisplayName?.type === "minLength" && (
              <div className="invalid-feedback">
                This field must contain at least 4 characters
              </div>
            )}
            <small className="form-text text-muted">
              This is the name other users will see
            </small>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="signUpUsername">
            Username (required, at least 4 characters):
            <input
              className={
                `form-control \
                ${errors.signUpUsername ? "is-invalid" : ""}`
              }
              type="text"
              id="signUpUsername"
              name="signUpUsername"
              ref={register({required: true, minLength: 4})}
            />
            {errors.signUpUsername?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
            {errors.signUpUsername?.type === "minLength" && (
              <div className="invalid-feedback">
                This field must contain at least 4 characters
              </div>
            )}
            <small className="form-text text-muted">
              This is the name you will use to Log In
            </small>
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="signUpPassword">
            Password (required, at least 4 characters):
            <input
              className={
                `form-control \
                ${errors.signUpPassword ? "is-invalid" : ""}`
              }
              type="password"
              id="signUpPassword"
              name="signUpPassword"
              ref={register({required: true, minLength: 4})}
            />
            {errors.signUpPassword?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
            {errors.signUpPassword?.type === "minLength" && (
              <div className="invalid-feedback">
                This field must contain at least 4 characters
              </div>
            )}
          </label>
        </div>
        <input
          className="btn btn-primary"
          disabled={
            errors.signUpDisplayName?.type
            || errors.signUpUsername?.type
            || errors.signUpPassword?.type
          }
          type="submit"
          value="Sign Up"
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

SignUp.propTypes = {
  handleSignUp: PropTypes.func.isRequired,
  errorMsg: PropTypes.string
};

SignUp.defaultProps = {
  errorMsg: ""
};

export default SignUp;
