"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const posts_service_1 = require("./posts.service");
describe('PostsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [posts_service_1.PostsService],
        }).compile();
        service = module.get(posts_service_1.PostsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=posts.service.spec.js.map