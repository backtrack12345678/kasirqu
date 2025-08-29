-- CreateTable
CREATE TABLE `order_book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('BUKA', 'TUTUP') NOT NULL DEFAULT 'BUKA',
    `owner_id` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` VARCHAR(150) NOT NULL,
    `createdBy` VARCHAR(100) NOT NULL,
    `role` ENUM('OWNER', 'CASHIER', 'WAITER') NOT NULL,
    `customer` VARCHAR(100) NOT NULL,
    `status` ENUM('PENDING', 'DIBAYAR') NOT NULL DEFAULT 'PENDING',
    `totalHarga` DECIMAL(18, 2) NOT NULL,
    `totalModal` DECIMAL(18, 2) NOT NULL,
    `order_book_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `harga` DECIMAL(18, 2) NOT NULL,
    `modal` DECIMAL(18, 2) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `orderId` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_book` ADD CONSTRAINT `order_book_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_order_book_id_fkey` FOREIGN KEY (`order_book_id`) REFERENCES `order_book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_product` ADD CONSTRAINT `order_product_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
