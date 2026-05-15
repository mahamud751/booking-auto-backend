import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export const DEFAULT_PRODUCT_COLORS = ['Black', 'White', 'Red', 'Blue'];
export const DEFAULT_PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiProperty({ required: false, type: [String], example: DEFAULT_PRODUCT_COLORS })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiProperty({ required: false, type: [String], example: DEFAULT_PRODUCT_SIZES })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
