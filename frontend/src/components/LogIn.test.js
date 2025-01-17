import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";
import {act} from "react-dom/test-utils";

import LogIn from "./LogIn";

afterEach(cleanup);

it("shows errors passed from its parent", async () => {
  // Arrange
  const errorCode = 0;
  const errorMsg = "this is a fake error message";

  // Act
  const {
    queryByText
  } = render(
    <LogIn
      handleLogIn={() => {}}
      errorMsg={`${errorCode} ${errorMsg}`}
    />
  );

  // Assert
  expect(queryByText(errorMsg)).toBeTruthy();
});

it("shows errors if required fields are empty", async () => {
  // Arrange

  // Act
  const {
    queryByText,
    queryAllByText
  } = render(<LogIn handleLogIn={() => {}} />);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.click(queryByText(/Log In/, {selector: "input"}));
  });

  // Assert
  expect(queryAllByText("This field is required").length).toBe(2);
});

it("shows errors if inputs are too short", async () => {
  // Arrange
  const username = "ha";
  const password = "ha";

  // Act
  const {
    getByLabelText,
    queryByText,
    queryAllByText
  } = render(<LogIn handleLogIn={() => {}} />);
  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(usernameInput, {target: {value: username}});
    await fireEvent.input(passwordInput, {target: {value: password}});
    await fireEvent.click(queryByText(/Log In/, {selector: "input"}));
  });

  // Assert
  expect(
    queryAllByText("This field must contain at least 4 characters").length
  ).toBe(2);
});

it("calls handleLogIn with the form data", async () => {
  // Arrange
  const username = "fakeUname";
  const password = "fakePwd";
  const mockHandleLogIn = jest.fn();

  // Act
  const {
    getByLabelText,
    queryByText
  } = render(<LogIn handleLogIn={mockHandleLogIn} />);
  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);
  // https://react-hook-form.com/faqs#TestingReactHookForm
  await act(async () => {
    await fireEvent.input(usernameInput, {target: {value: username}});
    await fireEvent.input(passwordInput, {target: {value: password}});
    await fireEvent.click(queryByText(/Log In/, {selector: "input"}));
  });

  // Assert
  expect(mockHandleLogIn.mock.calls.length).toBe(1);
  expect(mockHandleLogIn.mock.calls[0][0]).toBe(username);
  expect(mockHandleLogIn.mock.calls[0][1]).toBe(password);
});
