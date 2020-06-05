import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import SubmitReview from "./SubmitReview";

const mockReviewSet = jest.fn();
const mockReviewSave = jest.fn();
const mockHandleReviewSubmit = jest.fn();

jest.mock("parse", () => ({
  Object: {
    extend: (str) => {
      switch (str) {
      case "review":
        return (
          function Review() {
            return {
              // save: () => Promise.resolve({ id: "newId" })
              set: () => ({mockReviewSet}),
              save: () => ({mockReviewSave})
            };
          }
        );
      case "song":
        return {
          get: () => ({
            toJSON: () => ({
              name: "fakeSongName",
              artist: {
                objectId: "fakeArtistObjectId"
              }
            })
          })
        };
      default:
        return {};
      }
    }
  },
  Query: function Query(className) {
    switch (className) {
    case "review":
      return {
        set: () => ({mockReviewSet}),
        save: () => ({mockReviewSave})

      };
    case "song":
      return {
        get: () => ({
          toJSON: () => ({
            name: "fakeSongName",
            artist: {
              objectId: "fakeArtistObjectId"
            }
          })
        })
      };
    default:
      return {};
    }
  }
}));

afterEach(() => {
  cleanup();
  mockReviewSet.mockClear();
  mockReviewSave.mockClear();
  mockHandleReviewSubmit.mockClear();
});

it("show an error if the rating is empty", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const inputRating = "";
  const inputReview = "fake review";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <SubmitReview
      currentUser={propUser}
      songId={propSongId}
      handleSubmitReview={mockHandleReviewSubmit}
    />
  );
  const ratingInputElement = getByLabelText(/^Rating/i);
  const reviewInputElement = getByLabelText(/^Review/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      ratingInputElement,
      {target: {value: inputRating}}
    );
    await fireEvent.input(
      reviewInputElement,
      {target: {value: inputReview}}
    );
    await fireEvent.click(queryByText(/Submit Review/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/This field is required/i)).toBeTruthy();
});

it("show an error if the review is empty", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const inputRating = "3";
  const inputReview = "";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <SubmitReview
      currentUser={propUser}
      songId={propSongId}
      handleSubmitReview={mockHandleReviewSubmit}
    />
  );
  const ratingInputElement = getByLabelText(/^Rating/i);
  const reviewInputElement = getByLabelText(/^Review/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      ratingInputElement,
      {target: {value: inputRating}}
    );
    await fireEvent.input(
      reviewInputElement,
      {target: {value: inputReview}}
    );
    await fireEvent.click(queryByText(/Submit Review/, {selector: "input"}));
  });

  // Assert
  expect(queryByText(/This field is required/i)).toBeTruthy();
});

it("Display review on success", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const inputRating = "3";
  const inputReview = "fake review";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText,
    debug
  } = render(
    <SubmitReview
      currentUser={propUser}
      songId={propSongId}
      handleSubmitReview={mockHandleReviewSubmit}
    />
  );
  const ratingInputElement = getByLabelText(/^Rating/i);
  const reviewInputElement = getByLabelText(/^Review/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      ratingInputElement,
      {target: {value: inputRating}}
    );
    await fireEvent.input(
      reviewInputElement,
      {target: {value: inputReview}}
    );
    await fireEvent.click(queryByText(/Submit Review/, {selector: "input"}));
  });
  debug();

  // Assert
  // expect(queryByText(/fake review/i)).toBeTruthy();
  expect(mockReviewSet.mock.calls.length).toBe(4);
  expect(mockReviewSet.mock.calls[0][1]).toBe(inputRating);
  expect(mockReviewSet.mock.calls[1][1]).toBe(inputReview);
  expect(mockReviewSave.mock.calls.length).toBe(1);
});

it("calls handleSubmitReview with form info", async () => {
  // Arrange
  const propSongId = "fakeSongId";
  const inputRating = "3";
  const inputReview = "fake review";
  const propUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    getByLabelText
  } = render(
    <SubmitReview
      currentUser={propUser}
      songId={propSongId}
      handleSubmitReview={mockHandleReviewSubmit}
    />
  );
  const ratingInputElement = getByLabelText(/^Rating/i);
  const reviewInputElement = getByLabelText(/^Review/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(
      ratingInputElement,
      {target: {value: inputRating}}
    );
    await fireEvent.input(
      reviewInputElement,
      {target: {value: inputReview}}
    );
    await fireEvent.click(queryByText(/Submit Review/, {selector: "input"}));
  });

  // Assert
  // expect(queryByText(/fake review/i)).toBeTruthy();
  expect(mockHandleReviewSubmit.mock.calls.length).toBe(1);
  expect(mockHandleReviewSubmit.mock.calls[0][0]).toBe(inputRating);
  expect(mockHandleReviewSubmit.mock.calls[0][1]).toBe(inputReview);
});
