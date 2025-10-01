package com.kitledger.domain.unit

import io.konform.validation.Validation
import io.konform.validation.constraints.maxLength
import io.konform.validation.constraints.minLength

val validateUnitModelInsert = Validation<UnitModelInsert> {
    UnitModelInsert::refId {
        minLength(3)
        maxLength(64)
    }

    UnitModelInsert::altId ifPresent {
        minLength(3)
        maxLength(64)
    }

    UnitModelInsert::name {
        minLength(3)
        maxLength(64)
    }
}