<script setup lang="ts">
import { ref, onMounted } from "vue";
import { type EntityModel } from "@kitledger/core/entities";
import { type TransactionModel } from "@kitledger/core/transactions";
import { type UnitModel } from "@kitledger/core/units";
import type { BaseForm } from "@kitledger/core/forms";
import type { AdminUIOptions } from "../shared";
import { RouterView } from "vue-router";

const transactions = ref<TransactionModel[]>([]);
const entities = ref<EntityModel[]>([]);
const units = ref<UnitModel[]>([]);
const allForms = ref<BaseForm[]>([]);
const config = ref<AdminUIOptions | null>(null);

onMounted(() => {
	const winConfig = (window as any).KITLEDGER_CONFIG;

	if (!winConfig) {
		console.warn("Kitledger config not found on window");
		return;
	}

	config.value = winConfig;

	Promise.all([
		fetch(`${winConfig.serverPath}/transactions/models`).then((res) => res.json()),
		fetch(`${winConfig.serverPath}/entities/models`).then((res) => res.json()),
		fetch(`${winConfig.serverPath}/units/models`).then((res) => res.json()),

		fetch(`${winConfig.serverPath}/transactions/forms`)
			.then((res) => res.json())
			.catch(() => []),
		fetch(`${winConfig.serverPath}/entities/forms`)
			.then((res) => res.json())
			.catch(() => []),
		fetch(`${winConfig.serverPath}/units/forms`)
			.then((res) => res.json())
			.catch(() => []),
	])
		.then(([txModels, entityModels, unitModels, txForms, entityForms, unitForms]) => {
			transactions.value = txModels;
			entities.value = entityModels;
			units.value = unitModels;
			allForms.value = [...txForms, ...entityForms, ...unitForms];
		})
		.catch(console.error);

	console.table({
		transactions,
		entities,
		units,
		allForms,
		config,
	});
});
</script>

<template>
	<RouterView />
</template>
