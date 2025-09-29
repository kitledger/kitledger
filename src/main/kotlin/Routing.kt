package com.kitledger

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.statuspages.*
import com.kitledger.services.http.middleware.*
import com.kitledger.services.http.handlers.apiV1Routing

fun Application.configureRouting() {
    routing {

        install(StatusPages) {
            // Handle Authorization errors (403)
            exception<AuthorizationException> { call, cause ->
                call.respond(HttpStatusCode.Forbidden, mapOf("error" to (cause.message ?: "Access denied")))
            }

            // Handle Validation errors (422)
            exception<ValidationException> { call, cause ->
                call.respond(HttpStatusCode.UnprocessableEntity, mapOf("errors" to cause.errors))
            }

            exception<Throwable> { call, cause ->
                call.respond(
                    HttpStatusCode.InternalServerError,
                    mapOf("error" to "An unexpected error occurred")
                )
            }
        }

        get("/") {
            call.respondText("Hello World!")
        }

        apiV1Routing()
    }
}
