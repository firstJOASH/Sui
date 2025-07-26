export declare class CreateTicketDto {
    tokenId: string;
    eventId: string;
    owner: string;
    tierName: string;
    price: number;
    transactionHash: string;
    contractAddress: string;
    network: string;
    metadata?: {
        name: string;
        description: string;
        image: string;
        attributes: Array<{
            trait_type: string;
            value: string;
        }>;
    };
    qrCode?: string;
}
