import { Request, Response } from 'express';
import { NewsService } from '../services/NewsService';
import { News } from '../models/News';
import { s3 } from '../utils/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'news-images';

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
            res.json(news); return;
        } catch (error) {
            console.error('Error in getNews:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
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
                res.status(400).json({ message: 'Query parameter q is required' }); return;
            }

            if (!news || news.length === 0) {
                res.status(404).json({ message: 'News not found' }); return;
            }
            res.json(news); return;
        } catch (error) {
            console.error('Error in getNewByName:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
        }
    }

    async addNew(req: Request, res: Response): Promise<void> {
        try {
            let imageUrl = '';
            if (req.file) {
                const fileExt = req.file.originalname.split('.').pop();
                const key = `${uuidv4()}.${fileExt}`;
                await s3.send(new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                }));
                imageUrl = `http://localhost:4566/${BUCKET_NAME}/${key}`;
            }
            const newsData = {
                ...req.body,
                image_url: imageUrl || req.body.image_url || '',
            };
            const news = await this.newsService.create(newsData);
            res.status(201).json(news); return;
        } catch (error) {
            console.error('Error in addNew:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
        }
    }

    async deleteNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Deleting news with id:', req.params.id);
            const success = await this.newsService.delete(req.params.id);
            if (!success) {
                res.status(404).json({ message: 'News not found' }); return;
            }
            res.status(204).send(); return;
        } catch (error) {
            console.error('Error in deleteNew:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
        }
    }

    async createNew(req: Request, res: Response): Promise<void> {
        try {
            console.log('Creating new news:', req.body);
            const news = await this.newsService.create(req.body);
            res.status(201).json(news); return;
        } catch (error) {
            console.error('Error in createNew:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
        }
    }

    async updateNew(req: Request, res: Response): Promise<void> {
        try {
            let imageUrl = req.body.image_url || '';
            if (req.file) {
                const fileExt = req.file.originalname.split('.').pop();
                const key = `${uuidv4()}.${fileExt}`;
                await s3.send(new PutObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                }));
                imageUrl = `http://localhost:4566/${BUCKET_NAME}/${key}`;
            }
            const newsData = {
                ...req.body,
                image_url: imageUrl,
            };
            const news = await this.newsService.update(req.params.id, newsData);
            if (!news) {
                res.status(404).json({ message: 'News not found' }); return;
            }
            res.json(news); return;
        } catch (error) {
            console.error('Error in updateNew:', error);
            res.status(500).json({ message: 'Internal server error' }); return;
        }
    }
} 