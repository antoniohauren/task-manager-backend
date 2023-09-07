import { HttpStatus } from '@nestjs/common';
import * as pactum from 'pactum';

describe('platform e2e', () => {
  beforeAll(async () => {
    // execSync('npm run prisma:reset');
  });

  it('should throw 404 error if user not found', async () => {
    return pactum.spec().get('/user/qwe').expectStatus(HttpStatus.NOT_FOUND);
  });
});
