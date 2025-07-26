import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(createTicketDto: CreateTicketDto): Promise<import("./schemas/ticket.schema").Ticket>;
    findAll(): Promise<import("./schemas/ticket.schema").Ticket[]>;
    getMyTickets(req: any): Promise<import("./schemas/ticket.schema").Ticket[]>;
    getStats(eventId?: string): Promise<any[]>;
    validateTicket(tokenId: string): Promise<{
        valid: boolean;
        ticket?: import("./schemas/ticket.schema").Ticket;
        message?: string;
    }>;
    findByTokenId(tokenId: string): Promise<import("./schemas/ticket.schema").Ticket>;
    findByEvent(eventId: string): Promise<import("./schemas/ticket.schema").Ticket[]>;
    findByOwner(ownerId: string): Promise<import("./schemas/ticket.schema").Ticket[]>;
    findOne(id: string): Promise<import("./schemas/ticket.schema").Ticket>;
    useTicket(id: string, req: any): Promise<import("./schemas/ticket.schema").Ticket>;
    transferTicket(id: string, newOwnerId: string, req: any): Promise<import("./schemas/ticket.schema").Ticket>;
}
