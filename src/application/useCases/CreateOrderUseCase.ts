import { Order } from "../../domain/entities/Order";
import { StockGateway } from "../gateways/StockGateway";
import { OrderRepository } from "../repositories/OrderRepository";
import { DomainError } from "../../domain/errors/DomainError";


type CreateOrderInput = {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
};

export class CreateOrderUseCase {
  constructor(
   private readonly repository: OrderRepository,
   private readonly stockGateway: StockGateway
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const order = new Order(
      input.customerId,
      input.items
    );


    for (const item of input.items) {
      const available = await this.stockGateway.hasStock(
        item.productId,
        item.quantity
      );

    if (!available) {
        throw new DomainError("Insufficient stock");
      }
    }


    await this.repository.save(order);

    return order;
  }
}