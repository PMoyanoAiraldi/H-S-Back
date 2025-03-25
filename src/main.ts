import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new DocumentBuilder()
        .setTitle('H&S')
        .setDescription('Esta aplicación permite a los usuarios visualizar los productos ofrecidos por H&S Hidraulica, sólo los clientes registrados podrán visualizar su lista de precios ')
        .setVersion('1.0')
        .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(3010);
}
bootstrap();
