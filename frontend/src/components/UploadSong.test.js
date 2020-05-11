import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  waitForElement,
  getByText
} from "@testing-library/react";

import UploadSong from "./UploadSong";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Song() {
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
    <UploadSong currentUser={{id: "fakeUserId"}} />
  );

  const txtSongName = getByLabelText(/^Song name:/i);
  fireEvent.change(txtSongName, {target: {value: "song name"}});
  const txtCoverArt = getByLabelText(/^Cover Art:/i);
  fireEvent.change(txtCoverArt, {target: {value: 2}});

  fireEvent.submit(container.querySelector('form[name="usForm"]'))

  await waitForElement(() => queryByText(/Song posted successfully!/i));
  expect(queryByText(/Song posted successfully!/i)).toBeTruthy();
});
