/*
  Warnings:

  - You are about to drop the column `is_verified` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `is_verified`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `is_verified`,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;
