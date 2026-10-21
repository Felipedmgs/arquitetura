
import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../../application/useCases/CreateOrderUseCase";
import { DomainError } from "../../../domain/errors/DomainError";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, items } = req.body;

      const order = await this.createOrderUseCase.execute({
        customerId,
        items
      });

      res.status(201).json({
        message: "Order created successfully",
        status: order.status,
        total: order.getTotal()
      });
    } catch (error) {
        if (error instanceof DomainError) {
          res.status(400).json({
            error: error.message
          });
          return;
        }

        console.error("Unexpected error:", error);

        res.status(500).json({
          error: "Internal server error"
        });
      }
  }
}
