export interface NutritionTopic {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly summary: string;
  readonly points: readonly string[];
}

/** Nutrition guide topics, translated per language with $localize (src/locale). */
export const NUTRITION_TOPICS: readonly NutritionTopic[] = [
  {
    id: 'muscle-building-nutrition',
    title: $localize`Eating to build muscle`,
    icon: 'dumbbell',
    summary: $localize`Muscle builds most easily with a small calorie surplus, plenty of protein and consistent training.`,
    points: [
      $localize`A small surplus of about 5 to 10% above maintenance limits unnecessary fat gain`,
      $localize`If you've trained for a while, aim to gain about 0.25 to 0.5% of your body weight per month`,
      $localize`Eat protein and carbohydrates around your training to fuel it`,
    ],
  },
  {
    id: 'fat-loss-nutrition',
    title: $localize`Eating to lose fat`,
    icon: 'flame',
    summary: $localize`Fat loss needs a calorie deficit you keep up over time, while protein and training protect your muscle.`,
    points: [
      $localize`Aim to lose about 0.5 to 1% of your body weight per week`,
      $localize`Keep protein high, and fill your meals with vegetables for volume and fibre`,
      $localize`On a long diet, plan diet breaks or maintenance phases`,
    ],
  },
  {
    id: 'macronutrients',
    title: $localize`Macronutrients explained`,
    icon: 'pie',
    summary: $localize`Protein, carbohydrates and fat each do a different job. Total calories decide whether your weight changes; macros shape your body composition and performance.`,
    points: [
      $localize`Protein: 4 kcal per gram. Builds and repairs muscle.`,
      $localize`Carbohydrates: 4 kcal per gram. The main fuel for hard training.`,
      $localize`Fat: 9 kcal per gram. Needed for hormones and for absorbing fat-soluble vitamins.`,
    ],
  },
  {
    id: 'protein',
    title: $localize`Protein`,
    icon: 'egg',
    summary: $localize`The most important macronutrient for people who lift. Most people do well with 1.6 to 2.2 g per kg of body weight.`,
    points: [
      $localize`Spread it over 3 to 5 meals`,
      $localize`Include a good protein source in every meal`,
      $localize`Eating more protein helps keep muscle while in a deficit`,
    ],
  },
  {
    id: 'carbohydrates',
    title: $localize`Carbohydrates`,
    icon: 'wheat',
    summary: $localize`Carbohydrates fuel hard training and help you recover between sessions.`,
    points: [
      $localize`Choose minimally processed sources: oats, rice, potatoes, fruit, wholegrains`,
      $localize`Eat a bigger share of your carbohydrates around your training`,
      $localize`Fibre helps digestion and keeps you full`,
    ],
  },
  {
    id: 'fats',
    title: $localize`Fat`,
    icon: 'droplet',
    summary: $localize`Fat in your diet supports your hormones. A common range is 20 to 35% of your total calories.`,
    points: [
      $localize`Eat oily fish, nuts, seeds, olive oil and avocado`,
      $localize`Don't keep your fat intake extremely low for long periods`,
      $localize`Fat is calorie-dense, so watch portions while dieting`,
    ],
  },
  {
    id: 'meal-planning',
    title: $localize`Planning meals`,
    icon: 'calendar',
    summary: $localize`A simple meal structure you repeat makes consistency much easier than relying on willpower.`,
    points: [
      $localize`Build each meal around protein, then add vegetables, carbohydrates and fat`,
      $localize`Batch-cook basics two or three times a week`,
      $localize`Keep easy high-protein options at hand for busy days`,
    ],
  },
  {
    id: 'healthy-food-choices',
    title: $localize`Healthy food choices`,
    icon: 'leaf',
    summary: $localize`Most of what you eat should be whole, minimally processed food, with room for food you enjoy.`,
    points: [
      $localize`Eat a variety of colourful fruit and vegetables every day`,
      $localize`Choose lean protein and wholegrains most of the time`,
      $localize`Some flexibility makes it easier to keep going for years`,
    ],
  },
  {
    id: 'hydration',
    title: $localize`Drinking enough`,
    icon: 'droplet',
    summary: $localize`Even mild dehydration can make your training worse. You need more when you're bigger, it's hot or you sweat a lot.`,
    points: [
      $localize`Drink regularly throughout the day`,
      $localize`Pale yellow urine is a simple, practical sign`,
      $localize`Replace fluids and salts after long or hot sessions`,
    ],
  },
  {
    id: 'supplements',
    title: $localize`About supplements`,
    icon: 'capsule',
    summary: $localize`Supplements are optional. They can support a good diet, never replace it, and they are not medicine.`,
    points: [
      $localize`Well-researched options include creatine monohydrate, protein powder, caffeine and vitamin D (if you're low)`,
      $localize`Look for products tested by an independent lab`,
      $localize`Talk to a healthcare professional first if you have a medical condition or take medication`,
    ],
  },
  {
    id: 'recovery-and-sleep',
    title: $localize`Recovery and sleep`,
    icon: 'moon',
    summary: $localize`Your body repairs and adapts while you sleep. Poor sleep makes appetite, training and recovery harder.`,
    points: [
      $localize`Aim for 7 to 9 hours a night`,
      $localize`Go to bed and get up at similar times`,
      $localize`Manage stress: it affects recovery as much as training does`,
    ],
  },
];

export const NUTRITION_DISCLAIMER = $localize`This is general information, not personal medical or dietary advice. Talk to a doctor or registered dietitian before making big changes to what you eat, especially if you're pregnant, have a medical condition or take medication.`;
