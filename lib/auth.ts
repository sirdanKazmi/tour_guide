import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export interface AdminUser {
    username: string;
}

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
    // For simplicity, using environment variables
    // In production, you should hash passwords and store in database
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function generateToken(username: string): string {
    return jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminUser | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
        if (decoded.role === 'admin') {
            return { username: decoded.username };
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
