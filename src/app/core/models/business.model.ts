import { Entity, Sluggable } from './common.model';

export type ServiceDelivery = 'online' | 'in-person' | 'hybrid';

export const SERVICE_DELIVERY_LABELS: Readonly<Record<ServiceDelivery, string>> = {
  online: $localize`Online`,
  'in-person': $localize`In person`,
  hybrid: $localize`Online or in person`,
};

export interface CoachingService extends Sluggable {
  readonly name: string;
  readonly icon: string;
  readonly shortDescription: string;
  readonly intro: string;
  readonly delivery: ServiceDelivery;
  readonly whoItsFor: readonly string[];
  readonly included: readonly string[];
  readonly howItWorks: readonly string[];
  readonly gettingStarted: string;
  readonly relatedPackageId?: string;
  readonly relatedProgramSlugs?: readonly string[];
  readonly featured?: boolean;
}

export type BillingPeriod = 'month' | 'program' | 'session' | 'week';

/** Shown after a price, e.g. "€ 149 / month". */
export const BILLING_PERIOD_LABELS: Readonly<Record<BillingPeriod, string>> = {
  month: $localize`/ month`,
  week: $localize`/ week`,
  program: $localize`one-off`,
  session: $localize`/ session`,
};

export interface CoachingPackage extends Entity {
  readonly name: string;
  readonly tagline: string;
  readonly price: number;
  readonly currency: string;
  readonly billingPeriod: BillingPeriod;
  readonly duration: string;
  readonly trainingPlan: string;
  readonly nutrition: string;
  readonly checkIns: string;
  readonly communication: string;
  readonly support: string;
  readonly features: readonly string[];
  readonly highlighted: boolean;
  readonly ctaLabel: string;
  readonly order: number;
  readonly active: boolean;
}

export interface Transformation extends Entity {
  readonly clientName: string;
  readonly headline: string;
  readonly story: string;
  readonly goal: string;
  readonly durationWeeks: number;
  readonly results: readonly string[];
  readonly beforeImageUrl?: string;
  readonly afterImageUrl?: string;
  readonly testimonial?: string;
  /** Written consent on file to publish images and story. Required to display. */
  readonly consentConfirmed: boolean;
  readonly published: boolean;
  readonly createdAt: string;
}

export interface Testimonial extends Entity {
  readonly clientName: string;
  readonly context: string;
  readonly quote: string;
  readonly consentConfirmed: boolean;
  readonly published: boolean;
  readonly createdAt: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'closed';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitor';
export type CoachingType = 'online' | 'in-person' | 'hybrid' | 'competition-prep' | 'not-sure';

export const COACHING_TYPE_LABELS: Readonly<Record<CoachingType, string>> = {
  online: $localize`Online coaching`,
  'in-person': $localize`In-person training`,
  hybrid: $localize`Hybrid (online + in person)`,
  'competition-prep': $localize`Competition preparation`,
  'not-sure': $localize`Not sure yet`,
};

export const EXPERIENCE_LABELS: Readonly<Record<ExperienceLevel, string>> = {
  beginner: $localize`Beginner (under 1 year)`,
  intermediate: $localize`Intermediate (1–3 years)`,
  advanced: $localize`Advanced (3+ years)`,
  competitor: $localize`Competitor`,
};

export interface Inquiry extends Entity {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly goals: readonly string[];
  readonly coachingType: CoachingType;
  readonly experience: ExperienceLevel;
  readonly message: string;
  readonly wantsConsultation: boolean;
  readonly preferredTime?: string;
  readonly status: InquiryStatus;
  readonly createdAt: string;
}

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export const BOOKING_TYPE_LABELS: Readonly<Record<Booking['type'], string>> = {
  consultation: $localize`Consultation`,
  session: $localize`Training session`,
  'check-in-call': $localize`Check-in call`,
  posing: $localize`Posing session`,
};

export interface Booking extends Entity {
  readonly clientId?: string;
  readonly name: string;
  readonly email: string;
  readonly type: 'consultation' | 'session' | 'check-in-call' | 'posing';
  readonly startsAt: string;
  readonly durationMinutes: number;
  readonly location: string;
  readonly status: BookingStatus;
  readonly notes?: string;
}
