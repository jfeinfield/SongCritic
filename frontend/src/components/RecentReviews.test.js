import React from "react";
import {render, waitForElement, cleanup} from "@testing-library/react";

import RecentReviews from "./RecentReviews";

jest.mock("parse", () => ({
  Object: {
    extend: (name) => name
  },
  Query: function Query(className) {
    switch (className) {
    case "review":
      return {
        limit: () => ({
          addDescending: () => ({
            exists: () => {}
          })
        }),
        find: () => [
          {
            toJSON: () => ({
              objectId: "fakeReviewId0"
            })
          }
        ],
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

it("renders recent reviews", async () => {
  // Arrange
  // done in mock above

  // Act
  const {queryByText, queryAllByText} = render(<RecentReviews />);
  await waitForElement(() => queryAllByText(/fakeArtistName/i));

  // Assert
  expect(queryAllByText(/fakeArtistName/i)).toBeTruthy();
  expect(queryAllByText(/fakeAuthorName/i)).toBeTruthy();
  expect(queryByText(/fakeReviewText/i)).toBeTruthy();
});

it("renders links for reviews", async () => {
  // Arrange
  // done in mock above

  // Act
  const {queryAllByText} = render(<RecentReviews />);
  await waitForElement(() => queryAllByText(/fakeArtistName/i));

  // Assert
  expect(queryAllByText(/Visit/i)).toBeTruthy();
});
