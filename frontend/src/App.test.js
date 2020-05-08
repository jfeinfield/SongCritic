import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from "@testing-library/react";

import mockUser from "./mockUser";
import App from "./App";

jest.mock("parse", () => ({
  initialize: () => {},
  serverURL: 0,
  User: mockUser,
  Object: {
    extend: () => (
      function Review() {
        return {
          save: () => Promise.resolve({id: "newId"})
        };
      }
    )
  },
  Query: function Query() {
    return {
      limit: Query,
      addDescending: Query,
      exists: Query,
      find: () => Promise.resolve([])
    };
  }
}));

afterEach(cleanup);

it("populates currentUser on sign up", async () => {
  const {queryAllByLabelText, queryByText} = render(<App />);

  const usernameInput = queryAllByLabelText(/^Username/i)[0];
  const passwordInput = queryAllByLabelText(/^Password/i)[0];

  fireEvent.change(usernameInput, {target: {value: "dummy"}});
  fireEvent.change(passwordInput, {target: {value: "dummy"}});
  fireEvent.click(queryByText("Sign Up", {selector: "input"}));

  await waitForElement(() => queryByText(/fakeUsernameSignUp/i));
  expect(queryByText(/fakeUsernameSignUp/i)).toBeTruthy();
});

it("populates currentUser on log in", async () => {
  const {queryAllByLabelText, queryByText} = render(<App />);

  const usernameInput = queryAllByLabelText(/^Username/i)[1];
  const passwordInput = queryAllByLabelText(/^Password/i)[1];

  fireEvent.change(usernameInput, {target: {value: "dummy"}});
  fireEvent.change(passwordInput, {target: {value: "dummy"}});
  fireEvent.click(queryByText("Log In", {selector: "input"}));

  await waitForElement(() => queryByText(/fakeUsernameLogIn/i));
  expect(queryByText(/fakeUsernameLogIn/i)).toBeTruthy();
});

it("clears currentUser on log out", async () => {
  const {queryAllByLabelText, queryByText} = render(<App />);

  const usernameInput = queryAllByLabelText(/^Username/i)[1];
  const passwordInput = queryAllByLabelText(/^Password/i)[1];

  fireEvent.change(usernameInput, {target: {value: "dummy"}});
  fireEvent.change(passwordInput, {target: {value: "dummy"}});
  fireEvent.click(queryByText("Log In", {selector: "input"}));

  await waitForElement(() => queryByText(/fakeUsernameLogIn/i));
  fireEvent.click(queryByText(/Log Out/i));

  await waitForElement(() => queryByText(/Username: n\/a/i));
  expect(queryByText(/Username: n\/a/i)).toBeTruthy();
});
