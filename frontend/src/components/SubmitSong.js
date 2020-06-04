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
    <div className="mb-5">
      <h2>Post a New Song</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="songName">
            Song name (required):
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
            Cover art:
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
          <small className="form-text text-muted">
            {"Optional: a "}
            <a href="https://en.wiktionary.org/wiki/hotlink">
              hotlink
            </a>
            {
              " to an image in a browser-compatible format (e.g. jpg, png, " +
              "gif, etc.); will be displayed in a square-aspect ratio (i.e." +
              " 256px x 256px)"
            }
            <br />
            e.g. https://i.imgur.com/P6bxNlh.jpg
          </small>
        </div>
        <input
          className="btn btn-primary"
          disabled={
            errors.songName?.type
            || errors.songArt?.type
          }
          type="submit"
          value="Submit Song"
        />
        {songSubmitted && (
          <Redirect to={`/song/${songId}`} />
        )}
        {submitSongErrorMsg !== "" && (
          <p className="text-danger mt-3">
            <strong>Error {submitSongErrorMsg.split(" ")[0]}</strong><br />
            {submitSongErrorMsg.split(" ").slice(1).join(" ")}
          </p>
        )}
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
