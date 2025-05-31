import pool from '../config/database';
import { News } from '../models/News';

export class NewsService {
    async findAll(): Promise<News[]> {
        const result = await pool.query('SELECT * FROM news ORDER BY date DESC');
        return result.rows;
    }

    async findByTitle(title: string): Promise<News | null> {
        const result = await pool.query('SELECT * FROM news WHERE title = $1', [title]);
        return result.rows[0] || null;
    }

    async findByAuthor(author: string): Promise<News[]> {
        const result = await pool.query('SELECT * FROM news WHERE author = $1 ORDER BY date DESC', [author]);
        return result.rows;
    }

    async create(newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> {
        const { title, body, image_url, author, date, active } = newsData;
        const result = await pool.query(
            'INSERT INTO news (title, body, image_url, author, date, active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, body, image_url, author, date, active]
        );
        return result.rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM news WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
} 