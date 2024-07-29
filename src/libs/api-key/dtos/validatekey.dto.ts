import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class validateKeyDto {
  @ApiProperty({
    description: 'Name of the system for which the API key is created',
    example: 'hgjonb668jjec7m7p50y',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;
}
