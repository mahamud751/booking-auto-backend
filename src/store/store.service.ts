import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoreCheckoutDto } from './dto/checkout.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getStore(slug: string) {
    const business = await this.findBusiness(slug);
    return {
      id: business.id,
      slug: business.slug,
      name: business.name,
      ownerName: business.ownerName,
      phone: business.phone,
    };
  }

  async getProducts(slug: string, page = 1, limit = 20) {
    const business = await this.findBusiness(slug);
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: { businessId: business.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.product.count({ where: { businessId: business.id } }),
    ]);

    return {
      items: items.map((product) => this.mapProduct(product)),
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    };
  }

  async getProduct(slug: string, productId: string) {
    const business = await this.findBusiness(slug);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId: business.id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.mapProduct(product);
  }

  async checkout(slug: string, dto: StoreCheckoutDto) {
    const business = await this.findBusiness(slug);
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, businessId: business.id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * dto.quantity;

    return this.prisma.order.create({
      data: {
        businessId: business.id,
        productId: product.id,
        productCode: product.sku,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        address: dto.address,
        productName: product.name,
        color: dto.color,
        size: dto.size,
        quantity: dto.quantity,
        paymentMethod: dto.paymentMethod,
        paymentNumber: dto.paymentNumber,
        price: totalPrice,
        source: 'STOREFRONT',
        notes: `Payment: ${dto.paymentMethod} (${dto.paymentNumber})`,
      },
    });
  }

  private async findBusiness(slug: string) {
    const business = await this.prisma.business.findUnique({ where: { slug } });
    if (!business) {
      throw new NotFoundException('Store not found');
    }
    return business;
  }

  private mapProduct(product: {
    id: string;
    name: string;
    sku: string | null;
    imageUrl: string | null;
    images: string[];
    price: { toString(): string } | number | string;
    stock: number;
    colors: string[];
    sizes: string[];
  }) {
    const images =
      product.images.length > 0
        ? product.images
        : product.imageUrl
          ? [product.imageUrl]
          : [];

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      imageUrl: images[0] ?? null,
      images,
      price: String(product.price),
      stock: product.stock,
      colors: product.colors,
      sizes: product.sizes,
    };
  }
}
