import { Order } from "../../domain/entities/Order";
import { OrderRepository } from "../../application/repositories/OrderRepository";

export class InMemoryOrderRepository
  implements OrderRepository {

  private orders: Order[] = [];

  async save(order: Order): Promise<void> {
    this.orders.push(order);
  }
}