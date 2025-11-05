# REQUIREMENTS & API Specification

## RESTful Routes (endpoints)
Users:
- POST /api/users         → Create a new user (register) [Public]
- POST /api/users/login   → Authenticate a user, return JWT [Public]
- GET  /api/users/:id     → Get user details (requires JWT) [Private]
- GET  /api/users         → List users (requires JWT) [Private]

Products:
- POST   /api/products       → Create a product [Private]
- GET    /api/products       → List products [Public]
- GET    /api/products/:id   → Get single product [Public]
- PUT    /api/products/:id   → Update product [Private]
- DELETE /api/products/:id   → Delete product [Private]
- GET    /api/products/popular → Get top 5 popular products (based on orders) [Public]

Orders:
- POST   /api/orders         → Create an order for a user (requires JWT) [Private]
- GET    /api/orders         → List orders (requires JWT) [Private]
- GET    /api/orders/:id     → Get order details (requires JWT & ownership) [Private]
- DELETE /api/orders/:id     → Delete an order (requires JWT & ownership) [Private]

Auth:
- Authentication via JWT. Token returned on login and must be sent in `Authorization: Bearer <token>` header for protected routes.

## Database Schema (PostgreSQL)

Tables and columns (types):

### users
- id: SERIAL PRIMARY KEY
- username: VARCHAR(100) UNIQUE NOT NULL
- email: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL -- hashed with bcrypt + salt
- created_at: TIMESTAMPTZ DEFAULT now()

### products
- id: SERIAL PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- description: TEXT
- price_cents: INTEGER NOT NULL -- price in cents to avoid floats
- created_at: TIMESTAMPTZ DEFAULT now()

### orders
- id: SERIAL PRIMARY KEY
- user_id: INTEGER REFERENCES users(id) ON DELETE CASCADE
- status: VARCHAR(50) DEFAULT 'active' -- or 'complete'
- created_at: TIMESTAMPTZ DEFAULT now()

### order_products (join table)
- id: SERIAL PRIMARY KEY
- order_id: INTEGER REFERENCES orders(id) ON DELETE CASCADE
- product_id: INTEGER REFERENCES products(id) ON DELETE CASCADE
- quantity: INTEGER NOT NULL DEFAULT 1
- unit_price_cents: INTEGER NOT NULL -- store product price at time of order

## Example SQL queries

-- Select: Get user by id
SELECT id, username, email, created_at FROM users WHERE id = $1;

-- Update: change product price
UPDATE products SET price_cents = 1999 WHERE id = 5;

-- Delete: remove a product
DELETE FROM products WHERE id = 123;

-- Where clause: find orders for a single user
SELECT * FROM orders WHERE user_id = $1;

-- Popular products: top 5 by total quantity ordered
SELECT p.id, p.name, SUM(op.quantity) AS total_ordered
FROM products p
JOIN order_products op ON op.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_ordered DESC
LIMIT 5;

## Migrations
This project includes SQL migration files in `migrations/`. Running `npm run db:migrate` will apply `up` migrations; `npm run db:rollback` will revert the last applied migration.

