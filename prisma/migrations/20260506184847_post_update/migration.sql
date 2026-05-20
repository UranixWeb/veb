/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `skauti` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `skautky` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `stredisko` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `svetlusky` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `vlcata` on the `Post` table. All the data in the column will be lost.
  - Added the required column `p1` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "p1" TEXT NOT NULL,
    "p2" TEXT,
    "p3" TEXT,
    "p4" TEXT,
    "p5" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oddil" BOOLEAN NOT NULL DEFAULT false,
    "vodaci" BOOLEAN NOT NULL DEFAULT false,
    "pozemni" BOOLEAN NOT NULL DEFAULT false,
    "vlci" BOOLEAN NOT NULL DEFAULT false,
    "orli" BOOLEAN NOT NULL DEFAULT false,
    "sobi" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("createdAt", "createdBy", "id", "label") SELECT "createdAt", "createdBy", "id", "label" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
