import { BookRepository } from "../db/repositories/bookRepository";

export class BookService {
  BookRepository: any;
  static CreateStudentSchema(CreateStudentSchema: any): any {
    throw new Error("Method not implemented.");
  }
  static showStudent() {
    throw new Error("Method not implemented.");
  }
  repo: any;
  constructor() {
    this.repo = new BookRepository();
  }

  // Get all books
  async getAllBooks() {
    const books = await this.BookRepository.getallBook();  
    return books;
  }

  // Get book by id
  async getBookById(id: string) {
    const book = await this.BookRepository.getABook(id);
    return book;
  }

  // Create a book
  async createBook(book: any) {
    const newBook = await this.BookRepository.createABook(book);
    return newBook;
  }
  

  // Delete a book
  async deleteBook(id: string) {
    const deletedBook = await this.BookRepository.deleteBook(id);
    return deletedBook;
  }

  // Update a book
  async updateBook(id: string, book: object) {
    const updatedBook = await this.BookRepository.updateABook(id, book);
    return updatedBook;
  }

}

