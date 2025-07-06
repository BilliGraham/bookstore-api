import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Load once at entry point

import app from './app';
import { testConnection } from './config/database';
import Book from './models/book.model';

const PORT = process.env.PORT ?? 3000;

async function startServer() {
  try {
    console.log('Attempting database connection...');
    
    // Test connection first
    await testConnection();
    console.log('Database connection established');

    // Then sync models
    console.log('Syncing database models...');
    await Book.sync({ alter: true }); // Use { force: true } only in development if needed
    console.log('Models synced successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST
      });
    });
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
}

startServer();