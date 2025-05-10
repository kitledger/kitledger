# Kitledger

## A Modern, High-Performance Double-Entry Accounting Framework

Kitledger is an open-source framework (Apache 2.0 licensed) designed to build high-performance accounting systems and business applications with double-entry accounting as its foundational principle.

## Manifesto

In a world where most accounting software has become bloated, slow, and overly complex, Kitledger takes a different approach. We believe that:

1. **Double-entry is fundamental** - The 500-year-old principle of double-entry bookkeeping remains the most powerful mechanism for tracking value flows with integrity. Kitledger places this concept at its core, extending it beyond traditional financial accounting to track any exchangeable unit of value.

2. **Performance is a feature** - Businesses shouldn't wait seconds for ledger entries to post or reports to generate. Kitledger is built from the ground up with performance as a primary design goal, capable of handling millions of transactions with sub-millisecond response times.

3. **Simplicity enables reliability** - By focusing on a single-binary deployment with embedded dependencies, we reduce deployment complexity, minimize points of failure, and make systems easier to reason about.

4. **Vertical scaling is underutilized** - Modern hardware is incredibly powerful. Before distributing a system across multiple machines and introducing the complexity of distributed systems, we should push the limits of what a single, optimized instance can handle.

5. **Data science belongs in accounting** - Traditional accounting systems treat data as an afterthought. Kitledger incorporates modern data science tools directly into its architecture, enabling real-time analysis and insights across multiple dimensions of business operations.

6. **Open source creates better software** - By developing in the open, we create more robust, secure, and innovative software while enabling a community of contributors to shape the future of accounting systems.

## Core Design Principles

### Single Binary Deployment

Kitledger compiles into a single binary, making deployment, updates, and maintenance dramatically simpler than traditional multi-component systems.

### Embedded Services

Where possible, Kitledger uses embedded services rather than external dependencies:
- SQLite for transactional data storage
- DuckDB for analytics and reporting
- Local filesystem for document storage
- Future extensions may include embedded caching with BadgerDB

### Vertical Scaling Focus

Kitledger is designed to scale vertically, utilizing the full capabilities of modern hardware. Our target scale is to support the largest possible client whose accounting needs can be served by the most powerful single server available.

### Multi-Instance (Not Multi-Tenant)

Each client gets their own dedicated Kitledger instance, providing:
- Improved security through physical isolation
- Independent maintenance and upgrade schedules
- Customization without affecting other clients
- Simplified compliance with data regulations

### Extensibility

Kitledger provides extension through:
1. Configuration in the database
2. User-defined scripts in embedded languages
3. First-party modules for common business scenarios

## The Power of Double-Entry Accounting

Double-entry accounting is more than a method for tracking debits and credits. It's a powerful conceptual framework for modeling any system where value moves or transforms. Kitledger's flexible data model supports:

- **Multi-dimensional analysis** - Track transactions across multiple business dimensions (departments, projects, products, locations) without sacrificing performance
- **Multiple units of measure** - Handle not just monetary values but any measurable quantity (time, inventory units, energy, carbon emissions)
- **Entity relationships** - Model complex relationships between business entities while maintaining the integrity of your ledger
- **Custom transaction templates** - Define transaction models that encode business-specific rules and constraints
- **Multi-ledger architecture** - Maintain separate ledgers for different accounting purposes while preserving their interrelationships

## Target Use Cases

Kitledger serves as a foundation for:

- **Traditional accounting systems** - General ledger, accounts payable/receivable with unmatched performance
- **Inventory management** - Track quantities, costs, and value flows with precision
- **ESG and sustainability accounting** - Monitor carbon footprints and other non-financial metrics
- **Project accounting** - Real-time tracking of budgets, costs, and resource utilization
- **Time tracking systems** - Account for billable and non-billable time with the same rigor as financial assets
- **Cryptocurrency applications** - Model complex token economics with proper accounting controls
- **Custom ERPs** - Build tailored enterprise systems without unnecessary bloat
- **Financial consolidation** - Roll up multi-entity operations with speed and accuracy
- **Advanced analytical applications** - Leverage the structured data model for business intelligence

## Data Model

Kitledger's data model is centered around these core concepts:

- **Ledgers** - Independent accounting systems that can be interconnected
- **Accounts** - Categorized containers that track value increases and decreases
- **Entries** - The atomic units of double-entry transactions, always linking a debit and credit account
- **Transactions** - Business events composed of one or more entries
- **Dimensions** - Additional analytical perspectives for entries (e.g., departments, projects)
- **Units** - Flexible representation of value measurements (currencies, quantities, rates)
- **Entities** - Business objects (customers, vendors, etc.) that can be associated with entries

This model provides both the rigor of traditional accounting and the flexibility required for modern business applications.

## Technical Stack

- **Language**: Go (chosen for performance, simplicity, and compilation to a single binary)
- **Primary Database**: SQLite (embedded, ACID-compliant, surprisingly scalable)
- **Analytics Engine**: DuckDB (column-oriented for fast analytical queries)
- **Web Interface**: Server-rendered HTML enhanced with HTMX and targeted JavaScript libraries
- **API Layer**: RESTful endpoints with minimal overhead

## Project Status

Kitledger is currently in early development. We welcome contributors who share our vision for high-performance, reliable accounting systems.

## Getting Started

[Initial setup instructions will be placed here]

## License

Apache License 2.0