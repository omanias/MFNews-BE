import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger';
import userRoutes from './routes/userRoutes';
import newsRoutes from './routes/newsRoutes';
import initializeDatabase from './config/initDb';
import cors from 'cors';
import passport from './config/passport';
import { ensureBucketExists } from './utils/s3Client';

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);

// Example route with Swagger documentation
/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a hello message
 *     description: A simple endpoint that returns a hello message
 *     responses:
 *       200:
 *         description: Hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World!
 */
app.get('/api/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello World!' });
});

const PORT = 3000;

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        await ensureBucketExists('news-images');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        process.exit(1);
    }
};

startServer();

export default app; 