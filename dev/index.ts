import { serve } from "@hono/node-server";
import { defineAdminUI } from "@kitledger/admin";
import { defineConfig } from "@kitledger/core";
import { defineEntityModel } from "@kitledger/core/entities";
import { defineTextField, defineNumberField } from "@kitledger/core/fields";
import { defineTransactionModel } from "@kitledger/core/transactions";
//import { defineForm } from "@kitledger/core/ui";
import { createServer } from "@kitledger/server";

const transactionModels = [
	defineTransactionModel({
		ref_id: "INVOICE",
		name: "Invoice",
		fields: [
			defineTextField({
				ref_id: "INVOICE_NUMBER",
				name: "Invoice Number",
				description: "The unique identifier for the invoice",
				maxLength: 50,
				format: "plain",
			}),
			defineNumberField({
				ref_id: "AMOUNT",
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

/*const invoiceSimpleForm = defineForm({
	ref_id: "INVOICE_SIMPLE",
	name: "Simple Invoice Form",
	modelRefId: "INVOICE",
	layout: [{ fieldRefId: "INVOICE_NUMBER" }],
});

const invoiceDetailForm = defineForm({
	ref_id: "INVOICE_DETAIL",
	name: "Detailed Invoice Form",
	modelRefId: "INVOICE",
	layout: [{ fieldRefId: "INVOICE_NUMBER" }, { fieldRefId: "AMOUNT" }],
});*/

const config = defineConfig({
	transactionModels,
	entityModels,
});

const adminUI = defineAdminUI({
	serverPath: "/__kitledger_data",
	basePath: "/admin",
	title: "Kitledger Admin UI",
	//forms: [invoiceSimpleForm, invoiceDetailForm],
});

const server = await createServer({
	systemConfig: config,
	staticPaths: [],
	staticUIs: [adminUI],
});

serve({
	fetch: server.fetch,
	port: 3000,
});
