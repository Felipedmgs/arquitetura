import { DomainError } from "../errors/DomainError";

export type OrderItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

export class Order {
  public readonly status = "CREATED";

  constructor(
    public readonly customerId: number,
    public readonly items: OrderItem[]
  ) {
    this.validate();
  }

  private validate(): void {
    // O pedido deve possuir pelo menos um item
    if (this.items.length === 0) {
      throw new DomainError(
        "Order must have at least one item"
      );
    }

    // Validação dos itens
    for (const item of this.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
       throw new DomainError(
          "Quantity must be greater than zero"
        );
      }

      if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
        throw new DomainError(
          "Unit price cannot be negative"
        );
      }
    }
  }

  public getTotal(): number {
    return this.items.reduce(
      (total, item) =>
        total + item.quantity * item.unitPrice,
      0
    );
  }
}
