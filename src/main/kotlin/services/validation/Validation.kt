package com.kitledger.services.validation

import io.konform.validation.ValidationResult as KonformValidationResult
import io.konform.validation.Valid
import io.konform.validation.Invalid

enum class ValidationErrorType {
    DATA,
    STRUCTURE
}

/**
 * Represents a validation error.
 */
data class ValidationError(
    val type: ValidationErrorType,
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

fun <T> KonformValidationResult<T>.toNativeValidationResult(): ValidationResult<T> {
    return when (this) {
        is Valid -> ValidationResult.Success(this.value)

        is Invalid -> {
            val nativeErrors = this.errors.map { konformError ->
                ValidationError(
                    type = ValidationErrorType.DATA,
                    path = konformError.dataPath.ifEmpty { null }, // Use null for root-level errors
                    message = konformError.message
                )
            }
            ValidationResult.Failure(nativeErrors)
        }
    }
}

sealed interface ActionResult<out T> {
    /** The action was successful and returned data. */
    data class Success<out T>(val data: T) : ActionResult<T>

    /** The action was not attempted because the input data was invalid. */
    data class ValidationFailure(val errors: List<ValidationError>) : ActionResult<Nothing>

    /** The action was attempted but failed during execution (e.g., database error). */
    data class ActionFailure(val message: String) : ActionResult<Nothing>
}