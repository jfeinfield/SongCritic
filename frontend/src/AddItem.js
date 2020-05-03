import React, {useState, useCallback} from 'react';
import Parse from 'parse';

const AddItem = () => {
  const [addedId, setAddedId] = useState("");
  const addItem = useCallback(async (item) => {
    const Test = Parse.Object.extend("review");
    const test = new Test();
    const result = await test.save(JSON.parse(item));

    setAddedId(result.id);
  }, []);

  return (
    <div>
      <h2>Add Item to Database</h2>
      <p>Expected JSON:</p>
      <pre>
        {"{\n  \"userId\": string,\n  \"artist\": string,\n  \"song\": string,\n  \"rating\": number,\n  \"review\": string\n}"}
      </pre>
      <div>
        <label htmlFor="jIn">
          JSON:
          <input
            type="text"
            id="jIn"
            name="jIn"
            onKeyPress={event => (event.key === "Enter") && addItem(event.target.value)}
          />
        </label>
      </div>
      {(addedId !== "") && <p>Added id: {addedId}</p>}
    </div>
  );
};

export default AddItem;
