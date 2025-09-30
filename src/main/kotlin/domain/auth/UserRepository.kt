@file:OptIn(ExperimentalTime::class)
package com.kitledger.domain.auth

import com.kitledger.services.database.SystemPermissionsTable
import com.kitledger.services.database.UsersTable
import kotlinx.coroutines.flow.firstOrNull
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.core.eq
import org.jetbrains.exposed.v1.r2dbc.selectAll
import org.jetbrains.exposed.v1.r2dbc.transactions.suspendTransaction
import kotlin.time.ExperimentalTime

/**
 * Retrieves a session user from a JWT payload.
 * @param jwt the JWT payload.
 * @return the session user, or null if it could not be retrieved.
 */
suspend fun getSessionUserFromJwtPayload(jwt: JwtPayload): SessionUser? {
    return try {
        suspendTransaction {
            val userId = when (jwt.tokenType) {
                TokenType.API -> {
                    getTokenUserId(jwt.tokenId) ?: return@suspendTransaction null
                }

                TokenType.SESSION -> {
                    getSessionUserId(jwt.tokenId) ?: return@suspendTransaction null
                }
            }

            val userResult =
                UsersTable.selectAll().where { UsersTable.id eq userId }.firstOrNull() ?: return@suspendTransaction null

            return@suspendTransaction userResult.toSessionUser()
        }
    } catch (e: Exception) {
        println(e.toString())
        return null;
    }
}

/**
 * Converts a result row to a user.
 */
fun ResultRow.toUser(): User {
    return User(
        id = this[UsersTable.id],
        firstName = this[UsersTable.firstName],
        lastName = this[UsersTable.lastName],
        email = this[UsersTable.email],
        passwordHash = this[UsersTable.passwordHash],
        createdAt = this[UsersTable.createdAt],
        updatedAt = this[UsersTable.updatedAt],
    )
}

/**
 * Converts a result row to a system permission.
 */
fun ResultRow.toSystemPermission(): SystemPermission {
    return SystemPermission(
        id = this[SystemPermissionsTable.id],
        permission = this[SystemPermissionsTable.permission],
        userId = this[SystemPermissionsTable.userId],
        createdAt = this[SystemPermissionsTable.createdAt],
        updatedAt = this[SystemPermissionsTable.updatedAt],
    )
}

/**
 * Converts a result row to a session user.
 */
fun ResultRow.toSessionUser(): SessionUser {
    return SessionUser(
        id = this[UsersTable.id],
        firstName = this[UsersTable.firstName],
        lastName = this[UsersTable.lastName],
        email = this[UsersTable.email],
        createdAt = this[UsersTable.createdAt]
    )
}