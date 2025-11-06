-- CreateTable
CREATE TABLE `charge` (
    `id` VARCHAR(150) NOT NULL,
    `owner_id` VARCHAR(150) NOT NULL,
    `tax` DECIMAL(10, 2) NOT NULL,
    `fee` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `charge_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `charge` ADD CONSTRAINT `charge_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
