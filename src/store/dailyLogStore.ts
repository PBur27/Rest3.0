import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import * as Crypto from "expo-crypto";
import { DailyLog } from "@/types/models";

interface DailyLogState {
  history: DailyLog[];
  logSleepToDate: (
    dateString: string,
    sleepHours: number,
    bedtime: string,
  ) => void;
  logDietToDate: (
    dateString: string,
    calories: number,
    proteinGrams: number,
  ) => void;
  logExerciseToDate: (
    dateString: string,
    exerciseId: string,
    intensity: number,
  ) => void;
  deleteExerciseFromDate: (dateString: string, exerciseId: string) => void;
  deleteSleepFromDate: (dateString: string) => void;
  deleteDietFromDate: (dateString: string) => void;
  deleteDayLog: (id: string) => void;
}

const mmkvInstance = createMMKV({ id: "daily-log-storage" });
const storage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set) => ({
      history: [],

      logSleepToDate: (dateString, sleepHours, bedtime) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );
          const sleepEntry = {
            id: Crypto.randomUUID(),
            bedtime,
            hoursSlept: sleepHours,
            loggedAt: new Date().toISOString(),
          };

          if (existingIndex !== -1) {
            const dayLog = updatedHistory[existingIndex];
            updatedHistory[existingIndex] = {
              ...dayLog,
              sleep: [...(dayLog.sleep ?? []), sleepEntry],
            };
          } else {
            updatedHistory.push({
              id: Crypto.randomUUID(),
              dateString,
              exercises: [],
              meals: [],
              sleep: [sleepEntry],
            });
          }
          return { history: updatedHistory };
        }),

      logDietToDate: (dateString, calories, proteinGrams) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );
          const mealEntry = {
            id: Crypto.randomUUID(),
            calories,
            proteinGrams,
            loggedAt: new Date().toISOString(),
          };

          if (existingIndex !== -1) {
            const dayLog = updatedHistory[existingIndex];
            updatedHistory[existingIndex] = {
              ...dayLog,
              meals: [...(dayLog.meals ?? []), mealEntry],
            };
          } else {
            updatedHistory.push({
              id: Crypto.randomUUID(),
              dateString,
              exercises: [],
              meals: [mealEntry],
              sleep: [],
            });
          }
          return { history: updatedHistory };
        }),

      logExerciseToDate: (dateString, exerciseId, intensity) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );
          const exerciseEntry = {
            id: Crypto.randomUUID(),
            exerciseId,
            intensity,
            loggedAt: new Date().toISOString(),
          };

          if (existingIndex !== -1) {
            const dayLog = updatedHistory[existingIndex];
            updatedHistory[existingIndex] = {
              ...dayLog,
              exercises: [...dayLog.exercises, exerciseEntry],
            };
          } else {
            updatedHistory.push({
              id: Crypto.randomUUID(),
              dateString,
              exercises: [exerciseEntry],
              meals: [],
              sleep: [],
            });
          }
          return { history: updatedHistory };
        }),

      deleteExerciseFromDate: (dateString, exerciseId) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );

          if (existingIndex !== -1) {
            updatedHistory[existingIndex] = {
              ...updatedHistory[existingIndex],
              exercises: updatedHistory[existingIndex].exercises.filter(
                (e) => e.exerciseId !== exerciseId,
              ),
            };
          }
          return { history: updatedHistory };
        }),

      deleteSleepFromDate: (dateString) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );

          if (existingIndex !== -1) {
            updatedHistory[existingIndex] = {
              ...updatedHistory[existingIndex],
              sleep: [],
            };
          }
          return { history: updatedHistory };
        }),

      deleteDietFromDate: (dateString) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );

          if (existingIndex !== -1) {
            updatedHistory[existingIndex] = {
              ...updatedHistory[existingIndex],
              meals: [],
            };
          }
          return { history: updatedHistory };
        }),

      deleteDayLog: (id) =>
        set((state) => ({
          history: state.history.filter((d) => d.id !== id),
        })),
    }),
    {
      name: "daily-log-storage-key",
      storage: createJSONStorage(() => storage),
    },
  ),
);
