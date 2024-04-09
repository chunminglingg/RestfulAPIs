import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().trim().min(10, "Title is required and cannot be empty"),
  author: z.string().trim().min(10, "Author is required and cannot be empty"),
  pages: z.number().int().positive("Pages must be a positive integer"),
  
});
