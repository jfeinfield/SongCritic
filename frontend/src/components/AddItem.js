import React, {useState} from "react";
import PropTypes from "prop-types";
import {Review as ReviewClass} from "../parseClasses";

const AddItem = (props) => {
  const [addedId, setAddedId] = useState("");

  const addItem = async (item) => {
    const review = new ReviewClass();
    const result = await review.save({
      ...JSON.parse(item),
      userId: props.currentUser.id
    });

    setAddedId(result.id);
  };

  return (
    <div>
      <h2>Add Item to Database</h2>
      <p>Expected JSON:</p>
      <pre>
        {"{\n  \"artist\": string,\n  \"song\": "
          + "string,\n  \"rating\": number,\n  \"review\": string\n}"}
      </pre>
      <div>
        <label htmlFor="jIn">
          JSON: 
          <input
            type="text"
            id="jIn"
            name="jIn"
            onKeyPress={e => (e.key === "Enter") && addItem(e.target.value)}
          />
        </label>
      </div>
      {(addedId !== "") && <p>Added id: {addedId}</p>}
    </div>
  );
};

AddItem.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

export default AddItem;
