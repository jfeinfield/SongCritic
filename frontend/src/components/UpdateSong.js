import React, {useState} from "react";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";
import Parse from "parse";

import {Song as SongClass} from "../parseClasses";

const UpdateSong = (props) => {
  const {songId, songName, songArt} = props;
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

      setMsg("Song details updated!");
    } catch (error) {
      setErr(`${error.code} ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Update Song Details</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="updateSongName">
          Song Name:
          <input
            defaultValue={songName}
            type="text"
            id="updateSongName"
            name="updateSongName"
            ref={register({required: true})}
          />
        </label>
        {errors.updateSongName?.type === "required"
          && <span>This field is required</span>}
        <br />
        <label htmlFor="updateSongArt">
          Cover Art:
          <input
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
        </label>
        {errors.updateSongArt?.type === "pattern"
          && <span>Needs to be a valid link</span>}
        <br />
        <input
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
  songArt: PropTypes.string.isRequired
};

export default UpdateSong;
