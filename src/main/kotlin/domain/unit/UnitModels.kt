@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.unit

import com.kitledger.services.validation.*
import java.util.*
import kotlin.time.ExperimentalTime
import kotlin.time.Instant



/**
 * Unit Model used for Inserts
 */
data class UnitModelInsert(
    val refId: String,
    val altId: String?,
    val name: String,
    val active: Boolean,
)

/**
 * Unit Model used for Queries and Select
 */
data class UnitModel(
    val id: UUID,
    val refId: String,
    val altId: String?,
    val name: String,
    val active: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant,
)

