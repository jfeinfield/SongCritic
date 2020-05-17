import React, {useState} from "react";
import PropTypes from "prop-types";

import {Song as SongClass} from "../parseClasses";

const SubmitSong = (props) => {
  const [song, setSong] = useState("");
  const [coverArt, setArt] = useState("");
  const [songUploaded, setSongUploaded] = useState(false);

  const saveSong = async () => {
    const newSong = new SongClass();
    newSong.set("artist", props.currentUser.toPointer());
    newSong.set("name", song);
    newSong.set("art", coverArt);

    try {
      await newSong.save();

      setSong("");
      setArt("");
      setSongUploaded(true);
    } catch {
      // TODO: handle submission error
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSong();
  };

  return (
    <div>
      <h2>Post a new song</h2>
      <form name="usForm" onSubmit={handleSubmit}>
        <label htmlFor="txtSong">
          Song name:
          <input
            id="txtSong"
            value={song}
            onChange={(e) => setSong(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="txtCoverArt">
          Cover Art:
          <input
            id="txtCoverArt"
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            value={coverArt}
            onChange={(e) => setArt(e.target.value)}
            required
          />
        </label>
        <br />
        <input
          disabled={song === "" || coverArt === "" }
          type="submit"
          value="Submit Song"
        />
      </form>
      <div hidden={!songUploaded}>Song posted successfully!</div>
    </div>
  );
};

SubmitSong.propTypes = {
  currentUser: PropTypes.shape({
    toPointer: PropTypes.func
  }).isRequired
};

export default SubmitSong;
