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
          get: (id) => {
            switch (id) {
            case "name":
              return "Fake Display Name";
            case "artist":
              return {id: "fakeArtistId"};
            default:
              return "";
            }

          },
          id: () => {
            return "fakeArtistId";
          }

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
  const username = "fakeUsername";
  const displayName = "Fake Display Name";
  const isArtist = false;
  const sessionToken = "fakeSessionToken";
  const authenticated = true;
  const currentUser = {
    get: (key) => {
      switch (key) {
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
  const {queryByText} = render(<SongPage currentUser={currentUser}/>);
  await waitForElement(() => queryByText(/fakeSongName/i));

  // Assert
  expect(queryByText(/fakeSongName/i)).toBeTruthy();
  expect(queryByText(/fakeArtistName/i)).toBeTruthy();
});

it("renders the edit button when currentUser is the artist", async () => {
  // Arrange
  const username = "fakeUsername";
  const displayName = "Fake Display Name";
  const isArtist = false;
  const sessionToken = "fakeSessionToken";
  const authenticated = true;
  const currentUser = {
    get: (key) => {
      switch (key) {
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
  const {
    queryByText
  } = render(<SongPage currentUser={currentUser} />);
  await waitForElement(() => queryByText(/fakeArtistName/i));

  // Assert
  expect(queryByText(/Update Song Details/i)).toBeTruthy();
});
