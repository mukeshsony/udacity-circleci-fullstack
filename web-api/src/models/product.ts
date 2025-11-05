import pool from '../database';

export type Product = {
  id?: number;
  name: string;
  description?: string;
  price_cents: number;
  created_at?: string;
};

export async function createProduct(p: Product): Promise<Product> {
  try {
    const res = await pool.query(
      'INSERT INTO products (name, description, price_cents) VALUES ($1, $2, $3) RETURNING *',
      [p.name, p.description || null, p.price_cents]
    );
    return res.rows[0];
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to get product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listProducts(): Promise<Product[]> {
  try {
    const res = await pool.query('SELECT * FROM products ORDER BY id');
    return res.rows;
  } catch (error) {
    throw new Error(`Failed to list products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateProduct(id: number, p: Partial<Product>): Promise<Product | null> {
  try {
    const existing = await getProduct(id);
    if (!existing) return null;
    const name = p.name ?? existing.name;
    const description = p.description ?? existing.description;
    const price_cents = p.price_cents ?? existing.price_cents;
    const res = await pool.query('UPDATE products SET name=$1, description=$2, price_cents=$3 WHERE id=$4 RETURNING *', [name, description, price_cents, id]);
    return res.rows[0];
  } catch (error) {
    throw new Error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
  } catch (error) {
    throw new Error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
