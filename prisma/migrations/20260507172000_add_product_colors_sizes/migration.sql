-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "colors" TEXT[] NOT NULL DEFAULT ARRAY['Black', 'White', 'Red', 'Blue']::TEXT[],
ADD COLUMN "sizes" TEXT[] NOT NULL DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL']::TEXT[];
