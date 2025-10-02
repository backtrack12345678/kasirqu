-- CreateTable
CREATE TABLE `cost` (
    `id` VARCHAR(150) NOT NULL,
    `totalHarga` DECIMAL(18, 2) NOT NULL,
    `order_book_id` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cost_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `harga` DECIMAL(18, 2) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `costId` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cost` ADD CONSTRAINT `cost_order_book_id_fkey` FOREIGN KEY (`order_book_id`) REFERENCES `cash_book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cost_item` ADD CONSTRAINT `cost_item_costId_fkey` FOREIGN KEY (`costId`) REFERENCES `cost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
