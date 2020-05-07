import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";

import SignUp from "./SignUp";

afterEach(cleanup);

it("clears fields upon submit", async () => {
  const {getByLabelText, queryByText} = render(
    <SignUp handleSignUp={() => {}} />
  );

  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);

  fireEvent.change(usernameInput, {target: {value: "uname"}});
  fireEvent.change(passwordInput, {target: {value: "pwd"}});
  fireEvent.click(queryByText("Sign Up", {selector: "input"}));

  expect(usernameInput.value).toBe("");
  expect(passwordInput.value).toBe("");
});
