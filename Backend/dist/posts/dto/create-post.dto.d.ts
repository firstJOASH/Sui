import { PostCategory, PostStatus } from '../entities/post.entity';
export declare class CreatePostDto {
    title: string;
    content: string;
    excerpt?: string;
    category?: PostCategory;
    tags?: string[];
    imageUrl?: string;
    status?: PostStatus;
    event: string;
}
