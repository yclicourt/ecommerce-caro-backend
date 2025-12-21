import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CategoryName } from 'src/features/categories/enums/category-name.enum';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product name',
    example: 'Rall Dogs',
  })
  name: string;
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product description',
    example: 'Rall Dogs',
  })
  description?: string;
  @ApiPropertyOptional({
    description: 'product price',
    example: '3000',
  })
  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'product image',
    example: 'image.com',
  })
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'categories',
  })
  categories?: string | Array<{ name: CategoryName; description?: string }>;
}
