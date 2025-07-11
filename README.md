# Bookstore API

An Express + TypeScript REST API for managing a simple bookstore. This API supports CRUD operations on books, input validation with Zod, and duplicate book detection based on title and author.

---

## Features

* Create, read, update, and delete books
* Input validation using [Zod](https://github.com/colinhacks/zod) with detailed error messages
* Duplicate book detection (books with the same title and author are rejected)
* Query books with discounted prices by genre and discount percentage
* In-memory data store (no database required)
* TypeScript typings for strong type safety

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bookstore-api.git
cd bookstore-api
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) Downgrade Zod to version 3.x if you encounter validation errors:

```bash
npm install zod@^3.22.4
```

---

## Usage

### Start the server

```bash
npm start
```

The API will listen on `http://localhost:3000` by default.

---

## API Endpoints

### Books

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/api/books`     | List all books        |
| POST   | `/api/books`     | Create a new book     |
| GET    | `/api/books/:id` | Retrieve a book by ID |
| PUT    | `/api/books/:id` | Update a book by ID   |
| DELETE | `/api/books/:id` | Delete a book by ID   |

### Discounted Price

| Method | Endpoint                      | Description                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/api/books/discounted-price` | Calculate total discounted price for a genre |

**Query Parameters:**

* `genre` (string, required): The genre to filter books by.
* `discount` (number between 0 and 100, required): Discount percentage to apply.

---

## Validation Rules (Zod Schema)

* **title**: string, required, min length 3
* **author**: string, required, min length 3
* **genre**: string, required, min length 3
* **publicationYear**: integer, required
* **ISBN**: string, required, min length 5
* **price**: number, required, non-negative, max 2 decimal places
* **description**: optional string

---

## Duplicate Book Detection

When creating or updating a book, the API checks for existing books with the same title and author (case-insensitive). Duplicate books are rejected with a 400 error and a descriptive message.

---

## Testing

Run the test suite with:

```bash
npm test
```

Tests cover all CRUD operations, validation, duplicate checks, and discounted price calculations.

## Technologies Used

* Node.js & Express
* TypeScript
* Zod for validation
* Jest for testing

---

## Notes

* The API uses an in-memory data store; data is lost when the server restarts.
* For production use, integrate with a real database.
* This project uses Zod v3.x due to some API changes in newer versions.
* AI was used to assist with comment generation, some of the unit testing and README
