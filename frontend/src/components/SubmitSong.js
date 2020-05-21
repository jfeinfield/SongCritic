import React from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

import {Song as SongClass} from "../parseClasses";

const SubmitSong = (props) => {
  const {register, handleSubmit, reset, errors} = useForm();
  const {
    errorMsg: errorMsgFromParse
  } = props;

  const saveSong = async (songName, songArt) => {
    const newSong = new SongClass();
    newSong.set("artist", props.currentUser.toPointer());
    newSong.set("name", songName);
    newSong.set("art", songArt);

    try {
      await newSong.save();
      reset();

    } catch {
      // TODO: handle submission error
    }

  };

  const onSubmit = (data) => {
    const {
      songName,
      songArt,
    } = data;

    saveSong(
      songName,
      songArt,
    );
    reset();

  };

  return (
    <div>
      <h2>Post a new song</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="songName">
          Song name:
          <input
            type="text"
            id="songName"
            name="songName"
            ref={register({required: true})}

          />
        </label>
        {errors.songName?.type === "required"
          && <span>This field is required</span>}
        <br />
        <label htmlFor="songArt">
          Cover Art:
          <input
            id="songArt"
            type="url"
            name="songArt"
            ref={
              register({
                required: true,
                // eslint-disable-next-line
                pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
              })
            }
          />
        </label>
        {errors.songArt?.type === "required"
          && <span>This field is required</span>}
        <br />
        <input
          type="submit"
          value="Submit Song"
        />
      </form>
      {errorMsgFromParse !== "" && <p>{errorMsgFromParse}</p>}
    </div>
  );
};

SubmitSong.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
  errorMsg: PropTypes.string
};

SubmitSong.defaultProps = {
  errorMsg: ""
};

export default SubmitSong;
