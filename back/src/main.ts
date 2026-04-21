import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // libera logo tudo senao da erro de cors no expo
  app.enableCors({
    origin: '*',
  });

  // tudo vai ficar dentro do /api
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 vrum vrum... API subiu! da um confere nela em localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
