import { CoachingService } from '../models';

const svc = (service: Omit<CoachingService, 'id'>): CoachingService => ({
  id: service.slug,
  ...service,
});

export const SERVICES: readonly CoachingService[] = [
  svc({
    slug: 'personal-bodybuilding-coaching',
    name: 'Personal Bodybuilding Coaching',
    icon: 'trophy',
    shortDescription:
      'Fully individual training, nutrition and accountability for a complete physique transformation.',
    intro:
      'Personal bodybuilding coaching is the most complete way to work together. Every element — training, nutrition, recovery and mindset — is built around your body, your schedule and your goals, then refined every week based on your progress.',
    delivery: 'hybrid',
    whoItsFor: [
      'Lifters who want a fully personalised plan',
      'Anyone who has plateaued training alone',
      'Clients who value accountability and expert feedback',
    ],
    included: [
      'Individual training program, updated every 4–6 weeks',
      'Personal nutrition targets and meal structure',
      'Weekly check-ins with written or video feedback',
      'Exercise technique review from your videos',
      'Direct messaging with your coach',
    ],
    howItWorks: [
      'Book a free consultation to discuss your goals',
      'Complete a detailed onboarding questionnaire and assessment',
      'Receive your individual plan within 3–5 working days',
      'Train, log and check in weekly — your plan evolves with you',
    ],
    gettingStarted:
      'Start with a free consultation. We will confirm whether personal coaching is the right fit before you commit.',
    relatedPackageId: 'premium-transformation',
    relatedProgramSlugs: ['intermediate-hypertrophy', 'advanced-bodybuilding'],
    featured: true,
  }),
  svc({
    slug: 'muscle-building-programs',
    name: 'Muscle-Building Programs',
    icon: 'dumbbell',
    shortDescription:
      'Structured hypertrophy programming to add quality muscle as efficiently as possible.',
    intro:
      'Muscle growth comes from the right volume, intensity and exercise selection applied consistently over time. These programs remove the guesswork so every session moves you forward.',
    delivery: 'online',
    whoItsFor: [
      'Beginners building their first foundation of muscle',
      'Intermediates who want more structure',
      'Lifters entering an off-season or lean-bulk phase',
    ],
    included: [
      'Periodised hypertrophy program',
      'Exercise library with technique guidance',
      'Progression rules for every exercise',
      'Workout planner and session logging',
    ],
    howItWorks: [
      'Choose a program that matches your level and schedule',
      'Follow the weekly plan and log every session',
      'Progress using the built-in double-progression rules',
      'Upgrade to coaching at any time for personal adjustments',
    ],
    gettingStarted: 'Browse the program catalog or request coaching for a fully custom plan.',
    relatedPackageId: 'starter-coaching',
    relatedProgramSlugs: ['beginner-muscle-building', 'intermediate-hypertrophy', 'push-pull-legs'],
    featured: true,
  }),
  svc({
    slug: 'fat-loss-coaching',
    name: 'Fat-Loss Coaching',
    icon: 'flame',
    shortDescription:
      'Lose fat while keeping hard-earned muscle — with a plan you can actually sustain.',
    intro:
      'Effective fat loss is about a sustainable calorie deficit, enough protein, smart training to preserve muscle and habits that last. Coaching keeps the process steady, measurable and realistic.',
    delivery: 'online',
    whoItsFor: [
      'Anyone who wants to lose fat without crash dieting',
      'Lifters preparing for a holiday, event or photoshoot',
      'Clients who have struggled with consistency before',
    ],
    included: [
      'Calorie and macronutrient targets adjusted weekly',
      'Resistance training plan to preserve muscle',
      'Step and cardio targets',
      'Weekly progress review using weight trends, measurements and photos',
    ],
    howItWorks: [
      'Assess your starting point and lifestyle',
      'Set a realistic rate of loss',
      'Adjust intake and activity based on your weekly data',
      'Transition to maintenance with a clear plan',
    ],
    gettingStarted: 'Book a consultation to set a safe, realistic target for your fat-loss phase.',
    relatedPackageId: 'online-personal-coaching',
    relatedProgramSlugs: ['fat-loss-and-definition'],
    featured: true,
  }),
  svc({
    slug: 'body-recomposition',
    name: 'Body Recomposition',
    icon: 'refresh',
    shortDescription:
      'Build muscle and lose fat at the same time with precise training and nutrition.',
    intro:
      'Recomposition works best for beginners, returning lifters and those carrying some extra body fat. With high protein, a small or no deficit and progressive training, your body shape can change even if the scale barely moves.',
    delivery: 'online',
    whoItsFor: [
      'Newer lifters with some body fat to lose',
      'Returning lifters regaining previous muscle',
      'Clients who do not want a dedicated bulk or cut',
    ],
    included: [
      'Progressive training program',
      'Maintenance-level nutrition targets with high protein',
      'Measurement and photo tracking — beyond scale weight',
      'Weekly check-ins',
    ],
    howItWorks: [
      'Establish baseline measurements and photos',
      'Train with progressive overload',
      'Eat around maintenance with high protein',
      'Track body composition changes, not just weight',
    ],
    gettingStarted:
      'Book a consultation to find out whether recomposition fits your current stage.',
    relatedPackageId: 'online-personal-coaching',
    relatedProgramSlugs: ['upper-lower-split', 'full-body-4-day'],
  }),
  svc({
    slug: 'strength-development',
    name: 'Strength Development',
    icon: 'barbell',
    shortDescription: 'Get stronger on the squat, bench press, deadlift and overhead press.',
    intro:
      'Strength is the foundation of every physique. Structured strength blocks build the capacity to handle heavier loads in your hypertrophy training — and real-world confidence.',
    delivery: 'hybrid',
    whoItsFor: [
      'Lifters who want measurable strength progress',
      'Bodybuilders building an off-season strength base',
      'Athletes in strength-dependent sports',
    ],
    included: [
      'Periodised strength program',
      'Technique review of the main lifts',
      'Load and progression planning',
      'Accessory work for weak points',
    ],
    howItWorks: [
      'Test or estimate current maxes',
      'Train in structured strength blocks',
      'Review technique via video every week',
      'Re-test and plan the next block',
    ],
    gettingStarted:
      'Explore the Strength & Conditioning program or book a consultation for coaching.',
    relatedPackageId: 'online-personal-coaching',
    relatedProgramSlugs: ['strength-and-conditioning'],
  }),
  svc({
    slug: 'beginner-bodybuilding',
    name: 'Beginner Bodybuilding',
    icon: 'sprout',
    shortDescription: 'Learn to train properly from day one — technique, structure and confidence.',
    intro:
      'The first year of training is the most productive — and the most important for building good habits. This service teaches you how to lift safely, eat well and progress steadily.',
    delivery: 'hybrid',
    whoItsFor: [
      'Complete beginners',
      'Anyone who feels lost or intimidated in the gym',
      'Returning lifters after a long break',
    ],
    included: [
      'Simple three-day full-body program',
      'Technique coaching on every fundamental movement',
      'Introductory nutrition guidance',
      'Habit-building support',
    ],
    howItWorks: [
      'Start with a consultation and movement assessment',
      'Learn the fundamental lifts step by step',
      'Build a simple nutrition routine',
      'Progress to more advanced programming when ready',
    ],
    gettingStarted: 'Start with the Beginner Muscle Building program or book a consultation.',
    relatedPackageId: 'starter-coaching',
    relatedProgramSlugs: ['beginner-muscle-building', 'full-body-3-day'],
  }),
  svc({
    slug: 'advanced-bodybuilding',
    name: 'Advanced Bodybuilding',
    icon: 'crown',
    shortDescription:
      'Detailed programming for experienced lifters bringing up lagging body parts.',
    intro:
      'Advanced progress depends on details: volume management, exercise selection, weak-point specialisation, fatigue control and nutrition periodisation. Coaching brings structure and an objective eye.',
    delivery: 'online',
    whoItsFor: [
      'Lifters with 3+ years of serious training',
      'Physique athletes in an off-season',
      'Anyone whose progress has stalled despite hard work',
    ],
    included: [
      'Specialisation blocks for lagging muscles',
      'Mesocycle planning with deloads',
      'Nutrition periodisation',
      'Detailed weekly feedback',
    ],
    howItWorks: [
      'Analyse training history and physique',
      'Identify weak points and priorities',
      'Run planned mesocycles with weekly adjustments',
      'Review and plan the next phase',
    ],
    gettingStarted: 'Book a consultation to review your training history and goals.',
    relatedPackageId: 'advanced-bodybuilding-coaching',
    relatedProgramSlugs: ['advanced-bodybuilding', 'bro-split'],
  }),
  svc({
    slug: 'online-personal-training',
    name: 'Online Personal Training',
    icon: 'smartphone',
    shortDescription:
      'Expert coaching wherever you train — with plans, feedback and support in your pocket.',
    intro:
      'Online coaching delivers the structure and accountability of a personal trainer without geographical limits. You train at your gym and on your schedule; your coach plans, reviews and adjusts.',
    delivery: 'online',
    whoItsFor: [
      'Self-motivated lifters who want expert guidance',
      'Clients outside the in-person service area',
      'Anyone who wants coaching that fits a busy schedule',
    ],
    included: [
      'Training plan delivered through your client dashboard',
      'Nutrition targets',
      'Weekly check-ins and adjustments',
      'Messaging support and technique feedback via video',
    ],
    howItWorks: [
      'Book a free consultation',
      'Complete onboarding',
      'Access your plan in the client dashboard',
      'Check in weekly and receive personal feedback',
    ],
    gettingStarted: 'Book a free online consultation to get started.',
    relatedPackageId: 'online-personal-coaching',
    relatedProgramSlugs: ['upper-lower-split', 'push-pull-legs'],
    featured: true,
  }),
  svc({
    slug: 'in-person-personal-training',
    name: 'In-Person Personal Training',
    icon: 'users',
    shortDescription: 'One-to-one sessions with hands-on coaching, cueing and motivation.',
    intro:
      'In-person sessions provide immediate technique correction and focused intensity. They are ideal for learning new lifts, refining form and training with total confidence.',
    delivery: 'in-person',
    whoItsFor: [
      'Clients who prefer hands-on coaching',
      'Beginners learning technique',
      'Lifters returning from time off',
    ],
    included: [
      'One-to-one coached sessions',
      'Individual program between sessions',
      'Technique coaching and spotting',
      'Progress tracking',
    ],
    howItWorks: [
      'Book a consultation',
      'Schedule regular sessions',
      'Follow your plan between sessions',
      'Review progress every 4 weeks',
    ],
    gettingStarted: 'Contact us to check availability in your area.',
    relatedPackageId: 'premium-transformation',
  }),
  svc({
    slug: 'competition-preparation',
    name: 'Competition Preparation',
    icon: 'medal',
    shortDescription: 'Structured contest prep for bodybuilding and physique competitors.',
    intro:
      'Contest preparation demands precision. Coaching covers the full timeline — from off-season planning through dieting, peak week and post-show recovery — with careful attention to health throughout.',
    delivery: 'hybrid',
    whoItsFor: [
      'First-time and experienced competitors',
      'Bodybuilding, classic physique, men’s and women’s physique and bikini athletes',
      'Athletes who want a health-first approach to prep',
    ],
    included: [
      'Full prep timeline and periodised plan',
      'Weekly (or twice-weekly) check-ins',
      'Nutrition and cardio adjustments',
      'Peak week planning',
      'Posing coaching',
      'Post-show reverse diet',
    ],
    howItWorks: [
      'Assess readiness and choose a target show',
      'Plan the prep timeline',
      'Execute with frequent check-ins and adjustments',
      'Peak, compete and recover with a structured plan',
    ],
    gettingStarted: 'Book a consultation at least 16–24 weeks before your target show.',
    relatedPackageId: 'competition-preparation',
    relatedProgramSlugs: ['advanced-bodybuilding'],
  }),
  svc({
    slug: 'posing-coaching',
    name: 'Posing Coaching',
    icon: 'sparkles',
    shortDescription: 'Present your physique with confidence on stage and in photos.',
    intro:
      'Great posing can make a significant difference on stage. Posing coaching covers mandatory poses, transitions, stage presence and the routine for your division.',
    delivery: 'hybrid',
    whoItsFor: [
      'Competitors at any level',
      'Athletes preparing for a photoshoot',
      'Anyone who wants to present their physique well',
    ],
    included: [
      'Division-specific mandatory poses',
      'Transitions and quarter turns',
      'Individual routine coaching',
      'Video feedback between sessions',
    ],
    howItWorks: [
      'Assess your current posing',
      'Learn and refine mandatory poses',
      'Practise transitions and routine',
      'Review via video until show day',
    ],
    gettingStarted: 'Book a posing session in person or online.',
    relatedPackageId: 'competition-preparation',
  }),
];
