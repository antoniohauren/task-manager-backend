import { HttpStatus } from '@nestjs/common';
import { objectBuilder } from '@tests/test.helpers';
import { execSync } from 'child_process';
import * as pactum from 'pactum';
import { CreateUserDto } from './dto';

describe('platform e2e', () => {
  beforeAll(async () => {
    execSync('npm run prisma:reset');
  });

  it('should throw 404 error if user not found', async () => {
    return pactum.spec().get('/user/qwe').expectStatus(HttpStatus.NOT_FOUND);
  });

  it('should throw 409 error if email already in use', async () => {
    return pactum
      .spec()
      .post('/user')
      .withJson(
        objectBuilder<CreateUserDto>({
          email: 'alice@gmail.com',
          name: 'teste',
          password: 'teste',
        }),
      )
      .expectStatus(HttpStatus.CONFLICT);
  });

  it('should throw 400 error if dto is not valid', async () => {
    return pactum
      .spec()
      .post('/user')
      .withJson({})
      .expectStatus(HttpStatus.BAD_REQUEST);
  });

  it('should create a user', async () => {
    return pactum
      .spec()
      .post('/user')
      .withJson(
        objectBuilder<CreateUserDto>({
          email: 'antonio@gmail.com',
          name: 'Antonio',
          password: 'teste',
        }),
      )
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('antonio@gmail.com');
  });
});
