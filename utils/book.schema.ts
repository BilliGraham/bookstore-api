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

    publicationYear: z.number({
        required_error: "Publication year is required",
        invalid_type_error: "Publication year must be a number",
    }).int({
        message: "Publication year must be an integer",
    }),

    ISBN: z.string({
        required_error: "ISBN is required",
        invalid_type_error: "ISBN must be a string",
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