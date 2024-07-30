import { Module } from "@nestjs/common";
import { CloudinaryService } from "./services/cloudinary.service";
import { FileProcessingService } from "./services/file-processing.service";
import { FilesController } from "./cloudinary.controller";

@Module({
  controllers: [FilesController],
  providers: [CloudinaryService, FileProcessingService],
  exports: [CloudinaryService, FileProcessingService],
})
export class CloudinaryModule {}
