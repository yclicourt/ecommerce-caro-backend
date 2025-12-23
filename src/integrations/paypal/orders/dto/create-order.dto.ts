import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INTENT } from '../../enums/order.enum';
import { PurchaseUnitDto } from './purchase-unit.dto';
import { ApplicationContextDto } from './application-context.dto';
import { StatusOrder } from '@prisma/client';

export class PaypalCreateOrderDto {
  @IsEnum(INTENT)
  @IsNotEmpty()
  intent: INTENT;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseUnitDto)
  purchase_units: PurchaseUnitDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ApplicationContextDto)
  application_context: ApplicationContextDto;

  @IsEnum(StatusOrder)
  @IsOptional()
  statusOrder?: StatusOrder;
}
