export class CreateOrderDto {
  customer: string;

  products: {
    id: string;
    quantity: number;
  }[];
}
