export interface StockGateway {
  hasStock(
    productId: number,
    quantity: number
  ): Promise<boolean>;
}