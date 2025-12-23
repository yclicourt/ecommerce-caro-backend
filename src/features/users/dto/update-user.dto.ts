import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'name user',
    example: 'john',
  })
  name?: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'lastname user',
    example: 'mcmillan',
  })
  lastname?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'email user',
    example: 'test@mail.com',
  })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'address user',
    example: 'some 123 avenue',
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'password user',
    example: 'mypassword',
  })
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string | undefined;

}
