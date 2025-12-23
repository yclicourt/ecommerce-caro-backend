import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  name: string;
}
