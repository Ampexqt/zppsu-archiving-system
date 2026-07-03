-- AlterTable
ALTER TABLE "files" ADD COLUMN     "inventory_id" INTEGER;

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "cabinet_name" TEXT NOT NULL,
    "shelf" TEXT NOT NULL,
    "folder_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
