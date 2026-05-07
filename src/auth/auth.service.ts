import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (exists) {
      throw new BadRequestException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.user.create({
      data: {
        name: dto.ownerName,
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        business: {
          create: {
            name: dto.businessName,
            ownerName: dto.ownerName,
            phone: dto.phone,
          },
        },
      },
      include: { business: true },
    });

    return this.issueTokens(created.id, created.phone, created.business!.id, created.name);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
      include: { business: true },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid || !user.business) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user.id, user.phone, user.business.id, user.name);
  }

  private issueTokens(userId: string, phone: string, businessId: string, name: string) {
    const accessToken = this.jwtService.sign({
      sub: userId,
      phone,
      businessId,
    });
    return {
      accessToken,
      user: { id: userId, phone, businessId, name },
    };
  }
}
