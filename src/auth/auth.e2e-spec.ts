import { execSync } from 'child_process';
import * as pactum from 'pactum';

describe('auth e2e', () => {
  let refreshToken: string;
  let accessToken: string;

  beforeAll(async () => {
    execSync('npm run prisma:reset');
    updateTokens();
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
    refreshToken = response.body.refreshToken;
  }

  describe('sign-in', () => {
    it('should return access token and refresh token', async () => {
      return pactum
        .spec()
        .post('/auth/sign-in')
        .withJson({
          email: 'alice@gmail.com',
          password: 'alice_password',
        })
        .expectStatus(200);
    });

    it('should throw if invalid credentials', async () => {
      return pactum
        .spec()
        .post('/auth/sign-in')
        .withJson({
          email: 'alice@gmail.com',
          password: 'wrong_password',
        })
        .expectStatus(401);
    });
  });

  describe('sign-up', () => {
    it('should create a user', async () => {
      return pactum
        .spec()
        .post('/auth/sign-up')
        .withJson({
          email: 'teste@teste.com',
          name: 'teste',
          password: 'teste',
        })
        .expectStatus(201);
    });

    it('should throw if email already in use', async () => {
      return pactum
        .spec()
        .post('/auth/sign-up')
        .withJson({
          email: 'alice@gmail.com',
          name: 'teste',
          password: 'teste',
        })
        .expectStatus(409);
    });
  });

  describe('sign-out', () => {
    it('should throw if has no access_token', async () => {
      return pactum.spec().post('/auth/sign-out').expectStatus(401);
    });

    it('should throw if has invalid access_token', async () => {
      return pactum
        .spec()
        .post('/auth/sign-out')
        .withBearerToken('invalid_token')
        .expectStatus(401);
    });

    it('should sign-out', async () => {
      return pactum
        .spec()
        .post('/auth/sign-out')
        .withBearerToken(accessToken)
        .expectStatus(200);
    });
  });

  describe('refresh-token', () => {
    it('should throw if has no refresh_token', async () => {
      return pactum.spec().post('/auth/refresh').expectStatus(401);
    });

    it('should throw if has invalid refresh_token', async () => {
      return pactum
        .spec()
        .post('/auth/refresh')
        .withBearerToken('invalid_token')
        .expectStatus(401);
    });

    it('should throw if send access_token instead of refresh_token', async () => {
      return pactum
        .spec()
        .post('/auth/refresh')
        .withBearerToken(accessToken)
        .expectStatus(401);
    });

    it('should throw if old refresh_token is sent', async () => {
      return pactum
        .spec()
        .post('/auth/refresh')
        .withBearerToken(refreshToken)
        .expectStatus(401);
    });

    it('should refresh if valid refresh_token is sent', async () => {
      await updateTokens();

      return pactum
        .spec()
        .post('/auth/refresh')
        .withBearerToken(refreshToken)
        .expectStatus(200);
    });
  });
});
