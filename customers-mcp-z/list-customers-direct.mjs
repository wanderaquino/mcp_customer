import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serviceToken = process.env.SERVICE_TOKEN || "7a71b539-2699-465a-b21d-7e18bfcbd4f6";

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["--experimental-strip-types", "src/index.ts"],
    env: { ...process.env, SERVICE_TOKEN: serviceToken },
  });

  const client = new Client(
    { name: "cli", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    await client.connect(transport);
    const result = await client.callTool({ name: "list_customers", arguments: {} });
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
