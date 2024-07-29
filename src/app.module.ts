
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey, ApiKeySchema } from './libs/api-key/entities/apikey.entity';
import { ApiKeyController } from './libs/api-key/controllers/apikey.controller';
import { ApiKeyService } from './libs/api-key/service/apiKey.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),

  ],
  controllers: [ApiKeyController], // Solo los controladores deben estar aquí
  providers: [ApiKeyService], // Solo los servicios deben estar aquí
})
export class AppModule {}
