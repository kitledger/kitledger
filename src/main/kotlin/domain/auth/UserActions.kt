package com.kitledger.domain.auth

import kotlin.random.Random
import com.kitledger.services.utils.generateUuidV7

suspend fun createSuperUser(firstName: String, lastName: String, email: String) : Result<String> {

    try {
        val randomPassword = generateRandomPassword()

        if(randomPassword.isEmpty()) {
            throw RuntimeException("Failed to generate random password")
        }

        val hashedPassword = hashPassword(randomPassword)

        val userId = generateUuidV7()

        return Result.success(userId.toString())
    }

    catch (e: Exception) {
        return Result.failure(e)
    }
}

private fun generateRandomPassword(length: Int = 20) : String {
    val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9') + "!@#$%^&*()_+-=".toList()

    val passwordBuilder = StringBuilder(length)

    for (i in 0 until length) {
        passwordBuilder.append(charPool[Random.nextInt(charPool.size)])
    }

    return passwordBuilder.toString()
}