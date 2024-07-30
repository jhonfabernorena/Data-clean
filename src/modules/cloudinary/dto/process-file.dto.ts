import { IsBoolean, IsOptional, IsString, IsEnum } from "class-validator";

export class ProcessFileDto {
  @IsOptional()
  @IsBoolean()
  deduplicate?: boolean;

  @IsOptional()
  @IsBoolean()
  validate?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc";
}
