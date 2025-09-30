@file:OptIn(ExperimentalTime::class)

package com.kitledger.services.database

import com.kitledger.domain.auth.SystemPermissionEnum
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.v1.core.Column
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.datetime.timestamp
import org.jetbrains.exposed.v1.json.jsonb
import java.util.*
import kotlin.time.ExperimentalTime

// Enums and Custom Types
enum class BalanceType {
    DEBIT, CREDIT
}

typealias BaseMetaProperty = Map<String, Any?>

// Tables

object AccountsTable : Table("accounts") {
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
    override val primaryKey = PrimaryKey(id)
}

object ApiTokensTable : Table("api_tokens") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val name = varchar("name", 64)
    val createdAt = timestamp("created_at")
    val revokedAt = timestamp("revoked_at").nullable()
    override val primaryKey = PrimaryKey(id)
}

object EntityModelsTable : Table("entity_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object LedgersTable : Table("ledgers") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val unitModelId = uuid("unit_model_id")
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object PermissionAssignmentsTable : Table("permission_assignments") {
    val id: Column<UUID> = uuid("id")
    val permissionId = uuid("permission_id")
    val userId = uuid("user_id").nullable()
    val roleId = uuid("role_id").nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object PermissionsTable : Table("permissions") {
    val id: Column<UUID> = uuid("id")
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object RolesTable : Table("roles") {
    val id: Column<UUID> = uuid("id")
    val name = varchar("name", 64)
    val description = varchar("description", 255).nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object SessionsTable : Table("sessions") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val createdAt = timestamp("created_at")
    val expiresAt = timestamp("expires_at")
}

object SystemPermissionsTable : Table("system_permissions") {
    val id: Column<UUID> = uuid("id")
    val permission = enumerationByName<SystemPermissionEnum>("permission", 64)
    val userId = uuid("user_id")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object TransactionModelsTable : Table("transaction_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object UnitModelsTable : Table("unit_models") {
    val id: Column<UUID> = uuid("id")
    val refId = varchar("ref_id", 64)
    val altId = varchar("alt_id", 64).nullable()
    val name = varchar("name", 64)
    val active = bool("active").default(true)
    val baseUnitId = uuid("base_unit_id").nullable()
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object UsersTable : Table("users") {
    val id: Column<UUID> = uuid("id")
    val firstName = varchar("first_name", 64)
    val lastName = varchar("last_name", 64)
    val email = varchar("email", 64)
    val passwordHash = text("password_hash")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}

object UserRolesTable : Table("user_roles") {
    val id: Column<UUID> = uuid("id")
    val userId = uuid("user_id")
    val roleId = uuid("role_id")
    val createdAt = timestamp("created_at")
    val updatedAt = timestamp("updated_at")
    override val primaryKey = PrimaryKey(id)
}