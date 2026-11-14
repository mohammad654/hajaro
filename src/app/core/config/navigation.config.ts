/** Labels use $localize: they are replaced with the translated text at build time, per language. */
export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly children?: readonly NavItem[];
  readonly description?: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: $localize`About`, path: '/about' },
  { label: $localize`Coaching`, path: '/services' },
  { label: $localize`Programs`, path: '/programs' },
  {
    label: $localize`Training Tools`,
    path: '/muscle-chart',
    children: [
      {
        label: $localize`Muscle Chart`,
        path: '/muscle-chart',
        description: $localize`Explore every muscle and how to train it`,
      },
      {
        label: $localize`Exercise Library`,
        path: '/exercises',
        description: $localize`Technique, cues and common mistakes`,
      },
      {
        label: $localize`Workout Planner`,
        path: '/workout-planner',
        description: $localize`Build routines and log your sessions`,
      },
      {
        label: $localize`Nutrition`,
        path: '/nutrition',
        description: $localize`Nutrition education for performance`,
      },
      {
        label: $localize`Calculators`,
        path: '/nutrition/calculators',
        description: $localize`Calories, protein, macros and more`,
      },
    ],
  },
  { label: $localize`Results`, path: '/transformations' },
  { label: $localize`Pricing`, path: '/pricing' },
  { label: $localize`Blog`, path: '/blog' },
];

export const FOOTER_NAV: readonly { readonly title: string; readonly links: readonly NavItem[] }[] =
  [
    {
      title: $localize`Coaching`,
      links: [
        { label: $localize`Online Coaching`, path: '/services/online-personal-training' },
        { label: $localize`Personal Training`, path: '/services/in-person-personal-training' },
        { label: $localize`Competition Prep`, path: '/services/competition-preparation' },
        { label: $localize`Pricing & Packages`, path: '/pricing' },
        { label: $localize`Client Results`, path: '/transformations' },
      ],
    },
    {
      title: $localize`Training`,
      links: [
        { label: $localize`Training Programs`, path: '/programs' },
        { label: $localize`Muscle Chart`, path: '/muscle-chart' },
        { label: $localize`Exercise Library`, path: '/exercises' },
        { label: $localize`Workout Planner`, path: '/workout-planner' },
      ],
    },
    {
      title: $localize`Learn`,
      links: [
        { label: $localize`Nutrition`, path: '/nutrition' },
        { label: $localize`Calculators`, path: '/nutrition/calculators' },
        { label: $localize`Blog`, path: '/blog' },
        { label: $localize`About the Coach`, path: '/about' },
      ],
    },
    {
      title: $localize`Company`,
      links: [
        { label: $localize`Contact`, path: '/contact' },
        { label: $localize`Privacy Policy`, path: '/privacy' },
        { label: $localize`Terms of Service`, path: '/terms' },
        { label: $localize`Health Disclaimer`, path: '/disclaimer' },
      ],
    },
  ];
