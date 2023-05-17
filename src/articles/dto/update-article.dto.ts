import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty({ example: 'Article title is about..' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(512)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'This is any text of the article up to 16448 char.' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(16448)
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: 'www.google.com' })
  @IsNotEmpty()
  @MaxLength(512)
  @IsUrl()
  @IsOptional()
  sourceUrl?: string;

  @ApiProperty({ example: 'article' })
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  sourceType?: string;
}