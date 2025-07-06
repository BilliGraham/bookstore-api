import bookRouter from './routes/book.routes';

const express = require('express');
const app = express();

app.use(express.json());
app.use('/api', bookRouter);

export default app;
