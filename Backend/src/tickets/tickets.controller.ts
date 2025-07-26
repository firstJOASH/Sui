import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  Body,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("tickets")
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new ticket (mint NFT)" })
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all tickets" })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get("my-tickets")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user tickets" })
  getMyTickets(@Request() req) {
    return this.ticketsService.findByOwner(req.user.userId);
  }

  @Get("stats")
  @ApiOperation({ summary: "Get ticket statistics" })
  @ApiQuery({ name: "eventId", required: false })
  getStats(@Query("eventId") eventId?: string) {
    return this.ticketsService.getTicketStats(eventId);
  }

  @Get("validate/:tokenId")
  @ApiOperation({ summary: "Validate ticket by token ID" })
  @ApiParam({ name: "tokenId", type: String })
  validateTicket(@Param("tokenId") tokenId: string) {
    return this.ticketsService.validateTicket(tokenId);
  }

  @Get("token/:tokenId")
  @ApiOperation({ summary: "Get ticket by token ID" })
  @ApiParam({ name: "tokenId", type: String })
  findByTokenId(@Param("tokenId") tokenId: string) {
    return this.ticketsService.findByTokenId(tokenId);
  }

  @Get("event/:eventId")
  @ApiOperation({ summary: "Get tickets by event ID" })
  @ApiParam({ name: "eventId", type: String })
  findByEvent(@Param("eventId") eventId: string) {
    return this.ticketsService.findByEvent(eventId);
  }

  @Get("owner/:ownerId")
  @ApiOperation({ summary: "Get tickets by owner ID" })
  @ApiParam({ name: "ownerId", type: String })
  findByOwner(@Param("ownerId") ownerId: string) {
    return this.ticketsService.findByOwner(ownerId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get ticket by ID" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id/use")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Use/redeem ticket" })
  @ApiParam({ name: "id", type: String })
  useTicket(@Param("id") id: string, @Request() req) {
    return this.ticketsService.useTicket(id, req.user.userId);
  }

  @Patch(":id/transfer")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Transfer ticket to another user" })
  @ApiParam({ name: "id", type: String })
  @ApiQuery({ name: "newOwnerId", type: String })
  transferTicket(
    @Param("id") id: string,
    @Query("newOwnerId") newOwnerId: string,
    @Request() req
  ) {
    return this.ticketsService.transferTicket(id, newOwnerId, req.user.userId);
  }
}
