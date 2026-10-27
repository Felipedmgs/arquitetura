import { StockGateway } from "../../application/gateways/StockGateway";

export class InMemoryStockGateway implements StockGateway {
  async hasStock(
    productId: number,
    quantity: number
  ): Promise<boolean> {
    return true;
  }
}