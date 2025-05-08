import { JobService } from './job.service';
import { CreateJobDto } from './create-job.dto';
import { Request } from 'express';
export declare class JobController {
    private jobService;
    constructor(jobService: JobService);
    createJob(createJobDto: CreateJobDto, req: Request): Promise<{
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
    getMyJobs(req: Request): Promise<{
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
    getJobsByIds(ids: string[] | string): Promise<{
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
    getResumesForJob(jobId: string, req: Request): Promise<{
        id: number;
        filename: string;
        path: string;
        atsScore: number | null;
        uploadedAt: Date;
        user: {
            email: string;
        };
    }[]>;
    deleteJob(id: string, req: Request): Promise<{
        message: string;
    }>;
}
