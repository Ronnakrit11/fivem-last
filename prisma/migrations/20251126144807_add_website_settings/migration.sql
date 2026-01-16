-- CreateEnum
CREATE TYPE "PurchaseGameStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUND');

-- CreateEnum
CREATE TYPE "PurchaseCardStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUND');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "product_price" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featured_product" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "featured_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pricevip" DOUBLE PRECISION NOT NULL,
    "agent_price" DOUBLE PRECISION NOT NULL,
    "img" TEXT NOT NULL DEFAULT '-',
    "des" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '-',
    "description" TEXT NOT NULL DEFAULT '',
    "isPlayerId" BOOLEAN NOT NULL DEFAULT false,
    "playerFieldName" TEXT NOT NULL DEFAULT 'UID',
    "isServer" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serverCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceVip" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceAgent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "gameCode" TEXT,
    "packageCode" TEXT,
    "icon" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mix_package" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceVip" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceAgent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "gameId" TEXT NOT NULL,

    CONSTRAINT "mix_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_game" (
    "id" TEXT NOT NULL,
    "playerId" TEXT,
    "serverId" TEXT,
    "paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "PurchaseGameStatus" NOT NULL DEFAULT 'PENDING',
    "beforeBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "afterBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "content" TEXT,
    "wepayTxnId" TEXT,
    "operatorId" TEXT,
    "wepayTxnMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT,
    "mixPackageId" TEXT,

    CONSTRAINT "purchase_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '-',
    "description" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_option" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceVip" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "priceAgent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "gameCode" TEXT,
    "packageCode" TEXT,
    "icon" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardId" TEXT NOT NULL,

    CONSTRAINT "card_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_card" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "PurchaseCardStatus" NOT NULL DEFAULT 'PENDING',
    "beforeBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "afterBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "content" TEXT,
    "wepayTxnId" TEXT,
    "operatorId" TEXT,
    "wepayTxnMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "cardOptionId" TEXT,

    CONSTRAINT "purchase_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "prize" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verified_slip" (
    "id" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "transRef" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verified_slip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redeem_history" (
    "id" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redeem_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_settings" (
    "id" TEXT NOT NULL,
    "navbarColor" TEXT NOT NULL DEFAULT 'rgba(15, 23, 42, 0.7)',
    "backgroundColor" TEXT NOT NULL DEFAULT '#0a0e1a',
    "bottomNavColor" TEXT NOT NULL DEFAULT 'rgba(15, 23, 42, 0.7)',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_price_productId_key" ON "product_price"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "featured_product_productId_key" ON "featured_product"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_history_reference_key" ON "purchase_history"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "verified_slip_payloadHash_key" ON "verified_slip"("payloadHash");

-- CreateIndex
CREATE UNIQUE INDEX "verified_slip_transRef_key" ON "verified_slip"("transRef");

-- CreateIndex
CREATE INDEX "verified_slip_payloadHash_idx" ON "verified_slip"("payloadHash");

-- CreateIndex
CREATE INDEX "verified_slip_transRef_idx" ON "verified_slip"("transRef");

-- CreateIndex
CREATE INDEX "verified_slip_userId_idx" ON "verified_slip"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "redeem_history_payloadHash_key" ON "redeem_history"("payloadHash");

-- CreateIndex
CREATE INDEX "redeem_history_payloadHash_idx" ON "redeem_history"("payloadHash");

-- CreateIndex
CREATE INDEX "redeem_history_userId_idx" ON "redeem_history"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "article_slug_key" ON "article"("slug");

-- CreateIndex
CREATE INDEX "article_slug_idx" ON "article"("slug");

-- CreateIndex
CREATE INDEX "article_published_idx" ON "article"("published");

-- AddForeignKey
ALTER TABLE "server" ADD CONSTRAINT "server_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package" ADD CONSTRAINT "package_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mix_package" ADD CONSTRAINT "mix_package_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_game" ADD CONSTRAINT "purchase_game_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_game" ADD CONSTRAINT "purchase_game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_game" ADD CONSTRAINT "purchase_game_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_game" ADD CONSTRAINT "purchase_game_mixPackageId_fkey" FOREIGN KEY ("mixPackageId") REFERENCES "mix_package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_option" ADD CONSTRAINT "card_option_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_card" ADD CONSTRAINT "purchase_card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_card" ADD CONSTRAINT "purchase_card_cardOptionId_fkey" FOREIGN KEY ("cardOptionId") REFERENCES "card_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_slip" ADD CONSTRAINT "verified_slip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redeem_history" ADD CONSTRAINT "redeem_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
