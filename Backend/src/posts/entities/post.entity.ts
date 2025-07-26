import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document, Types } from "mongoose";
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum PostCategory {
  TECHNOLOGY = "technology",
  ART = "art",
  MUSIC = "music",
  GAMING = "gaming",
  EDUCATION = "education",
  BUSINESS = "business",
  GENERAL = "general",
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt: string;

  @Prop({ enum: PostCategory, default: PostCategory.GENERAL })
  category: PostCategory;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  author: Types.ObjectId;

  @Prop({ enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;


  @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop()
  publishedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Event' })
  event: Types.ObjectId;

}

export const PostSchema = SchemaFactory.createForClass(Post);