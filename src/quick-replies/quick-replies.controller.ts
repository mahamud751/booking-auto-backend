import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateQuickReplyDto,
  UpdateQuickReplyDto,
} from './dto/create-quick-reply.dto';
import { QuickRepliesService } from './quick-replies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@ApiTags('quick-replies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quick-replies')
export class QuickRepliesController {
  constructor(private readonly quickRepliesService: QuickRepliesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateQuickReplyDto) {
    return this.quickRepliesService.create(user.businessId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.quickRepliesService.findAll(user.businessId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.quickRepliesService.findOne(id, user.businessId);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateQuickReplyDto) {
    return this.quickRepliesService.update(id, user.businessId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.quickRepliesService.remove(id, user.businessId);
  }
}
