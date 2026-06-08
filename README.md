# 🛡️ MCP API Security Workspace

Este é um **Monorepo** focado no estudo, desenvolvimento e integração de **Model Context Protocol (MCP)**, Agentes de IA via **Langchain** e uma infraestrutura Backend utilizando **Fastify e MongoDB**.

A arquitetura em monorepo (via NPM Workspaces) permite orquestrar múltiplos microsserviços, clientes MCP e agentes de Inteligência Artificial a partir de um único lugar.

---

## 📦 Estrutura dos Workspaces

O projeto está dividido nos seguintes pacotes principais:

- 📁 **`customers-mcp-z/`**: Servidor MCP que expõe uma API CRUD de clientes como Ferramentas (Tools) para Agentes de IA.
- 📁 **`mcp_agent_langchain/`**: Implementação de um Agente de Inteligência Artificial usando a biblioteca Langchain para consumir o servidor MCP.
- 📁 **`nodejs-fastify-mongodb-crud-z/`**: API Backend construída com Node.js, Fastify e MongoDB, responsável pela persistência real dos dados.

---

## 📋 Pré-requisitos

- **Node.js**: `>= 18.0.0` (Recomendado v24+)
- **Docker e Docker Compose** (para rodar o MongoDB e o Verdaccio local)

---

## 🚀 Como Iniciar e Executar

### 1. Instalação das Dependências
Na raiz do projeto, instale as dependências. O script `postinstall` fará o build inicial automaticamente.
```bash
npm install
```

### 2. Subir a Infraestrutura (Banco de Dados)
Antes de rodar as aplicações, você precisa iniciar o MongoDB (e a API backend, caso esteja no docker-compose):
```bash
npm run infra:up
```

### 3. Rodar o Ambiente de Desenvolvimento Completo
Para facilitar o desenvolvimento, você pode rodar a API, o Servidor MCP e o Cliente simultaneamente através do utilitário `concurrently`:
```bash
npm run dev:all
```
*(Isso iniciará os scripts de desenvolvimento `dev:api`, `dev:mcp` e `dev:client` ao mesmo tempo no mesmo terminal).*

---

## 📜 Guia de Scripts Disponíveis

Você pode rodar os seguintes comandos a partir da **raiz do projeto**:

### 🏗️ Desenvolvimento e Testes
| Comando | Descrição |
|---|---|
| `npm run dev:all` | Inicia todos os serviços em modo de desenvolvimento simultaneamente. |
| `npm run start:all` | Inicia todos os pacotes em modo de produção (se disponível). |
| `npm run test:all` | Executa os testes de todos os workspaces. |
| `npm run build` | Roda o processo de build necessário (ex: permissões do MCP). |

### 🐳 Infraestrutura Backend (Docker)
| Comando | Descrição |
|---|---|
| `npm run infra:up` | Sobe os containers (Fastify/MongoDB). |
| `npm run infra:down` | Derruba os containers da infraestrutura. |
| `npm run infra:clean` | Derruba os containers e remove os volumes e órfãos (Limpeza total). |
| `npm run infra:logs` | Acompanha os logs da infraestrutura em tempo real. |

### 📦 Registry Local (Verdaccio)
O projeto utiliza o Verdaccio para testar a distribuição de pacotes locais (ex: via `npx`).
| Comando | Descrição |
|---|---|
| `npm run registry:start` | Inicia o registry local na porta `4873`. |
| `npm run registry:stop` | Para o container do registry. |
| `npm run registry:login:private` | Faz o login no NPM apontando para o registry local. |
| `npm run release:private` | Publica o pacote `@wanderaquino/customers-mcp` localmente. |