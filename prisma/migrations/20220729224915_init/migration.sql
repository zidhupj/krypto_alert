/*
  Warnings:

  - Added the required column `status` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Alert` ADD COLUMN `status` ENUM('created', 'deleted', 'triggered') NOT NULL;
