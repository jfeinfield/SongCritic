import React, { useState } from 'react';
import Parse from "parse";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");;
  const [artistResults, setArtistResults] = useState([]);
  const [songResults, setSongResults] = useState([]);
  const [artistFound, setArtistFound] = useState(false);
  const [songFound, setSongFound] = useState(false);
  const [didSearch, setDidSearch] = useState(false);

  const doSearch = async () => {
    const artistQuery = new Parse.Query(Parse.Object.extend("artist"));
    artistQuery.fullText("name", searchTerm).limit(10);

    const artistResults = await artistQuery.find();

    const songQuery = new Parse.Query(Parse.Object.extend("song"));
    songQuery.fullText("name", searchTerm).limit(10);

    const songResults = await songQuery.find();

    setArtistFound(artistResults.length === 0 ? false : true);

    setSongFound(songResults.length === 0 ? false : true);

    setArtistResults(artistResults.map((a) => a.toJSON()));

    setSongResults(songResults.map((s) => s.toJSON()));
    
    setDidSearch(true);
  };

  return (
    <div>
      <h2>Search</h2>
      <label>
        <input
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={e => (e.key === "Enter") && searchTerm !== "" && doSearch()}
        />
      </label>
      <button disabled={searchTerm === ""} type="button" onClick={() => doSearch()}>
        Search
      </button>
      <div hidden={!artistFound}>
        <h2>Artists</h2>
        {artistResults.map((artist) => {
          return (
            <div key={artist.objectId}>
              <h4>{artist.name}</h4>
            </div>
        )})}
      </div>
      <div hidden={!songFound}>
        <h2>Songs</h2>
        {songResults.map((song) => {
          return (
            <div key={song.objectId} >
              <h3>{song.name}</h3>
              <p>By: {song.artistName}</p>
            </div>
        )})}
      </div>
      <div hidden={artistFound || songFound || !didSearch}>No results found</div>
    </div>
  );
}

export default Search;