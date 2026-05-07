import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateQuickReplyDto,
  UpdateQuickReplyDto,
} from './dto/create-quick-reply.dto';

@Injectable()
export class QuickRepliesService {
  constructor(private readonly prisma: PrismaService) {}

  create(businessId: string, dto: CreateQuickReplyDto) {
    return this.prisma.quickReply.create({ data: { ...dto, businessId } });
  }

  findAll(businessId: string) {
    return this.prisma.quickReply.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, businessId: string) {
    return this.prisma.quickReply.findFirst({ where: { id, businessId } });
  }

  async update(id: string, businessId: string, dto: UpdateQuickReplyDto) {
    await this.prisma.quickReply.updateMany({ where: { id, businessId }, data: dto });
    return this.findOne(id, businessId);
  }

  async remove(id: string, businessId: string) {
    await this.prisma.quickReply.deleteMany({ where: { id, businessId } });
    return { deleted: true };
  }
}
