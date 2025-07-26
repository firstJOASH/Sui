export interface Event {
  id: string;
  _id?: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  imageUrl: string;
  organizer: string;
  ticketTiers: TicketTier[];
  status?: string;
  totalAttendees?: number;
  maxAttendees: number;
  totalRevenue?: number;
  blockchain?: {
    network: string;
  };
  isFeatured?: boolean;
  viewCount?: number;
  attendees?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketTier {
  name: string;
  price: number;
  description: string;
  totalSupply: number;
  sold?: number;
  benefits: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  owner: string;
  price: number;
  qrCode: string;
  event: Event;
  isForSale: boolean;
  salePrice?: number;
}

export interface MarketplaceListing {
  id: string;
  ticket: Ticket;
  seller: string;
  price: number;
  listingDate: string;
  isAuction: boolean;
  auctionEndDate?: string;
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  walletType: string;
  user?: User;
}

export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  isVerified: boolean;
  isEventOrganizer: boolean;
  favoriteEvents: string[];
  createdEvents: string[];
  attendedEvents: string[];
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    walletAddress: string;
    username?: string;
    isVerified: boolean;
    isEventOrganizer: boolean;
  };
}
