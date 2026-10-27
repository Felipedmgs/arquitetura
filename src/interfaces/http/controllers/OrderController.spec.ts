import { Request, Response } from "express";
import { OrderController } from "./OrderController";
import { CreateOrderUseCase } from "../../../application/useCases/CreateOrderUseCase";
import { DomainError } from "../../../domain/errors/DomainError";

describe("OrderController", () => {

    it("should return 201 when order is created successfully", async () => {


        const order = {
            status: "CREATED",
            getTotal: jest.fn().mockReturnValue(20)
        };

        const createOrderUseCase = {
            execute: jest.fn().mockResolvedValue(order)
        } as unknown as CreateOrderUseCase;

        const req = {
            body: {
                customerId: 123,
                items: [
                    {
                        productId: 100,
                        quantity: 2,
                        unitPrice: 10
                    }
                ]
            }
        } as Request;


        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const controller = new OrderController(createOrderUseCase);
        // ARRANGE

        // ACT
        await controller.create(req, res);

        // ASSERT
        // ASSERT
        expect(res.status).toHaveBeenCalledWith(201); // cerifica se a função foi chamada com argumento 201


        expect(res.json).toHaveBeenCalledWith({
            message: "Order created successfully",
            status: "CREATED",
            total: 20
        });

    });


    it("should return 400 when a DomainError occurs", async () => {
        // ARRANGE
        const createOrderUseCase = {
            execute: jest.fn().mockRejectedValue(
                new DomainError("Insufficient stock")
            )
        } as unknown as CreateOrderUseCase;

        const req = {
            body: {
                customerId: 123,
                items: [
                    {
                        productId: 100,
                        quantity: 2,
                        unitPrice: 10
                    }
                ]
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const controller = new OrderController(createOrderUseCase);

        // ACT
        await controller.create(req, res);

        //ASSERT
        execute: jest.fn().mockRejectedValue(
            new DomainError("Insufficient stock")
        )

        // ASSERT
        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Insufficient stock"
        });
    });

});