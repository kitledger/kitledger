package com.kitledger.services.http.handlers

import com.kitledger.services.http.middleware.JWTAuthPlugin
import com.kitledger.domain.unit.UnitModelInsert
import com.kitledger.domain.unit.createUnitModel
import com.kitledger.services.validation.ActionResult
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.response.*
import io.ktor.server.routing.*

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

                try {
                    val insertData = call.receive<UnitModelInsert>()

                    val result = createUnitModel(insertData)

                    when (result) {
                        is ActionResult.Success -> {
                            call.respond(HttpStatusCode.Created, result.data)
                        }

                        is ActionResult.ValidationFailure -> {
                            call.respond(
                                HttpStatusCode.BadRequest,
                                mapOf("errors" to result.errors)
                            )
                        }

                        is ActionResult.ActionFailure ->  {
                            throw Exception(result.message)
                        }
                    }
                }

                catch(e: Exception) {
                    call.respond(
                        HttpStatusCode.InternalServerError,
                        mapOf("error" to "${e.message}")
                    )
                }
            }
        }
    }
}