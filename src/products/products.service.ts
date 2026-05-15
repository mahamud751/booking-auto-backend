import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  DEFAULT_PRODUCT_COLORS,
  DEFAULT_PRODUCT_SIZES,
  UpdateProductDto,
} from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(businessId: string, dto: CreateProductDto) {
    const colors = normalizeOptions(dto.colors, DEFAULT_PRODUCT_COLORS);
    const sizes = normalizeOptions(dto.sizes, DEFAULT_PRODUCT_SIZES);
    const images = normalizeImages(dto.images, dto.imageUrl);
    const imageUrl = images[0] ?? dto.imageUrl ?? null;
    return this.prisma.product.create({
      data: {
        name: dto.name,
        sku: dto.sku,
        price: dto.price,
        stock: dto.stock ?? 0,
        colors,
        sizes,
        images,
        imageUrl,
        isActive: dto.isActive ?? true,
        businessId,
      },
    });
  }

  findAll(businessId: string) {
    return this.prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, businessId: string) {
    return this.prisma.product.findFirst({ where: { id, businessId } });
  }

  async update(id: string, businessId: string, dto: UpdateProductDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.colors !== undefined) {
      data.colors = normalizeOptions(dto.colors, DEFAULT_PRODUCT_COLORS);
    }
    if (dto.sizes !== undefined) {
      data.sizes = normalizeOptions(dto.sizes, DEFAULT_PRODUCT_SIZES);
    }
    if (dto.images !== undefined || dto.imageUrl !== undefined) {
      const images = normalizeImages(dto.images, dto.imageUrl);
      data.images = images;
      data.imageUrl = images[0] ?? null;
    }
    await this.prisma.product.updateMany({ where: { id, businessId }, data });
    return this.findOne(id, businessId);
  }

  async remove(id: string, businessId: string) {
    await this.prisma.product.deleteMany({ where: { id, businessId } });
    return { deleted: true };
  }
}

function normalizeOptions(values: string[] | undefined, fallback: string[]) {
  const cleaned = (values ?? [])
    .map((value) => value.trim())
    .filter(Boolean);
  return cleaned.length > 0 ? cleaned : fallback;
}

function normalizeImages(images: string[] | undefined, imageUrl?: string) {
  const cleaned = (images ?? []).map((value) => value.trim()).filter(Boolean);
  if (cleaned.length > 0) return cleaned;
  if (imageUrl?.trim()) return [imageUrl.trim()];
  return [];
}
