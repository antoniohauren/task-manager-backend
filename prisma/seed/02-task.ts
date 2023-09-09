import { Prisma, PrismaClient } from '@prisma/client';
import { WithId } from './types';

const keys = [
  'alice_task01',
  'alice_task02',
  'bob_task01',
  'bob_task02',
] as const;

export const tasks: Record<
  (typeof keys)[number],
  WithId<Omit<Prisma.TaskCreateInput, 'User'> & { userId: string }>
> = {
  alice_task01: {
    id: 'alice_task01_id',
    title: 'Alice Task 01',
    description: 'Alice Task 01 Description',
    userId: 'alice_id',
  },
  alice_task02: {
    id: 'alice_task02_id',
    title: 'Alice Task 02',
    description: 'Alice Task 02 Description',
    userId: 'alice_id',
  },
  bob_task01: {
    id: 'bob_task01_id',
    title: 'Bob Task 01',
    description: 'Bob Task 01 Description',
    userId: 'bob_id',
  },
  bob_task02: {
    id: 'bob_task02_id',
    title: 'Bob Task 02',
    description: 'Bob Task 02 Description',
    userId: 'bob_id',
  },
};

export const task = async (prisma: PrismaClient) => {
  for (const obj of Object.values(tasks)) {
    await prisma.task.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
};
