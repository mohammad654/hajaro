import { Entity } from './common.model';
import { WorkoutDay } from './program.model';

export type UserRole = 'client' | 'admin';

/** The authenticated user. Never contains credentials. */
export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
}

export type ClientStatus = 'active' | 'paused' | 'onboarding' | 'archived';

export interface NutritionTargets {
  readonly calories: number;
  readonly proteinG: number;
  readonly carbsG: number;
  readonly fatG: number;
  readonly waterL: number;
  readonly notes?: string;
}

export interface ClientProfile extends Entity {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly status: ClientStatus;
  readonly packageId?: string;
  readonly goal: string;
  readonly startDate: string;
  /** Program the coach has assigned. */
  readonly assignedProgramId?: string;
  /** Optional coach-customised schedule that overrides the assigned program's default days. */
  readonly customSchedule?: readonly WorkoutDay[];
  readonly nutrition?: NutritionTargets;
  readonly coachNotes?: string;
}

export interface BodyMeasurement extends Entity {
  readonly clientId: string;
  readonly date: string;
  readonly weightKg: number;
  readonly bodyFatPct?: number;
  readonly waistCm?: number;
  readonly chestCm?: number;
  readonly armCm?: number;
  readonly thighCm?: number;
}

export interface ProgressPhoto extends Entity {
  readonly clientId: string;
  readonly date: string;
  readonly pose: 'front' | 'side' | 'back';
  /** In mock mode a downscaled data URL; with a backend, a signed storage URL. */
  readonly url: string;
}

export interface CheckIn extends Entity {
  readonly clientId: string;
  readonly date: string;
  readonly weightKg: number;
  readonly sleepHours: number;
  readonly energy: number;
  readonly trainingAdherence: number;
  readonly nutritionAdherence: number;
  readonly notes: string;
  readonly coachFeedback?: string;
  readonly feedbackAt?: string;
}

export interface ClientNotification extends Entity {
  readonly clientId: string;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly read: boolean;
}
