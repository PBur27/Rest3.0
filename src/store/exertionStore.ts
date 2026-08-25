import { create } from "zustand";
import { MuscleGroup } from "@/types/models";

//simple store to hold the current exertion level for each muscle group, with a default value of 0 for each muscle group and a function to set the exertion level for a specific muscle group
interface ExertionState {
  exertionLevels: Record<MuscleGroup, number>;
  setExertionLevel: (muscleGroup: MuscleGroup, level: number) => void;
}

export const useExertionStore = create<ExertionState>((set) => ({
  exertionLevels: {
    abs: 0,
    biceps: 0,
    calves: 0,
    chest: 0,
    erectorSpinae: 0,
    forearms: 0,
    glutes: 0,
    hamstrings: 0,
    lats: 0,
    obliques: 0,
    quads: 0,
    rhomboids: 0,
    shoulders: 0,
    traps: 0,
    triceps: 0,
  },
  setExertionLevel: (muscleGroup, level) =>
    set((state) => ({
      exertionLevels: {
        ...state.exertionLevels, 
        [muscleGroup]: level, 
      },
    })),
}));
