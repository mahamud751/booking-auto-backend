import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(businessId: string, dto: CreateOrderDto) {
    return this.prisma.order.create({ data: { ...dto, businessId } });
  }

  findAll(businessId: string, status?: string) {
    return this.prisma.order.findMany({
      where: {
        businessId,
        status: (status as 'PENDING' | 'DELIVERED' | 'CANCELLED') || undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, businessId: string) {
    return this.prisma.order.findFirst({ where: { id, businessId } });
  }

  async update(id: string, businessId: string, dto: UpdateOrderDto) {
    await this.prisma.order.updateMany({ where: { id, businessId }, data: dto });
    return this.findOne(id, businessId);
  }

  async remove(id: string, businessId: string) {
    await this.prisma.order.deleteMany({ where: { id, businessId } });
    return { deleted: true };
  }

  dashboard(businessId: string) {
    return this.prisma.$transaction([
      this.prisma.order.count({ where: { businessId } }),
      this.prisma.order.count({ where: { businessId, status: 'PENDING' } }),
      this.prisma.order.count({ where: { businessId, status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { businessId, status: 'CANCELLED' } }),
    ]);
  }
}
