// src/job/job.service.ts

import { Injectable, ForbiddenException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './create-job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(createJobDto: CreateJobDto, recruiterId: string) {
    //return success message if creating job failed
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        recruiterId,
      },
    });
  }

  async getJobsByRecruiter(recruiterId: string) {
    return this.prisma.job.findMany({
      where: { recruiterId },
      orderBy: {
        createdAt: 'desc', // latest jobs first
      },
    });
  }
  async getAllJobs() {
    return this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResumesForJob(jobId: string, recruiterId: string) {
    // Ensure the job belongs to this recruiter
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
  
    if (!job || job.recruiterId !== recruiterId) {
      throw new ForbiddenException('You are not authorized to view these resumes');
    }
  
    // Get resumes linked to the job
    const jobResumes = await this.prisma.jobResume.findMany({
      where: { jobId },
      take: 5,
      orderBy: {
        resume: {
          atsScore: 'desc',
        },
      },
      include: {
        resume: {
          select: {
            id: true,
            filename: true,
            path: true,
            uploadedAt: true,
            atsScore: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  
    // Extract resume details
    return jobResumes.map((jr) => ({
      id: jr.resume.id,
      filename: jr.resume.filename,
      path: jr.resume.path, // This can be used to open/download the file
      atsScore: jr.resume.atsScore,
      uploadedAt: jr.resume.uploadedAt,
      user: jr.resume.user,
    }));
  }
  

  async deleteJob(jobId: string, recruiterId: string) {
    // Check if job exists and belongs to the recruiter
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
  
    if (!job || job.recruiterId !== recruiterId) {
      return null;
    }
  
    await this.prisma.job.delete({ where: { id: jobId } });
    return true;
  }
}

