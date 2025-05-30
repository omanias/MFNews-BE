import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/users', userRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

export default app; 