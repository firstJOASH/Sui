import { PartialType } from "@nestjs/swagger"
import { CreateUserDto } from "./create-user.dto"
import { IsOptional, IsObject } from "class-validator"

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsObject()
  profile?: {
    bio?: string
    website?: string
    twitter?: string
    discord?: string
  }
}
