val exposedVersion: String by project
val flywayVersion: String by project
val graalVmPolyglotVersion: String by project
val hikaricpVersion: String by project
val kotlinVersion: String by project
val logbackVersion: String by project
val postgresDriverVersion: String by project
val r2dbcPoolVersion: String by project

plugins {
    kotlin("jvm") version "2.2.20"
    id("io.ktor.plugin") version "3.3.0"
}

group = "com.kitledger"
version = "0.0.1"

application {
    mainClass = "com.kitledger.ApplicationKt"
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-netty")
    implementation("ch.qos.logback:logback-classic:$logbackVersion")
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-config-yaml")
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-r2dbc:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-json:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-kotlin-datetime:$exposedVersion")
    implementation("org.flywaydb:flyway-core:$flywayVersion")
    implementation("org.flywaydb:flyway-database-postgresql:$flywayVersion")
    implementation("org.postgresql:r2dbc-postgresql:${postgresDriverVersion}")
    implementation("io.r2dbc:r2dbc-pool:${r2dbcPoolVersion}")
    implementation("org.graalvm.polyglot:polyglot:$graalVmPolyglotVersion")
    implementation("org.graalvm.polyglot:js-community:$graalVmPolyglotVersion")
    testImplementation("io.ktor:ktor-server-test-host")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlinVersion")
}
