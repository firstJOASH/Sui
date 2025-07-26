import { Document, Types } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    post: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
}
export declare const CommentSchema: import("mongoose").Schema<Comment, import("mongoose").Model<Comment, any, any, any, Document<unknown, any, Comment, any> & Comment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Comment, Document<unknown, {}, import("mongoose").FlatRecord<Comment>, {}> & import("mongoose").FlatRecord<Comment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
