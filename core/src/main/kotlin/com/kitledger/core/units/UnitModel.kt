package com.kitledger.core.units

enum class UnitModelStatus {
    ACTIVE, INACTIVE
}

data class UnitModel @JvmOverloads constructor(
    val refId: String,
    val name: String,
    val altId: String? = null,
    val status: UnitModelStatus = UnitModelStatus.ACTIVE
)