import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: any): Promise<{
        success: boolean;
        token: {
            token: string;
        };
    }>;
    login(body: any): Promise<{
        success: boolean;
        role: import(".prisma/client").$Enums.Role;
        token: {
            token: string;
        };
    }>;
}
