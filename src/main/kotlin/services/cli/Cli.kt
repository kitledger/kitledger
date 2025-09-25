package com.kitledger.services.cli

import com.kitledger.services.database.Migration
import com.kitledger.domain.auth.createSuperUser
import kotlin.system.exitProcess

data class Command(
    val name: String,
    val description: String,
    val usage: String,
    val handler: suspend (args: Array<String>) -> Unit
)

val commands = arrayOf<Command>(
    Command(
        name = "createSuperUser",
        description = "Create a super user",
        usage = "createSuperUser <first> <last> <email>",
        handler = { args ->
            val user = createSuperUser(args[0], args[1], args[2])

            user.onSuccess {
                println("createSuperUser: $it")
            }
            user.onFailure {
                println("Unable to create super user: ${it.message} ${args.joinToString(" ")}")
            }
        }
    ),
    Command(
        name = "startSession",
        description = "Starts a new session for a user",
        usage = "startSession <userId>",
        handler = { args ->
            println("startSession: ${args.joinToString(" ")}")
        }
    ),
    Command(
        name = "migrateDatabase",
        description = "Migrates the database",
        usage = "migrate",
        handler = { args ->
            Migration.run()
        }
    )
)

suspend fun execute(args: Array<String>) {
    val commandName = args.getOrNull(0)

    // Handle 'help' command separately
    if (commandName == "help") {
        println("Available commands:")
        commands.forEach { cmd -> println("- ${cmd.name}: ${cmd.description}") }
        println("- help: Show this help")
        exitProcess(0)
    }

    val command = commands.find { it.name == commandName }

    // Handle unknown command
    if (command == null) {
        System.err.println("Unknown command: ${commandName ?: ""}. Use \"help\" for available commands.")
        exitProcess(1)
    }

    // Handle --help or help for a specific command
    if (args.size > 1 && (args[1] == "--help" || args[1] == "help")) {
        println("Usage: ${command.usage}")
        println(command.description)
        exitProcess(0)
    }

    // Execute the command's handler
    command.handler(args.sliceArray(1 until args.size))
}

