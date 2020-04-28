import React, { useState, useCallback } from 'react';
import Parse from 'parse';
import './App.css';

function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  const [items, setItems] = useState([]);
  const fetchItems = useCallback(() => {
    const fetchData = async () => {
      const query = new Parse.Query(Parse.Object.extend("test"));
      const result = await query.find();

      setItems(result);
    };

    fetchData();
  }, []);

  const [targetData, setTargetData] = useState({});
  const fetchItem = useCallback((id) => {
    const fetchData = async () => {
      const query = new Parse.Query(Parse.Object.extend("test"));
      const result = await query.get(id);

      setTargetData(result.toJSON());
    };

    fetchData();
  }, []);

  const [addedId, setAddedId] = useState("");
  const addItem = useCallback((item) => {
    const sendData = async () => {
      const Test = Parse.Object.extend("test");
      const test = new Test();
      const result = await test.save(JSON.parse(item));

      setAddedId(result.id);
    };

    sendData();
  }, []);

  return (
    <div
      style={{width: "80vw", margin: "0 auto"}}
    >
      <div>
        <h2>Items in Database</h2>
        <button type="button" onClick={fetchItems}>Fetch Items</button>
        {items.map(item => (
          <div key={item["id"]}>
            <p>{item["id"]}</p>
            <ul>
              {Object.entries(item).map(([key, value]) => (
                <li key={`${item["id"]}-${key}`}>{key}: {value}</li>
              ))}
            </ul>
          </div> 
        ))}
      </div>
      <div>
        <h2>View Item from Database</h2>
        <div>
          <label htmlFor="oId">Object Id: </label>
          <input
            type="text"
            id="oId"
            name="oId"
            onKeyPress={event => (event.key === "Enter") && fetchItem(event.target.value)}
          />
        </div>
        {targetData["artist"] &&
          <div>
            <h3>{targetData["song"]}</h3>
            <p>Artist: {targetData["artist"]}</p>
            <p>By user: {targetData["userId"]}</p>
            <p>Rating: {targetData["rating"]}</p>
            <p>Review: {targetData["review"]}</p>
          </div>}
      </div>
      <div>
        <h2>Add Item to Database</h2>
        <p>Expected JSON:</p>
        <pre>
          {"{\n  \"userId\": string,\n  \"artist\": string,\n  \"song\": string,\n  \"rating\": number,\n  \"review\": string\n}"}
        </pre>
        <div>
          <label htmlFor="jIn">JSON: </label>
          <input
            type="text"
            id="jIn"
            name="jIn"
            onKeyPress={event => (event.key === "Enter") && addItem(event.target.value)}
          />
        </div>
        {(addedId !== "") && <p>Added id: {addedId}</p>}
      </div>
    </div>
  );
}

export default App;
