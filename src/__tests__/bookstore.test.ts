import request from 'supertest';
import app from '../app';
import { getAllBooks } from '../services/book.service';

describe('Book Controller', () => {
  beforeEach(() => {
    (getAllBooks() as any).length = 0; 
  });

  const baseUrl = '/api/books';
  const sampleBook = {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Programming',
    price: 300,
    publicationYear: 2008,
    ISBN: '978-0132350884',
  };

  // Test for creating a new book
  it('POST /books - creates a book', async () => {
    const res = await request(app).post(baseUrl).send(sampleBook);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Clean Code');
  });

  // Test for rejecting invalid book creation (missing required fields)
  it('POST /books - rejects invalid book (missing fields)', async () => {
    const res = await request(app).post(baseUrl).send({ title: 'Incomplete' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test for rejecting duplicate book creation
  it('POST /books - rejects duplicate book', async () => {
    await request(app).post(baseUrl).send(sampleBook);
    const res = await request(app).post(baseUrl).send(sampleBook);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });


  // Test for getting a book by ID
  it('GET /books/:id - returns a book by ID', async () => {
    await request(app).post(baseUrl).send(sampleBook);
    const res = await request(app).get(`${baseUrl}/1`);
    expect(res.status).toBe(200);
    expect(res.body.author).toBe('Robert C. Martin');
  });

  // Test for handling book not found
  it('GET /books/:id - 404 if book not found', async () => {
    const res = await request(app).get(`${baseUrl}/99`);
    expect(res.status).toBe(404);
  });

  // Test for updating a book
  it('PUT /books/:id - updates a book', async () => {
    await request(app).post(baseUrl).send(sampleBook);
    const res = await request(app).put(`${baseUrl}/1`).send({ title: 'Refactored Code' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Refactored Code');
  });

  // Test for book not found by id
  it('PUT /books/:id - 404 if book not found', async () => {
    const res = await request(app).put(`${baseUrl}/123`).send({ title: 'None' });
    expect(res.status).toBe(404);
  });

  // Test to delete a book
  it('DELETE /books/:id - deletes a book', async () => {
    await request(app).post(baseUrl).send(sampleBook);
    const res = await request(app).delete(`${baseUrl}/1`);
    expect(res.status).toBe(204);
  });

  //Test if the discount price is calculated correctly
  it('GET /books/discounted-price - returns total discounted price', async () => {
    await request(app).post(baseUrl).send(sampleBook);
    await request(app).post(baseUrl).send({ ...sampleBook, title: 'The Clean Coder', id: 2, price: 200 });
    const res = await request(app).get(`${baseUrl}/discounted-price?genre=Programming&discount=20`);
    expect(res.status).toBe(200);
    expect(res.body.totalDiscountedPrice).toBe('400.00'); // (300 + 200) * 0.8
  });

  //Test for the genre or discount is missing
  it('GET /books/discounted-price - error if genre or discount missing', async () => {
    const res = await request(app).get(`${baseUrl}/discounted-price`);
    expect(res.status).toBe(400);
  });

  //Test for invalid discount value
  it('GET /books/discounted-price - error for invalid discount', async () => {
    const res = await request(app).get(`${baseUrl}/discounted-price?genre=Programming&discount=abc`);
    expect(res.status).toBe(400);
  });

  //Test for no books in the specified genre
  it('GET /books/discounted-price - 404 if no books in genre', async () => {
    const res = await request(app).get(`${baseUrl}/discounted-price?genre=Fantasy&discount=10`);
    expect(res.status).toBe(404);
  });
});
