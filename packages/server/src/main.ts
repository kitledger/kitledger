import { type KitledgerConfig } from "@kitledger/core";
import { StaticUIConfig } from "@kitledger/core/ui";
import { Hono, type MiddlewareHandler } from "hono";

// 1. Define the Runtime Types
type Runtime = "node" | "deno" | "bun" | "unknown";

// 2. Define the Type for the serveStatic Factory
// This ensures 'options' has the correct fields and returns a Hono Middleware
type ServeStaticOptions = {
	root: string;
	rewriteRequestPath?: (path: string) => string;
	mimes?: Record<string, string>;
};

type ServeStaticFn = (options: ServeStaticOptions) => MiddlewareHandler;

export type ServerOptions = {
	systemConfig: KitledgerConfig;
	// Runtime is removed; we detect it automatically now.
	staticPaths?: string[];
	staticUIs?: StaticUIConfig[];
};

type ServerConfig = ServerOptions;

// 3. The Auto-Detection Logic
function detectRuntime(): Runtime {
	// @ts-ignore: Deno global detection
	if (typeof Deno !== "undefined") return "deno";
	// @ts-ignore: Bun global detection
	if (typeof Bun !== "undefined") return "bun";
	if (typeof process !== "undefined" && process.versions?.node) return "node";
	return "unknown";
}

export function defineServerConfig(options: ServerOptions): ServerConfig {
	return options;
}

export async function createServer(config: ServerConfig) {
	const server = new Hono();
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
				return c.json(config.systemConfig.transactionModels);
			});

			server.get(`${staticUI.serverPath}/entities/models`, (c) => {
				return c.json(config.systemConfig.entityModels);
			});

			const cleanPath = staticUI.basePath.endsWith("/") ? staticUI.basePath.slice(0, -1) : staticUI.basePath;

			server.use(
				`${cleanPath}/*`,
				serveStatic({
					root: staticUI.assetsPath,
					rewriteRequestPath: (path) => {
						const p = path.replace(new RegExp(`^${cleanPath}`), "").replace(/^\//, "");
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
					rewriteRequestPath: (path) => path.replace(new RegExp(`^${staticPath}`), "").replace(/^\//, ""),
				}),
			);
		}
	}

	return server;
}
