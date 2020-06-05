import Parse from "parse";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
  Song as SongClass,
  Review as ReviewClass,
  User as UserClass} from "../parseClasses";

const TopSongs = () => {
  const [songs, setSongs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [fetchingSongs, setFetchingSongs] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const allSongs = await new Parse.Query(SongClass).find();
        const songPromises = allSongs.map(async (song) => {
          const reviewQuery = new Parse.Query(ReviewClass);
          reviewQuery.equalTo("song",
            {"__type": "Pointer", "className": "song", "objectId": song.id});
          const reviews = await reviewQuery.find();

          let rating = 0;
          let numRatings = 0;
          reviews.forEach(review => {
            rating += review.get("rating");
            numRatings += 1;
          });

          if (numRatings === 0)
            return null;

          const artistQuery = new Parse.Query(UserClass);
          const artist = await artistQuery.get(song.get("artist").id);
          return {
            id: song.id,
            name: song.get("name"),
            avgRating: rating/numRatings,
            artistName: artist.get("name"),
            artistId: artist.id
          };
        });

        const songArray = await Promise.all(songPromises);
        const filteredArray = songArray.filter((s) => s !== null);
        filteredArray.sort((a,b) => b.avgRating - a.avgRating);
        setSongs(filteredArray.slice(0, 10));
        setFetchingSongs(false);
      } catch (error) {
        setErrorMsg(`${error.code} ${error.message}`);
      }
    })();
  }, []);

  return (
    <div className="mb-5">
      {errorMsg !== ""
        ? (
          <>
            <h2>Top Rated Songs</h2>
            <p className="text-danger mt-3">
              <strong>Error {errorMsg.split(" ")[0]}</strong><br />
              {errorMsg.split(" ").slice(1).join(" ")}
            </p>
          </>
        ) : (
          <>
            <h2>Top {songs.length ? songs.length : ""} Rated Songs</h2>
            {fetchingSongs
              ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p>Fetching songs...</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Song</th>
                      <th scope="col">Artist</th>
                      <th scope="col">Avg. Rating (stars)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song, i) => (
                      <tr key={song.id}>
                        <th scope="row">{i + 1}</th>
                        <td>
                          <Link to={`/song/${song.id}`}>
                            {song.name}
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`/user/${song.artistId}`}>{song.artistName}
                          </Link>
                        </td>
                        <td>
                          {song.avgRating.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            }
          </>
        )
      }
    </div>
  );
};

export default TopSongs;
