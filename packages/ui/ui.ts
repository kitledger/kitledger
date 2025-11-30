import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 1. Resolve the absolute path to the build output
// Note: Adjust '../dist' if your build output is deeper (e.g. '../dist/client')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.resolve(__dirname, '../dist');

/**
 * The absolute path to the static assets directory.
 * Use this to configure your static file server (e.g. express.static).
 */
export const assetsPath = DIST_PATH;

/**
 * Configuration that passes from the Server to the Client.
 */
export interface UiConfig {
  apiBaseUrl: string;
  basePath?: string; // e.g. '/admin'
  title?: string;
}

/**
 * Returns the index.html string with runtime configuration injected.
 * Use this for the wildcard route (e.g. app.get('/admin/*', ...))
 */
export function getUIFiles(config: UiConfig): string {
  const htmlPath = path.join(DIST_PATH, 'index.html');
  
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Kitledger UI not found at ${htmlPath}.`);
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');

  const safeBase = config.basePath?.endsWith('/') 
    ? config.basePath 
    : `${config.basePath || ''}/`;

  const injection = `
    <base href="${safeBase}" />
    <script>
      window.KITLEDGER_CONFIG = ${JSON.stringify(config)};
    </script>
  `;

  return html.replace(/<head[^>]*>/i, (match) => `${match}${injection}`);
}