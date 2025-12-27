package com.kitledger.dev

import com.kitledger.core.KitLedger
import com.kitledger.core.entities.EntityModel
import com.kitledger.core.transactions.TransactionModel
import com.kitledger.core.units.UnitModel
import com.kitledger.server.KitledgerServer
import org.http4k.server.Netty
import org.http4k.server.asServer

fun main() {
    val entityModels = listOf(
        EntityModel(refId = "CUSTOMER", name = "Customer")
    )

    val transactionModels = listOf(
        TransactionModel<Map<String, Any>>(refId = "INVOICE", name = "Invoice")
    )

    val unitModels = listOf(
        UnitModel(refId = "CURRENCY", name = "Currency")
    )

    val config = KitLedger.defineConfig(
        entityModels = entityModels,
        transactionModels = transactionModels,
        unitModels = unitModels
    )

    val handler = KitledgerServer.create(config)

    println("Starting server on port 3000...")
    handler.asServer(Netty(3000)).start()
}