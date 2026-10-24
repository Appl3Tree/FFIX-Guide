import { achievementSourceCounts, arcs, guideAreas, missables, objectives, sources } from "../src/data/guide.ts";
import { ps4Trophies, steamAchievements, xboxAchievements } from "../src/data/achievements.ts";
import { excalibur2Checkpoints } from "../src/data/excalibur2.ts";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticExclusiveGroupId, movieCriticTarget } from "../src/data/ates.ts";
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
checkUnique("Steam achievement", steamAchievements.map((achievement) => achievement.id));
checkUnique("PS4 trophy", ps4Trophies.map((achievement) => achievement.id));
checkUnique("Xbox achievement", xboxAchievements.map((achievement) => achievement.id));
checkUnique("area", guideAreas.map((area) => area.id));
checkUnique("walkthrough chapter", walkthroughChapters.map((chapter) => chapter.areaId));
checkUnique("Excalibur II checkpoint", excalibur2Checkpoints.map((checkpoint) => checkpoint.id));
checkUnique("ATE", activeTimeEvents.map((event) => event.id));
checkUnique("ATE progress objective", activeTimeEvents.map((event) => event.objectiveId));

const sourceIds = new Set(sources.map((source) => source.id));
const objectiveIds = new Set(objectives.map((objective) => objective.id));
const areaIds = new Set(guideAreas.map((area) => area.id));
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
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) process.exitCode = 1;
