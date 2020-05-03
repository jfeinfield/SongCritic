const axios = require('axios').default;

const PARSE_APPLICATION_ID = "HjKymbNGAhUhWwGSAmMDevlJJzVQPgworMQ9Fbud";

test("create an object in the review class", async () => {
  const response = await axios.post(
    "http://localhost:1337/parse/classes/reviewTest",
    {
      "userId": 1,
      "artist": "JPEGMAFIA",
      "song": "BALD!",
      "rating": 4.5,
      "review": "Iss a test"
    },
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}});
  
  expect(response.status).toBe(201);  // 201: Created
});

test("read a created object in the review class", async () => {
  const reviewObject = {
    "userId": 1,
    "artist": "JPEGMAFIA",
    "song": "BALD!",
    "rating": 4.5,
    "review": "Iss a test"
  };

  const createResponse = await axios.post(
    "http://localhost:1337/parse/classes/reviewTest",
    reviewObject,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}});
  
  expect(createResponse.status).toBe(201);  // 201: Created

  const readResponse = await axios.get(
    `http://localhost:1337/parse/classes/reviewTest/${createResponse.data.objectId}`,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}}
  );

  expect(readResponse.status).toBe(200);  // 200: Ok
  expect(readResponse.data.userId).toBe(reviewObject.userId);
  expect(readResponse.data.artist).toBe(reviewObject.artist);
  expect(readResponse.data.song).toBe(reviewObject.song);
  expect(readResponse.data.rating).toBe(reviewObject.rating);
  expect(readResponse.data.review).toBe(reviewObject.review);
});

test("update a created object in the review class", async () => {
  const reviewObject = {
    "userId": 1,
    "artist": "JPEGMAFIA",
    "song": "BALD!",
    "rating": 4.5,
    "review": "Iss a test"
  };

  const createResponse = await axios.post(
    "http://localhost:1337/parse/classes/reviewTest",
    reviewObject,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}});
  
  expect(createResponse.status).toBe(201);  // 201: Created
  
  const newRating = 5;
  const updateResponse = await axios.put(
    `http://localhost:1337/parse/classes/reviewTest/${createResponse.data.objectId}`,
    {"rating": newRating},
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}}
  );

  expect(updateResponse.status).toBe(200);  // 200: Ok

  const readResponse = await axios.get(
    `http://localhost:1337/parse/classes/reviewTest/${createResponse.data.objectId}`,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}}
  );

  expect(readResponse.status).toBe(200);  // 200: Ok
  expect(readResponse.data.rating).toBe(newRating);
});

test("delete a created object in the review class", async () => {
  const reviewObject = {
    "userId": 1,
    "artist": "JPEGMAFIA",
    "song": "BALD!",
    "rating": 4.5,
    "review": "Iss a test"
  };

  const createResponse = await axios.post(
    "http://localhost:1337/parse/classes/reviewTest",
    reviewObject,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}});
  
  expect(createResponse.status).toBe(201);  // 201: Created
  
  const deleteResponse = await axios.delete(
    `http://localhost:1337/parse/classes/reviewTest/${createResponse.data.objectId}`,
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}}
  );

  expect(deleteResponse.status).toBe(200);  // 200: Ok
});

test("read object(s) in the review class", async () => {
  const response = await axios.get(
    "http://localhost:1337/parse/classes/reviewTest",
    {headers: {"X-Parse-Application-Id": PARSE_APPLICATION_ID}}
  );
  
  expect(response.status).toBe(200);  // 200: Ok
  expect(response.data.results.length).toBeGreaterThan(0);
});
