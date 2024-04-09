import express, { NextFunction, Response, Request, Router } from "express";
import { validate } from "../middlewares/Validateusage";
import { createBookSchema } from "../validations/Schema";
import { BookController } from "../controllers/bookController";
import { BookService } from "../services/book.service";
import { StatusCode } from "../utils/statusCode";

export const route = express.Router();
const BookControllers = new BookController(new BookService());

// // Get all Books
// router.get("/", g=> {etBooks);
route.get("/", async (req: Request, res: Response, _next: NextFunction) => {
  const books = await BookControllers.getAllBooks();
  res.status(StatusCode.OK).json({ data: books });
});

//GET a specific student
route.get(
  "/:id",
  validate(createBookSchema),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const student = await BookControllers.getBookById(req.params.id);
      res.status(StatusCode.OK).json({ data: student });
    } catch (error) {
      _next(error);
    }
  }
);

// route.get("/books", async (req: Request, res: Response, id) => {
//   const books = await BookControllers.getStudentById(id);
//   res.status(StatusCode.OK).json({ data: books });
// });

// // Get a single Book
// router.get("/:id", mongooseMid, getBook);

// // create book
// router.post(
//   "/",
//   validate(createBookSchema),
//   async (req: Request, res: Response, _next: NextFunction) => {
//     try {
//       const bookController = new BookController(new BookService());
//       const newBook = await bookController.createBook(req.body);
//       res.status(StatusCode.Created).json({ data: newBook });
//     } catch (error) {
//       _next(error);
//     }
//   }
// );

// // Delete a Book
// router.delete("/:id", mongooseMid, deleteBook);

// //Update a book
// router.patch("/:id", mongooseMid, validate(createBookSchema), updateBook);
