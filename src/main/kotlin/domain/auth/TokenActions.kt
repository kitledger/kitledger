@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import com.kitledger.services.utils.generateUuidV7
import com.kitledger.services.database.ApiTokensTable
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.r2dbc.insert
import kotlin.time.ExperimentalTime
import kotlin.time.Clock
import java.util.UUID

suspend fun createToken(userId: UUID, name: String = "Api Token") :ApiToken? {

    try {
        val tokenId = generateUuidV7()

        val apiTokenResult = ApiTokensTable.insert {
            it[ApiTokensTable.id] = tokenId
            it[ApiTokensTable.userId] = userId
            it[ApiTokensTable.name] = name
            it[createdAt] = Clock.System.now()
        }

        val apiToken = apiTokenResult.resultedValues?.get(0)?.toApiToken()

        return apiToken
    }

    catch (e: Exception) {
        return null
    }
}

fun ResultRow.toApiToken(): ApiToken {
    return ApiToken(
        id = this[ApiTokensTable.id],
        userId = this[ApiTokensTable.userId],
        name = this[ApiTokensTable.name],
        createdAt = this[ApiTokensTable.createdAt],
        revokedAt = this[ApiTokensTable.revokedAt],
    )
}