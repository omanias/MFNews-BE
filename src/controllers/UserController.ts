import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.update(req.params.id, req.body);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const success = await this.userService.delete(req.params.id);
            if (!success) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userService.login(email, password);
            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            // Generate JWT token with role
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            // Return user data and token
            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
} 