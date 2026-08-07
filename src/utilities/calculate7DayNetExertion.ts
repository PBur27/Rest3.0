// utils/calculate7DayNetExertion.ts
import { DailyLog, MuscleGroup } from "@/types/models";
import { exertionCalculation } from "./exertionCalculation";
import { recoveryCalculation } from "./recoveryCalculation";
import { toLocalDateKey, shiftDateKey } from "./dates";

export const calculate7DayNetExertion = (
  history: Record<string, DailyLog>,
  targetDate: Date = new Date(),
) => {
  // calculate the exertion from the 7 days preceding the target date
  const targetDateKey = toLocalDateKey(targetDate);

  const getSevenDayList = (targetDateKey: string) => {
    return Array.from({ length: 7 }, (_, index) => {
      const dateString = shiftDateKey(targetDateKey, -index);

      return { dateString };
    });
  };

  const sevenDayList = getSevenDayList(targetDateKey);
  return sevenDayList;
};
