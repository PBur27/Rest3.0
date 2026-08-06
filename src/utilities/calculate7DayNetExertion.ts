// utils/calculate7DayNetExertion.ts
import { DailyLog, MuscleGroup } from "@/types/models";
import { exertionCalculation } from "./exertionCalculation";
import { recoveryCalculation } from "./recoveryCalculation";
import { toLocalDateKey, shiftDateKey } from "./dates";

export const calculate7DayNetExertion = (
  history: DailyLog[],
  targetDate: Date = new Date(),
) => {
  // calculate the exertion from the 7 days preceding the target date
  const targetDateKey = toLocalDateKey(targetDate);
  const sevenDaysAgoKey = shiftDateKey(targetDateKey, -6);
};
