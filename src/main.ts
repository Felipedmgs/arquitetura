import express from "express";

import { InMemoryOrderRepository } from "./infra/repositories/InMemoryOrderRepository";
import { CreateOrderUseCase } from "./application/useCases/CreateOrderUseCase";
import { OrderController } from "./interfaces/http/controllers/OrderController";
import { InMemoryStockGateway } from "./infra/gateways/InMemoryStockGateway";

const app = express();

app.use(express.json());


// 1. Criando o repositório
const repository = new InMemoryOrderRepository();
const stockGateway = new InMemoryStockGateway();

const createOrderUseCase = new CreateOrderUseCase(
  repository,
  stockGateway
);

// 3. Criando o Controller
const orderController = new OrderController(createOrderUseCase);

const useCase = new CreateOrderUseCase(
  repository,
  stockGateway
);




// 4. Configurando a rota
app.post("/orders", (req, res) => {
  void orderController.create(req, res);
});

// 5. Iniciando o servidor
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
/*
async function main() {
  const repository = new InMemoryOrderRepository();

  const createOrderUseCase =
    new CreateOrderUseCase(repository);

  const order = await createOrderUseCase.execute({
    customerId: 123,
    items: [
      {
        productId: 100,
        quantity: 2,
        unitPrice: 25
      },
      {
        productId: 200,
        quantity: 3,
        unitPrice: 10
      }
    ]
  });

  console.log("Status:", order.status);
  console.log("Total:", order.getTotal());
}

main().catch(console.error);

*/