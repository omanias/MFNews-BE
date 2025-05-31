import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';

const router = Router();
const newsController = new NewsController();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     responses:
 *       200:
 *         description: List of news
 */
router.get('/', newsController.getNews.bind(newsController));

/**
 * @swagger
 * /api/news/search:
 *   get:
 *     summary: Search news by title or author
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the news article
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author of the news article
 *     responses:
 *       200:
 *         description: News found
 *       400:
 *         description: Either title or author parameter is required
 *       404:
 *         description: News not found
 */
router.get('/search', newsController.getNewByName.bind(newsController));

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Add a new news article
 *     responses:
 *       201:
 *         description: News created successfully
 */
router.post('/', newsController.addNew.bind(newsController));

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 */
router.delete('/:id', newsController.deleteNew.bind(newsController));

/**
 * @swagger
 * /api/news/create:
 *   post:
 *     summary: Create a new news article
 *     responses:
 *       201:
 *         description: News created successfully
 */
router.post('/create', newsController.createNew.bind(newsController));

export default router; 