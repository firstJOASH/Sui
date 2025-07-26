import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument, PostStatus } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const postData = {
      ...createPostDto,
      author: new Types.ObjectId(authorId),
      publishedAt: createPostDto.status === PostStatus.PUBLISHED ? new Date() : undefined,
    };

    const createdPost = new this.postModel(postData);
    return createdPost.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: PostStatus,
    category?: string
  ): Promise<{ posts: Post[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const [posts, total] = await Promise.all([
      this.postModel
        .find(filter)
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(filter)
    ]);

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel
      .findById(id)
      .populate('author', 'username email')
      .populate('comments')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }


    await this.postModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const updateData = { ...updatePostDto };
    

    if (updatePostDto.status === PostStatus.PUBLISHED) {
      const existingPost = await this.postModel.findById(id);
      if (existingPost && existingPost.status !== PostStatus.PUBLISHED) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'username email')
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid post ID');
    }

    const result = await this.postModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }


  async likePost(postId: string, userId: string): Promise<Post> {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid post or user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

 
    const hasLiked = post.likes.some(like => like.equals(userObjectId));
    
    if (hasLiked) {
      throw new BadRequestException('You have already liked this post');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          $push: { likes: userObjectId },
          $inc: { likeCount: 1 }
        },
        { new: true }
      )
      .populate('author', 'username email')
      .exec();

    return updatedPost;
  }

  async unlikePost(postId: string, userId: string): Promise<Post> {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid post or user ID');
    }

    const userObjectId = new Types.ObjectId(userId);
    
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }


    const hasLiked = post.likes.some(like => like.equals(userObjectId));
    
    if (!hasLiked) {
      throw new BadRequestException('You have not liked this post');
    }

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userObjectId },
          $inc: { likeCount: -1 }
        },
        { new: true }
      )
      .populate('author', 'username email')
      .exec();

    return updatedPost;
  }

  async getPostLikes(postId: string): Promise<{ likes: any[], likeCount: number }> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.postModel
      .findById(postId)
      .populate('likes', 'username email')
      .select('likes likeCount')
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return {
      likes: post.likes,
      likeCount: post.likeCount
    };
  }

  async getFeaturedPosts(limit: number = 5): Promise<Post[]> {
    return this.postModel
      .find({ isFeatured: true, status: PostStatus.PUBLISHED })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    return this.postModel
      .find({ status: PostStatus.PUBLISHED })
      .populate('author', 'username email')
      .sort({ likeCount: -1, viewCount: -1 })
      .limit(limit)
      .exec();
  }
}
