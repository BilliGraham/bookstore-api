import { z } from 'zod';

/**
 * Schema definition for a Book object using Zod.
 *
 * Fields:
 * - `title`: The title of the book. Must be a string with at least 3 characters.
 * - `author`: The author of the book. Must be a string with at least 3 characters.
 * - `genre`: The genre of the book. Must be a string with at least 3 characters.
 * - `publicationYear`: The year the book was published. Must be an integer number.
 * - `ISBN`: The International Standard Book Number. Must be a string with at least 5 characters.
 * - `price`: The price of the book. Must be a non-negative number with no more than 2 decimal places.
 * - `description`: An optional description of the book.
 *
 * Each field includes validation and custom error messages for required fields and type constraints.
 */
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

    publicationYear: z.number({
        required_error: "Publication year is required",
        invalid_type_error: "Publication year must be a number",
    }).int({
        message: "Publication year must be an integer",
    }),

    ISBN: z.string({
        required_error: "ISBN is required",
        invalid_type_error: "ISBN must be a string",
    }).min(5, {
        message: "ISBN length must be at least 5 characters",
    }),

    price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
    })
    .nonnegative({
        message: "Price must be a positive number",
    })
    .refine((value) => {
        return value === Math.round(value * 100) / 100;
    }, {
        message: "Price must have no more than 2 decimal places",
    }),

    description: z.string().optional(),
});

export type BookInput = z.infer<typeof BookSchema>;