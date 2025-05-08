import { ResumeService } from './resume.service';
import { Response } from 'express';
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    uploadResume(file: Express.Multer.File, req: any, jobRole: string, atsScoreRaw: string): Promise<any>;
    getResume(req: any): Promise<{
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
    getResumeFile(filename: string, res: Response, req: any): Promise<Response<any, Record<string, any>> | undefined>;
}
