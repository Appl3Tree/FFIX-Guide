import { achievementSourceCounts, arcs, guideAreas, missables, objectives, sources } from "../src/data/guide.ts";
import { ps4Trophies, steamAchievements, xboxAchievements } from "../src/data/achievements.ts";
import { excalibur2Checkpoints } from "../src/data/excalibur2.ts";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticExclusiveGroupId, movieCriticTarget } from "../src/data/ates.ts";
import { ateObjectiveDependencies, gameRouteCoverage, gameRouteCutoffs, gameRouteEdges, guideChapterSequence, guideSequenceEdges, objectiveDependencies, storyPartySequences } from "../src/data/progression.ts";
import { findObjectiveDependencyCycles } from "../src/domain/progression.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage, sourceInventoryTargets } from "../src/data/items.ts";
import { synthesisRecipes } from "../src/data/synthesis.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

const errors: string[] = [];
const warnings: string[] = [];

function checkUnique(label: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`Duplicate ${label} ID: ${id}`);
    seen.add(id);
  }
}

checkUnique("source", sources.map((source) => source.id));
checkUnique("objective", objectives.map((objective) => objective.id));
checkUnique("missable", missables.map((missable) => missable.id));
checkUnique("game item", gameItems.map((item) => item.id));
checkUnique("item acquisition path", itemAcquisitionPaths.map((path) => path.id));
checkUnique("synthesis recipe", synthesisRecipes.map((recipe) => recipe.id));
checkUnique("source inventory target", sourceInventoryTargets.map((target) => target.id));
checkUnique("equipment ability claim", equipmentAbilityClaims.map((claim) => claim.id));
checkUnique("Steam achievement", steamAchievements.map((achievement) => achievement.id));
checkUnique("PS4 trophy", ps4Trophies.map((achievement) => achievement.id));
checkUnique("Xbox achievement", xboxAchievements.map((achievement) => achievement.id));
checkUnique("area", guideAreas.map((area) => area.id));
checkUnique("walkthrough chapter", walkthroughChapters.map((chapter) => chapter.areaId));
checkUnique("Excalibur II checkpoint", excalibur2Checkpoints.map((checkpoint) => checkpoint.id));
checkUnique("ATE", activeTimeEvents.map((event) => event.id));
checkUnique("ATE progress objective", activeTimeEvents.map((event) => event.objectiveId));
checkUnique("objective dependency edge", objectiveDependencies.map((edge) => `${edge.prerequisiteObjectiveId}->${edge.dependentObjectiveId}`));
checkUnique("guide sequence chapter", guideChapterSequence);
checkUnique("guide sequence edge", guideSequenceEdges.map((edge) => `${edge.fromChapterId}->${edge.toChapterId}`));
checkUnique("game route covered chapter", [...gameRouteCoverage.chapterIds]);
checkUnique("game route edge", gameRouteEdges.map((edge) => edge.id));
checkUnique("game route link", gameRouteEdges.map((edge) => `${edge.fromChapterId}->${edge.toChapterId}`));
checkUnique("game route cutoff", gameRouteCutoffs.map((cutoff) => cutoff.id));
checkUnique("story party sequence", storyPartySequences.map((sequence) => sequence.id));

const sourceIds = new Set(sources.map((source) => source.id));
const objectiveIds = new Set(objectives.map((objective) => objective.id));
const gameItemIds = new Set(gameItems.map((item) => item.id));
const synthesisRecipeIds = new Set(synthesisRecipes.map((recipe) => recipe.id));
const areaIds = new Set(guideAreas.map((area) => area.id));
const walkthroughChapterIds = new Set(walkthroughChapters.map((chapter) => chapter.areaId));
const gameRouteEdgesById = new Map(gameRouteEdges.map((edge) => [edge.id, edge]));
const missablesById = new Map(missables.map((missable) => [missable.id, missable]));
const achievementCatalogs = [
  { platform: "steam" as const, records: steamAchievements, expectedCount: achievementSourceCounts.steam.count },
  { platform: "ps4" as const, records: ps4Trophies, expectedCount: achievementSourceCounts.ps4.count },
  { platform: "xbox" as const, records: xboxAchievements, expectedCount: achievementSourceCounts.xbox.count },
];

if (activeTimeEvents.length !== 83) errors.push(`ATE index has ${activeTimeEvents.length} events; expected 83.`);
if (movieCriticEligibleEvents.length !== 80) errors.push(`Movie Critic candidate list has ${movieCriticEligibleEvents.length} eligible ATE choices; expected 80.`);
if (activeTimeEvents.filter((event) => !event.countsTowardMovieCritic).length !== 3) errors.push("The three Mogster tutorials must remain outside Movie Critic progress.");
if (activeTimeEvents.filter((event) => event.exclusiveGroupId === movieCriticExclusiveGroupId).length !== 2) errors.push("Movie Critic must have exactly two mutually exclusive Treno branch events.");
if (movieCriticEligibleEvents.length - 1 !== movieCriticTarget) errors.push("Movie Critic target must equal eligible choices minus the single mutually exclusive branch.");
if (guideChapterSequence.length !== 44) errors.push(`Guide navigation sequence has ${guideChapterSequence.length} chapters; expected 44.`);
if (guideChapterSequence.join("|") !== guideAreas.map((area) => area.id).join("|")) errors.push("Guide navigation sequence order does not match the source-ordered chapter inventory used by progression checks.");
if (guideSequenceEdges.length !== Math.max(guideChapterSequence.length - 1, 0)) errors.push("Guide navigation sequence must have exactly one edge between each adjacent chapter pair.");
for (const chapterId of guideChapterSequence) {
  if (!areaIds.has(chapterId)) errors.push(`Guide sequence references unknown chapter ${chapterId}.`);
  if (!walkthroughChapterIds.has(chapterId)) errors.push(`Guide sequence chapter ${chapterId} has no authored walkthrough content.`);
}
for (const [index, edge] of guideSequenceEdges.entries()) {
  if (edge.relationship !== "guide-order") errors.push(`Guide sequence edge ${edge.fromChapterId} -> ${edge.toChapterId} has an unsupported relationship type.`);
  if (edge.fromChapterId !== guideChapterSequence[index] || edge.toChapterId !== guideChapterSequence[index + 1]) {
    errors.push(`Guide sequence edge ${edge.fromChapterId} -> ${edge.toChapterId} does not match the chapter list order.`);
  }
  if (!areaIds.has(edge.fromChapterId) || !areaIds.has(edge.toChapterId)) {
    errors.push(`Guide sequence edge ${edge.fromChapterId} -> ${edge.toChapterId} references an unknown chapter.`);
  }
  for (const sourceId of edge.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Guide sequence edge ${edge.fromChapterId} -> ${edge.toChapterId} references unknown source ${sourceId}.`);
  }
}
if (gameRouteCoverage.status !== "partial") errors.push("Game route coverage must stay explicitly partial until all story branches and gates are researched.");
if (!areaIds.has(gameRouteCoverage.throughChapterId)) errors.push(`Game route coverage ends at unknown chapter ${gameRouteCoverage.throughChapterId}.`);
if (gameRouteCoverage.chapterIds.at(-1) !== gameRouteCoverage.throughChapterId) errors.push("Game route coverage endpoint does not match its final covered chapter.");
for (const [index, chapterId] of gameRouteCoverage.chapterIds.entries()) {
  if (!areaIds.has(chapterId)) errors.push(`Game route coverage references unknown chapter ${chapterId}.`);
  if (chapterId !== guideChapterSequence[index]) errors.push(`Game route coverage chapter ${chapterId} is not part of the declared source-order prefix.`);
}
const gameRouteCoverageIds = new Set<string>(gameRouteCoverage.chapterIds);
const supportedGameRouteRelationships = new Set(["required-story", "optional-detour", "optional-return", "rejoin"]);
for (const sequence of storyPartySequences) {
  if (!sequence.title.trim()) errors.push(`Story party sequence ${sequence.id} has no title.`);
  if (sequence.phases.length < 2) errors.push(`Story party sequence ${sequence.id} must show at least one handoff.`);
  if (sequence.sourceIds.length === 0) errors.push(`Story party sequence ${sequence.id} has no source provenance.`);
  for (const phase of sequence.phases) {
    if (!phase.party.trim() || !phase.location.trim() || !phase.summary.trim()) {
      errors.push(`Story party sequence ${sequence.id} has an incomplete phase.`);
    }
    if (phase.chapterIds.length === 0) errors.push(`Story party sequence ${sequence.id} has a phase with no chapter link.`);
    for (const chapterId of phase.chapterIds) {
      if (!areaIds.has(chapterId)) errors.push(`Story party sequence ${sequence.id} references unknown chapter ${chapterId}.`);
      if (!gameRouteCoverageIds.has(chapterId)) errors.push(`Story party sequence ${sequence.id} extends beyond the researched game-route scope.`);
    }
  }
  for (const sourceId of sequence.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Story party sequence ${sequence.id} references unknown source ${sourceId}.`);
  }
}
for (const edge of gameRouteEdges) {
  if (!gameRouteCoverageIds.has(edge.fromChapterId) || !gameRouteCoverageIds.has(edge.toChapterId)) {
    errors.push(`Game route edge ${edge.id} extends beyond the declared researched chapter scope.`);
  }
  if (!supportedGameRouteRelationships.has(edge.relationship)) errors.push(`Game route edge ${edge.id} has unsupported relationship ${edge.relationship}.`);
  if (!areaIds.has(edge.fromChapterId) || !areaIds.has(edge.toChapterId)) {
    errors.push(`Game route edge ${edge.id} references an unknown chapter.`);
  }
  if (!edge.summary.trim()) errors.push(`Game route edge ${edge.id} has no explanation.`);
  if (edge.sourceIds.length === 0) errors.push(`Game route edge ${edge.id} has no source provenance.`);
  for (const sourceId of edge.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Game route edge ${edge.id} references unknown source ${sourceId}.`);
  }
}
const supportedGameRouteCutoffCertainties = new Set(["source-supported", "conservative", "disputed"]);
const linkedRouteMissableIds = new Set<string>();
for (const cutoff of gameRouteCutoffs) {
  const edge = gameRouteEdgesById.get(cutoff.edgeId);
  if (!edge) errors.push(`Game route cutoff ${cutoff.id} references unknown edge ${cutoff.edgeId}.`);
  if (!cutoff.title.trim()) errors.push(`Game route cutoff ${cutoff.id} has no title.`);
  if (!cutoff.trigger.trim()) errors.push(`Game route cutoff ${cutoff.id} has no trigger description.`);
  if (!supportedGameRouteCutoffCertainties.has(cutoff.certainty)) errors.push(`Game route cutoff ${cutoff.id} has unsupported certainty ${cutoff.certainty}.`);
  if (cutoff.missableIds.length === 0) errors.push(`Game route cutoff ${cutoff.id} has no linked missable warnings.`);
  if (cutoff.sourceIds.length === 0) errors.push(`Game route cutoff ${cutoff.id} has no source provenance.`);
  const linkedMissables = cutoff.missableIds.flatMap((missableId) => {
    const missable = missablesById.get(missableId);
    if (!missable) {
      errors.push(`Game route cutoff ${cutoff.id} references unknown missable ${missableId}.`);
      return [];
    }
    linkedRouteMissableIds.add(missableId);
    if (!edge) return [missable];
    if (!missable.warningChapterIds?.some((chapterId) => chapterId === edge.fromChapterId || chapterId === edge.toChapterId)) {
      errors.push(`Game route cutoff ${cutoff.id} links missable ${missableId}, whose warning chapter is not on edge ${edge.id}.`);
    }
    return [missable];
  });
  if (new Set(cutoff.missableIds).size !== cutoff.missableIds.length) errors.push(`Game route cutoff ${cutoff.id} repeats a missable link.`);
  const relatedSourceIds = new Set([...(edge?.sourceIds ?? []), ...linkedMissables.flatMap((missable) => missable.sourceIds)]);
  for (const sourceId of cutoff.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Game route cutoff ${cutoff.id} references unknown source ${sourceId}.`);
    else if (!relatedSourceIds.has(sourceId)) errors.push(`Game route cutoff ${cutoff.id} source ${sourceId} is not cited by its route edge or linked warnings.`);
  }
}
for (const missable of missables) {
  if (!linkedRouteMissableIds.has(missable.id)) errors.push(`Missable ${missable.id} has no game route cutoff link.`);
}
const reachableGameRouteChapters = new Set<string>();
const pendingGameRouteChapters = gameRouteCoverage.chapterIds.slice(0, 1);
while (pendingGameRouteChapters.length > 0) {
  const chapterId = pendingGameRouteChapters.shift();
  if (!chapterId || reachableGameRouteChapters.has(chapterId)) continue;
  reachableGameRouteChapters.add(chapterId);
  for (const edge of gameRouteEdges) {
    if (edge.fromChapterId === chapterId && !reachableGameRouteChapters.has(edge.toChapterId)) {
      pendingGameRouteChapters.push(edge.toChapterId);
    }
  }
}
for (const chapterId of gameRouteCoverage.chapterIds) {
  if (!reachableGameRouteChapters.has(chapterId)) errors.push(`Game route chapter ${chapterId} is unreachable from the researched opening route.`);
}
for (const event of activeTimeEvents) {
  if (!areaIds.has(event.chapterId)) errors.push(`ATE ${event.id} references unknown chapter ${event.chapterId}.`);
  if (!objectiveIds.has(event.objectiveId)) errors.push(`ATE ${event.id} references unknown progress objective ${event.objectiveId}.`);
  if (!objectiveIds.has(event.groupObjectiveId)) errors.push(`ATE ${event.id} references unknown chapter checklist ${event.groupObjectiveId}.`);
  for (const sourceId of event.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`ATE ${event.id} references unknown source ${sourceId}.`);
  }
  for (const prerequisiteId of event.prerequisites ?? []) {
    if (!objectiveIds.has(prerequisiteId) && !activeTimeEvents.some((candidate) => candidate.objectiveId === prerequisiteId)) {
      errors.push(`ATE ${event.id} references unknown prerequisite ${prerequisiteId}.`);
    }
  }
}
const expectedDependencyEdges = activeTimeEvents.flatMap((event) =>
  (event.prerequisites ?? []).map((prerequisiteObjectiveId) => `${prerequisiteObjectiveId}->${event.objectiveId}`),
).sort();
const actualAteDependencyEdges = ateObjectiveDependencies.map((edge) => `${edge.prerequisiteObjectiveId}->${edge.dependentObjectiveId}`).sort();
if (expectedDependencyEdges.join("|") !== actualAteDependencyEdges.join("|")) {
  errors.push("ATE-order dependency graph does not include exactly the prerequisites declared by ATE records.");
}
const supportedObjectiveDependencyKinds = new Set(["ate-sequence", "objective-access"]);
for (const dependency of objectiveDependencies) {
  if (!supportedObjectiveDependencyKinds.has(dependency.kind)) errors.push(`Dependency has unsupported kind ${dependency.kind}.`);
  if (!objectiveIds.has(dependency.prerequisiteObjectiveId)) errors.push(`Dependency references unknown prerequisite objective ${dependency.prerequisiteObjectiveId}.`);
  if (!objectiveIds.has(dependency.dependentObjectiveId)) errors.push(`Dependency references unknown dependent objective ${dependency.dependentObjectiveId}.`);
  for (const sourceId of dependency.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Dependency ${dependency.prerequisiteObjectiveId} -> ${dependency.dependentObjectiveId} references unknown source ${sourceId}.`);
  }
}
for (const cycle of findObjectiveDependencyCycles(objectiveDependencies)) {
  errors.push(`Objective dependency cycle: ${cycle.join(" -> ")}.`);
}
for (const { platform, records } of achievementCatalogs) {
  const movieCritic = records.find((achievement) =>
    ("parityId" in achievement ? achievement.parityId : achievement.id) === "movie-critic",
  );
  for (const event of movieCriticEligibleEvents) {
    if (!movieCritic?.guideObjectiveIds?.includes(event.objectiveId)) {
      errors.push(`${platform} Movie Critic achievement is missing ATE pointer ${event.objectiveId}.`);
    }
  }
  for (const tutorial of activeTimeEvents.filter((event) => !event.countsTowardMovieCritic)) {
    if (movieCritic?.guideObjectiveIds?.includes(tutorial.objectiveId)) {
      errors.push(`${platform} Movie Critic achievement must exclude tutorial ${tutorial.objectiveId}.`);
    }
  }
}

const tutorialAteObjectives = [
  { id: "disc-1.evil-forest.mogster-lesson-1", chapterId: "disc-1.evil-forest" },
  { id: "disc-1.ice-cavern.mogster-lesson-2", chapterId: "disc-1.ice-cavern" },
  { id: "disc-1.lindblum.mogster-lesson-3", chapterId: "disc-1.lindblum" },
];

for (const tutorial of tutorialAteObjectives) {
  const objective = objectives.find((item) => item.id === tutorial.id);
  if (objective?.category !== "side-content" || objective.achievementPlatforms?.length) {
    errors.push(`Mogster tutorial ${tutorial.id} must remain separate from achievement progress.`);
  }
  const linkedSteps = walkthroughChapters.flatMap((chapter) =>
    chapter.sections.flatMap((section) => section.steps.filter((step) => step.objectiveIds?.includes(tutorial.id)).map((step) => ({ chapterId: chapter.areaId, stepId: step.id }))),
  );
  if (linkedSteps.length !== 1 || linkedSteps[0]?.chapterId !== tutorial.chapterId) {
    errors.push(`Mogster tutorial ${tutorial.id} must have one walkthrough pointer in ${tutorial.chapterId}; found ${linkedSteps.map((step) => `${step.chapterId}/${step.stepId}`).join(", ") || "none"}.`);
  }
  if (achievementCatalogs.some(({ records }) => records.some((achievement) => achievement.guideObjectiveIds?.includes(tutorial.id)))) {
    errors.push(`Mogster tutorial ${tutorial.id} is mapped as a counted achievement objective.`);
  }
}

for (const { platform, records, expectedCount } of achievementCatalogs) {
  if (records.length !== expectedCount) {
    errors.push(`${platform} achievement catalog has ${records.length} records, expected ${expectedCount}.`);
  }
  for (const achievement of records) {
    const objective = objectives.find((item) => item.id === achievement.objectiveId);
    if (!objective) errors.push(`${platform} achievement ${achievement.id} references unknown progress objective ${achievement.objectiveId}.`);
    else if (!objective.achievementPlatforms?.includes(platform)) errors.push(`${platform} achievement ${achievement.id} objective is not marked for ${platform}.`);
    if (!achievement.name.trim() || !achievement.criteria.trim()) errors.push(`${platform} achievement ${achievement.id} needs a name and criteria.`);
    if (!sourceIds.has(achievement.sourceId)) errors.push(`${platform} achievement ${achievement.id} references unknown source ${achievement.sourceId}.`);
    for (const objectiveId of achievement.guideObjectiveIds ?? []) {
      const guideObjective = objectives.find((item) => item.id === objectiveId);
      if (!guideObjective) errors.push(`${platform} achievement ${achievement.id} references unknown guide objective ${objectiveId}.`);
      else if (!guideObjective.chapterIds?.length) errors.push(`${platform} achievement ${achievement.id} guide objective ${objectiveId} has no chapter pointer.`);
    }
    for (const chapterId of achievement.guideChapterIds ?? []) {
      if (!areaIds.has(chapterId)) errors.push(`${platform} achievement ${achievement.id} references unknown guide chapter ${chapterId}.`);
    }
    for (const sourceId of achievement.guideSourceIds ?? []) {
      if (!sourceIds.has(sourceId)) errors.push(`${platform} achievement ${achievement.id} references unknown guide source ${sourceId}.`);
    }
    if (!(achievement.guideObjectiveIds?.length || achievement.guideChapterIds?.length || achievement.guideNote?.trim())) {
      errors.push(`${platform} achievement ${achievement.id} has no walkthrough pointer or explanatory route note.`);
    }
  }
}

const ps4ParityIds = ps4Trophies.filter((record) => record.parityId !== "ps4-platinum").map((record) => record.parityId).sort();
const xboxParityIds = xboxAchievements.map((record) => record.parityId).sort();
const steamAchievementIds = new Set(steamAchievements.map((record) => record.id));
if (ps4ParityIds.length !== 51 || new Set(ps4ParityIds).size !== 51) {
  errors.push(`PS4 catalog has ${ps4ParityIds.length} non-Platinum criteria; expected 51 unique gameplay trophies.`);
}
if (JSON.stringify(ps4ParityIds) !== JSON.stringify(xboxParityIds)) {
  errors.push("PS4 and Xbox gameplay criteria do not share the same parity IDs.");
}
for (const parityId of xboxParityIds) {
  if (!steamAchievementIds.has(parityId)) errors.push(`Console criterion ${parityId} has no Steam comparison record.`);
}

for (const objective of objectives) {
  if (!objective.title.trim()) errors.push(`Objective ${objective.id} is missing a title.`);
  if (objective.sourceIds.length === 0) errors.push(`Objective ${objective.id} has no provenance.`);
  if (objective.category === "achievement" && (!objective.achievementPlatforms || objective.achievementPlatforms.length === 0)) {
    errors.push(`Achievement objective ${objective.id} must name its supported platforms.`);
  }
  for (const sourceId of objective.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Objective ${objective.id} references unknown source ${sourceId}.`);
  }
  for (const chapterId of objective.chapterIds ?? []) {
    if (!areaIds.has(chapterId)) errors.push(`Objective ${objective.id} references unknown chapter ${chapterId}.`);
  }
}

const walkthroughAreaIds = new Set(walkthroughChapters.map((chapter) => chapter.areaId));
for (const chapter of walkthroughChapters) {
  if (!areaIds.has(chapter.areaId)) errors.push(`Walkthrough chapter references unknown area ${chapter.areaId}.`);
  if (!chapter.overview.trim()) errors.push(`Walkthrough chapter ${chapter.areaId} is missing an overview.`);
  if (chapter.sections.length === 0) errors.push(`Walkthrough chapter ${chapter.areaId} has no sections.`);
  const sectionIds = chapter.sections.map((section) => section.id);
  checkUnique(`${chapter.areaId} section`, sectionIds);
  for (const section of chapter.sections) {
    if (!section.title.trim() || section.steps.length === 0) errors.push(`Walkthrough section ${section.id} needs a title and at least one step.`);
    if (section.sourceIds.length === 0) errors.push(`Walkthrough section ${section.id} has no source provenance.`);
    for (const sourceId of section.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Walkthrough section ${section.id} references unknown source ${sourceId}.`);
    }
    const stepIds = section.steps.map((step) => step.id);
    checkUnique(`${section.id} step`, stepIds);
    for (const step of section.steps) {
      if (!step.text.trim()) errors.push(`Walkthrough step ${step.id} has no instructions.`);
      for (const objectiveId of step.objectiveIds ?? []) {
        if (!objectiveIds.has(objectiveId)) errors.push(`Walkthrough step ${step.id} references unknown objective ${objectiveId}.`);
      }
    }
  }
  const area = guideAreas.find((item) => item.id === chapter.areaId);
  if (area && area.state === "planned") errors.push(`Walkthrough chapter ${chapter.areaId} has content but its coverage state is still planned.`);
  if (area && area.state !== "verified") warnings.push(`Walkthrough chapter ${chapter.areaId} content is ${area.state}, not fully verified.`);
}

for (const area of guideAreas) {
  if (area.state !== "planned" && !walkthroughAreaIds.has(area.id)) {
    errors.push(`Area ${area.id} has a non-planned coverage state but no walkthrough content.`);
  }
}

if (excalibur2Checkpoints.length !== 45) {
  errors.push(`Excalibur II checkpoint schedule has ${excalibur2Checkpoints.length} targets, expected 45.`);
}
for (let index = 0; index < excalibur2Checkpoints.length; index += 1) {
  const checkpoint = excalibur2Checkpoints[index];
  if (!areaIds.has(checkpoint.chapterId)) errors.push(`Excalibur II checkpoint ${checkpoint.id} references unknown chapter ${checkpoint.chapterId}.`);
  if (index > 0 && checkpoint.targetSeconds <= excalibur2Checkpoints[index - 1].targetSeconds) {
    errors.push(`Excalibur II checkpoint ${checkpoint.id} is not in strictly increasing target-time order.`);
  }
  if (checkpoint.targetSeconds >= 12 * 60 * 60) errors.push(`Excalibur II checkpoint ${checkpoint.id} is at or beyond the 12-hour cutoff.`);
}

for (const missable of missables) {
  if (!objectiveIds.has(missable.objectiveId)) errors.push(`Missable ${missable.id} references unknown objective ${missable.objectiveId}.`);
  if (missable.classification.length === 0) errors.push(`Missable ${missable.id} is unclassified.`);
  if (missable.sourceIds.length === 0) errors.push(`Missable ${missable.id} has no provenance.`);
  if (!missable.deadline.trim() || !missable.consequence.trim() || !missable.recovery.trim()) {
    errors.push(`Missable ${missable.id} needs a deadline, consequence, and recovery explanation.`);
  }
  if (missable.classification.includes("recoverable-later") && !missable.nextAvailability) {
    errors.push(`Missable ${missable.id} is recoverable later but does not name its next availability.`);
  }
  for (const chapterId of missable.warningChapterIds ?? []) {
    if (!areaIds.has(chapterId)) errors.push(`Missable ${missable.id} references unknown warning chapter ${chapterId}.`);
    const warningChapter = walkthroughChapters.find((chapter) => chapter.areaId === chapterId);
    const hasLinkedChecklistStep = warningChapter?.sections.some((section) =>
      section.steps.some((step) => step.objectiveIds?.includes(missable.objectiveId)),
    );
    if (!hasLinkedChecklistStep) {
      errors.push(`Missable ${missable.id} warning chapter ${chapterId} has no checklist step for objective ${missable.objectiveId}.`);
    }
  }
  for (const sourceId of missable.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Missable ${missable.id} references unknown source ${sourceId}.`);
  }
  if (missable.verification !== "verified") warnings.push(`${missable.id} is implemented but not fully verified.`);
}

const acquisitionCounts = new Map<string, number>();
for (const item of gameItems) {
  if (!item.name.trim()) errors.push(`Game item ${item.id} is missing a name.`);
  if (item.sourceIds.length === 0) errors.push(`Game item ${item.id} has no provenance.`);
  for (const sourceId of item.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Game item ${item.id} references unknown source ${sourceId}.`);
  }
}
for (const path of itemAcquisitionPaths) {
  if (!gameItemIds.has(path.itemId)) errors.push(`Item acquisition path ${path.id} references unknown item ${path.itemId}.`);
  if (!areaIds.has(path.chapterId)) errors.push(`Item acquisition path ${path.id} references unknown chapter ${path.chapterId}.`);
  if (!walkthroughChapterIds.has(path.chapterId)) errors.push(`Item acquisition path ${path.id} has no authored walkthrough for ${path.chapterId}.`);
  if (!Number.isSafeInteger(path.quantity) || path.quantity < 1) errors.push(`Item acquisition path ${path.id} needs a positive integer quantity.`);
  if (path.sourceIds.length === 0) errors.push(`Item acquisition path ${path.id} has no provenance.`);
  if (path.cost && (!Number.isSafeInteger(path.cost.amount) || path.cost.amount < 0)) {
    errors.push(`Item acquisition path ${path.id} has an invalid currency cost.`);
  }
  if (path.recommendedBeforeChapterId && !areaIds.has(path.recommendedBeforeChapterId)) {
    errors.push(`Item acquisition path ${path.id} recommends an unknown cutoff chapter ${path.recommendedBeforeChapterId}.`);
  }
  if (path.method === "shop" || path.method === "mogshop" || path.method === "moogle-shop" || path.method === "synthesis") {
    if (!path.shopId?.trim() || !path.shopName?.trim()) errors.push(`Shop acquisition path ${path.id} needs a shop ID and name.`);
    if (path.cost?.currency !== "gil") errors.push(`Shop acquisition path ${path.id} needs a Gil price.`);
  }
  if (path.method === "auction" && (!path.shopId?.trim() || !path.shopName?.trim())) {
    errors.push(`Auction acquisition path ${path.id} needs an auction ID and name.`);
  }
  if (path.method === "auction" && path.cost) {
    errors.push(`Auction acquisition path ${path.id} must not store a fixed bid price.`);
  }
  if (path.method === "synthesis") {
    if (!path.recipeId || !synthesisRecipeIds.has(path.recipeId)) {
      errors.push(`Synthesis acquisition path ${path.id} needs a known recipe ID.`);
    } else if (synthesisRecipes.find((recipe) => recipe.id === path.recipeId)?.resultItemId !== path.itemId) {
      errors.push(`Synthesis acquisition path ${path.id} item does not match recipe ${path.recipeId}.`);
    }
  } else if (path.recipeId) {
    errors.push(`Non-synthesis acquisition path ${path.id} must not reference a recipe.`);
  }
  for (const objectiveId of path.walkthroughObjectiveIds ?? []) {
    if (!objectiveIds.has(objectiveId)) errors.push(`Item acquisition path ${path.id} references unknown objective ${objectiveId}.`);
  }
  if (path.availability === "limited-window" && path.recommendedBeforeChapterId) {
    const hasLinkedCutoffWarning = (path.walkthroughObjectiveIds ?? []).some((objectiveId) =>
      missables.some((missable) =>
        missable.objectiveId === objectiveId &&
        missable.warningChapterIds?.includes(path.recommendedBeforeChapterId!) &&
        walkthroughChapters
          .find((chapter) => chapter.areaId === path.recommendedBeforeChapterId)
          ?.sections.some((section) => section.steps.some((step) => step.objectiveIds?.includes(objectiveId))),
      ),
    );
    if (!hasLinkedCutoffWarning) {
      errors.push(`Limited-window item acquisition path ${path.id} needs a linked cutoff warning in ${path.recommendedBeforeChapterId}.`);
    }
  }
  for (const sourceId of path.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Item acquisition path ${path.id} references unknown source ${sourceId}.`);
  }
  acquisitionCounts.set(path.itemId, (acquisitionCounts.get(path.itemId) ?? 0) + 1);
}
for (const recipe of synthesisRecipes) {
  if (!gameItemIds.has(recipe.resultItemId)) errors.push(`Synthesis recipe ${recipe.id} references unknown result item ${recipe.resultItemId}.`);
  if (!areaIds.has(recipe.chapterId) || !walkthroughChapterIds.has(recipe.chapterId)) {
    errors.push(`Synthesis recipe ${recipe.id} references a chapter without authored walkthrough content.`);
  }
  if (!recipe.shopId.trim() || !recipe.shopName.trim()) errors.push(`Synthesis recipe ${recipe.id} needs a shop ID and name.`);
  if (!Number.isSafeInteger(recipe.cost.amount) || recipe.cost.amount < 0) errors.push(`Synthesis recipe ${recipe.id} has an invalid Gil cost.`);
  if (recipe.cost.currency !== "gil") errors.push(`Synthesis recipe ${recipe.id} must use Gil as its cost currency.`);
  if (recipe.ingredients.length === 0) errors.push(`Synthesis recipe ${recipe.id} needs at least one ingredient.`);
  for (const ingredient of recipe.ingredients) {
    if (!gameItemIds.has(ingredient.itemId)) errors.push(`Synthesis recipe ${recipe.id} references unknown ingredient ${ingredient.itemId}.`);
    if (!Number.isSafeInteger(ingredient.quantity) || ingredient.quantity < 1) {
      errors.push(`Synthesis recipe ${recipe.id} needs positive integer ingredient quantities.`);
    }
  }
  if (recipe.sourceIds.length === 0) errors.push(`Synthesis recipe ${recipe.id} has no provenance.`);
  for (const sourceId of recipe.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Synthesis recipe ${recipe.id} references unknown source ${sourceId}.`);
  }
}
for (const target of sourceInventoryTargets) {
  if (!gameItemIds.has(target.itemId)) errors.push(`Inventory target ${target.id} references unknown item ${target.itemId}.`);
  if (!areaIds.has(target.chapterId) || !walkthroughChapterIds.has(target.chapterId)) {
    errors.push(`Inventory target ${target.id} references a chapter without authored walkthrough content.`);
  }
  if (!Number.isSafeInteger(target.targetQuantity) || target.targetQuantity < 1) {
    errors.push(`Inventory target ${target.id} needs a positive integer quantity.`);
  }
  if (!target.interpretation.trim()) errors.push(`Inventory target ${target.id} needs an interpretation note.`);
  if (target.sourceIds.length === 0) errors.push(`Inventory target ${target.id} has no provenance.`);
  for (const sourceId of target.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Inventory target ${target.id} references unknown source ${sourceId}.`);
  }
}
for (const claim of equipmentAbilityClaims) {
  if (!gameItemIds.has(claim.itemId)) errors.push(`Equipment ability claim ${claim.id} references unknown item ${claim.itemId}.`);
  if (!claim.abilityName.trim()) errors.push(`Equipment ability claim ${claim.id} is missing an ability name.`);
  if (claim.sourceIds.length === 0) errors.push(`Equipment ability claim ${claim.id} has no provenance.`);
  for (const sourceId of claim.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Equipment ability claim ${claim.id} references unknown source ${sourceId}.`);
  }
}
for (const item of gameItems) {
  if (!acquisitionCounts.has(item.id)) errors.push(`Game item ${item.id} has no acquisition paths.`);
}
for (const chapterId of itemCatalogCoverage.chapterIds) {
  if (!areaIds.has(chapterId)) errors.push(`Item catalog coverage references unknown chapter ${chapterId}.`);
  if (!walkthroughChapterIds.has(chapterId)) errors.push(`Item catalog coverage chapter ${chapterId} has no authored walkthrough.`);
}

for (const arc of arcs) {
  if (arc.areas.length === 0) errors.push(`${arc.label} has no inventory areas.`);
  checkUnique(`${arc.id} area`, arc.areas.map((area) => area.id));
}

for (const [platform, countRecord] of Object.entries(achievementSourceCounts)) {
  if (!countRecord.sourceId || !sourceIds.has(countRecord.sourceId)) {
    errors.push(`${platform} achievement coverage has no valid source record.`);
  }
  if (countRecord.count !== null && countRecord.state !== "verified") {
    warnings.push(`${platform} achievement count is source-checked, but criteria and walkthrough mappings are not fully verified.`);
  }
}
const mappedCatalogAchievements = achievementCatalogs.flatMap(({ records }) => records).filter((achievement) =>
  (achievement.guideObjectiveIds?.length ?? 0) > 0 || (achievement.guideChapterIds?.length ?? 0) > 0,
).length;
const achievementRecordCount = achievementCatalogs.reduce((total, catalog) => total + catalog.records.length, 0);
if (mappedCatalogAchievements < achievementRecordCount) {
  warnings.push(`Achievement guide pointers cover ${mappedCatalogAchievements} of ${achievementRecordCount} records; remaining route mappings are still open.`);
}
if (guideAreas.some((area) => area.state === "verified")) warnings.push("A chapter is marked verified; ensure it has passed the manual walkthrough audit.");

console.log(`FFIX data audit: ${errors.length} error(s), ${warnings.length} coverage warning(s).`);
console.log(`Scope: ${guideAreas.length} chapter headings (${walkthroughChapters.length} with authored content), ${missables.length} missable record(s), ${objectives.length} objective(s), ${sources.length} source records.`);
console.log(`Route cutoffs: ${gameRouteCutoffs.length} windows link ${linkedRouteMissableIds.size}/${missables.length} missable warnings; ${missables.filter((record) => record.severity === "high" || record.severity === "critical").length} high/critical records are included.`);
console.log(`Items: ${gameItems.length} partial item record(s), ${itemAcquisitionPaths.length} source-linked acquisition path(s) across ${itemCatalogCoverage.chapterIds.length} chapter slices; ${synthesisRecipes.length} synthesis recipe(s); ${sourceInventoryTargets.length} source inventory target(s), ${equipmentAbilityClaims.length} partial ability claim(s).`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) process.exitCode = 1;
