/*
  Warnings:

  - Added the required column `nama_file` to the `order_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `order_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_product` ADD COLUMN `nama_file` VARCHAR(150) NOT NULL,
    ADD COLUMN `path` VARCHAR(150) NOT NULL;
