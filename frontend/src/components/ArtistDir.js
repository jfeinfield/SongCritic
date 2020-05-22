import React, {useEffect, useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {User as UserClass, Artist as ArtistClass} from "../parseClasses";

const ArtistDir = () => {
  const [artists, setArtists] = useState([]);
  const [fetchingArtists, setFetchingArtists] = useState(true);


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
        setArtists((await artistUsers).sort((a,b) => (a.name).localeCompare(b.name)));
        setFetchingArtists(false);
      } catch (error) {
        console.log(error);
        //TODO: handle error
      }
    })();
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      {fetchingArtists 
      ? <>
        <p>Fetching artists...</p>
      </>
      : <>
        {artists.map((artist) => {
          return <p key={artist.id}><Link to={`/user/${artist.id}`}>{artist.name}</Link></p>
        })}
      </> }
    </div>
  );
}

export default ArtistDir;