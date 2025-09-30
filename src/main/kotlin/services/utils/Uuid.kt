package com.kitledger.services.utils

import com.fasterxml.uuid.Generators
import java.util.*

fun generateUuidV7(): UUID {
    return Generators.timeBasedEpochGenerator().generate()
}