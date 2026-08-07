import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import * as Crypto from "expo-crypto";
import { DailyLog } from "@/types/models";

interface DailyLogState {
  history: Record<string, DailyLog>;
  logSleepToDate: (
    dateString: string,
    sleepHours: number,
    bedtime: string
  ) => void;
  logDietToDate: (
    dateString: string,
    calories: number,
    proteinGrams: number
  ) => void;
  logExerciseToDate: (
    dateString: string,
    exerciseId: string,
    intensity: number
  ) => void;
  deleteExerciseFromDate: (dateString: string, exerciseId: string) => void;
  deleteSleepFromDate: (dateString: string) => void;
  deleteDietFromDate: (dateString: string) => void;
  deleteDayLog: (dateString: string) => void;
}

const mmkvInstance = createMMKV({ id: "daily-log-storage" });
const storage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

const createEmptyLog = (dateString: string): DailyLog => ({
  id: Crypto.randomUUID(),
  dateString,
  exercises: [],
  meals: [],
  sleep: [],
});

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set) => ({
      history: {},

      logSleepToDate: (dateString, sleepHours, bedtime) =>
        set((state) => {
          const currentDay = state.history[dateString] ?? createEmptyLog(dateString);
          const sleepEntry = {
            id: Crypto.randomUUID(),
            bedtime,
            hoursSlept: sleepHours,
            loggedAtUTC: new Date().toISOString(),
          };

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                sleep: [...(currentDay.sleep ?? []), sleepEntry],
              },
            },
          };
        }),

      logDietToDate: (dateString, calories, proteinGrams) =>
        set((state) => {
          const currentDay = state.history[dateString] ?? createEmptyLog(dateString);
          const mealEntry = {
            id: Crypto.randomUUID(),
            calories,
            proteinGrams,
            loggedAtUTC: new Date().toISOString(),
          };

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                meals: [...(currentDay.meals ?? []), mealEntry],
              },
            },
          };
        }),

      logExerciseToDate: (dateString, exerciseId, intensity) =>
        set((state) => {
          const currentDay = state.history[dateString] ?? createEmptyLog(dateString);
          const exerciseEntry = {
            id: Crypto.randomUUID(),
            exerciseId,
            intensity,
            loggedAtUTC: new Date().toISOString(),
          };

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                exercises: [...(currentDay.exercises ?? []), exerciseEntry],
              },
            },
          };
        }),

      deleteExerciseFromDate: (dateString, exerciseId) =>
        set((state) => {
          const currentDay = state.history[dateString];
          if (!currentDay) return state;

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                exercises: currentDay.exercises.filter(
                  (e) => e.exerciseId !== exerciseId
                ),
              },
            },
          };
        }),

      deleteSleepFromDate: (dateString) =>
        set((state) => {
          const currentDay = state.history[dateString];
          if (!currentDay) return state;

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                sleep: [],
              },
            },
          };
        }),

      deleteDietFromDate: (dateString) =>
        set((state) => {
          const currentDay = state.history[dateString];
          if (!currentDay) return state;

          return {
            history: {
              ...state.history,
              [dateString]: {
                ...currentDay,
                meals: [],
              },
            },
          };
        }),

      deleteDayLog: (dateString) =>
        set((state) => {
          const { [dateString]: _, ...remainingHistory } = state.history;
          return { history: remainingHistory };
        }),
    }),
    {
      name: "daily-log-storage-key",
      storage: createJSONStorage(() => storage),
    }
  )
);