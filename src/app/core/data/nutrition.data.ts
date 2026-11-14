export interface NutritionTopic {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly summary: string;
  readonly points: readonly string[];
}

export const NUTRITION_TOPICS: readonly NutritionTopic[] = [
  {
    id: 'muscle-building-nutrition',
    title: 'Muscle-building nutrition',
    icon: 'dumbbell',
    summary:
      'Building muscle is easiest with a small calorie surplus, high protein and consistent training.',
    points: [
      'A modest surplus of roughly 5–10% above maintenance limits unnecessary fat gain',
      'Aim to gain around 0.25–0.5% of body weight per month as an intermediate lifter',
      'Prioritise protein and carbohydrates around training to fuel performance',
    ],
  },
  {
    id: 'fat-loss-nutrition',
    title: 'Fat-loss nutrition',
    icon: 'flame',
    summary:
      'Fat loss requires a sustained calorie deficit while protecting muscle with protein and training.',
    points: [
      'Target a loss of about 0.5–1% of body weight per week',
      'Keep protein high and fill meals with vegetables for volume and fibre',
      'Plan for diet breaks or maintenance phases during long diets',
    ],
  },
  {
    id: 'macronutrients',
    title: 'Macronutrients explained',
    icon: 'pie',
    summary:
      'Protein, carbohydrates and fats each play a distinct role. Total calories determine weight change; macros shape body composition and performance.',
    points: [
      'Protein: 4 kcal/g — builds and repairs muscle tissue',
      'Carbohydrates: 4 kcal/g — the primary fuel for hard training',
      'Fats: 9 kcal/g — essential for hormones and absorbing fat-soluble vitamins',
    ],
  },
  {
    id: 'protein',
    title: 'Protein',
    icon: 'egg',
    summary:
      'The most important macronutrient for lifters. Most people benefit from 1.6–2.2 g per kg of body weight.',
    points: [
      'Spread intake across 3–5 meals',
      'Include a quality protein source in every meal',
      'Higher intakes help preserve muscle in a deficit',
    ],
  },
  {
    id: 'carbohydrates',
    title: 'Carbohydrates',
    icon: 'wheat',
    summary: 'Carbohydrates fuel high-intensity training and help you recover between sessions.',
    points: [
      'Favour minimally processed sources: oats, rice, potatoes, fruit, wholegrains',
      'Place a larger share of your carbohydrates around your training',
      'Fibre supports digestion and fullness',
    ],
  },
  {
    id: 'fats',
    title: 'Fats',
    icon: 'droplet',
    summary: 'Dietary fats support hormonal health. A typical range is 20–35% of total calories.',
    points: [
      'Include oily fish, nuts, seeds, olive oil and avocado',
      'Avoid dropping fat intake extremely low for long periods',
      'Fats are calorie-dense — portion with care during a diet',
    ],
  },
  {
    id: 'meal-planning',
    title: 'Meal planning',
    icon: 'calendar',
    summary: 'A simple, repeatable meal structure makes consistency far easier than willpower.',
    points: [
      'Build each meal around protein, then add vegetables, carbohydrates and fats',
      'Batch-cook staples two or three times per week',
      'Keep convenient high-protein options available for busy days',
    ],
  },
  {
    id: 'healthy-food-choices',
    title: 'Healthy food choices',
    icon: 'leaf',
    summary:
      'Most of your diet should come from whole, minimally processed foods — with room for foods you enjoy.',
    points: [
      'Eat a variety of colourful fruit and vegetables daily',
      'Choose lean proteins and wholegrains most of the time',
      'Flexibility improves long-term adherence',
    ],
  },
  {
    id: 'hydration',
    title: 'Hydration',
    icon: 'droplet',
    summary:
      'Even mild dehydration can reduce training performance. Needs rise with body size, heat and sweat loss.',
    points: [
      'Drink regularly throughout the day',
      'Pale-yellow urine is a simple practical indicator',
      'Replace fluids and electrolytes after long or hot sessions',
    ],
  },
  {
    id: 'supplements',
    title: 'Supplements education',
    icon: 'capsule',
    summary:
      'Supplements are optional and support — never replace — a well-structured diet. They are not medical treatments.',
    points: [
      'Well-researched options include creatine monohydrate, protein powder, caffeine and vitamin D (if deficient)',
      'Look for third-party tested products',
      'Consult a healthcare professional before use if you have a medical condition or take medication',
    ],
  },
  {
    id: 'recovery-and-sleep',
    title: 'Recovery & sleep',
    icon: 'moon',
    summary:
      'Sleep is when your body repairs and adapts. Poor sleep undermines appetite control, performance and recovery.',
    points: [
      'Aim for 7–9 hours per night',
      'Keep a consistent sleep schedule',
      'Manage stress — it affects recovery as much as training does',
    ],
  },
];

export const NUTRITION_DISCLAIMER =
  'This information is general education, not individual medical or dietary advice. Consult a doctor or registered dietitian before making significant changes to your diet, particularly if you are pregnant, have a medical condition or take medication.';
