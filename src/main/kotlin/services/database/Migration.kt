package com.kitledger.services.database

import com.kitledger.services.config.AppConfig
import org.flywaydb.core.Flyway

/**
 * Runs database migrations.
 */
object Migration {
    fun run() {
        val config = AppConfig.dbConfig
        val jdbcUrl = convertR2dbcToJdbc(config.url)

        val flyway = Flyway.configure()
            .dataSource(jdbcUrl, null, null)
            .locations("classpath:db/migration")
            .table("schema_history")
            .load()

        flyway.migrate()

        println("Database migration finished.")
    }

    /**
     * Converts a R2DBC URL to a JDBC URL.
     * @param r2dbcUrl the R2DBC URL to convert.
     * @return the converted JDBC URL as a string.
     */
    private fun convertR2dbcToJdbc(r2dbcUrl: String): String {
        if (!r2dbcUrl.startsWith("r2dbc:")) {
            throw IllegalArgumentException("URL must start with 'r2dbc:': $r2dbcUrl")
        }

        val coreUrl = r2dbcUrl.substringAfter("r2dbc:")
        val parts = coreUrl.split("://", limit = 2)
        if (parts.size != 2) {
            throw IllegalArgumentException("Invalid R2DBC URL format: missing '://'")
        }

        val driver = parts[0].split(':').last()
        val connectionDetails = parts[1].substringBefore('?')
        val originalQuery = parts[1].substringAfter('?', "")

        val userInfo: String?
        val hostAndPath: String

        val atIndex = connectionDetails.lastIndexOf('@')
        if (atIndex != -1) {
            userInfo = connectionDetails.take(atIndex)
            hostAndPath = connectionDetails.substring(atIndex + 1)
        } else {
            userInfo = null
            hostAndPath = connectionDetails
        }

        val baseUrl = "jdbc:$driver://$hostAndPath"
        val queryParams = mutableListOf<String>()

        userInfo?.split(':', limit = 2)?.let { userPass ->
            if (userPass.isNotEmpty() && userPass[0].isNotBlank()) {
                queryParams.add("user=${userPass[0]}")
            }
            if (userPass.size > 1 && userPass[1].isNotBlank()) {
                queryParams.add("password=${userPass[1]}")
            }
        }

        val r2dbcOnlyParams = setOf("maxSize", "initialSize", "validationQuery")
        if (originalQuery.isNotBlank()) {
            originalQuery.split('&')
                .filter { param ->
                    val key = param.substringBefore('=')
                    key !in r2dbcOnlyParams
                }
                .forEach { param ->
                    queryParams.add(param)
                }
        }

        if (queryParams.isEmpty()) {
            return baseUrl
        }

        return "$baseUrl?${queryParams.joinToString("&")}"
    }
}