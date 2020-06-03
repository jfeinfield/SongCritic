import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {
  cleanup,
  render,
} from "@testing-library/react";

import {
  Song as mockSong,
  Review as mockReview,
  User as mockUser} from "../parseClasses";

import UserPage from "./UserPage";

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
        addDescending: () => ({
          equalTo: () => {}
        }),
        find: () => Promise.resolve([
          {toJSON: () => ({objectId: 1, name: "testSong1"})},
          {toJSON: () => ({objectId: 2, name: "testSong2"})}
        ])
      };
    case mockReview:
      return {
        equalTo: () => {},
        find: () => Promise.resolve([
          {toJSON: () => ({objectId: "testId1"})},
          {toJSON: () => ({objectId: "testId2"})}
        ])
      };
    case mockUser:
      return {
        get: () => ({
          /* eslint-disable consistent-return */
          get: (string) => {
            if (string === "name")
              return "testName";
            if (string === "isArtist")
              return true;
          }
          /* eslint-disable consistent-return */
        })
      };
    default:
    }
  }
}));

afterEach(cleanup);

it("displays the user's name", async () => {
  const {findByText} = render(
    <Router>
      <UserPage />
    </Router>
  );

  expect(await findByText("testName")).toBeTruthy();
});

it("displays artist's songs", async () => {
  const {findByText} = render(
    <Router>
      <UserPage />
    </Router>
  );

  expect(await findByText("testSong2")).toBeTruthy();
});
