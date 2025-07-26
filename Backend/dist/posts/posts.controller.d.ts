import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStatus } from './entities/post.entity';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<import("./entities/post.entity").Post>;
    findAll(page?: string, limit?: string, status?: PostStatus, category?: string): Promise<{
        posts: import("./entities/post.entity").Post[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getFeatured(limit?: string): Promise<import("./entities/post.entity").Post[]>;
    getPopular(limit?: string): Promise<import("./entities/post.entity").Post[]>;
    findOne(id: string): Promise<import("./entities/post.entity").Post>;
    getPostLikes(id: string): Promise<{
        likes: any[];
        likeCount: number;
    }>;
    likePost(id: string, req: any): Promise<import("./entities/post.entity").Post>;
    unlikePost(id: string, req: any): Promise<import("./entities/post.entity").Post>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<import("./entities/post.entity").Post>;
    remove(id: string): Promise<void>;
}
