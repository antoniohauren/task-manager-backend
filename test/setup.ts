import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

export let app: NestExpressApplication;
const PORT = process.env.PORT || 3000;

async function initServer() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);

  pactum.request.setBaseUrl(`http://localhost:${PORT}`);
}

global.beforeAll(async () => {
  await initServer();
});

global.afterAll(async () => {
  app.close();
});
