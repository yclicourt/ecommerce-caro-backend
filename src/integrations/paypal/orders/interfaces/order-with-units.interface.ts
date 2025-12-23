import { PurchaseUnitDto } from '../dto/purchase-unit.dto';

export interface OrderWithUnits {
  capturedAt: Date;
  purchase_units: PurchaseUnitDto[];
}
