import { type KitledgerConfig } from "@kitledger/core";
import { getAsciiLogo } from "@kitledger/core/art";
import { StaticUIConfig } from "@kitledger/core/ui";
import { Hono, type MiddlewareHandler } from "hono";

type CorsConfig = {
	origin: string | string[];
	allowMethods: string[];
	allowHeaders: string[];
	maxAge: number;
	credentials: boolean;
	exposeHeaders: string[];
};

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

type ServerConfig = ServerOptions & {
	corsConfig: CorsConfig;
};

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
	corsConfig?: CorsConfig;
};

/**
 * Factory function to define the server configuration.
 */
function defineServerConfig(options: ServerOptions): ServerConfig {
	/**
	 * CORS configuration values and defaults.
	 */
	const defaultCorsConfig: CorsConfig = {
		origin: "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		exposeHeaders: [],
		credentials: false,
		maxAge: 86400,
	};

	const corsConfig: CorsConfig = {
		...defaultCorsConfig,
		...options.corsConfig,
	};

	return {
		...options,
		corsConfig,
	};
}

/**
 * Prints the Kitledger ASCII logo to the console.
 */
export function printAsciiLogo() {
	console.log(getAsciiLogo());
}

/**
 * Factory function that initializes the Kitledger server engine based on Hono.
 *
 * This function injects the provided {@link ServerConfig} (business logic, UI definitions,
 * and database connections) into the application context and returns a fully configured
 * Hono instance.
 *
 * @remarks
 * **Universal Web Standards**
 * The returned application relies on native Web Standard `Request` and `Response` objects.
 * This makes the server runtime-agnostic and allows it to be mounted within existing
 * full-stack frameworks (like Next.js Route Handlers, Astro, or React Router 7) simply
 * by exporting the `fetch` handler.
 *
 * @param config - The {@link ServerConfig} object containing system settings, static paths, and UI definitions.
 * @returns A Promise that resolves to the configured Hono application instance.
 *
 * @example
 * ```ts
 * // 1. Standalone Usage (Bun)
 * const server = await createServer({
 * systemConfig: myConfig,
 * staticPaths: ['/public']
 * });
 *
 * export default {
 * fetch: server.fetch,
 * port: 3000
 * };
 * ```
 *
 * @example
 * ```ts
 * // 2. Standalone Usage (Deno)
 * const server = await createServer({
 * systemConfig: myConfig,
 * staticPaths: ['/public']
 * });
 *
 * Deno.serve({ port: 8000 }, server.fetch);
 * ```
 *
 * @example
 * ```ts
 * // 3. Standalone Usage (Node.js)
 * import { serve } from '@hono/node-server';
 *
 * const server = await createServer({
 * systemConfig: myConfig,
 * staticPaths: ['/public']
 * });
 *
 * serve({
 * fetch: server.fetch,
 * port: 3000
 * });
 * ```
 *
 * @example
 * ```ts
 * // 4. Framework Integration (Next.js / Astro / React Router 7)
 * // Because 'server' follows standard Web APIs, you can use it in route handlers.
 *
 * const server = await createServer({ ... });
 *
 * // Next.js App Router (route.ts)
 * export const GET = server.fetch;
 * export const POST = server.fetch;
 * ```
 */
export async function createServer(options: ServerOptions) {
	const config = defineServerConfig(options);
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

			server.get(`${staticUI.serverPath}/units/models`, (c) => {
				return c.json(c.get("config").unitModels);
			});

			server.get(`${staticUI.serverPath}/transactions/forms`, (c) => {
				return c.json(c.get("config").transactionForms ?? []);
			});

			server.get(`${staticUI.serverPath}/entities/forms`, (c) => {
				return c.json(c.get("config").entityForms ?? []);
			});

			server.get(`${staticUI.serverPath}/units/forms`, (c) => {
				return c.json(c.get("config").unitForms ?? []);
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
