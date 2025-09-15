/*
  Warnings:

  - You are about to drop the column `cloedRole` on the `cash_book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cash_book` DROP COLUMN `cloedRole`,
    ADD COLUMN `closedRole` ENUM('OWNER', 'CASHIER', 'WAITER') NULL;

-- CreateTable
CREATE TABLE `user_subscriptions` (
    `id` VARCHAR(150) NOT NULL,
    `owner_id` VARCHAR(150) NOT NULL,
    `productId` VARCHAR(100) NOT NULL,
    `store` ENUM('APP_STORE', 'PLAY_STORE') NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELED', 'EXPIRED') NOT NULL,
    `autoRenew` BOOLEAN NOT NULL,
    `purchased_at` DATETIME(3) NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `canceled_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_subscriptions_owner_id_productId_key`(`owner_id`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionHistory` (
    `id` VARCHAR(150) NOT NULL,
    `owner_id` VARCHAR(150) NOT NULL,
    `productId` VARCHAR(100) NOT NULL,
    `price` DECIMAL(18, 2) NULL,
    `currency` VARCHAR(10) NULL,
    `event` VARCHAR(191) NOT NULL,
    `store` ENUM('APP_STORE', 'PLAY_STORE') NOT NULL,
    `status` ENUM('ACTIVE', 'CANCELED', 'EXPIRED') NOT NULL,
    `autoRenew` BOOLEAN NOT NULL,
    `purchased_at` DATETIME(3) NOT NULL,
    `expired_at` DATETIME(3) NOT NULL,
    `canceled_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_subscriptions` ADD CONSTRAINT `user_subscriptions_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionHistory` ADD CONSTRAINT `SubscriptionHistory_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
