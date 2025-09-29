package com.kitledger.services.database

import org.jetbrains.exposed.v1.r2dbc.R2dbcDatabase
import com.kitledger.services.config.AppConfig

/**
 * Creates a database connection.
 * @return the database connection.
 */
object DatabaseFactory {
    fun init() {
        val config = AppConfig.dbConfig

        val queryParams = mutableListOf<String>()

        if (!config.url.contains("maxSize=")) {
            queryParams.add("maxSize=${config.max}")
        }
        if (!config.url.contains("initialSize=")) {
            queryParams.add("initialSize=5")
        }
        if (!config.url.contains("validationQuery=")) {
            queryParams.add("validationQuery=SELECT%201")
        }

        val finalUrl = if (queryParams.isNotEmpty()) {
            val separator = if (config.url.contains("?")) "&" else "?"
            config.url + separator + queryParams.joinToString("&")
        } else {
            config.url
        }

        R2dbcDatabase.connect(
            url = finalUrl,
            driver = "postgresql",
        )
    }
}