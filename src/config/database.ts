import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Gadget } from '../entities/Gadget';
import { User } from '../entities/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, 
  logging: process.env.NODE_ENV === 'development',
  entities: [Gadget, User],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});