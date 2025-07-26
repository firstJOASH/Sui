import { type Document, Types } from "mongoose";
export type TicketDocument = Ticket & Document;
export declare enum TicketStatus {
    ACTIVE = "active",
    USED = "used",
    TRANSFERRED = "transferred",
    CANCELLED = "cancelled"
}
export declare class Ticket {
    tokenId: string;
    eventId: Types.ObjectId;
    owner: Types.ObjectId;
    tierName: string;
    price: number;
    status: TicketStatus;
    transactionHash: string;
    contractAddress: string;
    network: string;
    metadata: {
        name: string;
        description: string;
        image: string;
        attributes: Array<{
            trait_type: string;
            value: string;
        }>;
    };
    qrCode: string;
    usedAt?: Date;
    usedBy?: Types.ObjectId;
    transferHistory: Types.ObjectId[];
}
export declare const TicketSchema: import("mongoose").Schema<Ticket, import("mongoose").Model<Ticket, any, any, any, Document<unknown, any, Ticket, any> & Ticket & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ticket, Document<unknown, {}, import("mongoose").FlatRecord<Ticket>, {}> & import("mongoose").FlatRecord<Ticket> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
