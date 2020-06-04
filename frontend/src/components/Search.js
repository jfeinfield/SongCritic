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
      <form className="mb-5" onSubmit={handleSubmit(doSearch)}>
        <p className="mb-2">
          Search supports artists and songs.<br />
          Try an artist name (e.g. &quot;Travis Scott&quot;), a song name (e.g.
            &quot;BALD!&quot;), or a partial query to match both (e.g.
            &quot;b&quot;)
        </p>
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
          disabled={errors.searchTerm}
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="mb-3">
        {didSearch && <h3>Artist results</h3>}
        {artistFound && (
          <ul className="list-group list-group-flush">
            {artistResults.map((artist) => (
              <Link
                key={artist.objectId}
                className="list-group-item list-group-item-action"
                to={`/user/${artist.objectId}`}
              >
                {artist.name}
              </Link>
            ))}
          </ul>
        )}
        {didSearch && !artistFound && (
          <p>No artist results found</p>
        )}
      </div>
      <div className="mb-3">
        {didSearch && <h3>Song results</h3>}
        {songFound && (
          <ul className="list-group list-group-flush">
            {songResults.map((song) => (
              <Link
                key={song.objectId}
                className="list-group-item list-group-item-action"
                to={`/song/${song.objectId}`}
              >
                {song.name}
              </Link>
            ))}
          </ul>
        )}
        {didSearch && !songFound && (
          <p>No song results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
