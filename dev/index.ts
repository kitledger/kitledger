import { serve } from '@hono/node-server'
import { defineAdminUI } from "@kitledger/admin"; 
import { defineTransactionModel } from '@kitledger/core/transactions';
import { defineEntityModel } from "@kitledger/core/entities";
import { defineConfig } from '@kitledger/core';
import  { createServer } from "@kitledger/server";

const transactionModels = [
      defineTransactionModel({
        ref_id: 'INVOICE',
        name: 'Invoice',
      }),
      defineTransactionModel({
        ref_id: 'PAYMENT',
        name: 'Payment',
      }),
	  defineTransactionModel({
		ref_id: 'CREDIT_NOTE',
		name: 'Credit Note',
	  }),
];

const entityModels = [
    defineEntityModel({
        ref_id: 'CUSTOMER',
        name: 'Customer',
    }),
    defineEntityModel({
        ref_id: 'VENDOR',
        name: 'Vendor',
    }),
	defineEntityModel({
		ref_id: 'EMPLOYEE',
		name: 'Employee',
	}),
];

const config = defineConfig({
    transactionModels,
    entityModels
});

const adminUI = defineAdminUI({
  serverPath: '/__kitledger_data',
  basePath: '/admin',
  title: 'Kitledger Admin UI',
});

const server = createServer({
	systemConfig: config,
	runtime: "node",
	staticPaths: [],
	staticUIs: [
		adminUI,
	]
});

serve({
    fetch: server.fetch,
    port: 3000,
});