/*
  Warnings:

  - You are about to drop the column `type` on the `Post` table. All the data in the column will be lost.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Post" ("createdAt", "createdBy", "id", "label", "p1", "p2", "p3", "p4", "p5") SELECT "createdAt", "createdBy", "id", "label", "p1", "p2", "p3", "p4", "p5" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
