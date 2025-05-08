import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private generateToken;
    signup(email: string, password: string, role: 'RECRUITER' | 'JOB_SEEKER'): Promise<{
        success: boolean;
        token: {
            token: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        success: boolean;
        role: import(".prisma/client").$Enums.Role;
        token: {
            token: string;
        };
    }>;
}
