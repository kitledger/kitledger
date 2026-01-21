import { defineAdminUI } from "@kitledger/admin";
import { defineConfig } from "@kitledger/core";
import { initializeDatabase } from "@kitledger/core/db";
import { defineEntityModel } from "@kitledger/core/entities";
import { defineTransactionModel } from "@kitledger/core/transactions";
import { expect, test } from "vitest";

import { defineServerConfig, createServer, ServerOptions } from "./main.js";

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

	const database = await initializeDatabase({
		url: process.env.KL_POSTGRES_URL || "postgres://user:password@localhost:5432/kitledger",
		autoMigrate: false,
	});

	const config = defineConfig({
		database: database,
		entityModels: entityModels,
		transactionModels: transactionModels,
	});

	const adminUI = defineAdminUI({
		serverPath: serverBasePath,
		basePath: "/admin",
		title: "Kitledger Admin UI",
	});

	const serverConfig: ServerOptions = defineServerConfig({
		systemConfig: config,
		staticPaths: ["/static"],
		staticUIs: [adminUI],
	});

	const server = await createServer(serverConfig);
	const transactionResponse = await server.request(`${serverBasePath}/transactions/models`);

	expect(transactionResponse.status).toBe(200);
	expect(await transactionResponse.json()).toEqual(transactionModels);

	const entityResponse = await server.request(`${serverBasePath}/entities/models`);

	expect(entityResponse.status).toBe(200);
	expect(await entityResponse.json()).toEqual(entityModels);
});
