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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_entity_1 = require("./entities/post.entity");
let PostsService = class PostsService {
    constructor(postModel) {
        this.postModel = postModel;
    }
    async create(createPostDto, authorId) {
        const postData = {
            ...createPostDto,
            author: new mongoose_2.Types.ObjectId(authorId),
            publishedAt: createPostDto.status === post_entity_1.PostStatus.PUBLISHED ? new Date() : undefined,
        };
        const createdPost = new this.postModel(postData);
        return createdPost.save();
    }
    async findAll(page = 1, limit = 10, status, category) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
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
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel
            .findById(id)
            .populate('author', 'username email')
            .populate('comments')
            .exec();
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        await this.postModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        return post;
    }
    async update(id, updatePostDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const updateData = { ...updatePostDto };
        if (updatePostDto.status === post_entity_1.PostStatus.PUBLISHED) {
            const existingPost = await this.postModel.findById(id);
            if (existingPost && existingPost.status !== post_entity_1.PostStatus.PUBLISHED) {
                updateData.publishedAt = new Date();
            }
        }
        const updatedPost = await this.postModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('author', 'username email')
            .exec();
        if (!updatedPost) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return updatedPost;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const result = await this.postModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
    }
    async likePost(postId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(postId) || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid post or user ID');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${postId} not found`);
        }
        const hasLiked = post.likes.some(like => like.equals(userObjectId));
        if (hasLiked) {
            throw new common_1.BadRequestException('You have already liked this post');
        }
        const updatedPost = await this.postModel
            .findByIdAndUpdate(postId, {
            $push: { likes: userObjectId },
            $inc: { likeCount: 1 }
        }, { new: true })
            .populate('author', 'username email')
            .exec();
        return updatedPost;
    }
    async unlikePost(postId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(postId) || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid post or user ID');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const post = await this.postModel.findById(postId);
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${postId} not found`);
        }
        const hasLiked = post.likes.some(like => like.equals(userObjectId));
        if (!hasLiked) {
            throw new common_1.BadRequestException('You have not liked this post');
        }
        const updatedPost = await this.postModel
            .findByIdAndUpdate(postId, {
            $pull: { likes: userObjectId },
            $inc: { likeCount: -1 }
        }, { new: true })
            .populate('author', 'username email')
            .exec();
        return updatedPost;
    }
    async getPostLikes(postId) {
        if (!mongoose_2.Types.ObjectId.isValid(postId)) {
            throw new common_1.BadRequestException('Invalid post ID');
        }
        const post = await this.postModel
            .findById(postId)
            .populate('likes', 'username email')
            .select('likes likeCount')
            .exec();
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${postId} not found`);
        }
        return {
            likes: post.likes,
            likeCount: post.likeCount
        };
    }
    async getFeaturedPosts(limit = 5) {
        return this.postModel
            .find({ isFeatured: true, status: post_entity_1.PostStatus.PUBLISHED })
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async getPopularPosts(limit = 10) {
        return this.postModel
            .find({ status: post_entity_1.PostStatus.PUBLISHED })
            .populate('author', 'username email')
            .sort({ likeCount: -1, viewCount: -1 })
            .limit(limit)
            .exec();
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_entity_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PostsService);
//# sourceMappingURL=posts.service.js.map