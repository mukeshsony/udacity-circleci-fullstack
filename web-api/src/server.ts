import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
dotenv.config();

const app = express();
app.use(express.json());
app.use(usersRouter);
app.use(productsRouter);
app.use(ordersRouter);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
