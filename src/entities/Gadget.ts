import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum GadgetStatus {
  AVAILABLE = 'Available',
  DEPLOYED = 'Deployed',
  DECOMMISSIONED = 'Decommissioned',
  DESTROYED = 'Destroyed'
}

@Entity('gadgets')
export class Gadget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  codename!: string;

  @Column({
    type: 'enum',
    enum: GadgetStatus,
    default: GadgetStatus.AVAILABLE
  })
  status!: GadgetStatus;

  @Column({ type: 'timestamp', nullable: true })
  decommissionedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}