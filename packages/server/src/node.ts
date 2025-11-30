import { serveStatic } from '@hono/node-server/serve-static';
import { createBaseServer, type ServerConfig } from './core.js';

export function createServer(config: ServerConfig) {
	const server = createBaseServer(config);

	/**
	 * Static Apps Serving
	 */
	if(config.staticUIs) {
		for (const staticUI of config.staticUIs) {

			// Remove trailing slash if path ends with '/'
			const cleanPath = staticUI.path.endsWith('/')
				? staticUI.path.slice(0, -1)
				: staticUI.path;

			server.get(cleanPath, (c) => c.redirect(cleanPath + '/'));

			server.use(`${cleanPath}/*`, serveStatic({
				root: staticUI.assetsPath,
				rewriteRequestPath: (path) => {
					const p = path.replace(new RegExp(`^${cleanPath}`), '').replace(/^\//, '');
					if (p === '' || p === 'index.html') return '__404__';
					return p;
				}
			}));

			server.get(`${cleanPath}/*`, (c) => c.html(staticUI.htmlContent));
		}
	}

	/**
	 * Server other static paths
	 */
	if(config.staticPaths) {
		for (const staticPath of config.staticPaths) {
			server.use(staticPath, serveStatic({
				root: '.',
				rewriteRequestPath: (path) => path.replace(new RegExp(`^${staticPath}`), '').replace(/^\//, '')
			}));
		}
	}
	
	return server.fetch;
}