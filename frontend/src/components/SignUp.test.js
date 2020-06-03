import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import SignUp from "./SignUp";

afterEach(cleanup);

it("shows errors passed from its parent", async () => {
  // Arrange
  const errorMsg = "this is a fake error message";

  // Act
  const {
    queryByText
  } = render(<SignUp handleSignUp={() => {}} errorMsg={errorMsg} />);

  // Assert
  expect(queryByText(errorMsg)).toBeTruthy();
});

it("shows errors if required fields are empty", async () => {
  // Arrange

  // Act
  const {
    queryByText,
    queryAllByText
  } = render(<SignUp handleSignUp={() => {}} />);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.click(queryByText(/Sign Up/, {selector: "input"}));
  });

  // Assert
  expect(queryAllByText("This field is required").length).toBe(3);
});

it("shows errors if inputs are too short", async () => {
  // Arrange
  const displayName = "ha";
  const username = "ha";
  const password = "ha";

  // Act
  const {
    getByLabelText,
    queryByText,
    queryAllByText
  } = render(<SignUp handleSignUp={() => {}} />);
  const displayNameInput = getByLabelText(/^Display/i);
  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(displayNameInput, {target: {value: displayName}});
    await fireEvent.input(usernameInput, {target: {value: username}});
    await fireEvent.input(passwordInput, {target: {value: password}});
    await fireEvent.click(queryByText(/Sign Up/, {selector: "input"}));
  });

  // Assert
  expect(
    queryAllByText("This field must contain at least 4 characters").length
  ).toBe(3);
});

it("calls handleLogIn with the form data", async () => {
  // Arrange
  const displayName = "fakeDisplayName";
  const username = "fakeUname";
  const password = "fakePwd";
  const mockHandleSignUp = jest.fn();

  // Act
  const {
    getByLabelText,
    queryByText
  } = render(<SignUp handleSignUp={mockHandleSignUp} />);
  const displayNameInput = getByLabelText(/^Display/i);
  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(displayNameInput, {target: {value: displayName}});
    await fireEvent.input(usernameInput, {target: {value: username}});
    await fireEvent.input(passwordInput, {target: {value: password}});
    await fireEvent.click(queryByText(/Sign Up/, {selector: "input"}));
  });

  // Assert
  expect(mockHandleSignUp.mock.calls.length).toBe(1);
  expect(mockHandleSignUp.mock.calls[0][0]).toBe(false);
  expect(mockHandleSignUp.mock.calls[0][1]).toBe(displayName);
  expect(mockHandleSignUp.mock.calls[0][2]).toBe(username);
  expect(mockHandleSignUp.mock.calls[0][3]).toBe(password);
});
