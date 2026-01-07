import { serveStatic } from "@hono/node-server/serve-static";
import { type KitledgerConfig } from "@kitledger/core";
import { StaticUIConfig } from "@kitledger/core/ui";
import { Hono } from "hono";

export type ServerOptions = {
	systemConfig: KitledgerConfig;
	runtime: "node";
	staticPaths?: string[];
	staticUIs?: StaticUIConfig[];
};

type ServerConfig = ServerOptions;

export function defineServerConfig(options: ServerOptions): ServerConfig {
	return options;
}

export function createServer(config: ServerConfig) {
	const server = new Hono();

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

			// Remove trailing slash if path ends with '/'
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
	 * Server other static paths
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
