export interface AppEnvironment {
  readonly production: boolean;
  /** Absolute public origin, used for canonical URLs, Open Graph and the sitemap. */
  readonly siteUrl: string;
  readonly apiBaseUrl: string;
  /** Where the contact form posts enquiries (the site's own server, see src/server/contact.ts). */
  readonly contactEndpoint: string;
  /** When true, data is served by local in-browser adapters instead of the HTTP API. */
  readonly useMockApi: boolean;
  readonly dataVersion: number;
  /**
   * Development only. `ng serve` can serve just one language at a time, so each language runs on
   * its own dev server; the language switcher links to these origins. Omit in production, where one
   * server serves every language (en at /, nl at /nl/).
   */
  readonly localeOrigins?: Readonly<Record<string, string>>;
  readonly analytics: {
    readonly gaMeasurementId: string;
    readonly searchConsoleVerification: string;
  };
}
