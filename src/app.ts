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

console.log('Starting server initialization...');

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

console.log('Middleware configured...');

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);

console.log('Routes configured...');

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
    console.log('Hello endpoint called');
    res.json({ message: 'Hello World!' });
});

const PORT = 3000;

// Initialize database and start server
const startServer = async () => {
    try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized successfully');

        // Try to initialize S3, but don't fail if it doesn't work
        try {
            console.log('Checking S3 bucket...');
            await ensureBucketExists('news-images');
            console.log('S3 bucket check completed');
        } catch (s3Error) {
            console.warn('Warning: Could not initialize S3. Some features may not work:', s3Error);
        }

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
        });

        // Handle server errors
        server.on('error', (error: Error) => {
            console.error('Server error:', error);
            process.exit(1);
        });

    } catch (error) {
        console.error('Error during server startup:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log('Starting server...');
startServer();

export default app; 