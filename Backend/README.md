# NFTix Backend API

Backend API for the NFT Event Ticketing dApp built with NestJS and MongoDB.

## Features

- 🔐 **Authentication**: JWT-based auth with wallet address
- 👥 **User Management**: User profiles and preferences
- 🎫 **Event Management**: Create, update, and manage events
- 🎟️ **Ticket System**: NFT ticket minting and management
- ⛓️ **Blockchain Integration**: Sui blockchain integration (mock)
- 📊 **Analytics**: Event and ticket statistics
- 🔍 **Search**: Full-text search for events
- 📚 **API Documentation**: Swagger/OpenAPI docs

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Blockchain**: Sui (mock implementation)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

1. **Clone and navigate to backend**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Start MongoDB** (if running locally):
   \`\`\`bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Or use Docker Compose
   docker-compose up -d mongodb
   \`\`\`

5. **Start the development server**:
   \`\`\`bash
   npm run start:dev
   \`\`\`

The API will be available at `http://localhost:3001`

### API Documentation

Visit `http://localhost:3001/api/docs` for interactive API documentation.

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with wallet address

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users/wallet/:address` - Get user by wallet address
- `PATCH /api/v1/users/:id` - Update user
- `POST /api/v1/users/:id/favorites/:eventId` - Add event to favorites

### Events
- `GET /api/v1/events` - Get all events (with filters)
- `GET /api/v1/events/featured` - Get featured events
- `GET /api/v1/events/upcoming` - Get upcoming events
- `GET /api/v1/events/search?q=query` - Search events
- `POST /api/v1/events` - Create new event
- `GET /api/v1/events/:id` - Get event by ID
- `PATCH /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event

### Tickets
- `GET /api/v1/tickets/my-tickets` - Get current user's tickets
- `POST /api/v1/tickets` - Create/mint new ticket
- `GET /api/v1/tickets/:id` - Get ticket by ID
- `GET /api/v1/tickets/token/:tokenId` - Get ticket by token ID
- `GET /api/v1/tickets/validate/:tokenId` - Validate ticket
- `PATCH /api/v1/tickets/:id/use` - Use/redeem ticket
- `PATCH /api/v1/tickets/:id/transfer` - Transfer ticket

### Blockchain
- `POST /api/v1/blockchain/deploy-contract` - Deploy event contract
- `POST /api/v1/blockchain/mint-ticket` - Mint ticket NFT
- `GET /api/v1/blockchain/validate/:tokenId` - Validate on blockchain
- `GET /api/v1/blockchain/gas-estimate/:operation` - Get gas estimate

## Database Schema

### User
- `walletAddress` (unique)
- `email`, `username`, `avatar`
- `isVerified`, `isEventOrganizer`
- `profile` (bio, social links)
- `favoriteEvents`

### Event
- `title`, `description`, `longDescription`
- `category`, `tags`
- `startDate`, `endDate`, `location`
- `organizer` (User reference)
- `ticketTiers` (embedded array)
- `status`, `totalAttendees`, `totalRevenue`
- `blockchain` (contract info)

### Ticket
- `tokenId` (unique)
- `eventId`, `owner` (references)
- `tierName`, `price`, `status`
- `transactionHash`, `contractAddress`
- `metadata` (NFT metadata)
- `qrCode`, `usedAt`

## Development

### Scripts

\`\`\`bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
npm run test:watch
npm run test:e2e

# Linting
npm run lint
\`\`\`

### Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Build image only
docker build -t nftix-backend .
\`\`\`

## Environment Variables

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/nftix
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=development
SUI_NETWORK=devnet
SUI_RPC_URL=https://fullnode.devnet.sui.io:443
FRONTEND_URL=http://localhost:3000
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
# NFTIX_backend
