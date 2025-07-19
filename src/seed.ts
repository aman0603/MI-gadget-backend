import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Gadget, GadgetStatus } from './entities/Gadget';

const gadgetSeeds = [
  { name: 'Exploding Pen', codename: 'GoldenEye007' },
  { name: 'Invisible Car', codename: 'VanishPoint' },
  { name: 'Laser Watch', codename: 'TimeStrike' },
  { name: 'Grappling Hook Belt', codename: 'SkyHook' },
  { name: 'Miniature Camera', codename: 'MicroLens' },
  { name: 'Smoke Bomb Cufflinks', codename: 'SmokeScreen' },
  { name: 'Submarine Car', codename: 'DeepDive' },
  { name: 'Jetpack', codename: 'RocketMan' },
  { name: 'X-Ray Glasses', codename: 'SeeThrough' },
  { name: 'Voice Changer', codename: 'EchoMimic' }
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const gadgetRepository = AppDataSource.getRepository(Gadget);

    const existingGadgets = await gadgetRepository.count();
    
    if (existingGadgets > 0) {
      console.log('Database already contains gadgets. Skipping seed.');
      process.exit(0);
    }

    const gadgets = gadgetSeeds.map(seed => 
      gadgetRepository.create({
        name: seed.name,
        codename: seed.codename,
        status: GadgetStatus.AVAILABLE
      })
    );

    await gadgetRepository.save(gadgets);

    console.log(`Successfully seeded ${gadgets.length} gadgets`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();