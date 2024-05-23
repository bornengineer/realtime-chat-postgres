/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyTokenExpiry` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UnverifiedUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verifyOtp" TEXT,
    "verifyOtpExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "forgotPasswordToken" TEXT,
    "forgotPasswordTokenExpiry" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "forgotPasswordToken", "forgotPasswordTokenExpiry", "id", "isAdmin", "password", "updatedAt", "username") SELECT "createdAt", "email", "forgotPasswordToken", "forgotPasswordTokenExpiry", "id", "isAdmin", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "UnverifiedUser_username_key" ON "UnverifiedUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UnverifiedUser_email_key" ON "UnverifiedUser"("email");
