import { Pool } from 'pg'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Create a new PostgreSQL connection pool using environment variables.
 * The pool is used to manage multiple database connections.
 */
const pool = new Pool({
  user: process.env.POSTGRES_USER, // INPUT_REQUIRED {Database user}
  host: process.env.POSTGRES_HOST, // INPUT_REQUIRED {Database host}
  database: process.env.POSTGRES_DB, // INPUT_REQUIRED {Database name}
  password: process.env.POSTGRES_PASSWORD, // INPUT_REQUIRED {Database password}
  port: Number(process.env.POSTGRES_PORT), // INPUT_REQUIRED {Database port}
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false   // 👈 disable SSL locally
});
/**
 * Event listener for when the pool successfully connects to the database.
 * Logs a message indicating a successful connection.
 */
pool.on('connect', () => {
  console.log("Connected to the PostgreSQL database")
});

/**
 * Event listener for when an error occurs on the pool.
 * Logs the error message and stack trace, then exits the process.
 * @param err - The error object
 */
pool.on('error', (err: Error) => {
  console.log("Unexpected error on idle client", err)
  process.exit(-1);
});




export default pool;
