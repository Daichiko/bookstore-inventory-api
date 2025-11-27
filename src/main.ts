import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { port } from './common/config/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const firstError = errors[0];

        const constraints = firstError.constraints;
        let firstMessage: string | null = null;

        if (constraints) {
          firstMessage = Object.values(constraints)[0];
        } else {
          firstMessage = 'Error de validación desconocido.';
        }

        return new BadRequestException(firstMessage);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('bookstore-inventory-api')
    .setDescription('books')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port || 3000, () => {
    console.log(
      `Server running on port: ${port}, http://localhost:${port}/docs/`,
    );
  });
}
bootstrap();
