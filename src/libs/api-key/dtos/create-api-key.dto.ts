import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Nombre del usuario asociado a la API key',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @ApiProperty({
    description: 'Descripción de la API key y su propósito',
    example: 'API key para acceso a los servicios de gestión de archivos',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    description: 'Roles asociados a la API key',
    example: ['admin', 'user'],
  })
  @IsArray()
  @IsOptional()
  readonly roles?: string[];
}
