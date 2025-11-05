import express from 'express';
import * as orderModel from '../models/order';
import { requireAuth, AuthRequest } from '../middleware/auth';
import pool from '../database';

const router = express.Router();

router.post('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) return res.status(400).json({ error: 'Invalid user' });
    const order = await orderModel.createOrder(userId);
    // optionally add products if provided
    const items = req.body.items || []; // [{product_id, quantity}]
    for (const it of items) {
      // fetch product price
      const p = await pool.query('SELECT * FROM products WHERE id = $1', [it.product_id]);
      if (p.rows[0] && order.id) {
        await orderModel.addProductToOrder(order.id, it.product_id, it.quantity || 1, p.rows[0].price_cents);
      }
    }
    res.status(201).json(order);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await orderModel.listOrders();
    res.json(orders);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/orders/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const order = await orderModel.getOrder(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    // ownership check
    if (!req.user?.userId || order.user_id !== Number(req.user.userId)) return res.status(403).json({ error: 'Forbidden' });
    res.json(order);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.delete('/api/orders/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const order = await orderModel.getOrder(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!req.user?.userId || order.user_id !== Number(req.user.userId)) return res.status(403).json({ error: 'Forbidden' });
    await orderModel.deleteOrder(id);
    res.status(204).send();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
