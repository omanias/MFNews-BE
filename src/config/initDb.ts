import { readFileSync } from 'fs';
import { join } from 'path';
import pool from './database';

async function initializeDatabase() {
    try {
        // Read the SQL file
        const sql = readFileSync(join(__dirname, 'init.sql'), 'utf8');

        // Execute the SQL
        await pool.query(sql);

        // Add subtitle column if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'news' 
                    AND column_name = 'subtitle'
                ) THEN
                    ALTER TABLE news ADD COLUMN subtitle VARCHAR(255);
                END IF;
            END $$;
        `);

        // Add role column to users if it doesn't exist
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (
                    SELECT 1 
                    FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    AND column_name = 'role'
                ) THEN
                    ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
                END IF;
            END $$;
        `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

export default initializeDatabase; 