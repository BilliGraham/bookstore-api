export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  publicationYear: number;
  ISBN: string;
  description?: string;
}
