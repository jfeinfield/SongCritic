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
        <label htmlFor="signUpIsArtist">
          I am an artist
          <input
            type="checkbox"
            id="signUpIsArtist"
            name="signUpIsArtist"
            ref={register()}
          />
        </label>
        <br />
        <label htmlFor="signUpDisplayName">
          Display Name:
          <input
            type="text"
            id="signUpDisplayName"
            name="signUpDisplayName"
            ref={register({required: true, minLength: 4})}
          />
        </label>
        {errors.signUpDisplayName?.type === "required"
          && <span>This field is required</span>}
        {errors.signUpDisplayName?.type === "minLength"
          && <span>This field must contain at least 4 characters</span>}
        <br />
        <label htmlFor="signUpUsername">
          Username:
          <input
            type="text"
            id="signUpUsername"
            name="signUpUsername"
            ref={register({required: true, minLength: 4})}
          />
        </label>
        {errors.signUpUsername?.type === "required"
          && <span>This field is required</span>}
        {errors.signUpUsername?.type === "minLength"
          && <span>This field must contain at least 4 characters</span>}
        <br />
        <label htmlFor="signUpPassword">
          Password:
          <input
            type="password"
            id="signUpPassword"
            name="signUpPassword"
            ref={register({required: true, minLength: 4})}
          />
        </label>
        {errors.signUpPassword?.type === "required"
          && <span>This field is required</span>}
        {errors.signUpPassword?.type === "minLength"
          && <span>This field must contain at least 4 characters</span>}
        <br />
        <input
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
