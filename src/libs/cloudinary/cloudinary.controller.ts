import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "./cloudinary.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file.mimetype !== "text/csv") {
      throw new Error("Invalid file type");
    }

    const result = await this.cloudinaryService.uploadFile(file);
    return result;
  }
}
