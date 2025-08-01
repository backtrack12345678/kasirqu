/*
  Warnings:

  - Added the required column `role` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `role` ENUM('OWNER', 'CASHIER', 'WAITER') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('OWNER', 'CASHIER', 'WAITER') NOT NULL DEFAULT 'OWNER';
