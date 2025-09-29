@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import kotlin.time.Instant
import java.util.UUID
import kotlin.time.ExperimentalTime

/**
 * List of allowed system permissions
 */
enum class SystemPermissionEnum {
    KL_SYSTEM_ADMIN
}

/**
 * API Token Model used for Inserts
 */
data class ApiTokenInsert(
    val userId: UUID,
    val name: String,
)

/**
 * API token model used for Selects
 */
data class ApiToken(
    val id: UUID,
    val userId: UUID,
    val name: String,
    val createdAt: Instant,
    val revokedAt: Instant? = null,
)

/**
 * Only used as the result of commands and actions that create a root super user.
 * it includes plain text password and api token making it suitable to be shown only once, upon creation.
 * For later instances use a plain User.
 */
data class NewSuperUser(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val apiToken: String,
)

/**
 * Permission Assignment Model used for Inserts
 * This is a pivot table for the many-to-many relationship between users and permissions
 */
data class PermissionAssignmentInsert(
    val userId: UUID?,
    val roleId: UUID?,
    val permissionId: UUID,
)

/**
 * Permission Assignment Model and core types
 * This is a pivot table for the many-to-many relationship between users and permissions
 */
data class PermissionAssignment(
    val id: UUID,
    val userId: UUID?,
    val roleId: UUID?,
    val permissionId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * Permission Model used for Inserts
 */
data class PermissionInsert(
    val name: String,
    val description: String?,
)

/**
 * Permission Model used for Queries and Select
 */
data class Permission(
    val id: UUID,
    val name: String,
    val description: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)


/**
 * Role Model used for Inserts
 */
data class RoleInsert(
    val name: String,
    val description: String?,
)

/**
 * Role Model used for Queries and Select
 */
data class Role(
    val id: UUID,
    val name: String,
    val description: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * Session Model used for Inserts
 */
data class SessionInsert(
    val userId: UUID,
    val expiresAt: Instant,
)

/**
 * Session Model used for Queries and Select
 */
data class Session(
    val id: UUID,
    val userId: UUID,
    val createdAt: Instant,
    val expiresAt: Instant,
)

/**
 * Simplified Model used for retrieving the User Model from a Session or API Token.
 * Hides properties like the password hash.
 */
data class SessionUser(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val email: String,
    val createdAt: Instant,
)

/**
 * System Permission Model used for Insert
 */
data class SystemPermissionInsert(
    val permission: SystemPermissionEnum,
    val userId: UUID
)

/**
 * System Permission Model used for Queries and Select
 */
data class SystemPermission(
    val id: UUID,
    val permission: SystemPermissionEnum,
    val userId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * User Model used for Inserts
 */
data class UserInsert(
    val firstName: String,
    val lastName: String,
    val email: String,
    var passwordHash: String,
)

/**
 * User Model used for Queries and Select
 */
data class User(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val email: String,
    var passwordHash: String,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * User Role Model used for Inserts
 * This is a pivot table for the many-to-many relationship between users and roles
 */
data class UserRoleInsert (
    val userId: UUID,
    val roleId: UUID,
)

/**
 * User Role Model used for Queries and Select
 * This is a pivot table for the many-to-many relationship between users and roles
 */
data class UserRole(
    val id: UUID,
    val userId: UUID,
    val roleId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)