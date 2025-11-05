import request from 'supertest';
import app from '../../src/server';
import * as userModel from '../../src/models/user';
import * as productModel from '../../src/models/product';
import * as orderModel from '../../src/models/order';

describe('Comprehensive API Tests', () => {
  let createUserSpy: jasmine.Spy;
  let authenticateUserSpy: jasmine.Spy;
  let listUsersSpy: jasmine.Spy;
  let getUserByIdSpy: jasmine.Spy;
  let createProductSpy: jasmine.Spy;
  let listProductsSpy: jasmine.Spy;
  let getProductSpy: jasmine.Spy;
  let updateProductSpy: jasmine.Spy;
  let deleteProductSpy: jasmine.Spy;
  let createOrderSpy: jasmine.Spy;
  let listOrdersSpy: jasmine.Spy;
  let getOrderSpy: jasmine.Spy;
  let deleteOrderSpy: jasmine.Spy;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    created_at: new Date().toISOString()
  };

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'A test product',
    price_cents: 1999,
    created_at: new Date().toISOString()
  };

  const mockOrder = {
    id: 1,
    user_id: 1,
    created_at: new Date().toISOString(),
    products: [{ product_id: 1, quantity: 2 }]
  };

  // Valid JWT token for testing (pre-generated with test secret)
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {
    // Setup all spies
    createUserSpy = spyOn(userModel, 'createUser');
    authenticateUserSpy = spyOn(userModel, 'authenticateUser');
    listUsersSpy = spyOn(userModel, 'listUsers');
    getUserByIdSpy = spyOn(userModel, 'getUserById');
    
    createProductSpy = spyOn(productModel, 'createProduct');
    listProductsSpy = spyOn(productModel, 'listProducts');
    getProductSpy = spyOn(productModel, 'getProduct');
    updateProductSpy = spyOn(productModel, 'updateProduct');
    deleteProductSpy = spyOn(productModel, 'deleteProduct');
    
    createOrderSpy = spyOn(orderModel, 'createOrder');
    listOrdersSpy = spyOn(orderModel, 'listOrders');
    getOrderSpy = spyOn(orderModel, 'getOrder');
    deleteOrderSpy = spyOn(orderModel, 'deleteOrder');
  });

  // User API Tests
  describe('Users API', () => {
    describe('POST /api/users', () => {
      it('should create a user successfully', async () => {
        createUserSpy.and.returnValue(Promise.resolve(mockUser));

        const userData = { username: 'testuser', email: 'test@test.com', password: 'pass123' };
        const response = await request(app).post('/api/users').send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
        expect(createUserSpy).toHaveBeenCalledWith(userData);
      });

      it('should return 400 for missing fields', async () => {
        const response = await request(app).post('/api/users').send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing fields');
      });
    });

    describe('POST /api/users/login', () => {
      it('should login successfully with valid credentials', async () => {
        authenticateUserSpy.and.returnValue(Promise.resolve(mockUser));

        const loginData = { email: 'test@test.com', password: 'pass123' };
        const response = await request(app).post('/api/users/login').send(loginData);

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toEqual(mockUser);
        expect(authenticateUserSpy).toHaveBeenCalledWith('test@test.com', 'pass123');
      });

      it('should return 400 for missing fields', async () => {
        const response = await request(app).post('/api/users/login').send({});
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Missing email or password');
      });

      it('should return 401 for invalid credentials', async () => {
        authenticateUserSpy.and.returnValue(Promise.resolve(null));

        const loginData = { email: 'test@test.com', password: 'wrongpassword' };
        const response = await request(app).post('/api/users/login').send(loginData);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });
    });

    describe('GET /api/users', () => {
      it('should return 401 when not authenticated', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });
    });
  });

  // Product API Tests
  describe('Products API', () => {
    describe('GET /api/products', () => {
      it('should return products list', async () => {
        listProductsSpy.and.returnValue(Promise.resolve([mockProduct]));

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockProduct]);
        expect(listProductsSpy).toHaveBeenCalled();
      });
    });

    describe('POST /api/products', () => {
      it('should return 401 when not authenticated', async () => {
        const productData = { name: 'Test Product', price_cents: 1999 };
        const response = await request(app).post('/api/products').send(productData);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });

      it('should return 401 for invalid token', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Authorization', `Bearer ${validToken}`)
          .send({});

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid token');
      });
    });

    describe('GET /api/products/:id', () => {
      it('should return product by id', async () => {
        getProductSpy.and.returnValue(Promise.resolve(mockProduct));

        const response = await request(app).get('/api/products/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProduct);
        expect(getProductSpy).toHaveBeenCalledWith(1);
      });

      it('should return 404 for non-existent product', async () => {
        getProductSpy.and.returnValue(Promise.resolve(null));

        const response = await request(app).get('/api/products/999');

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Product not found');
      });
    });
  });

  // Order API Tests
  describe('Orders API', () => {
    describe('POST /api/orders', () => {
      it('should return 401 when not authenticated', async () => {
        const response = await request(app).post('/api/orders').send({});
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });
    });

    describe('GET /api/orders', () => {
      it('should return 401 when not authenticated', async () => {
        const response = await request(app).get('/api/orders');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });
    });

    describe('GET /api/orders/:id', () => {
      it('should return 401 when not authenticated', async () => {
        const response = await request(app).get('/api/orders/1');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });
    });

    describe('DELETE /api/orders/:id', () => {
      it('should return 401 when not authenticated', async () => {
        const response = await request(app).delete('/api/orders/1');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Missing Authorization header');
      });
    });
  });

  // Additional Authentication Tests
  describe('Authentication Tests', () => {
    it('should return 401 for invalid authorization header format', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid Authorization header');
    });

    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});