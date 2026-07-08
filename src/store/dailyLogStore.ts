import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import * as Crypto from "expo-crypto";
import { DailyLog } from "@/types/models";

export type DailyMetrics = {
  sleepHours?: number;
  proteinGrams?: number;
  calories?: number;
};

interface DailyLogState {
  history: DailyLog[];
  logMetricToDate: (dateString: string, metrics: DailyMetrics) => void;
  logExerciseToDate: (
    dateString: string,
    exerciseId: string,
    intensity: number,
  ) => void;
  deleteExerciseFromDate: (dateString: string, exerciseId: string) => void;
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

      logMetricToDate: (dateString, metrics) =>
        set((state) => {
          const updatedHistory = [...state.history];
          const existingIndex = updatedHistory.findIndex(
            (d) => d.dateString === dateString,
          );

          if (existingIndex !== -1) {
            updatedHistory[existingIndex] = {
              ...updatedHistory[existingIndex],
              ...metrics,
            };
          } else {
            updatedHistory.push({
              id: Crypto.randomUUID(),
              dateString,
              exercises: [],
              ...metrics,
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

          if (existingIndex !== -1) {
            const dayLog = updatedHistory[existingIndex];
            const existingExerciseIndex = dayLog.exercises.findIndex(
              (e) => e.exerciseId === exerciseId,
            );

            if (existingExerciseIndex !== -1) {
              dayLog.exercises[existingExerciseIndex] = {
                exerciseId,
                intensity: Math.min(
                  Math.max(
                    dayLog.exercises[existingExerciseIndex].intensity +
                      intensity,
                    0,
                  ),
                  1,
                ),
              };
            } else {
              dayLog.exercises.push({ exerciseId, intensity });
            }
          } else {
            updatedHistory.push({
              id: Crypto.randomUUID(),
              dateString,
              exercises: [{ exerciseId, intensity }],
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

      deleteDayLog: (id) =>
        set((state) => ({
          history: state.history.filter((d) => d.id !== id),
        })),
    }),
    {
      name: "daily-log-history-key",
      storage: createJSONStorage(() => storage),
    },
  ),
);
