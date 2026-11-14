import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import compression from 'compression';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { legacyRedirect, rememberedLanguageRedirect } from './legacy-redirects';
import { buildRobots, buildSitemap } from './seo-files';
import { contactConfigFromEnv, contactRouter } from './server/contact';

// Local settings (SMTP etc.). On a host, set real environment variables instead; see .env.example.
if (existsSync('.env')) process.loadEnvFile('.env');

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

/**
 * Behind a proxy/load balancer, set TRUST_PROXY to the number of proxies in front of this server so
 * req.ip is the visitor's address (used for rate limiting). Default: trust nothing.
 */
app.set('trust proxy', Number(process.env['TRUST_PROXY'] ?? 0));

/** Brotli/gzip for HTML, JS, CSS, JSON and SVG (text compresses ~80%; images are skipped). */
app.use(compression());

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

/**
 * Language routing: 301 for URLs of the earlier structure, and the bare root URL sends a returning
 * visitor to the language they chose (302, private: never cached for everyone).
 */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  // originalUrl is the URL as requested (the dev server strips the /en base from req.path).
  const [path, query = ''] = req.originalUrl.split(/(?=\?)/, 2);

  const moved = legacyRedirect(path);
  if (moved) return res.redirect(301, moved + query);

  if (path === '/') {
    res.setHeader('Vary', 'Cookie');
    const preferred = rememberedLanguageRedirect(req.headers.cookie);
    if (preferred) {
      res.setHeader('Cache-Control', 'private, no-store');
      return res.redirect(302, preferred + query);
    }
  }
  return next();
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
app.use('/api/contact', contactRouter(contactConfigFromEnv()));

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

/** Hashed bundles never change, so they are cached for a year; other assets for a week. */
function staticCacheControl(path: string): string {
  // Build output names, e.g. main-5SEXLYJV.js, chunk-BAi-Ibvi.js (localized builds use [\w-] hashes).
  if (/[/\\](?:chunk|main|polyfills|styles)-[\w-]{8,}\.(?:js|css|mjs)$/.test(path)) {
    return 'public, max-age=31536000, immutable';
  }
  if (/\.(?:webp|avif|png|jpe?g|svg|ico|woff2?)$/i.test(path)) return 'public, max-age=604800';
  return 'public, max-age=0, must-revalidate';
}

/** Serve static files from /browser. */
app.use(
  express.static(browserDistFolder, {
    index: false,
    redirect: false,
    setHeaders: (res, path) => res.setHeader('Cache-Control', staticCacheControl(path)),
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();
      // HTML must always be revalidated so visitors get new content (and new bundle names) after a deploy.
      if (!response.headers.has('cache-control')) res.setHeader('Cache-Control', 'no-cache');
      return writeResponseToNodeResponse(response, res);
    })
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
