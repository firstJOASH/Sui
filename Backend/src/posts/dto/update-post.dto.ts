import { IsOptional, IsString, IsEnum, IsArray, IsUrl, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus, PostCategory } from '../entities/post.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;
}
