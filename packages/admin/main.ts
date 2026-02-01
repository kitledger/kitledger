import { StaticUIConfig } from "@kitledger/core/ui";
import fs from "fs";
import path from "path";
import { relative } from "path";
import { fileURLToPath } from "url";

import type { AdminUIOptions } from "./shared.js";

/**
 * Exports the AdminUIOptions type for external use.
 */
export type { AdminUIOptions };

// 1. Resolve the absolute path to the build output
// Note: Adjust '../dist' if your build output is deeper (e.g. '../dist/client')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, "../dist");

/**
 * The absolute path to the static assets directory.
 * Use this to configure your static file server (e.g. express.static).
 */
const assetsPath = relative(process.cwd(), DIST_PATH);

/**
 * Defines the Admin UI configuration for Kitledger.
 *
 * @remarks
 * This function generates a StaticUIConfig object based on the provided options.
 *
 * @param options - The configuration options for the Admin UI.
 * @returns A StaticUIConfig object for the Admin UI.
 */
export function defineAdminUI(options: AdminUIOptions): StaticUIConfig {
	return {
		serverPath: options.serverPath,
		htmlContent: getAdminHtmlContent(options),
		basePath: options.basePath || "/admin",
		assetsPath: assetsPath,
	};
}

/**
 * Returns the index.html string with runtime configuration injected.
 * Use this for the wildcard route (e.g. app.get('/admin/*', ...))
 */
function getAdminHtmlContent(config: AdminUIOptions): string {
	const htmlPath = path.join(DIST_PATH, "index.html");

	if (!fs.existsSync(htmlPath)) {
		throw new Error(`Kitledger UI not found at ${htmlPath}.`);
	}

	let html = fs.readFileSync(htmlPath, "utf-8");

	const safeBase = config.basePath.endsWith("/") ? config.basePath : `${config.basePath}/`;

	const injection = `
    <base href="${safeBase}" />
    <script>
      window.KITLEDGER_CONFIG = ${JSON.stringify(config)};
    </script>
  `;

	html = html.replace(/<title>.*<\/title>/i, `<title>${config.title || "Kitledger Admin"}</title>`);
	html = html.replace(/<head[^>]*>/i, (match) => `${match}${injection}`);
	return html;
}
