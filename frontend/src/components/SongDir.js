import React, {useEffect, useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {Song as SongClass} from "../parseClasses";

const SongDir = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const songQuery = new Parse.Query(SongClass);
        const songList = await songQuery.addAscending("name").find();
        setSongs(songList.map((song) => song.toJSON()));
      } catch (error) {
        // TODO: handle error
      }
    })();
  }, []);

  return (
    <div>
      <h1>Songs</h1>
      {songs.map((song) => {
        return (
          <p key={song.objectId}>
            <Link to={`/song/${song.objectId}`}>{song.name}</Link>
          </p>
        );
      })}
    </div>
  );
};

export default SongDir;
