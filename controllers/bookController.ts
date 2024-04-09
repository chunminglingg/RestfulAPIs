import { Post, Route, Delete, Path, Body, Get, Put } from "tsoa";
import { BookService } from "../services/book.service";
import { StatusCode } from "../utils/statusCode";
import { BaseCustomError } from "../utils/classError";

interface Book {
  id?: number;
  title: string;
  author: string;
  pages: number;
}

@Route("v1/books")
export class BookController {
  [x: string]: any;
  constructor(private readonly bookService: BookService) {}

  @Get("/")
  public async getAllBooks(): Promise<Book[]> {
    try {
      const books = await this.bookService.getAllBooks();
      return books;
    } catch (error) {
      throw error;
    }
  }

  @Get("/{id}")
  public async getBookById(@Path() id: string): Promise<Book> {
    try {
      const book = await this.bookService.getBookById(id);
      if (!book) {
        throw new BaseCustomError("Not found", StatusCode.NotFound);
      }
      return book;
    } catch (error) {
      throw error;
    }
  }

  @Post("/")
  public async createBook(@Body() requestBook: Book): Promise<Book> {
    const { title, author, pages } = requestBook;
    try {
      const newBook = await this.bookService.createBook({
        title,
        author,
        pages,
      });
      return newBook;
    } catch (error) {
      throw error;
    }
  }

  @Put("/{id}")
  public async updateBook(
    @Path() id: string,
    @Body() requestBook: Book
  ): Promise<Book> {
    try {
      const { title, author, pages } = requestBook;
      const updatedBook = await this.bookService.updateBook(id, {
        title,
        author,
        pages,
      });
      if (!updatedBook) {
        throw new BaseCustomError("Not found", StatusCode.NotFound);
      }
      return updatedBook;
    } catch (error) {
      throw error;
    }
  }

  @Delete("/{id}")
  public async deleteBook(@Path() id: string): Promise<Book> {
    try {
      const deletedBook = await this.bookService.deleteBook(id);
      if (!deletedBook) {
        throw new BaseCustomError("Not found", StatusCode.NotFound);
      }
      return deletedBook;
    } catch (error) {
      throw error;
    }
  }
}
