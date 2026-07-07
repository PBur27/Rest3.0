import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { Exercise } from "@/types/models";
import { defaultExercises } from "@/constants/defaultExercises";

interface ExerciseState {
  exercises: Exercise[];
  addCustomExercise: (exercise: Exercise) => void;
  seedDefaultExercises: () => void;
}

const mmkvInstance = createMMKV({ id: 'exercise-storage' });

const storage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set, get) => ({
      exercises: [],

      addCustomExercise: (newExercise) => 
        set((state) => ({ exercises: [...state.exercises, newExercise] })),

      seedDefaultExercises: () => {
        if (get().exercises.length === 0) {
          set({ exercises: defaultExercises });
          console.log(`Successfully seeded ${defaultExercises.length} baseline exercises to storage.`);
        }
        else{
              console.log(`Exercises already exist in storage. Skipping seeding.`);
        }
      },
    }),
    {
      name: 'exercise-storage-key',
      storage: createJSONStorage(() => storage),
      
      onRehydrateStorage: () => {
        return (restoredState, error) => {
          if (!error && restoredState) {
            restoredState.seedDefaultExercises();
          }
        };
      },
    }
  )
);