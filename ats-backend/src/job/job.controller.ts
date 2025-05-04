// src/job/job.controller.ts

import {
    Controller,
    Post, Delete,
    Body,
    UseGuards, Query,
    Req,
    Get,
    ForbiddenException, Param, NotFoundException
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('jobs')
export class JobController {
    constructor(private jobService: JobService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createJob(@Body() createJobDto: CreateJobDto, @Req() req: Request) {
        const user = req.user as { id: string; role: string };

        if (user.role !== 'RECRUITER') {
            throw new ForbiddenException('Only recruiters can post jobs');
        }

        return this.jobService.createJob(createJobDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-jobs')
    async getMyJobs(@Req() req: Request) {
        const user = req.user as { id: string; role: string };
        return this.jobService.getJobsByRecruiter(user.id);
    }
    @Get()
    async getAllJobs() {
        return this.jobService.getAllJobs();
    }

    //get all the job details from selectedJobRole
    @Get('by-ids')
    async getJobsByIds(@Query('ids') ids: string[] | string) {
        const idArray = Array.isArray(ids) ? ids : [ids]; // normalize query param
        return this.jobService.getJobsByIds(idArray);
    }
    //get top 5 jobs by atsScore
    @UseGuards(JwtAuthGuard)
    @Get(':jobId/resumes')
    async getResumesForJob(
        @Param('jobId') jobId: string,
        @Req() req: Request
    ) {
        const user = req.user as { id: string; role: string };
        return this.jobService.getResumesForJob(jobId, user.id);
    }

    //attach the id of the job in the url to be deleted
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteJob(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as { id: string; role: string };

        if (user.role !== 'RECRUITER') {
            throw new ForbiddenException('Only recruiters can delete jobs');
        }

        const deleted = await this.jobService.deleteJob(id, user.id);

        if (!deleted) {
            throw new NotFoundException('Job not found or unauthorized');
        }

        return { message: 'Job deleted successfully' };
    }
}
