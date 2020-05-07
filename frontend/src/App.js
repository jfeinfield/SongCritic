import React from 'react';
import Parse from 'parse';

import AddItem from "./AddItem";
import ArtistList from "./ArtistList";
import SubmitReview from "./SubmitReview";
import RecentReviews from "./RecentReviews";

import './App.css';

function App() {
  Parse.initialize("HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud", "");
  Parse.serverURL = "http://localhost:1337/parse";

  return (
    <div style={{width: "80vw", margin: "0 auto"}}>
      <AddItem />
      <ArtistList />
      <SubmitReview userId={1} />
      <RecentReviews />
    </div>
  );
}

export default App;
