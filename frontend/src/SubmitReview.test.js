import React from "react";
import { cleanup, fireEvent, render, waitForElement } from "@testing-library/react";
import SubmitReview from "./SubmitReview";


jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Review() {
        return {
          save: () => Promise.resolve({ id: "newId" })
        };
      }
    )
  }
}));

afterEach(cleanup);

it("sends request and displays success message", async () => {
  const { getByLabelText, getByText } = render(<SubmitReview userId={1} />);

  const txtSongName = getByLabelText(/^Song name:/i);
  fireEvent.change(txtSongName, { target: { value: "song name" } });
  const txtRating = getByLabelText(/^Rating:/i);
  fireEvent.change(txtRating, { target: { value: 2 } });
  const txtReview = getByLabelText(/^Review:/i);
  fireEvent.change(txtReview, { target: { value: "song review" } });

  // Click button
  fireEvent.click(getByText('Submit Review'))

  // Wait for page to update with results
  await waitForElement(() => getByText(/Review posted successfully/i));
  expect(getByText(/Review posted successfully/i)).toBeTruthy()
});
