import pool from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status?: string;
  created_at?: string;
};

export async function createOrder(user_id: number): Promise<Order> {
  try {
    const res = await pool.query('INSERT INTO orders (user_id) VALUES ($1) RETURNING *', [user_id]);
    return res.rows[0];
  } catch (error) {
    throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function addProductToOrder(order_id: number, product_id: number, quantity: number, unit_price_cents: number) {
  try {
    const res = await pool.query('INSERT INTO order_products (order_id, product_id, quantity, unit_price_cents) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, unit_price_cents]);
    return res.rows[0];
  } catch (error) {
    throw new Error(`Failed to add product to order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getOrder(id: number) {
  try {
    const res = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return res.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to get order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listOrders(): Promise<Order[]> {
  try {
    const res = await pool.query('SELECT * FROM orders ORDER BY id');
    return res.rows;
  } catch (error) {
    throw new Error(`Failed to list orders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteOrder(id: number): Promise<void> {
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
  } catch (error) {
    throw new Error(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
