import { PartialType } from '@nestjs/mapped-types';
import { PaypalCreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(PaypalCreateOrderDto) {

}
