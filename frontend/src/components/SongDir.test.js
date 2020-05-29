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
      addAscending: () => ({
        find: () => Promise.resolve([
          {toJSON: () => ({name: "test1", objectId: 1})},
          {toJSON: () => ({name: "test2", objectId: 2})}])
      })
    };
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
  const {queryAllByText, findAllByText} = render(
    <Router>
      <SongDir />
    </Router>
  );
  await waitForElement(() => queryAllByText(/test[1-9]/i));
  const songs = await findAllByText(/test[1-9]/);
  expect(songs[0].toString()).toBe("http://localhost/song/1");
  expect(songs[1].toString()).toBe("http://localhost/song/2");
});
