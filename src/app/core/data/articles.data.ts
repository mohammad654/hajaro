import { Article, ArticleBlock } from '../models';

const AUTHOR = $localize`Coach Hajaro`;

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
    title: $localize`Progressive Overload: The Principle Behind Every Good Program`,
    seoTitle: $localize`Progressive Overload Explained: How to Keep Building Muscle`,
    metaDescription: $localize`Learn what progressive overload is, the different ways to apply it, and a simple double-progression system to keep building muscle and strength.`,
    excerpt: $localize`Muscles adapt to what you ask of them. Progressive overload is how you keep asking a little more. Here is how to apply it without burning out.`,
    category: 'muscle-growth',
    author: AUTHOR,
    publishedAt: '2026-03-02',
    updatedAt: '2026-09-18',
    readingMinutes: 7,
    tags: [$localize`progressive overload`, 'hypertrophy', 'programming'],
    featured: true,
    published: true,
    body: [
      p(
        $localize`If one principle separates training from just exercising, it is progressive overload: slowly increasing what you ask of your muscles over time, so they have a reason to keep adapting.`,
      ),
      h2('what-is-progressive-overload', $localize`What progressive overload actually means`),
      p(
        $localize`Your body adapts to the stress you put on it. Once a weight feels easy for the same number of reps, it is no longer a new challenge and progress slows. Overload means doing slightly more than before. Not every session, but steadily over weeks and months.`,
      ),
      h2('ways-to-progress', $localize`Ways to progress`),
      ul(
        $localize`Weight: lifting more for the same number of reps.`,
        $localize`Reps: doing more reps with the same weight.`,
        $localize`Sets: adding sets, carefully and within what you can recover from.`,
        $localize`Range and control: doing the same work through a fuller range, or lowering the weight more slowly.`,
      ),
      callout(
        $localize`Adding weight while your technique gets worse is not progressive overload. It's a different, easier exercise done badly.`,
      ),
      h2('double-progression', $localize`A simple system: double progression`),
      p(
        $localize`Double progression is the simplest reliable method for most lifters. Pick a rep range, for example 8 to 12 reps.`,
      ),
      ol(
        $localize`Start with a weight you can lift for 8 reps with 1 to 3 reps to spare.`,
        $localize`Each session, try to add a rep to one or more sets.`,
        $localize`When every set reaches 12 reps with good form, add the smallest weight step available.`,
        $localize`Drop back towards 8 reps with the new weight and repeat.`,
      ),
      h3('track-everything', $localize`Track everything`),
      p(
        $localize`Progress you don't write down is progress you can't steer. Log your sets, reps and weights. The workout planner on this site is made for exactly that.`,
      ),
      link($localize`Open the workout planner`, '/workout-planner'),
      h2('when-progress-stalls', $localize`When progress stalls`),
      p(
        $localize`Getting stuck is normal. Before you change your program, check the basics: sleep, total calories, protein and stress. If those are fine and you've been stuck for two or three weeks, try a deload week or a small change in exercises.`,
      ),
      link($localize`See the training programs`, '/programs'),
    ],
  },
  {
    id: 'protein-intake-for-muscle-growth',
    slug: 'protein-intake-for-muscle-growth',
    title: $localize`How Much Protein Do You Need to Build Muscle?`,
    seoTitle: $localize`Protein Intake for Muscle Growth: How Much Do You Need?`,
    metaDescription: $localize`What research says about protein for building muscle, how to spread it over the day, and practical high-protein foods.`,
    excerpt: $localize`Protein is what muscle is made of. Here is how much you need, how to spread it over your day and how to reach your target with normal food.`,
    category: 'nutrition',
    author: AUTHOR,
    publishedAt: '2026-04-11',
    updatedAt: '2026-08-30',
    readingMinutes: 6,
    tags: ['protein', 'nutrition', $localize`muscle growth`],
    featured: true,
    published: true,
    body: [
      p(
        $localize`Training gives your muscles a reason to grow; protein is the material they grow from. Without enough of it, your work in the gym gives you less than it could.`,
      ),
      h2('how-much', $localize`How much protein per day?`),
      p(
        $localize`For most people who lift and want to build muscle, research supports about 1.6 to 2.2 g of protein per kilogram of body weight per day. During a fat-loss phase, aiming for the higher end helps you keep your muscle.`,
      ),
      callout(
        $localize`Example: someone who weighs 80 kg would aim for about 130 to 175 g of protein a day.`,
      ),
      h2('distribution', $localize`Spread it across the day`),
      p(
        $localize`Eating protein over three to five meals, each with about 0.3 to 0.5 g per kg of body weight, is a practical way to reach your target and keep muscle building going through the day.`,
      ),
      h2('food-sources', $localize`High-quality protein sources`),
      ul(
        $localize`Lean meat and poultry: chicken, turkey, lean beef`,
        $localize`Fish and seafood: salmon, tuna, white fish, prawns`,
        $localize`Eggs and dairy: Greek yoghurt, skyr, cottage cheese, milk`,
        $localize`Plant-based: tofu, tempeh, lentils, beans, edamame and blended plant proteins`,
        $localize`Protein powder: handy when normal food falls short`,
      ),
      h2('special-cases', $localize`A note on health`),
      p(
        $localize`If you have kidney disease or another medical condition, talk to your doctor or a registered dietitian before eating more protein.`,
      ),
      link($localize`Calculate your daily protein target`, '/nutrition/calculators'),
    ],
  },
  {
    id: 'squat-technique-guide',
    slug: 'squat-technique-guide',
    title: $localize`Squat Technique: Squatting Safely, Step by Step`,
    seoTitle: $localize`How to Squat Properly: Step-by-Step Barbell Squat Technique`,
    metaDescription: $localize`Learn the barbell squat: step-by-step setup, cues for the movement, common mistakes and how to find the right depth for your body.`,
    excerpt: $localize`Done well, the squat builds more lower-body muscle and strength than almost any other exercise. Here is how to set up, perform and progress it.`,
    category: 'exercise-technique',
    author: AUTHOR,
    publishedAt: '2026-05-06',
    updatedAt: '2026-05-06',
    readingMinutes: 8,
    tags: ['squat', 'technique', 'legs'],
    published: true,
    body: [
      p(
        $localize`The barbell back squat trains your quads, glutes and adductors, and asks a lot of your core and upper back. Good technique lets you load it heavily and safely for years.`,
      ),
      h2('setup', $localize`Setup`),
      ol(
        $localize`Set the bar at mid-chest height in a rack with safety bars just below your bottom position.`,
        $localize`Step under the bar and place it on your upper back, resting on the muscle, not on your neck.`,
        $localize`Grip the bar just outside your shoulders and pull your elbows down to tighten your upper back.`,
        $localize`Stand up to unrack, take two or three steps back and set your feet roughly shoulder-width apart with toes slightly turned out.`,
      ),
      h2('execution', $localize`Execution`),
      ol(
        $localize`Take a deep breath into your belly and sides, then brace as if preparing for a punch.`,
        $localize`Sit down between your hips, allowing your knees to travel forward and track over your toes.`,
        $localize`Descend to the deepest position you can control with a neutral spine and heels on the floor.`,
        $localize`Drive up through your whole foot, keeping your chest up and your brace tight.`,
      ),
      h2('depth', $localize`How deep should you squat?`),
      p(
        $localize`Squat as deep as you can while keeping a neutral lower back and your whole foot on the floor. For most people that is at or below parallel. Deeper squats train the quads and glutes through a longer range, which helps muscle growth.`,
      ),
      h2('common-mistakes', $localize`Common mistakes`),
      ul(
        $localize`Knees falling inwards: think about spreading the floor apart with your feet.`,
        $localize`Heels lifting: work on ankle mobility, or put something under your heels for now.`,
        $localize`Losing tension at the bottom: use less weight and practise pausing at the bottom.`,
        $localize`Hips shooting up first (a 'good-morning squat'): slow down and lead with your chest.`,
      ),
      link(
        $localize`See the barbell back squat in the exercise library`,
        '/exercises/barbell-back-squat',
      ),
      link($localize`See the leg muscles on the anatomy chart`, '/muscle-chart?muscle=quadriceps'),
    ],
  },
  {
    id: 'sustainable-fat-loss',
    slug: 'sustainable-fat-loss',
    title: $localize`Losing Fat Without Losing Muscle`,
    seoTitle: $localize`How to Lose Fat Without Losing Muscle: A Practical Guide`,
    metaDescription: $localize`How to set a calorie deficit you can keep up, keep training heavy, eat enough protein and use cardio well, so you lose fat and keep your muscle.`,
    excerpt: $localize`Fat loss is simple on paper and hard in practice. These are the things that matter, and how to use them without losing muscle.`,
    category: 'fat-loss',
    author: AUTHOR,
    publishedAt: '2026-06-14',
    updatedAt: '2026-10-02',
    readingMinutes: 7,
    tags: [$localize`fat loss`, $localize`calorie deficit`, 'cutting'],
    featured: true,
    published: true,
    body: [
      p(
        $localize`Losing fat requires a calorie deficit: taking in less energy than you use. Keeping your muscle while you do it takes more: hard training, plenty of protein and a deficit that isn't too big.`,
      ),
      h2('the-deficit', $localize`Set a moderate deficit`),
      p(
        $localize`Losing about 0.5 to 1% of your body weight per week is a sensible target for most people. Going faster raises the risk of muscle loss, hunger and tiredness, and is harder to keep up.`,
      ),
      h2('keep-training-heavy', $localize`Keep training heavy`),
      p(
        $localize`Strength training is the signal that tells your body to keep its muscle. Keep lifting the same weights, even if you do slightly fewer sets later in the diet.`,
      ),
      h2('protein', $localize`Eat enough protein`),
      p(
        $localize`You need more protein in a deficit. Aiming for about 1.8 to 2.2 g per kg of body weight helps you keep your muscle and keeps you fuller between meals.`,
      ),
      h2('cardio', $localize`Use cardio as a tool`),
      ul(
        $localize`Daily steps are an underrated way to burn more energy without getting tired.`,
        $localize`Easy cardio like uphill walking is easy to recover from.`,
        $localize`Hard intervals work, but they make you tired, so use them sparingly.`,
      ),
      h2('track-trends', $localize`Watch the trend, not a single weigh-in`),
      p(
        $localize`Your weight changes every day because of water, how much food is in you and salt. Weigh yourself under the same conditions and compare weekly averages, together with measurements and photos.`,
      ),
      callout($localize`Only follow a very low-calorie diet under medical supervision.`),
      link($localize`Estimate your daily calorie needs`, '/nutrition/calculators'),
      link($localize`See the Fat Loss & Definition program`, '/programs/fat-loss-and-definition'),
    ],
  },
  {
    id: 'sleep-and-recovery-for-lifters',
    slug: 'sleep-and-recovery-for-lifters',
    title: $localize`Sleep and Recovery: Where Muscle Is Built`,
    seoTitle: $localize`Sleep and Recovery for Muscle Growth: A Lifter’s Guide`,
    metaDescription: $localize`Why sleep and recovery matter for muscle growth and strength, and practical habits to recover better between training sessions.`,
    excerpt: $localize`Training tires your muscles out; recovery is when they come back stronger. These habits help you recover faster and train harder.`,
    category: 'recovery',
    author: AUTHOR,
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-20',
    readingMinutes: 5,
    tags: ['sleep', 'recovery', 'deload'],
    published: true,
    body: [
      p(
        $localize`Training is the reason muscle grows, but the growing itself happens while you recover. Poor recovery limits how hard you can train and how well your body responds.`,
      ),
      h2('sleep', $localize`Sleep comes first`),
      p(
        $localize`Most adults do best with 7 to 9 hours of sleep a night. Too little sleep goes together with worse performance, more hunger and poorer recovery.`,
      ),
      ul(
        $localize`Go to bed and get up at the same time, weekends included.`,
        $localize`Make your bedroom dark, quiet and cool.`,
        $localize`Limit caffeine in the 8 hours before bed.`,
        $localize`Wind down without bright screens in the last 30 to 60 minutes.`,
      ),
      h2('deloads', $localize`Plan deloads`),
      p(
        $localize`A deload is a planned week with fewer sets or lighter weights. Taking one every 6 to 8 weeks, or when performance, sleep and motivation all drop, lets fatigue clear so you can keep progressing.`,
      ),
      h2('active-recovery', $localize`Active recovery`),
      p(
        $localize`Light walking, mobility work and easy cycling get your blood flowing without making you tired. They're ideal for rest days.`,
      ),
      link($localize`Learn more about nutrition and recovery`, '/nutrition'),
    ],
  },
  {
    id: 'creatine-evidence-guide',
    slug: 'creatine-evidence-guide',
    title: $localize`Creatine: What the Research Says`,
    seoTitle: $localize`Creatine Monohydrate: Benefits, Dosage and Evidence`,
    metaDescription: $localize`What research says about creatine monohydrate: what it does, the usual dose, who may benefit and what it won't do.`,
    excerpt: $localize`Creatine is one of the most researched sports supplements. Here is what it can and can't do, without the marketing.`,
    category: 'supplements',
    author: AUTHOR,
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingMinutes: 5,
    tags: ['creatine', 'supplements', 'evidence'],
    published: true,
    body: [
      p(
        $localize`Supplements are the smallest piece of the puzzle. Training, food and sleep come first. That said, creatine monohydrate is one of the most studied supplements in sports nutrition.`,
      ),
      h2('what-it-does', $localize`What creatine does`),
      p(
        $localize`Creatine fills up your muscles' stores of phosphocreatine, which helps them make energy for short, hard efforts like heavy sets. Over time this can help you train a little better, and so gain a little more muscle and strength.`,
      ),
      h2('dosage', $localize`Typical dosage`),
      p(
        $localize`A common intake is 3 to 5 g of creatine monohydrate a day, at any time of day. A loading phase is optional; it only fills your muscles faster.`,
      ),
      h2('what-it-wont-do', $localize`What it will not do`),
      ul(
        $localize`It won't replace consistent training or good food.`,
        $localize`It does not burn fat.`,
        $localize`The effects are small.`,
      ),
      callout(
        $localize`Supplements are not medicines and are not meant to diagnose, treat, cure or prevent any disease. Talk to a healthcare professional before using supplements, especially if you have a medical condition or take medication.`,
      ),
      link($localize`Read the nutrition guide`, '/nutrition'),
    ],
  },
  {
    id: 'building-training-consistency',
    slug: 'building-training-consistency',
    title: $localize`When Motivation Fades: How to Keep Training Anyway`,
    seoTitle: $localize`How to Stay Consistent With Training When Motivation Fades`,
    metaDescription: $localize`Practical ways to train consistently: a minimum session, planning ahead, making it easy and tracking your progress.`,
    excerpt: $localize`Motivation gets you started; habits keep you going. Practical ways to make training something you just do.`,
    category: 'motivation',
    author: AUTHOR,
    publishedAt: '2026-09-25',
    updatedAt: '2026-09-25',
    readingMinutes: 4,
    tags: ['motivation', 'habits', 'consistency'],
    published: true,
    body: [
      p(
        $localize`Everyone who lifts has days when they don't feel like training. The people who progress most are usually the ones who keep showing up on those days.`,
      ),
      h2('schedule-it', $localize`Schedule sessions like appointments`),
      p(
        $localize`Decide in advance when you'll train each week. A fixed time and place means you don't have to decide every day.`,
      ),
      h2('minimum-session', $localize`Define a minimum session`),
      p(
        $localize`On hard days, promise yourself only the warm-up and the first exercise. Most of the time you'll finish the workout. When you don't, you've still kept the habit going.`,
      ),
      h2('track-progress', $localize`Make progress visible`),
      p(
        $localize`Logging your workouts shows you how far you've come. Seeing your numbers go up keeps you going like little else does.`,
      ),
      h2('get-support', $localize`Get support`),
      p(
        $localize`Someone to answer to, a training partner or a coach, makes it much easier to stick with it. Knowing someone will look at your week is a good reason to show up.`,
      ),
      link($localize`Book a free intro`, '/contact'),
    ],
  },
];
