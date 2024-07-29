import { Module } from "@nestjs/common";
import { FileController } from "./controller/file.controller";
import { FileService } from "./services/file.service";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { configureCloudinary } from "./config/cloudinary.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: "CLOUDINARY_CONFIG",
      useFactory: (configService: ConfigService) =>
        configureCloudinary(configService),
      inject: [ConfigService],
    },
  ],
})
export class FileModule {}
