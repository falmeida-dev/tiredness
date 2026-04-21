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

  const port = process.env.PORT || 3000;
  // O Render exige que o servidor escute em '0.0.0.0'
  await app.listen(port, '0.0.0.0');
  console.log(`API funcionou ${port}`);
}
bootstrap();
