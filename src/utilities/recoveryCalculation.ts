import { useUserProfileStore } from "@/store/userProfileStore";
import { DailyLog } from "@/types/models";

export type RecoveryCalculationInput = {
  sleepHours: number;
  proteinPerKgBwGrams: number;
  calories: number;
  calorieGoal: number;
  proteinPerKgBwGoalGrams: number;
};

export const getRecoveryCalculationInput = (
  daylog?: DailyLog,
): RecoveryCalculationInput => {
  const profile = useUserProfileStore.getState().profile;

  const calorieGoal = profile?.calorieGoal ?? 2000;
  const proteinPerKgBwGoalGrams = profile?.proteinPerKgBwGoalGrams ?? 1.6;
  const weightKg = profile?.weightKg ?? 70;

  const sleepHours =
    daylog?.sleep?.reduce((sum, s) => sum + s.hoursSlept, 0) ?? 0;
  const calories = daylog?.meals?.reduce((sum, m) => sum + m.calories, 0) ?? 0;
  const totalProtein =
    daylog?.meals?.reduce((sum, m) => sum + m.proteinGrams, 0) ?? 0;

  return {
    sleepHours,
    proteinPerKgBwGrams: totalProtein / (weightKg || 1),
    calories,
    calorieGoal,
    proteinPerKgBwGoalGrams,
  };
};

export const recoveryCalculation = ({
  sleepHours,
  proteinPerKgBwGrams,
  calories,
  calorieGoal = 2000,
  proteinPerKgBwGoalGrams = 1.6,
}: RecoveryCalculationInput) => {
  const sleepScore = 1 / (1 + 5 ** -(sleepHours - 7));
  const proteinScore =
    1 / (1 + 500 ** -(proteinPerKgBwGrams - proteinPerKgBwGoalGrams));
  const calorieScore = 1 / (1 + 1.005 ** -(calories - calorieGoal));
  // all scores are between 0 and 1

  const recoveryIndex = sleepScore * 0.5 + proteinScore * 0.25 + calorieScore * 0.25;
  // sleep is more important than diet here
  return recoveryIndex;
};
