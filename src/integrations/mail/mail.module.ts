import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports:[ConfigModule]
})
export class MailModule {}
