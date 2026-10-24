import type { ObjectiveDependency } from "../data/progression.ts";

export function unmetObjectivePrerequisites(
  objectiveId: string,
  dependencies: ObjectiveDependency[],
  isComplete: (prerequisiteObjectiveId: string) => boolean,
) {
  return dependencies.filter((dependency) =>
    dependency.dependentObjectiveId === objectiveId && !isComplete(dependency.prerequisiteObjectiveId),
  );
}

export function findObjectiveDependencyCycles(dependencies: ObjectiveDependency[]) {
  const prerequisitesByObjective = new Map<string, string[]>();
  for (const dependency of dependencies) {
    const prerequisites = prerequisitesByObjective.get(dependency.dependentObjectiveId) ?? [];
    prerequisites.push(dependency.prerequisiteObjectiveId);
    prerequisitesByObjective.set(dependency.dependentObjectiveId, prerequisites);
  }

  const state = new Map<string, "visiting" | "visited">();
  const path: string[] = [];
  const cycles: string[][] = [];

  function visit(objectiveId: string) {
    if (state.get(objectiveId) === "visited") return;
    if (state.get(objectiveId) === "visiting") {
      const cycleStart = path.indexOf(objectiveId);
      cycles.push([...path.slice(cycleStart), objectiveId]);
      return;
    }

    state.set(objectiveId, "visiting");
    path.push(objectiveId);
    for (const prerequisiteId of prerequisitesByObjective.get(objectiveId) ?? []) visit(prerequisiteId);
    path.pop();
    state.set(objectiveId, "visited");
  }

  for (const objectiveId of prerequisitesByObjective.keys()) visit(objectiveId);
  return cycles;
}
