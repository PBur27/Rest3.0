import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { UserSettings } from "../types/models";

const mmkvInstance = createMMKV({ id: "user-settings" });

const mmkvStorage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

export const useUserSettingsStore = create<UserSettings>()(
  persist(
    (set) => ({
      theme: "light",
      language: "English",

      setTheme: (theme: "light" | "dark") => set({ theme }),
      setLanguage: (language: "English" | "Polish") => set({ language }),
    }),
    {
      name: "user-settings-key",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
