import { PostStatus, PostCategory } from '../entities/post.entity';
export declare class UpdatePostDto {
    title?: string;
    content?: string;
    excerpt?: string;
    category?: PostCategory;
    tags?: string[];
    imageUrl?: string;
    status?: PostStatus;
    publishedAt?: Date;
}
