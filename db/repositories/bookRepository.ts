import booksModels from "../models/booksModels";

export class BookRepository {

  // Get all books
  async getallBook() {
    const books = await booksModels.find({})
    return books;
  }

  // Get a single book
  async getABook(id: string) {
    const book = await booksModels.findById(id);
    return book;
  }

  // Create a book 
  async createABook(data: object) {
    const book = new booksModels(data);
    return await book.save();
  }
  

  // Update a book
  async updateABook(id:string ,data:object ) {
    return await booksModels.findByIdAndUpdate(id,data)
  }
  
  // Delete a book
  async deleteBook(_id:string){
    const book = await booksModels.findByIdAndDelete(_id);
    if (!book) {
      throw new Error("Book not Found");
    }
    return book;
  }

}
