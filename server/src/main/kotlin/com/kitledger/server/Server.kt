package com.kitledger.server

import com.kitledger.core.KitledgerConfig
import org.http4k.core.HttpHandler
import org.http4k.routing.bind
import org.http4k.routing.routes

object KitledgerServer {
    @JvmStatic
    fun create(config: KitledgerConfig): HttpHandler {
        return routes(
            "/__kitledger_data" bind { req ->
                // Handle data requests using the config
                org.http4k.core.Response(org.http4k.core.Status.OK).body("KitLedger API")
            }
        )
    }
}