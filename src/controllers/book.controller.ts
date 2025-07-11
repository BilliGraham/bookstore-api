import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { BookSchema } from '../utils/book.schema';
import { checkForDuplicateBook } from '../utils/book.utils';
import { Book } from '../models/book.model';
import z from 'zod';

/**
 * /**
 * Handles the creation of a new book.
 *
 * Validates the request body against the BookSchema, checks for duplicate books,
 * assigns a unique ID, and adds the new book to the collection.
 * Responds with the created book on success, or with appropriate error messages
 * if validation fails or a duplicate is found.
 *
 * @param req - Express request object containing book data in the body.
 * @param res - Express response object used to send the result or errors.
 * @returns void
 */
export const createBook = (req: Request, res: Response) => {
  try {
    const validatedData = BookSchema.parse(req.body);
    
    const duplicateError = checkForDuplicateBook(validatedData);
    if (duplicateError) {
      return res.status(400).json({ error: duplicateError });
    }

    const allBooks = bookService.getAllBooks();
    const id = allBooks.length > 0 ? Math.max(...allBooks.map(book => book.id)) + 1 : 1;
    
    const newBook: Book = { id, ...validatedData };
    bookService.addBook(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Handles the request to retrieve a single book by its ID.
 *
 * Parses the book ID from the request parameters, validates it,
 * and attempts to fetch the corresponding book using the book service.
 * Responds with the book data if found, or with appropriate error messages
 * for invalid IDs, missing books, or internal server errors.
 *
 * @param req - Express request object containing the book ID in params.
 * @param res - Express response object used to send the result or error.
 */
export const getBook = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Book ID must be a number' });
      return;
    }

    const book = bookService.getBookById(id);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    res.json(book);
  } catch (error) {
    console.error('Error in listBooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Updates an existing book by its ID.
 *
 * Validates the book ID from the request parameters and the request body using a partial BookSchema.
 * If the ID is invalid, responds with a 400 status and an error message.
 * If the book is not found, responds with a 404 status and an error message.
 * Checks for duplicate books after update; if a duplicate is found, responds with a 400 status and an error message.
 * On successful update, returns the updated book object.
 * Handles validation errors from Zod and responds with a 400 status and error messages.
 * Handles unexpected errors and responds with a 500 status and a generic error message.
 *
 * @param req - Express request object containing book ID and update data.
 * @param res - Express response object used to send responses.
 */
export const updateBook = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Book ID must be a number' });
      return;
    }

    const validatedData = BookSchema.partial().parse(req.body);
    const updated = bookService.updateBook(id, validatedData);

    if (!updated) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const duplicateError = checkForDuplicateBook(updated, id);
    if (duplicateError) {
      return res.status(400).json({ error: duplicateError });
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(err => err.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * Deletes a book by its ID.
 *
 * @param req - Express request object containing the book ID in `req.params.id`.
 * @param res - Express response object used to send status and result.
 *
 * @remarks
 * - Returns 400 if the ID is not a number.
 * - Returns 404 if the book is not found.
 * - Returns 204 on successful deletion.
 * - Returns 500 on internal server error.
 */
export const deleteBook = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Book ID must be a number' });
      return;
    }

    const deleted = bookService.deleteBook(id);
    if (!deleted) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in listBooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handles the request to list all books.
 *
 * Retrieves all books from the book service and returns them as a JSON response.
 * If an error occurs during retrieval, responds with a 500 Internal Server Error.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export const listBooks = (req: Request, res: Response) => {
  try {
    const books = bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error('Error in listBooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handles the request to list books of a specific genre with a discounted price.
 *
 * Expects `genre` and `discount` as query parameters.
 * - `genre`: The genre of books to filter.
 * - `discount`: The discount percentage to apply (between 0 and 100).
 *
 * Responds with:
 * - 400 if required parameters are missing or invalid.
 * - 404 if no books are found for the specified genre.
 * - 200 with the genre, discount percentage, and total discounted price if successful.
 *
 * @param req - Express request object containing query parameters.
 * @param res - Express response object for sending the result.
 */
export const listBooksWithDiscountedPrice = (req: Request, res: Response) => {
  try {
    const { genre, discount } = req.query;
    
    if (!genre || !discount) {
      res.status(400).json({ 
        error: 'Both genre and discount parameters are required' 
      });
      return;
    }
 
    const discountPercentage = parseFloat(discount as string);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      res.status(400).json({ 
        error: 'Discount must be a valid number between 0 and 100' 
      });
      return;
    }
    const allBooks = bookService.getAllBooks();
    const genreBooks = allBooks.filter(book => 
      book.genre.toLowerCase() === (genre as string).toLowerCase()
    );

    if (genreBooks.length === 0) {
      res.status(404).json({ 
        error: `No books found in genre '${genre}'` 
      });
      return;
    }
    
    const booksWithDiscount = genreBooks.map(book => ({
      ...book,
      discountedPrice: book.price * (1 - discountPercentage / 100),
      discountPercentage
    }));

    const totalDiscountedPrice = booksWithDiscount.reduce((sum, book) => sum + book.discountedPrice, 0);

    res.json({
      genre,
      discountPercentage,
      totalDiscountedPrice: totalDiscountedPrice.toFixed(2),
    });

  } catch (error) {
    console.error('Error in listBooksWithDiscountedPrice:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};
