import React from "react";
import {cleanup, render} from "@testing-library/react";

import Review from "./Review";

afterEach(cleanup);

it("renders when all props are provided", () => {
  const {queryByText} = render(
    <Review
      artist="JPEGMAFIA"
      song="BALD!"
      userId="fakeUserId"
      rating={4.5}
      review="This is a song which was released as a single."
    />
  );

  expect(queryByText(/JPEGMAFIA/i)).toBeTruthy();
  expect(queryByText("BALD!")).toBeTruthy();
  expect(queryByText(/This is a song which was released as a single\./i))
    .toBeTruthy();
});

it("doesn't render when only some props are provided", () => {
  const {queryByText} = render(
    <Review
      artist="JPEGMAFIA"
      song="BALD!"
      review="This is a song which was released as a single."
    />
  );

  expect(queryByText(/JPEGMAFIA/i)).toBeFalsy();
  expect(queryByText("BALD!")).toBeFalsy();
  expect(queryByText(/This is a song which was released as a single\./i))
    .toBeFalsy();
});

it("doesn't render when no props are provided", () => {
  const {container} = render(<Review />);

  expect(container.querySelector("p")).toBeFalsy();
});
