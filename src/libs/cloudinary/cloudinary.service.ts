import { Injectable } from "@nestjs/common";
import cloudinary from "./cloudinary.config";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });
  }
}
