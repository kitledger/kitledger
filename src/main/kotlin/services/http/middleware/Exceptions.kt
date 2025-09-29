package com.kitledger.services.http.middleware

/**
 * Represents an exception that occurs during the authentication and authorization process.
 */
class AuthorizationException(message: String) : Exception(message)

/**
 * Represents an exception that occurs during the input validation process.
 */
data class ValidationException(val errors: Map<String, List<String>>) : Exception("Input validation failed")