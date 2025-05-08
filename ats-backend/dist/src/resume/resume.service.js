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
exports.ResumeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ResumeService = class ResumeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadResume(file, userId, jobRole, atsScore) {
        if (!file) {
            throw new common_1.NotFoundException('No file uploaded');
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
        }
        else {
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
        const effectiveJobRole = jobRole || resume.jobRole;
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
                    },
                    create: {
                        jobId: job.id,
                        resumeId: resume.id,
                    },
                });
            }
        }
        return resume;
    }
    async getResume(userId) {
        const resume = await this.prisma.resume.findUnique({
            where: { userId },
        });
        if (!resume) {
            throw new common_1.NotFoundException('Resume not found');
        }
        return resume;
    }
    async deleteResume(userId) {
        const resume = await this.prisma.resume.findUnique({
            where: { userId },
        });
        if (!resume) {
            throw new common_1.NotFoundException('Resume not found');
        }
        return await this.prisma.resume.delete({
            where: { userId },
        });
    }
};
exports.ResumeService = ResumeService;
exports.ResumeService = ResumeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResumeService);
//# sourceMappingURL=resume.service.js.map