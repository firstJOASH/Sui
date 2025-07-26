import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import  { UsersService } from "../users/users.service"
import { use } from "passport"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateWallet(walletAddress: string): Promise<any> {
    
    let user = await this.usersService.findByWalletAddress(walletAddress)
    if (!user) {
      user = await this.usersService.create({
        walletAddress
      })
    } else {

    }

    return user
  }

  async login(walletAddress: string) {
    const user = await this.validateWallet(walletAddress)

    if (!user) {
      throw new UnauthorizedException("Invalid wallet address")
    }

    const payload = {
      walletAddress: user.walletAddress,
      sub: user._id,
      userId: user._id,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        isVerified: user.isVerified,
        isEventOrganizer: user.isEventOrganizer,
      },
    }
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findByWalletAddress(payload.walletAddress)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
