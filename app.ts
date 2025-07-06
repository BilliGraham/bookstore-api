import express from 'express';
import bookRouter from './routes/book.routes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', bookRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

export default app;