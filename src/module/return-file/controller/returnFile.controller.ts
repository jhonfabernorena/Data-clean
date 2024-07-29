import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { FileService } from "../service/returnFile.service";

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiTags("returnFile")
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query()
    query: { removeDuplicates: string; validateFormat: string; sort: string },
    @Res() res: Response,
  ) {
    const options = {
      removeDuplicates: query.removeDuplicates === "true",
      validateFormat: query.validateFormat === "true",
      sort: query.sort ? JSON.parse(query.sort) : null,
    };

    try {
      const processedCSVStream = await this.fileService.processCSV(
        file,
        options,
      );

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="processed-file.csv"',
      );

      processedCSVStream.pipe(res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error processing file", error: error.message });
    }
  }
}
