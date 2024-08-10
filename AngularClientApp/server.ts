import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/main.server';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/your-project-name/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const engine = new CommonEngine();

  server.engine('html', (filePath, options: any, callback) => {
    engine.render({
      bootstrap: AppServerModule,
      documentFilePath: filePath,
      url: options.req.url,
      publicPath: distFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: options.req.baseUrl }],
    }).then(html => callback(null, html)).catch(err => callback(err));
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res) => {
    res.render(indexHtml, { req });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
