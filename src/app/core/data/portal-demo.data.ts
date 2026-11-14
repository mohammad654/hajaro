import {
  AuthUser,
  BodyMeasurement,
  Booking,
  CheckIn,
  ClientNotification,
  ClientProfile,
  Inquiry,
  Testimonial,
  Transformation,
} from '../models';

/**
 * DEMO-MODE ACCOUNTS ONLY.
 * Used when `environment.useMockApi` is true so the client and admin dashboards can be explored
 * without a backend. No passwords are stored anywhere in the frontend.
 */
export const DEMO_USERS: readonly AuthUser[] = [
  { id: 'client-demo', name: 'Demo Client', email: 'client@demo.local', role: 'client' },
  { id: 'coach', name: 'Coach (Admin)', email: 'coach@demo.local', role: 'admin' },
];

export const DEMO_CLIENTS: readonly ClientProfile[] = [
  {
    id: 'client-demo',
    name: 'Demo Client',
    email: 'client@demo.local',
    status: 'active',
    packageId: 'online-personal-coaching',
    goal: 'Build muscle while staying lean',
    startDate: '2026-09-01',
    assignedProgramId: 'upper-lower-split',
    nutrition: {
      calories: 2650,
      proteinG: 170,
      carbsG: 300,
      fatG: 80,
      waterL: 3,
      notes: 'Keep protein consistent on rest days.',
    },
    coachNotes: 'Demo record — use this account to explore the client dashboard.',
  },
];

export const DEMO_MEASUREMENTS: readonly BodyMeasurement[] = [
  {
    id: 'm-1',
    clientId: 'client-demo',
    date: '2026-09-01',
    weightKg: 80.4,
    waistCm: 84,
    chestCm: 102,
    armCm: 36.5,
    thighCm: 58,
  },
  {
    id: 'm-2',
    clientId: 'client-demo',
    date: '2026-09-29',
    weightKg: 80.9,
    waistCm: 83.5,
    chestCm: 103,
    armCm: 37,
    thighCm: 58.5,
  },
  {
    id: 'm-3',
    clientId: 'client-demo',
    date: '2026-10-27',
    weightKg: 81.3,
    waistCm: 83.5,
    chestCm: 103.5,
    armCm: 37.4,
    thighCm: 59,
  },
];

export const DEMO_CHECK_INS: readonly CheckIn[] = [
  {
    id: 'c-1',
    clientId: 'client-demo',
    date: '2026-10-27',
    weightKg: 81.3,
    sleepHours: 7.5,
    energy: 4,
    trainingAdherence: 100,
    nutritionAdherence: 90,
    notes: 'Strength up on all lower-body lifts. Slight elbow ache on skull crushers.',
    coachFeedback:
      'Great week. Swapping skull crushers for overhead cable extensions — keep the elbows comfortable.',
    feedbackAt: '2026-10-28',
  },
  {
    id: 'c-2',
    clientId: 'client-demo',
    date: '2026-11-03',
    weightKg: 81.5,
    sleepHours: 6.5,
    energy: 3,
    trainingAdherence: 75,
    nutritionAdherence: 85,
    notes: 'Busy week at work, missed one session.',
  },
];

export const DEMO_NOTIFICATIONS: readonly ClientNotification[] = [
  {
    id: 'n-1',
    clientId: 'client-demo',
    title: 'Program updated',
    body: 'Your Upper B session has a new triceps exercise.',
    createdAt: '2026-10-28T09:00:00Z',
    read: false,
  },
  {
    id: 'n-2',
    clientId: 'client-demo',
    title: 'Check-in reminder',
    body: 'Your weekly check-in is due on Monday.',
    createdAt: '2026-11-08T08:00:00Z',
    read: true,
  },
];

export const DEMO_BOOKINGS: readonly Booking[] = [
  {
    id: 'b-1',
    clientId: 'client-demo',
    name: 'Demo Client',
    email: 'client@demo.local',
    type: 'check-in-call',
    startsAt: '2026-11-20T17:30:00Z',
    durationMinutes: 30,
    location: 'Video call',
    status: 'confirmed',
  },
];

export const DEMO_INQUIRIES: readonly Inquiry[] = [];

/** Intentionally empty: only real, consented client results may be published. */
export const TRANSFORMATIONS_SEED: readonly Transformation[] = [];
export const TESTIMONIALS_SEED: readonly Testimonial[] = [];
