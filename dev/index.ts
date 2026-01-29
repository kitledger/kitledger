import { serve } from "@hono/node-server";
import { defineAdminUI } from "@kitledger/admin";
import { defineConfig } from "@kitledger/core";
import { initializeDatabase } from "@kitledger/core/db";
import { defineEntityModel } from "@kitledger/core/entities";
import { defineTextField, defineNumberField } from "@kitledger/core/fields";
import { defineTransactionForm } from "@kitledger/core/forms";
import { defineTransactionModel } from "@kitledger/core/transactions";
import { defineUnitModel } from "@kitledger/core/units";
import { createServer, printAsciiLogo } from "@kitledger/server";

process.loadEnvFile(".env");

const invoiceModel = defineTransactionModel({
	refId: "INVOICE",
	name: "Invoice",
	fields: [
		defineTextField({
			refId: "INVOICE_NUMBER",
			name: "Invoice Number",
			description: "The unique identifier for the invoice",
			maxLength: 50,
			format: "plain",
			required: true,
		}),
		defineNumberField({
			refId: "AMOUNT",
			name: "Amount",
			description: "The total amount for the invoice",
			formatting: { style: "currency", currencyCode: "USD" },
		}),
	],
	hooks: {
		creating: [
			async (transaction) => {
				const invoiceNum = transaction.data.INVOICE_NUMBER;

				if (invoiceNum) {
					console.log("Processing invoice:", invoiceNum.toUpperCase());
				}

				return transaction;
			},
		],
	},
});

const transactionModels = [
	invoiceModel,
	defineTransactionModel({
		refId: "PAYMENT",
		name: "Payment",
	}),
	defineTransactionModel({
		refId: "CREDIT_NOTE",
		name: "Credit Note",
	}),
];

const entityModels = [
	defineEntityModel({
		refId: "CUSTOMER",
		name: "Customer",
	}),
	defineEntityModel({
		refId: "VENDOR",
		name: "Vendor",
	}),
	defineEntityModel({
		refId: "EMPLOYEE",
		name: "Employee",
	}),
	defineEntityModel({
		refId: "PRODUCT",
		name: "Product",
	}),
];

const unitModels = [
	defineUnitModel({
		refId: "CURRENCY",
		name: "Currency",
	}),
	defineUnitModel({
		refId: "INVENTORY",
		name: "Inventory",
	}),
];

const database = await initializeDatabase({
	url: process.env.KL_POSTGRES_URL || "postgres://user:password@localhost:5432/kitledger",
});

// Define Forms
const chileInvoiceForm = defineTransactionForm(invoiceModel, {
	refId: "CHILE_INVOICE_FORM",
	name: "Chile Invoice Form",
	fields: {
		INVOICE_NUMBER: {
			label: "Número de Factura",
			description: "El identificador único para la factura",
			required: true,
		},
	},
});

const config = defineConfig({
	database,
	entityModels,
	transactionModels,
	unitModels,
	transactionForms: [chileInvoiceForm],
});

const adminUI = defineAdminUI({
	serverPath: "/__kitledger_data",
	basePath: "/admin",
	title: "Kitledger Admin UI",
});

const server = await createServer({
	systemConfig: config,
	staticPaths: [],
	staticUIs: [adminUI],
});

printAsciiLogo();

serve({
	fetch: server.fetch,
	port: 3000,
});
