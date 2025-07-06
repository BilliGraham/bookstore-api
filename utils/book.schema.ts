import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title must be a string",
  }).min(3, {
    message: "Title must be at least 3 characters long",
  }),
  
  author: z.string({
    required_error: "Author is required",
    invalid_type_error: "Author must be a string",
  }).min(3, {
    message: "Author must be at least 3 characters long",
  }),
  
  genre: z.string({
    required_error: "Genre is required",
    invalid_type_error: "Genre must be a string",
  }).min(3, {
    message: "Genre must be at least 3 characters long",
  }),
  
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).nonnegative({
    message: "Price must be a positive number",
  }),
});

export type BookInput = z.infer<typeof BookSchema>;