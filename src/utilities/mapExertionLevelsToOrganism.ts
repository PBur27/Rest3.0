import { MuscleGroup, Organism } from "@/types/models";
export const mapExertionLevelsToOrganism = (
  exertion: Record<MuscleGroup, number>,
) => {
  const organism: Organism = {
    front: {
      abs: exertion.abs,
      biceps: exertion.biceps,
      calves: exertion.calves,
      chest: exertion.chest,
      forearms: exertion.forearms,
      lats: exertion.lats,
      obliques: exertion.obliques,
      quads: exertion.quads,
      shoulders: exertion.shoulders,
      traps: exertion.traps,
      triceps: exertion.triceps,
      ludzik: 0,
    },
    back: {
      head: 0,
      traps: exertion.traps,
      rhomboids: exertion.rhomboids,
      shoulders: exertion.shoulders,
      lats: exertion.lats,
      triceps: exertion.triceps,
      forearms: exertion.forearms,
      erectorSpinae: exertion.erectorSpinae,
      glutes: exertion.glutes,
      hamstrings: exertion.hamstrings,
      calves: exertion.calves,
      ludzik: 0,
      obliques: exertion.obliques,
    },
  };

  return organism;
};
