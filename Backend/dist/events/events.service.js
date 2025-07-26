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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const event_schema_1 = require("./schemas/event.schema");
let EventsService = class EventsService {
    constructor(eventModel, userModel) {
        this.eventModel = eventModel;
        this.userModel = userModel;
    }
    async create(createEventDto) {
        if (!createEventDto.organizer) {
            throw new common_1.ForbiddenException('Organizer is required');
        }
        const organizer = await this.userModel.findById(createEventDto.organizer).exec();
        if (!organizer) {
            throw new common_1.NotFoundException(`Organizer with ID ${createEventDto.organizer} not found`);
        }
        const createdEvent = new this.eventModel({
            ...createEventDto,
            blockchain: {
                network: 'sui:devnet',
            },
        });
        const savedEvent = await createdEvent.save();
        await this.userModel.findByIdAndUpdate(savedEvent.organizer, {
            $push: { createdEvents: savedEvent._id },
        });
        return savedEvent;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.category)
            query.category = filters.category;
        if (filters?.status)
            query.status = filters.status;
        if (filters?.organizer)
            query.organizer = filters.organizer;
        if (filters?.featured !== undefined)
            query.isFeatured = filters.featured;
        return this.eventModel
            .find(query)
            .populate("organizer", "username walletAddress isVerified")
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const event = await this.eventModel
            .findById(id)
            .populate("organizer", "username walletAddress isVerified")
            .populate("attendees", "username walletAddress")
            .exec();
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        await this.eventModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        return event;
    }
    async update(id, updateEventDto, userId) {
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        if (event.organizer.toString() !== userId) {
            throw new common_1.ForbiddenException("Only the event organizer can update this event");
        }
        return this.eventModel
            .findByIdAndUpdate(id, updateEventDto, { new: true })
            .populate("organizer", "username walletAddress isVerified")
            .exec();
    }
    async remove(id, userId) {
        const event = await this.eventModel.findById(id);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        if (event.organizer.toString() !== userId) {
            throw new common_1.ForbiddenException("Only the event organizer can delete this event");
        }
        await this.eventModel.findByIdAndDelete(id).exec();
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { createdEvents: id },
        });
    }
    async searchEvents(query) {
        return this.eventModel
            .find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { tags: { $in: [new RegExp(query, "i")] } },
            ],
            status: event_schema_1.EventStatus.PUBLISHED,
        })
            .populate("organizer", "username walletAddress isVerified")
            .exec();
    }
    async getFeaturedEvents() {
        return this.eventModel
            .find({ isFeatured: true, status: event_schema_1.EventStatus.PUBLISHED })
            .populate("organizer", "username walletAddress isVerified")
            .limit(6)
            .exec();
    }
    async getUpcomingEvents() {
        return this.eventModel
            .find({
            startDate: { $gte: new Date() },
            status: event_schema_1.EventStatus.PUBLISHED,
        })
            .populate("organizer", "username walletAddress isVerified")
            .sort({ startDate: 1 })
            .exec();
    }
    async getEventsByOrganizer(organizerId) {
        return this.eventModel
            .find({ organizer: organizerId })
            .populate("organizer", "username walletAddress isVerified")
            .sort({ createdAt: -1 })
            .exec();
    }
    async updateTicketSales(eventId, tierId, quantity) {
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${eventId} not found`);
        }
        const tierIndex = event.ticketTiers.findIndex((tier) => tier._id.toString() === tierId);
        if (tierIndex === -1) {
            throw new common_1.NotFoundException(`Ticket tier with ID ${tierId} not found`);
        }
        event.ticketTiers[tierIndex].sold += quantity;
        event.totalAttendees += quantity;
        event.totalRevenue += event.ticketTiers[tierIndex].price * quantity;
        return event.save();
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('Event')),
    __param(1, (0, mongoose_2.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], EventsService);
//# sourceMappingURL=events.service.js.map