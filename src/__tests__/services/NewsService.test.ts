import { NewsService } from '../../services/NewsService';
import pool from '../../config/database';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { News } from '../../models/News';

// @ts-expect-error: override for test mock
pool.query = jest.fn();

// Mock the database pool
jest.mock('../../config/database', () => ({
    default: {
        query: jest.fn(),
    },
}));

describe('NewsService', () => {
    let newsService: NewsService;

    beforeEach(() => {
        newsService = new NewsService();
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all news', async () => {
            const mockNews: News[] = [
                {
                    id: '1',
                    title: 'Test News 1',
                    subtitle: 'Subtitle 1',
                    body: 'Body 1',
                    image_url: 'http://example.com/image1.jpg',
                    author: 'Author 1',
                    date: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: '2',
                    title: 'Test News 2',
                    subtitle: 'Subtitle 2',
                    body: 'Body 2',
                    image_url: 'http://example.com/image2.jpg',
                    author: 'Author 2',
                    date: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockNews });

            const result = await newsService.findAll();

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM news ORDER BY date DESC');
            expect(result).toEqual(mockNews);
        });
    });

    describe('findByTitle', () => {
        it('should return news with matching title', async () => {
            const mockNews: News[] = [
                {
                    id: '1',
                    title: 'Test News',
                    subtitle: 'Subtitle',
                    body: 'Body',
                    image_url: 'http://example.com/image.jpg',
                    author: 'Author',
                    date: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockNews });

            const result = await newsService.findByTitle('Test');

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM news WHERE title ILIKE $1 ORDER BY date DESC', ['%Test%']);
            expect(result).toEqual(mockNews);
        });
    });

    describe('findByAuthor', () => {
        it('should return news with matching author', async () => {
            const mockNews: News[] = [
                {
                    id: '1',
                    title: 'Test News',
                    subtitle: 'Subtitle',
                    body: 'Body',
                    image_url: 'http://example.com/image.jpg',
                    author: 'Test Author',
                    date: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockNews });

            const result = await newsService.findByAuthor('Test Author');

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM news WHERE author ILIKE $1 ORDER BY date DESC', ['%Test Author%']);
            expect(result).toEqual(mockNews);
        });
    });

    describe('findByQuery', () => {
        it('should return news matching query in title or author', async () => {
            const mockNews: News[] = [
                {
                    id: '1',
                    title: 'Test News',
                    subtitle: 'Subtitle',
                    body: 'Body',
                    image_url: 'http://example.com/image.jpg',
                    author: 'Author',
                    date: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockNews });

            const result = await newsService.findByQuery('Test');

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM news WHERE title ILIKE $1 OR author ILIKE $1 ORDER BY date DESC',
                ['%Test%']
            );
            expect(result).toEqual(mockNews);
        });
    });

    describe('create', () => {
        it('should create a new news item', async () => {
            const newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'> = {
                title: 'New News',
                subtitle: 'New Subtitle',
                body: 'New Body',
                image_url: 'http://example.com/new-image.jpg',
                author: 'New Author',
                date: new Date()
            };

            const mockCreatedNews: News = {
                id: '1',
                ...newsData,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockCreatedNews] });

            const result = await newsService.create(newsData);

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO news (title, subtitle, body, image_url, author, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [newsData.title, newsData.subtitle, newsData.body, newsData.image_url, newsData.author, newsData.date]
            );
            expect(result).toEqual(mockCreatedNews);
        });
    });

    describe('delete', () => {
        it('should delete a news item and return true', async () => {
            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

            const result = await newsService.delete('1');

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM news WHERE id = $1', ['1']);
            expect(result).toBe(true);
        });

        it('should return false if news item not found', async () => {
            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

            const result = await newsService.delete('1');

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM news WHERE id = $1', ['1']);
            expect(result).toBe(false);
        });
    });

    describe('update', () => {
        it('should update a news item and return updated news', async () => {
            const updateData: Partial<News> = {
                title: 'Updated Title',
                body: 'Updated Body'
            };

            const mockUpdatedNews: News = {
                id: '1',
                title: 'Updated Title',
                subtitle: 'Original Subtitle',
                body: 'Updated Body',
                image_url: 'http://example.com/image.jpg',
                author: 'Original Author',
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUpdatedNews] });

            const result = await newsService.update('1', updateData);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE news'),
                [updateData.title, undefined, updateData.body, undefined, undefined, undefined, '1']
            );
            expect(result).toEqual(mockUpdatedNews);
        });

        it('should return null if news item not found', async () => {
            const updateData: Partial<News> = {
                title: 'Updated Title'
            };

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

            const result = await newsService.update('1', updateData);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE news'),
                [updateData.title, undefined, undefined, undefined, undefined, undefined, '1']
            );
            expect(result).toBeNull();
        });
    });
}); 