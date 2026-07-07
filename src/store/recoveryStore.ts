import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { DailyRecovery } from "@/types/models";
import * as Crypto from 'expo-crypto';

interface RecoveryState {
  recoveryHistory: DailyRecovery[];
  logRecoveryForDate: (dateString: string, sleepHours: number, proteinGrams: number, calories: number) => void;
}

const mmkvInstance = createMMKV({ id: 'recovery-storage' });

const storage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

export const useRecoveryStore = create<RecoveryState>()(
  persist(
    (set) => ({
      recoveryHistory: [],

      logRecoveryForDate: (dateString, sleepHours, proteinGrams, calories) => set((state) => {
        const existingIndex = state.recoveryHistory.findIndex(r => r.dateString === dateString);
        const updatedHistory = [...state.recoveryHistory];

        const newRecoveryEntry: DailyRecovery = {
          id: Crypto.randomUUID(),
          dateString,
          sleepHours,
          proteinGrams,
          calories
        };

        if (existingIndex !== -1) {
          updatedHistory[existingIndex] = newRecoveryEntry;
        } else {
          updatedHistory.push(newRecoveryEntry);
        }

        return { recoveryHistory: updatedHistory };
      }),
    }),
    {
      name: 'recovery-metrics-key',
      storage: createJSONStorage(() => storage),
    }
  )
);