import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { config } from 'dotenv';
import pool from './database';

config();

interface JwtPayload {
    id: number;
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key'
};

passport.use(
    new JwtStrategy(options, async (jwtPayload: JwtPayload, done) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [jwtPayload.id]);
            const user = result.rows[0];

            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export default passport; 