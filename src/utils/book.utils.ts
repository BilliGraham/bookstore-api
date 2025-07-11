import { BookInput } from './book.schema';
import * as bookService from '../services/book.service';

/**
 * Checks for a duplicate book in the collection based on title and author.
 * Optionally excludes a book by its ID from the duplicate check (useful for updates).
 *
 * @param bookData - The input data of the book to check for duplicates.
 * @param excludeId - (Optional) The ID of the book to exclude from the duplicate check.
 * @returns A string message if a duplicate is found, otherwise `null`.
 */
export const checkForDuplicateBook = (
  bookData: BookInput,
  excludeId?: number
): string | null => {
  const allBooks = bookService.getAllBooks();
  
  const duplicate = allBooks.find(book => 
    book.title.toLowerCase() === bookData.title.toLowerCase() &&
    book.author.toLowerCase() === bookData.author.toLowerCase() &&
    book.id !== excludeId 
  );

  if (duplicate) {
    return `A book with the title ${bookData.title} by ${bookData.author} already exists.`;
  }

  return null;
};
