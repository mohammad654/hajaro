/**
 * Pure nutrition estimation functions. These produce general population estimates only —
 * never individual medical or dietary advice.
 */
export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';
export type NutritionGoal = 'lose' | 'maintain' | 'gain';

/** Standard activity multipliers applied to resting energy expenditure. */
export const ACTIVITY_FACTORS: Readonly<Record<ActivityLevel, { factor: number; label: string }>> =
  {
    sedentary: { factor: 1.2, label: 'Sedentary (little or no exercise)' },
    light: { factor: 1.375, label: 'Lightly active (1–3 sessions / week)' },
    moderate: { factor: 1.55, label: 'Moderately active (3–5 sessions / week)' },
    very: { factor: 1.725, label: 'Very active (6–7 sessions / week)' },
    extreme: { factor: 1.9, label: 'Extremely active (physical job + training)' },
  };

/** Calorie adjustment relative to maintenance for each goal. */
const GOAL_ADJUSTMENT: Readonly<Record<NutritionGoal, number>> = {
  lose: -0.2,
  maintain: 0,
  gain: 0.1,
};

/** Protein range in g per kg body weight for people who resistance train. */
export const PROTEIN_RANGE_G_PER_KG: Readonly<Record<NutritionGoal, readonly [number, number]>> = {
  lose: [1.8, 2.2],
  maintain: [1.6, 2.0],
  gain: [1.6, 2.2],
};

const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;
const FAT_SHARE_OF_CALORIES = 0.25;
const WATER_ML_PER_KG = 35;
const WATER_ML_PER_TRAINING_HOUR = 500;
const ML_PER_LITRE = 1000;

export interface BmiResult {
  readonly bmi: number;
  readonly category: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const category =
    bmi < 18.5
      ? 'Underweight'
      : bmi < 25
        ? 'Healthy weight range'
        : bmi < 30
          ? 'Overweight'
          : 'Obesity range';
  return { bmi: round(bmi, 1), category };
}

/** Mifflin–St Jeor resting energy expenditure. */
export function restingEnergy(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export interface CalorieResult {
  readonly bmr: number;
  readonly maintenance: number;
  readonly target: number;
}

export function calculateCalories(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: ActivityLevel,
  goal: NutritionGoal,
): CalorieResult {
  const bmr = restingEnergy(sex, weightKg, heightCm, age);
  const maintenance = bmr * ACTIVITY_FACTORS[activity].factor;
  const target = maintenance * (1 + GOAL_ADJUSTMENT[goal]);
  return {
    bmr: Math.round(bmr),
    maintenance: Math.round(maintenance),
    target: Math.round(target / 10) * 10,
  };
}

export function calculateProtein(
  weightKg: number,
  goal: NutritionGoal,
): { min: number; max: number } {
  const [low, high] = PROTEIN_RANGE_G_PER_KG[goal];
  return { min: Math.round(weightKg * low), max: Math.round(weightKg * high) };
}

export interface MacroResult {
  readonly proteinG: number;
  readonly fatG: number;
  readonly carbsG: number;
  readonly proteinPct: number;
  readonly fatPct: number;
  readonly carbsPct: number;
}

/** Protein first, ~25% of calories from fat, remaining calories from carbohydrates. */
export function calculateMacros(
  calories: number,
  weightKg: number,
  goal: NutritionGoal,
): MacroResult {
  const protein = calculateProtein(weightKg, goal);
  const proteinG = Math.round((protein.min + protein.max) / 2);
  const fatG = Math.round((calories * FAT_SHARE_OF_CALORIES) / KCAL_PER_G.fat);
  const remaining = calories - proteinG * KCAL_PER_G.protein - fatG * KCAL_PER_G.fat;
  const carbsG = Math.max(0, Math.round(remaining / KCAL_PER_G.carbs));
  const total =
    proteinG * KCAL_PER_G.protein + fatG * KCAL_PER_G.fat + carbsG * KCAL_PER_G.carbs || 1;
  return {
    proteinG,
    fatG,
    carbsG,
    proteinPct: Math.round(((proteinG * KCAL_PER_G.protein) / total) * 100),
    fatPct: Math.round(((fatG * KCAL_PER_G.fat) / total) * 100),
    carbsPct: Math.round(((carbsG * KCAL_PER_G.carbs) / total) * 100),
  };
}

/** Baseline ~35 ml/kg plus ~0.5 L per hour of training. */
export function calculateWater(weightKg: number, trainingHoursPerDay: number): number {
  const ml = weightKg * WATER_ML_PER_KG + trainingHoursPerDay * WATER_ML_PER_TRAINING_HOUR;
  return round(ml / ML_PER_LITRE, 1);
}

function round(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
