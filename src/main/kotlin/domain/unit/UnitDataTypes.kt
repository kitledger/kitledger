@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.unit

import java.util.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.Contextual
import kotlin.time.ExperimentalTime
import kotlin.time.Instant



/**
 * Unit Model used for Inserts
 */
@Serializable
data class UnitModelInsert(
    val refId: String,
    val altId: String?,
    val name: String,
    val active: Boolean?,
)

/**
 * Unit Model used for Queries and Select
 */
@Serializable
data class UnitModel(
    @Contextual
    val id: UUID,
    val refId: String,
    val altId: String?,
    val name: String,
    val active: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant,
)

