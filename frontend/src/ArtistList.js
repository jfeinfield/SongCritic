import React, {useState, useCallback} from 'react';
import Parse from 'parse';

const ArtistList = () => {
  const[artistList, setArtistList] = useState([]);
  const fetchArtists = useCallback(() => {
    const fetchData = async() => {
      setArtistList([]);
      const query = new Parse.Query(Parse.Object.extend("test"));
      const results = await query.find();

      results.forEach(result => {
        setArtistList(aL => [...aL, result.toJSON().artist]);
      });
    };

    fetchData();

  },[]);

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
