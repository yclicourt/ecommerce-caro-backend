import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';

export class LoginAuthDto extends OmitType(CreateUserDto, [
  'address',
  'name',
  'lastname',
  'role',
  'phone',
]) {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email user',
    example: 'test@email.com',
  })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'password user',
    example: 'mypassword',
  })
  password: string;
}
