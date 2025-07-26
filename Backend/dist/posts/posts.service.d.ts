import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument, PostStatus } from './entities/post.entity';
export declare class PostsService {
    private postModel;
    constructor(postModel: Model<PostDocument>);
    create(createPostDto: CreatePostDto, authorId: string): Promise<Post>;
    findAll(page?: number, limit?: number, status?: PostStatus, category?: string): Promise<{
        posts: Post[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Post>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<Post>;
    remove(id: string): Promise<void>;
    likePost(postId: string, userId: string): Promise<Post>;
    unlikePost(postId: string, userId: string): Promise<Post>;
    getPostLikes(postId: string): Promise<{
        likes: any[];
        likeCount: number;
    }>;
    getFeaturedPosts(limit?: number): Promise<Post[]>;
    getPopularPosts(limit?: number): Promise<Post[]>;
}
