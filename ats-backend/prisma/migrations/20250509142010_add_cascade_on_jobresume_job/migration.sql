-- DropForeignKey
ALTER TABLE "JobResume" DROP CONSTRAINT "JobResume_jobId_fkey";

-- AddForeignKey
ALTER TABLE "JobResume" ADD CONSTRAINT "JobResume_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
