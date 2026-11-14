import { Entity } from './common.model';

/**
 * Editable website copy managed from the admin dashboard.
 * Stored as a single "site" entity so the trainer can update it without a deployment.
 */
export interface SiteContent extends Entity {
  readonly heroEyebrow: string;
  readonly heroHeadline: string;
  readonly heroHighlight: string;
  readonly heroSubheadline: string;
  readonly trainerName: string;
  readonly trainerRole: string;
  readonly trainerShortBio: string;
  readonly trainerBio: readonly string[];
  readonly trainerJourney: readonly string[];
  readonly philosophy: readonly string[];
  readonly methodology: readonly MethodPillar[];
  readonly qualifications: readonly CredentialItem[];
  readonly competitionHistory: readonly CredentialItem[];
  readonly achievements: readonly CredentialItem[];
  readonly yearsCoaching?: number;
  readonly trainerPhotoUrl?: string;
  readonly trainerPhotoAlt?: string;
  readonly seo: Readonly<Record<string, PageSeo>>;
}

export interface MethodPillar {
  readonly title: string;
  readonly description: string;
}

/** A qualification, competition result or award. `verified` must be true before it is shown publicly. */
export interface CredentialItem {
  readonly title: string;
  readonly detail: string;
  readonly year?: string;
  readonly verified: boolean;
}

export interface PageSeo {
  readonly title: string;
  readonly description: string;
}
