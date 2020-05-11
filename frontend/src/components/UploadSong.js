import React, {useState} from "react";
import PropTypes from "prop-types";
import {Song as SongClass} from "../parseClasses";

const UploadSong = (props) => {
  const [song, setSong] = useState("");
  const [coverArt, setArt] = useState("");
  const [songUploaded, setSongUploaded] = useState(false);

  const saveSong = async () => {
    const songC = new SongClass();

    try {
      await songC.save({
        userId: props.currentUser.id,
        songName: song,
        art: coverArt,
      });

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
            value={coverArt}
            onChange={(e) => setArt(e.target.value)}
          />
        </label>
        <br />
        <input
          disabled={song === "" || coverArt === "" }
          type="submit"
          value="Post Song"
        />
        <br />
        <div hidden={!songUploaded}>Song posted successfully!</div>
      </form>
    </div>
  );
};

UploadSong.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

export default UploadSong;
