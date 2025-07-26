import { Model } from "mongoose";
import { Ticket, TicketDocument } from "./schemas/ticket.schema";
import { CreateTicketDto } from "./dto/create-ticket.dto";
export declare class TicketsService {
    private readonly ticketModel;
    constructor(ticketModel: Model<TicketDocument>);
    create(createTicketDto: CreateTicketDto): Promise<Ticket>;
    findAll(): Promise<Ticket[]>;
    findOne(id: string): Promise<Ticket>;
    findByTokenId(tokenId: string): Promise<Ticket>;
    findByOwner(ownerId: string): Promise<Ticket[]>;
    findByEvent(eventId: string): Promise<Ticket[]>;
    useTicket(ticketId: string, userId: string): Promise<Ticket>;
    transferTicket(ticketId: string, newOwnerId: string, currentOwnerId: string): Promise<Ticket>;
    getTicketStats(eventId?: string): Promise<any[]>;
    validateTicket(tokenId: string): Promise<{
        valid: boolean;
        ticket?: Ticket;
        message?: string;
    }>;
}
