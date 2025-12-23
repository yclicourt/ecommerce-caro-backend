import { PaypalCreateOrderDto } from '../orders/dto/create-order.dto';

export function mapToOrderCreateInput(dto: PaypalCreateOrderDto) {
  return {
    intent: dto.intent,
    purchase_units: dto.purchase_units,
    application_context: dto.application_context,
  };
}
