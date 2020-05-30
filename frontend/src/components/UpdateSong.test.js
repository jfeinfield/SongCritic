import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import UpdateSong from "./UpdateSong";

const mockSongObj = jest.fn();

jest.mock("parse", () => ({
  Object: {
    extend: (name) => name
  },
  Query: function Query(className) {
    switch (className) {
    case "song":
      return {
        get: () => mockSongObj
      };
    default:
      return {};
    }
  }
}));

afterEach(cleanup);

it("shows errors if required fields are empty", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const propSongName = "fakeSongName";
  const propSongArt = "fakeSongArt";
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
  const songNameInput = getByLabelText(/^Song Name/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(songNameInput, {target: {value: inputSongName}});
    await fireEvent.click(queryByText(/Update/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/This field is required/i)).toBeTruthy();
});

afterEach(cleanup);
