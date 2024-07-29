import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get<string>("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get<string>("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const uploadStream = cloudinary.uploader.upload_stream();

    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(uploadStream);

    return new Promise((resolve, reject) => {
      uploadStream.on("finish", () => resolve(uploadStream.url));
      uploadStream.on("error", reject);
    });
  }
}
