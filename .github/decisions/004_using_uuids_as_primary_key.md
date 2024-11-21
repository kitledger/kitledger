# Using UUIDs as Primary Keys with Binary Storage and UUID v7 Generation

## Decision Record

**Author:** Alejandro Barrera Aponte [abarreraaponte@icloud.com]
**Date:** 2024-10-20
**Title:** Using UUIDs as Primary Keys with Binary Storage and UUID v7 Generation

### Summary:

* We have decided to use UUIDs as primary keys instead of incremental integer IDs.
* We will store UUIDs in binary format in PostgreSQL for better performance.
* We will override Laravel's default UUID generation to use UUID v7 instead of modified UUID v4.

### Description:

We have chosen to use UUIDs (Universally Unique Identifiers) as primary keys for our database tables instead of traditional auto-incrementing integer IDs. This decision was made to address several concerns:

1. **Scalability**: UUIDs allow for distributed ID generation without the need for central coordination, which is beneficial for highly distributed systems or future sharding.
2. **Security**: UUIDs don't reveal information about the order or number of records in the database, enhancing security.
3. **Consistency**: UUIDs provide a consistent ID format across all tables and potential future microservices.

To optimize performance, we will store UUIDs in binary format in PostgreSQL. This reduces storage space and improves indexing performance compared to storing UUIDs as strings.

Furthermore, we have decided to override Laravel's default UUID generation. By default, Laravel generates a modified version of UUID v4 to make them sortable. Instead, we will implement UUID v7 generation, which provides both randomness and sortability by incorporating a timestamp.

Related pull request: [Link to PR implementing UUID changes]

### Alternatives Considered:

1. **Auto-incrementing integers**: 
   - Pros: Simple, widely supported, efficient for indexing.
   - Cons: Potential scalability issues, reveals information about record count.

2. **Laravel's default UUID implementation (modified v4)**:
   - Pros: Built-in, sortable.
   - Cons: Not a standard UUID format, potential compatibility issues.

3. **UUID v4**:
   - Pros: High randomness, widely supported.
   - Cons: Not sortable, which can impact database performance for range queries.

We chose UUID v7 because it combines the benefits of randomness and sortability, making it superior for our use case.

### Impact:

* **Performance**: Using binary storage for UUIDs in PostgreSQL will reduce storage requirements and improve query performance on UUID columns.
* **Scalability**: UUIDs will allow easier data distribution and potential future sharding.
* **Security**: The system will be more resilient against enumeration attacks.
* **Compatibility**: Using standard UUID v7 ensures better compatibility with other systems and libraries.
* **Development**: Developers will need to adapt to working with UUIDs instead of integer IDs, which may require some initial adjustments to queries and application logic. We need to override the Uuid generation process in Laravel to use V7, until they make it the default, possibly in Laravel 12.

### Revision History:

* 2024-10-20: Alejandro Barrera Aponte [abarreraaponte@icloud.com] - Initial decision record created.