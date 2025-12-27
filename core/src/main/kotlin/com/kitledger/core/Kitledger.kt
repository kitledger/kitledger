package com.kitledger.core

import com.kitledger.core.entities.EntityModel
import com.kitledger.core.transactions.TransactionModel
import com.kitledger.core.units.UnitModel

data class KitledgerConfig(
    val entityModels: List<EntityModel>,
    val transactionModels: List<TransactionModel<*>>,
    val unitModels: List<UnitModel>
)

object KitLedger {
    @JvmStatic
    fun defineConfig(
        entityModels: List<EntityModel>,
        transactionModels: List<TransactionModel<*>>,
        unitModels: List<UnitModel>
    ): KitledgerConfig {
        return KitledgerConfig(
            entityModels,
            transactionModels,
            unitModels
        )
    }
}