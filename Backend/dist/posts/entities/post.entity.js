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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.Post = exports.PostCategory = exports.PostStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "draft";
    PostStatus["PUBLISHED"] = "published";
    PostStatus["ARCHIVED"] = "archived";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
var PostCategory;
(function (PostCategory) {
    PostCategory["TECHNOLOGY"] = "technology";
    PostCategory["ART"] = "art";
    PostCategory["MUSIC"] = "music";
    PostCategory["GAMING"] = "gaming";
    PostCategory["EDUCATION"] = "education";
    PostCategory["BUSINESS"] = "business";
    PostCategory["GENERAL"] = "general";
})(PostCategory || (exports.PostCategory = PostCategory = {}));
let Post = class Post {
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Post.prototype, "excerpt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PostCategory, default: PostCategory.GENERAL }),
    __metadata("design:type", String)
], Post.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Post.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Post.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PostStatus, default: PostStatus.DRAFT }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likeCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "User", default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Post.prototype, "publishedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Event' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Post.prototype, "event", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Post);
//# sourceMappingURL=post.entity.js.map