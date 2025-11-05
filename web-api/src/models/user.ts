import pool from '../database';
import * as bcrypt from 'bcrypt';

export type User = {
  id?: number;
  username: string;
  email: string;
  password: string; // hashed
  created_at?: string;
};

const SALT_ROUNDS = 10;

export async function createUser(u: { username: string; email: string; password: string }): Promise<User> {
  try {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [u.username, u.email, hashed]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    // remove password before returning
    delete user.password;
    return user;
  } catch (error) {
    throw new Error(`Failed to authenticate user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const res = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to get user by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listUsers(): Promise<User[]> {
  try {
    const res = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id');
    return res.rows;
  } catch (error) {
    throw new Error(`Failed to list users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
