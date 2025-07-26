import { type Document, Types } from "mongoose";
export type EventDocument = Event & Document;
export declare enum EventStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare enum EventCategory {
    TECHNOLOGY = "technology",
    ART = "art",
    MUSIC = "music",
    GAMING = "gaming",
    EDUCATION = "education",
    BUSINESS = "business"
}
export declare class TicketTier {
    name: string;
    price: number;
    description: string;
    totalSupply: number;
    sold: number;
    benefits: string[];
    isActive: boolean;
    _id?: Types.ObjectId;
}
export declare class Event {
    title: string;
    description: string;
    longDescription: string;
    category: EventCategory;
    tags: string[];
    startDate: Date;
    endDate: Date;
    location: string;
    venue: string;
    imageUrl: string;
    organizer: Types.ObjectId;
    ticketTiers: TicketTier[];
    status: EventStatus;
    totalAttendees: number;
    maxAttendees: number;
    totalRevenue: number;
    blockchain: {
        contractAddress?: string;
        network: string;
        deploymentTx?: string;
    };
    isFeatured: boolean;
    viewCount: number;
    attendees: Types.ObjectId[];
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, Document<unknown, any, Event, any> & Event & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}> & import("mongoose").FlatRecord<Event> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const TicketTierSchema: import("mongoose").Schema<TicketTier, import("mongoose").Model<TicketTier, any, any, any, Document<unknown, any, TicketTier, any> & TicketTier & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketTier, Document<unknown, {}, import("mongoose").FlatRecord<TicketTier>, {}> & import("mongoose").FlatRecord<TicketTier> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
