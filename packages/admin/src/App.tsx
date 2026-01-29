import { useEffect, useState } from "react";
import type { AdminUIOptions } from "../shared";

function App() {

	type Model = {
		refId: string;
		name: string;
	};

	const [transactions, setTransactions] = useState<Model[]>([]);
	const [entities, setEntities] = useState<Model[]>([]);

	const config: AdminUIOptions = (window as any).KITLEDGER_CONFIG;

	useEffect(() => {
		if (!config) return;

		document.title = config.title || "Kitledger Admin UI";

		fetch(`${config.serverPath}/transactions/models`)
			.then((res) => res.json())
			.then((data) => setTransactions(data))
			.catch(console.error);

		fetch(`${config.serverPath}/entities/models`)
			.then((res) => res.json())
			.then((data) => setEntities(data))
			.catch(console.error);
	}, [config]);

	if (!config) return <div>No Config Found</div>;

	return (
		<div>
			<h1>Kitledger Admin UI</h1>

			<h2>Transactions</h2>
			<ul>
				{transactions.map((t) => (
					<li key={t.refId}>
						{t.name} ({t.refId})
					</li>
				))}
			</ul>

			<h2>Entities</h2>
			<ul>
				{entities.map((e) => (
					<li key={e.refId}>
						{e.name} ({e.refId})
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
