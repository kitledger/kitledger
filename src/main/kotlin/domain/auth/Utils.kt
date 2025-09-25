package com.kitledger.domain.auth

import de.mkammerer.argon2.Argon2
import de.mkammerer.argon2.Argon2Factory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

suspend fun hashPassword(password: String): String {
    return withContext(Dispatchers.Default) {
        val argon2: Argon2 = Argon2Factory.create()
        try {
            argon2.hash(10, 65536, 1, password.toCharArray())
        } finally {
            argon2.wipeArray(password.toCharArray())
        }
    }
}