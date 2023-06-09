/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ["http://localhost:4200", "https://pulsechecker.netlify.app", /\.pulsechecker\.com$/],
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: [
        'Accept',
        'Content-Type',
        'Authorization',
      ]
    }
  });
  const globalPrefix = "v1";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setBasePath('v1')
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
