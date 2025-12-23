import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailService } from 'src/integrations/mail/mail.service';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT,
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService,FileUploadService],
})
export class AuthModule {}
