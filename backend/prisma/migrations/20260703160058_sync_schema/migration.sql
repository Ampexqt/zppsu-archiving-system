-- AlterTable
ALTER TABLE "files" ADD COLUMN     "ocr_text" TEXT,
ALTER COLUMN "file_name" DROP NOT NULL,
ALTER COLUMN "file_path" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'User';
