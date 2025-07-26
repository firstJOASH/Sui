import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags, ApiOperation } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { IsString } from "class-validator"

class LoginDto {
  @IsString()
  walletAddress: string

  @IsString()
  signature?: string 
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login with wallet address" })
  async login(@Body()loginDto: LoginDto) {
    console.log(loginDto)
    return this.authService.login(loginDto.walletAddress)
  }
}
