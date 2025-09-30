package com.kitledger

import com.kitledger.services.cli.execute
import com.kitledger.services.config.AppConfig
import com.kitledger.services.database.DatabaseFactory
import com.kitledger.services.database.Migration
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import org.graalvm.polyglot.Context

suspend fun main(args: Array<String>) {

    /**
     * Run the database migrations
     */
    Migration.run()

    /**
     * Initialize the database connection
     */
    DatabaseFactory.init()

    if (args.isEmpty() || args[0] == "serve") {
        // Start the server
        embeddedServer(Netty, port = AppConfig.serverConfig.port, host = "0.0.0.0") {
            module(AppConfig)
        }.start(wait = true)
    } else {
        execute(args)
    }
}

/**
 * Extension function for the main Module
 * @param config the application configuration
 * @receiver Application
 */
fun Application.module(config: AppConfig) {

    install(ContentNegotiation) {
        json()
    }

    val context = Context.create("js")

    val script = """
        console.log('Hello from KitActions');
    """

    context.eval("js", script)

    configureRouting()
}
