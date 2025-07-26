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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const ticket_schema_1 = require("./schemas/ticket.schema");
const mongoose_2 = require("@nestjs/mongoose");
let TicketsService = class TicketsService {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }
    async create(createTicketDto) {
        const createdTicket = new this.ticketModel(createTicketDto);
        return createdTicket.save();
    }
    async findAll() {
        return this.ticketModel
            .find()
            .populate("eventId", "title startDate location")
            .populate("owner", "username walletAddress")
            .exec();
    }
    async findOne(id) {
        const ticket = await this.ticketModel
            .findById(id)
            .populate("eventId", "title startDate location organizer")
            .populate("owner", "username walletAddress")
            .exec();
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${id} not found`);
        }
        return ticket;
    }
    async findByTokenId(tokenId) {
        const ticket = await this.ticketModel
            .findOne({ tokenId })
            .populate("eventId", "title startDate location organizer")
            .populate("owner", "username walletAddress")
            .exec();
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with token ID ${tokenId} not found`);
        }
        return ticket;
    }
    async findByOwner(ownerId) {
        return this.ticketModel
            .find({ owner: ownerId })
            .populate("eventId", "title startDate location imageUrl")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByEvent(eventId) {
        return this.ticketModel.find({ eventId }).populate("owner", "username walletAddress").exec();
    }
    async useTicket(ticketId, userId) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${ticketId} not found`);
        }
        if (ticket.status !== ticket_schema_1.TicketStatus.ACTIVE) {
            throw new common_1.ForbiddenException("Ticket is not active");
        }
        ticket.status = ticket_schema_1.TicketStatus.USED;
        ticket.usedAt = new Date();
        ticket.usedBy = userId;
        return ticket.save();
    }
    async transferTicket(ticketId, newOwnerId, currentOwnerId) {
        const ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID ${ticketId} not found`);
        }
        if (ticket.owner.toString() !== currentOwnerId) {
            throw new common_1.ForbiddenException("Only the ticket owner can transfer this ticket");
        }
        if (ticket.status !== ticket_schema_1.TicketStatus.ACTIVE) {
            throw new common_1.ForbiddenException("Only active tickets can be transferred");
        }
        ticket.transferHistory.push(ticket.owner);
        ticket.owner = newOwnerId;
        ticket.status = ticket_schema_1.TicketStatus.TRANSFERRED;
        return ticket.save();
    }
    async getTicketStats(eventId) {
        const matchStage = eventId ? { eventId } : {};
        return this.ticketModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalValue: { $sum: "$price" },
                },
            },
        ]);
    }
    async validateTicket(tokenId) {
        try {
            const ticket = await this.findByTokenId(tokenId);
            if (ticket.status === ticket_schema_1.TicketStatus.USED) {
                return { valid: false, message: "Ticket has already been used" };
            }
            if (ticket.status === ticket_schema_1.TicketStatus.CANCELLED) {
                return { valid: false, message: "Ticket has been cancelled" };
            }
            return { valid: true, ticket };
        }
        catch (error) {
            return { valid: false, message: "Ticket not found" };
        }
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Ticket')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map