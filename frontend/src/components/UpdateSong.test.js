import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import UpdateSong from "./UpdateSong";

const mockSongSet = jest.fn();
const mockSongSave = jest.fn();

jest.mock("parse", () => ({
  Object: {
    extend: (name) => name
  },
  Query: function Query(className) {
    switch (className) {
    case "song":
      return {
        get: () => ({
          set: mockSongSet,
          save: mockSongSave
        })
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
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "https://localhost/cover.jpg";
  const inputSongName = "";

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <UpdateSong
      songId={propSongId}
      songName={propSongName}
      songArt={propSongArt}
    />
  );
  const songNameInputElement = getByLabelText(/^Song Name/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songNameInputElement,
      {target: {value: inputSongName}}
    );
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/This field is required/i)).toBeTruthy();
});

it("shows an error if the URL is not valid", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "https://localhost/cover.jpg";
  const inputSongArt = "localhostcoverjpg";

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <UpdateSong
      songId={propSongId}
      songName={propSongName}
      songArt={propSongArt}
    />
  );
  const songArtInputElement = getByLabelText(/^Cover Art/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songArtInputElement,
      {target: {value: inputSongArt}}
    );
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/Needs to be a valid link/i)).toBeTruthy();
});

it("allows specifying no album art", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "https://localhost/cover.jpg";
  const inputCoverArt = "";

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <UpdateSong
      songId={propSongId}
      songName={propSongName}
      songArt={propSongArt}
    />
  );
  const coverArtInputElement = getByLabelText(/^Cover Art/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      coverArtInputElement,
      {target: {value: inputCoverArt}}
    );
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/Song details updated!/i)).toBeTruthy();
  expect(mockSongSet.mock.calls.length).toBe(2);
  expect(mockSongSet.mock.calls[1][1]).toBe(inputCoverArt);
  expect(mockSongSave.mock.calls.length).toBe(1);
});

afterEach(cleanup);
