import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import gadgetRoutes from './routes/gadgetRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ 
    message: 'MI6 Gadget Inventory API',
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      gadgets: {
        list: 'GET /api/gadgets',
        create: 'POST /api/gadgets',
        update: 'PATCH /api/gadgets/:id',
        delete: 'DELETE /api/gadgets/:id',
        selfDestruct: 'POST /api/gadgets/:id/self-destruct'
      }
    },
    authentication: 'Bearer token required for gadget endpoints'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/gadgets', gadgetRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });