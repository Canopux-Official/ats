"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobService = class JobService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(createJobDto, recruiterId) {
        return this.prisma.job.create({
            data: {
                ...createJobDto,
                recruiterId,
            },
        });
    }
    async getJobsByRecruiter(recruiterId) {
        return this.prisma.job.findMany({
            where: { recruiterId },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getJobsByIds(ids) {
        const filteredIds = ids.filter((id) => id !== undefined && id !== null);
        if (filteredIds.length === 0)
            return [];
        return this.prisma.job.findMany({
            where: {
                id: {
                    in: filteredIds,
                },
            },
        });
    }
    async getAllJobs() {
        return this.prisma.job.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async getResumesForJob(jobId, recruiterId) {
        const job = await this.prisma.job.findUnique({
            where: { id: jobId },
        });
        if (!job || job.recruiterId !== recruiterId) {
            throw new common_1.ForbiddenException('You are not authorized to view these resumes');
        }
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
        return jobResumes.map((jr) => {
            const fileName = jr.resume.path.split('/').pop();
            const protectedPath = `${process.env.BASE_URL}/uploads/${fileName}`;
            return {
                id: jr.resume.id,
                filename: jr.resume.filename,
                path: protectedPath,
                atsScore: jr.resume.atsScore,
                uploadedAt: jr.resume.uploadedAt,
                user: jr.resume.user,
            };
        });
    }
    async deleteJob(jobId, recruiterId) {
        const job = await this.prisma.job.findUnique({ where: { id: jobId } });
        if (!job || job.recruiterId !== recruiterId) {
            return null;
        }
        await this.prisma.job.delete({ where: { id: jobId } });
        return true;
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobService);
//# sourceMappingURL=job.service.js.map