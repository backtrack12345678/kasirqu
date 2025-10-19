/*
  Warnings:

  - You are about to drop the `SubscriptionHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SubscriptionHistory` DROP FOREIGN KEY `SubscriptionHistory_owner_id_fkey`;

-- DropTable
DROP TABLE `SubscriptionHistory`;

-- CreateTable
CREATE TABLE `subscription_history` (
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
ALTER TABLE `subscription_history` ADD CONSTRAINT `subscription_history_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
