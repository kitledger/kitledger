package com.kitledger.core

import com.kitledger.core.entities.EntityModel
import com.kitledger.core.transactions.TransactionModel

data class KitledgerConfig(
    val transactionModels: List<TransactionModel<*>>,
    val entityModels: List<EntityModel>
)

object KitLedger {
    @JvmStatic
    fun defineConfig(
        transactionModels: List<TransactionModel<*>>,
        entityModels: List<EntityModel>
    ): KitledgerConfig = KitledgerConfig(transactionModels, entityModels)
}