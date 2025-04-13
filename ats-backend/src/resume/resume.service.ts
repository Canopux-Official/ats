import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) { }

  async uploadResume(file: Express.Multer.File, userId: string, jobRole?: string, atsScore?: number) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }

    const existingResume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    let resume;
    if (existingResume) {
      resume = await this.prisma.resume.update({
        where: { userId },
        data: {
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date(),
          jobRole: jobRole || existingResume.jobRole,
          atsScore,
        },
      });
    } else {
      resume = await this.prisma.resume.create({
        data: {
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date(),
          jobRole: jobRole || null,
          user: { connect: { id: userId } },
          atsScore,
        },
      });
    }

    //inefective 
    
    const effectiveJobRole = jobRole || resume.jobRole;// see if jobRole is null or undefined
    if (effectiveJobRole) {
      const matchingJobs = await this.prisma.job.findMany({
        where: { jobRole: effectiveJobRole },
      });

      for (const job of matchingJobs) {
        await this.prisma.jobResume.upsert({
          where: {
            jobId_resumeId: {
              jobId: job.id,
              resumeId: resume.id,
            },
          },
          update: {
            atsScore,
          }, // Prevent duplicate entries
          create: {
            jobId: job.id,
            resumeId: resume.id,
          },
        });
      }
    }
    return resume;
  }

  async getResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async deleteResume(userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return await this.prisma.resume.delete({
      where: { userId },
    });
  }
}
