import request from 'supertest';
import app from '../../src/server';

describe('Simple API Tests', () => {
  it('should return 404 for non-existent endpoint', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should return 401 for protected endpoints without auth', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });

  it('should return 401 for POST to products without auth', async () => {
    const response = await request(app).post('/api/products').send({ name: 'Test', price_cents: 100 });
    expect(response.status).toBe(401);
  });

  it('should return 401 for protected endpoints without auth - orders', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(401);
  });
});