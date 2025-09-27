@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import com.kitledger.services.utils.generateUuidV7
import com.kitledger.services.database.SessionsTable
import com.kitledger.services.config.AppConfig
import kotlinx.coroutines.flow.firstOrNull
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.r2dbc.insert
import org.jetbrains.exposed.v1.r2dbc.select
import java.util.UUID
import kotlin.time.ExperimentalTime
import kotlin.time.Clock
import kotlin.time.Duration.Companion.seconds

suspend fun getSessionUserId(sessionId: UUID) :UUID? {
    val sessionResult = SessionsTable.select(SessionsTable.userId)
        .where { SessionsTable.id eq sessionId }
        .firstOrNull()

    val userId = sessionResult?.get(SessionsTable.userId)

    return userId
}

suspend fun startSession(userId: UUID) : Session? {

    try {
        val sessionConfig = AppConfig.sessionConfig
        val sessionId = generateUuidV7()
        val sessionResult = SessionsTable.insert {
            it[SessionsTable.id] = sessionId
            it[SessionsTable.userId] = userId
            it[createdAt] = Clock.System.now()
            it[expiresAt] = Clock.System.now().plus(sessionConfig.ttl.seconds)
        }

        val session = sessionResult.resultedValues?.get(0)?.toSession()

        return session
    }

    catch (e: Exception) {
        return null
    }
}

fun ResultRow.toSession(): Session {
    return Session(
        id = this[SessionsTable.id],
        userId = this[SessionsTable.userId],
        createdAt = this[SessionsTable.createdAt],
        expiresAt = this[SessionsTable.expiresAt],
    )
}