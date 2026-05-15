import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { normalizePhone } from '../common/phone.util';
import { slugify } from '../common/slug.util';
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
    dto.phone = normalizePhone(dto.phone);
    const exists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (exists) {
      throw new BadRequestException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const slug = await this.createUniqueSlug(dto.businessName);
    const created = await this.prisma.user.create({
      data: {
        name: dto.ownerName,
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        business: {
          create: {
            slug,
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
    const phone = normalizePhone(dto.phone);
    const user = await this.findUserByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }
    if (!user.business) {
      throw new UnauthorizedException(
        'Shop account is not set up. Please register again or contact support.',
      );
    }
    return this.issueTokens(user.id, user.phone, user.business.id, user.name);
  }

  private async findUserByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: { business: true },
    });
    if (user) return user;

    // Support accounts saved before phone normalization (+880 / 880 formats).
    const candidates = new Set<string>();
    if (phone.startsWith('0')) {
      candidates.add(`+880${phone.slice(1)}`);
      candidates.add(`880${phone.slice(1)}`);
    }
    for (const candidate of candidates) {
      const match = await this.prisma.user.findUnique({
        where: { phone: candidate },
        include: { business: true },
      });
      if (match) {
        await this.prisma.user.update({
          where: { id: match.id },
          data: { phone },
        });
        return { ...match, phone };
      }
    }
    return null;
  }

  private async createUniqueSlug(name: string) {
    const base = slugify(name);
    let slug = base;
    let counter = 1;
    while (await this.prisma.business.findUnique({ where: { slug } })) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
    return slug;
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
