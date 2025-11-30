import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { getUIFiles, assetsPath } from "@kitledger/ui"; 
import { relative } from 'path';

const htmlContent = getUIFiles({
  apiBaseUrl: 'http://localhost:3000/api',
  title: 'Kitledger Admin',
  basePath: '/admin',
});

const app = new Hono()

const relativeAssetsPath = relative(process.cwd(), assetsPath);

app.get('/admin', (c) => c.redirect('/admin/'))

app.use('/admin/*', serveStatic({
  root: relativeAssetsPath,
  rewriteRequestPath: (path) => path.replace(/^\/admin/, '') 
}))

app.get('/admin/*', (c) => {
  return c.html(htmlContent);
});

app.get('/', (c) => c.text('Hello Node.js!'))

serve({
    fetch: app.fetch,
    port: 3000,
});