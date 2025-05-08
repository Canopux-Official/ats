import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './create-job.dto';
export declare class JobService {
    private prisma;
    constructor(prisma: PrismaService);
    createJob(createJobDto: CreateJobDto, recruiterId: string): Promise<{
        id: string;
        createdAt: Date;
        jobRole: string;
        description: string;
        skills: string;
        experience: string;
        cgpa: string;
        jobType: string;
        companyName: string;
        recruiterId: string;
    }>;
    getJobsByRecruiter(recruiterId: string): Promise<{
        id: string;
        createdAt: Date;
        jobRole: string;
        description: string;
        skills: string;
        experience: string;
        cgpa: string;
        jobType: string;
        companyName: string;
        recruiterId: string;
    }[]>;
    getJobsByIds(ids: string[]): Promise<{
        id: string;
        createdAt: Date;
        jobRole: string;
        description: string;
        skills: string;
        experience: string;
        cgpa: string;
        jobType: string;
        companyName: string;
        recruiterId: string;
    }[]>;
    getAllJobs(): Promise<{
        id: string;
        createdAt: Date;
        jobRole: string;
        description: string;
        skills: string;
        experience: string;
        cgpa: string;
        jobType: string;
        companyName: string;
        recruiterId: string;
    }[]>;
    getResumesForJob(jobId: string, recruiterId: string): Promise<{
        id: number;
        filename: string;
        path: string;
        atsScore: number | null;
        uploadedAt: Date;
        user: {
            email: string;
        };
    }[]>;
    deleteJob(jobId: string, recruiterId: string): Promise<true | null>;
}
