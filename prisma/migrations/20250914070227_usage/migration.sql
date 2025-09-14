-- CreateTable
CREATE TABLE "public"."Usage" (
    "key" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3),

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("key")
);
