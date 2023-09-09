import { HttpStatus } from '@nestjs/common';
import { objectBuilder, withDatesBuilder } from '@tests/test.helpers';
// import { objectBuilder } from '@tests/test.helpers';
import { execSync } from 'child_process';
import * as pactum from 'pactum';
import { TaskDomain } from './domain/task.domain';
import { CreateTaskDto } from './dto';

describe('task e2e', () => {
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

  describe('get All tasks', () => {
    it('should throw if not logged', async () => {
      return pactum.spec().get('/task').expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should return all tasks by user', async () => {
      return pactum
        .spec()
        .get('/task')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK)
        .expectJsonLength(2);
    });
  });

  describe('get One task', () => {
    it('should throw if not logged', async () => {
      return pactum
        .spec()
        .get('/task/valid_id')
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should throw 404 error if task not found', async () => {
      return pactum
        .spec()
        .get('/task/invalid_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND);
    });

    it('should not return a task from another user', async () => {
      return pactum
        .spec()
        .get('/task/bob_task01_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND);
    });

    it('should return a task by id', async () => {
      return pactum
        .spec()
        .get('/task/alice_task01_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK)
        .expectJsonMatchStrict(
          withDatesBuilder<TaskDomain>({
            description: 'Alice Task 01 Description',
            id: 'alice_task01_id',
            status: 'TODO',
            title: 'Alice Task 01',
            userId: 'alice_id',
          }),
        );
    });
  });

  describe('create task', () => {
    it('should throw if not logged', async () => {
      return pactum
        .spec()
        .post('/task')
        .withJson({
          title: 'Alice Task 03',
          description: 'Alice Task 03 Description',
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should throw 400 error if dto is not valid', async () => {
      return pactum
        .spec()
        .post('/task')
        .withBearerToken(accessToken)
        .withJson({})
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should throw 400 error if status is not a valid status', async () => {
      return pactum
        .spec()
        .post('/task')
        .withBearerToken(accessToken)
        .withJson({
          status: 'INVALID_STATUS',
          title: 'Alice Task 03',
          description: 'Alice Task 03 Description',
          userId: 'alice_id',
        })
        .expectStatus(HttpStatus.BAD_REQUEST);
    });

    it('should create a task', async () => {
      return pactum
        .spec()
        .post('/task')
        .withBearerToken(accessToken)
        .withJson(
          objectBuilder<CreateTaskDto>({
            status: 'TODO',
            title: 'Alice Task 03',
            userId: 'alice_id',
            description: 'Alice Task 03 Description',
          }),
        )
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Alice Task 03');
    });
  });

  describe('delete task', () => {
    it('should throw if not logged', async () => {
      return pactum
        .spec()
        .delete('/task/valid_id')
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should throw 404 error if task not found', async () => {
      return pactum
        .spec()
        .delete('/task/invalid_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND);
    });

    it('should throw 403 error if task is from another user', async () => {
      return pactum
        .spec()
        .delete('/task/bob_task01_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('should delete a task', async () => {
      return pactum
        .spec()
        .delete('/task/alice_task01_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK);
    });
  });

  describe('update task', () => {
    it('should throw if not logged', async () => {
      return pactum
        .spec()
        .patch('/task/valid_id')
        .withJson({
          title: 'updated title',
          description: 'updated description',
        })
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should throw 404 error if task not found', async () => {
      return pactum
        .spec()
        .patch('/task/invalid_id')
        .withJson({
          title: 'updated title',
          description: 'updated description',
        })
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND);
    });

    it('should throw 403 error if task is from another user', async () => {
      return pactum
        .spec()
        .patch('/task/bob_task01_id')
        .withJson({
          title: 'updated title',
          description: 'updated description',
        })
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('should update a task', async () => {
      return pactum
        .spec()
        .patch('/task/alice_task02_id')
        .withJson({
          title: 'updated title',
          description: 'updated description',
        })
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('updated title');
    });
  });

  describe('archive task', () => {
    it('should throw if not logged', async () => {
      return pactum
        .spec()
        .patch('/task/archive/valid_id')
        .expectStatus(HttpStatus.UNAUTHORIZED);
    });

    it('should throw 404 error if task not found', async () => {
      return pactum
        .spec()
        .patch('/task/archive/invalid_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.NOT_FOUND);
    });

    it('should throw 403 error if task is from another user', async () => {
      return pactum
        .spec()
        .patch('/task/archive/bob_task01_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.FORBIDDEN);
    });

    it('should archive a task', async () => {
      return pactum
        .spec()
        .patch('/task/archive/alice_task02_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('ARCHIVED');
    });

    it('should throw 400 error if task is already archived', async () => {
      return pactum
        .spec()
        .patch('/task/archive/alice_task02_id')
        .withBearerToken(accessToken)
        .expectStatus(HttpStatus.BAD_REQUEST);
    });
  });
});
