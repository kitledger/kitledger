package com.kitledger.services.database

import com.kitledger.services.config.AppConfig
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.v1.jdbc.Database

/**
 * Creates a database connection.
 * @return the database connection.
 */
object DatabaseFactory {
    fun init() {
        val config = AppConfig.dbConfig
        val hikariConfig = HikariConfig().apply {
            jdbcUrl = config.url
            driverClassName = "org.postgresql.Driver"
            maximumPoolSize = config.max
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        }

        val dataSource = HikariDataSource(hikariConfig)
        Database.connect(dataSource)
    }
}