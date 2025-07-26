import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import {  Ticket,  TicketDocument, TicketStatus } from "./schemas/ticket.schema"
import { CreateTicketDto } from "./dto/create-ticket.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class TicketsService {
 constructor(
  @InjectModel('Ticket') private readonly ticketModel: Model<TicketDocument>,
) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel(createTicketDto)
    return createdTicket.save()
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketModel
      .find()
      .populate("eventId", "title startDate location")
      .populate("owner", "username walletAddress")
      .exec()
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketModel
      .findById(id)
      .populate("eventId", "title startDate location organizer")
      .populate("owner", "username walletAddress")
      .exec()

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`)
    }
    return ticket
  }

  async findByTokenId(tokenId: string): Promise<Ticket> {
    const ticket = await this.ticketModel
      .findOne({ tokenId })
      .populate("eventId", "title startDate location organizer")
      .populate("owner", "username walletAddress")
      .exec()

    if (!ticket) {
      throw new NotFoundException(`Ticket with token ID ${tokenId} not found`)
    }
    return ticket
  }

  async findByOwner(ownerId: string): Promise<Ticket[]> {
    return this.ticketModel
      .find({ owner: ownerId })
      .populate("eventId", "title startDate location imageUrl")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findByEvent(eventId: string): Promise<Ticket[]> {
    return this.ticketModel.find({ eventId }).populate("owner", "username walletAddress").exec()
  }

  async useTicket(ticketId: string, userId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId)

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`)
    }

    if (ticket.status !== TicketStatus.ACTIVE) {
      throw new ForbiddenException("Ticket is not active")
    }

    ticket.status = TicketStatus.USED
    ticket.usedAt = new Date()
    ticket.usedBy = userId as any

    return ticket.save()
  }

  async transferTicket(ticketId: string, newOwnerId: string, currentOwnerId: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId)

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`)
    }

    if (ticket.owner.toString() !== currentOwnerId) {
      throw new ForbiddenException("Only the ticket owner can transfer this ticket")
    }

    if (ticket.status !== TicketStatus.ACTIVE) {
      throw new ForbiddenException("Only active tickets can be transferred")
    }

    ticket.transferHistory.push(ticket.owner)
    ticket.owner = newOwnerId as any
    ticket.status = TicketStatus.TRANSFERRED

    return ticket.save()
  }

  async getTicketStats(eventId?: string) {
    const matchStage = eventId ? { eventId } : {}

    return this.ticketModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$price" },
        },
      },
    ])
  }

  async validateTicket(tokenId: string): Promise<{ valid: boolean; ticket?: Ticket; message?: string }> {
    try {
      const ticket = await this.findByTokenId(tokenId)

      if (ticket.status === TicketStatus.USED) {
        return { valid: false, message: "Ticket has already been used" }
      }

      if (ticket.status === TicketStatus.CANCELLED) {
        return { valid: false, message: "Ticket has been cancelled" }
      }

      return { valid: true, ticket }
    } catch (error) {
      return { valid: false, message: "Ticket not found" }
    }
  }
}
