import { SiteContent } from '../models';

/**
 * Editable website copy (managed in Admin → Site content). Seed text is translated per language
 * with $localize (src/locale); edits made in the admin apply to the language they were made in.
 *
 * IMPORTANT
 * - Text starting with "[" (e.g. "[TODO-FACT: …]") is a placeholder and is never shown publicly.
 *   Replace it with the trainer's real story.
 * - Qualifications, competition history and achievements are placeholders with `verified: false`.
 *   Unverified items are never shown publicly. Add real credentials and set `verified: true`.
 * - Page titles and descriptions live with each page; `seo` holds optional admin overrides only.
 */
export const SITE_CONTENT: readonly SiteContent[] = [
  {
    id: 'site',
    heroEyebrow: $localize`Bodybuilding coaching, in person and online`,
    heroHeadline: $localize`Strength training`,
    heroHighlight: $localize`that fits your life`,
    heroSubheadline: $localize`I help people get stronger, build muscle and feel at home in the gym. You get a plan you can actually follow, and a coach who notices when something is off.`,
    trainerName: 'Coach Hajaro',
    trainerRole: $localize`Bodybuilder and personal trainer`,
    trainerShortBio: $localize`I'm a bodybuilder and personal trainer. I write plans that fit your week, watch your technique, and change the plan when your progress asks for it.`,
    trainerBio: [
      $localize`Most people don't need a perfect plan. They need a plan they can actually follow, and someone who notices when something is off. That is what I do.`,
      $localize`I look at where you are now, set a goal we can measure, and adjust along the way. I work with beginners who feel lost in the gym, lifters who stopped progressing and people who want to compete on stage. If you are somewhere in between, we can talk about it.`,
      $localize`[TODO-FACT: how long you have trained and coached, in your own words]`,
    ],
    trainerJourney: [
      $localize`[TODO-FACT: when and why you started training, in your own words]`,
      $localize`[TODO-FACT: competition history, for example federation, show and year]`,
      $localize`[TODO-FACT: one or two personal details, for example languages you speak or where you grew up]`,
    ],
    philosophy: [
      $localize`Consistency beats intensity.`,
      $localize`Good technique protects your joints and your progress.`,
      $localize`Food matters as much as training.`,
      $localize`Rest is part of the plan.`,
    ],
    methodology: [
      {
        title: $localize`Look at where you are`,
        description: $localize`Your training history, schedule, recovery and eating habits, before I write a single set.`,
      },
      {
        title: $localize`Plan`,
        description: $localize`A training plan built on proven strength and muscle-building principles, with food guidance if you want it.`,
      },
      {
        title: $localize`Train`,
        description: $localize`Clear sessions with technique cues, and a log so you can see what you did last week.`,
      },
      {
        title: $localize`Adjust`,
        description: $localize`Weekly check-ins on your lifts, weight, measurements and recovery. We change what isn't working.`,
      },
    ],
    qualifications: [
      {
        title: '[TODO-FACT: personal training qualification]',
        detail: '[Awarding body]',
        year: '',
        verified: false,
      },
      {
        title: '[TODO-FACT: nutrition qualification]',
        detail: '[Awarding body]',
        year: '',
        verified: false,
      },
      {
        title: '[TODO-FACT: first aid / CPR certificate]',
        detail: '[Provider]',
        year: '',
        verified: false,
      },
    ],
    competitionHistory: [
      {
        title: '[TODO-FACT: competition name]',
        detail: '[Division & placing]',
        year: '',
        verified: false,
      },
    ],
    achievements: [
      {
        title: '[TODO-FACT: achievement or award]',
        detail: '[Details]',
        year: '',
        verified: false,
      },
    ],
    trainerPhotoAlt: $localize`Coach Hajaro in the gym`,
    seo: {},
  },
];
