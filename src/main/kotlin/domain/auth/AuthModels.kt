@file:OptIn(ExperimentalTime::class)

package com.kitledger.domain.auth

import kotlin.time.Instant
import java.util.UUID
import kotlin.time.ExperimentalTime

enum class SystemPermissionEnum {
    KL_SYSTEM_ADMIN
}

/**
 * Api Token Model and core types
 */
data class ApiTokenInsert(
    val userId: UUID,
    val name: String,
)

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
 * Permission Assignment Model and core types
 * This is a pivot table for the many-to-many relationship between users and permissions
 */
data class PermissionAssignmentInsert(
    val userId: UUID?,
    val roleId: UUID?,
    val permissionId: UUID,
)

data class PermissionAssignment(
    val id: UUID,
    val userId: UUID?,
    val roleId: UUID?,
    val permissionId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * Permission Model and core types
 */
data class PermissionInsert(
    val name: String,
    val description: String?,
)

data class Permission(
    val id: UUID,
    val name: String,
    val description: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)


/**
 * Role Model and core types
 */
data class RoleInsert(
    val name: String,
    val description: String?,
)

data class Role(
    val id: UUID,
    val name: String,
    val description: String?,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * Session Model and core types
 */
data class SessionInsert(
    val userId: UUID,
    val expiresAt: Instant,
)

data class Session(
    val id: UUID,
    val userId: UUID,
    val createdAt: Instant,
    val expiresAt: Instant,
)

data class SessionUser(
    val id: UUID,
    val firstName: String,
    val lastName: String,
    val email: String,
    val createdAt: Instant,
)

/**
 * System Permission Model and core types
 */
data class SystemPermissionInsert(
    val permission: SystemPermissionEnum,
    val userId: UUID
)

data class SystemPermission(
    val id: UUID,
    val permission: SystemPermissionEnum,
    val userId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)

/**
 * User Model and core types
 */

data class UserInsert(
    val firstName: String,
    val lastName: String,
    val email: String,
    var passwordHash: String,
)

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
 * User Role Model and core types
 * This is a pivot table for the many-to-many relationship between users and roles
 */

data class UserRoleInsert (
    val userId: UUID,
    val roleId: UUID,
)

data class UserRole(
    val id: UUID,
    val userId: UUID,
    val roleId: UUID,
    val createdAt: Instant,
    val updatedAt: Instant,
)