import { Book } from '../models/book.model';

let books: Book[] = [];

export const addBook = (book: Book): void => {
  books.push(book);
};

export const getBookById = (id: number): Book | undefined => {
  return books.find(b => b.id === id);
};

export const updateBook = (id: number, updatedData: Partial<Book>): Book | null => {
  const book = books.find(b => b.id === id);
  if (!book) return null;

  Object.assign(book, updatedData);
  return book;
};

export const deleteBook = (id: number): boolean => {
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return false;

  books.splice(index, 1);
  return true;
};

export const getAllBooks = (): Book[] => books;
