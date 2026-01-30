---
title: "Core Concepts"
description: "The fundamental building blocks of the Kitledger engine."
order: 3
---

# Core Concepts

Kitledger provides typed interfaces to model financial reality. [cite_start]These blocks enforce integrity without dictating workflow[cite: 96].

## Key Primitives

* **Transactions:** The core unit of change. [cite_start]Defined with strict schemas and lifecycle hooks[cite: 109].
* [cite_start]**Entities:** Participants in the system (Customers, Vendors, Employees)[cite: 132].
* [cite_start]**Units:** Definitions for value measurement (Currencies, Inventory items)[cite: 132].
* [cite_start]**Double Entry:** The engine enforces that `Assets = Liabilities + Equity` on every commit[cite: 10].

[cite_start]You define these using standard TypeScript functions like `defineTransactionModel` and `defineEntityModel`[cite: 109].