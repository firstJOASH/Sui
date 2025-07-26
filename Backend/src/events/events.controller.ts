import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common"
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger"
import { EventsService } from "./events.service"
import { CreateEventDto } from "./dto/create-event.dto"
import { UpdateEventDto } from "./dto/update-event.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { EventStatus } from "./schemas/event.schema"

@ApiTags("events")
@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new event" })
  @ApiResponse({ status: 201, description: "Event created successfully" })
  @ApiResponse({ status: 400, description: "Validation failed" })
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create({
      ...createEventDto,
      organizer: req.user.userId,
    })
  }

  @Get()
  @ApiOperation({ summary: "Get all events" })
  @ApiQuery({ name: "category", required: false })
  @ApiQuery({ name: "status", required: false, enum: EventStatus })
  @ApiQuery({ name: "organizer", required: false })
  @ApiQuery({ name: "featured", required: false, type: Boolean })
  @ApiResponse({ status: 200, description: "List of events" })
  findAll(
    @Query("category") category?: string,
    @Query("status") status?: EventStatus,
    @Query("organizer") organizer?: string,
    @Query("featured") featured?: boolean,
  ) {
    return this.eventsService.findAll({ category, status, organizer, featured })
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured events" })
  @ApiResponse({ status: 200, description: "Featured events" })
  getFeatured() {
    return this.eventsService.getFeaturedEvents()
  }

  @Get("upcoming")
  @ApiOperation({ summary: "Get upcoming events" })
  @ApiResponse({ status: 200, description: "Upcoming events" })
  getUpcoming() {
    return this.eventsService.getUpcomingEvents()
  }

  @Get("search")
  @ApiOperation({ summary: "Search events" })
  @ApiQuery({ name: "q", description: "Search query" })
  @ApiResponse({ status: 200, description: "Search results" })
  search(@Query("q") query: string) {
    return this.eventsService.searchEvents(query)
  }

  @Get("organizer/:organizerId")
  @ApiOperation({ summary: "Get events by organizer" })
  @ApiParam({ name: "organizerId", description: "Organizer ID" })
  @ApiResponse({ status: 200, description: "Events by organizer" })
  getByOrganizer(@Param("organizerId") organizerId: string) {
    return this.eventsService.getEventsByOrganizer(organizerId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get event by ID" })
  @ApiParam({ name: "id", description: "Event ID" })
  @ApiResponse({ status: 200, description: "Event found" })
  @ApiResponse({ status: 404, description: "Event not found" })
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update event" })
  @ApiParam({ name: "id", description: "Event ID" })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  @ApiResponse({ status: 404, description: "Event not found" })
  update(
    @Param("id") id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.userId)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete event" })
  @ApiParam({ name: "id", description: "Event ID" })
  @ApiResponse({ status: 200, description: "Event deleted successfully" })
  @ApiResponse({ status: 404, description: "Event not found" })
  remove(@Param("id") id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.userId)
  }

  @Patch(":id/tickets/:tierId/sales")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update ticket sales" })
  @ApiParam({ name: "id", description: "Event ID" })
  @ApiParam({ name: "tierId", description: "Ticket Tier ID" })
  @ApiResponse({ status: 200, description: "Ticket sales updated" })
  @ApiResponse({ status: 404, description: "Event or tier not found" })
  updateTicketSales(
    @Param("id") id: string,
    @Param("tierId") tierId: string,
    @Body("quantity") quantity: number,
  ) {
    return this.eventsService.updateTicketSales(id, tierId, quantity)
  }
}
