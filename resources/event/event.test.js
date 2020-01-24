/* eslint-disable no-undef */
const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../../app");
const dbConnection = require("../../database");
const Event = require("./event.model");

beforeAll(() => {
  // Connect to MongoDB instance
  dbConnection();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // this function executes and clears out the table before each test
  await Event.remove({});
});

describe("Event model", () => {
  describe("Event Endpoint", () => {
    describe("insert Into Event", () => {
      // this example uses async/await to make it easier to read and understand
      it("should return 201 from the index route with type application/json", async () => {
        const expectedStatusCode = 201;

        // do a get request to our api (server.js) and inspect the response
        const response = await request(app)
          .post("/api/v1/event/create-event")
          .send({ name: "gaffer", description: "some description" });

        expect(response.status).toEqual(expectedStatusCode);
        expect(response.type).toEqual("application/json");
      });

      // it("create an event when an image is provided", async () => {
      //     const expectedStatusCode = 201;
      //   const response = await request(app)
      //     .post("/api/v1/event/create-event")
      //     .attach("image", path.resolve('./mocks/images/mock.png'))
      //     .field({ name: 'sample', description: 'some description' });

      //   console.log(response.body)

      //   expect(response.type).toEqual("application/json");
      //   expect(response.status).toEqual(expectedStatusCode);
      // });

      describe("insert Into Event", () => {
        it("should insert the provided event into the db", async () => {
          const event = await new Event({
            name: "gaffer",
            description: "some description",
          });

          // verify that a new record is inserted
          expect(event.name).toBe("gaffer");
          expect(event.description).toBe("some description");
          expect(event).toHaveProperty("_id");
        });
      });
    });

    // it("should return a JSON object from the index route", async () => {
    //   const expectedBody = { api: "running" };

    //   const response = await request(rouer).get("/");

    //   expect(response.body).toEqual(expectedBody);
    // });

    // it("should return a JSON object from the index route", async () => {
    //   const response = await request(server).get("/");

    //   expect(response.type).toEqual("application/json");
    // });
  });
});
