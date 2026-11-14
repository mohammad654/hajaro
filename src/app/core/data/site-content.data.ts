import { SiteContent } from '../models';

/**
 * Editable website copy (managed in Admin → Site content).
 *
 * IMPORTANT: qualifications, competition history and achievements are placeholders with
 * `verified: false`. Unverified items are never shown publicly — replace them with the
 * trainer's real credentials and set `verified: true`.
 */
export const SITE_CONTENT: readonly SiteContent[] = [
  {
    id: 'site',
    heroEyebrow: 'Online & in-person bodybuilding coaching',
    heroHeadline: 'Build a physique that',
    heroHighlight: 'reflects your discipline',
    heroSubheadline:
      'Individual training, nutrition and weekly accountability from a dedicated bodybuilding coach. No templates, no guesswork — a plan built for your body and your goals.',
    trainerName: 'Coach Hajaro',
    trainerRole: 'Bodybuilding & Personal Training Coach',
    trainerShortBio:
      'A bodybuilding coach focused on evidence-based training, sustainable nutrition and the details that turn consistent effort into visible results.',
    trainerBio: [
      'I coach people who are serious about changing their physique — whether that means building their first real foundation of muscle, losing fat without losing their life, or stepping on stage.',
      'My approach combines proven training principles with careful attention to the individual: your schedule, recovery, preferences and history. A good plan is one you can follow consistently, and consistency is what produces results.',
      '[Replace this paragraph with your personal background — how long you have trained and coached, and the type of clients you work with best.]',
    ],
    trainerJourney: [
      '[Describe how you started training and what drew you to bodybuilding.]',
      '[Describe the turning points, challenges and lessons that shaped your coaching.]',
      '[Describe why you coach today and what you want clients to experience.]',
    ],
    philosophy: [
      'Results come from doing the fundamentals exceptionally well for a long time.',
      'Every client is an individual — programs are adapted, never copied.',
      'Health first: no crash diets, no reckless shortcuts, no unrealistic promises.',
      'Education matters. You should understand why your plan is built the way it is.',
    ],
    methodology: [
      {
        title: 'Assess',
        description:
          'Training history, lifestyle, movement quality, nutrition habits and goals — before a single set is prescribed.',
      },
      {
        title: 'Plan',
        description:
          'Individual training and nutrition built on proven hypertrophy and strength principles.',
      },
      {
        title: 'Execute',
        description:
          'Clear sessions, technique guidance and logging so every workout has a purpose.',
      },
      {
        title: 'Adjust',
        description:
          'Weekly check-ins turn your data — performance, weight, measurements, recovery — into decisions.',
      },
    ],
    qualifications: [
      {
        title: '[Personal training qualification]',
        detail: '[Awarding body]',
        year: '',
        verified: false,
      },
      { title: '[Nutrition qualification]', detail: '[Awarding body]', year: '', verified: false },
      { title: '[First aid / CPR certificate]', detail: '[Provider]', year: '', verified: false },
    ],
    competitionHistory: [
      { title: '[Competition name]', detail: '[Division & placing]', year: '', verified: false },
    ],
    achievements: [
      { title: '[Achievement or award]', detail: '[Details]', year: '', verified: false },
    ],
    trainerPhotoAlt: 'Portrait of the coach in the gym',
    seo: {
      home: {
        title: 'Online Bodybuilding Coach & Personal Trainer',
        description:
          'Personal bodybuilding coaching online and in person. Individual training programs, nutrition coaching and weekly check-ins to build muscle, lose fat and transform your physique.',
      },
      about: {
        title: 'About Your Bodybuilding Coach',
        description:
          'Meet your bodybuilding coach — coaching philosophy, training methodology, qualifications and experience.',
      },
      services: {
        title: 'Personal Training & Bodybuilding Coaching Services',
        description:
          'Online personal training, in-person coaching, muscle building, fat loss, body recomposition, competition preparation and posing coaching.',
      },
      programs: {
        title: 'Strength & Bodybuilding Training Programs',
        description:
          'Structured training programs for every level: muscle building, hypertrophy, strength, fat loss, push/pull/legs, upper/lower and home workouts.',
      },
      pricing: {
        title: 'Coaching Packages & Pricing',
        description:
          'Transparent pricing for online personal coaching, premium transformation coaching, advanced bodybuilding coaching and competition prep.',
      },
    },
  },
];
