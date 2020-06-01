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
        setErrorMsg(error);
      }
    })();
  }, []);

  return (
    <div>
      {errorMsg !== ""
        ? <>
          <p>{errorMsg}</p>
        </>
        : <>
          <h1>Top Songs</h1>
          {fetchingSongs
            ? <>
              <p>Fetching songs...</p>
            </>
            : <ol>
              {songs.map((song) => (
                <li key={song.id}>
                  <Link to={`/song/${song.id}`}>
                    {song.name}
                  </Link> by <Link 
                    to={`/user/${song.artistId}`}>{song.artistName}
                  </Link> ({song.avgRating.toFixed(1)} stars)
                </li>
              ))}
            </ol>
          }
        </>
      }
    </div>
  );
};

export default TopSongs;
