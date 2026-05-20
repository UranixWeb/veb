-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stredisko" BOOLEAN NOT NULL DEFAULT false,
    "vlcata" BOOLEAN NOT NULL DEFAULT false,
    "svetlusky" BOOLEAN NOT NULL DEFAULT false,
    "skautky" BOOLEAN NOT NULL DEFAULT false,
    "skauti" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("content", "createdAt", "createdBy", "id", "label", "skauti", "skautky", "stredisko", "svetlusky", "vlcata") SELECT "content", "createdAt", "createdBy", "id", "label", "skauti", "skautky", "stredisko", "svetlusky", "vlcata" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
