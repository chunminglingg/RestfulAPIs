import request from "supertest";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import booksModels from "../../db/models/booksModels";
import { StatusCode } from "../../utils/statusCode";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Books API", () => {
  // Create a sample book before tests
  let createdBookId: string;
  beforeEach(async () => {
    const book = { title: "Test Book", author: "Test Author", pages: 150 };
    const response = await request(app).post("/api/books").send(book);
    createdBookId = response.body._id; // Assuming the ID is stored in a property named "_id"
  });

  // GET /api/books (Get All Books)
  // test("GET /api/books - Get all books", async () => {
  //   const response = await request(app).get("/api/books");

  //   const MOCK_BOOK = {
  //     title: "Test Book",
  //     author: "Test Author",
  //     pages: 150,
  //   }
  //   const MOCK_BOOK2 = {
  //     title: "Test Book",
  //     author: "Test Author",
  //     pages: 150,
  //   }

  //   console.log("res body :" , response.body);
  //   expect(response.status).toBe(StatusCode.OK);
  //   expect(response.body).toBeInstanceOf(Array); // Ensure an array is returned
  // });

  // GET /api/books/:id (Get Book by ID)
  // test("GET /api/books/:id - Get a book by ID (success)", async () => {
  //   const newBook = await booksModels.create({
  //     title: "Test Book",
  //     author: "Test Author",
  //     pages: 150,
  //   });
  //   const response = await request(app).get(`/api/books/${newBook._id}`).expect(200);

  //   expect(response.body.status).toBe(StatusCode.OK);
  //   expect(response.body.data).toEqual({
  //     title: "Test Book",
  //     author: "Test Author",
  //     pages: 150,
  //     _id: newBook._id,
  //     createdAt: expect.any(String),
  //     updatedAt: expect.any(String),
  //     __v: 0,
  //     // Assert ID matches
  //   });
  // });

// Post 
describe("POST", () => {
  it("should create a new book", async () => {
    const book = { title: "Test Book", author: "Test Author", pages: 150 };
    
    const response = await request(app).post("/api/books").send(book);
    
    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(book.title);
    expect(response.body.author).toBe(book.author);
    expect(response.body.pages).toBe(book.pages);
  });
});


//   // Make the request (correct endpoint)
//   const response = await request(app)
//     .patch(`/api/books/${newBook._id}`)
//     .send({ title: "Update book", author: "Update Author", pages: 120 });

//   // Assert on response status and body
//   expect(response.status).toBe(StatusCode.OK);
//   expect(response.body).toEqual({
//     title: "Update book",
//     author: "Update Author",
//     pages: 120,
//     _id: newBook._id,  // No need for toString()
//     createdAt: expect.any(String),
//     updatedAt: expect.any(String),
//     __v: 0,
//   });
// });

});
