import React, { useState, useCallback } from 'react';
import Parse from 'parse';

import Review from "./Review";
import AddItem from "./AddItem";
import ArtistList from "./ArtistList";
import SubmitReview from "./SubmitReview";
import RecentReviews from "./RecentReviews";

import './App.css';

function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  const [items, setItems] = useState([]);
  const fetchItems = useCallback(() => {
    const fetchData = async () => {
      const query = new Parse.Query(Parse.Object.extend("review"));
      const result = await query.find();

      setItems(result);
    };

    fetchData();
  }, []);

  const [targetData, setTargetData] = useState({});
  const fetchItem = useCallback((id) => {
    const fetchData = async () => {
      const query = new Parse.Query(Parse.Object.extend("review"));
      const result = await query.get(id);

      setTargetData(result.toJSON());
    };

    fetchData();
  }, []);

  return (
    <div
      style={{width: "80vw", margin: "0 auto"}}
    >
      <div>
        <h2>Items in Database</h2>
        <button type="button" onClick={fetchItems}>Fetch Items</button>
        {items.map(item => (
          <div key={item.id}>
            <p>{item.id}</p>
            <ul>
              {Object.entries(item).map(([key, value]) => (
                <li key={`${item.id}-${key}`}>{key}: {value}</li>
              ))}
            </ul>
          </div> 
        ))}
      </div>
      <div>
        <h2>View Item from Database</h2>
        <div>
          <label htmlFor="oId">
            Object Id:
            <input
              type="text"
              id="oId"
              name="oId"
              onKeyPress={event => (event.key === "Enter") && fetchItem(event.target.value)}
            />
          </label>
        </div>
        <Review
          artist={targetData.artist}
          song={targetData.song}
          userId={targetData.userId}
          rating={targetData.rating}
          review={targetData.review}
        />
      </div>
      <AddItem />
      <ArtistList />
      <SubmitReview userId={1} />
      <RecentReviews />
    </div>
  );
}

export default App;
