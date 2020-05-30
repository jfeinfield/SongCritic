import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

const SignUp = (props) => {
  const {register, handleSubmit, reset, errors} = useForm();
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
    reset();
  };

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-check">
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
        </div>
        <small id="artistHelp" className="form-text text-muted">
          Artists are able to post their songs for the community to review
        </small>
        <div className="form-group">
          <label htmlFor="signUpDisplayName">
            Display Name:
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
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="signUpUsername">
            Username:
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
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="signUpPassword">
            Password:
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
          type="submit"
          value="Sign Up"
        />
      </form>
      {errorMsgFromParse !== "" && <p>{errorMsgFromParse}</p>}
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
