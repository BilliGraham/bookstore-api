import { Book } from '../models/book.model';

let books: Book[] = [];

/**
 * Adds a new book to the collection.
 *
 * @param book - The book object to be added.
 */
export const addBook = (book: Book): void => {
  books.push(book);
};

/**
 * Retrieves a book from the collection by its unique identifier.
 *
 * @param id - The unique identifier of the book to retrieve.
 * @returns The book object if found; otherwise, `undefined`.
 */
export const getBookById = (id: number): Book | undefined => {
  return books.find(b => b.id === id);
};

/**
 * Updates the properties of an existing book with the provided data.
 *
 * @param id - The unique identifier of the book to update.
 * @param updatedData - An object containing the properties to update on the book.
 * @returns The updated book object if found, otherwise `null`.
 */
export const updateBook = (id: number, updatedData: Partial<Book>): Book | null => {
  const book = books.find(b => b.id === id);
  if (!book) return null;

  Object.assign(book, updatedData);
  return book;
};

/**
 * Deletes a book from the collection by its ID.
 *
 * @param id - The unique identifier of the book to delete.
 * @returns `true` if the book was found and deleted, `false` otherwise.
 */
export const deleteBook = (id: number): boolean => {
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return false;

  books.splice(index, 1);
  return true;
};

export const getAllBooks = (): Book[] => books;

/**
 * Retrieves all books that match the specified genre.
 *
 * @param genre - The genre to filter books by (case-insensitive).
 * @returns An array of `Book` objects whose genre matches the provided genre.
 */
export const getBooksByGenre = (genre: string): Book[] => {
  const allBooks = getAllBooks();
  return allBooks.filter(book => 
    book.genre.toLowerCase() === genre.toLowerCase()
  );
};
