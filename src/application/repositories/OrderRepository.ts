import { Order } from "../../domain/entities/Order";


export interface OrderRepository {
 save(order: Order): Promise<void>;
}