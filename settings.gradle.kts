@file:Suppress("UnstableApiUsage")
rootProject.name = "kitledger"

include("core")
include("server")
include("dev")

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
    }
}