package com.kitledger.services.config

// 1) Define the types

/**
 * Represents the Authentication configuration for the application.
 */
data class AuthConfig(
    val secret: String,
    val pastSecrets: List<String>,
)

/**
 * Represents the CORS configuration for the application.
 */
data class CorsConfig(
    val origin: List<String>?,
    val allowMethods: List<String>?,
    val allowHeaders: List<String>?,
    val maxAge: Long?,
    val credentials: Boolean?,
    val exposeHeaders: List<String>?
)

/**
 * Represents the database configuration for the application.
 */
data class DbConfig(
    val url: String,
    val max: Int
)

/**
 * Represents the HTTP server configuration for the application.
 */
data class ServerConfig(
    val port: Int,
    val cors: CorsConfig
)

/**
 * Represents the session configuration for the application.
 */
data class SessionConfig(
    val ttl: Long
)

// 2) Define the logic for complex values.
object AppConfig {

    // Authentication secrets configuration values and defaults.

    private val authSecret: String = System.getenv("KL_AUTH_SECRET")
        ?: throw Error("KL_AUTH_SECRET environment variable is not set.")

    private val pastSecrets: List<String> = System.getenv("KL_AUTH_PAST_SECRETS")?.split(",") ?: emptyList()

    // CORS configuration values and defaults.
    private val corsDefaultHeaders = listOf("Content-Type", "Authorization", "X-Requested-With")

    private val corsAllowedHeaders: List<String> = buildSet {
        addAll(corsDefaultHeaders)
        System.getenv("KL_CORS_ALLOWED_HEADERS")?.split(",")?.let { addAll(it) }
    }.toList()

    private val corsAllowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")

    private val corsAllowedOrigins: List<String> = System.getenv("KL_CORS_ALLOWED_ORIGINS")?.split(",") ?: emptyList()

    private val corsCredentials = false

    private val corsExposeHeaders: List<String> = emptyList()

    private val corsMaxAge = System.getenv("KL_CORS_MAX_AGE")?.toLongOrNull() ?: 86400L

    // Session configuration values and defaults.
    private val sessionTtl = System.getenv("KL_SESSION_TTL")?.toLongOrNull() ?: 3600L

    // 3) Export the configuration objects.
    @JvmStatic
    val authConfig: AuthConfig by lazy {
        AuthConfig(
            secret = authSecret,
            pastSecrets = pastSecrets,
        )
    }

    @JvmStatic
    val dbConfig: DbConfig by lazy {
        DbConfig(
            url = System.getenv("KL_POSTGRES_URL") ?: "jdbc:postgres://localhost:5432/kitledger",
            max = System.getenv("KL_POSTGRES_MAX_CONNECTIONS")?.toIntOrNull() ?: 10
        )
    }

    @JvmStatic
    val serverConfig: ServerConfig by lazy {
        ServerConfig(
            port = System.getenv("KL_SERVER_PORT")?.toIntOrNull() ?: 8888,
            cors = CorsConfig(
                origin = corsAllowedOrigins,
                allowMethods = corsAllowedMethods,
                allowHeaders = corsAllowedHeaders,
                exposeHeaders = corsExposeHeaders,
                credentials = corsCredentials,
                maxAge = corsMaxAge
            )
        )
    }

    @JvmStatic
    val sessionConfig: SessionConfig by lazy {
        SessionConfig(
            ttl = sessionTtl
        )
    }
}