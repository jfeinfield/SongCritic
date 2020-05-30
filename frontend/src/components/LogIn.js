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
        <label htmlFor="logInUsername">
          Username:
          <input
            type="text"
            id="logInUsername"
            name="logInUsername"
            ref={register({required: true, minLength: 4})}
          />
        </label>
        {errors.logInUsername?.type === "required"
          && <span>This field is required</span>}
        {errors.logInUsername?.type === "minLength"
          && <span>This field must contain at least 4 characters</span>}
        <br />
        <label htmlFor="logInPassword">
          Password:
          <input
            type="password"
            id="logInPassword"
            name="logInPassword"
            ref={register({required: true, minLength: 4})}
          />
        </label>
        {errors.logInPassword?.type === "required"
          && <span>This field is required</span>}
        {errors.logInPassword?.type === "minLength"
          && <span>This field must contain at least 4 characters</span>}
        <br />
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
