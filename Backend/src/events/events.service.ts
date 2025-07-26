import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { Event, EventDocument, EventStatus } from "./schemas/event.schema"
import { CreateEventDto } from "./dto/create-event.dto"
import { UpdateEventDto } from "./dto/update-event.dto"
import { User, UserDocument } from "../users/schemas/user.schema"

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {

  if (!createEventDto.organizer) {
    throw new ForbiddenException('Organizer is required');
  }

 
  const organizer = await this.userModel.findById(createEventDto.organizer).exec();
  if (!organizer) {
    throw new NotFoundException(`Organizer with ID ${createEventDto.organizer} not found`);
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
  async findAll(filters?: {
    category?: string
    status?: EventStatus
    organizer?: string
    featured?: boolean
  }): Promise<Event[]> {
    const query: any = {}

    if (filters?.category) query.category = filters.category
    if (filters?.status) query.status = filters.status
    if (filters?.organizer) query.organizer = filters.organizer
    if (filters?.featured !== undefined) query.isFeatured = filters.featured

    return this.eventModel
      .find(query)
      .populate("organizer", "username walletAddress isVerified")
      .sort({ createdAt: -1 })
      .exec()
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate("organizer", "username walletAddress isVerified")
      .populate("attendees", "username walletAddress")
      .exec()

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }

  
    await this.eventModel.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })

    return event
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(id)

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }

    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException("Only the event organizer can update this event")
    }

    return this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .populate("organizer", "username walletAddress isVerified")
      .exec()
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventModel.findById(id)

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`)
    }

    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException("Only the event organizer can delete this event")
    }

    await this.eventModel.findByIdAndDelete(id).exec()

    // Also remove the reference from the user's createdEvents
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { createdEvents: id },
    })
  }

  async searchEvents(query: string): Promise<Event[]> {
    return this.eventModel
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
        status: EventStatus.PUBLISHED,
      })
      .populate("organizer", "username walletAddress isVerified")
      .exec()
  }

  async getFeaturedEvents(): Promise<Event[]> {
    return this.eventModel
      .find({ isFeatured: true, status: EventStatus.PUBLISHED })
      .populate("organizer", "username walletAddress isVerified")
      .limit(6)
      .exec()
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return this.eventModel
      .find({
        startDate: { $gte: new Date() },
        status: EventStatus.PUBLISHED,
      })
      .populate("organizer", "username walletAddress isVerified")
      .sort({ startDate: 1 })
      .exec()
  }

  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    return this.eventModel
      .find({ organizer: organizerId })
      .populate("organizer", "username walletAddress isVerified")
      .sort({ createdAt: -1 })
      .exec()
  }

  async updateTicketSales(eventId: string, tierId: string, quantity: number): Promise<Event> {
    const event = await this.eventModel.findById(eventId)

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`)
    }

    const tierIndex = event.ticketTiers.findIndex((tier) => tier._id.toString() === tierId)

    if (tierIndex === -1) {
      throw new NotFoundException(`Ticket tier with ID ${tierId} not found`)
    }

    // Update ticket tier sold count
    event.ticketTiers[tierIndex].sold += quantity

    // Update total attendees and revenue
    event.totalAttendees += quantity
    event.totalRevenue += event.ticketTiers[tierIndex].price * quantity

    return event.save()
  }
}
