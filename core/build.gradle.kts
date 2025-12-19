plugins {
    id("java-library")
    kotlin("jvm")
    kotlin("plugin.serialization")
}

dependencies {
    // Hidden from server/dev
    implementation("org.jetbrains.exposed:exposed-core:1.0.0-rc-4")
    implementation("org.jetbrains.exposed:exposed-jdbc:1.0.0-rc-4")
    implementation("org.jetbrains.exposed:exposed-json:1.0.0-rc-4")
    implementation("org.jetbrains.exposed:exposed-kotlin-datetime:1.0.0-rc-4")

    implementation("org.flywaydb:flyway-core:11.13.0")
    implementation("org.flywaydb:flyway-database-postgresql:11.13.0")
    implementation("com.zaxxer:HikariCP:7.0.2")
    implementation("org.postgresql:postgresql:42.7.7")

    implementation("de.mkammerer:argon2-jvm:2.12")
    implementation("com.fasterxml.uuid:java-uuid-generator:5.1.0")

    // Likely needs to be shared for validation logic
    api("io.konform:konform-jvm:0.11.1")

    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:2.2.20")
}