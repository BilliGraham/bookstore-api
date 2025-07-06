import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { BookSchema } from '../utils/book.schema';
import Book from '../models/book.model';
import z from 'zod';

export const createBook = async (req: Request, res: Response) => {
  try {
    const validatedData = BookSchema.parse(req.body);
    
    const existingBook = await Book.findOne({ where: { ISBN: validatedData.ISBN } });
    if (existingBook) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }

    const newBook = await bookService.addBook(validatedData);
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Create book error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Book ID must be a number' });
    }

    const book = await bookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Book ID must be a number' });
    }

    const validatedData = BookSchema.partial().parse(req.body);
    const updated = await bookService.updateBook(id, validatedData);

    if (!updated) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Update book error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Book ID must be a number' });
    }

    const deleted = await bookService.deleteBook(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error('List books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

interface DiscountedBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  publicationYear: number;
  ISBN: string;
  description?: string;
}
export const listBooksWithDiscountedPrice = async (req: Request, res: Response) => {
  try {
    const { genre, discount } = req.query;
    
    if (!genre) {
      return res.status(400).json({ 
        error: 'Genre parameter is required' 
      });
    }

    // Get all books and filter by genre (case-insensitive)
    const allBooks = await bookService.getAllBooks() as DiscountedBook[];
    const genreBooks = allBooks.filter(book => 
      book.genre.toLowerCase() === (genre as string).toLowerCase()
    );

    if (genreBooks.length === 0) {
      return res.status(404).json({ 
        error: `No books found in genre '${genre}'` 
      });
    }

    // If no discount provided, return all books in genre
    if (!discount) {
      return res.json({
        genre,
        books: genreBooks,
        count: genreBooks.length
      });
    }

    // Process discount if provided
    const discountPercentage = parseFloat(discount as string);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({ 
        error: 'Discount must be a valid number between 0 and 100' 
      });
    }
    
    const booksWithDiscount = genreBooks.map(book => ({
      ...book,
      discountedPrice: book.price * (1 - discountPercentage / 100),
      discountPercentage
    }));

    const totalDiscountedPrice = booksWithDiscount.reduce(
      (sum, book) => sum + book.discountedPrice, 0
    );

    res.json({
      genre,
      discountPercentage,
      books: booksWithDiscount,
      totalDiscountedPrice,
      count: booksWithDiscount.length
    });

  } catch (error) {
    console.error('Discounted books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};