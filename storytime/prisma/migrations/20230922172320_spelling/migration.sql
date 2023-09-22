/*
  Warnings:

  - You are about to drop the column `briref` on the `PresetCharacter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PresetCharacter" DROP COLUMN "briref",
ADD COLUMN     "brief" TEXT;
