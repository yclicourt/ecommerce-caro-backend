import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async registerUserController(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createAuthDto: CreateAuthDto,
  ) {
    try {
      let avatarUrl: string | undefined = undefined;
      if (avatar) {
        // Upload the file and get the file name
        const fileName = await this.fileUploadService.uploadFile(avatar);

        // Build the full URL that will be served statically
        avatarUrl =
          process.env.NODE_ENV === 'production' && (fileName.startsWith('http') || fileName.startsWith('https'))
            ? fileName // Cloudinary URL
            : `/uploads/${fileName}`; // Local file path
      }

      const userData = {
        ...createAuthDto,
        avatar: avatarUrl,
      };

      return this.authService.registerUser(userData);
    } catch (error) {
      console.error('Error en registerUserController:', error);
    }
  }

  @Post('register/admin')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async registerUserAdminController(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createAuthAdminDto: CreateAuthAdminDto,
  ){
    try {
      let avatarUrl: string | undefined = undefined;
      if (avatar) {
        // Upload the file and get the file name
        const fileName = await this.fileUploadService.uploadFile(avatar);

        // Build the full URL that will be served statically
        avatarUrl =
          process.env.NODE_ENV === 'production' && (fileName.startsWith('http') || fileName.startsWith('https'))
            ? fileName // Cloudinary URL
            : `/uploads/${fileName}`; // Local file path
      }

      const userData = {
        ...createAuthAdminDto,
        avatar: avatarUrl,
      };

      return this.authService.registerUserAdmin(userData);
    } catch (error) {
      console.error('Error en registerUserAdminController:', error);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  loginUserController(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  forgotPasswordController(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  resetPasswordController(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
