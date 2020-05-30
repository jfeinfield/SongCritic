import React, {useState} from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";

import {Song as SongClass} from "../parseClasses";

const SubmitSong = (props) => {
  const [submitSongErrorMsg, setSubmitSongErrorMsg] = useState("");

  const {register, handleSubmit, reset, errors} = useForm();

  const saveSong = async (songName, songArt) => {
    const newSong = new SongClass();

    setSubmitSongErrorMsg("");

    newSong.set("artist", props.currentUser.toPointer());
    newSong.set("name", songName);
    newSong.set("art", songArt);

    try {
      await newSong.save();
      reset();
    } catch (error){
      setSubmitSongErrorMsg(`${error.code} ${error.message}`);
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
                // eslint-disable-next-line
                pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
              })
            }
          />
        </label>
        {errors.songArt?.type === "pattern"
          && <span>Needs to be a valid link</span>}
        <br />
        <input
          className="btn btn-primary"
          type="submit"
          value="Submit Song"
        />
      </form>
      {submitSongErrorMsg !== "" && <p>{submitSongErrorMsg}</p>}
    </div>
  );
};

SubmitSong.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
};

export default SubmitSong;
