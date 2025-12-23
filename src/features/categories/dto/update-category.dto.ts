import { CategoryName } from '../enums/category-name.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCategoryDto {
  @IsEnum(CategoryName)
  @IsOptional()
  name?: CategoryName;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  productId?: number;
}
