import React, {useEffect, useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {Song as SongClass} from "../parseClasses";

const SongDir = () => {
  const [songs, setSongs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchingSongs, setFetchingSongs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const songQuery = new Parse.Query(SongClass);
        const songList = await songQuery.addAscending("name").find();
        setSongs(songList.map((song) => song.toJSON()));
        setFetchingSongs(false);
      } catch (error) {
        setErrorMsg(error);
      }
    })();
  }, []);

  return (
    <div>
      {errorMsg !== ""
        ? <>
          <p>{errorMsg}</p>
        </>
        : <>
          <h1>Songs</h1>
          {fetchingSongs
            ? <>
              <p>Fetching songs...</p>
            </>
            : <>
              {songs.map((song) => {
                return (
                  <p key={song.objectId}>
                    <Link to={`/song/${song.objectId}`}>{song.name}</Link>
                  </p>
                );
              })}
            </>
          } 
        </>
      }
    </div>
  );
};

export default SongDir;
