import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from "@testing-library/react";

import SubmitReview from "./SubmitReview";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Review() {
        return {
          save: () => Promise.resolve({id: "newId"})
        };
      }
    )
  }
}));

afterEach(cleanup);

it("sends request and displays success message", async () => {
  const {container, getByLabelText, queryByText} = render(
    <SubmitReview currentUser={{id: "fakeUserId"}} />
  );

  const txtSongName = getByLabelText(/^Song name:/i);
  fireEvent.change(txtSongName, {target: {value: "song name"}});
  const txtRating = getByLabelText(/^Rating:/i);
  fireEvent.change(txtRating, {target: {value: 2}});
  const txtReview = getByLabelText(/^Review:/i);
  fireEvent.change(txtReview, {target: {value: "song review"}});

  fireEvent.submit(container.querySelector("form[name=\"reviewForm\"]"));

  await waitForElement(() => queryByText(/Review posted successfully/i));
  expect(queryByText(/Review posted successfully/i)).toBeTruthy();
});
