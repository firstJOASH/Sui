"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_entity_1 = require("./entities/comment.entity");
let CommentsService = class CommentsService {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(createCommentDto) {
        const { post, author, content } = createCommentDto;
        if (!mongoose_2.Types.ObjectId.isValid(post) || !mongoose_2.Types.ObjectId.isValid(author)) {
            throw new common_1.BadRequestException('Invalid post or author ID');
        }
        const comment = new this.commentModel({
            post: new mongoose_2.Types.ObjectId(post),
            author: new mongoose_2.Types.ObjectId(author),
            content
        });
        return comment.save();
    }
    async findAll() {
        return this.commentModel.find()
            .populate('author', 'username email')
            .populate('post', 'title')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid comment ID');
        }
        const comment = await this.commentModel.findById(id)
            .populate('author', 'username email')
            .populate('post', 'title')
            .exec();
        if (!comment)
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        return comment;
    }
    async update(id, updateCommentDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid comment ID');
        }
        const comment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, {
            new: true
        }).exec();
        if (!comment)
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        return comment;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid comment ID');
        }
        const deleted = await this.commentModel.findByIdAndDelete(id).exec();
        if (!deleted)
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_entity_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map