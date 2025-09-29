package com.kitledger.services.http.middleware

import com.kitledger.domain.auth.SessionUser

data class HttpPrincipal(val user: SessionUser? = null)