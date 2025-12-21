import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaModule],
})
export class ProductsModule {}
