import { EventCategory } from "../schemas/event.schema";
export declare class CreateTicketTierDto {
    name: string;
    price: number;
    description?: string;
    totalSupply: number;
    benefits?: string[];
    isActive?: boolean;
}
export declare class CreateEventDto {
    title: string;
    description: string;
    longDescription?: string;
    category: EventCategory;
    tags?: string[];
    startDate: Date;
    endDate?: Date;
    location: string;
    venue?: string;
    imageUrl?: string;
    organizer: string;
    ticketTiers: CreateTicketTierDto[];
    maxAttendees?: number;
}
