-- CreateTable
CREATE TABLE "Country" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Country_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Climate" (
    "id" SERIAL NOT NULL,
    "countryCode" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "tempMinF" INTEGER NOT NULL,
    "tempMaxF" INTEGER NOT NULL,
    "rainMm" INTEGER NOT NULL,
    "crowdLevel" TEXT NOT NULL,
    "budgetTier" TEXT NOT NULL,
    "highlights" TEXT[],

    CONSTRAINT "Climate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "countryCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Climate_month_idx" ON "Climate"("month");

-- CreateIndex
CREATE INDEX "Climate_countryCode_month_idx" ON "Climate"("countryCode", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Climate_countryCode_month_key" ON "Climate"("countryCode", "month");

-- CreateIndex
CREATE INDEX "Place_countryCode_idx" ON "Place"("countryCode");

-- AddForeignKey
ALTER TABLE "Climate" ADD CONSTRAINT "Climate_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "Country"("code") ON DELETE CASCADE ON UPDATE CASCADE;
