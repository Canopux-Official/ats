import { PrismaService } from '../prisma/prisma.service';
export declare class ResumeService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadResume(file: Express.Multer.File, userId: string, jobRole?: string, atsScore?: number): Promise<any>;
    getResume(userId: string): Promise<{
        id: number;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        uploadedAt: Date;
        jobRole: string | null;
        atsScore: number | null;
        userId: string;
    }>;
    deleteResume(userId: string): Promise<{
        id: number;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        uploadedAt: Date;
        jobRole: string | null;
        atsScore: number | null;
        userId: string;
    }>;
}
