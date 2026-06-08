import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CustomerService } from "../application/customer-service.ts";
import { registerListCustomersTool } from "./tools/list-customers.ts";
import { registerGetCustomerTool } from "./tools/get-customer.ts";
import { registerCreateCustomerTool } from "./tools/create-customer.ts";
import { registerUpdateCustomerTool } from "./tools/update-customer.ts";
import { registerDeleteCustomerTool } from "./tools/delete-customer.ts";
import { registerApiInfoResource } from "./resources/api-info.ts";
import { registerFindCustomerPrompt } from "./prompts/findCustomer.ts";

const port: number = Number(process.env.PORT) || 9999;
const BASE_URL = `http://localhost:${port}/v1`;
const SERVICE_TOKEN = process.env.SERVICE_TOKEN!
const service = new CustomerService(BASE_URL, SERVICE_TOKEN);

export const server = new McpServer({
    name: "@wanderaquino/wcruz-customers-mcp",
    version: "0.0.9",
});

registerListCustomersTool(server, service);
registerGetCustomerTool(server, service);
registerCreateCustomerTool(server, service);
registerUpdateCustomerTool(server, service);
registerDeleteCustomerTool(server, service);
registerApiInfoResource(server, BASE_URL);
registerFindCustomerPrompt(server);
