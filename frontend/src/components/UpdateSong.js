import React, {useState} from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import Parse from "parse";

import {Song as SongClass} from "../parseClasses";

const UpdateSong = (props) => {
  const {songId, songName, songArt, handleSongUpdate} = props;
  const {register, errors, handleSubmit} = useForm();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (data) => {
    const {updateSongName, updateSongArt} = data;
    const songQuery = new Parse.Query(SongClass);

    setMsg("");
    setErr("");

    try {
      const currentSong = await songQuery.get(songId);

      currentSong.set("name", updateSongName);
      currentSong.set("art", updateSongArt);
      await currentSong.save();
      handleSongUpdate(updateSongName, updateSongArt);
      setMsg("Song details updated!");
    } catch (error) {
      setErr(`${error.code} ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Update Song Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="updateSongName">
            Song Name:
            <input
              className={
                `form-control \
                ${errors.updateSongName ? "is-invalid" : ""}`
              }
              defaultValue={songName}
              type="text"
              id="updateSongName"
              name="updateSongName"
              ref={register({required: true})}
            />
            {errors.updateSongName?.type === "required" && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="updateSongArt">
            Cover Art:
            <input
              className={
                `form-control \
                ${errors.updateSongArt ? "is-invalid" : ""}`
              }
              defaultValue={songArt}
              type="url"
              id="updateSongArt"
              name="updateSongArt"
              ref={
                register({
                  // eslint-disable-next-line
                  pattern: /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
                })
              }
            />
            {errors.updateSongArt?.type === "pattern" && (
              <div className="invalid-feedback">
                Needs to be a valid link
              </div>
            )}
          </label>
        </div>
        <input
          className="btn btn-primary"
          type="submit"
          value="Update"
        />
      </form>
      {msg && <p>{msg}</p>}
      {err && <p>{err}</p>}
    </div>
  );
};

UpdateSong.propTypes = {
  songId: PropTypes.string.isRequired,
  songName: PropTypes.string.isRequired,
  songArt: PropTypes.string.isRequired,
  handleSongUpdate: PropTypes.func.isRequired
};

export default UpdateSong;
