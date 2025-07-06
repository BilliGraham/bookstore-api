import { Op } from 'sequelize';
import Book, { BookAttributes } from '../models/book.model';

export const addBook = async (bookData: BookAttributes): Promise<Book> => {
  return await Book.create(bookData);
};

export const getBookById = async (id: number): Promise<Book | null> => {
  return await Book.findByPk(id);
};

export const updateBook = async (
  id: number,
  updatedData: Partial<BookAttributes>
): Promise<Book | null> => {
  const book = await Book.findByPk(id);
  if (!book) return null;

  return await book.update(updatedData);
};

export const deleteBook = async (id: number): Promise<boolean> => {
  const deletedCount = await Book.destroy({ where: { id } });
  return deletedCount > 0;
};

export const getAllBooks = async (): Promise<Book[]> => {
  return await Book.findAll();
};

export const getBooksByGenre = async (genre: string): Promise<Book[]> => {
  return await Book.findAll({
    where: {
      genre: {
        [Op.iLike]: genre, // Case-insensitive search
      },
    },
  });
};