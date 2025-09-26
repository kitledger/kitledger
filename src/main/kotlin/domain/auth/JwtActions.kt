package com.kitledger.domain.auth

import com.kitledger.services.config.AppConfig
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.auth0.jwt.interfaces.DecodedJWT
import java.util.UUID

data class JwtPayload(
    val tokenType: TokenType,
    val tokenId: UUID,
)


fun signToken(tokenType :TokenType, tokenId :UUID) :String? {

    try {
        val currentSecret = AppConfig.authConfig.secret
        val algorithm = Algorithm.HMAC256(currentSecret)
        val token = JWT.create()
            .withClaim("tokenType", tokenType.toString())
            .withClaim("tokenId", tokenId.toString())
            .sign(algorithm)

        return token
    }

    catch (e: Exception) {
        return null
    }
}

fun verifyToken(token: String): JwtPayload? {
    val allSecrets = listOf(AppConfig.authConfig.secret) + AppConfig.authConfig.pastSecrets

    val decodedJwt: DecodedJWT? = allSecrets.firstNotNullOfOrNull { secret ->
        try {
            val algorithm = Algorithm.HMAC256(secret)
            JWT.require(algorithm).build().verify(token)
        } catch (e: JWTVerificationException) {
            null
        }
    }

    if (decodedJwt == null) {
        return null
    }

    return try {
        val tokenId = decodedJwt.getClaim("tokenId").asString()
        val tokenType = decodedJwt.getClaim("tokenType").asString()

        if (tokenId == null || tokenType == null) {
            return null
        }

        JwtPayload(
            tokenId = UUID.fromString(tokenId),
            tokenType = TokenType.valueOf(tokenType)
        )
    } catch (e: Exception) {
        null
    }
}



