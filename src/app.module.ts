import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./libs/api-key/entities/apikey.entity";
import { ApiKeyController } from "./libs/api-key/controllers/apikey.controller";
import { ApiKeyService } from "./libs/api-key/service/apiKey.service";
import { CloudinaryModule } from "./modules/cloudinary/cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot(), // Cargar las variables de entorno
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB_NAME}${process.env.MONGODB_OPTIONS}`,
    ),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
    CloudinaryModule,
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class AppModule {}
