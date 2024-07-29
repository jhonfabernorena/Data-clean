import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import * as csv from "fast-csv";
import * as stream from "stream";

@Injectable()
export class FileService {
  async processCSV(
    file: Express.Multer.File,
    options: {
      removeDuplicates: boolean;
      validateFormat: boolean;
      sort: { column: string; order: "asc" | "desc" };
    },
  ): Promise<Readable> {
    const rows: any[] = [];

    return new Promise((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv.parse({ headers: true }))
        .on("data", (row) => rows.push(row))
        .on("end", () => 
          if (options.removeDuplicates) {
            const uniqueRows = Array.from(
              new Set(rows.map((row) => JSON.stringify(row))),
            ).map((row) => JSON.parse(row));
            rows.length = 0;
            rows.push(...uniqueRows);
          }
      
          if (options.sort) {
            rows.sort((a, b) => {
              if (a[options.sort.column] > b[options.sort.column]) {
                return options.sort.order === "asc" ? 1 : -1;
              } else if (a[options.sort.column] < b[options.sort.column]) {
                return options.sort.order === "asc" ? -1 : 1;
              } else {
                return 0;
              }
            });
          }

          const processedCSVStream = new stream.PassThrough();
          const writeStream = csv.format({ headers: true });

          writeStream.pipe(processedCSVStream);

          rows.forEach((row) => writeStream.write(row));
          writeStream.end();

          resolve(processedCSVStream);
        })
        .on("error", reject);
    });
  }
}
