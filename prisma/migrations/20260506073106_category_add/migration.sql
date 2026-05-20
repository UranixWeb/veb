/*
  Warnings:

  - You are about to drop the column `category` on the `Post` table. All the data in the column will be lost.
  - Added the required column `skauti` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skautky` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stredisko` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `svetlusky` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vlcata` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stredisko" BOOLEAN NOT NULL,
    "vlcata" BOOLEAN NOT NULL,
    "svetlusky" BOOLEAN NOT NULL,
    "skautky" BOOLEAN NOT NULL,
    "skauti" BOOLEAN NOT NULL
);
INSERT INTO "new_Post" ("content", "createdAt", "createdBy", "id", "label") SELECT "content", "createdAt", "createdBy", "id", "label" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
