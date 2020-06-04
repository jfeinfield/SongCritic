import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {
  cleanup,
  render,
  waitForElement,
} from "@testing-library/react";

import SongDir from "./SongDir";

jest.mock("parse", () => ({
  Object: {
    extend: (x) => (x)
  },
  Query: function Query(type) {
    switch(type) {
    case "song":
      return {
        addAscending: () => ({
          find: () => Promise.resolve([
            {toJSON: () => (
              {name: "test1", objectId: "1", artist: {objectId: ""}}
            )},
            {toJSON: () => (
              {name: "test2", objectId: "2", artist: {objectId: ""}}
            )}
          ])
        })
      };
    case "User":
      return {
        get: () => (Promise.resolve({
          toJSON: () => ({
            name: "fakeName"
          }),
        }))
      };
    default:
      return {};
    }
  }
}));

afterEach(cleanup);

it("displays all songs in the database", async () => {
  const {queryByText} = render(
    <Router>
      <SongDir />
    </Router>
  );
  await waitForElement(() => queryByText(/test1/i));
  expect(queryByText(/test1/i)).toBeTruthy();
});

it("links each song to their song page", async () => {
  const {queryByText} = render(
    <Router>
      <SongDir />
    </Router>
  );
  await waitForElement(() => queryByText(/available/i));
  expect(queryByText(/test2/i)).toBeTruthy();
  expect(queryByText(/test1/i)).toBeTruthy();
});
