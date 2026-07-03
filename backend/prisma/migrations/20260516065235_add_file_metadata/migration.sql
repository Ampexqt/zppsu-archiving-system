-- AlterTable
ALTER TABLE "files" ADD COLUMN     "access_code" TEXT,
ADD COLUMN     "document_type" TEXT,
ADD COLUMN     "memo_date" TIMESTAMP(3),
ADD COLUMN     "received_date" TIMESTAMP(3),
ADD COLUMN     "subject" TEXT;
