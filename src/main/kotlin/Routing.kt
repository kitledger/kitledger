package com.kitledger

import com.kitledger.services.http.handlers.apiV1Routing
import com.kitledger.services.http.middleware.AuthorizationException
import com.kitledger.services.http.middleware.ValidationException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

/**
 * Configures the routing of the application.
 */
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
