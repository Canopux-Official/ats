import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { JobModule } from './job/job.module';

@Module({
  imports: [AuthModule, ResumeModule, JobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
