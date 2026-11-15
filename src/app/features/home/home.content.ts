export const COACHING_STEPS = [
  {
    title: $localize`Free intro`,
    description: $localize`We talk about your goal, your training history and your week. No pressure: you decide afterwards.`,
  },
  {
    title: $localize`Starting point`,
    description: $localize`A short questionnaire, starting measurements (photos only if you're comfortable with that) and a look at how you train and eat now.`,
  },
  {
    title: $localize`Your plan`,
    description: $localize`A training plan, and food targets if you want them, in your own client dashboard.`,
  },
  {
    title: $localize`Train, check in, adjust`,
    description: $localize`You log your sessions and send a weekly check-in. I look at it and change what isn't working.`,
  },
] as const;

export const HERO_PILLARS = [
  { icon: 'target', label: $localize`Personal training plan` },
  { icon: 'pie', label: $localize`Food guidance` },
  { icon: 'calendar', label: $localize`Weekly check-ins` },
  { icon: 'medal', label: $localize`Contest prep` },
] as const;
