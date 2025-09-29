@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import com.kitledger.services.utils.generateUuidV7
import com.kitledger.services.database.UsersTable
import com.kitledger.services.database.SystemPermissionsTable
import kotlinx.coroutines.flow.firstOrNull
import kotlin.random.Random
import org.jetbrains.exposed.v1.r2dbc.transactions.suspendTransaction
import org.jetbrains.exposed.v1.core.ResultRow
import org.jetbrains.exposed.v1.r2dbc.*
import org.jetbrains.exposed.v1.core.eq
import kotlin.time.ExperimentalTime
import kotlin.time.Clock


/**
 * Creates a super user (System or Root User) with complete system permissions.
 * @param firstName the user's first name.
 * @param lastName the user's last name.
 * @param email the user's email.
 * @return a result type with the NewSuperUser object on success, or an exception on failure.
 */
suspend fun createSuperUser(firstName: String, lastName: String, email: String) : Result<NewSuperUser> {

    try {
        val randomPassword = generateRandomPassword()

        if(randomPassword.isEmpty()) {
            throw RuntimeException("Failed to generate random password")
        }

        val hashedPassword = hashPassword(randomPassword)
        val userId = generateUuidV7()

        val superUser = suspendTransaction {
            val userResult = UsersTable.insert {
                it[UsersTable.id] = userId
                it[UsersTable.firstName] = firstName
                it[UsersTable.lastName] = lastName
                it[UsersTable.email] = email
                it[UsersTable.passwordHash] = hashedPassword
                it[UsersTable.createdAt] = Clock.System.now()
                it[UsersTable.updatedAt] = Clock.System.now()
            }

            val user = userResult.resultedValues?.get(0)?.toUser()
                ?: throw IllegalStateException("Failed to insert user")

            SystemPermissionsTable.insert {
                it[SystemPermissionsTable.id] = generateUuidV7()
                it[SystemPermissionsTable.permission] = SystemPermissionEnum.KL_SYSTEM_ADMIN
                it[SystemPermissionsTable.userId] = user.id
                it[SystemPermissionsTable.createdAt] = Clock.System.now()
                it[SystemPermissionsTable.updatedAt] = Clock.System.now()
            }

            val apiToken = createToken(userId) ?: throw IllegalStateException("Failed to create API token")
            val tokenId = apiToken.id

            val signedToken = signToken(TokenType.API, tokenId) ?: throw IllegalStateException("Failed to sign token")

            NewSuperUser(
                userId,
                firstName,
                lastName,
                email,
                randomPassword,
                signedToken
            )
        }

        return Result.success(superUser)
    }

    catch (e: Exception) {
        return Result.failure(e)
    }
}

/**
 * Generates a random password.
 * @param length the length of the password.
 * @return the password as a string.
 */
private fun generateRandomPassword(length: Int = 20) : String {
    val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9') + "!@#$%^&*()_+-=".toList()

    val passwordBuilder = StringBuilder(length)

    for (i in 0 until length) {
        passwordBuilder.append(charPool[Random.nextInt(charPool.size)])
    }

    return passwordBuilder.toString()
}

/**
 * Retrieves a session user from a JWT payload.
 * @param jwt the JWT payload.
 * @return the session user, or null if it could not be retrieved.
 */
suspend fun getSessionUserFromJwtPayload(jwt: JwtPayload) : SessionUser? {
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

            val userResult = UsersTable.selectAll().where { UsersTable.id eq userId }.firstOrNull() ?: return@suspendTransaction null

            return@suspendTransaction userResult.toSessionUser()
        }
    }

    catch (e: Exception) {
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
fun ResultRow.toSessionUser() : SessionUser {
    return SessionUser(
        id = this[UsersTable.id],
        firstName = this[UsersTable.firstName],
        lastName = this[UsersTable.lastName],
        email = this[UsersTable.email],
        createdAt = this[UsersTable.createdAt]
    )
}