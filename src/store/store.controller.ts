import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { StoreCheckoutDto } from './dto/checkout.dto';
import { StoreService } from './store.service';

class ProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':slug')
  getStore(@Param('slug') slug: string) {
    return this.storeService.getStore(slug);
  }

  @Get(':slug/products')
  getProducts(@Param('slug') slug: string, @Query() query: ProductsQueryDto) {
    return this.storeService.getProducts(slug, query.page ?? 1, query.limit ?? 20);
  }

  @Get(':slug/products/:productId')
  getProduct(@Param('slug') slug: string, @Param('productId') productId: string) {
    return this.storeService.getProduct(slug, productId);
  }

  @Post(':slug/checkout')
  checkout(@Param('slug') slug: string, @Body() dto: StoreCheckoutDto) {
    return this.storeService.checkout(slug, dto);
  }
}
