import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the post this comment is for',
    example: '64dce2e6bcbaff2e18f45fcb'
  })
  @IsMongoId()
  post: string;

  @ApiProperty({
    description: 'ID of the user who authored the comment',
    example: '64dce0a3bcbaff2e18f45fc9'
  })
  @IsMongoId()
  author: string;

  @ApiProperty({
    description: 'Content of the comment',
    example: 'This post is very insightful!'
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
