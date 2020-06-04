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
      <h2>Songs</h2>
      {errorMsg !== ""
        ? <p className="text-danger">{errorMsg}</p>
        : <>
          {fetchingSongs
            ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p>Fetching artists...</p>
              </div>
            )
            : (
              <>
                <p>
                  There are <span className="text-info">{songs.length}</span>
                  {" songs available for review on Song Critic."}
                </p>
                <ul className="list-group">
                  {songs.map((song) => (
                    <Link
                      key={song.objectId}
                      className="list-group-item list-group-item-action"
                      to={`/song/${song.objectId}`}
                    >
                      {song.name}
                    </Link>
                  ))}
                </ul>
              </>
            )
          }
        </>
      }
    </div>
  );
};

export default SongDir;
