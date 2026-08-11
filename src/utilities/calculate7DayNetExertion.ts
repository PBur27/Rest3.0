import { DailyLog, MuscleGroup } from "@/types/models";
import { exertionCalculation } from "./exertionCalculation";
import {
  getRecoveryCalculationInput,
  recoveryCalculation,
} from "./recoveryCalculation";
import { toLocalDateKey, shiftDateKey } from "./dates";

const BASELINE_RECOVERY_INDEX = 0.5;

export const calculate7DayNetExertion = (
  history: Record<string, DailyLog>,
  targetDate: Date = new Date(),
): Record<MuscleGroup, number> => {
  const targetDateKey = toLocalDateKey(targetDate);

  const getSevenDayList = (targetDateKey: string) => {
    return Array.from({ length: 7 }, (_, index) => {
      const dateString = shiftDateKey(targetDateKey, index - 6);
      return { dateString };
    });
  };

  const accumulatedMuscleLoad: Record<MuscleGroup, number> = {
    abs: 0,
    biceps: 0,
    calves: 0,
    chest: 0,
    erectorSpinae: 0,
    forearms: 0,
    glutes: 0,
    hamstrings: 0,
    lats: 0,
    obliques: 0,
    quads: 0,
    rhomboids: 0,
    shoulders: 0,
    traps: 0,
    triceps: 0,
  };

  let previousRecoveryIndex = BASELINE_RECOVERY_INDEX;

  for (const day of getSevenDayList(targetDateKey)) {
    const dailyLog = history[day.dateString];
    const decayRate = 0.2 + 0.4 * previousRecoveryIndex;
    const dayLoad = dailyLog ? exertionCalculation(dailyLog.exercises) : {};

    for (const muscle in accumulatedMuscleLoad) {
      const muscleKey = muscle as MuscleGroup;
      const muscleLoadFromToday = dayLoad[muscleKey] ?? 0;
      const muscleLoadFromPreviousDays = accumulatedMuscleLoad[muscleKey];

      const adjustedMuscleLoad = muscleLoadFromPreviousDays * (1 - decayRate);

      accumulatedMuscleLoad[muscleKey] = Math.min(
        1,
        adjustedMuscleLoad + muscleLoadFromToday,
      );
    }

    previousRecoveryIndex = dailyLog
      ? recoveryCalculation(getRecoveryCalculationInput(dailyLog))
      : BASELINE_RECOVERY_INDEX;
  }

  return accumulatedMuscleLoad;
};
