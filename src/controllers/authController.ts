import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';
import { nanoid } from 'nanoid';

const userRepository = AppDataSource.getRepository(User);

function generateAgentCode(): string {
  return `MI6-${nanoid(8).toUpperCase()}`;
}

function generateToken(user: User): string {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    agentCode: user.agentCode
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
}

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password }: RegisterDto = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    const existingUser = await userRepository.findOne({
      where: [
        { username },
        { email }
      ]
    });

    if (existingUser) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    const user = userRepository.create({
      username,
      email,
      password,
      agentCode: generateAgentCode()
    });

    const savedUser = await userRepository.save(user);

    const token = generateToken(savedUser);

    const response: AuthResponse = {
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        agentCode: savedUser.agentCode,
        role: savedUser.role
      },
      token
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password }: LoginDto = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const user = await userRepository.findOne({
      where: { username }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user);

    const response: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        agentCode: user.agentCode,
        role: user.role
      },
      token
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as any;
    if (!authReq.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const userId = authReq.user.userId;

    const user = await userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      agentCode: user.agentCode,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
};