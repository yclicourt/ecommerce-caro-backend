import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PaypalCreateOrderDto } from './dto/create-order.dto';
import { mapToOrderCreateInput } from '../mappers/order.mapper';
import { Response } from 'express';
import { HOST } from 'src/config/app.config';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/features/auth/guard/auth.guard';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('create-order')
  @UseGuards(AuthGuard)
  createOrderController(@Body() createOrderDto: PaypalCreateOrderDto) {
    const orderInput = mapToOrderCreateInput(createOrderDto);
    return this.ordersService.createOrderItem(orderInput);
  }

  @Get('capture-order')
  async captureOrderController(@Query('token') token: string) {
    if (!token) {
      throw new HttpException('Token is required, please verify', 400);
    }
    return this.ordersService.captureOrder(token);
  }

  @Get('cancel-order')
  cancelOrder(@Res() res: Response) {
    res.status(302).redirect(`${HOST}/orders/create-order`);
  }

  @Get()
  getAllOrdersController() {
    return this.ordersService.getAllOrdersItem();
  }

  @Get('stats/:userId')
  getOrderStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getOrdersStats(userId);
  }

  @Get('revenue/:userId')
  getMonthlyRevenue(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getMonthlyRevenueAlt(userId);
  }

  @Get(':id')
  getOrderController(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderItem(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateOrderController(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderItem(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteOrderController(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.deleteOrderItem(id);
  }
}
