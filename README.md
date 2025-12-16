# Kitledger

**The Headless ERP Framework.**
_Build robust, double-entry transactional systems with the tools you already know._

## What is Kitledger?

Kitledger is a **framework for building transactional software**, distributed as a collection of TypeScript packages.

It provides the fundamental building blocks of double-entry accounting—ACID guarantees, ledger balancing, and audit trails—allowing developers to craft customized ERPs, billing engines, or financial tools without reinventing the wheel.

**Is it an ERP?**
No, Kitledger is not an ERP. Instead, it is the engine you use to build the perfect ERP for your specific needs.

Building an ERP from scratch is a massive undertaking. Kitledger bridges the gap by handling the complex "Accounting Physics" (the ledger), leaving you free to focus on the "Business Physics" (the process). It is designed to be the ultimate complement to an organization's existing systems, providing structure to business processes that the main ERP fails to support.

## Use Cases

Because Kitledger provides the _primitives_ rather than the _product_, it can be adapted to any domain that requires transactional integrity:

- **Core Systems:** Bookkeeping, Inventory Management, Project Billing.
- **Specialized Billing:** Consumption/Usage-Based Billing, Sales Commissions, Grant Management.
- **Virtual Economies:** Game Currencies, Reward Systems, Time Tracking.
- **Complex Allocations:** Cost Accruals, Resource Allocation, Energy Production & Consumption.

## The Philosophy: Why Frameworks Beat Monoliths

To understand why Kitledger exists, we must understand why most business software fails to satisfy the user.

Most transactional systems (ERPs) are opinionated. The creator's idea of how a "Sale" works is hard-coded into the system. This creates friction when reality diverges from the software's design. When this happens, companies fall into one of three traps:

> 1.  **The User Adapts to the System:** The organization abandons their optimized process to follow the software's "Best Practices." This is often a "lesser of two evils" choice that stifles innovation.
> 2.  **The System Adapts to the User:** The organization spends a fortune customizing a monolith. This leads to fragile, expensive systems that are hard to upgrade and maintain.
> 3.  **The User Bridges the Gap:** The most common scenario. Users resort to spreadsheets and disjointed tools to patch the holes in the ERP, creating data silos and operational risk.

### The Kitledger Approach

Kitledger solves this by taking the opposite stance: **We make no decisions for you.**

We provide a robust scaffolding. As a developer, you are expected and encouraged to customize Kitledger to your liking. In fact, customization is not an afterthought—it is the **main value proposition**.

By shifting from a "Monolithic Platform" to a **"Code-First Framework,"** we eliminate the artificial barriers between your business requirements and the software's capabilities.

## The Fundamental Building Blocks

Kitledger is not a SaaS you log into; it is a library you import. It revolves around three core concepts:

### 1. The Ledger (The Core)

Kitledger brings strict **ACID guarantees** and **Double-Entry principles** to your codebase. It makes no assumptions about what accounts you operate or what currencies you use. It simply guarantees transactional consistency: Debits must equal Credits. If they don't, the transaction is rejected. You never have to worry about unbalanced books again.

### 2. The Typed Data Model (The Configuration)

Kitledger pairs double-entry accounting with a flexible, type-safe data model.

By default, the system doesn't know what an "Invoice" or a "Patient" is. You define these realities in your **configuration code**. You define the Transaction Models, Entity Models, and Unit Models using standard TypeScript. This ensures that your specific business logic is validated at compile-time and runtime.

### 3. The Open Ecosystem (The Logic)

Previously, customizing an ERP meant writing proprietary scripts (SuiteScript, Apex) inside a restricted, sandboxed environment.

**Kitledger changes the game.**
Because Kitledger is a framework running in _your_ environment, there is **no sandboxing**.

- **Need to call a machine learning model?** Import the library.
- **Need to generate a PDF?** Use the NPM ecosystem.
- **Need to integrate with a legacy bank?** Write the code.

Logic is no longer "uploaded" to a black box. It is written in your repository, versioned in Git, tested in your CI/CD pipeline, and deployed on your infrastructure.

## Architecture Overview

Kitledger follows the "Headless" philosophy, similar to modern frameworks like **Django**, **Medusa**, or **PayloadCMS**.

1.  **Start with Code:** `git init` your project and install the Kitledger packages.
2.  **Define the Reality:** Configure your ledger rules and transaction types in code.
3.  **Deploy Anywhere:** Run your Kitledger instance on serverless functions, Docker containers, or traditional servers.
4.  **Connect Interfaces:** Use the Kitledger API to power your own frontend, or use the optional **Kitledger Studio** package to visualize and manage your ledger with a pre-built admin UI.

**Kitledger is the first ERP framework that treats the developer as the primary user, giving you the power to build the next generation of financial software.**
