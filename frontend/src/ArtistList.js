import React, {useState} from 'react';
import Parse from 'parse';

const ArtistList = () => {
  const [artistList, setArtistList] = useState([]);
  const fetchArtists = async () => {
    const query = new Parse.Query(Parse.Object.extend("review"));
    const results = await query.find();

    setArtistList(results.map((result) => result.toJSON().artist));
  };

  return (
    <div>
      <h2>Artists in Database</h2>
      <button type="button" onClick={fetchArtists}>Fetch Artists</button>
      {artistList.map((artist, index) => {
        const tempKey = `${index}-${artist}`; // FIXME: don't use index as key
        return (
        <p key={tempKey}>{artist}</p>
      )})}
    </div>
  )
}

export default ArtistList;
