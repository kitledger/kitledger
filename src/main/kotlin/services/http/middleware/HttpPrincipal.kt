package com.kitledger.services.http.middleware

import com.kitledger.domain.auth.SessionUser

/**
 * Represents the authenticated user.
 */
data class HttpPrincipal(val user: SessionUser? = null)