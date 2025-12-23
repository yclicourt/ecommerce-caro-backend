import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CategoryName } from '../enums/category-name.enum';

export class CreateCategoryDto {
  @IsEnum(CategoryName)
  @IsNotEmpty()
  name: CategoryName;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
