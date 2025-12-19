package com.kitledger.core.transactions

import java.time.Instant

enum class TransactionModelStatus {
    ACTIVE, INACTIVE, FROZEN
}

data class Transaction<T>(
    val id: String,
    val modelRefId: String,
    val createdAt: Instant,
    val updatedAt: Instant,
    val data: T
)

fun interface TransactionPipe<T> {
    suspend fun process(transaction: Transaction<T>): Transaction<T>?
}

fun interface TransactionListener<T> {
    suspend fun onEvent(transaction: Transaction<T>)
}

data class TransactionHooks<T> @JvmOverloads constructor(
    val creating: List<TransactionPipe<T>> = emptyList(),
    val updating: List<TransactionPipe<T>> = emptyList(),
    val created: List<TransactionListener<T>> = emptyList(),
    val updated: List<TransactionListener<T>> = emptyList()
)

data class TransactionModel<T> @JvmOverloads constructor(
    val refId: String,
    val name: String,
    val altId: String? = null,
    val status: TransactionModelStatus = TransactionModelStatus.ACTIVE,
    val hooks: TransactionHooks<T>? = null
)