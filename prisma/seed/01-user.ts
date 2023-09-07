import { PrismaClient, Prisma } from '@prisma/client';
import { WithId } from './types';

const keys = ['alice', 'bob'] as const;

export const users: Record<
  (typeof keys)[number],
  WithId<Prisma.UserCreateInput>
> = {
  alice: {
    id: 'alice_id',
    name: 'Alice',
    email: 'alice@gmail.com',
  },
  bob: {
    id: 'bob_id',
    name: 'Bob',
    email: 'bob@gmail.com',
  },
};

// noinspection JSUnusedGlobalSymbols
export const user = async (prisma: PrismaClient) => {
  for (const obj of Object.values(users)) {
    await prisma.user.upsert({
      where: { id: obj.id },
      update: obj,
      create: obj,
    });
  }
};
