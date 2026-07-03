/*
  Warnings:

  - You are about to drop the column `cabinet_id` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `cabinets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_cabinet_id_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_category_id_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "cabinet_id",
DROP COLUMN "category_id";

-- DropTable
DROP TABLE "cabinets";
