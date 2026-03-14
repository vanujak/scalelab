import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local development
      'http://scalelab.easycase.site', // HTTP Production
      'https://scalelab.easycase.site', // HTTPS Production
    ],
    credentials: true,
  });
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
