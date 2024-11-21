# Multi-ledger Accounting System Core Schema Design

**Author:** Alejandro Barrera Aponte <abarreraaponte@icloud.com>
**Date:** 2024-11-20
**Title:** Multi-ledger Accounting System Core Schema Design

### Summary:
* Designed a flexible, configurable ledger platform that can handle both financial and non-financial accounting
* Needed to solve how to track different types of transactions (monetary, physical units) while maintaining accounting principles and data model purity

### Description:
We established a core data model built around these key concepts:
1. Accounts and Ledgers
   - Every movement is a debit/credit pair
   - Ledgers can be financial or inventory based on uom_type_id presence

2. Units of Measure (UOM)
   - UOM types define categories (currency, weight, volume, etc.)
   - Specific UOMs belong to types (USD to currency, KG to weight)
   - Ledgers with uom_type_id are financial ledgers, others are inventory ledgers
   - Conversion rates table handles unit conversions within types

3. Entities and Dimensions
   - Flexible entity system instead of hard-coded business objects
   - Dimensions link entries to entities
   - Entity models define different types of entities

4. Transactions
   - Group related entries
   - Transaction models for templating common patterns
   - Meta and lines fields for flexibility

### Alternatives Considered:
1. Special case tables for different business objects
   - Rejected in favor of generic entity/dimension system
   - Would have broken conceptual purity
   - Would have made system less flexible

2. Separate columns for monetary and physical units
   - Rejected as redundant
   - Single value column with UOM reference is cleaner
   - Context comes from ledger/account structure

3. Fixed dimension columns
   - Rejected in favor of flexible entity-dimension system
   - Would limit extensibility
   - Would require schema changes for new dimension types

4. Multiple UOM types per ledger
   - Simplified to single optional UOM type
   - Cleaner distinction between financial/inventory ledgers
   - Better validation and conversion rules

### Impact:
Technical Implications:
* Schema supports complex use cases (e.g., carbon accounting)
* Flexible enough for different industries
* Maintains data integrity through proper constraints

Business Implications:
* Platform can be configured for different accounting needs
* No special casing needed for new business domains
* Strong audit capabilities through linked entries and dimensions

Maintenance:
* Clean conceptual model makes changes easier
* Generic entity system reduces need for schema changes
* Clear separation of concerns in data model

### Revision History:
2024-11-20: Initial design covering core accounting concepts
* Established basic schema
* Validated with carbon accounting use case
* Identified need for explicit entry linking (pending)

Key pending considerations:
1. Implementation of entry-to-entry linking for complex chains
2. Detailed validation rules for UOM conversions
3. Performance optimization for common queries
4. Transaction atomicity across linked entries