import { like } from 'pactum-matchers';

const DATE_MOCK = like('2021-01-01T00:00:00.000Z');

export function withDatesBuilder<T = any>(
  obj: Omit<T, 'createdAt' | 'updatedAt'>,
): T {
  return Object.assign(obj, {
    updatedAt: DATE_MOCK,
    createdAt: DATE_MOCK,
  }) as T;
}

export function objectBuilder<T = any>(obj: T): T {
  return obj;
}
