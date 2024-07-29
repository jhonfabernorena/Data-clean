import { Module } from "@nestjs/common";
import { FileController } from "./controller/returnFile.controller";
import { FileService } from "./service/returnFile.service";

@Module({
  controllers: [FileController],
  providers: [FileService],
})
export class ReturnFileModule {}
