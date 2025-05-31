import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD
} = process.env;

const pool = new Pool({
    host: POSTGRES_HOST || 'localhost',
    port: parseInt(POSTGRES_PORT || '5432'),
    database: POSTGRES_DB || 'mfnews',
    user: POSTGRES_USER || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
});

// Test the connection
pool.connect()
    .then(() => {
        console.log('Successfully connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database:', err);
    });

export default pool; 