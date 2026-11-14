import { Article, ArticleBlock } from '../models';

const AUTHOR = 'Coach Hajaro';

const h2 = (id: string, text: string): ArticleBlock => ({ type: 'h2', id, text });
const h3 = (id: string, text: string): ArticleBlock => ({ type: 'h3', id, text });
const p = (text: string): ArticleBlock => ({ type: 'p', text });
const ul = (...items: string[]): ArticleBlock => ({ type: 'ul', items });
const ol = (...items: string[]): ArticleBlock => ({ type: 'ol', items });
const callout = (text: string): ArticleBlock => ({ type: 'callout', text });
const link = (text: string, href: string): ArticleBlock => ({ type: 'link', text, href });

export const ARTICLES: readonly Article[] = [
  {
    id: 'progressive-overload-guide',
    slug: 'progressive-overload-guide',
    title: 'Progressive Overload: The Principle Behind Every Successful Program',
    seoTitle: 'Progressive Overload Explained: How to Keep Building Muscle',
    metaDescription:
      'Learn what progressive overload is, the different ways to apply it, and a simple double-progression system to keep building muscle and strength.',
    excerpt:
      'Muscles adapt to the demands you place on them. Progressive overload is how you keep those demands rising — here is how to apply it without burning out.',
    category: 'muscle-growth',
    author: AUTHOR,
    publishedAt: '2026-03-02',
    updatedAt: '2026-09-18',
    readingMinutes: 7,
    tags: ['progressive overload', 'hypertrophy', 'programming'],
    featured: true,
    published: true,
    body: [
      p(
        'If there is one principle that separates productive training from simply exercising, it is progressive overload: gradually increasing the demands placed on your muscles over time so they have a reason to keep adapting.',
      ),
      h2('what-is-progressive-overload', 'What progressive overload actually means'),
      p(
        'Your body adapts to the stress you apply to it. Once a weight feels easy for the same number of repetitions, the stimulus is no longer novel and progress slows. Overload means doing slightly more than before — not every session, but consistently over weeks and months.',
      ),
      h2('ways-to-progress', 'Ways to progress'),
      ul(
        'Load — lifting more weight for the same number of reps.',
        'Repetitions — completing more reps with the same weight.',
        'Sets — adding volume, carefully and within your recovery capacity.',
        'Range of motion and control — performing the same work through a fuller range or with a slower lowering phase.',
      ),
      callout(
        'Adding weight at the expense of technique is not progressive overload. It is just a different, easier exercise performed badly.',
      ),
      h2('double-progression', 'A simple system: double progression'),
      p(
        'Double progression is the easiest reliable method for most lifters. Pick a rep range, for example 8–12 reps.',
      ),
      ol(
        'Start with a weight you can lift for 8 reps with 1–3 reps in reserve.',
        'Each session, try to add a rep to one or more sets.',
        'When every set reaches 12 reps with good form, increase the load by the smallest increment available.',
        'Drop back towards 8 reps with the new weight and repeat.',
      ),
      h3('track-everything', 'Track everything'),
      p(
        'Progress you do not record is progress you cannot manage. Log your sets, reps and loads — the workout planner on this site is built for exactly that.',
      ),
      link('Open the workout planner', '/workout-planner'),
      h2('when-progress-stalls', 'When progress stalls'),
      p(
        'Stalls are normal. Before changing your program, check the basics: sleep, total calories, protein intake and stress. If those are in order and you have stalled for two to three weeks, consider a deload week or a small change in exercise selection.',
      ),
      link('Explore structured training programs', '/programs'),
    ],
  },
  {
    id: 'protein-intake-for-muscle-growth',
    slug: 'protein-intake-for-muscle-growth',
    title: 'How Much Protein Do You Need to Build Muscle?',
    seoTitle: 'Protein Intake for Muscle Growth: How Much Do You Need?',
    metaDescription:
      'Evidence-based protein recommendations for building muscle, how to distribute protein across the day, and practical high-protein food choices.',
    excerpt:
      'Protein is the building block of muscle. Here is how much you need, how to spread it across your day and how to hit your target with real food.',
    category: 'nutrition',
    author: AUTHOR,
    publishedAt: '2026-04-11',
    updatedAt: '2026-08-30',
    readingMinutes: 6,
    tags: ['protein', 'nutrition', 'muscle growth'],
    featured: true,
    published: true,
    body: [
      p(
        'Training creates the stimulus for muscle growth, but protein provides the raw material. Without enough of it, your hard work in the gym delivers less than it could.',
      ),
      h2('how-much', 'How much protein per day?'),
      p(
        'For most people who lift weights and want to build muscle, research supports a daily intake of roughly 1.6–2.2 g of protein per kilogram of body weight. During a fat-loss phase, aiming towards the higher end helps preserve lean mass.',
      ),
      callout('Example: an 80 kg lifter would aim for approximately 130–175 g of protein per day.'),
      h2('distribution', 'Spread it across the day'),
      p(
        'Eating protein across three to five meals, each containing roughly 0.3–0.5 g per kg of body weight, is a practical way to reach your target and support muscle protein synthesis throughout the day.',
      ),
      h2('food-sources', 'High-quality protein sources'),
      ul(
        'Lean meat and poultry — chicken, turkey, lean beef',
        'Fish and seafood — salmon, tuna, white fish, prawns',
        'Eggs and dairy — Greek yoghurt, skyr, cottage cheese, milk',
        'Plant-based — tofu, tempeh, lentils, beans, edamame and blended plant proteins',
        'Protein powder — a convenient option when whole-food intake falls short',
      ),
      h2('special-cases', 'A note on health'),
      p(
        'People with kidney disease or other medical conditions should discuss protein intake with their doctor or a registered dietitian before increasing it.',
      ),
      link('Calculate your daily protein target', '/nutrition/calculators'),
    ],
  },
  {
    id: 'squat-technique-guide',
    slug: 'squat-technique-guide',
    title: 'Squat Technique: A Step-by-Step Guide to Squatting Safely',
    seoTitle: 'How to Squat Properly: Step-by-Step Barbell Squat Technique',
    metaDescription:
      'Master barbell squat technique with step-by-step setup, execution cues, common mistakes and how to choose the right depth for your body.',
    excerpt:
      'The squat builds more lower-body muscle and strength than almost any other exercise — when it is done well. Here is how to set up, execute and progress it.',
    category: 'exercise-technique',
    author: AUTHOR,
    publishedAt: '2026-05-06',
    updatedAt: '2026-05-06',
    readingMinutes: 8,
    tags: ['squat', 'technique', 'legs'],
    published: true,
    body: [
      p(
        'The barbell back squat trains the quadriceps, glutes and adductors while challenging your core and upper back. Good technique lets you load it heavily and safely for years.',
      ),
      h2('setup', 'Setup'),
      ol(
        'Set the bar at mid-chest height in a rack with safety bars just below your bottom position.',
        'Step under the bar and place it on your upper back, resting on the muscle — not on your neck.',
        'Grip the bar just outside your shoulders and pull your elbows down to tighten your upper back.',
        'Stand up to unrack, take two or three steps back and set your feet roughly shoulder-width apart with toes slightly turned out.',
      ),
      h2('execution', 'Execution'),
      ol(
        'Take a deep breath into your belly and sides, then brace as if preparing for a punch.',
        'Sit down between your hips, allowing your knees to travel forward and track over your toes.',
        'Descend to the deepest position you can control with a neutral spine and heels on the floor.',
        'Drive up through your whole foot, keeping your chest up and your brace tight.',
      ),
      h2('depth', 'How deep should you squat?'),
      p(
        'Squat as deep as you can while maintaining a neutral lower back and full-foot contact. For most people that is at or below parallel. Deeper squats train the quads and glutes through a longer range of motion, which is beneficial for muscle growth.',
      ),
      h2('common-mistakes', 'Common mistakes'),
      ul(
        'Knees collapsing inwards — think about spreading the floor with your feet.',
        'Heels lifting — work on ankle mobility or temporarily elevate your heels.',
        'Losing the brace at the bottom — reduce the load and practise pausing at depth.',
        'Good-morning squats, where the hips shoot up first — slow down and lead with the chest.',
      ),
      link('See the barbell back squat in the exercise library', '/exercises/barbell-back-squat'),
      link('Explore leg muscles on the anatomy chart', '/muscle-chart?muscle=quadriceps'),
    ],
  },
  {
    id: 'sustainable-fat-loss',
    slug: 'sustainable-fat-loss',
    title: 'Sustainable Fat Loss Without Losing Muscle',
    seoTitle: 'How to Lose Fat Without Losing Muscle: A Practical Guide',
    metaDescription:
      'How to set a sustainable calorie deficit, keep training heavy, prioritise protein and use cardio wisely to lose fat while preserving muscle.',
    excerpt:
      'Fat loss is simple in principle and challenging in practice. These are the levers that matter — and how to pull them without sacrificing muscle.',
    category: 'fat-loss',
    author: AUTHOR,
    publishedAt: '2026-06-14',
    updatedAt: '2026-10-02',
    readingMinutes: 7,
    tags: ['fat loss', 'calorie deficit', 'cutting'],
    featured: true,
    published: true,
    body: [
      p(
        'Losing fat requires a calorie deficit — consuming less energy than you expend. Keeping your muscle while you do it requires something more: continued hard training, plenty of protein and a deficit that is not overly aggressive.',
      ),
      h2('the-deficit', 'Set a moderate deficit'),
      p(
        'A rate of loss of roughly 0.5–1% of body weight per week is a sensible target for most people. Faster rates increase the risk of muscle loss, hunger and fatigue, and are harder to sustain.',
      ),
      h2('keep-training-heavy', 'Keep training heavy'),
      p(
        'Resistance training is the signal that tells your body to keep its muscle. Maintain your training intensity — the weights you lift — even if you slightly reduce total volume later in the diet.',
      ),
      h2('protein', 'Prioritise protein'),
      p(
        'Protein needs are higher in a deficit. Aiming for roughly 1.8–2.2 g per kg of body weight helps preserve lean tissue and keeps you fuller between meals.',
      ),
      h2('cardio', 'Use cardio as a tool'),
      ul(
        'Daily steps are an underrated, low-fatigue way to increase energy expenditure.',
        'Low-intensity cardio such as incline walking is easy to recover from.',
        'High-intensity intervals are effective but add fatigue — use them sparingly.',
      ),
      h2('track-trends', 'Track trends, not single weigh-ins'),
      p(
        'Body weight fluctuates daily due to water, food volume and sodium. Weigh yourself under consistent conditions and compare weekly averages, alongside measurements and photos.',
      ),
      callout('Very low-calorie diets should only be undertaken with medical supervision.'),
      link('Estimate your daily calorie needs', '/nutrition/calculators'),
      link('See the Fat Loss & Definition program', '/programs/fat-loss-and-definition'),
    ],
  },
  {
    id: 'sleep-and-recovery-for-lifters',
    slug: 'sleep-and-recovery-for-lifters',
    title: 'Sleep and Recovery: The Growth That Happens Outside the Gym',
    seoTitle: 'Sleep and Recovery for Muscle Growth: A Lifter’s Guide',
    metaDescription:
      'Why sleep and recovery matter for muscle growth and strength, and practical habits to recover better between training sessions.',
    excerpt:
      'Training breaks you down; recovery builds you back stronger. These practical habits help you recover faster and train harder.',
    category: 'recovery',
    author: AUTHOR,
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-20',
    readingMinutes: 5,
    tags: ['sleep', 'recovery', 'deload'],
    published: true,
    body: [
      p(
        'Muscle is built in response to training, but the actual adaptation happens while you recover. Poor recovery limits how hard you can train and how well your body responds.',
      ),
      h2('sleep', 'Sleep is non-negotiable'),
      p(
        'Most adults function best with 7–9 hours of sleep per night. Insufficient sleep is associated with reduced performance, increased hunger and poorer recovery.',
      ),
      ul(
        'Keep a consistent sleep and wake time, including weekends.',
        'Make your bedroom dark, quiet and cool.',
        'Limit caffeine in the 8 hours before bed.',
        'Wind down without bright screens for the last 30–60 minutes.',
      ),
      h2('deloads', 'Plan deloads'),
      p(
        'A deload is a planned week of reduced training volume or intensity. Taking one every 6–8 weeks — or when performance, sleep and motivation all decline — helps fatigue dissipate so you can keep progressing.',
      ),
      h2('active-recovery', 'Active recovery'),
      p(
        'Light walking, mobility work and easy cycling increase blood flow without adding meaningful fatigue. They are ideal for rest days.',
      ),
      link('Learn more about nutrition and recovery', '/nutrition'),
    ],
  },
  {
    id: 'creatine-evidence-guide',
    slug: 'creatine-evidence-guide',
    title: 'Creatine: What the Evidence Says',
    seoTitle: 'Creatine Monohydrate: Benefits, Dosage and Evidence',
    metaDescription:
      'An evidence-based look at creatine monohydrate: what it does, typical dosage, who may benefit and what it will not do.',
    excerpt:
      'Creatine is one of the most researched sports supplements. Here is what it can and cannot do — without the marketing.',
    category: 'supplements',
    author: AUTHOR,
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 5,
    tags: ['creatine', 'supplements', 'evidence'],
    published: true,
    body: [
      p(
        'Supplements are the smallest piece of the puzzle. Training, nutrition and sleep come first. That said, creatine monohydrate is one of the most extensively studied supplements in sports nutrition.',
      ),
      h2('what-it-does', 'What creatine does'),
      p(
        'Creatine increases the muscles’ stores of phosphocreatine, which helps regenerate energy for short, high-intensity efforts such as heavy sets. Over time, this can support slightly greater training performance and, as a result, muscle and strength gains.',
      ),
      h2('dosage', 'Typical dosage'),
      p(
        'A commonly used intake is 3–5 g of creatine monohydrate per day, taken at any time. A loading phase is optional and simply saturates the muscles faster.',
      ),
      h2('what-it-wont-do', 'What it will not do'),
      ul(
        'It will not replace consistent training or adequate nutrition.',
        'It does not burn fat.',
        'Effects are modest — not dramatic.',
      ),
      callout(
        'Supplements are not medicines and are not intended to diagnose, treat, cure or prevent any disease. Speak to a healthcare professional before using supplements, especially if you have a medical condition or take medication.',
      ),
      link('Read the nutrition guide', '/nutrition'),
    ],
  },
  {
    id: 'building-training-consistency',
    slug: 'building-training-consistency',
    title: 'Motivation Fades. Here Is How to Build Consistency Instead.',
    seoTitle: 'How to Stay Consistent With Training When Motivation Fades',
    metaDescription:
      'Practical strategies to build training consistency: minimum effective sessions, planning, environment design and tracking.',
    excerpt:
      'Motivation gets you started; systems keep you going. Practical ways to turn training into something you simply do.',
    category: 'motivation',
    author: AUTHOR,
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    readingMinutes: 4,
    tags: ['motivation', 'habits', 'consistency'],
    published: true,
    body: [
      p(
        'Every lifter has days when they do not feel like training. The people who make the most progress are not the most motivated — they are the most consistent.',
      ),
      h2('schedule-it', 'Schedule sessions like appointments'),
      p(
        'Decide in advance exactly when you will train each week. A specific time and place removes daily decision-making.',
      ),
      h2('minimum-session', 'Define a minimum session'),
      p(
        'On difficult days, commit only to the warm-up and the first exercise. Most of the time, you will finish the workout. When you do not, you have still kept the habit alive.',
      ),
      h2('track-progress', 'Make progress visible'),
      p(
        'Logging your workouts shows you how far you have come. Seeing your numbers rise is one of the most reliable motivators there is.',
      ),
      h2('get-support', 'Get support'),
      p(
        'Accountability — from a training partner or a coach — dramatically improves adherence. Knowing someone will review your week is a powerful reason to show up.',
      ),
      link('Book a free coaching consultation', '/contact'),
    ],
  },
];
