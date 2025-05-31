import { readFileSync } from 'fs';
import { join } from 'path';
import pool from './database';

async function initializeDatabase() {
    try {
        // Read the SQL file
        const sql = readFileSync(join(__dirname, 'init.sql'), 'utf8');

        // Execute the SQL
        await pool.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export default initializeDatabase; 