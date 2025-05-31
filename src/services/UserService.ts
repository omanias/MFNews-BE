import { User } from '../models/User';
import pool from '../config/database';
import bcrypt from 'bcrypt';

export class UserService {
    async findById(id: string): Promise<User | null> {
        // TODO: Implement database query (debe devolver también el campo role)
        return null;
    }

    async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
            [userData.email, hashedPassword, userData.role]
        );
        const user = result.rows[0];
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        // TODO: Implement user update (debe aceptar y actualizar el campo role)
        return null;
    }

    async delete(id: string): Promise<boolean> {
        // TODO: Implement user deletion
        return false;
    }

    async login(email: string, password: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };
    }
} 