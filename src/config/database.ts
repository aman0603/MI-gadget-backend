import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Gadget } from '../entities/Gadget';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  entities: [Gadget],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});