import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FilesController } from "./cloudinary.controller";

@Module({
  controllers: [FilesController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
