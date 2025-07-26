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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tickets_service_1 = require("./tickets.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TicketsController = class TicketsController {
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    create(createTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }
    findAll() {
        return this.ticketsService.findAll();
    }
    getMyTickets(req) {
        return this.ticketsService.findByOwner(req.user.userId);
    }
    getStats(eventId) {
        return this.ticketsService.getTicketStats(eventId);
    }
    validateTicket(tokenId) {
        return this.ticketsService.validateTicket(tokenId);
    }
    findByTokenId(tokenId) {
        return this.ticketsService.findByTokenId(tokenId);
    }
    findByEvent(eventId) {
        return this.ticketsService.findByEvent(eventId);
    }
    findByOwner(ownerId) {
        return this.ticketsService.findByOwner(ownerId);
    }
    findOne(id) {
        return this.ticketsService.findOne(id);
    }
    useTicket(id, req) {
        return this.ticketsService.useTicket(id, req.user.userId);
    }
    transferTicket(id, newOwnerId, req) {
        return this.ticketsService.transferTicket(id, newOwnerId, req.user.userId);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new ticket (mint NFT)" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all tickets" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("my-tickets"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current user tickets" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getMyTickets", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get ticket statistics" }),
    (0, swagger_1.ApiQuery)({ name: "eventId", required: false }),
    __param(0, (0, common_1.Query)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("validate/:tokenId"),
    (0, swagger_1.ApiOperation)({ summary: "Validate ticket by token ID" }),
    (0, swagger_1.ApiParam)({ name: "tokenId", type: String }),
    __param(0, (0, common_1.Param)("tokenId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "validateTicket", null);
__decorate([
    (0, common_1.Get)("token/:tokenId"),
    (0, swagger_1.ApiOperation)({ summary: "Get ticket by token ID" }),
    (0, swagger_1.ApiParam)({ name: "tokenId", type: String }),
    __param(0, (0, common_1.Param)("tokenId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findByTokenId", null);
__decorate([
    (0, common_1.Get)("event/:eventId"),
    (0, swagger_1.ApiOperation)({ summary: "Get tickets by event ID" }),
    (0, swagger_1.ApiParam)({ name: "eventId", type: String }),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findByEvent", null);
__decorate([
    (0, common_1.Get)("owner/:ownerId"),
    (0, swagger_1.ApiOperation)({ summary: "Get tickets by owner ID" }),
    (0, swagger_1.ApiParam)({ name: "ownerId", type: String }),
    __param(0, (0, common_1.Param)("ownerId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get ticket by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id/use"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Use/redeem ticket" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "useTicket", null);
__decorate([
    (0, common_1.Patch)(":id/transfer"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Transfer ticket to another user" }),
    (0, swagger_1.ApiParam)({ name: "id", type: String }),
    (0, swagger_1.ApiQuery)({ name: "newOwnerId", type: String }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("newOwnerId")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TicketsController.prototype, "transferTicket", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)("tickets"),
    (0, common_1.Controller)("tickets"),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map