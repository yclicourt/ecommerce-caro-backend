import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpException,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/common/enums/role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { Status } from './common/enums/status.enum';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createUserController(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUserItem(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getUsersController() {
    return this.usersService.getAllUserItems();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getUserController(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserItem(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserStatusController(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: Status },
  ) {
    return this.usersService.updateUserStatus(id, {
      status: body.status,
      lastLogin: new Date(),
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
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
  async updateUserController(
    @Param('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      let avatarUrl: string | undefined = undefined;

      if (avatar) {
        const fileName = await this.fileUploadService.uploadFile(avatar);

        avatarUrl =
          process.env.NODE_ENV === 'production'
            ? fileName // Cloudinary URL
            : `/uploads/${fileName}`; // Local file path
      }

      const updateData = {
        ...updateUserDto,
        ...(avatarUrl && { avatar: avatarUrl }), // Solo actualiza avatar si hay uno nuevo
      };

      return this.usersService.updateUserItem(id, updateData);
    } catch (error) {
      console.error('Error in updateUserController:', error);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteUserController(@Param('id') id: number) {
    return this.usersService.deleteUserItem(id);
  }

  @Delete('bulk')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete multiple users' })
  @ApiResponse({
    status: 200,
    description: 'Users deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (empty array or invalid IDs)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'One or more users not found',
  })
  async deleteMultipleUsersController(@Body() body: { ids: number[] }) {
    // Verify if the array is empty
    if (!body.ids || body.ids.length === 0) {
      throw new HttpException('IDs array is empty', 400);
    }

    // Delete duplicates (optional)
    const uniqueIds = [...new Set(body.ids)];

    return await this.usersService.deleteMultipleUsersItems(uniqueIds);
  }
}
