package com.kitledger

import io.ktor.server.application.*
import com.kitledger.services.database.DatabaseFactory
import com.kitledger.services.database.Migration
import com.kitledger.services.config.AppConfig
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import org.graalvm.polyglot.Context

fun main() {
    embeddedServer(Netty, port = AppConfig.serverConfig.port, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {

    val context = Context.create("js")

    val script = """
        console.log('Hello from KitActions');
    """

    context.eval("js", script)

    //Migration.run()
    DatabaseFactory.init()
    configureRouting()
}
