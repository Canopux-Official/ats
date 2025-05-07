import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // This will expose files at http://localhost:3000/uploads/filename.pdf
  });
  app.enableCors({
    origin: 'http://localhost:5173', // Allow all origins (change this in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow sending cookies or authentication headers
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
