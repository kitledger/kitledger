package com.kitledger.services.http.handlers

import com.kitledger.services.http.middleware.JWTAuthPlugin
import io.ktor.server.routing.*
import io.ktor.server.response.*

/**
 * Middleware stack for the API v1 routes.
 * @param body the route configuration.
 */
fun Route.v1ApiMiddlewareStack(body: Route.() -> Unit) {
    install(JWTAuthPlugin)
    body()
}

/**
 * Configures the API v1 router.
 */
fun Route.apiV1Routing() {
    route("/api/v1") {
        v1ApiMiddlewareStack {

            get("/") {
                call.respondText("Welcome to the Kitledger API!")
            }

            post("/accounts") {
                call.respondText("Hello from POST /api/v1/accounts")
            }

            post("/entity-models") {
                call.respondText("Hello from POST /api/v1/entity-models")
            }

            post("/ledgers") {
                call.respondText("Hello from POST /api/v1/ledgers")
            }

            post("/transaction-models") {
                call.respondText("Hello from POST /api/v1/transaction-models")
            }

            post("/unit-models") {
                call.respondText("Hello from POST /api/v1/unit-models")
            }
        }
    }
}