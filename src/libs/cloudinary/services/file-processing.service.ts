import { Injectable } from "@nestjs/common";
import * as csv from "fast-csv";
import * as csvParser from "csv-parser";
import { Readable } from "stream";
import { CloudinaryService } from "./cloudinary.service";

@Injectable()
export class FileProcessingService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async processFile(file: Express.Multer.File, options: any): Promise<any> {
    // Leer el archivo CSV desde el buffer
    const records: any[] = [];
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    await new Promise<void>((resolve, reject) => {
      bufferStream
        .pipe(csvParser())
        .on("data", (data) => records.push(data))
        .on("end", () => resolve())
        .on("error", (error) => reject(error));
    });

    // Filtrar filas vacías
    const filteredRecords = this.filterEmptyRows(records);

    // Aplicar los procesos según las opciones
    if (options.deduplicate) {
      this.deduplicateRecords(filteredRecords);
    }

    if (options.validate) {
      this.validateRecords(filteredRecords);
    }

    if (options.sortBy) {
      this.sortRecords(filteredRecords, options.sortBy, options.sortOrder);
    }

    // Generar el archivo CSV procesado como buffer
    const processedFileBuffer = await this.generateCsvBuffer(filteredRecords);

    // Subir el archivo procesado a Cloudinary
    const result = await this.cloudinaryService.uploadFile(
      processedFileBuffer,
      "processed-file",
    );

    return result;
  }

  private filterEmptyRows(records: any[]): any[] {
    return records.filter((record) => {
      // Verificar si alguna de las columnas tiene un valor
      return Object.values(record).some(
        (value) => value != null && value !== "",
      );
    });
  }

  private deduplicateRecords(records: any[]) {
    const seen = new Set();
    const uniqueRecords = [];
    for (const record of records) {
      const key = JSON.stringify(record);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRecords.push(record);
      }
    }
    return uniqueRecords;
  }

  private validateRecords(records: any[]) {
    const keys = Object.keys(records[0] || {});
    for (const record of records) {
      for (const key of keys) {
        if (!record[key]) {
          throw new Error(`Missing value for ${key}`);
        }
      }
    }
  }

  private sortRecords(
    records: any[],
    sortBy: string,
    sortOrder: "asc" | "desc",
  ) {
    records.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  private async generateCsvBuffer(records: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const ws = csv.format({ headers: true });

      ws.on("data", (chunk) => chunks.push(chunk));
      ws.on("end", () => resolve(Buffer.concat(chunks)));
      ws.on("error", reject);

      records.forEach((record) => ws.write(record));
      ws.end();
    });
  }
}
