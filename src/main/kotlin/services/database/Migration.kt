package com.kitledger.services.database

import org.flywaydb.core.Flyway
import com.kitledger.services.config.AppConfig

object Migration {
    fun run() {
        val config = AppConfig.dbConfig

        val flyway = Flyway.configure()
            .dataSource(config.url, null, null)
            .locations("classpath:db/migration")
            .table("schema_history")
            .load()

        flyway.migrate()

        println("Database migration finished.")
    }
}