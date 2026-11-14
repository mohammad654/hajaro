import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  apiBaseUrl: '/api',
  useMockApi: true,
  dataVersion: 1,
  /** `npm start` → English on :4200, `npm run start:nl` → Dutch on :4201 (`npm run start:all` runs both). */
  localeOrigins: { en: 'http://localhost:4200', nl: 'http://localhost:4201' },
  analytics: {
    gaMeasurementId: '',
    searchConsoleVerification: '',
  },
};
