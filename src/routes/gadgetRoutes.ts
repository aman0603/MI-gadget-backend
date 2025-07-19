import { Router } from 'express';
import {
  getGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestructGadget
} from '../controllers/gadgetController';

const router = Router();

router.get('/', getGadgets);
router.post('/', createGadget);
router.patch('/:id', updateGadget);
router.delete('/:id', deleteGadget);
router.post('/:id/self-destruct', selfDestructGadget);

export default router;