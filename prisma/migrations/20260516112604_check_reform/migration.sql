/*
  Warnings:

  - You are about to drop the column `bidloP` on the `Vareni` table. All the data in the column will be lost.
  - You are about to drop the column `bushmanP` on the `Vareni` table. All the data in the column will be lost.
  - You are about to drop the column `krokoP` on the `Vareni` table. All the data in the column will be lost.
  - You are about to drop the column `lisakP` on the `Vareni` table. All the data in the column will be lost.
  - You are about to drop the column `mungoP` on the `Vareni` table. All the data in the column will be lost.
  - You are about to drop the column `tobiasP` on the `Vareni` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'user',
    "checked" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "level", "password", "username") SELECT "id", "level", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_Vareni" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "vsichni" TEXT,
    "lisak" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "kroko" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "bidlo" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "mungo" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "bushman" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "tobias" TEXT NOT NULL DEFAULT 'Nejde - nevíme',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL
);
INSERT INTO "new_Vareni" ("bidlo", "bushman", "createdBy", "id", "kroko", "label", "lisak", "mungo", "tobias", "vsichni") SELECT "bidlo", "bushman", "createdBy", "id", "kroko", "label", "lisak", "mungo", "tobias", "vsichni" FROM "Vareni";
DROP TABLE "Vareni";
ALTER TABLE "new_Vareni" RENAME TO "Vareni";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
