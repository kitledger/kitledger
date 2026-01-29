import type { EntityModel } from "@kitledger/core/entities";
import type { BaseForm } from "@kitledger/core/forms";
import type { TransactionModel } from "@kitledger/core/transactions";
import type { UnitModel } from "@kitledger/core/units";

import { useEffect, useState } from "react";

import type { AdminUIOptions } from "../shared";

function App() {
	const [transactions, setTransactions] = useState<TransactionModel[]>([]);
	const [entities, setEntities] = useState<EntityModel[]>([]);
	const [units, setUnits] = useState<UnitModel[]>([]);
	const [allForms, setAllForms] = useState<BaseForm[]>([]);

	const config: AdminUIOptions = (window as any).KITLEDGER_CONFIG;

	useEffect(() => {
		if (!config) return;

		// Fetch all data in parallel
		Promise.all([
			// Models
			fetch(`${config.serverPath}/transactions/models`).then((res) => res.json()),
			fetch(`${config.serverPath}/entities/models`).then((res) => res.json()),
			fetch(`${config.serverPath}/units/models`).then((res) => res.json()),

			// Forms (Namespace specific)
			fetch(`${config.serverPath}/transactions/forms`)
				.then((res) => res.json())
				.catch(() => []),
			fetch(`${config.serverPath}/entities/forms`)
				.then((res) => res.json())
				.catch(() => []),
			fetch(`${config.serverPath}/units/forms`)
				.then((res) => res.json())
				.catch(() => []),
		])
			.then(([txModels, entityModels, unitModels, txForms, entityForms, unitForms]) => {
				setTransactions(txModels);
				setEntities(entityModels);
				setUnits(unitModels);
				// Combine all forms into one array for easier lookup by modelRefId
				setAllForms([...txForms, ...entityForms, ...unitForms]);
			})
			.catch(console.error);
	}, [config]);

	if (!config) return <div className="p-4">No Config Found</div>;

	return (
		<div className="p-8 max-w-4xl mx-auto font-sans text-gray-800">
			<header className="mb-8 pb-4 border-b border-gray-300">
				<h1 className="text-3xl font-bold">Kitledger Admin</h1>
				<p className="text-gray-500">System Configuration</p>
			</header>

			{/* Transactions Section */}
			<section className="mb-10">
				<h2 className="text-xl font-bold mb-4 flex items-center">
					Transaction Models
					<span className="ml-2 text-sm bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
						{transactions.length}
					</span>
				</h2>
				<div className="space-y-4">
					{transactions.map((model) => (
						<ModelRow key={model.refId} model={model} forms={allForms} />
					))}
				</div>
			</section>

			{/* Entities Section */}
			<section className="mb-10">
				<h2 className="text-xl font-bold mb-4 flex items-center">
					Entity Models
					<span className="ml-2 text-sm bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
						{entities.length}
					</span>
				</h2>
				<div className="space-y-4">
					{entities.map((model) => (
						<ModelRow key={model.refId} model={model} forms={allForms} />
					))}
				</div>
			</section>

			{/* Units Section */}
			<section>
				<h2 className="text-xl font-bold mb-4 flex items-center">
					Unit Models
					<span className="ml-2 text-sm bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
						{units.length}
					</span>
				</h2>
				<div className="space-y-4">
					{units.map((model) => (
						<ModelRow key={model.refId} model={model} forms={allForms} />
					))}
				</div>
			</section>
		</div>
	);
}

// --- Simple Sub-Component ---

function ModelRow({ model, forms }: { model: any; forms: BaseForm[] }) {
	// Find forms that belong to this specific model
	const relatedForms = forms.filter((f) => f.modelRefId === model.refId);

	return (
		<div className="border border-gray-300 rounded p-4 bg-white">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-lg font-bold text-blue-700">{model.name}</h3>
					<code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-500">{model.refId}</code>
				</div>
				<div className="text-xs font-bold text-green-700 uppercase tracking-wide">
					{model.status || "ACTIVE"}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-8 text-sm">
				{/* Left: Fields */}
				<div>
					<h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">
						Fields ({model.fields?.length || 0})
					</h4>
					<ul className="space-y-1 text-gray-600">
						{model.fields?.map((f: any) => (
							<li key={f.refId} className="flex items-center justify-between">
								<span>{f.name}</span>
								<div className="flex items-center gap-2">
									{f.required && (
										<span className="text-[10px] text-red-600 font-bold border border-red-200 px-1 rounded">
											REQ
										</span>
									)}
									<span className="text-xs text-gray-400 font-mono">{f.type}</span>
								</div>
							</li>
						))}
					</ul>
				</div>

				{/* Right: Forms */}
				<div>
					<h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-2">
						Forms ({relatedForms.length})
					</h4>
					{relatedForms.length > 0 ? (
						<ul className="space-y-1">
							{relatedForms.map((form) => (
								<li
									key={form.refId}
									className="flex flex-col mb-2 p-2 bg-gray-50 rounded border border-gray-100"
								>
									<span className="font-medium text-gray-800">{form.name}</span>
									<code className="text-[10px] text-gray-400">{form.refId}</code>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-400 italic">No forms defined.</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
