import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  UseGuards,
} from "@nestjs/common"
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { UsersService } from "./users.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Validation failed" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of users" })
  findAll() {
    return this.usersService.findAll()
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", description: "User ID (UUID or Mongo ID)" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id)
  }

  @Get("wallet/:address")
  @ApiOperation({ summary: "Get user by wallet address" })
  @ApiParam({ name: "address", description: "Wallet address" })
  @ApiResponse({ status: 200, description: "User found by wallet address" })
  @ApiResponse({ status: 404, description: "User not found" })
  findByWallet(@Param("address") address: string) {
    return this.usersService.findByWalletAddress(address)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id)
  }

  @Post(":id/favorites/:eventId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add event to favorites" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiParam({ name: "eventId", description: "Event ID to add to favorites" })
  @ApiResponse({ status: 201, description: "Event added to favorites" })
  @ApiResponse({ status: 404, description: "User or event not found" })
  addFavorite(@Param("id") id: string, @Param("eventId") eventId: string) {
    return this.usersService.addFavoriteEvent(id, eventId)
  }

  @Delete(":id/favorites/:eventId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remove event from favorites" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiParam({ name: "eventId", description: "Event ID to remove from favorites" })
  @ApiResponse({ status: 200, description: "Event removed from favorites" })
  @ApiResponse({ status: 404, description: "User or event not found" })
  removeFavorite(@Param("id") id: string, @Param("eventId") eventId: string) {
    return this.usersService.removeFavoriteEvent(id, eventId)
  }
}
