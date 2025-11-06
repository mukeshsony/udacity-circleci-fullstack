import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint for EB
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Storefront API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use(usersRouter);
app.use(productsRouter);
app.use(ordersRouter);

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
