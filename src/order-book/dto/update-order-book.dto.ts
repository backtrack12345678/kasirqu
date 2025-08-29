import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderBookDto } from './create-order-book.dto';

export class UpdateOrderBookDto extends PartialType(CreateOrderBookDto) {}
