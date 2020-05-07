import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from "@testing-library/react";
import AddItem from "./AddItem";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Test() {
        return {
          save: () => Promise.resolve({id: "thisIsAnId"})
        };
      }
    )
  },
  Query: function Query() {
    return {
      limit: () => ({
        addDescending: () => ({
          exists: () => {}
        })
      })
    };
  }
}));

afterEach(cleanup);

it("sends request and displays response id on enter", async () => {
  const {getByLabelText, getByText} = render(<AddItem />);

  const textInput = getByLabelText(/^JSON:/i);

  fireEvent.keyPress(
    textInput,
    {
      key: "Enter",
      code: "Enter",
      charCode: 13,
      target: {
        value: "{\"userId\":\"muddin\",\"artist\":\"JPEGMAFIA\",\"song\":"
                 + "\"BALD!\",\"rating\":4.5,\"review\":\"Iss a test\"}"
      }
    }
  );

  await waitForElement(() => getByText(/thisIsAnId/i));
  expect(getByText(/thisIsAnId/i)).toBeTruthy();
});
