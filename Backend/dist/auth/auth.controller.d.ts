import { AuthService } from "./auth.service";
declare class LoginDto {
    walletAddress: string;
    signature?: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            walletAddress: any;
            username: any;
            isVerified: any;
            isEventOrganizer: any;
        };
    }>;
}
export {};
