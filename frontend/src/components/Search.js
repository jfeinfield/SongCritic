import React, {useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {
  Song as SongClass,
  User as UserClass,
  Artist as ArtistClass
} from "../parseClasses";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");;
  const [artistResults, setArtistResults] = useState([]);
  const [songResults, setSongResults] = useState([]);
  const [artistFound, setArtistFound] = useState(false);
  const [songFound, setSongFound] = useState(false);
  const [didSearch, setDidSearch] = useState(false);

  const doSearch = async () => {
    const artistPointers =
      (await new Parse.Query(ArtistClass).find()).map((v) => v.get("user"));

    const artistPromises = artistPointers.map(async (pointer) =>
      new Parse.Query(UserClass).get(pointer.id)
    );

    const artistQueryResults =
      await Promise.all(artistPromises).then((users) =>
        users.map((user) => ({
          objectId: user.id,
          name: user.toJSON().name
        })).filter(({name}) => {return (
          name.toLowerCase().includes(searchTerm.toLowerCase())
        );})
      );

    const songQuery = new Parse.Query(SongClass);
    songQuery.fullText("name", searchTerm).limit(10);

    const songQueryResults = await songQuery.find();

    setArtistFound(artistQueryResults.length !== 0);
    setSongFound(songQueryResults.length !== 0);
    setArtistResults(artistQueryResults);
    setSongResults(songQueryResults.map((s) => s.toJSON()));
    setDidSearch(true);
  };

  return (
    <div>
      <h2>Search</h2>
      <label htmlFor="searchInput">
        Search:
        <input
          id="searchInput"
          name="searchInput"
          data-testid="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={
            e => (e.key === "Enter") && searchTerm !== "" && doSearch()
          }
        />
      </label>
      <button
        disabled={searchTerm === ""}
        type="button"
        onClick={() => doSearch()}>
        Search
      </button>
      {artistFound && <div>
        <h3>Artists</h3>
        {artistResults.map((artist) => (
          <ul key={artist.objectId}>
            <li>{artist.name}</li>
          </ul>
        ))}
      </div>}
      {songFound && <div>
        <h3>Songs</h3>
        {songResults.map((song) => (
          <ul key={song.objectId} >
            <li><Link to={`/song/${song.objectId}`}>{song.name}</Link></li>
          </ul>
        ))}
      </div>}
      {didSearch && !artistFound && !songFound && <div>No results found</div>}
    </div>
  );
};

export default Search;
