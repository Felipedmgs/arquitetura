import { StockGateway } from "../../application/gateways/StockGateway";

export class PostgresStockGateway implements StockGateway {
  async hasStock(
    productId: number,
    quantity: number
  ): Promise<boolean> {
    // Futuramente, consultaríamos o PostgreSQL.
    return true;
  }
}