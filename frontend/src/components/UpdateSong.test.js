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
const mockHandleSongUpdate = jest.fn();

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
  mockHandleSongUpdate.mockClear();
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
      handleSongUpdate={mockHandleSongUpdate}
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
      handleSongUpdate={mockHandleSongUpdate}
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

it("shows a message on success", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "https://localhost/cover.jpg";
  const inputSongName = "fakeNewSongName";
  const inputCoverArt = "https://localhost/cover.jpg";

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <UpdateSong
      songId={propSongId}
      songName={propSongName}
      songArt={propSongArt}
      handleSongUpdate={mockHandleSongUpdate}
    />
  );
  const songNameInputElement = getByLabelText(/^Song Name/i);
  const coverArtInputElement = getByLabelText(/^Cover Art/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songNameInputElement,
      {target: {value: inputSongName}}
    );
    await fireEvent.input(
      coverArtInputElement,
      {target: {value: inputCoverArt}}
    );
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/Song details updated!/i)).toBeTruthy();
  expect(mockSongSet.mock.calls.length).toBe(2);
  expect(mockSongSet.mock.calls[0][1]).toBe(inputSongName);
  expect(mockSongSet.mock.calls[1][1]).toBe(inputCoverArt);
  expect(mockSongSave.mock.calls.length).toBe(1);
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
      handleSongUpdate={mockHandleSongUpdate}
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

it("calls handleSongUpdate with form info", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "https://localhost/cover.jpg";
  const inputSongName = "fakeNewSongName";
  const inputCoverArt = "https://localhost/cover.jpg";

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <UpdateSong
      songId={propSongId}
      songName={propSongName}
      songArt={propSongArt}
      handleSongUpdate={mockHandleSongUpdate}
    />
  );
  const songNameInputElement = getByLabelText(/^Song Name/i);
  const coverArtInputElement = getByLabelText(/^Cover Art/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      songNameInputElement,
      {target: {value: inputSongName}}
    );
    await fireEvent.input(
      coverArtInputElement,
      {target: {value: inputCoverArt}}
    );
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/Song details updated!/i)).toBeTruthy();
  expect(mockHandleSongUpdate.mock.calls.length).toBe(1);
  expect(mockHandleSongUpdate.mock.calls[0][0]).toBe(inputSongName);
  expect(mockHandleSongUpdate.mock.calls[0][1]).toBe(inputCoverArt);
});
