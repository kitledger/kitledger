import { createSuperUser } from "./domain/auth/user_actions.js";
import { startSession } from "./domain/auth/session_actions.js";

type Command = {
	name: string;
	description: string;
	usage: string;
	handler: (args: string[]) => Promise<void> | void;
};

const commands: Command[] = [
	{
		name: "createSuperUser",
		description: "Create a superuser",
		usage: "createSuperUser <first> <last> <email>",
		handler: async (args) => {
			if (args.length < 3) {
				console.error(`Usage: ${commands.find((c) => c.name === "createSuperUser")!.usage}`);
				process.exit(1);
			}

			const firstName = args[0] as string;
			const lastName = args[1] as string;
			const email = args[2] as string;

			const user = await createSuperUser(firstName, lastName, email);

			if (!user) {
				console.error("Failed to create super user.");
				process.exit(1);
			}

			console.table([user]);
			process.exit(0);
		},
	},
	{
		name: "startSession",
		description: "Start a session for a user",
		usage: "startSession <userId>",
		handler: async (args) => {
			if (args.length < 1) {
				console.error(`Usage: ${commands.find((c) => c.name === "startSession")!.usage}`);
				process.exit(1);
			}

			const userId = args[0] as string;
			const sessionId = await startSession(userId);

			if (!sessionId) {
				console.error("Failed to start session.");
				process.exit(1);
			}

			console.log(`Session started with ID: ${sessionId}`);
			process.exit(0);
		},
	},
];

export async function execute(args: string[]): Promise<void> {
	const commandName = args[0];

	if (commandName === "help") {
		console.log("Available commands:");
		commands.forEach((cmd) => console.log(`- ${cmd.name}: ${cmd.description}`));
		console.log("- help: Show this help");
		process.exit(0);
	}

	const command = commands.find((cmd) => cmd.name === commandName);

	if (!command) {
		console.error(`Unknown command: ${commandName || ""}. Use "help" for available commands.`);
		process.exit(1);
	}

	if (args.length > 1 && (args[1] === "--help" || args[1] === "help")) {
		console.log(`Usage: ${command.usage}`);
		console.log(command.description);
		process.exit(0);
	}

	await command.handler(args.slice(1));
}
