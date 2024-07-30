import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cloudinaryConfig } from "./libs/cloudinary/cloudinary.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inicializa Cloudinary
  cloudinaryConfig();

  // Configuración de variables de entorno
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3000;

  // Configuración de CORS
  app.enableCors();

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("API Key Management")
    .setDescription("API for managing API keys")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
