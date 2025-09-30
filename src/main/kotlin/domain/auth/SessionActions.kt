@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import com.kitledger.services.config.AppConfig
import com.kitledger.services.database.SessionsTable
import com.kitledger.services.utils.generateUuidV7
import kotlinx.coroutines.flow.firstOrNull
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.r2dbc.insert
import org.jetbrains.exposed.v1.r2dbc.select
import java.util.*
import kotlin.time.Clock
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime

/**
 * Retrieves the userId associated with a session.
 * @param sessionId the session ID.
 * @return the user ID, or null if the session does not exist.
 */
suspend fun getSessionUserId(sessionId: UUID): UUID? {
    val sessionResult = SessionsTable.select(SessionsTable.userId)
        .where { SessionsTable.id eq sessionId }
        .firstOrNull()

    val userId = sessionResult?.get(SessionsTable.userId)

    return userId
}

/**
 * Starts a new session for a user.
 * @param userId the user ID.
 * @return the session, or null if it could not be started.
 */
suspend fun startSession(userId: UUID): Session? {

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
    } catch (e: Exception) {
        return null
    }
}

/**
 * Converts a result row to a session.
 */
fun ResultRow.toSession(): Session {
    return Session(
        id = this[SessionsTable.id],
        userId = this[SessionsTable.userId],
        createdAt = this[SessionsTable.createdAt],
        expiresAt = this[SessionsTable.expiresAt],
    )
}