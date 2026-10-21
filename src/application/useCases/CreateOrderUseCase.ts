import { Order } from "../../domain/entities/Order";
import { OrderRepository } from "../repositories/OrderRepository";

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
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const order = new Order(
      input.customerId,
      input.items
    );

    await this.orderRepository.save(order);

    return order;
  }
}