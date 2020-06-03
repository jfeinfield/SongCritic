import React, {useState} from "react";
import Parse from "parse";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {
  Song as SongClass,
  User as UserClass,
  Artist as ArtistClass
} from "../parseClasses";

const Search = () => {
  const [artistResults, setArtistResults] = useState([]);
  const [songResults, setSongResults] = useState([]);
  const [artistFound, setArtistFound] = useState(false);
  const [songFound, setSongFound] = useState(false);
  const [didSearch, setDidSearch] = useState(false);

  const {register, handleSubmit, errors} = useForm();

  const doSearch = async (data) => {
    const {searchTerm} = data;
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

    const allSongs = await songQuery.find();

    const songQueryResults = allSongs.filter((song) => { return (
      song.get("name").toLowerCase().includes(searchTerm.toLowerCase())
    );});

    setArtistFound(artistQueryResults.length !== 0);
    setSongFound(songQueryResults.length !== 0);
    setArtistResults(artistQueryResults);
    setSongResults(songQueryResults.map((s) => s.toJSON()));
    setDidSearch(true);
  };

  return (
    <div>
      <h2>Search</h2>
      <form onSubmit={handleSubmit(doSearch)}>
        <small className="form-text text-muted mb-2">
          Search supports artists and songs.<br />
          {
            "Try an artist name (e.g. \"Travis Scott\"), a song name (e.g. \"" +
            "BALD!\"), or a partial query to match both (e.g. \"b\")."
          }
        </small>
        <div className="formGroup">
          <label htmlFor="searchTerm">
            <input
              className={
                `form-control \
                ${errors.searchTerm ? "is-invalid" : ""}`
              }
              type="text"
              id="searchTerm"
              name="searchTerm"
              data-testid="searchTerm"
              ref={register({required: true, pattern: /[^\s]/})}
            />
            {errors.searchTerm && (
              <div className="invalid-feedback">
                This field is required
              </div>
            )}
          </label>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
        >
          Search
        </button>
      </form>
      {artistFound && <div>
        <h3>Artists</h3>
        {artistResults.map((artist) => (
          <ul key={artist.objectId}>
            <li><Link to={`/user/${artist.objectId}`}>{artist.name}</Link></li>
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
