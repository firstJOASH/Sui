import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({ description: "Wallet address", example: "0x1234abcd5678efgh..." })
  @IsString()
  walletAddress: string

  @ApiPropertyOptional({ description: "User email", example: "user@example.com" })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: "Username", example: "cool_username" })
  @IsString()
  @IsOptional()
  username?: string

  @ApiPropertyOptional({ description: "Avatar image URL", example: "https://cdn.example.com/avatar.jpg" })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({ description: "Is the user an event organizer?", example: false })
  @IsBoolean()
  @IsOptional()
  isEventOrganizer?: boolean
}
