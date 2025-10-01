@file:OptIn(ExperimentalTime::class)
package com.kitledger.domain.unit

import com.kitledger.services.database.UnitModelsTable
import org.jetbrains.exposed.v1.core.ResultRow
import kotlin.time.ExperimentalTime

fun ResultRow.toUnitModel() : UnitModel {
    return UnitModel(
        id = this[UnitModelsTable.id],
        refId = this[UnitModelsTable.refId],
        altId = this[UnitModelsTable.altId],
        name = this[UnitModelsTable.name],
        active = this[UnitModelsTable.active],
        createdAt = this[UnitModelsTable.createdAt],
        updatedAt = this[UnitModelsTable.updatedAt]
    )
}