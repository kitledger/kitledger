import { serverConfig } from "../../../../config.js";
import { auth } from "../../middleware/auth_middleware.js";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { createUnitModel } from "../../../../domain/unit/unit_model_actions.js";
import type { UnitModelCreateData } from "../../../../domain/unit/types.js";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { isValidationFailure } from "../../../../domain/base/validation.js";
import { createLedger } from "../../../../domain/ledger/ledger_actions.js";
import type { LedgerCreateData } from "../../../../domain/ledger/types.js";
import type { Account, Ledger } from "../../../../domain/ledger/types.js";
import { filterAccounts } from "../../../../domain/ledger/account_repository.js";
import { createAccount } from "../../../../domain/ledger/account_actions.js";
import { filterLedgers } from "../../../../domain/ledger/ledger_repository.js";
import { filterEntityModels } from "../../../../domain/entity/entity_model_repository.js";
import { filterTransactionModels } from "../../../../domain/transaction/transaction_model_repository.js";
import { filterUnitModels } from "../../../../domain/unit/unit_model_repository.js";
import type { AccountCreateData } from "../../../../domain/ledger/types.js";
import { createEntityModel } from "../../../../domain/entity/entity_model_actions.js";
import type { EntityModel, EntityModelCreateData } from "../../../../domain/entity/types.js";
import { createTransactionModel } from "../../../../domain/transaction/transaction_model_actions.js";
import type { TransactionModel, TransactionModelCreateData } from "../../../../domain/transaction/types.js";
import { type GetOperationResult, GetOperationType } from "../../../database/helpers.js";
import type { UnitModel } from "../../../../domain/unit/types.js";

const router = new Hono();

router.use(cors(serverConfig.cors));
router.use(auth);
router.get("/", (c) => {
	return c.json({ message: "Welcome to the Kitledger API!" });
});

router.get("/accounts", async (c) => {
	try {
		const search_params = c.req.query();

		const structured_query = search_params.query ? search_params.query : undefined;
		const search = search_params.search ? search_params.search : undefined;
		let getOperationType: GetOperationType = GetOperationType.FILTER;

		if (structured_query) {
			getOperationType = GetOperationType.QUERY;
		}
		else if (search) {
			getOperationType = GetOperationType.SEARCH;
		}

		let results: GetOperationResult<Account>;

		switch (getOperationType) {
			case GetOperationType.FILTER:
				results = await filterAccounts(search_params);
				break;
			case GetOperationType.SEARCH:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			case GetOperationType.QUERY:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			default:
				results = { data: [], limit: 0, offset: 0, count: 0 };
		}

		return c.json(results);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.post("/accounts", async (c) => {
	try {
		const data = await c.req.json() as AccountCreateData;
		const account = await createAccount(data);

		if (isValidationFailure(account)) {
			const status: ContentfulStatusCode = account.errors?.some((e) => e.type === "structure") ? 422 : 400;
			return c.json(account, status);
		}

		return c.json({ data: { account: account.data } }, 201);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.get("/entity-models", async (c) => {
	try {
		const search_params = c.req.query();

		const structured_query = search_params.query ? search_params.query : undefined;
		const search = search_params.search ? search_params.search : undefined;
		let getOperationType: GetOperationType = GetOperationType.FILTER;

		if (structured_query) {
			getOperationType = GetOperationType.QUERY;
		}
		else if (search) {
			getOperationType = GetOperationType.SEARCH;
		}

		let results: GetOperationResult<EntityModel>;

		switch (getOperationType) {
			case GetOperationType.FILTER:
				results = await filterEntityModels(search_params);
				break;
			case GetOperationType.SEARCH:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			case GetOperationType.QUERY:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			default:
				results = { data: [], limit: 0, offset: 0, count: 0 };
		}

		return c.json(results);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.post("/entity-models", async (c) => {
	try {
		const data = await c.req.json() as EntityModelCreateData;
		const entityModel = await createEntityModel(data);

		if (isValidationFailure(entityModel)) {
			const status: ContentfulStatusCode = entityModel.errors?.some((e) => e.type === "structure") ? 422 : 400;
			return c.json(entityModel, status);
		}

		return c.json({ data: { entity_model: entityModel.data } }, 201);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.get("ledgers", async (c) => {
	try {
		const search_params = c.req.query();

		const structured_query = search_params.query ? search_params.query : undefined;
		const search = search_params.search ? search_params.search : undefined;
		let getOperationType: GetOperationType = GetOperationType.FILTER;

		if (structured_query) {
			getOperationType = GetOperationType.QUERY;
		}
		else if (search) {
			getOperationType = GetOperationType.SEARCH;
		}

		let results: GetOperationResult<Ledger>;

		switch (getOperationType) {
			case GetOperationType.FILTER:
				results = await filterLedgers(search_params);
				break;
			case GetOperationType.SEARCH:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			case GetOperationType.QUERY:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			default:
				results = { data: [], limit: 0, offset: 0, count: 0 };
		}

		return c.json(results);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.post("/ledgers", async (c) => {
	try {
		const data = await c.req.json() as LedgerCreateData;
		const ledger = await createLedger(data);

		if (isValidationFailure(ledger)) {
			const status: ContentfulStatusCode = ledger.errors?.some((e) => e.type === "structure") ? 422 : 400;
			return c.json(ledger, status);
		}

		return c.json({ data: { ledger: ledger.data } }, 201);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.get("/transaction-models", async (c) => {
	try {
		const search_params = c.req.query();

		const structured_query = search_params.query ? search_params.query : undefined;
		const search = search_params.search ? search_params.search : undefined;
		let getOperationType: GetOperationType = GetOperationType.FILTER;

		if (structured_query) {
			getOperationType = GetOperationType.QUERY;
		}
		else if (search) {
			getOperationType = GetOperationType.SEARCH;
		}

		let results: GetOperationResult<TransactionModel>;

		switch (getOperationType) {
			case GetOperationType.FILTER:
				results = await filterTransactionModels(search_params);
				break;
			case GetOperationType.SEARCH:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			case GetOperationType.QUERY:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			default:
				results = { data: [], limit: 0, offset: 0, count: 0 };
		}

		return c.json(results);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.post("/transaction-models", async (c) => {
	try {
		const data = await c.req.json() as TransactionModelCreateData;
		const transactionModel = await createTransactionModel(data);

		if (isValidationFailure(transactionModel)) {
			const status: ContentfulStatusCode = transactionModel.errors?.some((e) => e.type === "structure")
				? 422
				: 400;
			return c.json(transactionModel, status);
		}

		return c.json({ data: { transaction_model: transactionModel.data } }, 201);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.get("/unit-models", async (c) => {
	try {
		const search_params = c.req.query();

		const structured_query = search_params.query ? search_params.query : undefined;
		const search = search_params.search ? search_params.search : undefined;
		let getOperationType: GetOperationType = GetOperationType.FILTER;

		if (structured_query) {
			getOperationType = GetOperationType.QUERY;
		}
		else if (search) {
			getOperationType = GetOperationType.SEARCH;
		}

		let results: GetOperationResult<UnitModel>;

		switch (getOperationType) {
			case GetOperationType.FILTER:
				results = await filterUnitModels(search_params);
				break;
			case GetOperationType.SEARCH:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			case GetOperationType.QUERY:
				results = { data: [], limit: 0, offset: 0, count: 0 };
				break;
			default:
				results = { data: [], limit: 0, offset: 0, count: 0 };
		}

		return c.json(results);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

router.post("/unit-models", async (c) => {
	try {
		const data = await c.req.json() as UnitModelCreateData;
		const unitModel = await createUnitModel(data);

		if (isValidationFailure(unitModel)) {
			const status: ContentfulStatusCode = unitModel.errors?.some((e) => e.type === "structure") ? 422 : 400;
			return c.json(unitModel, status);
		}

		return c.json({ data: { unit_model: unitModel.data } }, 201);
	}
	catch (error) {
		console.error(error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

export const apiV1Router = router;
export const apiV1Prefix = "/api/v1";
