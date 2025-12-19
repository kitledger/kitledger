plugins {
    id("java-library")
    kotlin("jvm")
}

dependencies {
    // This is the line you were looking for
    implementation(project(":core"))

    implementation("org.http4k:http4k-core:6.25.0.0")
    implementation("com.auth0:java-jwt:4.5.0")
}