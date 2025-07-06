import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { Book } from '../models/book.model';

export const createBook = (req: Request, res: Response) => {
  const { id, title, author, genre, price } = req.body;

  if (!id || !title || !author || !genre || price === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newBook: Book = { id, title, author, genre, price };
  bookService.addBook(newBook);
  res.status(201).json(newBook);
};

export const getBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = bookService.getBookById(id);

  if (!book) return res.status(404).json({ error: 'Book not found' });

  res.json(book);
};

export const updateBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updated = bookService.updateBook(id, req.body);

  if (!updated) return res.status(404).json({ error: 'Book not found' });

  res.json(updated);
};

export const deleteBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = bookService.deleteBook(id);

  if (!deleted) return res.status(404).json({ error: 'Book not found' });

  res.status(204).send();
};

export const listBooks = (req: Request, res: Response) => {
  const books = bookService.getAllBooks();
  res.json(books);
};
