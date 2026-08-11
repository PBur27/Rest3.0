import { LoggedExercise, MuscleGroup } from "@/types/models";
import { useExerciseStore } from "@/store/exerciseStore";

export const exertionCalculation = (loggedExercises: LoggedExercise[]) => {
  const exerciseCatalog = useExerciseStore.getState().exercises;

  const load: Partial<Record<MuscleGroup, number>> = {};

  for (const exercise of loggedExercises) {
    const exerciseData = exerciseCatalog.find((ex) => ex.id === exercise.exerciseId);
    if (!exerciseData) continue;
    const impactedMuscles = exerciseData?.muscleLoads || [];
    const intensity = exercise.intensity || 0;

    for (const muscleLoad of impactedMuscles) {
      const muscle : MuscleGroup = muscleLoad.muscle;
      const currentLoad: number = load[muscle] ?? 0;

      load[muscle] = currentLoad + intensity * muscleLoad.load;
    }
  }

  return load;
};
