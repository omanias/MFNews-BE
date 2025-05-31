import { Router } from 'express';
import { NewsController } from '../controllers/NewsController';
import { authenticateJWT, checkRole } from '../middlewares/auth.middleware';

const router = Router();
const newsController = new NewsController();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of news
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/News'
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               body:
 *                 type: string
 *               image_url:
 *                 type: string
 *               author:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: News created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.post('/', authenticateJWT, checkRole(['admin', 'editor']), newsController.addNew.bind(newsController));

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: News deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: News not found
 */
router.delete('/:id', authenticateJWT, checkRole(['admin', 'editor']), newsController.deleteNew.bind(newsController));

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the news article to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               body:
 *                 type: string
 *               image_url:
 *                 type: string
 *               author:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: News updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: News not found
 */
router.put('/:id', authenticateJWT, checkRole(['admin', 'editor']), newsController.updateNew.bind(newsController));

export default router; 