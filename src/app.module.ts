import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BusinessesModule } from './businesses/businesses.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { QuickRepliesModule } from './quick-replies/quick-replies.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BusinessesModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    QuickRepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
