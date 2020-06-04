import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from "@testing-library/react";

import Search from "./Search";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Song() {
        return {
          save: () => Promise.resolve({id: "newId"})
        };
      }
    )
  },
  Query: function Query() {
    return {
      fullText: () => ({
        limit: () => {}
      }),
      find: () => Promise.resolve([])
    };
  }
}));

afterEach(cleanup);

it("displays no results found if no results found", async () => {
  const {getByTestId, queryByText, getAllByText} = render(<Search />);

  const textInput = getByTestId("searchTerm");
  fireEvent.change(textInput, {target: {value: "song that doesn't exist"}});
  fireEvent.click(getAllByText("Search")[1]);

  await waitForElement(() => queryByText(/No artist results found/i));
  expect(queryByText(/No artist results found/i)).toBeTruthy();
  expect(queryByText(/No song results found/i)).toBeTruthy();
});
