import { Router } from 'express';
import {
  getGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestructGadget
} from '../controllers/gadgetController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getGadgets);
router.post('/', authenticate, createGadget);
router.patch('/:id', authenticate, updateGadget);
router.delete('/:id', authenticate, deleteGadget);
router.post('/:id/self-destruct', authenticate, selfDestructGadget);

export default router;