import { runMigrations } from "./services/database/db.ts";
import server from "./services/http/server.ts";
import { serverConfig } from "./config.ts";
import { execute } from "./cli.ts";
import { executeScript } from "./services/scripting/v1/runtime.ts";
import { executeQuery } from "./services/database/query.ts";
import type { Query } from "@kitledger/query";
import { accounts } from "./services/database/schema.ts";
import { serve } from "@hono/node-server";
import { argv } from "node:process";

async function start() {
	await runMigrations();

	// --- Test Script Execution ---

	// This string represents a user's script that has already been transpiled
	// from TypeScript to plain JavaScript by your CLI.
	const preCompiledUserCode = `
		await kl.log.info('User script started. Processing event:', context);

		const response = await kl.http.get('https://api.mocki.io/v2/57310619/user-data');
		await kl.log.info('Simulated HTTP call successful. Response body:', response.body);

		await kl.log.audit('User event processing complete.');
	`;

	const contextData = JSON.stringify({ eventId: "evt_simple_456", sourceType: "test-run" });

	console.log("--- Executing Kit Action Script ---");
	// The executeScript call is now simpler, with no entry point.
	const result = await executeScript(preCompiledUserCode, contextData);
	console.log("--- Script Execution Finished ---");
	console.log("Final Result:", result);
	console.log("---------------------------------");

	/**
	 * Sample query execution to demonstrate the executeQuery function.
	 */
	const queryParams: Query = {
		select: [
			{ column: "accounts.id", as: "account_id" },
			{ column: "parent.name", as: "parent_name" },
		],
		joins: [
			{
				type: "left",
				table: "accounts",
				as: "parent",
				onLeft: "accounts.parent_id",
				onRight: "parent.id",
			}
		],
		where: [
			{
				connector: "and",
				conditions: [
					// This condition correctly finds all accounts that have a parent
					{ column: "accounts.parent_id", operator: "not_empty", value: true },
				],
			}
		],
		orderBy: [
			{ column: "accounts.created_at", direction: "desc" },
		],
	};

	const queryResult = await executeQuery(accounts, queryParams);

	console.log("--- Executing Sample Query ---", queryResult);

	// --- Server and CLI Startup Logic ---
	const args = argv.slice(2);

	// If no arguments or "serve" is provided, start the server
	if (args.length === 0 || args[0] === "serve") {
		console.log(`Server is running on port ${serverConfig.port}`);
		serve({
			port: serverConfig.port,
			fetch: server.fetch,
		});
	}

	// Otherwise, treat the arguments as a CLI command and let the CLI handle it
	else {
		await execute(args);
	}
}

start();

