import React from "react";
import {cleanup, render} from "@testing-library/react";

import AuthInfo from "./AuthInfo";

afterEach(cleanup);

it("handles a null currentUser", async () => {
  const {queryByText} = render(<AuthInfo currentUser={null} errorMsg="" />);

  expect(queryByText("Username: n/a")).toBeTruthy();
  expect(queryByText("Session Token: n/a")).toBeTruthy();
  expect(queryByText("Authenticated: No")).toBeTruthy();
});

it("displays currentUser info", async () => {
  const {queryByText} = render(
    <AuthInfo
      currentUser={{
        getUsername: () => "fakeUsername",
        getSessionToken: () => "fakeSessionToken",
        authenticated: () => true
      }}
      errorMsg=""
    />
  );

  expect(queryByText("Username: fakeUsername")).toBeTruthy();
  expect(queryByText("Session Token: fakeSessionToken")).toBeTruthy();
  expect(queryByText("Authenticated: Yes")).toBeTruthy();
});

it("displays error messages", async () => {
  const {queryByText} = render(
    <AuthInfo currentUser={null} errorMsg="Fake error message"/>
  );

  expect(queryByText(/Fake error message/i)).toBeTruthy();
});

it("hides empty error messages", async () => {
  const {queryByText} = render(<AuthInfo currentUser={null} errorMsg="" />);

  expect(queryByText(/Error/i)).toBeFalsy();
});
