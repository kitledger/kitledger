## Use Decimal Data Type for Precise Monetary Calculations

**Author:** Alejandro Barrera Aponte <abarreraaponte@icloud.com>
**Date:** 2024-09-19
**Title:** Use Decimal Data Type for Precise Monetary Calculations

### Summary:

This decision advocates for using the `DECIMAL` data type in our Postgres database instead of the `INTEGER` data type for storing financial or other values requiring precise calculations with decimals. While integers offer performance benefits, decimals simplify queries and guarantee exact results.

### Description:

Storing financial data or any other values requiring calculations with decimals necessitates using a data type that accurately represents those values. While integers are efficient for whole numbers, they lack the ability to store fractional parts. This can lead to complications:

1. **Complex Queries:** To perform calculations with decimals using integers, we would need to employ workarounds like multiplying by a factor of 100 (e.g., storing cents instead of dollars) and then dividing back during retrieval. This approach complicates queries and introduces the potential for errors.

2. **Floating-Point Inaccuracy:** The alternative data type, `FLOAT` or `DOUBLE PRECISION`, utilizes floating-point representation. While seemingly convenient, these data types introduce rounding errors due to their inherent limitations. This can be problematic for financial calculations where even slight discrepancies can have significant consequences.

### Alternatives Considered:

1. **INTEGER with Workarounds:** As mentioned, we could utilize integers and manipulate them by factors of 10 to represent decimals. However, this approach makes queries more complex and error-prone.

2. **Floating-Point Types (FLOAT/DOUBLE PRECISION):** These data types offer decimal representation, but their inherent rounding errors make them unsuitable for scenarios requiring absolute precision.

### Impact:

**Performance:** Using decimals will incur a slight performance penalty compared to integers. This is because decimal calculations involve additional processing to handle the decimal point. However, we are willing to accept this trade-off to ensure the accuracy of financial data and simplify queries.

**Maintainability:** Decimals promote cleaner and easier-to-understand code. Queries remain straightforward, as they can directly operate on the decimal values without resorting to workarounds. 

**Security:** By eliminating rounding errors, decimals provide greater confidence in financial calculations, reducing the risk of discrepancies and potential security vulnerabilities.

### Revision History:

* None

**Note:** This decision acknowledges the performance impact of decimals and emphasizes the trade-off being made in favor of accuracy and maintainability.