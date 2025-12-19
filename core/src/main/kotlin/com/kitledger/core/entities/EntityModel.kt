package com.kitledger.core.entities

enum class EntityModelStatus {
    ACTIVE, INACTIVE
}

data class EntityModel @JvmOverloads constructor(
    val refId: String,
    val name: String,
    val altId: String? = null,
    val status: EntityModelStatus = EntityModelStatus.ACTIVE
)