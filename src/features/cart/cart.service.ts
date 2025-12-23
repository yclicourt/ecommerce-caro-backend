import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private cartItems: CartItemDto[] = [];

  // Method to add cart
  async addCart(createCartDto: CreateCartDto) {
    try {
      const { tax, discounts } = this.calculateTotalTaxes(createCartDto);
      return await this.prisma.cart.create({
        data: {
          currency: createCartDto.currency,
          cartItemId: createCartDto.cartItemId,
          orderId: createCartDto.orderId,
          userId: createCartDto.userId,
          shippingAmount: createCartDto.shippingAmount,
          discountAmount: discounts,
          taxAmount: tax,
        },
      });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new ConflictException('The Field dont not exist in the table');
        }
      }
      throw err;
    }
  }

  // Method to add item to cart
  addItemCart(createItemCartDto: CartItemDto) {
    return this.prisma.cartItem.create({
      data: {
        price: createItemCartDto.price,
        productId: createItemCartDto.productId,
        quantity: createItemCartDto.quantity,
        name: createItemCartDto.name,
      },
    });
  }

  // All items added to the cart
  getAllCartItems() {
    return this.prisma.cartItem.findMany({
      include: {
        carts: {
          select: {
            orders: {
              select: {
                purchase_units: true,
              },
            },
            currency: true,
            shippingAmount: true,
            taxAmount: true,
            discountAmount: true,
            user: {
              select: {
                name: true,
                lastname: true,
              },
            },
          },
        },
        product: {
          select: {
            name: true,
            description: true,
            categories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  // Total calculation with taxes and discounts
  calculateTotalTaxes({ taxAmount }: CreateCartDto) {
    const subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const discounts = this.cartItems.reduce(
      (sum, discount) => sum + discount.price,
      0,
    );

    const tax = subtotal + taxAmount;

    const totals = subtotal + tax - discounts;

    return { totals, discounts, tax, subtotal };
  }

  //Check the number of items in stock
  async checkInStock(productId: number) {
    const stockProduct = await this.prisma.cartItem.findUnique({
      where: {
        id: productId,
      },
    });

    if (!stockProduct)
      throw new HttpException('This product is not available in stock', 404);
    return stockProduct;
  }

  // Check disponibility in stock
  async validateDisponibilityStock({ productId, quantity }: CartItemDto) {
    const productFound = await this.checkInStock(productId);

    if (!productFound) {
      throw new HttpException('This product is not available in stock', 404);
    }

    if (quantity >= 0) {
      this.cartItems.push(productFound);
    } else {
      throw new Error('Insufficient stock');
    }

    return this.cartItems;
  }

  // Delet Item into Cart
  async deleteItemCart(cartItemId: number) {
    try {
      const itemFound = await this.checkInStock(cartItemId);
      if (!itemFound) throw new HttpException('Item not Found', 404);

      await this.prisma.cartItem.delete({
        where: {
          id: itemFound.id,
        },
      });
      return { message: 'Item removed from cart successfully' };
    } catch (error: unknown) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException('Item not exists');
        }
        if (error.code === 'P2025') {
          throw new ConflictException('Record to delete does not exists');
        }
      }
      throw error;
    }
  }
}
