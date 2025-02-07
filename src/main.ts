import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from './custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  configureValidationPipe(app);
  app.useLogger(app.get(CustomLogger));
  await app.listen(process.env.PORT ?? 3000);
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SwaggerJS')
    .setDescription('Documentation build successfully.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

bootstrap();
