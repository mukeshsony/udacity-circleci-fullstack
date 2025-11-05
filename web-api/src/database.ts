import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Determine the database name based on the environment
const getDatabaseName = (): string => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.DATABASE_TEST_NAME || `${process.env.DATABASE_NAME}_test`;
  }
  return process.env.DATABASE_NAME as string;
};

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: getDatabaseName()
});

export default pool;
