import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { EventStatus } from "./schemas/event.schema";
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto, req: any): Promise<import("./schemas/event.schema").Event>;
    findAll(category?: string, status?: EventStatus, organizer?: string, featured?: boolean): Promise<import("./schemas/event.schema").Event[]>;
    getFeatured(): Promise<import("./schemas/event.schema").Event[]>;
    getUpcoming(): Promise<import("./schemas/event.schema").Event[]>;
    search(query: string): Promise<import("./schemas/event.schema").Event[]>;
    getByOrganizer(organizerId: string): Promise<import("./schemas/event.schema").Event[]>;
    findOne(id: string): Promise<import("./schemas/event.schema").Event>;
    update(id: string, updateEventDto: UpdateEventDto, req: any): Promise<import("./schemas/event.schema").Event>;
    remove(id: string, req: any): Promise<void>;
    updateTicketSales(id: string, tierId: string, quantity: number): Promise<import("./schemas/event.schema").Event>;
}
