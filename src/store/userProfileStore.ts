import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { UserProfile } from "@/types/models";

const mmkvInstance = createMMKV({ id: "user-profile" });

const mmkvStorage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

interface UserProfileState {
  profile: UserProfile | null;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const calculateGoals = (weight: number, height: number, age: number, sex: "male" | "female", activity: string) => {
  const bmr = sex === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const multipliers = { sedentary: 1.0, moderate: 1.33, active: 1.66 }; //calorie goal multiplier based on lifestyle activity level
  const multiplier = multipliers[activity as keyof typeof multipliers] || 1.2;
  
  const tdee = bmr * multiplier;

  return {
    calorieGoal: Math.round(tdee),
    proteinPerKgBwGoalGrams: 1.2*multiplier, // Athletic baseline (2g/kg)
  };
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: null,

      updateProfile: (newData) => {
        set((state) => {
          const current = state.profile || {
            name: "", weightKg: 80, heightCm: 180, age: 25, sex: "male", activityLevel: "moderate"
          };

          const merged = { ...current, ...newData };
          
          const { calorieGoal, proteinPerKgBwGoalGrams } = calculateGoals(
            merged.weightKg,
            merged.heightCm,
            merged.age,
            merged.sex,
            merged.activityLevel
          );

          return {
            profile: {
              ...merged,
              calorieGoal,
              proteinPerKgBwGoalGrams,
            },
          };
        });
      },
    }),
    {
      name: "user-profile-storage-key",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);