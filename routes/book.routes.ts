import * as bookController from '../controllers/book.controller';

const express = require('express');
const router = express.Router();

router.post('/books', bookController.createBook);
router.get('/books/:id', bookController.getBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);
router.get('/books', bookController.listBooks);

export default router;
