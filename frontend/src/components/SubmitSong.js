import React, {useState} from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import {Redirect} from "react-router-dom";

import {Song as SongClass} from "../parseClasses";

import SongPage from "./SongPage";

const SubmitSong = (props) => {
  const [submitSongErrorMsg, setSubmitSongErrorMsg] = useState("");
  const [songSubmitted, setSongSubmitted] = useState(false);
  const [songId, setSongId] = useState("");

  const {register, handleSubmit, reset, errors} = useForm();
  const {
    currentUser: user,
  } = props;

  const saveSong = async (songName, songArt) => {
    const newSong = new SongClass();

    setSubmitSongErrorMsg("");

    newSong.set("artist", user.toPointer());
    newSong.set("name", songName);
    newSong.set("art", songArt);

    try {
      await newSong.save();
      reset();
      setSongId(newSong.id);
      setSongSubmitted(true);
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
      <h2>Post a New Song</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="songName">
            Song name:
            <input
              className={
                `form-control \
                ${errors.songName ? "is-invalid" : ""}`
              }
              type="text"
              id="songName"
              name="songName"
              ref={register({required: true})}
            />
            {errors.songName?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="songArt">
            Cover Art:
            <input
              className={
                `form-control \
                ${errors.songArt ? "is-invalid" : ""}`
              }
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
            {errors.songArt?.type === "pattern" && (
              <div className="invalid-feedback">
                Needs to be a valid link
              </div>
            )}
          </label>
        </div>
        <input
          className="btn btn-primary"
          type="submit"
          value="Submit Song"
        />
        {songSubmitted && <Redirect to={`/song/${songId}`}>
          <SongPage currentUser={user} />
        </Redirect>}
        {submitSongErrorMsg !== "" && <p>{submitSongErrorMsg}</p>}
      </form>
    </div>
  );
};

SubmitSong.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired,
};

export default SubmitSong;
