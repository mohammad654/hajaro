export const COACHING_STEPS = [
  {
    title: 'Free consultation',
    description:
      'A no-pressure call to understand your goals, history, schedule and whether we are a good fit.',
  },
  {
    title: 'Assessment & onboarding',
    description:
      'A detailed questionnaire, starting measurements and photos, and a review of your training and nutrition.',
  },
  {
    title: 'Your individual plan',
    description:
      'Training, nutrition targets and habits built for you — delivered in your private client dashboard.',
  },
  {
    title: 'Train, check in, adjust',
    description:
      'Log your sessions, submit weekly check-ins and receive feedback. Your plan evolves with your progress.',
  },
] as const;

export const HERO_PILLARS = [
  { icon: 'target', label: 'Individual programming' },
  { icon: 'pie', label: 'Nutrition coaching' },
  { icon: 'calendar', label: 'Weekly check-ins' },
  { icon: 'medal', label: 'Competition prep' },
] as const;

export const NUTRITION_PILLARS = [
  'Calorie and macronutrient targets matched to your goal',
  'Simple meal structures you can sustain',
  'Hydration, sleep and recovery habits',
  'Evidence-based supplement education — no hype',
] as const;
