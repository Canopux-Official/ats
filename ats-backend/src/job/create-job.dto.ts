// src/job/dto/create-job.dto.ts

import { IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  jobRole: string;

  @IsString()
  description: string;

  @IsString()
  skills: string;

  @IsString()
  experience: string;

  @IsString()
  cgpa: string;

  @IsString()
  jobType: string;

  @IsString()
  companyName: string;
}
