import React, {useState} from "react";
import Parse from "parse";
import {Artist as ArtistClass, User as UserClass} from "../parseClasses";

const ArtistList = () => {
  const [artistList, setArtistList] = useState([]);

  const fetchArtists = async () => {
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

    setArtistList(await artistUsers);
  };

  return (
    <div>
      <h2>Artists in Database</h2>
      <button type="button" onClick={fetchArtists}>Fetch Artists</button>
      {artistList.map((user) => {
        const {id, name} = user;

        return (
          <p key={id}>{name}</p>
        );
      })}
    </div>
  );
};

export default ArtistList;
