# Customers MCP Server 🚀

**Pacote:** `@wanderaquino/customers-mcp`

Este é um servidor MCP (Model Context Protocol) que expõe uma API CRUD de clientes como **Tools (Ferramentas)**. Ele foi desenhado para ser consumido por agentes baseados em Inteligência Artificial, permitindo que a IA interaja com a base de dados de clientes de forma segura e padronizada.

---

## 🛠️ O que ele faz (Capabilities)

| Tipo | Nome | Descrição |
|---|---|---|
| 🔧 Tool | `create_customer` | Cria um novo registro de cliente na base de dados. |
| 🔧 Tool | `get_customer` | Busca os detalhes de um cliente específico pelo ID. |
| 🔧 Tool | `update_customer` | Atualiza os dados de um cliente existente. |
| 🔧 Tool | `delete_customer` | Remove um cliente do sistema. |
| 🔧 Tool | `list_customers` | Retorna uma lista paginada ou completa de clientes. |
| 📄 Resource | `api://info` | Retorna detalhes estáticos sobre o formato da API e a estrutura dos dados do cliente. |
| 💬 Prompt | `findCustomer` | Prompt pré-construído para ajudar o agente de IA a estruturar a busca por um cliente. |

---

## 📋 Pré-requisitos

- Node.js `v24.14.0` ou superior.
- Uma API Backend rodando (Fastify/MongoDB).
- Um `SERVICE_TOKEN` válido para autenticação.

---

## ⚙️ Configuração

O servidor exige a presença da variável de ambiente `SERVICE_TOKEN`. Crie um arquivo `.env` na raiz deste diretório (`customers-mcp-z`):

```env
SERVICE_TOKEN=seu_token_gerado_no_backend_aqui
```

---

## 💻 Scripts Disponíveis

Execute os comandos abaixo a partir deste diretório ou orquestrados via Monorepo:

- `npm run dev`: Inicia o servidor em modo de desenvolvimento (watch).
- `npm start`: Inicia o servidor em modo de produção.
- `npm run mcp:inspect`: Abre o inspetor oficial do MCP (`http://localhost:5173`) para testar as tools visualmente.

### 🧪 Testes
- `npm test`: Roda todos os testes (Unitários e E2E).
- `npm run test:unit`: Roda apenas os testes unitários.
- `npm run test:e2e`: Roda apenas os testes Ponta a Ponta.

---

## 📦 Publicação Local (Verdaccio)

Este projeto está configurado para publicação no Verdaccio, permitindo testes locais via `npx` sem expor o código na internet.

1. **Suba o registro:** `npm run registry:start` (Roda em `http://localhost:4873`)
2. **Faça login:** `npm run registry:login:private`
3. **Publique:** `npm run release:private`
4. **Pare o registro:** `npm run registry:stop`

---

## 🤖 Como os Agentes consomem este MCP?

----
----
Como a comunicação é feita via `stdio`, qualquer cliente MCP pode invocar este servidor usando o comando abaixo após tê-lo publicado localmente:

```json
{
  "mcpServers": {
    "customers": {
      "command": "npx",
      "args": ["-y", "@wanderaquino/customers-mcp"],
      "env": {
        "SERVICE_TOKEN": "seu_token_aqui"
      }
    }
  }
}
```
