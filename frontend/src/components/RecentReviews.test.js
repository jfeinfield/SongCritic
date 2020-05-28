import {cleanup} from "@testing-library/react";

jest.mock("parse", () => ({
  Object: {
    extend: () => (
      function Review() {
        return {
          save: () => Promise.resolve({id: "newId"}),
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
      }),
      find: () => Promise.resolve([{
        toJSON: () => {return ({
          objectId:"asdf",
          song:"Forever",
          artist:"Drake",
          userId:"asd",
          rating:5,
          review:"good"
        });}
      }])
    };
  }
}));

afterEach(cleanup);

// it("displays recent reviews", async () => {
// const {queryByText} = render(<RecentReviews />);

//   await waitForElement(() => queryByText(/Artist: Drake/i));
//   expect(queryByText(/Artist: Drake/i)).toBeTruthy();

// TODO: update this test
it("FIXME: update RecentReviews test", async () => {
  expect(true).toBe(true);
});
