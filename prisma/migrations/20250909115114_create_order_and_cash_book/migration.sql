/*
  Warnings:

  - You are about to drop the column `createdBy` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalModal` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `order_book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_order_book_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_book` DROP FOREIGN KEY `order_book_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_product` DROP FOREIGN KEY `order_product_orderId_fkey`;

-- DropIndex
DROP INDEX `order_order_book_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_product_orderId_fkey` ON `order_product`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `createdBy`,
    DROP COLUMN `role`,
    DROP COLUMN `totalModal`,
    ADD COLUMN `createdId` VARCHAR(150) NULL,
    ADD COLUMN `createdName` VARCHAR(100) NULL,
    ADD COLUMN `createdRole` ENUM('OWNER', 'CASHIER', 'WAITER') NULL,
    MODIFY `status` ENUM('PENDING', 'DITERIMA', 'DIBAYAR', 'DIBATALKAN') NOT NULL DEFAULT 'PENDING',
    MODIFY `order_book_id` VARCHAR(150) NOT NULL;

-- DropTable
DROP TABLE `order_book`;

-- CreateTable
CREATE TABLE `cash_book` (
    `id` VARCHAR(150) NOT NULL,
    `saldoTunai` DECIMAL(18, 2) NOT NULL,
    `status` ENUM('BUKA', 'TUTUP') NOT NULL DEFAULT 'BUKA',
    `owner_id` VARCHAR(150) NOT NULL,
    `createdId` VARCHAR(150) NOT NULL,
    `createdName` VARCHAR(100) NOT NULL,
    `createdRole` ENUM('OWNER', 'CASHIER', 'WAITER') NOT NULL,
    `closedId` VARCHAR(150) NULL,
    `closedName` VARCHAR(100) NULL,
    `cloedRole` ENUM('OWNER', 'CASHIER', 'WAITER') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `metode` ENUM('CASH', 'TRANSFER', 'EWALLET', 'QRIS') NOT NULL DEFAULT 'CASH',
    `jumlah` DECIMAL(18, 2) NOT NULL,
    `receivedId` VARCHAR(150) NOT NULL,
    `receivedName` VARCHAR(100) NOT NULL,
    `receivedRole` ENUM('OWNER', 'CASHIER', 'WAITER') NOT NULL,
    `orderId` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cash_book` ADD CONSTRAINT `cash_book_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_createdId_fkey` FOREIGN KEY (`createdId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_order_book_id_fkey` FOREIGN KEY (`order_book_id`) REFERENCES `cash_book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_payment` ADD CONSTRAINT `order_payment_receivedId_fkey` FOREIGN KEY (`receivedId`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_payment` ADD CONSTRAINT `order_payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
