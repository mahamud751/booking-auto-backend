import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(businessId: string, dto: CreateProductDto) {
    return this.prisma.product.create({ data: { ...dto, businessId } });
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
    await this.prisma.product.updateMany({ where: { id, businessId }, data: dto });
    return this.findOne(id, businessId);
  }

  async remove(id: string, businessId: string) {
    await this.prisma.product.deleteMany({ where: { id, businessId } });
    return { deleted: true };
  }
}
