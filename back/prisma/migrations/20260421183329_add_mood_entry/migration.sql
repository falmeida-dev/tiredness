-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" TEXT NOT NULL,
    "mood" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "energy" INTEGER NOT NULL,
    "note" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);
