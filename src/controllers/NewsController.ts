import { Request, Response } from 'express';
import { NewsService } from '../services/NewsService';
import { News } from '../models/News';

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
            const { q } = req.query;
            console.log('Searching news with param q:', q);
            let news: News[] = [];

            if (q) {
                news = await this.newsService.findByQuery(q as string);
            } else {
                res.status(400).json({ message: 'Query parameter q is required' });
                return;
            }

            if (!news || news.length === 0) {
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

    async updateNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Updating news with id:', req.params.id, 'Data:', req.body);
            const news = await this.newsService.update(req.params.id, req.body);
            if (!news) {
                res.status(404).json({ message: 'News not found' });
                return;
            }
            res.json(news);
        } catch (error) {
            console.error('Error in updateNew:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
} 