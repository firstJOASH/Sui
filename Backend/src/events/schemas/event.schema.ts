import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type Document, Types } from "mongoose";
import { User } from '../../users/schemas/user.schema'; 

export type EventDocument = Event & Document;

export enum EventStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum EventCategory {
  TECHNOLOGY = "technology",
  ART = "art",
  MUSIC = "music",
  GAMING = "gaming",
  EDUCATION = "education",
  BUSINESS = "business",
}

@Schema({ timestamps: true })
export class TicketTier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  totalSupply: number;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ type: [String], default: [] })
  benefits: string[];

  @Prop({ default: true })
  isActive: boolean;


  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  longDescription: string;

  @Prop({ required: true, enum: EventCategory })
  category: EventCategory;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop()
  venue: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  organizer: Types.ObjectId; // Organizer reference

  @Prop({ type: [TicketTier], default: [] })
  ticketTiers: TicketTier[];

  @Prop({ enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Prop({ default: 0 })
  totalAttendees: number;

  @Prop()
  maxAttendees: number;

  @Prop({ default: 0 })
  totalRevenue: number;

  @Prop({ type: Object })
  blockchain: {
    contractAddress?: string;
    network: string;
    deploymentTx?: string;
  };

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  
  @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
  attendees: Types.ObjectId[]; 
}

export const EventSchema = SchemaFactory.createForClass(Event);
export const TicketTierSchema = SchemaFactory.createForClass(TicketTier);
