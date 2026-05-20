/*
  Warnings:

  - You are about to drop the column `oddil` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `orli` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `pozemni` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `sobi` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `vlci` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `vodaci` on the `Post` table. All the data in the column will be lost.
  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.

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
    "type" TEXT NOT NULL
);
INSERT INTO "new_Post" ("createdAt", "createdBy", "id", "label", "p1", "p2", "p3", "p4", "p5") SELECT "createdAt", "createdBy", "id", "label", "p1", "p2", "p3", "p4", "p5" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
