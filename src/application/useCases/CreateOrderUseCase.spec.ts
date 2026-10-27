import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { OrderRepository } from "../repositories/OrderRepository";

describe("CreateOrderUseCase", () => {
  it("should create an order successfully", async () => {

    const repository: OrderRepository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(true)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );

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

    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(true)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );
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


    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(true)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );


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


  it("should reject an order with negative unit price", async () => {
    // ARRANGE
    const repository: OrderRepository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(true)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );

    // ACT + ASSERT
    await expect(useCase.execute({
      customerId: 123,
      items: [
        {
          productId: 100,
          quantity: 2,
          unitPrice: -10
        }
      ]
    })
    ).rejects.toThrow("Unit price cannot be negative");


    expect(repository.save).not.toHaveBeenCalled();


  });

  it("should reject an order when stock is insufficient", async () => {

    const repository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(false)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );

  });



  it("should reject an order when stock is insufficient", async () => {

    const repository = {
      save: jest.fn().mockResolvedValue(undefined)
    };

    const stockGateway = {
      hasStock: jest.fn().mockResolvedValue(false)
    };

    const useCase = new CreateOrderUseCase(
      repository,
      stockGateway
    );


    // ACT + ASSERT
    await expect(useCase.execute({
      customerId: 123,
      items: [
        {
          productId: 100,
          quantity: 2,
          unitPrice: 10
        }
      ]
    })
    ).rejects.toThrow("Insufficient stock");

    expect(repository.save).not.toHaveBeenCalled();
    expect(stockGateway.hasStock).toHaveBeenCalledWith(100, 2);

  });



});