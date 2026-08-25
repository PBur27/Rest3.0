import { MuscleGroup, Organism } from "@/types/models";
export const mapExertionLevelsToOrganism = (
  exertion: Record<MuscleGroup, number>,
) => {
  const organism: Organism = {
    front: {
      abs: exertion.abs * 10,
      biceps: exertion.biceps * 10,
      calves: exertion.calves * 10,
      chest: exertion.chest * 10,
      forearms: exertion.forearms * 10,
      lats: exertion.lats * 10,
      obliques: exertion.obliques * 10,
      quads: exertion.quads * 10,
      shoulders: exertion.shoulders * 10,
      traps: exertion.traps * 10,
      triceps: exertion.triceps * 10,
      ludzik: 0,
    },
    back: {
      head: 0,
      traps: exertion.traps * 10,
      rhomboids: exertion.rhomboids * 10,
      shoulders: exertion.shoulders * 10,
      lats: exertion.lats * 10,
      triceps: exertion.triceps * 10,
      forearms: exertion.forearms * 10,
      erectorSpinae: exertion.erectorSpinae * 10,
      glutes: exertion.glutes * 10,
      hamstrings: exertion.hamstrings * 10,
      calves: exertion.calves * 10,
      ludzik: 0,
      obliques: exertion.obliques * 10,
    },
  };

  return organism;
};
