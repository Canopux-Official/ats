import { Controller, Get, Post, UseInterceptors, UploadedFile, UseGuards, Req, HttpException, HttpStatus, Body, ForbiddenException, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) { }

  @Post('upload')
  @UseGuards(JwtAuthGuard) // Protect route with authentication
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  //needs resume, jobRole
  async uploadResume(@UploadedFile() file: Express.Multer.File, @Req() req, @Body('jobRole') jobRole: string,
    @Body('atsScore') atsScoreRaw: string,) {
    try {
      const userId = req.user.id; // Extract user ID from token
      const atsScore = atsScoreRaw ? parseFloat(atsScoreRaw) : undefined;

      const response = await this.resumeService.uploadResume(file, userId, jobRole, atsScore);
      return response;
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  // @UseGuards(JwtAuthGuard)
  // @Post('link-to-job')
  // async linkResumeToJob(
  //   @Body() body: { atsScore: number; jobRole: string; jobId: string },
  //   @Req() req: Express.Request,
  // ) {
  //   const user = req.user;

  //   if (user.role !== 'JOB_SEEKER') {
  //     throw new ForbiddenException('Only job seekers can submit resumes to jobs.');
  //   }

  //   return this.resumeService.linkResumeToJob(user.id, body.jobId, body.atsScore, body.jobRole);
  // }


  @Get('get-resume')
  @UseGuards(JwtAuthGuard) // Protect route with authentication
  async getResume(@Req() req) {
    try {
      const userId = req.user.id; // Extract user ID from token
      const resume = await this.resumeService.getResume(userId);

      if (!resume) {
        throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
      }

      return resume;
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //working but not efficient
  @Get(':filename')
  @UseGuards(JwtAuthGuard)
  async getResumeFile(
    @Param('filename') filename: string,
    @Res() res: Response,
    @Req() req
  ) {
    const filePath = join(__dirname, '..', '..', '..', 'uploads', filename);
    console.log('Looking for file at:', filePath); // Add this line
    console.log('Current __dirname:', __dirname); // Add this line

    // Optional: restrict access based on role or ownership
    if (req.user.role !== 'RECRUITER') throw new ForbiddenException();

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(filePath);
  }
}

