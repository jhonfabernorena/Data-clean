import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./libs/api-key/entities/apikey.entity";
import { ApiKeyController } from "./libs/api-key/controllers/apikey.controller";
import { ApiKeyService } from "./libs/api-key/service/apiKey.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hacer que el módulo de configuración sea global
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DB"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class AppModule {}
