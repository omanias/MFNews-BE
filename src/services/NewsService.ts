import pool from '../config/database';
import { News } from '../models/News';

export class NewsService {
    async findAll(): Promise<News[]> {
        const result = await pool.query('SELECT * FROM news ORDER BY date DESC');
        return result.rows;
    }

    async findByTitle(title: string): Promise<News[]> {
        const result = await pool.query('SELECT * FROM news WHERE title ILIKE $1 ORDER BY date DESC', [`%${title}%`]);
        return result.rows;
    }

    async findByAuthor(author: string): Promise<News[]> {
        const result = await pool.query('SELECT * FROM news WHERE author ILIKE $1 ORDER BY date DESC', [`%${author}%`]);
        return result.rows;
    }

    async findByQuery(q: string): Promise<News[]> {
        const result = await pool.query(
            `SELECT * FROM news WHERE title ILIKE $1 OR author ILIKE $1 ORDER BY date DESC`,
            [`%${q}%`]
        );
        return result.rows;
    }

    async create(newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News> {
        const { title, subtitle, body, image_url, author, date } = newsData;
        const result = await pool.query(
            'INSERT INTO news (title, subtitle, body, image_url, author, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, subtitle, body, image_url, author, date]
        );
        return result.rows[0];
    }

    async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM news WHERE id = $1', [id]);
        return result.rowCount ? result.rowCount > 0 : false;
    }

    async update(id: string, newsData: Partial<News>): Promise<News | null> {
        const { title, subtitle, body, image_url, author, date } = newsData;
        const result = await pool.query(
            `UPDATE news 
             SET title = COALESCE($1, title),
                 subtitle = COALESCE($2, subtitle),
                 body = COALESCE($3, body),
                 image_url = COALESCE($4, image_url),
                 author = COALESCE($5, author),
                 date = COALESCE($6, date),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [title, subtitle, body, image_url, author, date, id]
        );
        return result.rows[0] || null;
    }
} 