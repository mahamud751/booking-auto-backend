import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.business.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateBusinessDto) {
    return this.prisma.business.update({ where: { id }, data: dto });
  }
}
