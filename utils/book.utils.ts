import { BookInput } from './book.schema';
import * as bookService from '../services/book.service';

export const checkForDuplicateBook = async (bookData: BookInput): Promise<string | null> => {
  const allBooks = await bookService.getAllBooks();
  
  const duplicate = allBooks.find(book => 
    book.title.toLowerCase() === bookData.title.toLowerCase() &&
    book.author.toLowerCase() === bookData.author.toLowerCase()
  );

  if (duplicate) {
    return `A book with the title ${bookData.title} by ${bookData.author} already exists.`;
  }

  return null;
};