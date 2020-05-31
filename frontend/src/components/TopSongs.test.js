import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {
  cleanup,
  render,
  waitForElement,
} from "@testing-library/react";

import {
  Song as mockSong,
  Review as mockReview,
  User as mockUser} from "../parseClasses";

import TopSongs from "./TopSongs";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Song() {
        return {};
      }
    )
  },
  Query: function Query(type) {
    switch(type) {
    case mockSong:
      return {
        fullText: () => ({
          limit: () => {}
        }),
        find: () => Promise.resolve([
          {id: 1, get: () => "song1"},
          {id: 2, get: () => "song2"}])
      };
    case mockReview:
      return {
        equalTo: () => {},
        find: () => Promise.resolve([
          {get: () => 4},
          {get: () => 2}
        ])
      };
    case mockUser:
      return {
        get: () => ({
          get: () => "artistName"
        })
      };
    default:
    }
  }
}));

afterEach(cleanup);

it("renders a list of songs", async () => {
  const {queryByText} = render(
    <Router>
      <TopSongs />
    </Router>
  );

  await waitForElement(() => queryByText(/song1/i));
  expect(queryByText(/song1/i)).toBeTruthy();
  await waitForElement(() => queryByText(/song2/i));
  expect(queryByText(/song2/i)).toBeTruthy();
});
