package com.kitledger.services.database

import org.jetbrains.exposed.v1.r2dbc.R2dbcDatabase
import com.kitledger.services.config.AppConfig

object DatabaseFactory {
    fun init() {
        val config = AppConfig.dbConfig
        val dbUrl = if (config.ssl) "${config.url}?ssl=true" else config.url

        R2dbcDatabase.connect(
            url = dbUrl,
            driver = "postgresql",
        )
    }
}