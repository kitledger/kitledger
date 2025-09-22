package com.kitledger.services.database

import org.jetbrains.exposed.v1.r2dbc.R2dbcDatabase
import io.r2dbc.pool.ConnectionPool
import io.r2dbc.pool.ConnectionPoolConfiguration
import io.r2dbc.spi.ConnectionFactories
import com.kitledger.services.config.AppConfig
import java.time.Duration

object DatabaseFactory {
    fun init() {
        val config = AppConfig.dbConfig
        val dbUrl = if (config.ssl) "${config.url}?ssl=true" else config.url
        val connectionFactory = ConnectionFactories.get(dbUrl)

        val poolConfiguration = ConnectionPoolConfiguration.builder(connectionFactory)
            .maxSize(config.max)
            .initialSize(5)
            .maxIdleTime(Duration.ofMinutes(10))
            .validationQuery("SELECT 1")
            .build()

        val pool = ConnectionPool(poolConfiguration)

        R2dbcDatabase.connect { pool }
    }
}