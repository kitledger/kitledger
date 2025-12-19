package com.kitledger.dev

import com.kitledger.core.KitLedger
import com.kitledger.core.entities.EntityModel
import com.kitledger.core.transactions.TransactionModel
import com.kitledger.server.KitledgerServer
import org.http4k.server.Netty
import org.http4k.server.asServer

fun main() {
    val transactionModels = listOf(
        TransactionModel<Map<String, Any>>(refId = "INVOICE", name = "Invoice")
    )

    val entityModels = listOf(
        EntityModel(refId = "CUSTOMER", name = "Customer")
    )

    val config = KitLedger.defineConfig(
        transactionModels = transactionModels,
        entityModels = entityModels
    )

    val handler = KitledgerServer.create(config)

    println("Starting server on port 3000...")
    handler.asServer(Netty(3000)).start()
}