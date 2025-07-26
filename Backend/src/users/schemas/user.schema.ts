import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  walletAddress: string

  @Prop()
  email?: string

  @Prop()
  username?: string

  @Prop()
  avatar?: string

  @Prop({ default: false })
  isVerified: boolean

  @Prop({ default: false })
  isEventOrganizer: boolean

  @Prop({ type: Object })
  profile?: {
    bio?: string
    website?: string
    twitter?: string
    discord?: string
  }

  @Prop({ type: [String], default: [] })
  favoriteEvents: string[]

  @Prop({ default: Date.now })
  lastLogin: Date
    @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  createdEvents: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  attendedEvents: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User)
