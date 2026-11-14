import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { NUTRITION_DISCLAIMER } from '../../core/data/nutrition.data';
import { FieldError } from '../../shared/forms/field-error';
import {
  ACTIVITY_FACTORS,
  ActivityLevel,
  NutritionGoal,
  Sex,
  calculateBmi,
  calculateCalories,
  calculateMacros,
  calculateProtein,
  calculateWater,
} from './nutrition-calculations';

const LIMITS = {
  age: [16, 90],
  height: [120, 230],
  weight: [35, 250],
  training: [0, 4],
} as const;

/**
 * One form feeds five calculators (BMI, calories, protein, macros, water) so visitors enter
 * their details once. Results recompute live and only appear when every input is valid.
 */
@Component({
  selector: 'app-nutrition-calculator',
  imports: [ReactiveFormsModule, DecimalPipe, FieldError],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nutrition-calculator.html',
  styleUrl: './nutrition-calculator.scss',
})
export class NutritionCalculator {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly limits = LIMITS;
  protected readonly disclaimer = NUTRITION_DISCLAIMER;
  protected readonly activityOptions = Object.entries(ACTIVITY_FACTORS) as [
    ActivityLevel,
    { label: string },
  ][];

  protected readonly form = this.fb.group({
    sex: this.fb.control<Sex>('male'),
    age: this.fb.control(30, [
      Validators.required,
      Validators.min(LIMITS.age[0]),
      Validators.max(LIMITS.age[1]),
    ]),
    heightCm: this.fb.control(178, [
      Validators.required,
      Validators.min(LIMITS.height[0]),
      Validators.max(LIMITS.height[1]),
    ]),
    weightKg: this.fb.control(80, [
      Validators.required,
      Validators.min(LIMITS.weight[0]),
      Validators.max(LIMITS.weight[1]),
    ]),
    activity: this.fb.control<ActivityLevel>('moderate'),
    goal: this.fb.control<NutritionGoal>('maintain'),
    trainingHours: this.fb.control(1, [
      Validators.required,
      Validators.min(LIMITS.training[0]),
      Validators.max(LIMITS.training[1]),
    ]),
  });

  private readonly value = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });
  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  protected readonly results = computed(() => {
    this.value();
    if (this.status() !== 'VALID') return null;
    const v = this.form.getRawValue();
    const calories = calculateCalories(v.sex, v.weightKg, v.heightCm, v.age, v.activity, v.goal);
    return {
      bmi: calculateBmi(v.weightKg, v.heightCm),
      calories,
      protein: calculateProtein(v.weightKg, v.goal),
      macros: calculateMacros(calories.target, v.weightKg, v.goal),
      waterL: calculateWater(v.weightKg, v.trainingHours),
    };
  });
}
