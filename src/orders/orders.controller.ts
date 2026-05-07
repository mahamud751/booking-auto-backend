import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.businessId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query('status') status?: string) {
    return this.ordersService.findAll(user.businessId, status);
  }

  @Get('dashboard')
  async dashboard(@CurrentUser() user: AuthUser) {
    const [todayOrders, pending, delivered, cancelled] =
      await this.ordersService.dashboard(user.businessId);
    return { todayOrders, pending, delivered, cancelled };
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.findOne(id, user.businessId);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.remove(id, user.businessId);
  }
}
