import React, {useEffect, useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {Song as SongClass, User as UserClass} from "../parseClasses";

const SongDir = () => {
  const [songs, setSongs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchingSongs, setFetchingSongs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const songQuery = new Parse.Query(SongClass);
        const songListPointers = await songQuery.addAscending("name").find();
        const songList = songListPointers.map(async (s) => {
          const {
            artist: {objectId: artistId},
            name,
            objectId
          } = s.toJSON();

          const userQuery = new Parse.Query(UserClass);
          let artist = await userQuery.get(artistId);
          artist = artist.toJSON();

          return {
            artist: artist.name,
            name,
            objectId
          };
        });

        setSongs(await Promise.all(songList));
        setFetchingSongs(false);
      } catch (error) {
        setErrorMsg(`${error.code} ${error.message}`);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Songs</h2>
      {errorMsg !== ""
        ? (
          <p className="text-danger mt-3">
            <strong>Error {errorMsg.split(" ")[0]}</strong><br />
            {errorMsg.split(" ").slice(1).join(" ")}
          </p>
        ) : (
          <>
            {fetchingSongs
              ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p>Fetching songs...</p>
                </div>
              ) : (
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
                        <strong>{song.name}</strong> by {song.artist}
                      </Link>
                    ))}
                  </ul>
                </>
              )
            }
          </>
        )
      }
    </div>
  );
};

export default SongDir;
