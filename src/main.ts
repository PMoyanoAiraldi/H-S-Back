import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true, // Evita validar propiedades no enviadas
      skipUndefinedProperties: true, // Ignora campos que no están definidos
    }),
  );
  // Configura CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // Definir la URL de frontend
  console.log({ frontendUrl });

  app.enableCors({
    origin: frontendUrl,  // Asegúrate de que esta URL sea la correcta
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si usas cookies o autenticación basada en sesiones
    allowedHeaders: 'Authorization,Content-Type, Accept',
    maxAge: 3600,
  });

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
        .setTitle('H&S')
        .setDescription('Esta aplicación permite a los usuarios visualizar los productos ofrecidos por H&S Hidraulica, sólo los clientes registrados podrán visualizar su lista de precios ')
        .addBearerAuth()
        .setVersion('1.0')
        .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(3010);
}
bootstrap();
