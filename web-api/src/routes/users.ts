import express from 'express';
import * as userModel from '../models/user';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { requireAuth, AuthRequest } from '../middleware/auth';
dotenv.config();

const router = express.Router();

router.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await userModel.createUser({ username, email, password });
    res.status(201).json(user);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const user = await userModel.authenticateUser(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'change_this_secret');
    res.json({ token, user });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/users', requireAuth, async (req, res) => {
  try {
    const users = await userModel.listUsers();
    res.json(users);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/users/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const user = await userModel.getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // include 5 most recent purchases - simplified: latest orders
    res.json(user);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
