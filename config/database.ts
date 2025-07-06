import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  dialect: 'postgres',
  logging: console.log, // Enable SQL query logging
  dialectOptions: {
    ssl: {
      require: true, // This will fail if SSL isn't configured
      rejectUnauthorized: false // For self-signed certificates
    }
  }
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error; // Re-throw to stop server startup
  }
};

export default sequelize;