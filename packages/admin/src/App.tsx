import { useEffect, useState } from 'react'

function App() {

    type UiConfig = {
        serverPath: string;
        assetsPath?: string;
        title?: string;
    }

    type Model = {
        ref_id: string;
        name: string;
    }

    const [transactions, setTransactions] = useState<Model[]>([])
    const [entities, setEntities] = useState<Model[]>([])
    
    const config : UiConfig = (window as any).KITLEDGER_CONFIG;

    useEffect(() => {
        if (!config) return

        document.title = config.title || 'Kitledger Admin UI'

        fetch(`${config.serverPath}/transactions/models`)
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(console.error)

        fetch(`${config.serverPath}/entities/models`)
            .then(res => res.json())
            .then(data => setEntities(data))
            .catch(console.error)

    }, [config])

    if (!config) return <div>No Config Found</div>

    return (
        <div>
            <h1>Kitledger Admin UI</h1>
            
            <h2>Transactions</h2>
            <ul>
                {transactions.map(t => (
                    <li key={t.ref_id}>{t.name} ({t.ref_id})</li>
                ))}
            </ul>

            <h2>Entities</h2>
            <ul>
                {entities.map(e => (
                    <li key={e.ref_id}>{e.name} ({e.ref_id})</li>
                ))}
            </ul>
        </div>
    )
}

export default App