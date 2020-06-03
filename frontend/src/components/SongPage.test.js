import React from "react";
import {
  cleanup,
  render,
  waitForElement,
} from "@testing-library/react";

import SongPage from "./SongPage";

jest.mock("parse", () => ({
  Object: {
    extend: (name) => name
  },
  Query: function Query(className) {
    switch (className) {
    case "review":
      return {
        equalTo: () => {},
        find: () => Promise.resolve([{
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
        }])
      };
    case "song":
      return {
        get: () => ({
          get: (id) => {
            switch (id) {
            case "name":
              return "fakeSongName";
            case "art":
              return "http://fakeArt.com";
            case "artist":
              return {id: "fakeArtistId"};
            default:
              return "";
            }

          }
        })
      };
    case "User":
      return {
        get: () => ({
          id: "fakeArtistId",
          get: (text) => {
            switch (text) {
            case "name":
              return "fakeArtistName";
            case "artist":
              return {
                id: "fakeArtistId",
                get: (string) => {
                  if (string === "name")
                    return "Fake Display Name";
                  return "";
                }

              };
            default:
              return "";
            }

          },
        })

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
  },
  useParams: () => ({songId: "fakeSongId"}),
  Redirect: () => (<p>This is a redirect</p>)
}));

afterEach(cleanup);

it("renders when provided the song id", async () => {
  // Arrange
  const currentUser = {
    toPointer: () => ({objectId: "testId"}),
    id: "testId"
  };

  // Act
  const {queryByText} = render(<SongPage currentUser={currentUser}/>);
  await waitForElement(() => queryByText(/fakeSongName/i));

  // Assert
  expect(queryByText(/fakeSongName/i)).toBeTruthy();
  expect(queryByText(/fakeArtistName/i)).toBeTruthy();
});

it("renders the edit button when currentUser is the artist", async () => {
  // Arrange
  const currentUser = {
    toPointer: () => ({objectId: "fakeArtistId"}),
    id: "testId"
  };

  // Act
  const {
    queryByText,
    queryAllByText
  } = render(<SongPage currentUser={currentUser} />);
  await waitForElement(() => queryByText(/fakeArtistName/i));

  // Assert
  expect(queryAllByText(/Update/i).length).toBe(2);
});
