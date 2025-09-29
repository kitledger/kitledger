package com.kitledger.services.validation

/**
 * Represents a validation error.
 */
data class ValidationError(
    val type: String,
    val path: String?,
    val message: String
)

/**
 * Represents the result of a validation.
 */
sealed class ValidationResult<out T> {
    data class Success<out T>(val data: T) : ValidationResult<T>()
    data class Failure(val errors: List<ValidationError>) : ValidationResult<Nothing>()
}