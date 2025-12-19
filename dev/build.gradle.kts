plugins {
    application
    kotlin("jvm")
}

dependencies {
    implementation(project(":server"))
    // Required because server uses 'api' for core, but explicit is better for dev
    implementation(project(":core"))

    implementation("org.http4k:http4k-server-netty:6.5.0.0")
    implementation("ch.qos.logback:logback-classic:1.5.15")

    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:2.2.20")
}

application {
    mainClass.set("com.kitledger.dev.MainKt")
}