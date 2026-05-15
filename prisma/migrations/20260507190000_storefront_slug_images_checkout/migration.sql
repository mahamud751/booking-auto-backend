-- AlterTable Business: slug
ALTER TABLE "Business" ADD COLUMN "slug" TEXT;

UPDATE "Business"
SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE "slug" IS NULL OR "slug" = '';

UPDATE "Business" SET "slug" = CONCAT('store-', SUBSTRING("id", 1, 8))
WHERE "slug" IS NULL OR "slug" = '';

CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");
ALTER TABLE "Business" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable Product: images
ALTER TABLE "Product" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "Product"
SET "images" = ARRAY["imageUrl"]::TEXT[]
WHERE "imageUrl" IS NOT NULL AND cardinality("images") = 0;

-- AlterTable Order: checkout fields
ALTER TABLE "Order" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentNumber" TEXT;
