import { defineAdminUI } from "@kitledger/admin";
import { defineConfig } from "@kitledger/core";
import { defineEntityModel } from "@kitledger/core/entities";
import { defineTransactionModel } from "@kitledger/core/transactions";
import { expect, test } from "vitest";

import { defineServerConfig, createServer, ServerOptions } from "./server.js";

test("server should be created with correct config", async () => {
	const transactionModels = [
		defineTransactionModel({
			ref_id: "INVOICE",
			name: "Invoice",
		}),
		defineTransactionModel({
			ref_id: "PAYMENT",
			name: "Payment",
		}),
		defineTransactionModel({
			ref_id: "CREDIT_NOTE",
			name: "Credit Note",
		}),
	];

	const entityModels = [
		defineEntityModel({
			ref_id: "CUSTOMER",
			name: "Customer",
		}),
		defineEntityModel({
			ref_id: "VENDOR",
			name: "Vendor",
		}),
		defineEntityModel({
			ref_id: "EMPLOYEE",
			name: "Employee",
		}),
	];

	const serverBasePath = "/__kitledger_data";

	const config = defineConfig({
		transactionModels: transactionModels,
		entityModels: entityModels,
	});

	const adminUI = defineAdminUI({
		serverPath: serverBasePath,
		basePath: "/admin",
		title: "Kitledger Admin UI",
	});

	const serverConfig: ServerOptions = defineServerConfig({
		systemConfig: config,
		runtime: "node",
		staticPaths: ["/static"],
		staticUIs: [adminUI],
	});

	const server = createServer(serverConfig);
	const response = await server.request(`${serverBasePath}/transactions/models`);

	expect(response.status).toBe(200);
	expect(await response.json()).toEqual(transactionModels);
});
