<script setup lang="ts">
import { ref, onMounted } from "vue";
import { type EntityModel, EntityModelStatus } from "@kitledger/core/entities";
import { type TransactionModel, TransactionModelStatus } from "@kitledger/core/transactions";
import { type UnitModel, UnitModelStatus } from "@kitledger/core/units";
import type { BaseForm } from "@kitledger/core/forms";
import type { AdminUIOptions } from "../shared";

const transactions = ref<TransactionModel[]>([]);
const entities = ref<EntityModel[]>([]);
const units = ref<UnitModel[]>([]);
const allForms = ref<BaseForm[]>([]);
const config = ref<AdminUIOptions | null>(null);

function getFormsForModel(modelId: string) {
	return allForms.value.filter((f) => f.modelRefId === modelId);
}

function getStatusBadgeClass(status?: TransactionModelStatus | EntityModelStatus | UnitModelStatus) {
	// Cast to string to satisfy TypeScript's overlap check for Enums
	return !status || (status as unknown as string) === "ACTIVE"
		? "badge-success text-success-content"
		: "badge-warning text-warning-content";
}

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
});
</script>

<template>
	<div class="p-8 max-w-5xl mx-auto font-sans bg-base-100 min-h-screen text-base-content">
		<div v-if="!config" role="alert" class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>No Configuration Found. Please check KITLEDGER_CONFIG.</span>
		</div>

		<div v-else>
			<header class="mb-10 pb-6 border-b border-base-300">
				<h1 class="text-4xl font-bold tracking-tight">Kitledger Admin</h1>
				<p class="text-base-content/60 mt-1 font-mono text-sm">System Configuration & Schema</p>
			</header>

			<section class="mb-12">
				<h2 class="text-xl font-bold mb-6 flex items-center gap-3">
					Transaction Models
					<span class="badge badge-neutral font-mono">{{ transactions.length }}</span>
				</h2>

				<div class="flex flex-col gap-4">
					<div
						v-for="model in transactions"
						:key="model.refId"
						class="card card-sm bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all"
					>
						<div class="card-body p-5">
							<div class="flex justify-between items-start mb-4 border-b border-base-200 pb-3">
								<div>
									<h3 class="card-title text-lg text-primary mb-1">{{ model.name }}</h3>
									<span class="badge badge-sm badge-ghost font-mono text-xs text-base-content/60">{{
										model.refId
									}}</span>
								</div>
								<div
									class="badge badge-sm font-bold tracking-wide uppercase"
									:class="getStatusBadgeClass(model.status)"
								>
									{{ model.status || "ACTIVE" }}
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Fields ({{ model.fields?.length || 0 }})
									</h4>
									<ul class="space-y-2">
										<li
											v-for="f in model.fields"
											:key="f.refId"
											class="flex items-center justify-between group"
										>
											<span class="group-hover:text-primary transition-colors">{{ f.name }}</span>
											<div class="flex items-center gap-2">
												<span
													v-if="f.required"
													class="badge badge-xs badge-error badge-outline font-bold"
													>REQ</span
												>
												<span
													class="font-mono text-xs text-base-content/50 bg-base-200 px-1 rounded"
													>{{ f.type }}</span
												>
											</div>
										</li>
									</ul>
								</div>
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Forms ({{ getFormsForModel(model.refId).length }})
									</h4>
									<ul v-if="getFormsForModel(model.refId).length > 0" class="space-y-2">
										<li
											v-for="form in getFormsForModel(model.refId)"
											:key="form.refId"
											class="flex flex-col p-2 bg-base-200/50 rounded-box border border-base-200 hover:border-primary/50 transition-colors"
										>
											<span class="font-medium">{{ form.name }}</span>
											<code class="text-[10px] text-base-content/50 font-mono">{{
												form.refId
											}}</code>
										</li>
									</ul>
									<div v-else class="alert alert-soft alert-sm text-xs py-2 opacity-70">
										No forms defined.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="mb-12">
				<h2 class="text-xl font-bold mb-6 flex items-center gap-3">
					Entity Models
					<span class="badge badge-neutral font-mono">{{ entities.length }}</span>
				</h2>
				<div class="flex flex-col gap-4">
					<div
						v-for="model in entities"
						:key="model.refId"
						class="card card-sm bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all"
					>
						<div class="card-body p-5">
							<div class="flex justify-between items-start mb-4 border-b border-base-200 pb-3">
								<div>
									<h3 class="card-title text-lg text-primary mb-1">{{ model.name }}</h3>
									<span class="badge badge-sm badge-ghost font-mono text-xs text-base-content/60">{{
										model.refId
									}}</span>
								</div>
								<div
									class="badge badge-sm font-bold tracking-wide uppercase"
									:class="getStatusBadgeClass(model.status)"
								>
									{{ model.status || "ACTIVE" }}
								</div>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Fields ({{ model.fields?.length || 0 }})
									</h4>
									<ul class="space-y-2">
										<li
											v-for="f in model.fields"
											:key="f.refId"
											class="flex items-center justify-between group"
										>
											<span class="group-hover:text-primary transition-colors">{{ f.name }}</span>
											<div class="flex items-center gap-2">
												<span
													v-if="f.required"
													class="badge badge-xs badge-error badge-outline font-bold"
													>REQ</span
												>
												<span
													class="font-mono text-xs text-base-content/50 bg-base-200 px-1 rounded"
													>{{ f.type }}</span
												>
											</div>
										</li>
									</ul>
								</div>
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Forms ({{ getFormsForModel(model.refId).length }})
									</h4>
									<ul v-if="getFormsForModel(model.refId).length > 0" class="space-y-2">
										<li
											v-for="form in getFormsForModel(model.refId)"
											:key="form.refId"
											class="flex flex-col p-2 bg-base-200/50 rounded-box border border-base-200 hover:border-primary/50 transition-colors"
										>
											<span class="font-medium">{{ form.name }}</span>
											<code class="text-[10px] text-base-content/50 font-mono">{{
												form.refId
											}}</code>
										</li>
									</ul>
									<div v-else class="alert alert-soft alert-sm text-xs py-2 opacity-70">
										No forms defined.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="mb-12">
				<h2 class="text-xl font-bold mb-6 flex items-center gap-3">
					Unit Models
					<span class="badge badge-neutral font-mono">{{ units.length }}</span>
				</h2>
				<div class="flex flex-col gap-4">
					<div
						v-for="model in units"
						:key="model.refId"
						class="card card-sm bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all"
					>
						<div class="card-body p-5">
							<div class="flex justify-between items-start mb-4 border-b border-base-200 pb-3">
								<div>
									<h3 class="card-title text-lg text-primary mb-1">{{ model.name }}</h3>
									<span class="badge badge-sm badge-ghost font-mono text-xs text-base-content/60">{{
										model.refId
									}}</span>
								</div>
								<div
									class="badge badge-sm font-bold tracking-wide uppercase"
									:class="getStatusBadgeClass(model.status)"
								>
									{{ model.status || "ACTIVE" }}
								</div>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Fields ({{ model.fields?.length || 0 }})
									</h4>
									<ul class="space-y-2">
										<li
											v-for="f in model.fields"
											:key="f.refId"
											class="flex items-center justify-between group"
										>
											<span class="group-hover:text-primary transition-colors">{{ f.name }}</span>
											<div class="flex items-center gap-2">
												<span
													v-if="f.required"
													class="badge badge-xs badge-error badge-outline font-bold"
													>REQ</span
												>
												<span
													class="font-mono text-xs text-base-content/50 bg-base-200 px-1 rounded"
													>{{ f.type }}</span
												>
											</div>
										</li>
									</ul>
								</div>
								<div>
									<h4
										class="font-bold border-b border-base-300 pb-1 mb-3 text-xs uppercase tracking-wider"
									>
										Forms ({{ getFormsForModel(model.refId).length }})
									</h4>
									<ul v-if="getFormsForModel(model.refId).length > 0" class="space-y-2">
										<li
											v-for="form in getFormsForModel(model.refId)"
											:key="form.refId"
											class="flex flex-col p-2 bg-base-200/50 rounded-box border border-base-200 hover:border-primary/50 transition-colors"
										>
											<span class="font-medium">{{ form.name }}</span>
											<code class="text-[10px] text-base-content/50 font-mono">{{
												form.refId
											}}</code>
										</li>
									</ul>
									<div v-else class="alert alert-soft alert-sm text-xs py-2 opacity-70">
										No forms defined.
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>
