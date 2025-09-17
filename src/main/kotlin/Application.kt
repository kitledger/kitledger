package com.kitledger

import io.ktor.server.application.*
import com.kitledger.services.database.DatabaseFactory

fun main(args: Array<String>) {
    DatabaseFactory.init()
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureRouting()
}
