import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsDate, ValidateNested, IsBoolean } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { EventCategory } from "../schemas/event.schema"

export class CreateTicketTierDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsNumber()
  totalSupply: number

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  benefits?: string[]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  longDescription?: string

  @ApiProperty({ enum: EventCategory })
  @IsEnum(EventCategory)
  category: EventCategory

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date

  @ApiProperty()
  @IsString()
  location: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  venue?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string

  @ApiProperty()
  @IsString()
  organizer: string

  @ApiProperty({ type: [CreateTicketTierDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTierDto)
  ticketTiers: CreateTicketTierDto[]

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxAttendees?: number
}
