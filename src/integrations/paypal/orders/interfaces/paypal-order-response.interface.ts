import { StatusPaypal } from '../../enums/status-order.enum';

export interface PayPalOrderResponse {
  id: string;
  status: StatusPaypal;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}
