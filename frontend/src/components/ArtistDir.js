import React, {useEffect, useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {User as UserClass, Artist as ArtistClass} from "../parseClasses";

const ArtistDir = () => {
  const [artists, setArtists] = useState([]);
  const [fetchingArtists, setFetchingArtists] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const artistPointers =
          (await new Parse.Query(ArtistClass).find()).map((v) => v.get("user"));

        // Create promises which resolve to the actual user
        const artistPromises = artistPointers.map(async (pointer) =>
          new Parse.Query(UserClass).get(pointer.id)
        );

        // Resolve each promise in the array and get their name
        const artistUsers =
          Promise.all(artistPromises).then((users) =>
            users.map((user) => ({
              id: user.id,
              name: user.toJSON().name
            }))
          );
        setArtists((await artistUsers).sort((a,b) => {
          return (a.name).localeCompare(b.name);
        }));

        setFetchingArtists(false);
      } catch (error) {
        setErrorMsg(`${error.code} ${error.message}`);
      }
    })();
  }, []);

  return (
    <div>
      <h2>Artists</h2>
      {errorMsg !== ""
        ? (
          <p className="text-danger mt-3">
            <strong>Error {errorMsg.split(" ")[0]}</strong><br />
            {errorMsg.split(" ").slice(1).join(" ")}
          </p>
        ) : (
          <>
            {fetchingArtists
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
                    There are <span className="text-info">
                      {artists.length}
                    </span>
                    {" artists registered on Song Critic."}
                  </p>
                  <ul className="list-group">
                    {artists.map((artist) => (
                      <Link
                        key={artist.id}
                        className="list-group-item list-group-item-action"
                        to={`/user/${artist.id}`}
                      >
                        {artist.name}
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

export default ArtistDir;
