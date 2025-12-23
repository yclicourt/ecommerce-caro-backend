import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartItemDto } from './dto/cart-item.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addItemCartController(@Body() createCartDto: CreateCartDto) {
    return this.cartService.addCart(createCartDto);
  }

  @Post('item')
  @ApiOperation({ summary: 'Create a cart item' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  addItemController(@Body() createItemCartDto: CartItemDto) {
    return this.cartService.addItemCart(createItemCartDto);
  }

  @Get('item')
  getAllItemsCartsController() {
    return this.cartService.getAllCartItems();
  }

  @Get()
  disponibilityStockController(@Body() cartItemDto: CartItemDto) {
    return this.cartService.validateDisponibilityStock(cartItemDto);
  }

  @Delete('item/:id')
  removeItemCartController(@Param('id', ParseIntPipe) cartItemId: number) {
    return this.cartService.deleteItemCart(cartItemId);
  } 
}
