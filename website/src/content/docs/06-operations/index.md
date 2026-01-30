---
title: "Operations"
description: "Deploying and maintaining Kitledger in production."
order: 6
---

# Operations

[cite_start]Kitledger treats financial infrastructure as code, enabling modern DevOps practices often missing from legacy ERPs[cite: 123].

## Sovereignty
You own the engine. [cite_start]Logic lives in your Git repository, and data lives in your own PostgreSQL instance[cite: 42, 128].

## Workflows
* [cite_start]**Version Control:** Git acts as a trusted audit trail for system configuration[cite: 88].
* [cite_start]**CI/CD:** Test your financial logic in standard pipelines before deploying to production[cite: 89].
* [cite_start]**Database:** Managing migrations and backups with `@kitledger/database`[cite: 103].