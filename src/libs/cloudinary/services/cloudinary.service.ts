import { Injectable } from "@nestjs/common";
import cloudinary from "../cloudinary.config";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  async uploadFile(fileBuffer: Buffer, filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", public_id: filename },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });
  }
}
