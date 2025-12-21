import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'product name',
    example: 'Rall Dogs',
  })
  name: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product description',
    example: 'Rall Dogs',
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'product price',
    example: '3000',
  })
  price: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'product image',
    example: 'image.com',
  })
  image?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Product categories',
    example: [{ name: 'RallDogs', description: 'RallDogs' }],
  })
  categories?: string
}

