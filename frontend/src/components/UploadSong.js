import React, {useState} from "react";
import PropTypes from "prop-types";
import {Song as SongClass} from "../parseClasses";

const UploadSong = (props) => {
  const [song, setSong] = useState("");
  const [coverArt, setArt] = useState("");
  // const [ArtistID, setID] = useState("");
  const [songUploaded, setSongUploaded] = useState(false);

  const saveSong = async () => {
    // we are saying that artist id and user id is the same thing for now
    // use user id to auto populate the artist name for the upload,
    // not sure how to do this as of now
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
  // make this a form, Mian posted some info about this, find it or ask
  // also i think i need to change it from onchange to something else,
  // double check the message
  // cover art needs to be a url, need to add input validation to make sure
  // it is a good one
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
