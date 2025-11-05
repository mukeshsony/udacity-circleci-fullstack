import express from 'express';
import * as productModel from '../models/product';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { name, description, price_cents } = req.body;
    if (!name || price_cents == null) return res.status(400).json({ error: 'Missing fields' });
    const p = await productModel.createProduct({ name, description, price_cents });
    res.status(201).json(p);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/products', async (req, res) => {
  try {
    const list = await productModel.listProducts();
    res.json(list);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/products/popular', async (req, res) => {
  try {
    // simplified popular: return top 5 by total ordered quantity
    const db = require('../database').default;
    const result = await db.query(`SELECT p.id, p.name, SUM(op.quantity) AS total_ordered
      FROM products p JOIN order_products op ON op.product_id = p.id
      GROUP BY p.id, p.name ORDER BY total_ordered DESC LIMIT 5`);
    res.json(result.rows);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const p = await productModel.getProduct(id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await productModel.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

router.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await productModel.deleteProduct(id);
    res.status(204).send();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
