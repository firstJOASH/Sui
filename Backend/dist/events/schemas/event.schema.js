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
exports.TicketTierSchema = exports.EventSchema = exports.Event = exports.TicketTier = exports.EventCategory = exports.EventStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "draft";
    EventStatus["PUBLISHED"] = "published";
    EventStatus["CANCELLED"] = "cancelled";
    EventStatus["COMPLETED"] = "completed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var EventCategory;
(function (EventCategory) {
    EventCategory["TECHNOLOGY"] = "technology";
    EventCategory["ART"] = "art";
    EventCategory["MUSIC"] = "music";
    EventCategory["GAMING"] = "gaming";
    EventCategory["EDUCATION"] = "education";
    EventCategory["BUSINESS"] = "business";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
let TicketTier = class TicketTier {
};
exports.TicketTier = TicketTier;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TicketTier.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TicketTier.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TicketTier.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TicketTier.prototype, "totalSupply", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "sold", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], TicketTier.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TicketTier.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TicketTier.prototype, "_id", void 0);
exports.TicketTier = TicketTier = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TicketTier);
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "longDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: EventCategory }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Event.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "venue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Event.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TicketTier], default: [] }),
    __metadata("design:type", Array)
], Event.prototype, "ticketTiers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: EventStatus, default: EventStatus.DRAFT }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "totalAttendees", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Event.prototype, "maxAttendees", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "totalRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Event.prototype, "blockchain", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Event.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "User", default: [] }),
    __metadata("design:type", Array)
], Event.prototype, "attendees", void 0);
exports.Event = Event = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Event);
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);
exports.TicketTierSchema = mongoose_1.SchemaFactory.createForClass(TicketTier);
//# sourceMappingURL=event.schema.js.map