# POST /orders — diagrama de sequência

Análise da implementação atual em `src/`. O código da API não foi alterado.

```mermaid
sequenceDiagram
    participant HTTP as Cliente HTTP
    participant C as Controller: OrderController
    participant U as Use Case: CreateOrderUseCase
    participant E as Entity: Order
    participant R as Repository: InMemoryOrderRepository

    Note over C,R: main.ts injeta Repository no Use Case e Use Case no Controller
    HTTP->>C: POST /orders → create(req, res)
    C->>U: execute({ customerId, items })
    U->>E: new Order(customerId, items)
    E->>E: validate()
    Note over E: Pelo menos um item<br/>quantity inteira e positiva<br/>unitPrice finito e não negativo

    alt Validação aprovada
        E-->>U: order (status = CREATED)
        U->>R: await save(order)
        R->>R: orders.push(order)
        R-->>U: Promise resolvida (void)
        U-->>C: order
        C->>E: getTotal()
        E-->>C: soma de quantity × unitPrice
        C-->>HTTP: 201 { message, status, total }
        Note over HTTP,C: message = Order created successfully
    else Erro de validação
        E-->>U: throw new Error(mensagem)
        U-->>C: execute rejeita com o erro
        Note over U,R: save(order) não é chamado
        C->>C: catch → error instanceof Error
        C-->>HTTP: 400 { error: error.message }
    end
```

## Regras e mensagens de validação

| Condição inválida | Mensagem |
| --- | --- |
| `items.length === 0` | `Order must have at least one item` |
| `quantity` não inteira ou menor ou igual a zero | `Quantity must be greater than zero` |
| `unitPrice` não finito ou negativo | `Unit price cannot be negative` |

As regras são executadas nessa ordem; a primeira falha interrompe a construção de `Order`.

## Observações da implementação

- A rota usa `express.json()` e encaminha a requisição para `OrderController.create()`.
- O Use Case depende do contrato `OrderRepository`; `main.ts` fornece `InMemoryOrderRepository`, que salva em um array em memória.
- O Controller calcula o total após o salvamento, ao montar a resposta.
- Qualquer valor capturado que seja uma instância de `Error` resulta em HTTP 400, inclusive erros que não sejam de validação. Outros valores lançados resultam em HTTP 500 com `Internal server error`.
- Não há validação explícita de `customerId`, `productId` ou da estrutura completa do corpo em tempo de execução. As regras acima pressupõem a estrutura esperada de `items`.

## Arquivos analisados

- `src/main.ts`
- `src/interfaces/http/controllers/OrderController.ts`
- `src/application/useCases/CreateOrderUseCase.ts`
- `src/domain/entities/Order.ts`
- `src/application/repositories/OrderRepository.ts`
- `src/infra/repositories/InMemoryOrderRepository.ts`

O desenho no tldraw não foi inserido porque o painel do quadro não conectou durante a tentativa. Este documento contém o diagrama em Mermaid.
