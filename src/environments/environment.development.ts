import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  apiBaseUrl: '/api',
  useMockApi: true,
  dataVersion: 1,
  /** `npm start` → Dutch on :4200, `npm run start:en` → English on :4201/en/ (`npm run start:all` runs both). */
  localeOrigins: { nl: 'http://localhost:4200', en: 'http://localhost:4201' },
  analytics: {
    gaMeasurementId: '',
    searchConsoleVerification: '',
  },
};
