import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {
  cleanup,
  render,
  waitForElement,
} from "@testing-library/react";

import ArtistDir from "./ArtistDir";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Song() {
        return {
          save: () => Promise.resolve({id: "newId"})
        };
      }
    )
  },
  Query: function Query() {
    return {
      find: () => Promise.resolve([
        {get: () => ({id: 1})},
        {get: () => ({id: 2})}
      ]),
      get: (artistId) => Promise.resolve(
        {id: artistId, toJSON: () => ({name: `artist${artistId}`})}
      )
    };
  }
}));

afterEach(cleanup);

it("displays all songs in the database", async () => {
  const {queryByText} = render(
    <Router>
      <ArtistDir />
    </Router>
  );
  await waitForElement(() => queryByText(/artist1/i));
  expect(queryByText(/artist1/i)).toBeTruthy();
  await waitForElement(() => queryByText(/artist2/i));
  expect(queryByText(/artist2/i)).toBeTruthy();
});

it("links each artist to their artist page", async () => {
  const {queryAllByText, findAllByText} = render(
    <Router>
      <ArtistDir />
    </Router>
  );

  await waitForElement(() => queryAllByText(/artist[1-9]/i));
  const artists = await findAllByText(/artist[1-9]/);
  expect(artists[0].toString()).toBe("http://localhost/user/1");
  expect(artists[1].toString()).toBe("http://localhost/user/2");
});
