package com.kitledger

import io.ktor.server.application.*
import com.kitledger.services.database.DatabaseFactory
import com.kitledger.services.database.Migration

/*fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}*/

fun Application.module() {
    Migration.run()
    DatabaseFactory.init()
    configureRouting()
}
