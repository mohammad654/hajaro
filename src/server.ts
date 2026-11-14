import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { buildRobots, buildSitemap } from './seo-files';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

/**
 * Baseline security headers. A Content-Security-Policy should be added at the hosting/CDN layer
 * once the final set of third-party origins (analytics, video, fonts) is known.
 */
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

/** SEO files generated from the same content data the application renders. */
const sitemap = buildSitemap();
const robots = buildRobots();

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml').setHeader('Cache-Control', 'public, max-age=3600').send(sitemap);
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').setHeader('Cache-Control', 'public, max-age=3600').send(robots);
});

/**
 * The coaching API is expected under /api (see src/environments). When it is hosted elsewhere,
 * proxy it here or point `apiBaseUrl` at its origin. Unknown /api routes must never fall through to the
 * Angular renderer.
 */
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

/**
 * Serve static files from /browser. Hashed bundles are cached for a year; everything else revalidates.
 */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      // Build output names, e.g. main-5SEXLYJV.js, chunk-BAi-Ibvi.js (localized builds use [\w-] hashes).
      const isHashed = /[/\\](?:chunk|main|polyfills|styles)-[\w-]{8,}\.(?:js|css|mjs)$/.test(path);
      const isAsset = /\.(webp|avif|png|jpg|jpeg|svg|ico|woff2?)$/i.test(path);
      res.setHeader(
        'Cache-Control',
        isHashed
          ? 'public, max-age=31536000, immutable'
          : isAsset
            ? 'public, max-age=604800'
            : 'public, max-age=0, must-revalidate',
      );
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
