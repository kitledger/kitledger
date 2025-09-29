package com.kitledger.services.validation

data class ValidationError(
    val type: String,
    val path: String?,
    val message: String
)

sealed class ValidationResult<out T> {
    data class Success<out T>(val data: T) : ValidationResult<T>()
    data class Failure(val errors: List<ValidationError>) : ValidationResult<Nothing>()
}