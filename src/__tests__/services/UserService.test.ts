import { UserService } from '../../services/UserService';
import pool from '../../config/database';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { User } from '../../models/User';

// @ts-expect-error: override for test mock
pool.query = jest.fn();

// Mock the database pool
jest.mock('../../config/database', () => ({
    default: {
        query: jest.fn(),
    },
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should return a user when email exists', async () => {
            const mockUser: User = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedPassword',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockDbResult = {
                rows: [{
                    id: mockUser.id,
                    email: mockUser.email,
                    password: mockUser.password,
                    role: mockUser.role,
                    created_at: mockUser.createdAt,
                    updated_at: mockUser.updatedAt
                }]
            };

            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce(mockDbResult);

            const result = await userService.findByEmail('test@example.com');

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE email = $1',
                ['test@example.com']
            );
            expect(result).toEqual(mockUser);
        });

        it('should return null when email does not exist', async () => {
            const mockDbResult = { rows: [] };
            // @ts-ignore
            (pool.query as jest.Mock).mockResolvedValueOnce(mockDbResult);

            const result = await userService.findByEmail('nonexistent@example.com');

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE email = $1',
                ['nonexistent@example.com']
            );
            expect(result).toBeNull();
        });
    });
}); 