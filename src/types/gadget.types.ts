import { GadgetStatus } from '../entities/Gadget';

export interface CreateGadgetDto {
  name: string;
}

export interface UpdateGadgetDto {
  name?: string;
  status?: GadgetStatus;
}

export interface GadgetResponse {
  id: string;
  name: string;
  codename: string;
  status: GadgetStatus;
  decommissionedAt: Date | null;
  missionSuccessProbability?: number;
  createdAt: Date;
  updatedAt: Date;
}