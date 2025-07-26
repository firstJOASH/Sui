import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateWallet(walletAddress: string): Promise<any>;
    login(walletAddress: string): Promise<{
        access_token: string;
        user: {
            id: any;
            walletAddress: any;
            username: any;
            isVerified: any;
            isEventOrganizer: any;
        };
    }>;
    validateUser(payload: any): Promise<any>;
}
