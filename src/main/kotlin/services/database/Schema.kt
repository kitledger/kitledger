@file:OptIn(ExperimentalTime::class)

package com.kitledger.services.database

import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.*
import org.jetbrains.exposed.v1.json.jsonb
import kotlinx.serialization.json.Json
import java.util.UUID
import kotlin.time.ExperimentalTime

// Enums and Custom Types
enum class BalanceType {
    DEBIT, CREDIT
}

typealias BaseMetaProperty = Map<String, Any?>

// Tables

object Accounts : Table("accounts") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val balanceType = customEnumeration(
        "balance_type",
        "varchar(10)",
        { value -> BalanceType.valueOf(value as String) },
        { BalanceType.valueOf(it.name) }
    )
    val ledgerId = uuid("ledger_id")
    val parentId = uuid("parent_id").nullable()
    val name = varchar("name", 64)
    val meta: Column<BaseMetaProperty?> = jsonb<BaseMetaProperty>("meta", Json).nullable()
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object ApiTokens : Table("api_tokens") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val name = varchar("name", 64)
    val revokedAt = timestamp("revoked_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object EntityModels : Table("entity_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object Ledgers : Table("ledgers") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val unitModelId = uuid("unit_model_id")
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object PermissionAssignments : Table("permission_assignments") {
    val id: Column<UUID> = uuid("id")
    val permissionId = uuid("permission_id")
    val userId = uuid("user_id").nullable()
    val roleId = uuid("role_id").nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object Permissions : Table("permissions") {
    val id: Column<UUID> = uuid("id")
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object Roles : Table("roles") {
    val id: Column<UUID> = uuid("id")
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object Sessions : Table("sessions") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val token = varchar("token", 64)
    val createdAt = timestamp("created_at")
    val expiresAt = timestamp("expires_at")
}

object SystemPermissions : Table("system_permissions") {
    val id: Column<UUID> = uuid("id")
    val permission = varchar("permission", 64)
    val userId = uuid("user_id")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object TransactionModels : Table("transaction_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object UnitModels : Table("unit_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val baseUnitId = uuid("base_unit_id").nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object Users : Table("users") {
    val id: Column<UUID> = uuid("id")
    val firstName = varchar("first_name", 64)
    val lastName = varchar("last_name", 64)
    val email = varchar("email", 64)
    val passwordHash = text("password_hash")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object UserRoles : Table("user_roles") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val roleId = uuid("role_id")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    val deletedAt = timestamp("deleted_at").nullable()
    override val primaryKey = PrimaryKey(id)
}