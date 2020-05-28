import React from "react";
import {
  cleanup,
  render,
  waitForElement,
  fireEvent
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import Review from "./Review";

jest.mock("parse", () => ({
  Object: {
    extend: (name) => name
  },
  Query: function Query(className) {
    switch (className) {
    case "review":
      return {
        get: () => ({
          toJSON: () => ({
            objectId: "fakeObjectId",
            author: {
              objectId: "fakeAuthorObjectId"
            },
            song: {
              objectId: "fakeSongObjectId"
            },
            review: "fakeReviewText",
            rating: 2.5
          })
        })
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
    case "User":
      return {
        get: (objectId) => {
          switch (objectId) {
          case "fakeAuthorObjectId":
            return {
              toJSON: () => ({
                name: "fakeAuthorName"
              })
            };
          case "fakeArtistObjectId":
            return {
              toJSON: () => ({
                name: "fakeArtistName"
              })
            };
          default:
            return {};
          }
        }
      };
    default:
      return {};
    }
  }
}));

jest.mock("react-router-dom", () => ({
  Link: (props) => {
    // eslint-disable-next-line react/prop-types
    const {to, children} = props;

    return (<span>{to} {children}</span>);
  }
}));

afterEach(cleanup);

it("renders when provided the review id", async () => {
  // Arrange
  // done in mock above

  // Act
  const {queryByText} = render(<Review reviewId="garbage" />);
  await waitForElement(() => queryByText(/fakeAuthorName/i));

  // Assert
  expect(queryByText(/fakeAuthorName/i)).toBeTruthy();
  expect(queryByText(/fakeArtistName/i)).toBeTruthy();
  expect(queryByText(/fakeSongName/i)).toBeTruthy();
  expect(queryByText(/fakeReviewText/i)).toBeTruthy();
});

it("renders link when prop is specified", async () => {
  // Arrange
  // done in mock above

  // Act
  const {
    queryByText
  } = render(<Review reviewId="garbage" showLinkToSong />);
  await waitForElement(() => queryByText(/fakeArtistName/i));

  // Assert
  expect(queryByText(/Visit song page for/i)).toBeTruthy();
});

it("doesn't render some info when listing is specified", async () => {
  // Arrange
  // done in mock above

  // Act
  const {
    queryByText
  } = render(<Review reviewId="garbage" isListing />);
  await waitForElement(() => queryByText(/fakeAuthorName/i));

  // Assert
  expect(queryByText(/fakeAuthorName/i)).toBeTruthy();
  expect(queryByText(/fakeReviewText/i)).toBeTruthy();
  expect(queryByText(/fakeArtistName/i)).toBeFalsy();
  expect(queryByText(/fakeSongName/i)).toBeFalsy();
});

it("renders the edit button when currentUser is the author", async () => {
  // Arrange
  const currentUser = {id: "fakeAuthorObjectId"};

  // Act
  const {
    queryByText
  } = render(<Review currentUser={currentUser} reviewId="garbage" />);
  await waitForElement(() => queryByText(/fakeAuthorName/i));

  // Assert
  expect(queryByText(/Edit Review/i)).toBeTruthy();
});

it("renders the edit form when the eddit button is pressed", async () => {
  // Arrange
  const currentUser = {id: "fakeAuthorObjectId"};

  // Act
  const {
    queryByText
  } = render(<Review currentUser={currentUser} reviewId="garbage" />);
  await waitForElement(() => queryByText(/fakeAuthorName/i));
  await act(async () => {
    await fireEvent.click(queryByText(/Edit Review/i, {selector: "button"}));
  });

  // Assert
  expect(queryByText(/Rating/i, {selector: "label"})).toBeTruthy();
  expect(queryByText(/Review/i, {selector: "label"})).toBeTruthy();
  expect(queryByText(/Update Review/i, {selector: "input"})).toBeTruthy();
  expect(queryByText(/Delete Review/i, {selector: "button"})).toBeTruthy();
});
