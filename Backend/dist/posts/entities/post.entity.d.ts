import { type Document, Types } from "mongoose";
export type PostDocument = Post & Document;
export declare enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum PostCategory {
    TECHNOLOGY = "technology",
    ART = "art",
    MUSIC = "music",
    GAMING = "gaming",
    EDUCATION = "education",
    BUSINESS = "business",
    GENERAL = "general"
}
export declare class Post {
    title: string;
    content: string;
    excerpt: string;
    category: PostCategory;
    tags: string[];
    imageUrl: string;
    author: Types.ObjectId;
    status: PostStatus;
    viewCount: number;
    likeCount: number;
    likes: Types.ObjectId[];
    isFeatured: boolean;
    publishedAt: Date;
    event: Types.ObjectId;
}
export declare const PostSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, Document<unknown, any, Post, any> & Post & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, Document<unknown, {}, import("mongoose").FlatRecord<Post>, {}> & import("mongoose").FlatRecord<Post> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
