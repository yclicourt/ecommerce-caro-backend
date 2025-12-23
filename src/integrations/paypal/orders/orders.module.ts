import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { MailModule } from 'src/integrations/mail/mail.module';
import { MailService } from 'src/integrations/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[PrismaModule,MailModule],
  controllers: [OrdersController],
  providers: [OrdersService,MailService,ConfigService],
})
export class OrdersModule {}
