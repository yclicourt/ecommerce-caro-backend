import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from 'src/features/users/dto/create-user.dto';

export class CreateAuthDto extends OmitType(CreateUserDto, ['avatar']) {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @Length(9, 12, { message: 'Phone number must be between 9 and 12 digits' })
  @Transform(({ value }) => value.toString())
  @ApiProperty({
    description: 'phone number user',
    example: '585857586',
  })
  phone: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  lastname?: string;
}
