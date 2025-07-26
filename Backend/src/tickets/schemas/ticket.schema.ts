import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type TicketDocument = Ticket & Document

export enum TicketStatus {
  ACTIVE = "active",
  USED = "used",
  TRANSFERRED = "transferred",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  tokenId: string

  @Prop({ type: Types.ObjectId, ref: "Event", required: true })
  eventId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  owner: Types.ObjectId

  @Prop({ required: true })
  tierName: string

  @Prop({ required: true })
  price: number

  @Prop({ enum: TicketStatus, default: TicketStatus.ACTIVE })
  status: TicketStatus

  @Prop({ required: true })
  transactionHash: string

  @Prop({ required: true })
  contractAddress: string

  @Prop({ required: true })
  network: string

  @Prop({ type: Object })
  metadata: {
    name: string
    description: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }

  @Prop()
  qrCode: string

  @Prop()
  usedAt?: Date

  @Prop({ type: Types.ObjectId, ref: "User" })
  usedBy?: Types.ObjectId

  @Prop({ type: [Types.ObjectId], ref: "User", default: [] })
  transferHistory: Types.ObjectId[]
}

export const TicketSchema = SchemaFactory.createForClass(Ticket)
