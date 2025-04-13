/*
  Warnings:

  - A unique constraint covering the columns `[jobId,resumeId]` on the table `JobResume` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobResume_jobId_resumeId_key" ON "JobResume"("jobId", "resumeId");
