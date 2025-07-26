// src/comments/comments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { post, author, content } = createCommentDto;

    if (!Types.ObjectId.isValid(post) || !Types.ObjectId.isValid(author)) {
      throw new BadRequestException('Invalid post or author ID');
    }

    const comment = new this.commentModel({
      post: new Types.ObjectId(post),
      author: new Types.ObjectId(author),
      content
    });

    return comment.save();
  }

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find()
      .populate('author', 'username email')
      .populate('post', 'title')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id)
      .populate('author', 'username email')
      .populate('post', 'title')
      .exec();

    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
      new: true
    }).exec();

    if (!comment) throw new NotFoundException(`Comment with ID ${id} not found`);
    return comment;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const deleted = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Comment with ID ${id} not found`);
  }
}
