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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const resume_service_1 = require("./resume.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const path_2 = require("path");
const fs = require("fs");
let ResumeController = class ResumeController {
    resumeService;
    constructor(resumeService) {
        this.resumeService = resumeService;
    }
    async uploadResume(file, req, jobRole, atsScoreRaw) {
        try {
            const userId = req.user.id;
            const atsScore = atsScoreRaw ? parseFloat(atsScoreRaw) : undefined;
            const response = await this.resumeService.uploadResume(file, userId, jobRole, atsScore);
            return response;
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getResume(req) {
        try {
            const userId = req.user.id;
            const resume = await this.resumeService.getResume(userId);
            if (!resume) {
                throw new common_1.HttpException('Resume not found', common_1.HttpStatus.NOT_FOUND);
            }
            return resume;
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getResumeFile(filename, res, req) {
        const filePath = (0, path_2.join)(__dirname, '..', '..', '..', 'uploads', filename);
        console.log('Looking for file at:', filePath);
        console.log('Current __dirname:', __dirname);
        if (req.user.role !== 'RECRUITER')
            throw new common_1.ForbiddenException();
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.sendFile(filePath);
    }
};
exports.ResumeController = ResumeController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('resume', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
        fileFilter: (req, file, callback) => {
            if (file.mimetype !== 'application/pdf') {
                return callback(new Error('Only PDF files are allowed!'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('jobRole')),
    __param(3, (0, common_1.Body)('atsScore')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "uploadResume", null);
__decorate([
    (0, common_1.Get)('get-resume'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "getResume", null);
__decorate([
    (0, common_1.Get)(':filename'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ResumeController.prototype, "getResumeFile", null);
exports.ResumeController = ResumeController = __decorate([
    (0, common_1.Controller)('resumes'),
    __metadata("design:paramtypes", [resume_service_1.ResumeService])
], ResumeController);
//# sourceMappingURL=resume.controller.js.map