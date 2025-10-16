-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_category_id_fkey`;

-- DropIndex
DROP INDEX `product_category_id_fkey` ON `product`;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
