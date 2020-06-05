import React from "react";
import {BrowserRouter as Router} from "react-router-dom";

import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import SubmitSong from "./SubmitSong";

const mockSongSet = jest.fn();
const mockSongSave = jest.fn();

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Song() {
        return {
          save: mockSongSave,
          set: mockSongSet,
        };
      }
    )
  },
  Query: function Query(className) {
    switch (className) {
    case "song":
      return {
        set: () => ({mockSongSet}),
        save: () => ({mockSongSave})
      };
    default:
      return {};
    }
  }
}));

afterEach(() => {
  cleanup();
  mockSongSet.mockClear();
  mockSongSave.mockClear();
});

it("show an error if the song name is empty", async () => {
  // Arrange
  const inputSongName = "";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <Router>
      <SubmitSong
        currentUser={propUser}
      />
    </Router>
  );
  const songNameInputElement = getByLabelText(/^Song Name/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songNameInputElement,
      {target: {value: inputSongName}}
    );
    await fireEvent.click(queryByText(/Submit Song/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/This field is required/i)).toBeTruthy();
});

it("shows an error if the URL is not valid", async () => {
  // Arrange
  const inputSongArt = "localhostcoverjpg";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <Router>
      <SubmitSong
        currentUser={propUser}
      />
    </Router>
  );
  const songArtInputElement = getByLabelText(/^Cover Art/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songArtInputElement,
      {target: {value: inputSongArt}}
    );
    await fireEvent.click(queryByText(/Submit Song/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/Needs to be a valid link/i)).toBeTruthy();
});

it("allows specifying no album art", async () => {
  // Arrange
  const inputSongName = "fake name";
  const inputCoverArt = "";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <Router>
      <SubmitSong
        currentUser={propUser}
      />
    </Router>
  );
  const coverArtInputElement = getByLabelText(/^Cover Art/i);
  const songNameInputElement = getByLabelText(/^Song Name/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      coverArtInputElement,
      {target: {value: inputCoverArt}}
    );
    await fireEvent.input(
      songNameInputElement,
      {target: {value: inputSongName}}
    );
    await fireEvent.click(queryByText(/Submit Song/, {selector: "input"}));
  });

  // Assert
  expect(mockSongSet.mock.calls.length).toBe(3);
  expect(mockSongSet.mock.calls[2][1]).toBe(inputCoverArt);
  expect(mockSongSave.mock.calls.length).toBe(1);
});
