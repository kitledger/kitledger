package com.kitledger

import com.kitledger.services.database.DatabaseFactory
import com.kitledger.services.database.Migration
import com.kitledger.services.config.AppConfig
import com.kitledger.services.cli.execute
import io.ktor.server.application.*
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.graalvm.polyglot.Context
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

suspend fun main(args: Array<String>) {

    // Run database migrations
    Migration.run()

    // Setup a DB connection pool with R2DBC
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

fun Application.module(config : AppConfig) {

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
