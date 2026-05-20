/*
  Warnings:

  - Added the required column `createdBy` to the `Vareni` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "lisakP" BOOLEAN NOT NULL DEFAULT false,
    "krokoP" BOOLEAN NOT NULL DEFAULT false,
    "bidloP" BOOLEAN NOT NULL DEFAULT false,
    "mungoP" BOOLEAN NOT NULL DEFAULT false,
    "bushmanP" BOOLEAN NOT NULL DEFAULT false,
    "tobiasP" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL
);
INSERT INTO "new_Vareni" ("bidlo", "bidloP", "bushman", "bushmanP", "id", "kroko", "krokoP", "label", "lisak", "lisakP", "mungo", "mungoP", "tobias", "tobiasP", "vsichni") SELECT "bidlo", "bidloP", "bushman", "bushmanP", "id", "kroko", "krokoP", "label", "lisak", "lisakP", "mungo", "mungoP", "tobias", "tobiasP", "vsichni" FROM "Vareni";
DROP TABLE "Vareni";
ALTER TABLE "new_Vareni" RENAME TO "Vareni";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
