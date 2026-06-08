# Operações CRUD com Node.js, Fastify e MongoDB utilizando o Node.js Test Runner

![Status da Build](https://github.com/ErickWendel/nodejs-fastify-mongodb-crud/workflows/Run%20tests/badge.svg)

## Descrição

Este projeto demonstra como realizar operações CRUD usando Node.js com o framework Fastify e MongoDB. Ele inclui testes unitários que verificam a funcionalidade dos endpoints da API e acompanham a cobertura de código.

## Começando

### Pré-requisitos

- Docker e Docker Compose
- Node.js (versão 20 ou superior)
- MongoDB (instância local ou na nuvem)

### Executando os testes

Para executar os testes e visualizar a cobertura de código:

```bash
docker-compose up -d mongodb
npm test
```

Isso executará os testes definidos no projeto e exibirá um relatório de cobertura.

### Executando o projeto

Para inicializar o MongoDB:

```bash
docker-compose up -d mongodb
```

Para iniciar o projeto:

```bash
npm start
```

O servidor será iniciado e você poderá acessar a API em `http://localhost:9999` (ou na porta configurada).

### Autenticação e Autorização (RBAC)

Esta API utiliza **autenticação baseada em JWT**. Todas as rotas, exceto `GET /v1/health`, exigem um token Bearer válido.

Existem dois papéis disponíveis:

| Papel  | Usuário       | Senha | Permissões                         |
|---------|---------------|--------|------------------------------------|
| admin   | wanderaquino  | 123123 | leitura, criação, atualização e exclusão |
| member  | charlesnelson | 1234   | somente leitura |

#### Gerar um Token de Serviço (limite de taxa — 3 requisições por minuto)

O endpoint `/v1/auth/service-token` exige credenciais válidas do usuário **mais** o `adminSuperSecret`. Ele retorna o papel do usuário e um token de serviço UUID exclusivo.

O valor de `adminSuperSecret` é:

`AM I THE BOSS?`

```bash
# Como admin
curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "wanderaquino", "password": "123123", "adminSuperSecret": "AM I THE BOSS?"}'

# Como member
curl -X POST http://localhost:9999/v1/auth/service-token \
  -H "Content-Type: application/json" \
  -d '{"username": "charlesnelson", "password": "1234", "adminSuperSecret": "AM I THE BOSS?"}'
```

Resposta:

```json
{ "role": "admin", "serviceToken": "550e8400-e29b-41d4-a716-446655440000" }
```

Armazene o token de serviço e utilize-o como Bearer token nas chamadas da API:

```bash
export SERVICE_TOKEN="<uuid-da-resposta>"

curl http://localhost:9999/v1/customers \
  -H "Authorization: Bearer $SERVICE_TOKEN"
```

> ⚠️ Requisições para geração de token de serviço possuem limite de **99 requisições por minuto** por token. Ao exceder o limite, será retornado `429 Too Many Requests`.

#### Login como admin

```bash
curl -X POST http://localhost:9999/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wanderaquino", "password": "123123"}'
```

#### Login como member

```bash
curl -X POST http://localhost:9999/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "charlesnelson", "password": "1234"}'
```

Ambos retornam:

```json
{ "token": "<jwt-token>" }
```

Armazene o token e envie-o como Bearer token nas próximas requisições:

```bash
export TOKEN="<jwt-token>"
```

### Endpoints da API

Todas as rotas protegidas exigem o cabeçalho:

```text
Authorization: Bearer <token>
```

1. **Verificação de saúde (Health check)** — pública, sem necessidade de token (GET)

   ```bash
   curl http://localhost:9999/v1/health
   ```

2. **Criar um Cliente** — apenas admin (POST)

   ```bash
   curl -X POST http://localhost:9999/v1/customers \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "John Doe", "phone": "123456789"}'
   ```

3. **Listar Todos os Clientes** — admin e member (GET)

   ```bash
   curl http://localhost:9999/v1/customers \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Buscar Cliente por ID** — admin e member (GET)

   ```bash
   curl http://localhost:9999/v1/customers/<customer_id> \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Atualizar Cliente** — apenas admin (PUT)

   ```bash
   curl -X PUT http://localhost:9999/v1/customers/<customer_id> \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"name": "Jane Doe", "phone": "987654321"}'
   ```

6. **Excluir Cliente** — apenas admin (DELETE)

   ```bash
   curl -X DELETE http://localhost:9999/v1/customers/<customer_id> \
     -H "Authorization: Bearer $TOKEN"
   ```
   
## Tecnologias utilizadas

- [Fastify](https://www.fastify.io/) — Framework web rápido e com baixo overhead para Node.js
- [MongoDB](https://www.mongodb.com/) — Banco de dados NoSQL para armazenamento de dados
- [Node.js Test Runner](https://nodejs.org/en/docs/guides/test-runner/) — Executor de testes nativo do Node.js