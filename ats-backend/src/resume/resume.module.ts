import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
  imports: [AuthModule], // Ensure AuthModule is imported
  providers: [ResumeService, PrismaService],
  controllers: [ResumeController],
})
export class ResumeModule {}
