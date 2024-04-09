import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BookRepository } from "../repositories/bookRepository";


let mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Integration Repository Testing", () => {
  let bookRepository: BookRepository;

  beforeEach(async () => {
    bookRepository = new BookRepository();
  });

  describe("Repository of Books", () => {
    test("Create a Books method", async () => {
      const MOCK_BOOK = {
        title: "Test Book",
        author: "Test Author",
        pages: 200,
      };

      const newBook = await bookRepository.createABook(MOCK_BOOK);

      // Assert
      expect(newBook).toBeDefined();
      expect(newBook.title).toEqual(MOCK_BOOK.title);
      expect(newBook.author).toEqual(MOCK_BOOK.author);
      expect(newBook.pages).toEqual(MOCK_BOOK.pages);

      // Check if the book exists
      const foundBook = await bookRepository.getABook(newBook.id); // Assuming getABook takes the created book's ID
      expect(foundBook).toBeDefined();
      expect(foundBook?.title).toEqual(MOCK_BOOK.title);
    });

    test("Find all Books method", async () => {
      // Create some mock books
      const MOCK_BOOKS = [
        { title: "Book 1", author: "Author 1", pages: 100 },
        { title: "Book 2", author: "Author 2", pages: 150 },
      ];

      // Insert the mock books into the database
      await Promise.all(
        MOCK_BOOKS.map((book) => bookRepository.createABook(book))
      );

      // Get all books
      const allBooks = await bookRepository.getallBook();

      // Assert
      expect(allBooks).toBeDefined();
      expect(allBooks.length).toBeGreaterThanOrEqual(1);
    });

    test("Delete a Book method", async () => {
      const MOCK_BOOK = {
        title: "Test Book",
        author: "Test Author",
        pages: 200,
      };

      // create a book
      const newBook = await bookRepository.createABook(MOCK_BOOK);

      // delete a book
      const deletedBook = await bookRepository.deleteBook(newBook.id);

      // found a book
      const findAbook = await bookRepository.getABook(newBook.id);

      // Assertions
      expect(findAbook).toBeFalsy(); // Expect no book found after deletion
      // OR (alternative assertion)
      expect(findAbook).toBeNull(); // Expect getABook to return null for non-existent book
    });

    test("Update a Book method", async () => {
      // Create a mock book
      const MOCK_BOOK = {
        title: "Test Book",
        author: "Test Author",
        pages: 200,
      };
      
      // Create the book
      let newBook = await bookRepository.createABook(MOCK_BOOK);
      
      // Update the book (modify the MOCK_BOOK object)
      // MOCK_BOOK.title = "Test a Book";
      // MOCK_BOOK.pages = 120;

      const MOCK_BOOK2 = {
        title: "Test Book2",
        author: "Test Author2",
        pages: 2002,
      };
    
      // Update the book in the database
      const updatedBook = await bookRepository.updateABook(newBook.id, MOCK_BOOK2);
    
      // Assertions for update
      expect(updatedBook).toBeTruthy(); // Expect an updated book object to be returned
      expect(updatedBook?.id).toEqual(newBook.id); // Check if ID remains the same after update
      expect(updatedBook?.title).toEqual(MOCK_BOOK.title); // Check if title is updated
      expect(updatedBook?.pages).toEqual(MOCK_BOOK.pages); // Check if pages are updated
    });
  });
});
