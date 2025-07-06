import { Request, Response } from 'express';
import * as bookService from '../services/book.service';
import { Book } from '../models/book.model';

export const createBook = (req: Request, res: Response) => {
  const { title, author, genre, price } = req.body;

  if (!title || !author || !genre || price === undefined) {
    res.status(400).json({ error: 'All fields except ID are required' });
    return;
  }

  const allBooks = bookService.getAllBooks();
  const id = allBooks.length > 0 ? Math.max(...allBooks.map(book => book.id)) + 1 : 1;

  const newBook: Book = { id, title, author, genre, price };
  bookService.addBook(newBook);
  res.status(201).json(newBook);
};

export const getBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = bookService.getBookById(id);

  if (!book) {
    res.status(404).json({ error: 'Book not found' });

  } else {
    res.json(book);
  }
  
};

export const updateBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updated = bookService.updateBook(id, req.body);

  if (!updated) {
    res.status(404).json({ error: 'Book not found' });
  } else {
    res.json(updated);
  }

};

export const deleteBook = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = bookService.deleteBook(id);

  if (!deleted) {
    res.status(404).json({ error: 'Book not found' });
  } else {
    res.status(204).send();
  }
};

export const listBooks = (req: Request, res: Response) => {
  const books = bookService.getAllBooks();
  res.json(books);
};
