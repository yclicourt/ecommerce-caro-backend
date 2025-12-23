import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transform';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/features/auth/common/enums/role.enum';
import { Status } from '../common/enums/status.enum';

export class CreateUserDto {
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
  @IsNotEmpty()
  @ApiProperty({
    description: 'email user',
    example: 'test@mail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'address user',
    example: 'some avenie 123',
  })
  address: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'password user',
    example: 'mypassword',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  @Length(9,12,{ message: 'Phone number must be between 9 and 12 digits' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Transform(({ value }: { value: string }) => value.toString())
  @ApiProperty({
    description: 'phone number user',
    example: '585857586',
  })
  phone: string;

  @IsOptional()
  @IsEnum(Role, { each: true })
  @ApiProperty({
    description: 'Role user',
    example: 'ADMIN',
  })
  role?: Role[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'avatar user',
    example: 'http://imagen.com',
  })
  avatar: string | null;

  @IsOptional()
  @IsEnum(Status)
  @ApiProperty({
    description: 'Role user',
    example: 'ACTIVE',
  })
  status?: Status;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
