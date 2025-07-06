import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { BookSchema } from '../utils/book.schema';
import { checkForDuplicateBook } from '../utils/book.utils';
import { Book } from '../models/book.model';
import z from 'zod';

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
      const errorMessages = error.errors.map(err => err.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

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

    const duplicateError = checkForDuplicateBook(updated);
    if (duplicateError) {
      return res.status(400).json({ error: duplicateError });
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

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

export const listBooks = (req: Request, res: Response) => {
  try {
    const books = bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error('Error in listBooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
      totalDiscountedPrice
    });

  } catch (error) {
    console.error('Error in listBooksWithDiscountedPrice:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};
