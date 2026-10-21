import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { OrderRepository } from "../repositories/OrderRepository";

describe("CreateOrderUseCase", () => {
  it("should create an order successfully", async () => {

    const repository: OrderRepository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const useCase = new CreateOrderUseCase(repository);

    const order = await useCase.execute({
      customerId: 123,
      items: [
        {
          productId: 100,
          quantity: 2,
          unitPrice: 25
        }
      ]
    });

    expect(order.status).toBe("CREATED");
    expect(order.getTotal()).toBe(50);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledWith(order);
  });

  it("should reject an order with invalid quantity", async () => {
  const repository: OrderRepository = {
    save: jest.fn().mockResolvedValue(undefined)
  };

  const useCase = new CreateOrderUseCase(repository);

  await expect(
    useCase.execute({
      customerId: 123,
      items: [
        {
          productId: 100,
          quantity: 0,
          unitPrice: 25
        }
      ]
    })
  ).rejects.toThrow("Quantity must be greater than zero");

  expect(repository.save).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
  const repository: OrderRepository = {
    save: jest.fn().mockRejectedValue(
      new Error("Database connection failed")
    )
  };

  const useCase = new CreateOrderUseCase(repository);

  await expect(
    useCase.execute({
      customerId: 123,
      items: [
        {
          productId: 100,
          quantity: 2,
          unitPrice: 25
        }
      ]
    })
  ).rejects.toThrow("Database connection failed");

  expect(repository.save).toHaveBeenCalledTimes(1);
    });
});