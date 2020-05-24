import React from "react";
import {cleanup, render} from "@testing-library/react";

import AuthInfo from "./AuthInfo";

afterEach(cleanup);

it("handles a null currentUser", async () => {
  // Arrange
  const currentUser = null;

  // Act
  const {queryByText} = render(<AuthInfo currentUser={currentUser} />);

  // Assert
  expect(queryByText("Username: n/a")).toBeTruthy();
  expect(queryByText("Is an artist: n/a")).toBeTruthy();
  expect(queryByText("Session Token: n/a")).toBeTruthy();
  expect(queryByText("Authenticated: No")).toBeTruthy();
});

it("displays currentUser info", async () => {
  // Arrange
  const username = "fakeUsername";
  const displayName = "Fake Display Name";
  const isArtist = false;
  const sessionToken = "fakeSessionToken";
  const authenticated = true;
  const currentUser = {
    get: (key) => {
      switch(key) {
      case "name":
        return displayName;
      case "isArtist":
        return isArtist;
      default:
        return undefined;
      }
    },
    getUsername: () => username,
    getSessionToken: () => sessionToken,
    authenticated: () => authenticated
  };

  // Act
  const {queryByText} = render(<AuthInfo currentUser={currentUser} />);

  // Assert
  expect(queryByText(`Username: ${username}`)).toBeTruthy();
  expect(queryByText(`Display Name: ${displayName}`)).toBeTruthy();
  expect(queryByText("Is an artist: No")).toBeTruthy();
  expect(queryByText(`Session Token: ${sessionToken}`)).toBeTruthy();
  expect(queryByText("Authenticated: Yes")).toBeTruthy();
});

it("displays if a user is an artist", async () => {
  // Arrange
  const username = "fakeUsername";
  const displayName = "Fake Display Name";
  const isArtist = true;
  const sessionToken = "fakeSessionToken";
  const authenticated = true;
  const currentUser = {
    get: (key) => {
      switch(key) {
      case "name":
        return displayName;
      case "isArtist":
        return isArtist;
      default:
        return undefined;
      }
    },
    getUsername: () => username,
    getSessionToken: () => sessionToken,
    authenticated: () => authenticated
  };

  // Act
  const {queryByText} = render(<AuthInfo currentUser={currentUser} />);

  // Assert
  expect(queryByText(`Username: ${username}`)).toBeTruthy();
  expect(queryByText(`Display Name: ${displayName}`)).toBeTruthy();
  expect(queryByText("Is an artist: Yes")).toBeTruthy();
  expect(queryByText(`Session Token: ${sessionToken}`)).toBeTruthy();
  expect(queryByText("Authenticated: Yes")).toBeTruthy();
});
