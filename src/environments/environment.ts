import { AppEnvironment } from './environment.model';

/**
 * Production environment.
 *
 * `useMockApi: true` keeps the platform fully functional without a backend: data is
 * seeded from `src/app/core/data` and changes are persisted in the visitor's browser.
 * Set it to `false` and provide `apiBaseUrl` once the coaching API is available —
 * every repository then switches to the HTTP adapter automatically.
 */
export const environment: AppEnvironment = {
  production: true,
  siteUrl: 'https://www.example.com',
  apiBaseUrl: '/api',
  contactEndpoint: '/api/contact',
  useMockApi: true,
  /** Bump when seed data changes shape so stale browser copies are discarded. */
  dataVersion: 1,
  analytics: {
    /** Google Analytics 4 measurement ID (e.g. "G-XXXXXXX"). Loaded only after consent. */
    gaMeasurementId: '',
    /** Google Search Console verification token. */
    searchConsoleVerification: '',
  },
};
