import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@ApiTags('businesses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get('me')
  findOne(@CurrentUser() user: AuthUser) {
    return this.businessesService.findOne(user.businessId);
  }

  @Patch('me')
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateBusinessDto) {
    return this.businessesService.update(user.businessId, dto);
  }
}
