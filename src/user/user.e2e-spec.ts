import { HttpStatus } from '@nestjs/common';
import { objectBuilder } from '@tests/test.helpers';
import { execSync } from 'child_process';
import * as pactum from 'pactum';
import { CreateUserDto } from './dto';

describe('user e2e', () => {
  let accessToken: string;

  beforeAll(async () => {
    execSync('npm run prisma:reset');
    await updateTokens();
  });

  async function updateTokens() {
    const response = await pactum
      .spec()
      .post('/auth/sign-in')
      .withJson({
        email: 'alice@gmail.com',
        password: 'alice_password',
      })
      .toss();

    accessToken = response.body.accessToken;
  }

  it('should throw if not logged', async () => {
    return pactum.spec().get('/user').expectStatus(HttpStatus.UNAUTHORIZED);
  });

  it('should throw 404 error if user not found', async () => {
    return pactum
      .spec()
      .get('/user/qwe')
      .withBearerToken(accessToken)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('should throw 409 error if email already in use', async () => {
    return pactum
      .spec()
      .post('/user')
      .withBearerToken(accessToken)
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
      .withBearerToken(accessToken)
      .withJson({})
      .expectStatus(HttpStatus.BAD_REQUEST);
  });

  it('should create a user', async () => {
    return pactum
      .spec()
      .post('/user')
      .withBearerToken(accessToken)
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
