/*
  Warnings:

  - The primary key for the `Resume` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Resume` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `mimetype` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_pkey",
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Resume_pkey" PRIMARY KEY ("id");
