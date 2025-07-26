import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentsService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(createCommentDto: CreateCommentDto): Promise<Comment>;
    findAll(): Promise<Comment[]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    remove(id: string): Promise<void>;
}
