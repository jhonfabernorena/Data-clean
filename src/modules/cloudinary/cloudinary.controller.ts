import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./services/cloudinary.service";
import { FileProcessingService } from "./services/file-processing.service";
import { ApiTags } from "@nestjs/swagger";
import { ProcessFileDto } from "./dto/process-file.dto";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly fileProcessingService: FileProcessingService,
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.mimetype !== "text/csv") {
      throw new Error("Invalid file type");
    }

    // Subir el archivo a Cloudinary con un nombre de archivo fijo
    const result = await this.cloudinaryService.uploadFile(
      file.buffer,
      "uploaded-file",
    );
    return result;
  }

  @Post("process")
  @UseInterceptors(FileInterceptor("file"))
  async processFile(
    @UploadedFile() file: Express.Multer.File,
    @Query() query: ProcessFileDto,
  ) {
    const result = await this.fileProcessingService.processFile(file, query);
    return result;
  }
}
