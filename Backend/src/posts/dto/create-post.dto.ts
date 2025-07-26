import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostCategory, PostStatus } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My Awesome Blog Post',
    minLength: 1,
    maxLength: 200
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The main content of the post',
    example: 'This is the detailed content of my blog post...',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'A short excerpt or summary of the post',
    example: 'This post discusses the latest trends in technology...',
    maxLength: 500
  })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({
    description: 'The category of the post',
    enum: PostCategory,
    example: PostCategory.TECHNOLOGY,
    default: PostCategory.GENERAL
  })
  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory;

  @ApiPropertyOptional({
    description: 'Tags associated with the post',
    example: ['javascript', 'nodejs', 'nestjs'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'URL of the post image',
    example: 'https://example.com/image.jpg'
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'The status of the post',
    enum: PostStatus,
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @IsString()
  event:string
}