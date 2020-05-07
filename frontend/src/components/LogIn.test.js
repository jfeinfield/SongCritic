import React from "react";
import {
  cleanup,
  fireEvent,
  render
} from "@testing-library/react";

import LogIn from "./LogIn";

afterEach(cleanup);

it("clears fields upon submit", async () => {
  const {getByLabelText, queryByText} = render(
    <LogIn handleLogIn={() => {}} />
  );

  const usernameInput = getByLabelText(/^Username/i);
  const passwordInput = getByLabelText(/^Password/i);

  fireEvent.change(usernameInput, {target: {value: "uname"}});
  fireEvent.change(passwordInput, {target: {value: "pwd"}});
  fireEvent.click(queryByText("Log In", {selector: "input"}));

  expect(usernameInput.value).toBe("");
  expect(passwordInput.value).toBe("");
});
