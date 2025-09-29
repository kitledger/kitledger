package com.kitledger.services.http.middleware

import io.ktor.server.application.*
import io.ktor.http.*
import com.kitledger.domain.auth.verifyToken
import com.kitledger.domain.auth.getSessionUserFromJwtPayload
import io.ktor.server.auth.authentication

/**
 * Represents the JWT authentication plugin.
 */
val JWTAuthPlugin = createRouteScopedPlugin(name = "JWTAuthPlugin") {
    onCall { call ->
        try {
            val authHeader = call.request.headers[HttpHeaders.Authorization]
            val token = authHeader?.removePrefix("Bearer ") ?: throw AuthorizationException("Missing Authorization header")
            val verifiedToken = verifyToken(token) ?: throw AuthorizationException("Invalid token")
            val sessionUser = getSessionUserFromJwtPayload(verifiedToken) ?: throw AuthorizationException("Invalid token")

            val httpPrincipal = HttpPrincipal(sessionUser)

            // Add to principal 
            call.authentication.principal(httpPrincipal)
        }

        catch(e : Throwable) {
            throw AuthorizationException("Invalid or missing Authorization header")
        }
    }
}