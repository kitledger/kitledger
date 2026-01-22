import { type KitledgerConfig } from "@kitledger/core";
import { getAsciiLogo } from "@kitledger/core/art";
import { StaticUIConfig } from "@kitledger/core/ui";
import { Hono, type MiddlewareHandler } from "hono";

/**
 * Allowed runtimes
 */
type Runtime = "node" | "deno" | "bun" | "unknown";

/**
 * Ensures 'options' has the correct fields and returns a Hono Middleware
 */
type ServeStaticOptions = {
	root: string;
	rewriteRequestPath?: (path: string) => string;
	mimes?: Record<string, string>;
};

type ServeStaticFn = (options: ServeStaticOptions) => MiddlewareHandler;

type ServerConfig = ServerOptions;

type KitledgerContext = {
	Variables: {
		config: KitledgerConfig;
	};
};

function detectRuntime(): Runtime {
	// @ts-ignore: Deno global detection
	if (typeof Deno !== "undefined") return "deno";
	// @ts-ignore: Bun global detection
	if (typeof Bun !== "undefined") return "bun";
	if (typeof process !== "undefined" && process.versions?.node) return "node";
	return "unknown";
}

/**
 * Options for configuring the Kitledger server.
 */
export type ServerOptions = {
	systemConfig: KitledgerConfig;
	// Runtime is removed; we detect it automatically now.
	staticPaths?: string[];
	staticUIs?: StaticUIConfig[];
};

/**
 * Factory function to define the server configuration.
 */
export function defineServerConfig(options: ServerOptions): ServerConfig {
	return options;
}

/**
 * Prints the Kitledger ASCII logo to the console.
 */
export function printAsciiLogo() {
	console.log(getAsciiLogo());
}

/**
 * Factory function to create a Hono server based on the detected runtime.
 * * This is the main entry point for the server package. It returns an initialized
 * Hono instance that has the system configuration injected into its context.
 * * @param config - The {@link ServerConfig} object containing system settings, static paths, and UI definitions.
 * @returns A Promise that resolves to the configured Hono application instance.
 * * @example
 * ```ts
 * // Basic usage with Bun
 * const server = await createServer({
 * systemConfig: myConfig,
 * staticPaths: ['/public']
 * });
 * * export default { fetch: server.fetch };
 * ```
 */
export async function createServer(config: ServerConfig) {
	const server = new Hono<KitledgerContext>();

	/**
	 * Ensure all requests have access to the system config.
	 */
	server.use("*", (c, next) => {
		c.set("config", config.systemConfig);
		return next();
	});

	const runtime = detectRuntime();

	// 4. Type-Safe Variable Definition
	let serveStatic: ServeStaticFn;

	// 5. Dynamic Loading based on detected runtime
	switch (runtime) {
		case "node": {
			const mod = await import("@hono/node-server/serve-static");
			serveStatic = mod.serveStatic as unknown as ServeStaticFn;
			break;
		}
		case "deno": {
			const mod = await import("hono/deno");
			serveStatic = mod.serveStatic as unknown as ServeStaticFn;
			break;
		}
		case "bun": {
			const mod = await import("hono/bun");
			serveStatic = mod.serveStatic as unknown as ServeStaticFn;
			break;
		}
		default:
			throw new Error(`Unsupported or undetected runtime: ${runtime}`);
	}

	/**
	 * Static Apps Serving
	 */
	if (config.staticUIs) {
		for (const staticUI of config.staticUIs) {
			server.get(`${staticUI.serverPath}/transactions/models`, (c) => {
				return c.json(c.get("config").transactionModels);
			});

			server.get(`${staticUI.serverPath}/entities/models`, (c) => {
				return c.json(c.get("config").entityModels);
			});

			const cleanPath = staticUI.basePath.endsWith("/") ? staticUI.basePath.slice(0, -1) : staticUI.basePath;

			server.use(
				`${cleanPath}/*`,
				serveStatic({
					root: staticUI.assetsPath,
					rewriteRequestPath: (path) => {
						const p = path.slice(cleanPath.length).replace(/^\//, "");
						if (p === "" || p === "index.html") return "__404__";
						return p;
					},
				}),
			);

			server.get(`${cleanPath}/*`, (c) => c.html(staticUI.htmlContent));
		}
	}

	/**
	 * Serve other static paths
	 */
	if (config.staticPaths) {
		for (const staticPath of config.staticPaths) {
			server.use(
				staticPath,
				serveStatic({
					root: ".",
					rewriteRequestPath: (path) => path.slice(staticPath.length).replace(/^\//, ""),
				}),
			);
		}
	}

	return server;
}
