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
exports.CreatePostDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const post_entity_1 = require("../entities/post.entity");
class CreatePostDto {
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The title of the post',
        example: 'My Awesome Blog Post',
        minLength: 1,
        maxLength: 200
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The main content of the post',
        example: 'This is the detailed content of my blog post...',
        minLength: 1
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'A short excerpt or summary of the post',
        example: 'This post discusses the latest trends in technology...',
        maxLength: 500
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The category of the post',
        enum: post_entity_1.PostCategory,
        example: post_entity_1.PostCategory.TECHNOLOGY,
        default: post_entity_1.PostCategory.GENERAL
    }),
    (0, class_validator_1.IsEnum)(post_entity_1.PostCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tags associated with the post',
        example: ['javascript', 'nodejs', 'nestjs'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL of the post image',
        example: 'https://example.com/image.jpg'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'The status of the post',
        enum: post_entity_1.PostStatus,
        example: post_entity_1.PostStatus.DRAFT,
        default: post_entity_1.PostStatus.DRAFT
    }),
    (0, class_validator_1.IsEnum)(post_entity_1.PostStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "event", void 0);
//# sourceMappingURL=create-post.dto.js.map