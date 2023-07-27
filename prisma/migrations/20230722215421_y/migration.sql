/*
  Warnings:

  - You are about to drop the column `city_id` on the `organizations` table. All the data in the column will be lost.
  - You are about to alter the column `address` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(200)`.
  - You are about to drop the column `adopted` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `states` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animal` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `age` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MID', 'LARGE');

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_state_id_fkey";

-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_city_id_fkey";

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_org_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_org_id_fkey";

-- DropIndex
DROP INDEX "organizations_id_name_city_id_idx";

-- DropIndex
DROP INDEX "pets_id_name_breed_idx";

-- DropIndex
DROP INDEX "users_id_name_idx";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "city_id",
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "uf" VARCHAR(2) NOT NULL,
ADD COLUMN     "user_id" VARCHAR(50) NOT NULL,
ALTER COLUMN "address" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "adopted",
DROP COLUMN "height",
DROP COLUMN "photo",
DROP COLUMN "weight",
ADD COLUMN     "adopted_at" TIMESTAMP(3),
ADD COLUMN     "animal" VARCHAR(50) NOT NULL,
ADD COLUMN     "color" VARCHAR(50) NOT NULL,
ADD COLUMN     "size" "Size" NOT NULL,
DROP COLUMN "age",
ADD COLUMN     "age" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "org_id" DROP NOT NULL;

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "states";

-- CreateTable
CREATE TABLE "pet_photos" (
    "id" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "pet_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "pet_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionRequest" (
    "id" VARCHAR(50) NOT NULL,
    "org_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "pet_id" VARCHAR(50) NOT NULL,
    "adopted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdoptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pet_photos_id_idx" ON "pet_photos"("id");

-- CreateIndex
CREATE INDEX "organizations_id_name_idx" ON "organizations"("id", "name");

-- CreateIndex
CREATE INDEX "pets_id_animal_breed_color_size_idx" ON "pets"("id", "animal", "breed", "color", "size");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "users"("id", "email");

-- AddForeignKey
ALTER TABLE "pet_photos" ADD CONSTRAINT "pet_photos_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
