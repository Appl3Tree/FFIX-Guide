import { achievementSourceCounts, arcs, guideAreas, missables, objectives, sources } from "../src/data/guide.ts";
import { ps4Trophies, steamAchievements, xboxAchievements } from "../src/data/achievements.ts";
import { excalibur2Checkpoints } from "../src/data/excalibur2.ts";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticExclusiveGroupId, movieCriticTarget } from "../src/data/ates.ts";
import { ateObjectiveDependencies, gameRouteCoverage, gameRouteCutoffs, gameRouteEdges, guideChapterSequence, guideSequenceEdges, objectiveDependencies, questPrerequisiteDependencies, storyPartySequences } from "../src/data/progression.ts";
import { findObjectiveDependencyCycles } from "../src/domain/progression.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage, sourceInventoryTargets } from "../src/data/items.ts";
import { synthesisRecipes } from "../src/data/synthesis.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";
import { enemyCatalogCoverage, enemyEncounters, enemyRecords } from "../src/data/enemies.ts";

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
checkUnique("enemy", enemyRecords.map((enemy) => enemy.id));
checkUnique("enemy encounter", enemyEncounters.map((encounter) => encounter.id));

const sourceIds = new Set(sources.map((source) => source.id));
const objectiveIds = new Set(objectives.map((objective) => objective.id));
const gameItemIds = new Set(gameItems.map((item) => item.id));
const synthesisRecipeIds = new Set(synthesisRecipes.map((recipe) => recipe.id));
const areaIds = new Set(guideAreas.map((area) => area.id));
const walkthroughChapterIds = new Set(walkthroughChapters.map((chapter) => chapter.areaId));
const gameRouteEdgesById = new Map(gameRouteEdges.map((edge) => [edge.id, edge]));
const missablesById = new Map(missables.map((missable) => [missable.id, missable]));
const objectivesById = new Map(objectives.map((objective) => [objective.id, objective]));
const cutoffsById = new Map(gameRouteCutoffs.map((cutoff) => [cutoff.id, cutoff]));
const achievementCatalogs = [
  { platform: "steam" as const, records: steamAchievements, expectedCount: achievementSourceCounts.steam.count },
  { platform: "ps4" as const, records: ps4Trophies, expectedCount: achievementSourceCounts.ps4.count },
  { platform: "xbox" as const, records: xboxAchievements, expectedCount: achievementSourceCounts.xbox.count },
];

if (enemyCatalogCoverage.status !== "partial") errors.push("Enemy reference coverage must remain explicitly partial until the full bestiary audit is complete.");
for (const chapterId of enemyCatalogCoverage.chapterIds) {
  if (!areaIds.has(chapterId)) errors.push(`Enemy reference coverage references unknown chapter ${chapterId}.`);
  if (!walkthroughChapterIds.has(chapterId)) errors.push(`Enemy reference chapter ${chapterId} has no authored walkthrough.`);
}
if (new Set(enemyCatalogCoverage.enemyIds).size !== enemyCatalogCoverage.enemyIds.length) errors.push("Enemy coverage repeats an enemy ID.");
if (new Set(enemyCatalogCoverage.encounterIds).size !== enemyCatalogCoverage.encounterIds.length) errors.push("Enemy coverage repeats an encounter ID.");
if (enemyCatalogCoverage.enemyIds.length !== enemyRecords.length || enemyCatalogCoverage.enemyIds.some((id) => !enemyRecords.some((enemy) => enemy.id === id))) {
  errors.push("Enemy coverage inventory does not match the authored enemy records.");
}
if (enemyCatalogCoverage.encounterIds.length !== enemyEncounters.length || enemyCatalogCoverage.encounterIds.some((id) => !enemyEncounters.some((encounter) => encounter.id === id))) {
  errors.push("Enemy coverage inventory does not match the authored encounter groups.");
}
if (!enemyCatalogCoverage.note.trim()) errors.push("Enemy reference coverage has no scope note.");

const supportedEnemyStatFields = new Set(["level", "HP", "MP", "EXP", "AP", "Gil"]);
const supportedEnemyVerifications = new Set(["cross-checked", "single-source", "disputed"]);
const supportedEnemyFactCategories = new Set(["type", "elemental-weakness", "elemental-resistance", "status-vulnerability", "attack"]);
const supportedEnemyLootSlots = new Set(["always", "common", "uncommon", "semi-rare", "rare"]);
const supportedEnemyEncounterKinds = new Set(["fixed", "boss", "random-pool"]);
function validateEnemyReferences(label: string, linkedObjectiveIds: string[], linkedMissableIds: string[], linkedCutoffIds: string[], chapterId: string) {
  for (const objectiveId of linkedObjectiveIds) {
    const objective = objectivesById.get(objectiveId);
    if (!objective) {
      errors.push(`${label} references unknown objective ${objectiveId}.`);
      continue;
    }
    if (objective.chapterIds?.length && !objective.chapterIds.includes(chapterId)) {
      errors.push(`${label} links objective ${objectiveId}, which is not assigned to ${chapterId}.`);
    }
    const linkedSteps = walkthroughChapters
      .filter((chapter) => chapter.areaId === chapterId)
      .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps.filter((step) => step.objectiveIds?.includes(objectiveId))));
    if (linkedSteps.length === 0) errors.push(`${label} objective ${objectiveId} has no checklist pointer in ${chapterId}.`);
  }
  for (const missableId of linkedMissableIds) {
    if (!missablesById.has(missableId)) errors.push(`${label} references unknown missable ${missableId}.`);
    const hasCutoffLink = linkedCutoffIds.some((cutoffId) => cutoffsById.get(cutoffId)?.missableIds.includes(missableId));
    if (!hasCutoffLink) errors.push(`${label} links missable ${missableId} without a matching route cutoff.`);
  }
  for (const cutoffId of linkedCutoffIds) {
    const cutoff = cutoffsById.get(cutoffId);
    if (!cutoff) errors.push(`${label} references unknown route cutoff ${cutoffId}.`);
    else if (!cutoff.missableIds.some((missableId) => linkedMissableIds.includes(missableId))) {
      errors.push(`${label} cutoff ${cutoffId} is not linked to one of its missable warnings.`);
    }
  }
}

for (const enemy of enemyRecords) {
  if (enemy.coverage !== "partial") errors.push(`Enemy ${enemy.id} must remain partial until its source and version audit is complete.`);
  if (!enemy.name.trim() || !enemy.versionScope.trim()) errors.push(`Enemy ${enemy.id} has no name or version scope.`);
  if (!areaIds.has(enemy.chapterId) || !walkthroughChapterIds.has(enemy.chapterId)) errors.push(`Enemy ${enemy.id} references a missing walkthrough chapter ${enemy.chapterId}.`);
  if (enemy.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} has no source provenance.`);
  for (const sourceId of enemy.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} references unknown source ${sourceId}.`);
  for (const encounterId of enemy.encounterIds) {
    const encounter = enemyEncounters.find((candidate) => candidate.id === encounterId);
    if (!encounter) errors.push(`Enemy ${enemy.id} references unknown encounter ${encounterId}.`);
    else if (!encounter.formation.some((entry) => entry.enemyId === enemy.id)) errors.push(`Enemy ${enemy.id} is absent from linked encounter ${encounterId}.`);
  }
  const claimsByField = new Map<string, typeof enemy.stats>();
  for (const claim of enemy.stats) {
    if (!supportedEnemyStatFields.has(claim.field)) errors.push(`Enemy ${enemy.id} has unsupported stat field ${claim.field}.`);
    if (!Number.isFinite(claim.value) || claim.value < 0) errors.push(`Enemy ${enemy.id} has an invalid ${claim.field} value.`);
    if (!supportedEnemyVerifications.has(claim.verification)) errors.push(`Enemy ${enemy.id} has unsupported stat verification ${claim.verification}.`);
    if (claim.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} ${claim.field} claim has no source provenance.`);
    for (const sourceId of claim.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} ${claim.field} claim references unknown source ${sourceId}.`);
      else if (!enemy.sourceIds.includes(sourceId)) errors.push(`Enemy ${enemy.id} omits ${sourceId} from its record source list.`);
    }
    claimsByField.set(claim.field, [...(claimsByField.get(claim.field) ?? []), claim]);
  }
  for (const [field, claims] of claimsByField) {
    if (claims.length > 1 && claims.some((claim) => claim.verification !== "disputed")) {
      errors.push(`Enemy ${enemy.id} has conflicting ${field} claims without marking every claim disputed.`);
    }
  }
  for (const tableName of ["steals", "drops"] as const) {
    const seenSlots = new Set<string>();
    for (const entry of enemy[tableName]) {
      if (!supportedEnemyLootSlots.has(entry.slot)) errors.push(`Enemy ${enemy.id} has unsupported ${tableName} slot ${entry.slot}.`);
      if (seenSlots.has(entry.slot)) errors.push(`Enemy ${enemy.id} repeats ${tableName} slot ${entry.slot}.`);
      seenSlots.add(entry.slot);
      if (entry.itemId && !gameItemIds.has(entry.itemId)) errors.push(`Enemy ${enemy.id} ${tableName} slot ${entry.slot} references unknown item ${entry.itemId}.`);
      if (!entry.itemId && !entry.itemName?.trim()) errors.push(`Enemy ${enemy.id} ${tableName} slot ${entry.slot} has no item result.`);
      if (entry.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} ${tableName} slot ${entry.slot} has no source provenance.`);
      for (const sourceId of entry.sourceIds) {
        if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} ${tableName} slot ${entry.slot} references unknown source ${sourceId}.`);
        else if (!enemy.sourceIds.includes(sourceId)) errors.push(`Enemy ${enemy.id} omits ${sourceId} from its record source list.`);
      }
    }
  }
  for (const fact of enemy.facts) {
    if (!supportedEnemyFactCategories.has(fact.category)) errors.push(`Enemy ${enemy.id} has unsupported combat fact ${fact.category}.`);
    if (!fact.label.trim()) errors.push(`Enemy ${enemy.id} has a blank combat fact.`);
    if (fact.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} combat fact ${fact.label} has no source provenance.`);
    for (const sourceId of fact.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} combat fact references unknown source ${sourceId}.`);
      else if (!enemy.sourceIds.includes(sourceId)) errors.push(`Enemy ${enemy.id} omits ${sourceId} from its record source list.`);
    }
  }
  for (const skill of enemy.blueMagic) {
    if (!skill.name.trim() || !skill.command.trim()) errors.push(`Enemy ${enemy.id} has an incomplete Blue Magic record.`);
    validateEnemyReferences(`Enemy ${enemy.id} Blue Magic ${skill.name}`, skill.objectiveIds, [], [], enemy.chapterId);
    for (const sourceId of skill.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} Blue Magic ${skill.name} references unknown source ${sourceId}.`);
      else if (!enemy.sourceIds.includes(sourceId)) errors.push(`Enemy ${enemy.id} omits ${sourceId} from its record source list.`);
    }
  }
  for (const strategy of enemy.strategies) {
    if (!strategy.title.trim() || !strategy.detail.trim()) errors.push(`Enemy ${enemy.id} has an incomplete battle strategy.`);
    if (strategy.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} strategy ${strategy.title} has no source provenance.`);
    for (const sourceId of strategy.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} strategy references unknown source ${sourceId}.`);
      else if (!enemy.sourceIds.includes(sourceId)) errors.push(`Enemy ${enemy.id} omits ${sourceId} from its record source list.`);
    }
  }
  validateEnemyReferences(`Enemy ${enemy.id}`, enemy.routeObjectiveIds, enemy.missableIds, enemy.cutoffIds, enemy.chapterId);
  for (const encounterId of enemy.encounterIds) if (!enemyCatalogCoverage.encounterIds.includes(encounterId)) errors.push(`Enemy ${enemy.id} encounter ${encounterId} is missing from coverage inventory.`);
}

for (const encounter of enemyEncounters) {
  if (!supportedEnemyEncounterKinds.has(encounter.kind)) errors.push(`Enemy encounter ${encounter.id} has unsupported kind ${encounter.kind}.`);
  if (!enemyCatalogCoverage.chapterIds.includes(encounter.chapterId)) errors.push(`Enemy encounter ${encounter.id} is outside the declared coverage chapter scope.`);
  if (!areaIds.has(encounter.chapterId) || !walkthroughChapterIds.has(encounter.chapterId)) errors.push(`Enemy encounter ${encounter.id} references a missing walkthrough chapter ${encounter.chapterId}.`);
  if (!encounter.title.trim() || !encounter.location.trim() || encounter.notes.length === 0) errors.push(`Enemy encounter ${encounter.id} is missing route context.`);
  if (encounter.sourceIds.length === 0) errors.push(`Enemy encounter ${encounter.id} has no source provenance.`);
  for (const sourceId of encounter.sourceIds) if (!sourceIds.has(sourceId)) errors.push(`Enemy encounter ${encounter.id} references unknown source ${sourceId}.`);
  if (encounter.formation.length === 0) errors.push(`Enemy encounter ${encounter.id} has an empty formation.`);
  for (const member of encounter.formation) {
    const enemy = enemyRecords.find((record) => record.id === member.enemyId);
    if (!enemy) errors.push(`Enemy encounter ${encounter.id} references unknown enemy ${member.enemyId}.`);
    else if (!enemy.encounterIds.includes(encounter.id)) errors.push(`Enemy encounter ${encounter.id} is missing from ${member.enemyId}'s encounter links.`);
    if (encounter.kind === "random-pool") {
      if (member.quantity !== null) errors.push(`Random encounter pool ${encounter.id} must not claim an exact quantity for ${member.enemyId}.`);
      if (enemy?.kind === "boss" || enemy?.kind === "component") errors.push(`Random encounter pool ${encounter.id} cannot contain boss or component ${member.enemyId}.`);
    } else {
      if (!Number.isInteger(member.quantity) || member.quantity === null || member.quantity < 1) errors.push(`Enemy encounter ${encounter.id} has an invalid quantity for ${member.enemyId}.`);
      if (encounter.kind === "boss" && enemy?.kind !== "boss" && enemy?.kind !== "component") errors.push(`Boss encounter ${encounter.id} contains non-boss enemy ${member.enemyId}.`);
      if (encounter.kind === "fixed" && (enemy?.kind === "boss" || enemy?.kind === "component")) errors.push(`Fixed encounter ${encounter.id} contains boss or component enemy ${member.enemyId}.`);
    }
  }
  validateEnemyReferences(`Enemy encounter ${encounter.id}`, encounter.objectiveIds, encounter.missableIds, encounter.cutoffIds, encounter.chapterId);
}

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
const alexandriaPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.return-to-alexandria");
if (!alexandriaPartySequence) {
  errors.push("The Disc II Alexandria party handoff sequence is missing.");
} else {
  if (alexandriaPartySequence.phases.length !== 5) errors.push("The Disc II Alexandria sequence must retain its five sourced party phases.");
  if (alexandriaPartySequence.phases[0]?.party !== "Zidane, Vivi, and Freya") errors.push("The Disc II Alexandria sequence must begin aboard the Red Rose with Zidane, Vivi, and Freya.");
  if (!alexandriaPartySequence.phases.some((phase) => phase.party === "Steiner and Marcus")) errors.push("The Disc II Alexandria sequence must include Steiner and Marcus's cage escape.");
  if (!alexandriaPartySequence.phases.some((phase) => phase.location === "Alexandria Castle descent" && phase.summary.includes("alternates"))) {
    errors.push("The Disc II Alexandria sequence must record the alternating descent parties.");
  }
  if (alexandriaPartySequence.phases.at(-1)?.chapterIds.join(",") !== "disc-2.return-to-alexandria,disc-2.pinnacle-rocks") {
    errors.push("The Disc II Alexandria sequence must connect the Gargan Roo escape to Pinnacle Rocks.");
  }
  for (const sourceId of ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "gamerguides-alexandria-castle-2"]) {
    if (!alexandriaPartySequence.sourceIds.includes(sourceId)) errors.push(`The Disc II Alexandria sequence is missing corroborating source ${sourceId}.`);
  }
}
const cleyraPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.cleyra-antlion");
if (!cleyraPartySequence) {
  errors.push("The post-Antlion Cleyra party handoff sequence is missing.");
} else {
  if (cleyraPartySequence.phases.length !== 3) errors.push("The post-Antlion Cleyra sequence must retain its three party phases.");
  if (cleyraPartySequence.phases[0]?.party !== "Zidane, Vivi, and Quina") errors.push("The post-Antlion Cleyra sequence must begin with Zidane, Vivi, and Quina.");
  if (cleyraPartySequence.phases[1]?.party !== "Freya") errors.push("The post-Antlion Cleyra sequence must show Freya's separate control phase.");
  if (!cleyraPartySequence.phases[2]?.summary.includes("forced Trunk transit")) errors.push("The post-Antlion Cleyra sequence must connect the reunion to the required Trunk return.");
  for (const sourceId of ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra"]) {
    if (!cleyraPartySequence.sourceIds.includes(sourceId)) errors.push(`The post-Antlion Cleyra sequence is missing corroborating source ${sourceId}.`);
  }
}
const pandemoniumPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.pandemonium-fixed-fights");
if (!pandemoniumPartySequence) {
  errors.push("The Pandemonium fixed party-split sequence is missing.");
} else {
  if (pandemoniumPartySequence.phases.length !== 4) errors.push("The Pandemonium sequence must retain its three fights and post-split regroup phase.");
  if (pandemoniumPartySequence.phases[0]?.party !== "Zidane alone; Freya and Amarant join") {
    errors.push("The Pandemonium sequence must open with Zidane alone before Freya and Amarant join.");
  }
  if (pandemoniumPartySequence.phases[1]?.party !== "Steiner and Quina; Zidane joins") errors.push("The Pandemonium Abadon fight must begin with Steiner and Quina.");
  if (pandemoniumPartySequence.phases[2]?.party !== "Zidane alone; Dagger joins") errors.push("The Pandemonium Shell Dragon fight must begin with Zidane alone before Dagger joins.");
  const pandemoniumRegroup = pandemoniumPartySequence.phases[3];
  if (pandemoniumRegroup?.party !== "Zidane, Dagger, Steiner, and Quina; then player-selected party") {
    errors.push("The Pandemonium sequence must retain the four-character regroup before party selection.");
  }
  if (!pandemoniumRegroup?.location.includes("Moorock") || !pandemoniumRegroup.location.includes("throne room")) {
    errors.push("The Pandemonium sequence must retain Moorock and the return to the throne room.");
  }
  const moorockIndex = pandemoniumRegroup?.summary.indexOf("Speak to Moorock") ?? -1;
  const throneIndex = pandemoniumRegroup?.summary.indexOf("return to the throne room") ?? -1;
  const holyMiterIndex = pandemoniumRegroup?.summary.indexOf("Holy Miter") ?? -1;
  if (moorockIndex < 0 || throneIndex <= moorockIndex || holyMiterIndex <= throneIndex) {
    errors.push("The Pandemonium sequence must place the Moorock stop before the throne-room Holy Miter pickup.");
  }
  for (const sourceId of ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "flactem-pandemonium"]) {
    if (!pandemoniumPartySequence.sourceIds.includes(sourceId)) errors.push(`The Pandemonium sequence is missing corroborating source ${sourceId}.`);
  }
}
const fourShrinesPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.four-shrines-fixed-pairs");
if (!fourShrinesPartySequence) {
  errors.push("The Four Shrines fixed party-pair sequence is missing.");
} else {
  if (fourShrinesPartySequence.phases.length !== 4) errors.push("The Four Shrines sequence must retain its three fixed pairs and Earth Shrine phase.");
  const expectedParties = [
    "Dagger and Eiko dropped at the shrine",
    "Freya and Amarant dropped; Zidane, Vivi, Steiner, and Quina remain",
    "Vivi and Steiner dropped; Zidane and Quina remain",
    "Zidane and Quina at Earth; then player-selected party",
  ];
  for (const [index, expectedParty] of expectedParties.entries()) {
    if (fourShrinesPartySequence.phases[index]?.party !== expectedParty) {
      errors.push(`The Four Shrines sequence has an incorrect fixed party assignment in phase ${index + 1}.`);
    }
  }
  const expectedLocations = ["Water Shrine", "Fire Shrine", "Wind Shrine", "Earth Shrine"];
  for (const [index, expectedLocation] of expectedLocations.entries()) {
    if (!fourShrinesPartySequence.phases[index]?.location.includes(expectedLocation)) {
      errors.push(`The Four Shrines sequence must visit ${expectedLocation} in the documented route order.`);
    }
  }
  if (!fourShrinesPartySequence.phases[3]?.location.includes("Hilda Garde 3")) {
    errors.push("The Four Shrines sequence must end with the party regroup on the Hilda Garde 3.");
  }
  for (const sourceId of ["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra", "rpgclassics-disc-3-walkthrough"]) {
    if (!fourShrinesPartySequence.sourceIds.includes(sourceId)) errors.push(`The Four Shrines sequence is missing corroborating source ${sourceId}.`);
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
const supportedObjectiveDependencyKinds = new Set(["ate-sequence", "objective-access", "quest-prerequisite"]);
for (const dependency of objectiveDependencies) {
  if (!supportedObjectiveDependencyKinds.has(dependency.kind)) errors.push(`Dependency has unsupported kind ${dependency.kind}.`);
  if (!objectiveIds.has(dependency.prerequisiteObjectiveId)) errors.push(`Dependency references unknown prerequisite objective ${dependency.prerequisiteObjectiveId}.`);
  if (!objectiveIds.has(dependency.dependentObjectiveId)) errors.push(`Dependency references unknown dependent objective ${dependency.dependentObjectiveId}.`);
  for (const sourceId of dependency.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Dependency ${dependency.prerequisiteObjectiveId} -> ${dependency.dependentObjectiveId} references unknown source ${sourceId}.`);
  }
}
const friendlyCreaturePrerequisiteIds = [
  "disc-1.ice-cavern.mu-friendly-monster",
  "disc-2.journey-to-treno.friendly-ghost",
  "disc-2.outer-continent.friendly-ladybug",
  "disc-2.conde-petie-mountain-path.friendly-yeti",
  "disc-2.journey-to-iifa-tree.nymph",
  "disc-3.forgotten-continent.jabberwock",
  "disc-3.lost-continent.feather-circle",
  "disc-3.aerial-exploration.garuda",
];
const friendlyYanObjectiveId = "disc-3.aerial-exploration.friendly-yan";
const expectedFriendlyYanPrerequisites = friendlyCreaturePrerequisiteIds.map((id) => `${id}->${friendlyYanObjectiveId}`).sort();
const actualFriendlyYanPrerequisites = questPrerequisiteDependencies
  .filter((dependency) => dependency.dependentObjectiveId === friendlyYanObjectiveId)
  .map((dependency) => `${dependency.prerequisiteObjectiveId}->${dependency.dependentObjectiveId}`)
  .sort();
if (expectedFriendlyYanPrerequisites.join("|") !== actualFriendlyYanPrerequisites.join("|")) {
  errors.push("Friendly Yan must have exactly the eight other Friendly Creatures as quest prerequisites.");
}
const firstEightCreatureIds = new Set(friendlyCreaturePrerequisiteIds);
if (questPrerequisiteDependencies.some((dependency) =>
  firstEightCreatureIds.has(dependency.prerequisiteObjectiveId) && firstEightCreatureIds.has(dependency.dependentObjectiveId),
)) {
  errors.push("The first eight Friendly Creatures must not be ordered against one another.");
}
for (const dependency of questPrerequisiteDependencies) {
  if (!dependency.sourceIds.includes("gamefaqs-friendly-creatures-71891") || !dependency.sourceIds.includes("jegged-friendly-monsters")) {
    errors.push(`Friendly Creature prerequisite ${dependency.prerequisiteObjectiveId} -> ${dependency.dependentObjectiveId} must cite both direct prerequisite sources.`);
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

const jumpRopeLetterId = "disc-1.alexandria.jump-rope-mognet-letter";
const jumpRopeLetterObjective = objectives.find((objective) => objective.id === jumpRopeLetterId);
const jumpRopeLetterWarning = missables.find((missable) => missable.objectiveId === jumpRopeLetterId);
const jumpRopeLetterSteps = walkthroughChapters.flatMap((chapter) =>
  chapter.sections.flatMap((section) => section.steps.filter((step) => step.objectiveIds?.includes(jumpRopeLetterId)).map((step) => ({ chapterId: chapter.areaId, step }))),
);
if (jumpRopeLetterObjective?.category !== "side-content" || !jumpRopeLetterObjective.chapterIds?.includes("disc-1.alexandria")) {
  errors.push("The Jump Rope Mognet letter must remain a Disc I Alexandria side-content objective.");
}
if (!jumpRopeLetterObjective?.sourceIds.includes("gamefaqs-jump-rope-71891")) {
  errors.push("The Jump Rope Mognet letter objective must cite the 50-jump Disc I source.");
}
if (!jumpRopeLetterObjective?.sourceIds.includes("gamerguides-alexandria") || !jumpRopeLetterWarning?.sourceIds.includes("gamerguides-alexandria")) {
  errors.push("The Jump Rope Mognet letter objective and warning must retain Gamer Guides' independent 50-jump letter evidence.");
}
if (!jumpRopeLetterObjective?.sourceIds.includes("jegged-alexandria-castle") || !jumpRopeLetterWarning?.sourceIds.includes("jegged-alexandria-castle")) {
  errors.push("The Jump Rope Mognet letter objective and warning must retain Jegged's Mosh/Mognet route confirmation.");
}
if (!jumpRopeLetterWarning || !jumpRopeLetterWarning.classification.includes("conditional") || jumpRopeLetterWarning.classification.includes("permanently-missable")) {
  errors.push("The Jump Rope Mognet letter warning must remain conditional without asserting permanent loss.");
}
if (!jumpRopeLetterWarning?.consequence.includes("whether this Disc I letter remains readable during the Alexandria return is unresolved")) {
  errors.push("The Jump Rope Mognet letter warning must preserve the unresolved Disc III recovery question.");
}
if (jumpRopeLetterSteps.length !== 1 || jumpRopeLetterSteps[0]?.chapterId !== "disc-1.alexandria" || jumpRopeLetterSteps[0]?.step.id !== "guardhouse-pickup-mognet") {
  errors.push("The Jump Rope Mognet letter objective must point to Mosh's Disc I guardhouse step.");
}
const friendlyCreatureObjectiveIds = [
  "disc-1.ice-cavern.mu-friendly-monster",
  "disc-2.journey-to-treno.friendly-ghost",
  "disc-2.outer-continent.friendly-ladybug",
  "disc-2.conde-petie-mountain-path.friendly-yeti",
  "disc-2.journey-to-iifa-tree.nymph",
  "disc-3.forgotten-continent.jabberwock",
  "disc-3.lost-continent.feather-circle",
  "disc-3.aerial-exploration.garuda",
  "disc-3.aerial-exploration.friendly-yan",
].sort();
const friendlyCreatureAchievementPlatforms = ["steam", "ps4", "xbox"] as const;
for (const objectiveId of friendlyCreatureObjectiveIds) {
  const objective = objectivesById.get(objectiveId);
  if (!objective?.profileIds?.includes("achievements")) {
    errors.push(`Friendly creature objective ${objectiveId} must be included in the achievement goal.`);
  }
  if (friendlyCreatureAchievementPlatforms.some((platform) => !objective?.achievementPlatforms?.includes(platform))) {
    errors.push(`Friendly creature objective ${objectiveId} must be platform-scoped to Steam, PS4, and Xbox achievements.`);
  }
}
for (const { platform, records } of achievementCatalogs) {
  const misterNiceGuy = records.find((achievement) =>
    ("parityId" in achievement ? achievement.parityId : achievement.id) === "mister-nice-guy",
  );
  const mappedFriendlyObjectives = [...(misterNiceGuy?.guideObjectiveIds ?? [])].sort();
  if (mappedFriendlyObjectives.length !== friendlyCreatureObjectiveIds.length || mappedFriendlyObjectives.join("|") !== friendlyCreatureObjectiveIds.join("|")) {
    errors.push(`${platform} Mister Nice Guy must link all nine Friendly Creatures objectives, including Garuda.`);
  }
}
const plutoKnightsId = "disc-1.alexandria.pluto-knights-elixir";
const plutoKnightsObjective = objectivesById.get(plutoKnightsId);
const plutoKnightsSection = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-1.alexandria")
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.steps.some((step) => step.id === "find-pluto-knights"));
const plutoKnightsStep = plutoKnightsSection?.steps.find((step) => step.id === "find-pluto-knights");
if (
  !plutoKnightsObjective?.sourceIds.includes("gamefaqs-alexandria-castle-47344")
  || !plutoKnightsObjective.sourceIds.includes("strategywiki-alexandria")
  || !plutoKnightsSection?.sourceIds.includes("gamefaqs-alexandria-castle-47344")
  || !plutoKnightsSection.sourceIds.includes("strategywiki-alexandria")
  || !plutoKnightsStep?.text.includes("northernmost bookshelf")
  || !plutoKnightsStep.detail?.includes("Action button")
  || !plutoKnightsStep.detail.includes("Guest Room")
  || !plutoKnightsStep.detail.includes("East Dining Room")
) {
  errors.push("The Knights of Pluto route must source Laudo's leave/reenter bookshelf interaction and identify Mullenkedheim's room-label variants.");
}

const burmeciaTreasureWarning = missables.find((missable) => missable.id === "missable.disc-1.burmecia.treasures");
const burmeciaTreasureCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.burmecia.first-visit-departure");
if (!burmeciaTreasureWarning?.sourceIds.includes("ffwiki-unrevisitable-locations") || !burmeciaTreasureCutoff?.sourceIds.includes("ffwiki-unrevisitable-locations")) {
  errors.push("The Burmecia treasure warning and cutoff must retain the palace-only unrevisitable-location source.");
}
if (burmeciaTreasureCutoff?.certainty !== "conservative") {
  errors.push("The Burmecia first-visit treasure deadline must stay conservative while later chest-room access is unresolved.");
}
if (burmeciaTreasureWarning?.classification.includes("permanently-missable") || !burmeciaTreasureWarning?.note.includes("does not establish chest-room access")) {
  errors.push("The Burmecia treasure warning must not claim permanent loss from incomplete later-access evidence.");
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
const cleyraShopPaths = itemAcquisitionPaths.filter((path) =>
  path.chapterId === "disc-2.cleyra" && path.shopId?.startsWith("cleyra."),
);
const cleyraProductIds = [...new Set(cleyraShopPaths.map((path) => path.itemId))];
const cleyraChapterIndex = guideAreas.findIndex((area) => area.id === "disc-2.cleyra");
if (cleyraShopPaths.length !== 26 || cleyraProductIds.length !== 26) {
  errors.push(`Cleyra shop coverage needs 26 priced paths for 26 unique products; found ${cleyraShopPaths.length} paths for ${cleyraProductIds.length} products.`);
}
for (const path of cleyraShopPaths) {
  if (path.cost?.currency !== "gil") errors.push(`Cleyra shop path ${path.id} needs its listed Gil price.`);
  if (!path.walkthroughObjectiveIds?.includes("disc-2.cleyra.shop-stock")) {
    errors.push(`Cleyra shop path ${path.id} must link to the Cleyra stock objective.`);
  }
  if (!path.sourceIds.includes("gamefaqs-shops-71891")) {
    errors.push(`Cleyra shop path ${path.id} must cite the shop stock reference.`);
  }
}
const cleyraProductsWithLaterPaths = cleyraProductIds.filter((itemId) =>
  itemAcquisitionPaths.some((path) =>
    path.itemId === itemId && guideAreas.findIndex((area) => area.id === path.chapterId) > cleyraChapterIndex,
  ),
);
for (const itemId of cleyraProductIds) {
  if (!cleyraProductsWithLaterPaths.includes(itemId)) {
    errors.push(`Cleyra shop product ${itemId} has no modeled acquisition path after Cleyra.`);
  }
}
const broadswordId = "game-item.broadsword";
const broadswordPathIds = [
  "item-path.disc-1.alexandria.broadsword-steiner-starting-equipment",
  "item-path.disc-1.evil-forest.prison-cage-broadsword-steal",
  "item-path.disc-1.village-of-dali.broadsword-shop",
  "item-path.disc-3.ipsens-castle.broadsword-chest",
];
if (!gameItemIds.has(broadswordId)) errors.push("Broadsword recovery needs a catalog item record.");
for (const pathId of broadswordPathIds) {
  if (!itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === broadswordId)) {
    errors.push(`Broadsword recovery is missing acquisition path ${pathId}.`);
  }
}
const broadswordDaliShop = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.village-of-dali.broadsword-shop");
if (broadswordDaliShop?.cost?.currency !== "gil" || broadswordDaliShop.cost.amount !== 330) {
  errors.push("Broadsword's Dali recovery path must remain priced at 330 Gil.");
}
if (!sourceInventoryTargets.some((target) => target.itemId === broadswordId && target.targetQuantity === 2 && target.chapterId === "disc-4.final-preparations")) {
  errors.push("Broadsword needs its source-listed Need 2 inventory target.");
}
if (!equipmentAbilityClaims.some((claim) => claim.itemId === broadswordId && claim.abilityName === "Beast Killer")) {
  errors.push("Broadsword needs its source-listed Beast Killer ability claim.");
}
const broadswordEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.prison-cage-vivi");
if (!broadswordEnemy?.steals.some((slot) => slot.itemId === broadswordId)) {
  errors.push("The second Prison Cage enemy record must link its Broadsword steal to the catalog item.");
}
const broadswordWarning = missablesById.get("missable.disc-1.evil-forest.prison-cage-steals");
if (!broadswordWarning?.classification.includes("recoverable-later") || !broadswordWarning.recovery.includes("Dali") || !broadswordWarning.recovery.includes("Ipsen")) {
  errors.push("The Prison Cage steal warning must distinguish the one-time steal from Broadsword's Dali and Ipsen recovery routes.");
}
const iceBrandId = "game-item.ice-brand";
const iceBrandPathIds = new Set(itemAcquisitionPaths.filter((path) => path.itemId === iceBrandId).map((path) => path.id));
const requiredIceBrandPathIds = [
  "item-path.disc-2.cleyra.beatrix-ice-brand-steal",
  "item-path.disc-2.return-to-alexandria.queen-room-ice-brand-chest",
  "item-path.disc-2.return-to-alexandria.beatrix-ice-brand-steal",
  "item-path.disc-2.return-to-lindblum.ice-brand-shop",
  "item-path.disc-2.return-to-lindblum.dragon-gate-ice-brand-shop",
  "item-path.disc-2.journey-to-outer-continent.fossil-roo-ice-brand-shop",
  "item-path.disc-3.the-home-front.alexandria-ice-brand-shop",
  "item-path.disc-3.card-tournament.treno-ice-brand-shop",
];
if (!gameItemIds.has(iceBrandId)) errors.push("Ice Brand needs a catalog item record.");
for (const pathId of requiredIceBrandPathIds) {
  if (!iceBrandPathIds.has(pathId)) errors.push(`Ice Brand recovery coverage is missing path ${pathId}.`);
}
const iceBrandShopPaths = itemAcquisitionPaths.filter((path) => path.itemId === iceBrandId && path.method === "shop");
if (iceBrandShopPaths.length !== 5 || iceBrandShopPaths.some((path) => path.cost?.currency !== "gil" || path.cost.amount !== 3780)) {
  errors.push("Ice Brand must keep its five documented shop paths at 3,780 Gil each.");
}
if (!equipmentAbilityClaims.some((claim) => claim.itemId === iceBrandId && claim.abilityName === "Mental Break")) {
  errors.push("Ice Brand needs its source-listed Mental Break ability claim.");
}
if (!sourceInventoryTargets.some((target) => target.itemId === iceBrandId && target.targetQuantity === 2)) {
  errors.push("Ice Brand needs its source-listed Need 2 inventory target.");
}
const zornThornItemIds = [
  "game-item.partisan",
  "game-item.stardust-rod",
  "game-item.mythril-armor",
  "game-item.mythril-armlet",
];
for (const itemId of zornThornItemIds) {
  if (!gameItemIds.has(itemId)) errors.push(`Zorn and Thorn recovery coverage needs catalog item ${itemId}.`);
}
const zornThornShopCounts = new Map([
  ["game-item.partisan", 7],
  ["game-item.stardust-rod", 7],
  ["game-item.mythril-armor", 8],
  ["game-item.mythril-armlet", 8],
]);
for (const [itemId, expectedCount] of zornThornShopCounts) {
  const paths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && path.method === "shop");
  if (paths.length !== expectedCount || paths.some((path) => path.cost?.currency !== "gil")) {
    errors.push(`Zorn and Thorn recovery for ${itemId} needs ${expectedCount} Gil-priced shop paths; found ${paths.length}.`);
  }
}
for (const itemId of zornThornItemIds) {
  if (!itemAcquisitionPaths.some((path) => path.itemId === itemId && path.method === "steal" && path.chapterId === "disc-2.return-to-alexandria")) {
    errors.push(`Zorn and Thorn recovery for ${itemId} needs its one-time boss steal path.`);
  }
  const targetQuantity = new Map([
    ["game-item.partisan", 2],
    ["game-item.stardust-rod", 2],
    ["game-item.mythril-armor", 3],
    ["game-item.mythril-armlet", 7],
  ]).get(itemId);
  if (!sourceInventoryTargets.some((target) => target.itemId === itemId && target.targetQuantity === targetQuantity)) {
    errors.push(`Zorn and Thorn recovery for ${itemId} needs its source-listed Need ${targetQuantity} inventory target.`);
  }
}
if (!itemAcquisitionPaths.some((path) => path.id === "item-path.disc-2.pinnacle-rocks.mythril-armlet-chest")) {
  errors.push("Mythril Armlet needs its Pinnacle Rocks chest path in addition to Thorn's steal.");
}
const zornThornAbilityClaims = [
  ["game-item.partisan", "High Tide"],
  ["game-item.partisan", "Lancer"],
  ["game-item.stardust-rod", "Ability Up"],
  ["game-item.stardust-rod", "Reflect"],
  ["game-item.stardust-rod", "Float"],
  ["game-item.mythril-armor", "Cover"],
  ["game-item.mythril-armor", "Jelly"],
  ["game-item.mythril-armlet", "Bug Killer"],
];
for (const [itemId, abilityName] of zornThornAbilityClaims) {
  if (!equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName)) {
    errors.push(`Zorn and Thorn recovery for ${itemId} needs its ${abilityName} ability claim.`);
  }
}
const mythrilArmorSteal = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-alexandria.thorn-mythril-armor");
if (!mythrilArmorSteal?.notes?.includes("GameFAQs Items index") || !mythrilArmorSteal.notes.includes("Thorn")) {
  errors.push("The Mythril Armor steal path must retain the Zorn/Thorn source conflict note.");
}
const ralvuimagoItemIds = ["game-item.phoenix-down", "game-item.adaman-vest", "game-item.oak-staff"];
for (const itemId of ralvuimagoItemIds) {
  if (!gameItemIds.has(itemId)) errors.push(`Ralvuimago recovery coverage needs catalog item ${itemId}.`);
  if (!itemAcquisitionPaths.some((path) => path.itemId === itemId && path.chapterId === "disc-2.return-to-alexandria" && path.method === "steal")) {
    errors.push(`Ralvuimago recovery coverage needs the one-time steal path for ${itemId}.`);
  }
}
if (!itemAcquisitionPaths.some((path) => path.id === "item-path.disc-2.return-to-alexandria.ralvuimago-phoenix-down-steal")) {
  errors.push("Ralvuimago recovery coverage needs the Phoenix Down steal path.");
}
if (!itemAcquisitionPaths.some((path) => path.itemId === "game-item.phoenix-down" && path.method === "shop" && path.chapterId === "disc-2.cleyra")) {
  errors.push("Phoenix Down must retain a later Cleyra shop replacement after the Ralvuimago fight.");
}
const ralvuimagoShopCounts = new Map([
  ["game-item.adaman-vest", { count: 5, price: 1600 }],
  ["game-item.oak-staff", { count: 5, price: 2400 }],
]);
for (const [itemId, expected] of ralvuimagoShopCounts) {
  const shopPaths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && (path.method === "shop" || path.method === "mogshop"));
  if (shopPaths.length !== expected.count || shopPaths.some((path) => path.cost?.currency !== "gil" || path.cost.amount !== expected.price)) {
    errors.push(`Ralvuimago recovery for ${itemId} needs ${expected.count} shop paths priced at ${expected.price} Gil; found ${shopPaths.length}.`);
  }
}
const requiredRalvuimagoRecoveryPaths = [
  "item-path.disc-2.madain-sari.adaman-vest-amarant-starting-equipment",
  "item-path.disc-2.iifa-tree.soulcage-oak-staff-steal",
  "item-path.disc-3.on-the-high-seas.oak-staff-chocograph-11",
];
for (const pathId of requiredRalvuimagoRecoveryPaths) {
  if (!itemAcquisitionPaths.some((path) => path.id === pathId)) errors.push(`Ralvuimago recovery coverage is missing later route ${pathId}.`);
}
for (const [itemId, targetQuantity] of [["game-item.adaman-vest", 7], ["game-item.oak-staff", 2]] as const) {
  if (!sourceInventoryTargets.some((target) => target.itemId === itemId && target.targetQuantity === targetQuantity)) {
    errors.push(`Ralvuimago recovery for ${itemId} needs its source-listed Need ${targetQuantity} inventory target.`);
  }
}
const ralvuimagoAbilityClaims = [
  ["game-item.adaman-vest", "Bird Killer"],
  ["game-item.adaman-vest", "Stone Killer"],
  ["game-item.oak-staff", "Stop"],
  ["game-item.oak-staff", "Bio"],
  ["game-item.oak-staff", "Drain"],
];
for (const [itemId, abilityName] of ralvuimagoAbilityClaims) {
  if (!equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName)) {
    errors.push(`Ralvuimago recovery for ${itemId} needs its ${abilityName} ability claim.`);
  }
}
const tantarianItemIds = ["game-item.ether", "game-item.elixir", "game-item.silver-fork", "game-item.demons-mail"];
for (const itemId of tantarianItemIds) {
  if (!gameItemIds.has(itemId)) errors.push(`Tantarian recovery coverage needs catalog item ${itemId}.`);
  const stealPath = itemAcquisitionPaths.find((path) => path.itemId === itemId && path.chapterId === "disc-2.return-to-alexandria" && path.method === "steal");
  if (!stealPath?.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.tantarian")) {
    errors.push(`Tantarian recovery coverage needs the linked one-time steal path for ${itemId}.`);
  }
}
const tantarianLaterRecoveryPaths = [
  "item-path.disc-3.lost-continent.mount-gulug-ether-rubble",
  "item-path.disc-3.forgotten-continent.oeilvert-elixir-chest",
  "item-path.disc-3-stock.esto-gaza.silver-fork",
  "item-path.disc-3.lost-continent.mount-gulug-demons-mail",
  "item-path.disc-3.aerial-exploration.quan-running-shoes",
];
for (const pathId of tantarianLaterRecoveryPaths) {
  if (!itemAcquisitionPaths.some((path) => path.id === pathId)) errors.push(`Tantarian recovery coverage is missing later route ${pathId}.`);
}
const taharkaRamuhCardId = "disc-3.ipsens-castle.taharka-ramuh-card";
if (!objectiveIds.has(taharkaRamuhCardId)) errors.push("Tantarian's Ramuh Card recovery needs the Taharka fallback objective.");
const taharkaRamuhCardStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.ipsens-castle")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes(taharkaRamuhCardId));
if (!taharkaRamuhCardStep) errors.push("Taharka's Ramuh Card fallback objective needs a checklist pointer in Ipsen's Castle.");
const hippaulWarning = missables.find((missable) => missable.id === "missable.disc-3.the-home-front.hippaul-racing");
if (!hippaulWarning?.sourceIds.includes("gamefaqs-tetra-master-71891") || !hippaulWarning.note?.includes("only Namingway is missable")) {
  errors.push("Hippaul's warning must distinguish the unique Athlete Queen cutoff from recoverable Tetra Master cards.");
}
const griffinCardWarning = missables.find((missable) => missable.id === "missable.disc-2.treno.griffin-challenge");
const tonberryCardObjectiveId = "disc-2.tonberry-card";
const tonberryCardSteps = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-2.magdalene-forest")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .filter((step) => step.objectiveIds?.includes(tonberryCardObjectiveId));
const griffinCardStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-2.treno")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes("disc-2.treno.griffin-challenge") && step.objectiveIds.includes(tonberryCardObjectiveId));
if (
  !griffinCardWarning
  || !griffinCardWarning.classification.includes("permanently-missable")
  || griffinCardWarning.classification.includes("recoverable-later")
  || !griffinCardWarning.sourceIds.includes("gamefaqs-card-locations-24067")
  || griffinCardWarning.nextAvailability !== null
  || !griffinCardWarning.recovery.includes("separate card objective")
) {
  errors.push("The Griffin warning must classify the one-time fight separately from recovery of its Tonberry Card.");
}
if (!objectiveIds.has(tonberryCardObjectiveId) || tonberryCardSteps.length === 0 || !griffinCardStep) {
  errors.push("The Tonberry Card objective needs both its Treno reward step and a later Black Mage Village recovery step.");
}
const alexandriaCardPlayersObjectiveId = "disc-3.the-home-front.card-players";
const alexandriaCardPlayersWarning = missables.find((missable) => missable.id === "missable.disc-3.the-home-front.card-players");
const alexandriaCardPlayersCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.alexandria-zidane.before-treno");
const alexandriaCardPlayersStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.the-home-front")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes(alexandriaCardPlayersObjectiveId));
if (
  !objectiveIds.has(alexandriaCardPlayersObjectiveId)
  || !alexandriaCardPlayersStep
  || !alexandriaCardPlayersWarning?.sourceIds.includes("gamefaqs-card-locations-24067")
  || !alexandriaCardPlayersWarning.sourceIds.includes("gamefaqs-tetra-master-71891")
  || alexandriaCardPlayersWarning.classification.includes("permanently-missable")
  || !alexandriaCardPlayersCutoff?.missableIds.includes(alexandriaCardPlayersWarning.id)
  || !["Michelle", "Old Lady", "Benero", "Zenero"].every((name) => alexandriaCardPlayersStep.text.includes(name))
) {
  errors.push("The Disc III Alexandria card-player checklist must name all four opponents, use the card-location/Tetra Master sources, and remain separate from permanent card-type loss.");
}
const oglopTradeObjectiveId = "disc-2.conde-petie-mountain-path.oglop-card";
const oglopCardTypeObjectiveId = "disc-2.conde-petie-mountain-path.oglop-card-type";
const oglopTradeWarning = missables.find((missable) => missable.id === "missable.disc-3.preparing-to-leave.oglop-trading");
const oglopTradeStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-2.conde-petie-mountain-path")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes(oglopTradeObjectiveId));
const oglopTournamentStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.card-tournament")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes(oglopCardTypeObjectiveId) && step.text.includes("Sailor Erin"));
const oglopTournamentSection = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.card-tournament")
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.steps.some((step) => step.id === "card-tournament-oglop-card-recovery"));
const oglopDiscFourSection = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.steps.some((step) => step.id === "gaia-return-oglop-card-recovery" && step.objectiveIds?.includes(oglopCardTypeObjectiveId) && step.text.includes("Oglop Master Bon") && step.text.includes("Malboro Master Joe")));
const oglopCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.shimmering-island.disc-iii-departure");
if (
  !objectiveIds.has(oglopTradeObjectiveId)
  || !objectiveIds.has(oglopCardTypeObjectiveId)
  || !oglopTradeStep?.objectiveIds?.includes(oglopCardTypeObjectiveId)
  || oglopTradeWarning?.objectiveId !== oglopTradeObjectiveId
  || !oglopTradeWarning.sourceIds.includes("gamefaqs-card-locations-24067")
  || oglopTradeWarning.classification.includes("permanently-missable")
  || !oglopCutoff?.missableIds.includes(oglopTradeWarning.id)
  || !oglopTournamentStep
  || !oglopTournamentSection
  || !oglopDiscFourSection
  || !oglopTournamentSection.sourceIds.includes("gamefaqs-card-locations-24067")
  || !oglopDiscFourSection.sourceIds.includes("gamefaqs-card-locations-24067")
  || missables.some((missable) => missable.objectiveId === oglopCardTypeObjectiveId)
) {
  errors.push("The Oglop trade warning must remain attached to the trade event while the separate card-type objective has sourced Disc III and Disc IV recovery steps.");
}
const thirdJewelEvent = movieCriticEligibleEvents.find((event) => event.id === "ate-lindblum-third-jewel");
const thirdJewelWarning = missables.find((missable) => missable.id === "missable.disc-2.return-to-lindblum.the-third-jewel");
if (!thirdJewelEvent || thirdJewelEvent.exclusiveGroupId || thirdJewelEvent.chapterId !== "disc-2.return-to-lindblum") {
  errors.push("The Third Jewel must remain a counted, non-exclusive Movie Critic event in Return to Lindblum.");
}
if (!thirdJewelWarning || !thirdJewelWarning.classification.includes("permanently-missable") || !thirdJewelWarning.sourceIds.includes("gamerguides-movie-critic-guide") || !thirdJewelWarning.note?.includes("count-based conclusion")) {
  errors.push("The Third Jewel warning must explain its 79-view Movie Critic cutoff with its source and event-count inference.");
}
const earlierMognetLetterWarnings = [
  "missable.disc-1.village-of-dali.kumop-letter",
  "missable.disc-1.journey-to-burmecia.grimo-letter",
  "missable.disc-2.journey-to-cleyra.nazna-letter",
  "missable.disc-2.pinnacle-rocks.stiltzkin-letter",
  "missable.disc-3.card-tournament.mogrich-letter",
  "missable.disc-3.lost-continent.mount-gulug-sweep",
  "missable.disc-2.journey-to-outer-continent.kuppo-letter",
  "missable.disc-2.magdalene-forest.mogryo-letter-to-mocchi",
];
for (const warningId of earlierMognetLetterWarnings) {
  const warning = missables.find((missable) => missable.id === warningId);
  if (!warning?.sourceIds.includes("gamerguides-mognet-central") || !warning.note?.includes("Pre-Disc IV letters do not block the Disc IV Mognet Central repair chain")) {
    errors.push(`${warningId} must cite the Disc IV-only Mognet chain and keep earlier letters optional to that repair.`);
  }
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

const objectiveAccessDependencyCount = objectiveDependencies.filter((dependency) => dependency.kind === "objective-access").length;
const questPrerequisiteDependencyCount = objectiveDependencies.filter((dependency) => dependency.kind === "quest-prerequisite").length;
console.log(`FFIX data audit: ${errors.length} error(s), ${warnings.length} coverage warning(s).`);
console.log(`Scope: ${guideAreas.length} chapter headings (${walkthroughChapters.length} with authored content), ${missables.length} missable record(s), ${objectives.length} objective(s), ${sources.length} source records.`);
console.log(`Objective dependencies: ${objectiveDependencies.length} total (${ateObjectiveDependencies.length} ATE-order, ${objectiveAccessDependencyCount} objective-access, ${questPrerequisiteDependencyCount} quest-prerequisite).`);
console.log(`Route cutoffs: ${gameRouteCutoffs.length} windows link ${linkedRouteMissableIds.size}/${missables.length} missable warnings; ${missables.filter((record) => record.severity === "high" || record.severity === "critical").length} high/critical records are included.`);
console.log(`Items: ${gameItems.length} partial item record(s), ${itemAcquisitionPaths.length} source-linked acquisition path(s) across ${itemCatalogCoverage.chapterIds.length} chapter slices; ${synthesisRecipes.length} synthesis recipe(s); ${sourceInventoryTargets.length} source inventory target(s), ${equipmentAbilityClaims.length} partial ability claim(s).`);
console.log(`Cleyra shops: ${cleyraShopPaths.length} priced stock path(s) for ${cleyraProductIds.length} unique products; ${cleyraProductsWithLaterPaths.length} have a later acquisition path.`);
console.log(`Enemy reference: ${enemyRecords.length} partial record(s) across ${enemyCatalogCoverage.chapterIds.length} chapter slice(s), with ${enemyEncounters.length} encounter group(s).`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) process.exitCode = 1;
