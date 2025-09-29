package com.kitledger.services.http.middleware

class AuthorizationException(message: String) : Exception(message)

data class ValidationException(val errors: Map<String, List<String>>) : Exception("Input validation failed")