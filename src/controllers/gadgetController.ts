import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Gadget, GadgetStatus } from '../entities/Gadget';
import { CreateGadgetDto, UpdateGadgetDto, GadgetResponse } from '../types/gadget.types';
import { nanoid } from 'nanoid';

const gadgetRepository = AppDataSource.getRepository(Gadget);

function generateCodename(): string {
  const adjectives = ['Silent', 'Golden', 'Quantum', 'Stealth', 'Shadow', 'Crimson', 'Arctic', 'Thunder'];
  const nouns = ['Phoenix', 'Eagle', 'Tiger', 'Wolf', 'Falcon', 'Dragon', 'Serpent', 'Hawk'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

function addMissionSuccessProbability(gadget: Gadget): GadgetResponse {
  return {
    ...gadget,
    missionSuccessProbability: Math.random() * 100
  };
}

export const getGadgets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    
    let gadgets: Gadget[];
    
    if (status) {
      gadgets = await gadgetRepository.find({
        where: { status: status as GadgetStatus },
        order: { createdAt: 'DESC' }
      });
    } else {
      gadgets = await gadgetRepository.find({
        order: { createdAt: 'DESC' }
      });
    }

    const gadgetsWithProbability = gadgets.map(addMissionSuccessProbability);
    
    res.json(gadgetsWithProbability);
  } catch (error) {
    next(error);
  }
};

export const createGadget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name }: CreateGadgetDto = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const gadget = gadgetRepository.create({
      name,
      codename: generateCodename(),
      status: GadgetStatus.AVAILABLE
    });

    const savedGadget = await gadgetRepository.save(gadget);
    
    res.status(201).json(savedGadget);
  } catch (error) {
    next(error);
  }
};

export const updateGadget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateGadgetDto = req.body;

    const gadget = await gadgetRepository.findOne({ where: { id } });

    if (!gadget) {
      res.status(404).json({ error: 'Gadget not found' });
      return;
    }

    if (updateData.name !== undefined) {
      gadget.name = updateData.name;
    }

    if (updateData.status !== undefined) {
      gadget.status = updateData.status;
    }

    const updatedGadget = await gadgetRepository.save(gadget);
    
    res.json(updatedGadget);
  } catch (error) {
    next(error);
  }
};

export const deleteGadget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const gadget = await gadgetRepository.findOne({ where: { id } });

    if (!gadget) {
      res.status(404).json({ error: 'Gadget not found' });
      return;
    }

    gadget.status = GadgetStatus.DECOMMISSIONED;
    gadget.decommissionedAt = new Date();

    const updatedGadget = await gadgetRepository.save(gadget);
    
    res.json({
      message: 'Gadget decommissioned successfully',
      gadget: updatedGadget
    });
  } catch (error) {
    next(error);
  }
};

export const selfDestructGadget = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const gadget = await gadgetRepository.findOne({ where: { id } });

    if (!gadget) {
      res.status(404).json({ error: 'Gadget not found' });
      return;
    }

    if (gadget.status === GadgetStatus.DESTROYED) {
      res.status(400).json({ error: 'Gadget already destroyed' });
      return;
    }

    const confirmationCode = nanoid(10).toUpperCase();
    
    gadget.status = GadgetStatus.DESTROYED;
    await gadgetRepository.save(gadget);
    
    res.json({
      message: 'Self-destruct sequence initiated',
      confirmationCode,
      gadget
    });
  } catch (error) {
    next(error);
  }
};