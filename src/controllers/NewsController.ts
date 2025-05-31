import { Request, Response } from 'express';
import { NewsService } from '../services/NewsService';

export class NewsController {
    private newsService: NewsService;

    constructor() {
        this.newsService = new NewsService();
    }

    async getNews(req: Request, res: Response): Promise<void> {
        try {
            console.log('Getting all news...');
            const news = await this.newsService.findAll();
            console.log(`Found ${news.length} news articles`);
            res.json(news);
        } catch (error) {
            console.error('Error in getNews:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getNewByName(req: Request, res: Response): Promise<void> {
        try {
            const { title, author } = req.query;
            console.log('Searching news with params:', { title, author });
            let news;

            if (title) {
                news = await this.newsService.findByTitle(title as string);
            } else if (author) {
                news = await this.newsService.findByAuthor(author as string);
            } else {
                res.status(400).json({ message: 'Either title or author parameter is required' });
                return;
            }

            if (!news) {
                res.status(404).json({ message: 'News not found' });
                return;
            }
            res.json(news);
        } catch (error) {
            console.error('Error in getNewByName:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Adding new news:', req.body);
            const news = await this.newsService.create(req.body);
            res.status(201).json(news);
        } catch (error) {
            console.error('Error in addNew:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Deleting news with id:', req.params.id);
            const success = await this.newsService.delete(req.params.id);
            if (!success) {
                res.status(404).json({ message: 'News not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            console.error('Error in deleteNew:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Creating new news:', req.body);
            const news = await this.newsService.create(req.body);
            res.status(201).json(news);
        } catch (error) {
            console.error('Error in createNew:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
} 