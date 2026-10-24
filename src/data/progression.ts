import { activeTimeEvents } from "./ates.ts";

export type ObjectiveDependency = {
  prerequisiteObjectiveId: string;
  dependentObjectiveId: string;
  sourceIds: string[];
};

// Start with directly documented ATE-to-ATE and side-content links. More
// objective and chapter relationships can join this graph as they are audited.
export const objectiveDependencies: ObjectiveDependency[] = activeTimeEvents.flatMap((event) =>
  (event.prerequisites ?? []).map((prerequisiteObjectiveId) => ({
    prerequisiteObjectiveId,
    dependentObjectiveId: event.objectiveId,
    sourceIds: event.sourceIds,
  })),
);
