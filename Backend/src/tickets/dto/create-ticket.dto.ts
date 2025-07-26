import { IsString, IsNumber, IsObject, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  tokenId: string

  @ApiProperty()
  @IsString()
  eventId: string

  @ApiProperty()
  @IsString()
  owner: string

  @ApiProperty()
  @IsString()
  tierName: string

  @ApiProperty()
  @IsNumber()
  price: number

  @ApiProperty()
  @IsString()
  transactionHash: string

  @ApiProperty()
  @IsString()
  contractAddress: string

  @ApiProperty()
  @IsString()
  network: string

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    name: string
    description: string
    image: string
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  qrCode?: string
}
