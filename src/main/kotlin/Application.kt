package com.kitledger

import io.ktor.server.application.*
import com.kitledger.services.database.DatabaseFactory
import com.kitledger.services.database.Migration
import org.graalvm.polyglot.Context

/*fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}*/

fun Application.module() {

    val context = Context.create()
    val script = "console.log('Hello from GraalJS!')"
    context.eval("js", script)

    Migration.run()
    DatabaseFactory.init()
    configureRouting()
}
