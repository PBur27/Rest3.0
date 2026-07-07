import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import { WorkoutSession} from '@/types/models';
import * as Crypto from 'expo-crypto';


interface WorkoutState {
  history: WorkoutSession[];
  
  
  logExerciseToDate: (dateString: string, exerciseId: string, intensity: number) => void;
  deleteSession: (sessionId: string) => void;
}

const mmkvInstance = createMMKV({ id: 'workout-storage' });
const storage = {
  setItem: (name: string, value: string) => mmkvInstance.set(name, value),
  getItem: (name: string) => mmkvInstance.getString(name) ?? null,
  removeItem: (name: string) => mmkvInstance.remove(name),
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      history: [],

      logExerciseToDate: (dateString, exerciseId, intensity) => set((state) => {

        const existingSessionIndex = state.history.findIndex(s => s.dateString === dateString);
        const updatedHistory = [...state.history];

        if (existingSessionIndex !== -1) {
          // Date exists -> append or update the exercise inside this day's container
          const session = updatedHistory[existingSessionIndex];
          const existingExerciseIndex = session.exercises.findIndex(e => e.exerciseId === exerciseId);

          if (existingExerciseIndex !== -1) {
            // Exercise already logged on this day -> replace it with the new intensity
            session.exercises[existingExerciseIndex] = { exerciseId, intensity: Math.max(session.exercises[existingExerciseIndex].intensity + intensity, 1) };
          } else {
            // New exercise for this day -> add it to the array
            session.exercises.push({ exerciseId, intensity });
          }
        } else {
          // Date doesn't exist yet -> create a brand new day entry
          const newSession: WorkoutSession = {
            id: Crypto.randomUUID(),
            dateString,
            exercises: [{ exerciseId, intensity }]
          };
          updatedHistory.push(newSession);
        }

        return { history: updatedHistory };
      }),

      deleteSession: (sessionId) => set((state) => ({
        history: state.history.filter(s => s.id !== sessionId)
      }))
    }),
    {
      name: 'workout-history-key',
      storage: createJSONStorage(() => storage),
    }
  )
);