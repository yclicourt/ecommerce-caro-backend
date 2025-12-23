import { StatusPaypal } from '../../enums/status-order.enum';

export interface PayPalCaptureOrderResponse {
  id?: string;
  status: StatusPaypal;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: StatusPaypal;
        amount: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
}
