import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKeyController } from "./controllers/apikey.controller";
import { ApiKey, ApiKeySchema } from "./entities/apikey.entity";
import { ApiKeyService } from "./service/apiKey.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ApiKey.name, schema: ApiKeySchema }]),
  ],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}
