import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        id: string;
    }): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.Role;
        email: string;
        password: string;
        createdAt: Date;
    }>;
}
export {};
