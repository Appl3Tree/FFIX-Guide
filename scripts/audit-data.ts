import { achievementSourceCounts, arcs, guideAreas, missables, objectives, sources } from "../src/data/guide.ts";
import { ps4Trophies, steamAchievements, xboxAchievements } from "../src/data/achievements.ts";
import { excalibur2Checkpoints } from "../src/data/excalibur2.ts";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticExclusiveGroupId, movieCriticTarget } from "../src/data/ates.ts";
import { ateObjectiveDependencies, gameRouteCoverage, gameRouteCutoffs, gameRouteEdges, guideChapterSequence, guideSequenceEdges, objectiveAccessDependencies, objectiveDependencies, questPrerequisiteDependencies, storyPartySequences } from "../src/data/progression.ts";
import { findObjectiveDependencyCycles } from "../src/domain/progression.ts";
import { chocoboBeachLocations, chocoboBeachObjectiveId, chocoboBeachObjectiveIds } from "../src/data/chocobo.ts";
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

const cleyraEvacuationWarning = missablesById.get("missable.disc-2.cleyra.out-of-harms-way");
const cleyraStiltzkinWarning = missablesById.get("missable.disc-2.cleyra.stiltzkin-2");
const cleyraEvacuationCutoff = cutoffsById.get("cutoff.cleyra-evacuation.choice-window");
const cleyraFreyaCutoff = cutoffsById.get("cutoff.cleyra-freya.before-reunion");
const cleyraTrunkReturnCutoff = cutoffsById.get("cutoff.cleyra-trunk-return.before-bridge");
if (
  !cleyraEvacuationWarning?.action.includes("Choose Right, then Left, then Right") ||
  !cleyraEvacuationWarning.action.includes("Not Yet as the recommended route") ||
  cleyraEvacuationWarning.classification.includes("version-dependent") ||
  !cleyraEvacuationWarning.note.includes("fourth observatory choice does not dictate the outcome") ||
  !cleyraEvacuationWarning.sourceIds.includes("steam-cleyra-achievement-walkthrough") ||
  !cleyraEvacuationWarning.sourceIds.includes("jegged-cleyra") ||
  !cleyraEvacuationWarning.sourceIds.includes("gamerguides-cleyra") ||
  !cleyraEvacuationCutoff?.trigger.includes("do not present its necessity as confirmed") ||
  !cleyraEvacuationCutoff.sourceIds.includes("steam-cleyra-achievement-walkthrough")
) {
  errors.push("Cleyra's evacuation route must preserve Right/Left/Right, identify Not Yet as recommended rather than confirmed, and cite the fourth-choice conflict.");
}
if (
  cleyraFreyaCutoff?.certainty !== "conservative" ||
  !cleyraFreyaCutoff.trigger.includes("Freya's separate control segment") ||
  !cleyraFreyaCutoff.trigger.includes("before returning to the settlement entrance") ||
  !["missable.disc-2.cleyra.emerald", "missable.disc-2.cleyra.stiltzkin-2"].every((missableId) => cleyraFreyaCutoff.missableIds.includes(missableId)) ||
  !["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "rpgclassics-cleyra-settlement"].every((sourceId) => cleyraFreyaCutoff.sourceIds.includes(sourceId)) ||
  cleyraTrunkReturnCutoff?.certainty !== "source-supported" ||
  !cleyraTrunkReturnCutoff.trigger.includes("before crossing the bridge") ||
  !cleyraTrunkReturnCutoff.missableIds.includes("missable.disc-2.cleyra.treasures") ||
  !cleyraTrunkReturnCutoff.sourceIds.includes("gamefaqs-cleyra-71891")
) {
  errors.push("Cleyra's route map must separate the conservative Freya-phase Emerald/Stiltzkin checkpoint from the source-supported Trunk-chest return before the bridge.");
}
if (
  cleyraStiltzkinWarning?.verification !== "partial" ||
  !cleyraStiltzkinWarning.note.includes("does not confirm that the bundle remains for sale") ||
  !["elitegrindlab-cleyra", "rpgclassics-cleyra-settlement"].every((sourceId) => cleyraStiltzkinWarning.sourceIds.includes(sourceId))
) {
  errors.push("Cleyra's Stiltzkin warning must preserve the unresolved later-visit evidence and its RPGClassics/EliteGrindLab provenance.");
}

const lindblumTrolleyWarning = missablesById.get("missable.disc-1.lindblum.trolley-cutoff");
const lindblumTrolleyCutoff = cutoffsById.get("cutoff.lindblum-grotto-entry.trolley-lockout");
const lindblumTrolleyStep = walkthroughChapters
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "journey-before-enter-grotto-lindblum-cutoff");
if (
  !lindblumTrolleyWarning?.deadline.includes("Before entering Gizamaluke's Grotto") ||
  !lindblumTrolleyWarning.note?.includes("Keep the pre-entry checkpoint conservative") ||
  !lindblumTrolleyWarning.note.includes("GameFAQs' route says the Dragon's Gate remains open until the Grotto is completed") ||
  !["gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "gamerevolution-ffix-walkthrough", "elitegrindlab-gizamaluke"].every((sourceId) => lindblumTrolleyWarning.sourceIds.includes(sourceId)) ||
  lindblumTrolleyCutoff?.certainty !== "disputed" ||
  !lindblumTrolleyCutoff.trigger.includes("Use entry to Gizamaluke's Grotto as the conservative last checkpoint") ||
  !lindblumTrolleyCutoff.trigger.includes("GameFAQs' route says the Dragon's Gate remains open until Grotto completion") ||
  !lindblumTrolleyStep?.detail.includes("GameFAQs' route says the Dragon's Gate remains open until the Grotto is completed")
) {
  errors.push("Lindblum's trolley cutoff must preserve the conservative pre-entry checkpoint and the conflicting entry/completion timing sources.");
}

const lindblumKeyItemsWarning = missablesById.get("missable.disc-1.lindblum.autograph-moogle-suit");
const lindblumKeyItemsCutoff = cutoffsById.get("cutoff.lindblum.tantalus-hideout.key-items");
const lindblumAteCutoff = cutoffsById.get("cutoff.lindblum-hideout-exit.ates");
const lindblumDepartureCutoff = cutoffsById.get("cutoff.lindblum-departure.first-visit-windows");
const lindblumKeyItemsSection = walkthroughChapters
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.id === "lindblum-theater-district");
const lindblumKeyItemsStep = lindblumKeyItemsSection?.steps.find((step) => step.id === "lindblum-lowell-autograph-moogle-suit");
if (
  lindblumKeyItemsCutoff?.certainty !== "source-supported" ||
  !lindblumKeyItemsCutoff.trigger.includes("Entering the Tantalus Hideout closes") ||
  !lindblumKeyItemsCutoff.missableIds.includes("missable.disc-1.lindblum.autograph-moogle-suit") ||
  ["gamefaqs-lindblum-71891", "gamefaqs-missables-71891", "jegged-lindblum", "elitegrindlab-lindblum"].some((sourceId) => !lindblumKeyItemsCutoff.sourceIds.includes(sourceId)) ||
  !lindblumKeyItemsWarning?.deadline.includes("before entering the Tantalus Hideout") ||
  !lindblumKeyItemsWarning.note?.includes("broader boundary as leaving Lindblum for the first time") ||
  !lindblumKeyItemsWarning?.sourceIds.includes("elitegrindlab-lindblum") ||
  lindblumAteCutoff?.missableIds.includes("missable.disc-1.lindblum.autograph-moogle-suit") ||
  lindblumDepartureCutoff?.missableIds.includes("missable.disc-1.lindblum.autograph-moogle-suit") ||
  !lindblumKeyItemsStep?.objectiveIds?.includes("disc-1.lindblum.autograph-moogle-suit") ||
  !lindblumKeyItemsSection?.sourceIds.includes("elitegrindlab-lindblum")
) {
  errors.push("Lindblum's Autograph and Moogle Suit cutoff must be source-supported at Tantalus Hideout entry and stay separate from the ATE/Javelin windows.");
}

const lindblumAteWarning = missablesById.get("missable.disc-1.lindblum.ates");
const lindblumAteSection = walkthroughChapters
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.id === "lindblum-theater-district");
const lindblumAteStep = lindblumAteSection?.steps.find((step) => step.id === "lindblum-ate-final-check");
if (
  lindblumAteCutoff?.certainty !== "source-supported" ||
  !lindblumAteCutoff.trigger.includes("What Can I Do? plays on entering the Tantalus Hideout") ||
  !lindblumAteCutoff.trigger.includes("after exiting, view Baku and His Crew") ||
  lindblumAteCutoff.missableIds.length !== 1 ||
  lindblumAteCutoff.missableIds[0] !== "missable.disc-1.lindblum.ates" ||
  !["gamefaqs-lindblum-71891", "jegged-lindblum", "steam-missable-content-guide-2988011418"].every((sourceId) => lindblumAteCutoff.sourceIds.includes(sourceId)) ||
  !lindblumAteWarning?.deadline.includes("After exiting the Tantalus Hideout") ||
  !lindblumAteWarning.deadline.includes("before leaving the Theater District") ||
  !lindblumAteWarning.sourceIds.includes("steam-missable-content-guide-2988011418") ||
  !lindblumAteStep?.text.includes("After leaving the Tantalus Hideout and viewing Baku and His Crew")
) {
  errors.push("Lindblum's first-visit ATE warning must follow its sourced prompt sequence through Baku and His Crew, finish before returning to Castle, and remain separate from Javelin timing.");
}

const lindblumJavelinWarning = missablesById.get("missable.disc-1.lindblum.javelin-shop");
const lindblumJavelinObjective = objectivesById.get("disc-1.lindblum.javelin-purchase");
const lindblumJavelinWalkthroughSection = walkthroughChapters
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.id === "lindblum-after-festival-shops");
const lindblumJavelinWalkthroughStep = lindblumJavelinWalkthroughSection?.steps.find((step) => step.id === "lindblum-shop-synthesis-javelin");
if (
  lindblumJavelinWarning?.verification !== "partial" ||
  !lindblumJavelinWarning.deadline.includes("before entering Gizamaluke's Grotto") ||
  !lindblumJavelinWarning.note?.includes("the exact last reachable sale moment remains unresolved") ||
  !lindblumJavelinWarning.note.includes("until the Grotto is complete") ||
  !lindblumJavelinWarning.note.includes("describe the city-district lockout at entry") ||
  !lindblumJavelinWarning.note.includes("Disc II Lindblum weapon stock omits Javelin") ||
  !lindblumJavelinWarning.recovery.includes("Freya's starting Javelin") ||
  !lindblumJavelinWarning.recovery.includes("Ipsen's Castle copy") ||
  lindblumDepartureCutoff?.missableIds.length !== 1 ||
  !lindblumDepartureCutoff?.missableIds.includes("missable.disc-1.lindblum.javelin-shop") ||
  !lindblumDepartureCutoff.trigger.includes("before entering Gizamaluke's Grotto") ||
  lindblumAteCutoff?.missableIds.includes("missable.disc-1.lindblum.javelin-shop") ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "elitegrindlab-gizamaluke"].every((sourceId) => lindblumJavelinObjective?.sourceIds.includes(sourceId)) ||
  !lindblumJavelinWalkthroughStep?.text.includes("Before entering Gizamaluke's Grotto") ||
  !lindblumJavelinWalkthroughSection?.sourceIds.includes("elitegrindlab-gizamaluke") ||
  !["gamefaqs-lindblum-71891", "gamefaqs-missables-71891", "gamefaqs-missables-21725", "gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "elitegrindlab-gizamaluke", "elitegrindlab-lindblum"].every((sourceId) => lindblumJavelinWarning.sourceIds.includes(sourceId)) ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "elitegrindlab-gizamaluke"].every((sourceId) => lindblumDepartureCutoff.sourceIds.includes(sourceId))
) {
  errors.push("Lindblum's Javelin warning, objective, and walkthrough must retain the conservative pre-Grotto purchase, conflicting lockout timing, Disc II stock evidence, source provenance, partial status, and later-copy recovery.");
}

const trenoAteWarning = missablesById.get("missable.disc-2.treno.ates");
const trenoFirstSixCutoff = cutoffsById.get("cutoff.treno-first-visit.ates");
const trenoFinalAteCutoff = cutoffsById.get("cutoff.treno.tower-exit-crime-and-punishment");
const trenoAteSection = walkthroughChapters
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.id === "treno-ate-route");
const trenoFirstSixStep = trenoAteSection?.steps.find((step) => step.id === "treno-six-screen-ates");
const trenoCrimeStep = walkthroughChapters
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "treno-crime-and-punishment-ate");
if (
  trenoFirstSixCutoff?.certainty !== "conservative" ||
  !trenoFirstSixCutoff.title.includes("first-six") ||
  !trenoFirstSixCutoff.trigger.includes("Unexpected Visitor") ||
  !trenoFirstSixCutoff.trigger.includes("latest fallback point is unverified") ||
  trenoFirstSixCutoff.missableIds.length !== 1 ||
  trenoFirstSixCutoff.missableIds[0] !== trenoAteWarning?.id ||
  !["gamefaqs-treno-71891", "gamefaqs-treno-79143", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno", "trueachievements-treno-ate-walkthrough"].every((sourceId) => trenoFirstSixCutoff.sourceIds.includes(sourceId)) ||
  trenoFinalAteCutoff?.certainty !== "source-supported" ||
  !trenoFinalAteCutoff.trigger.includes("After Doctor Tot opens") ||
  !trenoFinalAteCutoff.trigger.includes("before descending") ||
  trenoFinalAteCutoff.missableIds.length !== 1 ||
  trenoFinalAteCutoff.missableIds[0] !== trenoAteWarning?.id ||
  !["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"].every((sourceId) => trenoFinalAteCutoff.sourceIds.includes(sourceId)) ||
  !trenoAteWarning?.deadline.includes("first six") ||
  !trenoAteWarning.deadline.includes("After Doctor Tot opens") ||
  !trenoAteWarning.action.includes("Treno Tradition, Pursuit, Confusion, Ambition, Meeting Place, and Unexpected Visitor") ||
  !trenoAteWarning.action.includes("Crime and Punishment") ||
  !trenoAteWarning.note?.includes("GameFAQs 71891 specifically exempts Unexpected Visitor and Crime and Punishment") ||
  !trenoAteWarning.note.includes("GameFAQs 79143 says Unexpected Visitor is forced before proceeding north") ||
  !trenoAteWarning.recovery.includes("forced before reaching the north end of a screen") ||
  !trenoAteWarning.note.includes("only Crime and Punishment's after-hatch, before-descent timing") ||
  !trenoFirstSixStep?.detail.includes("latest fallback point is unverified") ||
  trenoCrimeStep?.kind !== "cutoff" ||
  !trenoCrimeStep.text.includes("After Doctor Tot opens the hatch") ||
  !trenoCrimeStep.detail.includes("before the party descends")
) {
  errors.push("Treno's first-six ATE safe route and source-supported Crime and Punishment hatch window must remain separate, with the Unexpected Visitor fallback uncertainty preserved.");
}

const aftermathSomethingWashedAshore = activeTimeEvents.find((event) => event.objectiveId === "ate.lindblum-something-washed-ashore");
const aftermathSelfReproach = activeTimeEvents.find((event) => event.objectiveId === "ate.lindblum-self-reproach");
const aftermathDeepAnger = activeTimeEvents.find((event) => event.objectiveId === "ate.lindblum-deep-anger");
const aftermathNoFreeLunch = activeTimeEvents.find((event) => event.objectiveId === "ate.lindblum-no-free-lunch");
const aftermathGiveMeMyMoney = activeTimeEvents.find((event) => event.objectiveId === "ate.lindblum-give-me-my-money");
const aftermathAteCutoff = cutoffsById.get("cutoff.aftermath.blue-narciss.ates");
if (
  !aftermathSomethingWashedAshore?.prerequisites?.includes("ate.treno-hallucination") ||
  !["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath"].every((sourceId) => aftermathSomethingWashedAshore.sourceIds.includes(sourceId)) ||
  !aftermathSelfReproach?.trigger.includes("automatically during the conference") ||
  !aftermathDeepAnger?.trigger.includes("automatically during the conference") ||
  !["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath"].every((sourceId) => aftermathDeepAnger.sourceIds.includes(sourceId)) ||
  !aftermathNoFreeLunch?.prerequisites?.includes("ate.lindblum-something-washed-ashore") ||
  !aftermathNoFreeLunch.trigger.includes("fewer than 50 Gil") ||
  !aftermathGiveMeMyMoney?.prerequisites?.includes("ate.lindblum-no-free-lunch") ||
  !aftermathGiveMeMyMoney.trigger.includes("board the Blue Narciss") ||
  !aftermathAteCutoff?.sourceIds.includes("gamefaqs-the-aftermath-71891") ||
  !aftermathAteCutoff?.trigger.includes("Give Me My Money") ||
  !ateObjectiveDependencies.some((edge) => edge.prerequisiteObjectiveId === "ate.lindblum-something-washed-ashore" && edge.dependentObjectiveId === "ate.lindblum-no-free-lunch") ||
  !ateObjectiveDependencies.some((edge) => edge.prerequisiteObjectiveId === "ate.lindblum-no-free-lunch" && edge.dependentObjectiveId === "ate.lindblum-give-me-my-money")
) {
  errors.push("Lindblum's Disc III ATE graph must preserve the Hallucination → Something Washed Ashore → No Free Lunch chain, automatic conference ATE order, and under-50-Gil ship trigger.");
}

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
const homeFrontPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.home-front-alexandria");
if (!homeFrontPartySequence) {
  errors.push("The Disc III Alexandria Vivi/Eiko/Zidane party handoff sequence is missing.");
} else {
  if (homeFrontPartySequence.phases.length !== 3) errors.push("The Disc III Alexandria party sequence must retain its Vivi, Eiko, and Zidane phases.");
  if (homeFrontPartySequence.phases[0]?.party !== "Vivi" || !homeFrontPartySequence.phases[0]?.summary.includes("first four ATEs")) {
    errors.push("The Disc III Alexandria sequence must place the first four ATEs in Vivi's phase.");
  }
  if (homeFrontPartySequence.phases[1]?.party !== "Eiko" || homeFrontPartySequence.phases[1]?.chapterIds.join(",") !== "disc-3.the-home-front") {
    errors.push("The Disc III Alexandria sequence must retain Eiko's brief castle passage between Vivi and Zidane.");
  }
  if (!homeFrontPartySequence.phases[2]?.party.startsWith("Zidane and Vivi") ||
      homeFrontPartySequence.phases[2]?.chapterIds.join(",") !== "disc-3.the-home-front,disc-3.card-tournament" ||
      !homeFrontPartySequence.phases[2]?.summary.includes("final two ATEs")) {
    errors.push("The Disc III Alexandria sequence must place the remaining ATEs after Vivi rejoins Zidane and connect the route to Treno.");
  }
  for (const sourceId of ["gamefaqs-home-front-71891", "jegged-home-front", "gamerguides-home-front"]) {
    if (!homeFrontPartySequence.sourceIds.includes(sourceId)) errors.push(`The Disc III Alexandria sequence is missing corroborating source ${sourceId}.`);
  }
}
const tournamentQuanPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.card-tournament-vivi-quan");
const tournamentQuanPhases = tournamentQuanPartySequence?.phases ?? [];
const tournamentDaliReturnEdge = gameRouteEdgesById.get("detour.card-tournament-dali-return");
const tournamentQuanStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.card-tournament")
  ?.sections.find((section) => section.id === "card-tournament-dali-detour")
  ?.steps.find((step) => step.id === "card-tournament-return-to-quan");
if (
  tournamentQuanPhases.length !== 3
  || !tournamentQuanPhases[0]?.summary.toLowerCase().includes("only if the how he ended up here ate sent vivi home")
  || !tournamentQuanPhases[0]?.summary.includes("finish the Treno ATE route")
  || !tournamentQuanPhases[1]?.location.includes("Quan's Dwelling")
  || !tournamentQuanPhases[1]?.summary.includes("western South Gate route to Dali")
  || !tournamentQuanPhases[2]?.summary.includes("before playing the final match")
  || !["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "flactem-disc-3-treno"].every((sourceId) => tournamentQuanPartySequence?.sourceIds.includes(sourceId))
  || !tournamentDaliReturnEdge?.summary.includes("retrieve him there first")
  || !tournamentDaliReturnEdge.summary.includes("western South Gate route")
  || !tournamentQuanStep?.text.includes("after the Treno ATEs are finished")
  || !tournamentQuanStep.detail?.includes("If Vivi stayed in Treno, go directly to Dali")
) {
  errors.push("The Disc III card-tournament branch must finish Treno's ATEs before a conditional Quan's Dwelling return, reunite Vivi, and route the party through Dali before the final match.");
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
  errors.push("The Four Shrines party-assignment and documented-route sequence is missing.");
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
      errors.push(`The Four Shrines documented route must list ${expectedLocation} in its recommended sequence.`);
    }
  }
  if (!fourShrinesPartySequence.phases[0]?.summary.includes("sources do not establish whether the first three stops can be reordered")) {
    errors.push("The Four Shrines party sequence must preserve the unresolved order-flexibility caveat.");
  }
  const shrineRouteSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.breaking-the-seal")?.sections.find((section) => section.id === "breaking-seal-world-map-dropoffs");
  const fourShrinesObjective = objectives.find((objective) => objective.id === "disc-3.breaking-the-seal.four-shrines");
  if (!shrineRouteSection?.summary.includes("documented Water → Fire → Wind sequence") ||
    !shrineRouteSection.summary.includes("do not confirm whether the first three stops can be reordered")) {
    errors.push("The Four Shrines walkthrough must distinguish the documented route from an established mandatory order.");
  }
  if (!fourShrinesPartySequence.phases[3]?.location.includes("Hilda Garde 3")) {
    errors.push("The Four Shrines sequence must end with the party regroup on the Hilda Garde 3.");
  }
  const requiredFourShrinesRouteSourceIds = [
    "gamefaqs-breaking-the-seal-71891",
    "gamefaqs-four-shrines-gbness-26505",
    "gamefaqs-unlocking-terra-79143",
    "jegged-four-shrines-terra",
    "rpgclassics-disc-3-walkthrough",
    "rpgclassics-four-shrines",
    "elitegrindlab-four-shrines",
  ];
  for (const sourceId of requiredFourShrinesRouteSourceIds) {
    if (!fourShrinesPartySequence.sourceIds.includes(sourceId)) errors.push(`The Four Shrines sequence is missing corroborating source ${sourceId}.`);
    if (!shrineRouteSection?.sourceIds.includes(sourceId)) errors.push(`The Four Shrines walkthrough is missing corroborating source ${sourceId}.`);
    if (!fourShrinesObjective?.sourceIds.includes(sourceId)) errors.push(`The Four Shrines objective is missing corroborating source ${sourceId}.`);
  }
  const fourShrinesSourceNotes = new Map(sources.map((source) => [source.id, source.notes]));
  if (
    !fourShrinesSourceNotes.get("gamefaqs-four-shrines-gbness-26505")?.includes("explicitly lists the Water, Fire, Wind, and Earth shrines in that order") ||
    !fourShrinesSourceNotes.get("gamefaqs-unlocking-terra-79143")?.includes("sends Dagger/Eiko to Water, Freya/Amarant to Fire, Vivi/Steiner to Wind, and Zidane/Quina to Earth") ||
    !fourShrinesSourceNotes.get("rpgclassics-four-shrines")?.includes("Water first, Fire next, Wind third, and Earth last")
  ) {
    errors.push("The expanded Four Shrines route cross-check must preserve the explicit sequence and fixed-pair evidence from the additional guide pages.");
  }
}
const branBalPartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.bran-bal-eiko-handoff");
if (!branBalPartySequence) {
  errors.push("The Bran Bal party restriction and Eiko handoff sequence is missing.");
} else {
  if (branBalPartySequence.phases.length !== 3) errors.push("The Bran Bal sequence must retain the restriction, Eiko control, and party rejoin phases.");
  if (branBalPartySequence.phases[0]?.party !== "Zidane's group; Dagger and Steiner unavailable") {
    errors.push("The Bran Bal sequence must show Dagger and Steiner unavailable during the initial Zidane-led route.");
  }
  if (branBalPartySequence.phases[1]?.party !== "Eiko; reunite with the party") {
    errors.push("The Bran Bal sequence must show Eiko's control handoff and party reformation.");
  }
  if (branBalPartySequence.phases[2]?.party !== "Re-formed party; control returns to Zidane" || !branBalPartySequence.phases[2]?.location.includes("Pandemonium")) {
    errors.push("The Bran Bal sequence must end with the party re-formed at the Pandemonium gate.");
  }
  if (!branBalPartySequence.phases[1]?.summary.includes("four ATEs") || !branBalPartySequence.phases[1]?.summary.includes("rebuild")) {
    errors.push("The Bran Bal Eiko phase must retain its ATE route and party reformation instructions.");
  }
  for (const sourceId of ["gamefaqs-portal-to-another-world-71891", "jegged-bran-bal"]) {
    if (!branBalPartySequence.sourceIds.includes(sourceId)) errors.push(`The Bran Bal sequence is missing corroborating source ${sourceId}.`);
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
const aerialTrenoReturn = gameRouteEdgesById.get("detour.aerial-treno-return");
const aerialTrenoRejoin = gameRouteEdgesById.get("detour.aerial-treno-rejoin");
if (
  aerialTrenoReturn?.relationship !== "optional-return" ||
  aerialTrenoReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialTrenoReturn.toChapterId !== "disc-2.treno" ||
  !aerialTrenoReturn.summary.includes("Amdusias") ||
  !aerialTrenoReturn.summary.includes("Running Shoes") ||
  !aerialTrenoReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  aerialTrenoRejoin?.relationship !== "rejoin" ||
  aerialTrenoRejoin.fromChapterId !== "disc-2.treno" ||
  aerialTrenoRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialTrenoRejoin.sourceIds.includes("jegged-lindblum-hilda-garde")
) {
  errors.push("The Disc III Hilda Garde Treno return and rejoin must preserve the Amdusias reward route and source links.");
}
const aerialDaliReturn = gameRouteEdgesById.get("detour.aerial-dali-cotton-robe");
const aerialDaliRejoin = gameRouteEdgesById.get("detour.aerial-dali-rejoin");
if (
  aerialDaliReturn?.relationship !== "optional-return" ||
  aerialDaliReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialDaliReturn.toChapterId !== "disc-1.village-of-dali" ||
  !aerialDaliReturn.summary.includes("Cotton Robe") ||
  !aerialDaliReturn.summary.includes("Wrists") ||
  !aerialDaliReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  aerialDaliRejoin?.relationship !== "rejoin" ||
  aerialDaliRejoin.fromChapterId !== "disc-1.village-of-dali" ||
  aerialDaliRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialDaliRejoin.sourceIds.includes("gamefaqs-dali-71891")
) {
  errors.push("The Disc III Hilda Garde Dali return and rejoin must preserve the optional Cotton Robe route and source links.");
}
const aerialBlackMageVillageReturn = gameRouteEdgesById.get("detour.aerial-black-mage-village-shops");
const aerialBlackMageVillageRejoin = gameRouteEdgesById.get("detour.aerial-black-mage-village-rejoin");
if (
  aerialBlackMageVillageReturn?.relationship !== "optional-return" ||
  aerialBlackMageVillageReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialBlackMageVillageReturn.toChapterId !== "disc-2.magdalene-forest" ||
  !aerialBlackMageVillageReturn.summary.includes("reopened shops") ||
  !aerialBlackMageVillageReturn.summary.includes("Disc II stock") ||
  !aerialBlackMageVillageReturn.summary.includes("for a while") ||
  !aerialBlackMageVillageReturn.summary.includes("does not reopen the forest route") ||
  !aerialBlackMageVillageReturn.summary.includes("first-visit ATEs") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-magdalene-forest-71891") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-shops-71891") ||
  aerialBlackMageVillageRejoin?.relationship !== "rejoin" ||
  aerialBlackMageVillageRejoin.fromChapterId !== "disc-2.magdalene-forest" ||
  aerialBlackMageVillageRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialBlackMageVillageRejoin.sourceIds.includes("jegged-lindblum-hilda-garde")
) {
  errors.push("The Disc III Hilda Garde Black Mage Village shop return and rejoin must preserve the Disc II stock window, its limits, and source links.");
}
const aerialQuanDwellingReturn = gameRouteEdgesById.get("detour.aerial-quan-dwelling-running-shoes");
const aerialQuanDwellingRejoin = gameRouteEdgesById.get("detour.aerial-quan-dwelling-rejoin");
const aerialQuanDwellingObjective = objectivesById.get("disc-3.aerial-exploration.quan-running-shoes");
const aerialQuanDwellingPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.quan-running-shoes");
if (
  aerialQuanDwellingReturn?.relationship !== "optional-return" ||
  aerialQuanDwellingReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialQuanDwellingReturn.toChapterId !== "disc-2.journey-to-treno" ||
  !aerialQuanDwellingReturn.summary.includes("Vivi and Quina") ||
  !aerialQuanDwellingReturn.summary.includes("Running Shoes") ||
  !aerialQuanDwellingReturn.summary.includes("does not reopen the earlier Treno tournament ATE branch") ||
  !aerialQuanDwellingReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialQuanDwellingReturn.sourceIds.includes("jegged-lindblum-hilda-garde") ||
  !aerialQuanDwellingReturn.sourceIds.includes("gamefaqs-items-71891") ||
  aerialQuanDwellingRejoin?.relationship !== "rejoin" ||
  aerialQuanDwellingRejoin.fromChapterId !== "disc-2.journey-to-treno" ||
  aerialQuanDwellingRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialQuanDwellingRejoin.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialQuanDwellingObjective?.chapterIds.includes("disc-3.aerial-exploration") ||
  !aerialQuanDwellingObjective.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialQuanDwellingObjective.sourceIds.includes("jegged-lindblum-hilda-garde") ||
  !aerialQuanDwellingPath ||
  aerialQuanDwellingPath.itemId !== "game-item.running-shoes" ||
  aerialQuanDwellingPath.method !== "hidden-pickup" ||
  !aerialQuanDwellingPath.conditions.includes("Vivi and Quina") ||
  !aerialQuanDwellingPath.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.quan-running-shoes")
) {
  errors.push("The Disc III Hilda Garde Quan's Dwelling return must preserve the route, rejoin, party-required objective, Running Shoes item path, branch limit, and source links.");
}
const aerialLindblumElixirReturn = gameRouteEdgesById.get("detour.aerial-lindblum-airship-elixir");
const aerialLindblumElixirRejoin = gameRouteEdgesById.get("detour.aerial-lindblum-airship-rejoin");
const aerialAirshipPickupObjective = objectivesById.get("disc-3.aerial-exploration.airship-pickups");
const aerialLindblumElixirPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.hilda-garde-lindblum-elixir");
const aerialHildaGardeTentPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.hilda-garde-tent");
if (
  aerialLindblumElixirReturn?.relationship !== "optional-return" ||
  aerialLindblumElixirReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialLindblumElixirReturn.toChapterId !== "disc-2.return-to-lindblum" ||
  !aerialLindblumElixirReturn.summary.includes("only while docked here") ||
  !aerialLindblumElixirReturn.summary.includes("does not establish access to other Lindblum areas") ||
  !aerialLindblumElixirReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialLindblumElixirReturn.sourceIds.includes("jegged-lindblum-hilda-garde") ||
  aerialLindblumElixirRejoin?.relationship !== "rejoin" ||
  aerialLindblumElixirRejoin.fromChapterId !== "disc-2.return-to-lindblum" ||
  aerialLindblumElixirRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialLindblumElixirRejoin.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialAirshipPickupObjective?.chapterIds.includes("disc-3.aerial-exploration") ||
  !aerialAirshipPickupObjective.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialLindblumElixirPath ||
  aerialLindblumElixirPath.itemId !== "game-item.elixir" ||
  aerialLindblumElixirPath.method !== "hidden-pickup" ||
  !aerialLindblumElixirPath.conditions.includes("only while the ship is docked at Lindblum") ||
  !aerialLindblumElixirPath.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.airship-pickups") ||
  !aerialHildaGardeTentPath ||
  aerialHildaGardeTentPath.itemId !== "game-item.tent" ||
  aerialHildaGardeTentPath.method !== "hidden-pickup" ||
  !aerialHildaGardeTentPath.conditions.includes("available at any parking location") ||
  !aerialHildaGardeTentPath.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.airship-pickups")
) {
  errors.push("The Disc III Hilda Garde Lindblum return must preserve its dock-only Elixir, general ship Tent pickup, shared objective, rejoin, and limited access claim.");
}
const routeStartChapterId = gameRouteCoverage.chapterIds[0];
const routeEndChapterId = gameRouteCoverage.throughChapterId;
if (!routeStartChapterId) {
  errors.push("Game route coverage must have a starting chapter.");
} else {
  const requiredStoryReachable = new Set<string>();
  const pendingRequiredStoryChapters = [routeStartChapterId];
  while (pendingRequiredStoryChapters.length > 0) {
    const chapterId = pendingRequiredStoryChapters.shift();
    if (!chapterId || requiredStoryReachable.has(chapterId)) continue;
    requiredStoryReachable.add(chapterId);
    for (const edge of gameRouteEdges) {
      if (edge.relationship === "required-story" && edge.fromChapterId === chapterId && !requiredStoryReachable.has(edge.toChapterId)) {
        pendingRequiredStoryChapters.push(edge.toChapterId);
      }
    }
  }
  if (!requiredStoryReachable.has(routeEndChapterId)) {
    errors.push(`The required-story links do not connect the opening chapter to the declared route endpoint ${routeEndChapterId}.`);
  }
}
const chaptersAbleToReachRouteEnd = new Set([routeEndChapterId]);
let routeEndReachabilityChanged = true;
while (routeEndReachabilityChanged) {
  routeEndReachabilityChanged = false;
  for (const edge of gameRouteEdges) {
    if (chaptersAbleToReachRouteEnd.has(edge.toChapterId) && !chaptersAbleToReachRouteEnd.has(edge.fromChapterId)) {
      chaptersAbleToReachRouteEnd.add(edge.fromChapterId);
      routeEndReachabilityChanged = true;
    }
  }
}
const routeChaptersWithoutRejoin = gameRouteCoverage.chapterIds.filter((chapterId) => !chaptersAbleToReachRouteEnd.has(chapterId));
if (routeChaptersWithoutRejoin.length > 0) {
  errors.push(`Game route chapters have no directed path to the declared endpoint ${routeEndChapterId}: ${routeChaptersWithoutRejoin.join(", ")}.`);
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
const airGardenSkyAccessEdges = objectiveDependencies.filter((dependency) =>
  dependency.prerequisiteObjectiveId === "disc-3.aerial-exploration.sky-chocobo" &&
  dependency.dependentObjectiveId === "disc-3.aerial-exploration.air-garden-treasures",
);
if (
  airGardenSkyAccessEdges.length !== 1 ||
  airGardenSkyAccessEdges[0]?.kind !== "objective-access" ||
  !airGardenSkyAccessEdges[0].sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !airGardenSkyAccessEdges[0].sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !airGardenSkyAccessEdges[0].sourceIds.includes("jegged-lindblum-hilda-garde") ||
  !airGardenSkyAccessEdges[0].sourceIds.includes("jegged-chocographs")
) {
  errors.push("Chocobo's Air Garden objective must have the source-backed Sky Chocobo access prerequisite.");
}
const paradiseSkyAccessEdges = objectiveDependencies.filter((dependency) =>
  dependency.prerequisiteObjectiveId === "disc-3.aerial-exploration.sky-chocobo" &&
  dependency.dependentObjectiveId === "disc-3.aerial-exploration.chocobo-paradise-refill",
);
const paradiseRefillObjective = objectives.find((objective) => objective.id === "disc-3.aerial-exploration.chocobo-paradise-refill");
const discThreeParadiseStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "aerial-chocobo-paradise");
if (
  paradiseSkyAccessEdges.length !== 1 ||
  paradiseSkyAccessEdges[0]?.kind !== "objective-access" ||
  !paradiseSkyAccessEdges[0].sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !paradiseSkyAccessEdges[0].sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !paradiseRefillObjective?.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !paradiseRefillObjective?.sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !discThreeParadiseStep?.text.includes("refill your Dead Pepper supply") ||
  !discThreeParadiseStep.text.includes("Save Fat Chocobo's scene, card, and Tetra Master challenge for Disc IV") ||
  !discThreeParadiseStep.objectiveIds?.includes("disc-3.aerial-exploration.chocobo-paradise-refill") ||
  discThreeParadiseStep.text.includes("Challenge Fat Chocobo to Tetra Master for the Chocobo Card")
) {
  errors.push("The Disc III Chocobo's Paradise visit must be Sky-gated and defer Fat Chocobo's scene, card, and Beach challenge until Disc IV.");
}
const chocoboBeachUnlockObjectiveId = "disc-4.return-to-gaia.chocobo-beach-unlock";
const chocoboBeachCompletionObjectiveId = "disc-4.return-to-gaia.chocobo-beach";
const chocoboBeachRequiredProgressIds = [
  "disc-3.aerial-exploration.all-chocograph-treasures",
  "disc-3.on-the-high-seas.mountain-crack",
  "disc-3.forgotten-continent.mountain-cracks",
  "disc-3.on-the-high-seas.dive-spots",
  "disc-4.return-to-gaia.mognet-central-crack",
  "disc-3.aerial-exploration.chocobo-paradise-refill",
];
const expectedChocoboBeachDependencies = [
  ...chocoboBeachRequiredProgressIds.map((id) => `${id}->${chocoboBeachUnlockObjectiveId}`),
  ...chocoboBeachObjectiveIds.map((id) => `${chocoboBeachUnlockObjectiveId}->${id}`),
  ...chocoboBeachObjectiveIds.map((id) => `${id}->${chocoboBeachCompletionObjectiveId}`),
].sort();
const actualChocoboBeachDependencies = objectiveDependencies
  .filter((dependency) => dependency.dependentObjectiveId === chocoboBeachUnlockObjectiveId || dependency.prerequisiteObjectiveId === chocoboBeachUnlockObjectiveId || dependency.dependentObjectiveId === chocoboBeachCompletionObjectiveId)
  .map((dependency) => `${dependency.prerequisiteObjectiveId}->${dependency.dependentObjectiveId}`)
  .sort();
if (
  chocoboBeachLocations.length !== 21 ||
  chocoboBeachObjectiveIds.length !== 21 ||
  expectedChocoboBeachDependencies.length !== 48 ||
  expectedChocoboBeachDependencies.join("|") !== actualChocoboBeachDependencies.join("|")
) {
  errors.push("Chocobo Beach must have five sourced quest gates, the separate Paradise access gate, and 21 separately tracked beach registrations behind the Disc IV activation objective.");
}
const chocoboBeachUnlockEdges = questPrerequisiteDependencies.filter((dependency) => dependency.dependentObjectiveId === chocoboBeachUnlockObjectiveId);
for (const dependency of chocoboBeachUnlockEdges) {
  for (const sourceId of ["gamefaqs-chocobo-hot-cold-71891", "jegged-chocobo-beaches", "jegged-chocobo-dive-spots", "jegged-chocobo-mountain-cracks", "jegged-chocographs"]) {
    if (!dependency.sourceIds.includes(sourceId)) errors.push(`Chocobo Beach unlock dependency ${dependency.prerequisiteObjectiveId} must cite ${sourceId}.`);
  }
}
const paradiseBeachAccessEdges = objectiveDependencies.filter((dependency) =>
  dependency.kind === "objective-access" &&
  dependency.prerequisiteObjectiveId === "disc-3.aerial-exploration.chocobo-paradise-refill" &&
  dependency.dependentObjectiveId === chocoboBeachUnlockObjectiveId,
);
if (
  paradiseBeachAccessEdges.length !== 1 ||
  !paradiseBeachAccessEdges[0]?.sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !paradiseBeachAccessEdges[0]?.sourceIds.includes("jegged-chocobo-beaches")
) {
  errors.push("Chocobo Beach activation must require source-backed access to Chocobo's Paradise separately from treasure and Mognet prerequisites.");
}
for (const dependency of questPrerequisiteDependencies.filter((item) => item.prerequisiteObjectiveId === chocoboBeachUnlockObjectiveId || item.dependentObjectiveId === chocoboBeachCompletionObjectiveId)) {
  for (const sourceId of ["gamefaqs-chocobo-hot-cold-71891", "jegged-chocobo-beaches"]) {
    if (!dependency.sourceIds.includes(sourceId)) errors.push(`Chocobo Beach registration dependency ${dependency.prerequisiteObjectiveId} -> ${dependency.dependentObjectiveId} must cite ${sourceId}.`);
  }
}
const aerialChocographStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "aerial-chocobo-air-garden");
if (!aerialChocographStep?.objectiveIds?.includes("disc-3.aerial-exploration.all-chocograph-treasures")) {
  errors.push("The Air Garden walkthrough must link the global all-24-Chocograph completion objective.");
}
const discFourChocoboSteps = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));
const chocoboBeachPrerequisiteStep = discFourChocoboSteps.find((step) => step.id === "gaia-return-chocobo-prerequisites");
const discFourParadiseAccessStep = discFourChocoboSteps.find((step) => step.id === "gaia-return-chocobo-paradise-access");
if (
  !chocoboBeachPrerequisiteStep?.text.includes("all 24 Chocograph treasures") ||
  !chocoboBeachPrerequisiteStep.text.includes("eight Dead Pepper treasure caches") ||
  !chocoboBeachPrerequisiteStep.text.includes("three treasure-producing Mountain Cracks") ||
  !chocoboBeachPrerequisiteStep.detail?.includes("Mognet Central access crack among the discoveries required before Fat Chocobo's first scene") ||
  !chocoboBeachPrerequisiteStep.objectiveIds?.includes("disc-3.on-the-high-seas.dive-spots") ||
  !chocoboBeachPrerequisiteStep.objectiveIds?.includes("disc-4.return-to-gaia.mognet-central-crack") ||
  !chocoboBeachPrerequisiteStep.objectiveIds?.includes("disc-3.aerial-exploration.chocobo-paradise-refill") ||
  !chocoboBeachPrerequisiteStep.detail?.includes("Chocobo's Paradise entrance crack is a separate route access point") ||
  !discFourParadiseAccessStep?.text.includes("Travel by Sky Chocobo") ||
  !discFourParadiseAccessStep.text.includes("If the Paradise entrance is still closed") ||
  !discFourParadiseAccessStep.text.includes("use a Dead Pepper") ||
  !discFourParadiseAccessStep.detail?.includes("not one of the eight reward caches or the Mognet Central crack") ||
  !discFourParadiseAccessStep.objectiveIds?.includes("disc-3.aerial-exploration.chocobo-paradise-refill")
) {
  errors.push("The Disc IV Chocobo Beach checklist must distinguish its eight reward caches, Mognet Central prerequisite, and Paradise entrance access.");
}
const chocoboMognetCrackStep = discFourChocoboSteps.find((step) => step.id === "gaia-return-mognet-central-crack");
const mognetCentralCrackObjective = objectives.find((objective) => objective.id === "disc-4.return-to-gaia.mognet-central-crack");
if (
  !chocoboMognetCrackStep?.text.includes("Mognet Central") ||
  !chocoboMognetCrackStep.detail?.includes("GameFAQs explicitly includes the Mognet Central crack") ||
  !chocoboMognetCrackStep.objectiveIds?.includes("disc-4.return-to-gaia.mognet-central-crack") ||
  !mognetCentralCrackObjective?.sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !mognetCentralCrackObjective?.sourceIds.includes("jegged-chocobo-mountain-cracks")
) {
  errors.push("The Disc IV walkthrough must track opening the Mognet Central crack as a separate Beach quest prerequisite.");
}
const chocoboBeachActivationStep = discFourChocoboSteps.find((step) => step.id === "gaia-return-chocobo-beach-unlock");
if (
  !chocoboBeachActivationStep?.text.includes("first scene") ||
  !chocoboBeachActivationStep.text.includes("receive the Fat Chocobo Card") ||
  !chocoboBeachActivationStep.text.includes("Speak with him again and challenge him to Tetra Master") ||
  !chocoboBeachActivationStep.objectiveIds?.includes(chocoboBeachUnlockObjectiveId)
) {
  errors.push("The Disc IV walkthrough must separate Fat Chocobo's prerequisite-gated scene/card from the later Tetra Master challenge that activates beach registration.");
}
const individualChocoboBeachSteps = discFourChocoboSteps.filter((step) => step.id.startsWith("gaia-return-beach-"));
if (
  individualChocoboBeachSteps.length !== chocoboBeachLocations.length ||
  chocoboBeachLocations.some((location) => !individualChocoboBeachSteps.some((step) => step.id === `gaia-return-beach-${location.id}` && step.objectiveIds?.includes(chocoboBeachObjectiveId(location.id))))
) {
  errors.push("The Disc IV walkthrough must provide one stable progress objective and action for each of the 21 Chocobo beaches.");
}
const chocoboBeachCompletionStep = discFourChocoboSteps.find((step) => step.id === "gaia-return-chocobo-beach-complete");
if (!chocoboBeachCompletionStep?.objectiveIds?.includes(chocoboBeachCompletionObjectiveId)) {
  errors.push("The final Chocobo Beach walkthrough step must link the 21-beach achievement objective.");
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
  if (dependency.dependentObjectiveId === friendlyYanObjectiveId && (!dependency.sourceIds.includes("gamefaqs-friendly-creatures-71891") || !dependency.sourceIds.includes("jegged-friendly-monsters"))) {
    errors.push(`Friendly Creature prerequisite ${dependency.prerequisiteObjectiveId} -> ${dependency.dependentObjectiveId} must cite both direct prerequisite sources.`);
  }
}
const stiltzkinPurchaseObjectiveIds = [
  "disc-1.burmecia.stiltzkin-1",
  "disc-2.cleyra.stiltzkin-2",
  "disc-2.fossil-roo.stiltzkin-3",
  "disc-2.conde-petie-mountain-path.stiltzkin-4",
  "disc-3.the-home-front.stiltzkin-5",
  "disc-3.forgotten-continent.stiltzkin-6",
  "disc-3.portal-to-another-world.stiltzkin-7",
  "disc-4.return-to-gaia.stiltzkin-eighth-bundle",
];
const stiltzkinRibbonObjectiveId = "disc-4.return-to-gaia.stiltzkin-ribbon";
const expectedStiltzkinRibbonPrerequisites = stiltzkinPurchaseObjectiveIds.map((id) => `${id}->${stiltzkinRibbonObjectiveId}`).sort();
const actualStiltzkinRibbonPrerequisites = questPrerequisiteDependencies
  .filter((dependency) => dependency.dependentObjectiveId === stiltzkinRibbonObjectiveId)
  .map((dependency) => `${dependency.prerequisiteObjectiveId}->${dependency.dependentObjectiveId}`)
  .sort();
if (expectedStiltzkinRibbonPrerequisites.join("|") !== actualStiltzkinRibbonPrerequisites.join("|")) {
  errors.push("Stiltzkin's conditional Ribbon must have exactly the eight bundle purchases as prerequisites.");
}
for (const dependency of questPrerequisiteDependencies.filter((item) => item.dependentObjectiveId === stiltzkinRibbonObjectiveId)) {
  if (!dependency.sourceIds.includes("gamefaqs-stiltzkin-shopping-71891") || !dependency.sourceIds.includes("jegged-stiltzkin")) {
    errors.push(`Stiltzkin Ribbon prerequisite ${dependency.prerequisiteObjectiveId} must cite both direct quest sources.`);
  }
}
if (questPrerequisiteDependencies.some((dependency) => dependency.dependentObjectiveId === "disc-4.return-to-gaia.stiltzkin-eighth-bundle")) {
  errors.push("Stiltzkin's eighth bundle purchase must remain available independently of the earlier bundle chain.");
}
const expectedDrivingHardBargainObjectives = [...stiltzkinPurchaseObjectiveIds].sort();
for (const { platform, records } of achievementCatalogs) {
  const achievement = records.find((record) => ("parityId" in record ? record.parityId : record.id) === "driving-the-hard-bargain");
  const mappedObjectives = [...(achievement?.guideObjectiveIds ?? [])].sort();
  if (mappedObjectives.join("|") !== expectedDrivingHardBargainObjectives.join("|")) {
    errors.push(`${platform} Driving the Hard Bargain must map exactly the eight Stiltzkin bundle-purchase objectives, not the Ribbon reward.`);
  }
}
const stiltzkinFinalStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "gaia-return-stiltzkin-eighth");
const stiltzkinFinalStepObjectiveIds = stiltzkinFinalStep?.objectiveIds ?? [];
if (!stiltzkinFinalStepObjectiveIds.includes("disc-4.return-to-gaia.stiltzkin-eighth-bundle") || !stiltzkinFinalStepObjectiveIds.includes(stiltzkinRibbonObjectiveId)) {
  errors.push("The Disc IV Stiltzkin step must keep the final purchase and conditional Ribbon as separate linked objectives.");
}
const ribbonItemId = "game-item.ribbon";
const expectedRibbonPaths = [
  "item-path.disc-3.lost-continent.ribbon-mog-story",
  "item-path.disc-3.aerial-exploration.ribbon-forgotten-island",
  "item-path.disc-4.return-to-gaia.ribbon-treno-auction",
  "item-path.disc-4.return-to-gaia.ribbon-stiltzkin-reward",
];
if (!gameItems.some((item) => item.id === ribbonItemId && item.name === "Ribbon" && item.category === "equipment")) {
  errors.push("Ribbon needs a partial equipment record in the item catalog.");
}
for (const pathId of expectedRibbonPaths) {
  if (!itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === ribbonItemId)) {
    errors.push(`Ribbon acquisition coverage is missing ${pathId}.`);
  }
}
for (const abilityName of ["Ability Up", "Concentrate", "Madeen"]) {
  if (!equipmentAbilityClaims.some((claim) => claim.itemId === ribbonItemId && claim.abilityName === abilityName)) {
    errors.push(`Ribbon needs its ${abilityName} ability claim.`);
  }
}
if (!sourceInventoryTargets.some((target) => target.itemId === ribbonItemId && target.targetQuantity === 4)) {
  errors.push("Ribbon needs the source-listed Need 4 inventory target with its version caveat.");
}
const laniStealObjectiveId = "disc-2.journey-to-outer-continent.lani-steals";
const expectedLaniStealPaths = [
  { id: "item-path.disc-2.journey-to-outer-continent.lani-ether-steal", itemId: "game-item.ether" },
  { id: "item-path.disc-2.journey-to-outer-continent.lani-gladius-steal", itemId: "game-item.gladius" },
  { id: "item-path.disc-2.journey-to-outer-continent.lani-coral-sword-steal", itemId: "game-item.coral-sword" },
];
for (const expected of expectedLaniStealPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id && entry.itemId === expected.itemId);
  if (!path || path.method !== "steal" || !path.walkthroughObjectiveIds?.includes(laniStealObjectiveId)) {
    errors.push(`Lani's one-time-steal checklist must link ${expected.itemId} to acquisition path ${expected.id}.`);
  }
}
const expectedLaniRecoveryPathIds = [
  "item-path.disc-2.outer-continent.gladius-black-mage-village-shop",
  "item-path.disc-2.madain-sari.gladius-shop",
  "item-path.disc-3.the-home-front.gladius-alexandria-shop",
  "item-path.disc-3.card-tournament.gladius-treno-shop",
  "item-path.disc-3.lost-continent.gladius-esto-gaza-shop",
  "item-path.disc-3.aerial-exploration.gladius-daguerreo-shop",
  "item-path.disc-3.portal-to-another-world.gladius-bran-bal-mogshop",
  "item-path.disc-3.card-tournament.coral-sword-treno-shop",
  "item-path.disc-3.on-the-high-seas.coral-sword-lindblum-shop",
];
for (const pathId of expectedLaniRecoveryPathIds) {
  if (!itemAcquisitionPaths.some((path) => path.id === pathId && path.method !== "steal")) {
    errors.push(`Lani's later item-type recovery catalog is missing ${pathId}.`);
  }
}
const laniWarning = missables.find((record) => record.id === "missable.disc-2.journey-to-outer-continent.lani-steals");
if (!laniWarning?.classification.includes("recoverable-later") || laniWarning.recovery.includes("under research")) {
  errors.push("The Lani warning must distinguish one-time steal copies from later Gladius and Coral Sword recovery.");
}
for (const [itemId, abilityNames] of [
  ["game-item.gladius", ["Annoy", "Lucky Seven"]],
  ["game-item.coral-sword", ["Charge!"]],
] as const) {
  if (!gameItems.some((item) => item.id === itemId)) {
    errors.push(`Lani's recovery scope needs ${itemId} in the item catalog.`);
  }
  for (const abilityName of abilityNames) {
    if (!equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName)) {
      errors.push(`${itemId} needs its ${abilityName} ability claim.`);
    }
  }
}
for (const [itemId, quantity] of [["game-item.gladius", 6], ["game-item.coral-sword", 2]] as const) {
  if (!sourceInventoryTargets.some((target) => target.itemId === itemId && target.targetQuantity === quantity)) {
    errors.push(`${itemId} needs its source-listed Need ${quantity} inventory target.`);
  }
}
const fossilRooTreasureObjectiveId = "disc-2.journey-to-outer-continent.treasure-sweep";
const expectedFossilRooTreasurePaths = [
  { id: "item-path.disc-2.journey-to-outer-continent.fossil-roo-elixir-chest", itemId: "game-item.elixir", method: "chest" },
  { id: "item-path.disc-2.journey-to-outer-continent.fossil-roo-fairy-earrings", itemId: "game-item.fairy-earrings", method: "chest" },
  { id: "item-path.disc-2.journey-to-outer-continent.fossil-roo-ether-chest", itemId: "game-item.ether", method: "chest" },
  { id: "item-path.disc-2.journey-to-outer-continent.fossil-roo-lamias-tiara", itemId: "game-item.lamias-tiara", method: "chest" },
  { id: "item-path.disc-2.journey-to-outer-continent.fossil-roo-survival-vest", itemId: "game-item.survival-vest", method: "hidden-pickup" },
] as const;
for (const expected of expectedFossilRooTreasurePaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  if (!path || path.itemId !== expected.itemId || path.method !== expected.method || !path.walkthroughObjectiveIds?.includes(fossilRooTreasureObjectiveId)) {
    errors.push(`Fossil Roo's treasure-sweep objective must link ${expected.itemId} to ${expected.id}.`);
  }
}
const expectedFossilRooShopPathIds = [
  "item-path.disc-2.journey-to-outer-continent.zorn-thorn.partisan-fossil-roo-shop",
  "item-path.disc-2.journey-to-outer-continent.zorn-thorn.stardust-rod-fossil-roo-shop",
  "item-path.disc-2.journey-to-outer-continent.zorn-thorn.mythril-armor-fossil-roo-shop",
  "item-path.disc-2.journey-to-outer-continent.zorn-thorn.mythril-armlet-fossil-roo-shop",
  "item-path.disc-2.journey-to-outer-continent.fossil-roo-ice-brand-shop",
  "item-path.disc-2.journey-to-outer-continent.fossil-roo-chain-plate-shop",
  "item-path.disc-2.journey-to-outer-continent.fossil-roo-mythril-vest-shop",
  "item-path.disc-2.journey-to-outer-continent.fossil-roo-bandana-shop",
  "item-path.disc-2.journey-to-outer-continent.adaman-vest-fossil-roo-shop",
];
for (const pathId of expectedFossilRooShopPathIds) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  if (
    !path ||
    path.chapterId !== "disc-2.journey-to-outer-continent" ||
    path.shopId !== "fossil-roo.treasure-hunter-shop" ||
    path.availability !== "window-unverified" ||
    !path.walkthroughObjectiveIds?.includes(fossilRooTreasureObjectiveId) ||
    !path.sourceIds.includes("jegged-missables") ||
    !path.sourceIds.includes("ffwiki-unrevisitable-locations") ||
    !path.conditions.includes("Buy during the Fossil Roo visit to be safe")
  ) {
    errors.push(`Fossil Roo's disputed Treasure Hunter shop window must link ${pathId} to its safe pre-exit checklist action and access sources.`);
  }
}
const fossilRooTreasureObjective = objectives.find((objective) => objective.id === fossilRooTreasureObjectiveId);
if (!fossilRooTreasureObjective?.title.includes("Treasure Hunter's shop")) {
  errors.push("Fossil Roo's treasure checklist must include the Treasure Hunter's shop access check.");
}
const expectedFossilRooRecoveryPaths = [
  { id: "item-path.disc-3.forgotten-continent.stiltzkin-elixir", itemId: "game-item.elixir" },
  { id: "item-path.disc-3.forgotten-continent.ark-elixir-steal", itemId: "game-item.elixir" },
  { id: "item-path.disc-3.desert-palace.fairy-earrings-light-chamber", itemId: "game-item.fairy-earrings" },
  { id: "item-path.disc-3.lost-continent.mount-gulug-ether-rubble", itemId: "game-item.ether" },
  { id: "item-path.disc-2.madain-sari.lamias-tiara-shop", itemId: "game-item.lamias-tiara" },
  { id: "item-path.disc-2.madain-sari.survival-vest-shop", itemId: "game-item.survival-vest" },
];
for (const expected of expectedFossilRooRecoveryPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  if (!path || path.itemId !== expected.itemId || path.chapterId === "disc-2.journey-to-outer-continent") {
    errors.push(`Fossil Roo's location-copy warning needs later recovery path ${expected.id}.`);
  }
}
const madainSariSurvivalVestPathId = "item-path.disc-3.on-the-high-seas.survival-vest-madain-sari-pickup";
const madainSariSurvivalVestPath = itemAcquisitionPaths.find((path) => path.id === madainSariSurvivalVestPathId);
const madainSariHiddenRoomObjectiveId = "disc-2.return-to-madain-sari.hidden-room";
if (
  !madainSariSurvivalVestPath ||
  madainSariSurvivalVestPath.itemId !== "game-item.survival-vest" ||
  madainSariSurvivalVestPath.chapterId !== "disc-2.return-to-madain-sari" ||
  madainSariSurvivalVestPath.method !== "hidden-pickup" ||
  madainSariSurvivalVestPath.availability !== "single-use" ||
  !madainSariSurvivalVestPath.walkthroughObjectiveIds?.includes(madainSariHiddenRoomObjectiveId) ||
  !itemCatalogCoverage.chapterIds.includes("disc-2.return-to-madain-sari")
) {
  errors.push("The Madain Sari Survival Vest pickup must be filed on the Disc II post-Iifa return and linked to its hidden-room objective.");
}
if (!madainSariSurvivalVestPath?.conditions.toLowerCase().includes("after the story returns to madain sari from the iifa tree")) {
  errors.push("The Madain Sari Survival Vest path must preserve its source-verified post-Iifa timing.");
}
for (const sourceId of ["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari"]) {
  if (!madainSariSurvivalVestPath?.sourceIds.includes(sourceId)) {
    errors.push(`The post-Iifa Madain Sari Survival Vest path needs source ${sourceId}.`);
  }
}
const fossilRooTreasureWarning = missables.find((record) => record.id === "missable.disc-2.journey-to-outer-continent.treasure-sweep");
if (
  !fossilRooTreasureWarning?.classification.includes("missable-opportunity") ||
  !fossilRooTreasureWarning.consequence.includes("later replacements") ||
  !fossilRooTreasureWarning.recovery.includes("location-specific") ||
  !fossilRooTreasureWarning.sourceIds.includes("gamefaqs-items-71891") ||
  !fossilRooTreasureWarning.sourceIds.includes("rpgclassics-synthesis") ||
  !fossilRooTreasureWarning.sourceIds.includes("jegged-missables") ||
  !fossilRooTreasureWarning.sourceIds.includes("ffwiki-unrevisitable-locations") ||
  !fossilRooTreasureWarning.note.includes("the guide uses the pre-exit deadline as the safe route") ||
  !fossilRooTreasureWarning.action.includes("Check the Treasure Hunter's shop")
) {
  errors.push("Fossil Roo's warning must preserve the re-entry conflict, safe shop cutoff, and distinction between location copies and recoverable item types.");
}
const fossilRooSwitchSourceNotes = new Map(sources.map((source) => [source.id, source.notes]));
const fossilRooFinalGargantCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.fossil-roo.final-gargant");
const fossilRooWalkthroughSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-outer-continent")
  ?.sections.find((section) => section.id === "fossil-roo-point-of-no-return");
const fossilRooFinalSweepStep = fossilRooWalkthroughSection?.steps.find((step) => step.id === "fossil-roo-final-sweep");
const fossilRooExitStep = fossilRooWalkthroughSection?.steps.find((step) => step.id === "fossil-roo-exit-gargant");
if (
  !fossilRooSwitchSourceNotes.get("gamefaqs-journey-to-outer-continent-71891")?.includes("terminal ivy-room switch No. 3") ||
  !fossilRooSwitchSourceNotes.get("jegged-fossil-roo")?.includes("switch No. 3") ||
  !fossilRooSwitchSourceNotes.get("rpgclassics-fossil-roo")?.includes("switch No. 3") ||
  !fossilRooSwitchSourceNotes.get("gamerguides-fossil-roo")?.includes("without assigning a number") ||
  !fossilRooSwitchSourceNotes.get("gamerguides-fossil-roo")?.includes("earlier Nest switch No. 4 is a different control") ||
  !fossilRooSwitchSourceNotes.get("elitegrindlab-fossil-roo")?.includes("No. 3, No. 4, or unnumbered") ||
  !fossilRooSwitchSourceNotes.get("elitegrindlab-fossil-roo")?.includes("does not attribute the No. 4 claim") ||
  !fossilRooTreasureWarning?.deadline.includes("final vine-chamber switch") ||
  !fossilRooTreasureWarning?.deadline.includes("EliteGrindLab reports an unresolved numbering conflict") ||
  !fossilRooFinalGargantCutoff?.trigger.includes("final vine-chamber switch") ||
  !fossilRooFinalGargantCutoff?.trigger.includes("without attributing its No. 4 claim") ||
  !fossilRooFinalGargantCutoff?.sourceIds.includes("elitegrindlab-fossil-roo") ||
  !fossilRooFinalSweepStep?.detail?.includes("Jegged says the entrance can technically be revisited") ||
  !fossilRooFinalSweepStep?.detail?.includes("No. 3/No. 4/unnumbered conflict") ||
  !fossilRooExitStep?.text.includes("switch No. 3")
) {
  errors.push("Fossil Roo's final Gargant cutoff must keep its safe pre-exit timing while distinguishing the three explicit No. 3 route labels, Gamer Guides' unnumbered prose, EliteGrindLab's unattributed No. 4 conflict, and Jegged's limited re-entry claim.");
}
for (const warningId of [
  "missable.disc-2.journey-to-outer-continent.kuppo-letter",
  "missable.disc-2.journey-to-outer-continent.one-ring",
  "missable.disc-2.journey-to-outer-continent.peek-a-boo",
]) {
  const warning = missables.find((record) => record.id === warningId);
  if (
    !warning?.sourceIds.includes("jegged-missables") ||
    !warning.sourceIds.includes("ffwiki-unrevisitable-locations") ||
    !warning.note?.includes("Jegged") ||
    !warning.note.toLowerCase().includes("mining")
  ) {
    errors.push(`${warningId} must preserve the source-qualified Fossil Roo mining-room access caveat.`);
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
if (
  jumpRopeLetterObjective?.category !== "side-content" ||
  !jumpRopeLetterObjective.chapterIds?.includes("disc-1.alexandria") ||
  !jumpRopeLetterObjective.chapterIds?.includes("disc-2.return-to-alexandria") ||
  !jumpRopeLetterObjective.chapterIds?.includes("disc-3.trouble-on-the-home-front") ||
  !jumpRopeLetterWarning?.warningChapterIds.includes("disc-3.trouble-on-the-home-front")
) {
  errors.push("The Jump Rope Mognet letter must link its Disc I chance, Disc II recovery, and Disc III best-effort check.");
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
if (!jumpRopeLetterObjective?.sourceIds.includes("jegged-return-to-alexandria-castle") || !jumpRopeLetterWarning?.sourceIds.includes("jegged-return-to-alexandria-castle")) {
  errors.push("The Jump Rope Mognet letter objective and warning must cite Jegged's Disc II recovery evidence.");
}
if (!jumpRopeLetterObjective?.sourceIds.includes("cour89-mognet-letters") || !jumpRopeLetterWarning?.sourceIds.includes("cour89-mognet-letters") || !jumpRopeLetterWarning?.consequence.includes("Cour89's optional-mail list") || !jumpRopeLetterWarning.nextAvailability?.includes("does not address the Disc II reread")) {
  errors.push("The Jump Rope letter must record Cour89's Disc I listing without treating its omitted Disc II reread as evidence of unavailability.");
}
if (
  !jumpRopeLetterWarning ||
  !jumpRopeLetterWarning.classification.includes("conditional") ||
  !jumpRopeLetterWarning.classification.includes("recoverable-later") ||
  jumpRopeLetterWarning.classification.includes("permanently-missable")
) {
  errors.push("The Jump Rope Mognet letter warning must be conditional and record its documented Disc II recovery.");
}
if (!jumpRopeLetterObjective?.sourceIds.includes("flactem-disc-3-treno") || !jumpRopeLetterWarning?.sourceIds.includes("flactem-disc-3-treno") || !jumpRopeLetterWarning.consequence.includes("best-effort place to check") || !jumpRopeLetterWarning.nextAvailability?.includes("does not confirm the Jump Rope letter is still available")) {
  errors.push("The Jump Rope warning must use Flactem only as evidence for the Disc III Mosh visit, not letter availability.");
}
const discOneJumpRopeStep = jumpRopeLetterSteps.find(({ chapterId }) => chapterId === "disc-1.alexandria")?.step;
const discTwoJumpRopeStep = jumpRopeLetterSteps.find(({ chapterId }) => chapterId === "disc-2.return-to-alexandria")?.step;
const discThreeJumpRopeStep = jumpRopeLetterSteps.find(({ chapterId }) => chapterId === "disc-3.trouble-on-the-home-front")?.step;
if (
  jumpRopeLetterSteps.length !== 3 ||
  discOneJumpRopeStep?.id !== "guardhouse-pickup-mognet" ||
  discTwoJumpRopeStep?.id !== "return-alexandria-mosh-save" ||
  discThreeJumpRopeStep?.id !== "trouble-save-before-library"
) {
  errors.push("The Jump Rope Mognet letter objective must point to the Disc I, Disc II, and Disc III Mosh checks.");
}
if (!discTwoJumpRopeStep?.detail?.includes("documented second opportunity") || !discTwoJumpRopeStep.objectiveIds?.includes(jumpRopeLetterId)) {
  errors.push("The Disc II Mosh step must explain and link the second Jump Rope letter opportunity.");
}
if (!discThreeJumpRopeStep?.detail?.includes("best-effort") || !discThreeJumpRopeStep.detail.includes("not a promised recovery") || !discThreeJumpRopeStep.objectiveIds?.includes(jumpRopeLetterId)) {
  errors.push("The Disc III Mosh step must label the check as best effort and avoid claiming confirmed recovery.");
}
const blankEquipmentObjectiveId = "disc-1.evil-forest.blank-equipment";
const blankEquipmentWarning = missablesById.get("missable.disc-1.evil-forest.blank-equipment");
const blankSilkShirtPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.evil-forest.blank-silk-shirt");
const blankSilkShirtAlternativePathIds = [
  "item-path.disc-1.alexandria.swordfight-silk-shirt-reward",
  "item-path.disc-1.ice-cavern.black-waltz-1-silk-shirt-steal",
  "item-path.disc-1.village-of-dali.silk-shirt-shop",
  "item-path.disc-2.treno.silk-shirt-shop",
  "item-path.disc-2.return-to-lindblum.silk-shirt-shop",
  "item-path.disc-2.outer-continent.silk-shirt-black-mage-village-shop",
];
const blankEquipmentStep = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-1.evil-forest")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.objectiveIds?.includes(blankEquipmentObjectiveId));
if (
  !blankEquipmentWarning?.sourceIds.includes("gamefaqs-items-71891") ||
  !blankEquipmentWarning.recovery.includes("You cannot retrieve the same copies from Blank later") ||
  !blankEquipmentWarning.recovery.includes("80–99-noble swordfighting reward") ||
  !blankEquipmentWarning.recovery.includes("Black Waltz 1 steal") ||
  !blankEquipmentWarning.recovery.includes("Dali's 400-Gil shop") ||
  !blankEquipmentWarning.recovery.includes("Black Mage Village")
) {
  errors.push("Blank's equipment warning must separate lost copies from the sourced Silk Shirt alternatives.");
}
if (
  !blankSilkShirtPath ||
  blankSilkShirtPath.itemId !== "game-item.silk-shirt" ||
  blankSilkShirtPath.availability !== "limited-window" ||
  !blankSilkShirtPath.walkthroughObjectiveIds?.includes(blankEquipmentObjectiveId) ||
  blankSilkShirtAlternativePathIds.some((pathId) => !itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === "game-item.silk-shirt")) ||
  !blankEquipmentStep?.objectiveIds?.includes(blankEquipmentObjectiveId)
) {
  errors.push("Blank's Silk Shirt loss must link its limited-window copy to every modeled recovery path and the forest checklist.");
}
const jumpRopeLetterCutoffs = gameRouteCutoffs.filter((cutoff) => cutoff.missableIds.includes(jumpRopeLetterWarning?.id ?? ""));
const discOneJumpRopeCutoff = jumpRopeLetterCutoffs.find((cutoff) => cutoff.id === "cutoff.alexandria.jump-rope-mognet-letter");
const discTwoJumpRopeCutoff = jumpRopeLetterCutoffs.find((cutoff) => cutoff.id === "cutoff.return-to-alexandria.jump-rope-letter-recovery");
const discThreeJumpRopeCutoff = jumpRopeLetterCutoffs.find((cutoff) => cutoff.id === "cutoff.disc-3.alexandria.jump-rope-letter-best-effort");
if (
  jumpRopeLetterCutoffs.length !== 3 ||
  discOneJumpRopeCutoff?.edgeId !== "story.alexandria-to-evil-forest" ||
  discTwoJumpRopeCutoff?.edgeId !== "story.return-to-alexandria-to-pinnacle-rocks" ||
  !discTwoJumpRopeCutoff?.sourceIds.includes("jegged-return-to-alexandria-castle") ||
  !discTwoJumpRopeCutoff?.trigger.includes("Jump-rope Champion Appears!") ||
  discThreeJumpRopeCutoff?.edgeId !== "story.trouble-on-home-front-to-aftermath" ||
  discThreeJumpRopeCutoff.certainty !== "conservative" ||
  !discThreeJumpRopeCutoff.trigger.includes("best-effort check, not a confirmed recovery window") ||
  !discThreeJumpRopeCutoff.sourceIds.includes("flactem-disc-3-treno")
) {
  errors.push("The Jump Rope Mognet letter must have distinct Disc I, Disc II, and conservative Disc III check windows with accurate source scope.");
}
const desertPalaceLockinWarning = missablesById.get("missable.disc-3.picking-up-the-trail.story-lock-in");
const desertPalaceLockinCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.desert-palace.route-lock-in");
const desertPalaceExitEdge = gameRouteEdgesById.get("story.desert-palace-to-lost-continent");
const desertPalacePartySequence = storyPartySequences.find((sequence) => sequence.id === "party-sequence.oeilvert-desert-palace");
const desertPalaceReturnSourceIds = ["gamefaqs-desert-palace-71891", "gamefaqs-lost-continent-71891", "jegged-returning-desert-palace"];
if (
  !desertPalaceLockinWarning?.nextAvailability?.includes("climb the exit ladder to the world map") ||
  !desertPalaceLockinWarning.nextAvailability.includes("optional activities before Esto Gaza") ||
  desertPalaceReturnSourceIds.some((sourceId) => !desertPalaceLockinWarning.sourceIds.includes(sourceId))
) {
  errors.push("The Desert Palace lock-in warning must identify the sourced world-map return and optional window before Esto Gaza.");
}
if (
  desertPalaceLockinCutoff?.edgeId !== "story.picking-up-the-trail-to-forgotten-continent" ||
  !desertPalaceLockinCutoff.trigger.includes("exit by the ladder to the world map") ||
  !desertPalaceLockinCutoff.trigger.includes("before Esto Gaza") ||
  desertPalaceReturnSourceIds.some((sourceId) => !desertPalaceLockinCutoff.sourceIds.includes(sourceId))
) {
  errors.push("The Desert Palace lock-in cutoff must retain the correct pre-sinkhole edge and sourced recovery boundary.");
}
if (
  !desertPalaceExitEdge?.summary.includes("free travel and optional activities resume") ||
  desertPalaceReturnSourceIds.some((sourceId) => !desertPalaceExitEdge.sourceIds.includes(sourceId)) ||
  !desertPalacePartySequence?.phases[2]?.summary.includes("exit by the ladder to the world map") ||
  !desertPalacePartySequence.phases[2].summary.includes("before Esto Gaza")
) {
  errors.push("The Desert Palace story edge and party sequence must show where open travel resumes after the split.");
}
const moisLetterWarning = missablesById.get("missable.disc-1.ice-cavern.mois-letter");
const moisLetterCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.dali-cargo-ship.mois-letter");
const moisLetterReturnEdge = gameRouteEdgesById.get("return.dali-to-ice-cavern");
const moisLetterRecoverySources = ["cour89-ice-cavern", "game8-mognet-letter-list", "jinsoku-mognet-letter-list"];
if (
  !moisLetterWarning?.deadline?.includes("before boarding the Cargo Ship from Dali") ||
  !moisLetterWarning.recovery?.includes("Cour89 independently says") ||
  !moisLetterWarning.recovery.includes("Game8 and Jinsoku") ||
  moisLetterRecoverySources.some((sourceId) => !moisLetterWarning.sourceIds.includes(sourceId))
) {
  errors.push("Mois's letter warning must preserve the post-boss return, Disc I cutoff, and exact-timing source disagreement.");
}
if (
  moisLetterCutoff?.edgeId !== "story.dali-to-cargo-ship" ||
  moisLetterCutoff.certainty !== "disputed" ||
  !moisLetterCutoff.trigger.includes("post-boss") ||
  !moisLetterCutoff.trigger.includes("conservative cutoff") ||
  moisLetterRecoverySources.some((sourceId) => !moisLetterCutoff.sourceIds.includes(sourceId))
) {
  errors.push("Mois's letter cutoff must retain the Dali departure boundary and source-specific timing disagreement.");
}
if (
  !moisLetterReturnEdge?.summary.includes("post-boss letter return") ||
  !moisLetterReturnEdge.summary.includes("treat the Cargo Ship as the safe cutoff") ||
  moisLetterRecoverySources.some((sourceId) => !moisLetterReturnEdge.sourceIds.includes(sourceId))
) {
  errors.push("The Dali return route must distinguish Mois's post-boss letter window from later entrance visits.");
}
const branBalReturnEdge = gameRouteEdgesById.get("story.portal-to-return-to-gaia");
const branBalTreasureWarning = missablesById.get("missable.disc-3.portal-to-another-world.terra-bran-bal-treasures");
const branBalCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.bran-bal.green-gate");
const branBalReturnSources = ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"];
const terraTreasureObjective = objectivesById.get("disc-3.portal-to-another-world.terra-treasures");
const branBalTreasureObjective = objectivesById.get("disc-3.portal-to-another-world.bran-bal-treasures");
const terraBranFixedPickupRequirements = [
  ["item-path.disc-3.portal-to-another-world.terra-coronet-chest", "game-item.coronet", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-dragon-wrist-chest", "game-item.dragon-wrist", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-elixir-chest", "game-item.elixir", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-remedy-chest", "game-item.remedy", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-mythril-racket-chest", "game-item.mythril-racket", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-demons-vest-chest", "game-item.demons-vest", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.terra-minervas-plate-chest", "game-item.minervas-plate", "chest", "disc-3.portal-to-another-world.terra-treasures"],
  ["item-path.disc-3.portal-to-another-world.bran-bal-flash-hat-chest", "game-item.flash-hat", "chest", "disc-3.portal-to-another-world.bran-bal-treasures"],
  ["item-path.disc-3.portal-to-another-world.bran-bal-laboratory-elixir-pickup", "game-item.elixir", "hidden-pickup", "disc-3.portal-to-another-world.bran-bal-treasures"],
  ["item-path.disc-3.portal-to-another-world.bran-bal-inn-elixir-chest", "game-item.elixir", "chest", "disc-3.portal-to-another-world.bran-bal-treasures"],
  ["item-path.disc-3.portal-to-another-world.bran-bal-wing-edge-chest", "game-item.wing-edge", "chest", "disc-3.portal-to-another-world.bran-bal-treasures"],
  ["item-path.disc-3.portal-to-another-world.bran-bal-angel-earrings-pickup", "game-item.angel-earrings", "hidden-pickup", "disc-3.portal-to-another-world.bran-bal-treasures"],
] as const;
const terraBranFixedPickupErrors = terraBranFixedPickupRequirements.filter(([pathId, itemId, method, objectiveId]) => {
  const path = itemAcquisitionPaths.find((itemPath) => itemPath.id === pathId);
  return !path
    || path.itemId !== itemId
    || path.method !== method
    || path.quantity !== 1
    || path.availability !== "single-use"
    || !path.walkthroughObjectiveIds?.includes(objectiveId);
});
const branBalLaterEquipmentRecoveryIds = [
  "item-path.disc-4-shop.daguerreo.weapon-shop.coronet",
  "item-path.disc-4-shop.daguerreo.weapon-shop.dragon-wrist",
  "item-path.disc-4-shop.daguerreo.weapon-shop.mythril-racket",
  "item-path.disc-4-shop.daguerreo.weapon-shop.demons-vest",
  "item-path.disc-4-shop.daguerreo.weapon-shop.minervas-plate",
  "item-path.disc-4-shop.daguerreo.weapon-shop.flash-hat",
];
const branBalLaterEquipmentRecoveryCosts = [4400, 4800, 2250, 10250, 12200, 5200] as const;
const branBalLaterEquipmentRecoveryPaths = branBalLaterEquipmentRecoveryIds.map((pathId) => itemAcquisitionPaths.find((path) => path.id === pathId));
if (
  !branBalReturnEdge?.summary.includes("linear path back through Bran Bal") ||
  !branBalReturnEdge.summary.includes("gather the Genomes") ||
  !branBalReturnEdge.summary.includes("not free access to its earlier pickup rooms") ||
  branBalReturnSources.some((sourceId) => !branBalReturnEdge.sourceIds.includes(sourceId))
) {
  errors.push("The post-Kuja route must document the linear Bran Bal story passage without implying a free treasure-room return.");
}
if (
  !terraTreasureObjective ||
  !branBalTreasureObjective ||
  branBalTreasureWarning?.objectiveId !== branBalTreasureObjective.id ||
  branBalCutoff?.certainty !== "conservative" ||
  !branBalCutoff.trigger.includes("Mikoto through the green gate") ||
  !branBalTreasureWarning?.nextAvailability?.includes("Neither guide documents free access to the earlier treasure rooms") ||
  !["Coronet (4,400 Gil)", "Dragon Wrist (4,800)", "Mythril Racket (2,250)", "Demon's Vest (10,250)", "Minerva's Plate (12,200)", "Flash Hat (5,200)", "Angel Earrings"].every((itemText) => branBalTreasureWarning.nextAvailability.includes(itemText)) ||
  !branBalTreasureWarning.nextAvailability.includes("Angel Earrings") ||
  !branBalTreasureWarning.recovery?.includes("no reviewed source confirms a free return to the earlier pickup rooms") ||
  !branBalTreasureWarning.action?.includes("both local Elixirs") ||
  !branBalTreasureWarning.note?.includes("one Minerva chest") ||
  !branBalTreasureWarning.note.includes("two local Bran Bal Elixirs") ||
  branBalReturnSources.some((sourceId) => !branBalTreasureWarning.sourceIds.includes(sourceId))
) {
  errors.push("Bran Bal's treasure warning must retain the conservative pre-gate checkpoint and distinguish story traversal from pickup recovery.");
}
if (
  terraBranFixedPickupErrors.length > 0 ||
  !branBalTreasureWarning?.classification.includes("missable-opportunity") ||
  branBalTreasureWarning.classification.includes("permanently-missable") ||
  !branBalTreasureWarning.sourceIds.includes("gamefaqs-item-locations-54996") ||
  !branBalTreasureWarning.sourceIds.includes("elitegrindlab-bran-bal") ||
  !branBalTreasureWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  branBalLaterEquipmentRecoveryPaths.some((path, index) => !path || path.availability !== "repeatable" || path.cost?.currency !== "gil" || path.cost?.amount !== branBalLaterEquipmentRecoveryCosts[index]) ||
  !itemAcquisitionPaths.some((path) => path.itemId === "game-item.elixir" && path.chapterId !== "disc-3.portal-to-another-world") ||
  !itemAcquisitionPaths.some((path) => path.itemId === "game-item.remedy" && path.chapterId !== "disc-3.portal-to-another-world") ||
  !itemAcquisitionPaths.some((path) => path.itemId === "game-item.wing-edge" && path.chapterId !== "disc-3.portal-to-another-world") ||
  !itemAcquisitionPaths.some((path) => path.itemId === "game-item.angel-earrings" && path.chapterId !== "disc-3.portal-to-another-world")
) {
  errors.push("Terra and Bran Bal's fixed pickup sweep must map all 12 route items, distinguish the two local Elixirs, preserve the Minerva's Plate label conflict, and retain later item-type routes.");
}
const angelEarringsItemId = "game-item.angel-earrings";
const angelEarringsItem = gameItems.find((item) => item.id === angelEarringsItemId);
const angelEarringsPickup = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.bran-bal-angel-earrings-pickup");
const angelEarringsReward = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.trouble-on-the-home-front.knights-orders-angel-earrings-reward");
const angelEarringsSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.angel-earrings-synthesis-daguerreo");
const angelEarringsRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.angel-earrings");
const angelEarringsWarning = missablesById.get("missable.disc-3.trouble-on-the-home-front.knights-orders");
const angelEarringsAbilityNames = new Set(
  equipmentAbilityClaims.filter((claim) => claim.itemId === angelEarringsItemId).map((claim) => claim.abilityName),
);
const baretteItem = gameItems.find((item) => item.id === "game-item.barette");
const baretteHotCold = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.barette-hot-cold");
const baretteIpsensChest = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.ipsens-castle.barette-fresco-chest");
const baretteSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.barette-daguerreo-synthesis");
const baretteRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.barette");
const baretteAbilityNames = new Set(
  equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.barette").map((claim) => claim.abilityName),
);
if (
  angelEarringsItem?.name !== "Angel Earrings" ||
  !angelEarringsItem.sourceIds.includes("gamefaqs-items-71891") ||
  !angelEarringsPickup || angelEarringsPickup.itemId !== angelEarringsItemId ||
  angelEarringsPickup.chapterId !== "disc-3.portal-to-another-world" ||
  angelEarringsPickup.method !== "hidden-pickup" || angelEarringsPickup.availability !== "single-use" ||
  !angelEarringsPickup.walkthroughObjectiveIds?.includes("disc-3.portal-to-another-world.bran-bal-treasures") ||
  !angelEarringsReward || angelEarringsReward.itemId !== angelEarringsItemId ||
  angelEarringsReward.method !== "quest-reward" || angelEarringsReward.availability !== "conditional" ||
  !angelEarringsReward.walkthroughObjectiveIds?.includes("disc-3.trouble-on-the-home-front.knights-orders") ||
  !angelEarringsRecipe || angelEarringsRecipe.resultItemId !== angelEarringsItemId ||
  angelEarringsRecipe.chapterId !== "disc-3.aerial-exploration" ||
  angelEarringsRecipe.shopId !== "daguerreo.synthesis-expert" || angelEarringsRecipe.cost.amount !== 8000 ||
  angelEarringsRecipe.ingredients.length !== 2 ||
  !angelEarringsRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.fairy-earrings" && ingredient.quantity === 1) ||
  !angelEarringsRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.barette" && ingredient.quantity === 1) ||
  !angelEarringsSynthesisPath || angelEarringsSynthesisPath.recipeId !== angelEarringsRecipe.id ||
  angelEarringsSynthesisPath.availability !== "repeatable" || angelEarringsSynthesisPath.cost?.amount !== 8000 ||
  !["Auto-Regen", "MP+20%", "Reis's Wind"].every((abilityName) => angelEarringsAbilityNames.has(abilityName)) ||
  !angelEarringsWarning?.nextAvailability?.includes("hidden pickup at Bran Bal") ||
  !angelEarringsWarning.recovery?.includes("repeatable Daguerreo synthesis") ||
  !angelEarringsWarning.note?.includes("rather than permanent item-type loss") ||
  !itemCatalogCoverage.chapterIds.includes("disc-3.trouble-on-the-home-front") ||
  baretteItem?.name !== "Barette" ||
  !baretteHotCold || baretteHotCold.itemId !== "game-item.barette" || baretteHotCold.availability !== "repeatable" ||
  !baretteIpsensChest || baretteIpsensChest.itemId !== "game-item.barette" || baretteIpsensChest.method !== "chest" ||
  !baretteSynthesisPath || baretteSynthesisPath.recipeId !== "synthesis-recipe.barette" || baretteSynthesisPath.cost?.amount !== 1800 ||
  !baretteRecipe || baretteRecipe.resultItemId !== "game-item.barette" || baretteRecipe.cost.amount !== 1800 ||
  !baretteRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.needle-fork" && ingredient.quantity === 1) ||
  !baretteRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.barbut" && ingredient.quantity === 1) ||
  !["Chemist", "Cura", "Gamble Defense"].every((abilityName) => baretteAbilityNames.has(abilityName))
) {
  errors.push("Angel Earrings and its Barette ingredient must link their acquisition routes, recipes, abilities, and recoverability warning.");
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

const leoStellazzio = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.home-front.leo-stellazzio");
const leoStellazzioItem = gameItems.find((item) => item.id === "game-item.leo-stellazzio");
const alexandriaPickupObjective = objectivesById.get("disc-3.the-home-front.alexandria-pickups");
if (
  !leoStellazzio
  || !leoStellazzioItem?.sourceIds.includes("ffuniverse-ff9-guide")
  || leoStellazzio.itemId !== "game-item.leo-stellazzio"
  || leoStellazzio.chapterId !== "disc-3.the-home-front"
  || !leoStellazzio.conditions?.includes("does not open until Disc III")
  || !leoStellazzio.conditions.includes("upper-right corner")
  || !leoStellazzio.conditions.includes("Neptune statue")
  || !leoStellazzio.sourceIds.includes("ffuniverse-ff9-guide")
  || !leoStellazzio.walkthroughObjectiveIds.includes("disc-3.the-home-front.alexandria-pickups")
  || !alexandriaPickupObjective?.sourceIds.includes("ffuniverse-ff9-guide")
) {
  errors.push("Leo Stellazzio must retain FFUniverse's Disc III door opening and Neptune-statue room as a specific Alexandria pickup route.");
}

const burmeciaTreasureWarning = missables.find((missable) => missable.id === "missable.disc-1.burmecia.treasures");
const burmeciaTreasureCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.burmecia.first-visit-departure");
if (!burmeciaTreasureWarning?.sourceIds.includes("ffwiki-unrevisitable-locations") || !burmeciaTreasureCutoff?.sourceIds.includes("ffwiki-unrevisitable-locations")) {
  errors.push("The Burmecia treasure warning and cutoff must retain the palace-only unrevisitable-location source.");
}
if (burmeciaTreasureCutoff?.certainty !== "conservative") {
  errors.push("The Burmecia first-visit sweep must remain the conservative checkpoint while later pickup recovery is only partially verified.");
}
if (burmeciaTreasureWarning?.classification.includes("permanently-missable") ||
  !burmeciaTreasureWarning?.sourceIds.includes("ff9-kouryaku-disc4") ||
  !burmeciaTreasureWarning?.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery") ||
  !burmeciaTreasureWarning?.note.includes("several specific Suburb/Uptown pickups") ||
  !burmeciaTreasureWarning?.note.includes("does not inventory every old chest")) {
  errors.push("The Burmecia treasure warning must scope the Disc IV evidence to demonstrated pickups and avoid permanent-loss claims.");
}
const burmeciaDisc4Return = gameRouteEdges.find((edge) => edge.id === "detour.alexandria-to-burmecia-mognet");
if (!burmeciaDisc4Return?.sourceIds.includes("ff9-kouryaku-disc4") ||
  !burmeciaDisc4Return.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery") ||
  !burmeciaDisc4Return.summary.includes("two Gold Needles, Ether, Phoenix Down, and Tent") ||
  !burmeciaDisc4Return.summary.includes("does not establish the availability of every old chest or release parity")) {
  errors.push("The Disc IV Burmecia return must link the documented pickup sweep and preserve its limited build scope.");
}
const burmeciaDisc4PickupObjective = objectivesById.get("disc-4.return-to-gaia.burmecia-pickup-sweep");
const burmeciaDisc4PickupSteps = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.flatMap((section) => section.steps)
  .filter((step) => step.objectiveIds?.includes("disc-4.return-to-gaia.burmecia-pickup-sweep")) ?? [];
const burmeciaDisc4PickupPathIds = [
  "item-path.disc-4.return-to-gaia.burmecia-cancer-stellazzio",
  "item-path.disc-4.return-to-gaia.burmecia-gold-needle-suburb-room",
  "item-path.disc-4.return-to-gaia.burmecia-gold-needle-stairwell",
  "item-path.disc-4.return-to-gaia.burmecia-ether-bedroom",
  "item-path.disc-4.return-to-gaia.burmecia-phoenix-down-uptown",
  "item-path.disc-4.return-to-gaia.burmecia-tent-uptown",
];
const burmeciaDisc4PickupPaths = burmeciaDisc4PickupPathIds.map((id) => itemAcquisitionPaths.find((path) => path.id === id));
const burmeciaDisc4RecoverySource = sources.find((source) => source.id === "megane-kangaroo-disc4-burmecia-recovery");
if (
  !burmeciaDisc4RecoverySource?.notes.includes("two Gold Needles")
  || !burmeciaDisc4RecoverySource.notes.includes("does not name the platform or build")
  || !burmeciaDisc4PickupObjective?.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery")
  || !burmeciaDisc4PickupObjective.chapterIds?.includes("disc-4.return-to-gaia")
  || burmeciaDisc4PickupSteps.length !== 1
  || !burmeciaDisc4PickupSteps[0].text.includes("Cancer, two Gold Needles, Ether, Phoenix Down, and Tent")
  || burmeciaDisc4PickupPaths.some((path) =>
    !path
    || path.chapterId !== "disc-4.return-to-gaia"
    || !path.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.burmecia-pickup-sweep")
    || !path.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery")
  )
  || !gameItems.some((item) => item.id === "game-item.gold-needle")
) {
  errors.push("The Disc IV Burmecia sweep must connect its six item-copy paths to the scoped source, item records, objective, and walkthrough reminder.");
}
const burmeciaMythrilSpear = itemAcquisitionPaths.find((path) => path.id === "item-path.burmecia.mythril-spear");
const burmeciaDisc2SpearStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-cleyra")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-cleyra-burmecia-mythril-spear");
if (!burmeciaMythrilSpear || burmeciaMythrilSpear.availability !== "limited-window" ||
  !burmeciaMythrilSpear.sourceIds.includes("ff9-kouryaku-burmecia") ||
  !burmeciaMythrilSpear.conditions?.includes("until the mechanism inside Cleyra's Trunk is activated") ||
  !burmeciaDisc2SpearStep?.objectiveIds?.includes("disc-1.burmecia.treasure-sweep") ||
  !burmeciaDisc2SpearStep.text.includes("left-hand armory")) {
  errors.push("The Burmecia Mythril Spear path must retain its Disc II recovery deadline and connect it to the walkthrough sweep.");
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
const deathguiseWarning = missablesById.get("missable.disc-4.memoria.deathguise-steals");
const deathguiseStealObjective = objectivesById.get("disc-4.memoria.deathguise-steals");
const blackBeltRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.black-belt");
const blackBeltSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.black-belt-synthesis");
const blackBeltStellazzioPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.black-belt-stellazzio-reward");
const blackBeltVillagePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.magdalene-forest.black-belt-upper-item-shop");
const blackBeltNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.black-belt-need");
const blackBeltEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.black-belt-end-inventory");
const twistHeadbandDisc4Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.treno.armor-shop.twist-headband");
const survivalVestDisc4Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.treno.armor-shop.survival-vest");
const duelClawsRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.duel-claws");
const duelClawsSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.duel-claws-synthesis");
const dragonClawsChocographPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.dragons-claws-chocograph-7");
const tigerFangsShopPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.tiger-fangs");
const hadesElixirDropPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-elixir-drop");
const necronElixirStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.the-final-battle.necron-elixir-common-steal");
const deathguiseWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-deathguise-steals");
if (!deathguiseWarning?.classification.includes("missable-opportunity") ||
  !deathguiseWarning.classification.includes("limited-quantity") ||
  !deathguiseWarning.classification.includes("recoverable-later") ||
  !deathguiseWarning.nextAvailability?.includes("Treno on Disc IV for 4,000 Gil") ||
  !deathguiseWarning.nextAvailability.includes("only if both materials remain") ||
  !deathguiseStealObjective ||
  !["gamefaqs-shops-71891", "gamefaqs-chocobo-hot-cold-71891", "rpgclassics-synthesis", "rpgclassics-addons"].every((sourceId) => deathguiseStealObjective.sourceIds.includes(sourceId)) ||
  !blackBeltRecipe || blackBeltRecipe.resultItemId !== "game-item.black-belt" ||
  blackBeltRecipe.cost.amount !== 4000 || blackBeltRecipe.shopId !== "treno.synthesis-shop.disc-3-4" ||
  !blackBeltRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.twist-headband") ||
  !blackBeltRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.survival-vest") ||
  !blackBeltSynthesisPath || blackBeltSynthesisPath.recipeId !== "synthesis-recipe.black-belt" ||
  blackBeltSynthesisPath.cost?.amount !== 4000 || !blackBeltSynthesisPath.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !blackBeltNeedTarget || blackBeltNeedTarget.targetQuantity !== 9 || blackBeltNeedTarget.basis !== "route-need" ||
  !blackBeltNeedTarget.sourceIds.includes("gamefaqs-items-71891") ||
  !blackBeltEndInventoryTarget || blackBeltEndInventoryTarget.targetQuantity !== 6 || blackBeltEndInventoryTarget.basis !== "end-inventory" ||
  !blackBeltEndInventoryTarget.sourceIds.includes("gamefaqs-items-71891") ||
  !twistHeadbandDisc4Path || twistHeadbandDisc4Path.cost?.amount !== 1200 ||
  !survivalVestDisc4Path || survivalVestDisc4Path.cost?.amount !== 2900 ||
  !blackBeltStellazzioPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !blackBeltVillagePath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !duelClawsRecipe || duelClawsRecipe.cost.amount !== 16000 ||
  !duelClawsRecipe.notes?.includes("Tiger Fangs") ||
  !duelClawsSynthesisPath?.conditions?.includes("only if both materials remain") ||
  !duelClawsSynthesisPath.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !dragonClawsChocographPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !tigerFangsShopPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !hadesElixirDropPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !necronElixirStealPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !deathguiseWalkthroughStep?.detail?.includes("Hades's drop table") ||
  !deathguiseWalkthroughStep.detail.includes("8,100 Gil total") ||
  !deathguiseWalkthroughStep.detail.includes("last listed shop is Daguerreo on Disc III")) {
  errors.push("Deathguise's one-time steals must distinguish item-type recovery, source-linked Disc IV Black Belt synthesis, and the conditional Duel Claws ingredient route.");
}
const necronStealWarning = missablesById.get("missable.disc-4.the-final-battle.necron-steals");
const necronStealObjective = objectivesById.get("disc-4.the-final-battle.necron-steals");
const necronStealPaths = ["common", "uncommon", "semi-rare", "rare"].map((slot) =>
  itemAcquisitionPaths.find((path) => path.id === `item-path.disc-4.the-final-battle.necron-elixir-${slot}-steal`),
);
const necronWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.the-final-battle")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "final-battle-necron-steals");
const necronStealSources = ["gamefaqs-the-final-battle-71891", "gamefaqs-final-battle-79143", "opatil-steal-list"];
if (!necronStealWarning || !necronStealObjective ||
  !necronStealSources.every((sourceId) => necronStealWarning.sourceIds.includes(sourceId) && necronStealObjective.sourceIds.includes(sourceId)) ||
  !necronStealWarning.sourceIds.includes("jegged-kuja-necron-final-showdown") ||
  necronStealPaths.some((path) => !path || path.itemId !== "game-item.elixir" || path.availability !== "one-time-encounter" ||
    !necronStealSources.every((sourceId) => path.sourceIds.includes(sourceId))) ||
  !necronStealPaths[0]?.notes?.includes("does not contradict the additional slots") ||
  necronStealPaths.slice(1).some((path) => !path?.conditions?.includes("does not address this slot")) ||
  !necronWalkthroughStep?.detail?.includes("list Elixir in all four tiers") ||
  !necronWalkthroughStep.detail.includes("Jegged lists only the Common slot")) {
  errors.push("Necron's one-fight Elixir warning and four acquisition paths must preserve the corroborated slots and Jegged's shorter Common-only listing.");
}
const hadesRunningShoesWarning = missablesById.get("missable.disc-4.memoria.hades-running-shoes");
const hadesStealObjective = objectivesById.get("disc-4.memoria.hades-steals");
const runningShoesRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.running-shoes");
const runningShoesSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.running-shoes-synthesis");
const runningShoesHadesStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-running-shoes-steal");
const emeraldCleyraPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.high-priest-emerald");
const emeraldNymphPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-iifa-tree.friendly-nymph-emerald");
const emeraldOeilvertPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.forgotten-continent.stiltzkin-emerald");
const runningShoesNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.running-shoes-need");
const hadesWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-hades");
if (!hadesRunningShoesWarning?.classification.includes("missable-opportunity") ||
  !hadesRunningShoesWarning.classification.includes("recoverable-later") ||
  !hadesRunningShoesWarning.classification.includes("conditional") ||
  !hadesRunningShoesWarning.nextAvailability?.includes("Black Cat at Black Mage Village") ||
  !hadesRunningShoesWarning.nextAvailability.includes("12,000 Gil") ||
  !hadesRunningShoesWarning.recovery?.includes("Synthesis does not restore Hades's exact steal copy") ||
  !hadesStealObjective ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "jegged-synthesis", "elitegrindlab-synthesis"].every((sourceId) => hadesStealObjective.sourceIds.includes(sourceId)) ||
  !runningShoesRecipe || runningShoesRecipe.resultItemId !== "game-item.running-shoes" ||
  runningShoesRecipe.cost.amount !== 12000 || runningShoesRecipe.shopId !== "black-mage-village.synthesis-shop.disc-4" ||
  !runningShoesRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.battle-boots") ||
  !runningShoesRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.emerald") ||
  !runningShoesSynthesisPath || runningShoesSynthesisPath.recipeId !== "synthesis-recipe.running-shoes" ||
  runningShoesSynthesisPath.cost?.amount !== 12000 ||
  !runningShoesSynthesisPath.conditions?.includes("after Hades during Final Preparations") ||
  !runningShoesHadesStealPath?.conditions?.includes("one-fight encounter copy") ||
  !emeraldCleyraPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.hades-steals") ||
  !emeraldNymphPath?.conditions?.includes("during Final Preparations") ||
  !emeraldOeilvertPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.hades-steals") ||
  !runningShoesNeedTarget || runningShoesNeedTarget.targetQuantity !== 4 || runningShoesNeedTarget.basis !== "route-need" ||
  runningShoesNeedTarget.interpretation.includes("end-inventory #0") === false ||
  sourceInventoryTargets.some((target) => target.id === "item-target.disc-4.final-preparations.running-shoes-end-inventory") ||
  !hadesRunningShoesWarning.note?.includes("end-inventory #0") ||
  !hadesWalkthroughStep?.detail?.includes("its Items and Shops tables list a later Disc IV Black Mage Village recipe") ||
  !hadesWalkthroughStep.detail.includes("12,000 Gil")) {
  errors.push("Hades's Running Shoes warning must distinguish the one-time steal from the conditional Disc IV synthesis recovery, source-specific targets, and Emerald prerequisites.");
}
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
const atlaDisc2ShopPrices = new Map<string, number>([
  ["game-item.needle-fork", 3100],
  ["game-item.glass-armlet", 250],
  ["game-item.mythril-gloves", 980],
  ["game-item.steepled-hat", 260],
  ["game-item.headgear", 330],
  ["game-item.magus-hat", 400],
  ["game-item.barbut", 600],
  ["game-item.bronze-vest", 670],
  ["game-item.linen-cuirass", 800],
  ["game-item.potion", 50],
  ["game-item.phoenix-down", 150],
  ["game-item.echo-screen", 50],
  ["game-item.soft", 100],
  ["game-item.antidote", 50],
  ["game-item.eye-drops", 50],
  ["game-item.tent", 800],
]);
const atlaDisc2Paths = itemAcquisitionPaths.filter((path) =>
  path.chapterId === "disc-2.journey-to-cleyra" && path.shopId === "burmecia.atla-mogshop",
);
const atlaDisc2ItemIds = new Set(atlaDisc2Paths.map((path) => path.itemId));
if (atlaDisc2Paths.length !== atlaDisc2ShopPrices.size || atlaDisc2ItemIds.size !== atlaDisc2ShopPrices.size) {
  errors.push(`Atla's Disc II Mogshop must have exactly ${atlaDisc2ShopPrices.size} distinct priced product paths; found ${atlaDisc2Paths.length} paths for ${atlaDisc2ItemIds.size} products.`);
}
for (const [itemId, price] of atlaDisc2ShopPrices) {
  const path = atlaDisc2Paths.find((candidate) => candidate.itemId === itemId);
  if (!path) {
    errors.push(`Atla's Disc II Mogshop is missing the sourced stock path for ${itemId}.`);
    continue;
  }
  if (path.method !== "mogshop" || path.quantity !== 1 || path.cost?.currency !== "gil" || path.cost.amount !== price) {
    errors.push(`Atla's Disc II Mogshop path for ${itemId} must be one Mogshop purchase priced at ${price} Gil.`);
  }
  for (const sourceId of ["gamefaqs-shops-71891", "cavesofnarshe-ff9-disc-2-map"]) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Atla's Disc II Mogshop path for ${itemId} must cite ${sourceId}.`);
  }
  if (itemId === "game-item.mythril-gloves" && !path.sourceIds.includes("gamefaqs-equipment-33383")) {
    errors.push("Atla's Disc II Mythril Gloves path must cite the independent GameFAQs equipment table supporting the 980-Gil price.");
  }
  if (itemId === "game-item.mythril-gloves" &&
    (!path.conditions?.includes("720 Gil") || !path.conditions.includes("likely table typo"))) {
    errors.push("Atla's Disc II Mythril Gloves path must retain the sourced 720-versus-980-Gil discrepancy note.");
  }
}
const atlaDisc2Return = gameRouteEdges.find((edge) => edge.id === "detour.journey-to-cleyra-kupo-nut-return");
if (!atlaDisc2Return || atlaDisc2Return.relationship !== "optional-return" ||
  atlaDisc2Return.fromChapterId !== "disc-2.journey-to-cleyra" || atlaDisc2Return.toChapterId !== "disc-1.journey-to-burmecia") {
  errors.push("Atla's Disc II Mogshop must remain on the sourced optional Burmecia return before Cleyra.");
} else {
  for (const sourceId of ["gamefaqs-journey-to-cleyra-71891", "flactem-disc-2-cleyra"]) {
    if (!atlaDisc2Return.sourceIds.includes(sourceId)) errors.push(`Atla's Disc II return edge must cite ${sourceId}.`);
  }
  if (!atlaDisc2Return.summary.includes("does not establish access to every Disc I chest room")) {
    errors.push("Atla's Disc II return must preserve the Burmecia pickup-room access caveat.");
  }
}
const atlaDisc2Rejoin = gameRouteEdges.find((edge) => edge.id === "detour.journey-to-cleyra-rejoin");
if (!atlaDisc2Rejoin || atlaDisc2Rejoin.relationship !== "rejoin" ||
  atlaDisc2Rejoin.fromChapterId !== "disc-1.journey-to-burmecia" || atlaDisc2Rejoin.toChapterId !== "disc-2.journey-to-cleyra") {
  errors.push("The optional Disc II Atla return must rejoin the Cleyra route after Gizamaluke's Grotto.");
}
const atlaDisc2Instruction = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-cleyra")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-cleyra-atla-mogshop-return");
if (!atlaDisc2Instruction || !atlaDisc2Instruction.text.includes("Atla's Mogshop on Disc II") ||
  !atlaDisc2Instruction.detail?.includes("not the accessibility of every Disc I chest room")) {
  errors.push("The optional Atla return needs a walkthrough instruction that preserves its Disc II access scope.");
}
console.log(`Atla's Disc II Mogshop: ${atlaDisc2ItemIds.size}/${atlaDisc2ShopPrices.size} sourced stock paths on the pre-Cleyra return.`);
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
const cleyraBossSteals = [
  { pathId: "item-path.disc-2.cleyra.antlion-annoyntment-steal", itemId: "game-item.annoyntment", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.mythril-vest-antlion-steal", itemId: "game-item.mythril-vest", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.antlion-gold-helm-steal", itemId: "game-item.gold-helm", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-phoenix-down-steal", itemId: "game-item.phoenix-down", objectiveId: "disc-2.cleyra.beatrix-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-thunder-gloves-steal", itemId: "game-item.thunder-gloves", objectiveId: "disc-2.cleyra.beatrix-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-ice-brand-steal", itemId: "game-item.ice-brand", objectiveId: "disc-2.cleyra.beatrix-steals" },
];
for (const expected of cleyraBossSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!path) {
    errors.push(`Cleyra boss-steal coverage is missing ${expected.pathId}.`);
    continue;
  }
  if (path.itemId !== expected.itemId || path.chapterId !== "disc-2.cleyra" || path.method !== "steal" ||
    path.quantity !== 1 || path.availability !== "one-time-encounter" || !path.walkthroughObjectiveIds?.includes(expected.objectiveId)) {
    errors.push(`Cleyra boss-steal path ${expected.pathId} must match its item, one-time encounter, and warning objective.`);
  }
  for (const sourceId of ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra"]) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Cleyra boss-steal path ${expected.pathId} is missing source ${sourceId}.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === expected.itemId &&
    guideAreas.findIndex((area) => area.id === candidate.chapterId) > cleyraChapterIndex)) {
    errors.push(`Cleyra boss-steal item ${expected.itemId} needs a later item-type recovery path.`);
  }
}
const antlionAnnoyntmentDrop = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.antlion-annoyntment-drop");
if (!antlionAnnoyntmentDrop || antlionAnnoyntmentDrop.itemId !== "game-item.annoyntment" ||
  antlionAnnoyntmentDrop.chapterId !== "disc-2.cleyra" || antlionAnnoyntmentDrop.method !== "drop" ||
  antlionAnnoyntmentDrop.quantity !== 1 || antlionAnnoyntmentDrop.availability !== "one-time-encounter" ||
  !antlionAnnoyntmentDrop.walkthroughObjectiveIds?.includes("disc-2.cleyra.antlion-steals") ||
  !antlionAnnoyntmentDrop.sourceIds.includes("gamefaqs-cleyra-71891") ||
  !antlionAnnoyntmentDrop.sourceIds.includes("elitegrindlab-cleyra")) {
  errors.push("Antlion's separate guaranteed Annoyntment drop needs a sourced one-time drop path linked to the Cleyra boss checklist.");
}
const cleyraAnnoyntmentRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.cleyra-recovery.annoyntment");
if (!cleyraAnnoyntmentRecovery || cleyraAnnoyntmentRecovery.itemId !== "game-item.annoyntment" || cleyraAnnoyntmentRecovery.cost?.amount !== 150) {
  errors.push("Cleyra Annoyntment recovery needs the priced 150-Gil Lindblum Disc II item-shop path.");
}
const cleyraPhoenixDownRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.cleyra-recovery.phoenix-down");
if (!cleyraPhoenixDownRecovery || cleyraPhoenixDownRecovery.itemId !== "game-item.phoenix-down" || cleyraPhoenixDownRecovery.cost?.amount !== 150) {
  errors.push("Cleyra Phoenix Down recovery needs the priced 150-Gil Lindblum Disc II item-shop path.");
}
const cleyraGoldHelmRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.cleyra-recovery.gold-helm-treno-shop");
if (!cleyraGoldHelmRecovery || cleyraGoldHelmRecovery.itemId !== "game-item.gold-helm" || cleyraGoldHelmRecovery.chapterId !== "disc-3.card-tournament" || cleyraGoldHelmRecovery.cost?.amount !== 1800) {
  errors.push("Cleyra Gold Helm recovery needs the Disc III Treno shop path priced at 1,800 Gil.");
}
const cleyraTreasureWarning = missablesById.get("missable.disc-2.cleyra.treasures");
const cleyraPickupExpectations = [
  ["trunk-phoenix-down-chest", "game-item.phoenix-down", "chest"],
  ["trunk-ether-chest", "game-item.ether", "chest"],
  ["trunk-needle-fork-chest", "game-item.needle-fork", "chest"],
  ["trunk-tent-chest", "game-item.tent", "chest"],
  ["trunk-remedy-chest", "game-item.remedy", "chest"],
  ["trunk-mythril-gloves-chest", "game-item.mythril-gloves", "chest"],
  ["trunk-potion-chest", "game-item.potion", "chest"],
  ["trunk-elixir-chest", "game-item.elixir", "chest"],
  ["trunk-hipotion-whirlpool-chest", "game-item.hi-potion", "chest"],
  ["trunk-ladder-gysahl-greens-chest", "game-item.gysahl-greens", "chest"],
  ["settlement-water-mill-thunder-gloves", "game-item.thunder-gloves", "hidden-pickup"],
  ["settlement-southeast-ore", "game-item.ore", "hidden-pickup"],
  ["settlement-inn-echo-screen", "game-item.echo-screen", "fixed-pickup"],
  ["settlement-inn-ether", "game-item.ether", "fixed-pickup"],
  ["settlement-inn-stairway-remedy", "game-item.remedy", "hidden-pickup"],
  ["settlement-cathedral-echo-screen", "game-item.echo-screen", "hidden-pickup"],
  ["post-antlion-harp-room-ether", "game-item.ether", "hidden-pickup"],
  ["post-antlion-harp-room-ore", "game-item.ore", "hidden-pickup"],
] as const;
if (
  !cleyraTreasureWarning?.classification.includes("recoverable-later") ||
  !cleyraTreasureWarning.consequence.includes("forced return after Antlion") ||
  !cleyraTreasureWarning.consequence.includes("before crossing the bridge") ||
  !cleyraTreasureWarning.note?.includes("340 points") || !cleyraTreasureWarning.note?.includes("about 75%") ||
  !["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"].every((sourceId) => cleyraTreasureWarning.sourceIds.includes(sourceId)) ||
  !cleyraTreasureWarning.nextAvailability.includes("every modeled Cleyra pickup") ||
  cleyraPickupExpectations.some(([slug, itemId, method]) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-2.cleyra.${slug}`);
    const hasOtherSource = itemAcquisitionPaths.some((candidate) =>
      candidate.itemId === itemId && candidate.chapterId !== "disc-2.cleyra" &&
      (guideAreas.findIndex((area) => area.id === candidate.chapterId) > cleyraChapterIndex || candidate.availability === "repeatable"),
    );
    return !path || path.itemId !== itemId || path.chapterId !== "disc-2.cleyra" || path.method !== method ||
      path.quantity !== 1 || path.availability !== "single-use" ||
      !path.walkthroughObjectiveIds?.includes("disc-2.cleyra.treasure-sweep") ||
      !["gamefaqs-cleyra-71891", "jegged-cleyra"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
      !gameItemIds.has(itemId) || !hasOtherSource;
  })
) {
  errors.push("Cleyra's fixed Trunk/settlement pickup catalog must cover all audited item locations, shared sweep links, source citations, alternative item-type sources, the forced-return cutoff, and the documented Treasure Hunter scoring formula.");
}
const cleyraEvacuationItemRewards = [
  ["evacuation-phoenix-down-reward", "game-item.phoenix-down"],
  ["evacuation-remedy-reward", "game-item.remedy"],
  ["evacuation-elixir-reward", "game-item.elixir"],
  ["evacuation-ether-reward", "game-item.ether"],
  ["evacuation-cathedral-phoenix-pinion", "game-item.phoenix-pinion"],
] as const;
if (cleyraEvacuationItemRewards.some(([slug, itemId]) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-2.cleyra.${slug}`);
  return !path || path.itemId !== itemId || path.chapterId !== "disc-2.cleyra" ||
    path.method !== "quest-reward" || path.availability !== "conditional" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.cleyra.out-of-harms-way") ||
    !path.walkthroughObjectiveIds?.includes("disc-2.cleyra.treasure-sweep") ||
    !["gamefaqs-cleyra-71891", "jegged-cleyra"].every((sourceId) => path.sourceIds.includes(sourceId));
})) {
  errors.push("Cleyra's evacuation must have five separate source-linked conditional item-reward paths connected to the evacuation and treasure objectives.");
}
const cleyraStiltzkinProducts = [
  ["stiltzkin-2-hi-potion", "game-item.hi-potion"],
  ["stiltzkin-2-ether", "game-item.ether"],
  ["stiltzkin-2-phoenix-pinion", "game-item.phoenix-pinion"],
] as const;
if (cleyraStiltzkinProducts.some(([slug, itemId]) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-2.cleyra.${slug}`);
  return !path || path.itemId !== itemId || path.chapterId !== "disc-2.cleyra" ||
    path.method !== "moogle-shop" || path.availability !== "limited-window" ||
    path.cost?.currency !== "gil" || path.cost.amount !== 444 || path.cost.bundleId !== "cleyra-stiltzkin-second-bundle" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.cleyra.stiltzkin-2");
})) {
  errors.push("Cleyra's Stiltzkin #2 bundle must catalog its Hi-Potion, Ether, and Phoenix Pinion paths at a shared 444-Gil price and checkpoint.");
}
const hilgigarsChapterIndex = guideAreas.findIndex((area) => area.id === "disc-2.conde-petie-mountain-path");
const hilgigarsSteals = [
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-phoenix-down-steal", itemId: "game-item.phoenix-down" },
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-mythril-fork-steal", itemId: "game-item.mythril-fork" },
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal", itemId: "game-item.fairy-flute" },
];
for (const expected of hilgigarsSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!path) {
    errors.push(`Hilgigars steal coverage is missing ${expected.pathId}.`);
    continue;
  }
  if (path.itemId !== expected.itemId || path.chapterId !== "disc-2.conde-petie-mountain-path" || path.method !== "steal" ||
    path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.conde-petie-mountain-path.hilgigars-steals")) {
    errors.push(`Hilgigars steal path ${expected.pathId} must match its item, one-time encounter, and warning objective.`);
  }
  for (const sourceId of ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path", "gamefaqs-items-71891"]) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Hilgigars steal path ${expected.pathId} is missing source ${sourceId}.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === expected.itemId &&
    guideAreas.findIndex((area) => area.id === candidate.chapterId) > hilgigarsChapterIndex)) {
    errors.push(`Hilgigars steal item ${expected.itemId} needs a later item-type recovery path.`);
  }
}
const hilgigarsFairyFlute = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal");
if (!hilgigarsFairyFlute?.sourceIds.includes("cavesofnarshe-ff9-flutes")) {
  errors.push("Hilgigars Fairy Flute steal needs the independent Caves of Narshe flute reference.");
}
for (const expected of [
  { id: "item-path.disc-3-stock.mimoza-oeilvert.fairy-flute", shopId: "mimoza-oeilvert", chapterId: "disc-3.forgotten-continent" },
  { id: "item-path.disc-3-stock.mojito-desert-palace.fairy-flute", shopId: "mojito-desert-palace", chapterId: "disc-3.desert-palace" },
]) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.id);
  if (!path || path.itemId !== "game-item.fairy-flute" || path.chapterId !== expected.chapterId || path.shopId !== expected.shopId ||
    path.method !== "mogshop" || path.cost?.currency !== "gil" || path.cost.amount !== 4500 || path.availability !== "limited-window" ||
    !path.sourceIds.includes("gamefaqs-shops-71891") || !path.sourceIds.includes("cavesofnarshe-ff9-flutes")) {
    errors.push(`Fairy Flute recovery path ${expected.id} must be the sourced 4,500-Gil Disc III Mogshop listing.`);
  }
}
const hilgigarsWarning = missablesById.get("missable.disc-2.conde-petie-mountain-path.hilgigars-steals");
if (!hilgigarsWarning || /still need|still being mapped|under review/i.test(`${hilgigarsWarning.consequence} ${hilgigarsWarning.nextAvailability} ${hilgigarsWarning.recovery}`) ||
  !hilgigarsWarning.recovery.includes("Phoenix Down") || !hilgigarsWarning.recovery.includes("Fairy Flute")) {
  errors.push("Hilgigars' warning must distinguish its lost encounter copies from the mapped Phoenix Down and Fairy Flute recovery paths.");
}
const recoverableDiscTwoBossStealWarnings = [
  {
    missableId: "missable.disc-2.journey-to-cleyra.ralvurahva-steals",
    objectiveId: "disc-2.journey-to-cleyra.ralvurahva-steals",
    items: [
      { itemId: "game-item.bone-wrist", pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-bone-wrist-steal", name: "Bone Wrist" },
      { itemId: "game-item.mythril-fork", pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-mythril-fork-steal", name: "Mythril Fork" },
    ],
  },
  {
    missableId: "missable.disc-2.cleyra.antlion-steals",
    objectiveId: "disc-2.cleyra.antlion-steals",
    items: [
      { itemId: "game-item.annoyntment", pathId: "item-path.disc-2.cleyra.antlion-annoyntment-steal", name: "Annoyntment" },
      { itemId: "game-item.mythril-vest", pathId: "item-path.disc-2.cleyra.mythril-vest-antlion-steal", name: "Mythril Vest" },
      { itemId: "game-item.gold-helm", pathId: "item-path.disc-2.cleyra.antlion-gold-helm-steal", name: "Gold Helm" },
    ],
  },
  {
    missableId: "missable.disc-2.cleyra.beatrix-steals",
    objectiveId: "disc-2.cleyra.beatrix-steals",
    items: [
      { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.cleyra.beatrix-phoenix-down-steal", name: "Phoenix Down" },
      { itemId: "game-item.thunder-gloves", pathId: "item-path.disc-2.cleyra.beatrix-thunder-gloves-steal", name: "Thunder Gloves" },
      { itemId: "game-item.ice-brand", pathId: "item-path.disc-2.cleyra.beatrix-ice-brand-steal", name: "Ice Brand" },
    ],
  },
  {
    missableId: "missable.disc-2.return-to-alexandria.zorn-thorn-steals",
    objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals",
    items: [
      { itemId: "game-item.partisan", pathId: "item-path.disc-2.return-to-alexandria.zorn-partisan-steal", name: "Partisan" },
      { itemId: "game-item.stardust-rod", pathId: "item-path.disc-2.return-to-alexandria.zorn-stardust-rod-steal", name: "Stardust Rod" },
      { itemId: "game-item.mythril-armor", pathId: "item-path.disc-2.return-to-alexandria.thorn-mythril-armor", name: "Mythril Armor" },
      { itemId: "game-item.mythril-armlet", pathId: "item-path.disc-2.return-to-alexandria.thorn-mythril-armlet-steal", name: "Mythril Armlet" },
    ],
  },
  {
    missableId: "missable.disc-2.return-to-alexandria.beatrix-steals",
    objectiveId: "disc-2.return-to-alexandria.beatrix-steals",
    items: [
      { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.return-to-alexandria.beatrix-phoenix-down-steal", name: "Phoenix Down" },
      { itemId: "game-item.ice-brand", pathId: "item-path.disc-2.return-to-alexandria.beatrix-ice-brand-steal", name: "Ice Brand" },
      { itemId: "game-item.survival-vest", pathId: "item-path.disc-2.return-to-alexandria.survival-vest-beatrix-steal", name: "Survival Vest" },
    ],
  },
  {
    missableId: "missable.disc-2.return-to-alexandria.ralvuimago-steals",
    objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals",
    items: [
      { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.return-to-alexandria.ralvuimago-phoenix-down-steal", name: "Phoenix Down" },
      { itemId: "game-item.adaman-vest", pathId: "item-path.disc-2.return-to-alexandria.ralvuimago-adaman-vest-steal", name: "Adaman Vest" },
      { itemId: "game-item.oak-staff", pathId: "item-path.disc-2.return-to-alexandria.ralvuimago-oak-staff-steal", name: "Oak Staff" },
    ],
  },
  {
    missableId: "missable.disc-2.conde-petie-mountain-path.hilgigars-steals",
    objectiveId: "disc-2.conde-petie-mountain-path.hilgigars-steals",
    items: [
      { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-phoenix-down-steal", name: "Phoenix Down" },
      { itemId: "game-item.mythril-fork", pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-mythril-fork-steal", name: "Mythril Fork" },
      { itemId: "game-item.fairy-flute", pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal", name: "Fairy Flute" },
    ],
  },
];
for (const expected of recoverableDiscTwoBossStealWarnings) {
  const warning = missablesById.get(expected.missableId);
  if (!warning || !warning.classification.includes("recoverable-later") || !warning.nextAvailability || !warning.recovery) {
    errors.push(`${expected.missableId} must be classified recoverable later and include both availability and recovery guidance.`);
    continue;
  }
  const encounterSteals = itemAcquisitionPaths.filter((path) => path.walkthroughObjectiveIds?.includes(expected.objectiveId) && path.method === "steal");
  if (encounterSteals.length !== expected.items.length) {
    errors.push(`${expected.missableId} must model exactly ${expected.items.length} one-time steal paths; found ${encounterSteals.length}.`);
  }
  const chapterIndex = guideAreas.findIndex((area) => area.id === warning.warningChapterIds[0]);
  for (const item of expected.items) {
    const stealPath = itemAcquisitionPaths.find((path) => path.id === item.pathId);
    if (!stealPath || stealPath.itemId !== item.itemId || stealPath.method !== "steal" || stealPath.availability !== "one-time-encounter" ||
      !stealPath.walkthroughObjectiveIds?.includes(expected.objectiveId)) {
      errors.push(`${expected.missableId} is missing the linked one-time ${item.name} steal path.`);
    }
    if (!itemAcquisitionPaths.some((path) => path.itemId === item.itemId && guideAreas.findIndex((area) => area.id === path.chapterId) > chapterIndex)) {
      errors.push(`${expected.missableId} needs a later item-type source for ${item.name}.`);
    }
    if (!warning.nextAvailability.toLowerCase().includes(item.name.toLowerCase()) || !warning.recovery.toLowerCase().includes(item.name.toLowerCase())) {
      errors.push(`${expected.missableId} must name ${item.name} in both its next-availability and recovery guidance.`);
    }
  }
  if (!gameRouteCutoffs.some((cutoff) => cutoff.missableIds.includes(expected.missableId))) {
    errors.push(`${expected.missableId} must remain linked to a modeled route cutoff.`);
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
const iceCavernBossEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.ice-cavern.black-waltz-1-sealion");
if (!iceCavernBossEncounter || iceCavernBossEncounter.kind !== "boss" ||
  !iceCavernBossEncounter.formation.some((entry) => entry.enemyId === "enemy.black-waltz-1") ||
  !iceCavernBossEncounter.formation.some((entry) => entry.enemyId === "enemy.sealion") ||
  !iceCavernBossEncounter.objectiveIds.includes("disc-1.ice-cavern.boss-steals") ||
  !iceCavernBossEncounter.missableIds.includes("missable.disc-1.ice-cavern.boss-steals") ||
  !iceCavernBossEncounter.cutoffIds.includes("cutoff.ice-cavern.boss-steals")) {
  errors.push("The Ice Cavern boss encounter must group Black Waltz 1 and Sealion and link the one-time steal objective, warning, and cutoff.");
}
const iceCavernBossSteals = [
  { enemyId: "enemy.black-waltz-1", itemId: "game-item.remedy" },
  { enemyId: "enemy.black-waltz-1", itemId: "game-item.silk-shirt" },
  { enemyId: "enemy.sealion", itemId: "game-item.ether" },
  { enemyId: "enemy.sealion", itemId: "game-item.mythril-dagger" },
];
for (const expected of iceCavernBossSteals) {
  const enemy = enemyRecords.find((candidate) => candidate.id === expected.enemyId);
  if (!enemy?.steals.some((slot) => slot.itemId === expected.itemId) ||
    !enemy.routeObjectiveIds.includes("disc-1.ice-cavern.boss-steals") ||
    !enemy.missableIds.includes("missable.disc-1.ice-cavern.boss-steals")) {
    errors.push(`Ice Cavern boss dossier ${expected.enemyId} must connect its ${expected.itemId} steal to the shared one-time warning.`);
  }
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === expected.itemId && candidate.chapterId === "disc-1.ice-cavern" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-1.ice-cavern.boss-steals"));
  if (!path || path.availability !== "one-time-encounter") {
    errors.push(`Ice Cavern boss steal ${expected.itemId} must have a one-time item acquisition path linked to the steal objective.`);
  }
}
const iceCavernStealsWarning = missablesById.get("missable.disc-1.ice-cavern.boss-steals");
if (!iceCavernStealsWarning?.classification.includes("recoverable-later") || !iceCavernStealsWarning.recovery.includes("Lindblum")) {
  errors.push("Ice Cavern's boss-steal warning must distinguish the lost encounter copies from later item recovery.");
}
const mythrilDaggerLindblumPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.mythril-dagger-shop");
if (!mythrilDaggerLindblumPath || mythrilDaggerLindblumPath.itemId !== "game-item.mythril-dagger" || mythrilDaggerLindblumPath.cost?.currency !== "gil" || mythrilDaggerLindblumPath.cost.amount !== 950) {
  errors.push("Mythril Dagger's early Lindblum recovery path must remain cataloged at 950 Gil.");
}
const daliFirstVisitObjectiveId = "disc-1.village-of-dali.first-visit-pickups";
const daliFirstVisitWarning = missablesById.get("missable.disc-1.village-of-dali.first-visit-pickups");
const daliFirstVisitChestPaths = [
  ["item-path.disc-1.village-of-dali.inn-potion-chest", "game-item.potion"],
  ["item-path.disc-1.village-of-dali.inn-antidote-chest", "game-item.antidote"],
];
const daliFirstVisitLaterPaths = [
  ["item-path.disc-2.cleyra.potion-shop", "game-item.potion"],
  ["item-path.disc-2.cleyra.antidote-shop", "game-item.antidote"],
];
if (
  !daliFirstVisitWarning?.classification.includes("recoverable-later") ||
  !daliFirstVisitWarning.action.includes("120 Gil") ||
  !daliFirstVisitWarning.action.includes("lower-right chest") ||
  !daliFirstVisitWarning.recovery.includes("Cleyra's later item shop") ||
  !daliFirstVisitWarning.recovery.includes("50 Gil each") ||
  !daliFirstVisitWarning.consequence.includes("Rank S requires 340 points") ||
  !["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"].every((sourceId) => daliFirstVisitWarning.sourceIds.includes(sourceId)) ||
  !daliFirstVisitWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  !daliFirstVisitWarning.sourceIds.includes("gamefaqs-cleyra-71891") ||
  daliFirstVisitChestPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) =>
    path.id === pathId && path.itemId === itemId && path.chapterId === "disc-1.village-of-dali" &&
    path.method === "chest" && path.quantity === 1 && path.availability === "single-use" &&
    path.walkthroughObjectiveIds?.includes(daliFirstVisitObjectiveId) &&
    ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "elitegrindlab-dali"].every((sourceId) => path.sourceIds.includes(sourceId))) ||
    !gameItems.some((item) => item.id === itemId && item.category === "consumable" && item.sourceIds.includes("gamefaqs-dali-71891"))) ||
  daliFirstVisitLaterPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) =>
    path.id === pathId && path.itemId === itemId && path.chapterId === "disc-2.cleyra" &&
    path.method === "shop" && path.cost?.currency === "gil" && path.cost.amount === 50))
) {
  errors.push("Dali's one-time inn pickups must link to the first-visit objective, later 50-Gil Cleyra stock, and the sourced 340-point Treasure Hunter threshold.");
}
const daliItemShopProducts = [
  { pathId: "item-path.disc-1.village-of-dali.potion-shop", itemId: "game-item.potion", price: 50 },
  { pathId: "item-path.disc-1.village-of-dali.phoenix-down-shop", itemId: "game-item.phoenix-down", price: 150 },
  { pathId: "item-path.disc-1.village-of-dali.antidote-shop", itemId: "game-item.antidote", price: 50 },
  { pathId: "item-path.disc-1.village-of-dali.eye-drops-shop", itemId: "game-item.eye-drops", price: 50 },
  { pathId: "item-path.disc-1.village-of-dali.tent-shop", itemId: "game-item.tent", price: 800 },
];
if (daliItemShopProducts.some(({ pathId, itemId, price }) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  const item = gameItems.find((candidate) => candidate.id === itemId);
  return !path || path.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" ||
    path.method !== "shop" || path.availability !== "repeatable" || path.quantity !== 1 ||
    path.shopId !== "dali.item-shop" || !path.shopName?.includes("Tavern Medicine Shop") ||
    path.cost?.currency !== "gil" || path.cost.amount !== price ||
    !["gamefaqs-shops-71891", "rpgclassics-shops", "gamefaqs-dali-71891"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
    !item?.sourceIds.includes("rpgclassics-shops");
})) {
  errors.push("Dali's five first-visit item-shop products must retain the cross-checked stock, prices, item links, and repeatable shop paths.");
}
const daliUndergroundObjectiveId = "disc-1.village-of-dali.underground-treasure-sweep";
const daliUndergroundWarning = missablesById.get("missable.disc-1.village-of-dali.underground-treasures");
const daliUndergroundExpectedPaths = [
  { pathId: "item-path.disc-1.village-of-dali.underground-hut-potion-chest", itemId: "game-item.potion", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-eye-drops-chest", itemId: "game-item.eye-drops", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-crates-ether-chest", itemId: "game-item.ether", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-crank-potion-chest", itemId: "game-item.potion", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-production-phoenix-down-chest", itemId: "game-item.phoenix-down", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-production-potion-chest", itemId: "game-item.potion", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.iron-helm-underground-chest", itemId: "game-item.iron-helm", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.leather-wrist-underground-chest", itemId: "game-item.leather-wrist", method: "chest" },
  { pathId: "item-path.disc-1.village-of-dali.underground-phoenix-pinion", itemId: "game-item.phoenix-pinion", method: "hidden-pickup" },
];
const daliUndergroundRecoveryPaths = [
  ["item-path.disc-2.cleyra.potion-shop", "game-item.potion"],
  ["item-path.disc-2.cleyra.eye-drops-shop", "game-item.eye-drops"],
  ["item-path.disc-2.journey-to-outer-continent.stiltzkin-3-ether", "game-item.ether"],
  ["item-path.disc-1.lindblum.iron-helm-shop", "game-item.iron-helm"],
  ["item-path.disc-2.journey-to-treno.summit-station-iron-helm-shop", "game-item.iron-helm"],
  ["item-path.disc-2.treno.leather-wrist-shop", "game-item.leather-wrist"],
  ["item-path.disc-2.cleyra.phoenix-down-shop", "game-item.phoenix-down"],
  ["item-path.disc-2.cleyra.first-staircase-phoenix-pinion", "game-item.phoenix-pinion"],
];
if (
  !daliUndergroundWarning?.classification.includes("recoverable-later") ||
  !daliUndergroundWarning.consequence.includes("nine items and 156/95 Gil") ||
  !daliUndergroundWarning.action.includes("Collect all 11 listed pickups") ||
  !daliUndergroundWarning.nextAvailability.includes("Cleyra shops for Potion, Eye Drops, and Phoenix Down") ||
  !daliUndergroundWarning.nextAvailability.includes("Stiltzkin #3 at Fossil Roo for Ether") ||
  !daliUndergroundWarning.nextAvailability.includes("Lindblum and Summit Station shops for Iron Helm") ||
  !daliUndergroundWarning.nextAvailability.includes("Treno for Leather Wrist") ||
  !daliUndergroundWarning.nextAvailability.includes("not the Dali copies") ||
  !daliUndergroundWarning.recovery.includes("Rank S needs 340 points") ||
  !daliUndergroundWarning.note?.includes("Stiltzkin's bundle scores zero") ||
  !["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"].every((sourceId) => daliUndergroundWarning.sourceIds.includes(sourceId)) ||
  !daliUndergroundWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  !daliUndergroundWarning.sourceIds.includes("gamefaqs-stiltzkin-shopping-71891") ||
  daliUndergroundExpectedPaths.some(({ pathId, itemId, method }) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
    const item = gameItems.find((candidate) => candidate.id === itemId);
    return !path || path.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" || path.method !== method ||
      path.quantity !== 1 || path.availability !== "single-use" ||
      !path.walkthroughObjectiveIds?.includes(daliUndergroundObjectiveId) ||
      !["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "elitegrindlab-dali"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
      !item?.sourceIds.includes("gamefaqs-dali-71891");
  }) ||
  daliUndergroundRecoveryPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === itemId))
) {
  errors.push("Dali Underground must model all nine one-time item pickups, their shared sweep objective, later item-type recovery routes, and the sourced Treasure Hunter scoring categories.");
}
const evilForestTreasureObjectiveId = "disc-1.evil-forest.treasure-sweep";
const evilForestTreasureWarning = missablesById.get("missable.disc-1.evil-forest.treasures");
const evilForestPickupPaths = [
  { pathId: "item-path.disc-1.evil-forest.crash-site-phoenix-down", itemId: "game-item.phoenix-down", method: "fixed-pickup" },
  { pathId: "item-path.disc-1.evil-forest.prima-vista-bridge-bronze-gloves", itemId: "game-item.bronze-gloves", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.vivis-cabin-ether", itemId: "game-item.ether", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.aft-cabin-ether", itemId: "game-item.ether", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.steiner-room-ether", itemId: "game-item.ether", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.prima-vista-wrist-chest", itemId: "game-item.wrist", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.rubber-helm-cargo-room-chest", itemId: "game-item.rubber-helm", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.south-room-leather-hat", itemId: "game-item.leather-hat", method: "chest" },
  { pathId: "item-path.disc-1.evil-forest.baku-room-potion", itemId: "game-item.potion", method: "chest" },
];
const evilForestLaterRecoveryPaths = [
  ["item-path.disc-1.village-of-dali.bronze-gloves-shop", "game-item.bronze-gloves"],
  ["item-path.disc-2.journey-to-outer-continent.stiltzkin-3-ether", "game-item.ether"],
  ["item-path.disc-1.village-of-dali.leather-hat-shop", "game-item.leather-hat"],
  ["item-path.disc-1.village-of-dali.potion-shop", "game-item.potion"],
  ["item-path.disc-1.village-of-dali.phoenix-down-shop", "game-item.phoenix-down"],
  ["item-path.disc-1.village-of-dali.wrist-shop", "game-item.wrist"],
  ["item-path.disc-1.village-of-dali.rubber-helm-shop", "game-item.rubber-helm"],
];
const primaVistaCinnaShopProducts = [
  { itemId: "game-item.potion", price: 50 },
  { itemId: "game-item.phoenix-down", price: 150 },
  { itemId: "game-item.antidote", price: 50 },
  { itemId: "game-item.eye-drops", price: 50 },
  { itemId: "game-item.tent", price: 800 },
];
const bronzeGlovesNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.bronze-gloves-need-three");
const bronzeGlovesEndTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.bronze-gloves-end-inventory-one");
if (
  !evilForestTreasureWarning?.classification.includes("recoverable-later") ||
  !evilForestTreasureWarning.consequence.includes("nine location-specific item copies") ||
  !evilForestTreasureWarning.consequence.includes("116 Gil") ||
  !evilForestTreasureWarning.consequence.includes("Rank S needs 340 points") ||
  !evilForestTreasureWarning.recovery.includes("does not separately confirm") ||
  !["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"].every((sourceId) => evilForestTreasureWarning.sourceIds.includes(sourceId)) ||
  !evilForestTreasureWarning.action.includes("Cinna's shop stock") ||
  evilForestPickupPaths.some(({ pathId, itemId, method }) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
    const item = gameItems.find((candidate) => candidate.id === itemId);
    return !path || path.itemId !== itemId || path.chapterId !== "disc-1.evil-forest" || path.method !== method ||
      path.quantity !== 1 || path.availability !== "single-use" ||
      !path.walkthroughObjectiveIds?.includes(evilForestTreasureObjectiveId) ||
      !["gamefaqs-evil-forest-71891", "jegged-evil-forest", "vgkami-evil-forest"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
      !["gamefaqs-evil-forest-71891", "jegged-evil-forest", "vgkami-evil-forest"].every((sourceId) => item?.sourceIds.includes(sourceId));
  }) ||
  evilForestLaterRecoveryPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === itemId)) ||
  primaVistaCinnaShopProducts.some(({ itemId, price }) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-1.evil-forest.cinna-item-shop.${itemId.replace("game-item.", "")}`);
    return !path || path.itemId !== itemId || path.chapterId !== "disc-1.evil-forest" || path.method !== "shop" ||
      path.shopId !== "prima-vista.cinna-item-shop" || path.shopName !== "Cinna's Item Shop (Prima Vista)" ||
      path.cost?.currency !== "gil" || path.cost.amount !== price || path.availability !== "limited-window" ||
      path.recommendedBeforeChapterId !== "disc-1.evil-forest" ||
      !path.walkthroughObjectiveIds?.includes(evilForestTreasureObjectiveId) ||
      !["gamefaqs-evil-forest-71891", "jegged-evil-forest", "vgkami-evil-forest", "gamefaqs-shops-71891"].every((sourceId) => path.sourceIds.includes(sourceId));
  }) ||
  bronzeGlovesNeedTarget?.itemId !== "game-item.bronze-gloves" || bronzeGlovesNeedTarget.targetQuantity !== 3 ||
  bronzeGlovesEndTarget?.itemId !== "game-item.bronze-gloves" || bronzeGlovesEndTarget.targetQuantity !== 1 ||
  !equipmentAbilityClaims.some((claim) => claim.id === "item-ability.bronze-gloves.antibody" && claim.abilityName === "Antibody")
) {
  errors.push("Crash Site and Prima Vista must catalog all nine one-time item pickups, Cinna's five priced products, later item-type sources, Bronze Gloves' targets and ability, and sourced Treasure Hunter scoring guidance.");
}
const iceCavernTreasureObjectiveId = "disc-1.ice-cavern.treasure-sweep";
const iceCavernTreasureWarning = missablesById.get("missable.disc-1.ice-cavern.treasures");
const iceCavernChestPaths = [
  ["item-path.disc-1.ice-cavern.tent-chest", "game-item.tent"],
  ["item-path.disc-1.ice-cavern.ether-chest", "game-item.ether"],
  ["item-path.disc-1.ice-cavern.lower-ice-path-potion-chest", "game-item.potion"],
  ["item-path.disc-1.ice-cavern.icicle-field-potion-chest", "game-item.potion"],
  ["item-path.disc-1.ice-cavern.mage-masher-chest", "game-item.mage-masher"],
  ["item-path.disc-1.ice-cavern.elixir-chest", "game-item.elixir"],
  ["item-path.disc-1.ice-cavern.phoenix-down-chest", "game-item.phoenix-down"],
  ["item-path.disc-1.ice-cavern.leather-wrist-chest", "game-item.leather-wrist"],
];
const iceCavernLaterRecoveryPaths = [
  ["item-path.disc-2.cleyra.tent-shop", "game-item.tent"],
  ["item-path.disc-2.journey-to-outer-continent.stiltzkin-3-ether", "game-item.ether"],
  ["item-path.disc-2.cleyra.potion-shop", "game-item.potion"],
  ["item-path.disc-3.ipsens-castle.kumool-mogshop.mage-masher", "game-item.mage-masher"],
  ["item-path.disc-3.home-front.stiltzkin-5-elixir", "game-item.elixir"],
  ["item-path.disc-2.cleyra.phoenix-down-shop", "game-item.phoenix-down"],
  ["item-path.disc-2.treno.leather-wrist-shop", "game-item.leather-wrist"],
];
if (
  !iceCavernTreasureWarning?.classification.includes("recoverable-later") ||
  !iceCavernTreasureWarning.action.includes("two Potions") ||
  !iceCavernTreasureWarning.recovery.includes("Stiltzkin's third bundle at Fossil Roo") ||
  !iceCavernTreasureWarning.recovery.includes("Stiltzkin's fifth bundle at Alexandria") ||
  !iceCavernTreasureWarning.recovery.includes("not the lost Ice Cavern chest copies") ||
  !iceCavernTreasureWarning.consequence.includes("Rank S requires 340 points") ||
  !["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"].every((sourceId) => iceCavernTreasureWarning.sourceIds.includes(sourceId)) ||
  !iceCavernTreasureWarning.sourceIds.includes("gamefaqs-stiltzkin-shopping-71891") ||
  !iceCavernTreasureWarning.sourceIds.includes("gamefaqs-home-front-71891") ||
  !iceCavernTreasureWarning.sourceIds.includes("gamefaqs-ipsens-castle-71891") ||
  iceCavernChestPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) =>
    path.id === pathId && path.itemId === itemId && path.chapterId === "disc-1.ice-cavern" && path.method === "chest" &&
    path.availability === "single-use" && path.walkthroughObjectiveIds?.includes(iceCavernTreasureObjectiveId) &&
    path.sourceIds.includes("gamefaqs-ice-cavern-71891"))) ||
  iceCavernLaterRecoveryPaths.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === itemId))
) {
  errors.push("The Ice Cavern treasure warning must connect all eight one-time chests to their documented later item-type routes and source the one-point-per-chest, 340-point Rank S formula.");
}
const treasureHunterFormulaSources = ["jegged-treasure-hunter", "gamefaqs-chocobo-hot-cold-ysf-9771"] as const;
const treasureHunterFormulaWarnings = [
  "missable.disc-1.evil-forest.treasures",
  "missable.disc-1.ice-cavern.treasures",
  "missable.disc-1.village-of-dali.first-visit-pickups",
  "missable.disc-1.village-of-dali.underground-treasures",
  "missable.disc-2.cleyra.treasures",
  "missable.disc-2.return-to-alexandria.treasure-sweep",
  "missable.disc-2.return-to-alexandria.zorn-thorn-steals",
  "missable.disc-2.pinnacle-rocks.treasure-sweep",
  "missable.disc-2.journey-to-outer-continent.treasure-sweep",
  "missable.disc-3.forgotten-continent.oeilvert-treasures",
  "missable.disc-3.lost-continent.mount-gulug-sweep",
  "missable.disc-3.portal-to-another-world.terra-bran-bal-treasures",
  "missable.disc-2.cleyra.antlion-steals",
  "missable.disc-2.cleyra.beatrix-steals",
  "missable.disc-2.return-to-alexandria.beatrix-steals",
];
const rankGuide = sources.find((source) => source.id === "jegged-treasure-hunter");
const rankFormulaCrossCheck = sources.find((source) => source.id === "gamefaqs-chocobo-hot-cold-ysf-9771");
if (
  !rankGuide?.notes.includes("340 points") || !rankGuide.notes.includes("about 75%") ||
  !rankFormulaCrossCheck?.notes.includes("one point per opened chest") ||
  treasureHunterFormulaWarnings.some((warningId) => {
    const warning = missablesById.get(warningId);
    return !warning || !treasureHunterFormulaSources.every((sourceId) => warning.sourceIds.includes(sourceId));
  })
) {
  errors.push("The Treasure Hunter score formula and 340-point Rank S threshold must be source-registered and linked from each audited pickup/steal warning.");
}
const nolrichPool = enemyEncounters.find((encounter) => encounter.id === "encounter.nolrich-heights.world-map-pool");
const nolrichEnemyIds = ["enemy.carve-spider", "enemy.mu", "enemy.python"];
if (!nolrichPool || nolrichPool.kind !== "random-pool" || nolrichPool.chapterId !== "disc-1.ice-cavern" ||
  nolrichEnemyIds.some((enemyId) => !nolrichPool.formation.some((entry) => entry.enemyId === enemyId))) {
  errors.push("Nolrich Heights must remain a distinct world-map pool for Carve Spider, Mu, and Python.");
}
const daliUndergroundPool = enemyEncounters.find((encounter) => encounter.id === "encounter.dali-underground.random-pool");
const daliUndergroundEnemyIds = ["enemy.ghost", "enemy.vice", "enemy.skeleton"];
if (!daliUndergroundPool || daliUndergroundPool.kind !== "random-pool" || daliUndergroundPool.chapterId !== "disc-1.village-of-dali" ||
  daliUndergroundEnemyIds.some((enemyId) => !daliUndergroundPool.formation.some((entry) => entry.enemyId === enemyId)) ||
  !daliUndergroundPool.notes.some((note) => note.includes("GameFAQs and Caves of Narshe list Ghost and Vice") && note.includes("Skeleton"))) {
  errors.push("Dali's optional underground pool must retain Ghost, Vice, Skeleton, and the source disagreement about Skeleton.");
}
const blackWaltz2Encounter = enemyEncounters.find((encounter) => encounter.id === "encounter.dali.black-waltz-2");
const blackWaltz2Record = enemyRecords.find((enemy) => enemy.id === "enemy.black-waltz-2");
if (!blackWaltz2Encounter || blackWaltz2Encounter.kind !== "boss" ||
  !blackWaltz2Encounter.formation.some((entry) => entry.enemyId === "enemy.black-waltz-2" && entry.quantity === 1) ||
  !blackWaltz2Encounter.objectiveIds.includes("disc-1.village-of-dali.black-waltz-2-steals") ||
  !blackWaltz2Encounter.missableIds.includes("missable.disc-1.village-of-dali.black-waltz-2-steals") ||
  !blackWaltz2Encounter.cutoffIds.includes("cutoff.dali.black-waltz-2-steals") ||
  !blackWaltz2Encounter.notes.some((note) => note.includes("Observatory Mountain") && note.includes("cargo-ship"))) {
  errors.push("Black Waltz 2 must be a separate fixed boss encounter linked to its steal warning/cutoff and documented location conflict.");
}
for (const itemId of ["game-item.steepled-hat", "game-item.leather-plate"]) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === "disc-1.village-of-dali" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-1.village-of-dali.black-waltz-2-steals"));
  if (!blackWaltz2Record?.steals.some((slot) => slot.itemId === itemId) || !blackWaltz2Record.routeObjectiveIds.includes("disc-1.village-of-dali.black-waltz-2-steals") || !path || path.availability !== "one-time-encounter") {
    errors.push(`Black Waltz 2's ${itemId} steal must remain linked to the one-time objective and item path.`);
  }
}
if (blackWaltz2Record?.stats.find((stat) => stat.field === "HP")?.value !== 1030 ||
  blackWaltz2Record.drops.length !== 4 || blackWaltz2Record.drops.some((slot) => slot.itemId !== "game-item.ether") ||
  !blackWaltz2Record.facts.some((fact) => fact.category === "status-vulnerability" && fact.label === "Mini" && fact.sourceIds.includes("ffwiki-black-waltz-2"))) {
  errors.push("Black Waltz 2 must preserve its cross-checked HP, four Ether drop slots, and sourced Mini-status conflict.");
}
const summitStationWaltzEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.summit-station.black-waltz-3-rematch");
const summitStationWaltzRecord = enemyRecords.find((enemy) => enemy.id === "enemy.black-waltz-3-rematch");
const cargoShipWaltzEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.cargo-ship.black-waltz-3");
const cargoShipWaltzRecord = enemyRecords.find((enemy) => enemy.id === "enemy.black-waltz-3-cargo-ship");
const cargoShipWaltzSteals = [
  ["game-item.steepled-hat", "common"],
  ["game-item.linen-cuirass", "uncommon"],
  ["game-item.silver-gloves", "semi-rare"],
] as const;
if (!cargoShipWaltzEncounter || cargoShipWaltzEncounter.kind !== "boss" ||
  cargoShipWaltzEncounter.chapterId !== "disc-1.cargo-ship" ||
  !cargoShipWaltzEncounter.formation.some((entry) => entry.enemyId === "enemy.black-waltz-3-cargo-ship" && entry.quantity === 1) ||
  !cargoShipWaltzEncounter.objectiveIds.includes("disc-1.cargo-ship.black-waltz-3-steals") ||
  !cargoShipWaltzEncounter.missableIds.includes("missable.disc-1.cargo-ship.black-waltz-3-steals") ||
  !cargoShipWaltzEncounter.cutoffIds.includes("cutoff.cargo-ship.black-waltz-3-steals") ||
  !["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c", "rpgclassics-cargo-ship-walkthrough"].every((sourceId) => cargoShipWaltzEncounter.sourceIds.includes(sourceId)) ||
  cargoShipWaltzRecord?.stats.find((stat) => stat.field === "level")?.value !== 7 ||
  cargoShipWaltzRecord.stats.find((stat) => stat.field === "HP")?.value !== 1128 ||
  cargoShipWaltzRecord.steals.length !== 4 ||
  cargoShipWaltzRecord.drops.length !== 4 || cargoShipWaltzRecord.drops.some((slot) => slot.itemId !== null) ||
  !cargoShipWaltzRecord.routeObjectiveIds.includes("disc-1.cargo-ship.black-waltz-3-steals") ||
  !cargoShipWaltzRecord.notes.some((note) => note.includes("Silver Greaves") && note.includes("Silver Gloves"))) {
  errors.push("The Cargo Ship Black Waltz 3 record must stay distinct, source-linked, and tied to its one-time steals, warning, cutoff, and source-name conflict.");
}
for (const [itemId, slot] of cargoShipWaltzSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === "disc-1.cargo-ship" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-1.cargo-ship.black-waltz-3-steals"));
  if (!cargoShipWaltzRecord?.steals.some((steal) => steal.itemId === itemId && steal.slot === slot) || !path || path.availability !== "one-time-encounter") {
    errors.push(`Cargo Ship Black Waltz 3's ${itemId} steal must link to its one-time encounter and item path.`);
  }
}
const openingMaskedManEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.alexandria.masked-man-opening");
const openingMaskedManRecord = enemyRecords.find((enemy) => enemy.id === "enemy.masked-man-opening");
const openingMaskedManHpClaims = openingMaskedManRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
const crashSiteBakuEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.evil-forest.baku-crash-site");
const crashSiteBakuRecord = enemyRecords.find((enemy) => enemy.id === "enemy.baku-crash-site");
const crashSiteBakuHpClaims = crashSiteBakuRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
const crashSiteBakuWarning = missablesById.get("missable.disc-1.evil-forest.baku-steals");
const evilForestEscapeCutoff = cutoffsById.get("cutoff.evil-forest.escape");
if (!openingMaskedManEncounter || openingMaskedManEncounter.chapterId !== "disc-1.alexandria" ||
  !openingMaskedManEncounter.formation.some((entry) => entry.enemyId === "enemy.masked-man-opening" && entry.quantity === 1) ||
  !openingMaskedManEncounter.objectiveIds.includes("disc-1.alexandria.masked-man-steals") ||
  !openingMaskedManEncounter.missableIds.includes("missable.disc-1.alexandria.masked-man-steals") ||
  !openingMaskedManHpClaims.some((stat) => stat.value === 188 && stat.verification === "disputed") ||
  !openingMaskedManHpClaims.some((stat) => stat.value === 160 && stat.verification === "disputed" && stat.sourceIds.includes("gamefaqs-walkthrough-15690")) ||
  !openingMaskedManRecord?.notes.some((note) => note.includes("188 HP") && note.includes("160 HP")) ||
  !crashSiteBakuEncounter || crashSiteBakuEncounter.chapterId !== "disc-1.evil-forest" ||
  !crashSiteBakuEncounter.formation.some((entry) => entry.enemyId === "enemy.baku-crash-site" && entry.quantity === 1) ||
  !crashSiteBakuEncounter.objectiveIds.includes("disc-1.evil-forest.baku-steals") ||
  !crashSiteBakuEncounter.missableIds.includes("missable.disc-1.evil-forest.baku-steals") ||
  !crashSiteBakuHpClaims.some((stat) => stat.value === 202 && stat.verification === "disputed") ||
  !crashSiteBakuHpClaims.some((stat) => stat.value === 160 && stat.verification === "disputed" && stat.sourceIds.includes("gamefaqs-walkthrough-15690")) ||
  !crashSiteBakuRecord?.notes.some((note) => note.includes("202 HP") && note.includes("160 HP")) ||
  !crashSiteBakuWarning?.classification.includes("recoverable-later") ||
  !evilForestEscapeCutoff?.missableIds.includes("missable.disc-1.evil-forest.baku-steals")) {
  errors.push("The opening Masked Man and Crash Site Baku must remain separate boss encounters with their respective steal windows and disputed HP claims.");
}
for (const [enemyId, itemId, slot, chapterId, objectiveId] of [
  ["enemy.masked-man-opening", "game-item.potion", "common", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.masked-man-opening", "game-item.wrist", "uncommon", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.masked-man-opening", "game-item.mage-masher", "semi-rare", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.baku-crash-site", "game-item.hi-potion", "common", "disc-1.evil-forest", "disc-1.evil-forest.baku-steals"],
  ["enemy.baku-crash-site", "game-item.iron-sword", "uncommon", "disc-1.evil-forest", "disc-1.evil-forest.baku-steals"],
] as const) {
  const enemy = enemyRecords.find((candidate) => candidate.id === enemyId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === chapterId && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes(objectiveId));
  if (!enemy?.steals.some((steal) => steal.itemId === itemId && steal.slot === slot) || !path || path.availability !== "one-time-encounter") {
    errors.push(`${enemyId}'s ${itemId} steal must link to its one-time encounter and objective.`);
  }
}
for (const [itemId, pathId] of [
  ["game-item.mage-masher", "item-path.disc-1.village-of-dali.mage-masher-shop"],
  ["game-item.iron-sword", "item-path.disc-1.village-of-dali.iron-sword-shop"],
] as const) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  if (path?.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" || path.method !== "shop" || path.availability !== "repeatable") {
    errors.push(`${itemId} must have a repeatable Dali shop recovery path for the early boss-steal records.`);
  }
}
const summitStationWaltzSteals = [
  ["game-item.steepled-hat", "common"],
  ["game-item.lightning-staff", "uncommon"],
  ["game-item.flame-staff", "semi-rare"],
] as const;
if (!summitStationWaltzEncounter || summitStationWaltzEncounter.kind !== "boss" ||
  summitStationWaltzEncounter.chapterId !== "disc-2.journey-to-treno" ||
  !summitStationWaltzEncounter.formation.some((entry) => entry.enemyId === "enemy.black-waltz-3-rematch" && entry.quantity === 1) ||
  !summitStationWaltzEncounter.objectiveIds.includes("disc-2.journey-to-treno.black-waltz-3-steals") ||
  !summitStationWaltzEncounter.missableIds.includes("missable.disc-2.journey-to-treno.black-waltz-3-steals") ||
  !summitStationWaltzEncounter.cutoffIds.includes("cutoff.journey-to-treno.black-waltz-3-steals") ||
  !["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station", "strategywiki-summit-station"].every((sourceId) => summitStationWaltzEncounter.sourceIds.includes(sourceId))) {
  errors.push("The Summit Station Black Waltz 3 rematch must have its own source-linked boss encounter tied to the existing steal objective, missable, and cutoff.");
}
for (const [itemId, slot] of summitStationWaltzSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === "disc-2.journey-to-treno" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-2.journey-to-treno.black-waltz-3-steals"));
  if (!summitStationWaltzRecord?.steals.some((steal) => steal.itemId === itemId && steal.slot === slot) ||
    !summitStationWaltzRecord.routeObjectiveIds.includes("disc-2.journey-to-treno.black-waltz-3-steals") ||
    !path || path.availability !== "one-time-encounter") {
    errors.push(`The Summit Station Black Waltz 3 ${itemId} steal must link the profile, encounter objective, and one-time item path.`);
  }
}
const summitWaltzHpClaims = summitStationWaltzRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
if (summitStationWaltzRecord?.stats.find((stat) => stat.field === "level")?.value !== 9 ||
  !summitWaltzHpClaims.some((stat) => stat.value === 1292 && stat.verification === "disputed") ||
  !summitWaltzHpClaims.some((stat) => stat.value === 1300 && stat.verification === "disputed" && stat.sourceIds.includes("strategywiki-summit-station")) ||
  !summitStationWaltzRecord?.facts.some((fact) => fact.category === "attack" && fact.label === "Freeze") ||
  !summitStationWaltzRecord?.facts.some((fact) => fact.category === "status-vulnerability" && fact.label.includes("Darkness") && fact.label.includes("Slow")) ||
  !summitStationWaltzRecord?.notes.some((note) => note.includes("semi-rare") && note.includes("rare"))) {
  errors.push("The Summit Station Black Waltz 3 profile must preserve its rematch stats, StrategyWiki HP discrepancy, Freeze facts, steal-slot disagreement, and version note.");
}
const bentiniHeightsPool = enemyEncounters.find((encounter) => encounter.id === "encounter.bentini-heights.world-map-pool");
const bentiniTrickSparrow = enemyRecords.find((enemy) => enemy.id === "enemy.trick-sparrow");
const bentiniExpectedEnemies = ["enemy.carve-spider", "enemy.mu", "enemy.ladybird", "enemy.mandragora", "enemy.trick-sparrow"];
if (!bentiniHeightsPool || bentiniHeightsPool.kind !== "random-pool" ||
  bentiniExpectedEnemies.some((enemyId) => !bentiniHeightsPool.formation.some((entry) => entry.enemyId === enemyId && entry.quantity === null)) ||
  bentiniHeightsPool.formation.some((entry) => entry.enemyId === "enemy.ghost") ||
  !bentiniHeightsPool.notes.some((note) => note.includes("GameFAQs lists Mu, Mandragora, and Trick Sparrow") && note.includes("friendly Ghost")) ||
  !["gamefaqs-journey-to-treno-71891", "jegged-summit-station"].every((sourceId) => bentiniHeightsPool.sourceIds.includes(sourceId))) {
  errors.push("Bentini Heights must retain the GameFAQs/Jegged regional pool difference and keep the friendly Ghost outside hostile encounters.");
}
if (bentiniTrickSparrow?.stats.find((stat) => stat.field === "HP")?.value !== 191 ||
  bentiniTrickSparrow?.steals.find((slot) => slot.slot === "common")?.itemId !== "game-item.ore" ||
  bentiniTrickSparrow?.drops.find((slot) => slot.slot === "uncommon")?.itemId !== "game-item.echo-screen" ||
  !bentiniTrickSparrow?.blueMagic.some((magic) => magic.name === "Matra Magic") ||
  !bentiniTrickSparrow?.notes.some((note) => note.includes("Festival version") && note.includes("ordinary enemy table"))) {
  errors.push("Bentini Heights' ordinary Trick Sparrow profile must include its sourced stat/loot table and remain distinct from the Festival variant.");
}
const garganRooPool = enemyEncounters.find((encounter) => encounter.id === "encounter.gargan-roo.random-pool");
const garganRooBossEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.gargan-roo.ralvurahva");
const crawlerRecord = enemyRecords.find((enemy) => enemy.id === "enemy.crawler");
const dragonflyRecord = enemyRecords.find((enemy) => enemy.id === "enemy.dragonfly");
const ralvurahvaRecord = enemyRecords.find((enemy) => enemy.id === "enemy.ralvurahva");
if (!garganRooPool || garganRooPool.kind !== "random-pool" ||
  garganRooPool.chapterId !== "disc-2.journey-to-cleyra" ||
  !garganRooPool.formation.some((entry) => entry.enemyId === "enemy.crawler" && entry.quantity === null) ||
  !garganRooPool.formation.some((entry) => entry.enemyId === "enemy.dragonfly" && entry.quantity === null) ||
  !garganRooPool.notes.some((note) => note.includes("Quina is absent") && note.includes("Matra Magic")) ||
  !dragonflyRecord?.encounterIds.includes("encounter.gargan-roo.random-pool") ||
  !dragonflyRecord?.sourceIds.includes("jegged-gargan-roo")) {
  errors.push("Gargan Roo must keep its Crawler/Dragonfly area pool separate, source-linked, and explicit about Quina's absence.");
}
if (crawlerRecord?.chapterId !== "disc-2.journey-to-cleyra" ||
  crawlerRecord.stats.find((stat) => stat.field === "HP")?.value !== 625 ||
  crawlerRecord.steals.find((slot) => slot.slot === "common")?.itemId !== "game-item.antidote" ||
  crawlerRecord.steals.find((slot) => slot.slot === "rare")?.itemId !== "game-item.phoenix-pinion" ||
  crawlerRecord.drops.find((slot) => slot.slot === "uncommon")?.itemId !== "game-item.ether" ||
  !crawlerRecord.facts.some((fact) => fact.category === "elemental-weakness" && fact.label === "Ice") ||
  !crawlerRecord.facts.some((fact) => fact.category === "attack" && fact.label === "Drain")) {
  errors.push("Crawler must retain its Gargan Roo stats, sourced steal/drop table, Ice weakness, and Drain attack.");
}
const ralvurahvaHpClaims = ralvurahvaRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
if (!garganRooBossEncounter || garganRooBossEncounter.kind !== "boss" ||
  garganRooBossEncounter.chapterId !== "disc-2.journey-to-cleyra" ||
  !garganRooBossEncounter.formation.some((entry) => entry.enemyId === "enemy.ralvurahva" && entry.quantity === 1) ||
  !garganRooBossEncounter.objectiveIds.includes("disc-2.journey-to-cleyra.ralvurahva-steals") ||
  !garganRooBossEncounter.missableIds.includes("missable.disc-2.journey-to-cleyra.ralvurahva-steals") ||
  !garganRooBossEncounter.cutoffIds.includes("cutoff.gargan-roo.ralvurahva-steals") ||
  !ralvurahvaRecord || ralvurahvaRecord.kind !== "boss" ||
  ralvurahvaRecord.stats.find((stat) => stat.field === "level")?.value !== 13 ||
  ralvurahvaRecord.stats.find((stat) => stat.field === "MP")?.value !== 3649 ||
  !ralvurahvaHpClaims.some((stat) => stat.value === 2296 && stat.verification === "disputed") ||
  !ralvurahvaHpClaims.some((stat) => stat.value === 2200 && stat.verification === "disputed") ||
  !ralvurahvaHpClaims.some((stat) => stat.value === 2500 && stat.verification === "disputed") ||
  !ralvurahvaRecord.steals.some((slot) => slot.slot === "common" && slot.itemId === "game-item.bone-wrist") ||
  !ralvurahvaRecord.steals.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.mythril-fork") ||
  ralvurahvaRecord.drops.some((slot) => slot.itemId !== null) ||
  !ralvurahvaRecord.routeObjectiveIds.includes("disc-2.journey-to-cleyra.ralvurahva-steals") ||
  !ralvurahvaRecord.missableIds.includes("missable.disc-2.journey-to-cleyra.ralvurahva-steals") ||
  !ralvurahvaRecord.cutoffIds.includes("cutoff.gargan-roo.ralvurahva-steals") ||
  !ralvurahvaRecord.notes.some((note) => note.includes("70%/23%") && note.includes("100%/25%")) ||
  !ralvurahvaRecord.facts.some((fact) => fact.category === "attack" && fact.label === "Devil's Kiss")) {
  errors.push("Gargan Roo must link Ralvurahva's boss profile to its existing steal warning/cutoff and preserve the HP and steal-rate source differences.");
}
const ralvuimagoEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.return-to-alexandria.ralvuimago");
const ralvuimagoRecord = enemyRecords.find((enemy) => enemy.id === "enemy.ralvuimago");
const ralvuimagoHpClaims = ralvuimagoRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
const ralvuimagoStealPaths = [
  ["game-item.phoenix-down", "item-path.disc-2.return-to-alexandria.ralvuimago-phoenix-down-steal", "common"],
  ["game-item.adaman-vest", "item-path.disc-2.return-to-alexandria.ralvuimago-adaman-vest-steal", "uncommon"],
  ["game-item.oak-staff", "item-path.disc-2.return-to-alexandria.ralvuimago-oak-staff-steal", "semi-rare"],
] as const;
if (!ralvuimagoEncounter || ralvuimagoEncounter.kind !== "boss" ||
  ralvuimagoEncounter.chapterId !== "disc-2.return-to-alexandria" ||
  !ralvuimagoEncounter.formation.some((entry) => entry.enemyId === "enemy.ralvuimago" && entry.quantity === 1) ||
  !ralvuimagoEncounter.objectiveIds.includes("disc-2.return-to-alexandria.ralvuimago-steals") ||
  !ralvuimagoEncounter.missableIds.includes("missable.disc-2.return-to-alexandria.ralvuimago-steals") ||
  !ralvuimagoEncounter.cutoffIds.includes("cutoff.alexandria-rescue.ralvuimago-steals") ||
  !ralvuimagoRecord || ralvuimagoRecord.kind !== "boss" ||
  ralvuimagoRecord.stats.find((stat) => stat.field === "level")?.value !== 18 ||
  !ralvuimagoHpClaims.some((stat) => stat.value === 3352 && stat.verification === "disputed") ||
  !ralvuimagoHpClaims.some((stat) => stat.value === 5709 && stat.verification === "disputed") ||
  ralvuimagoRecord.stats.find((stat) => stat.field === "MP")?.value !== 584 ||
  !ralvuimagoRecord.facts.some((fact) => fact.category === "elemental-weakness" && fact.label === "Ice") ||
  !ralvuimagoRecord.facts.some((fact) => fact.category === "elemental-resistance" && fact.label.includes("Earth") && fact.label.includes("absorbs")) ||
  !ralvuimagoRecord.facts.some((fact) => fact.category === "attack" && fact.label === "Earth Power counter") ||
  !ralvuimagoRecord.notes.some((note) => note.includes("5,709") && note.includes("3,352")) ||
  !ralvuimagoRecord.notes.some((note) => note.includes("Semi-Rare") && note.includes("Rare")) ||
  !ralvuimagoRecord.notes.some((note) => note.includes("Always and Common drop slots"))) {
  errors.push("Ralvuimago must remain distinct as the return-ride boss and preserve its existing cutoff links, HP disagreement, steal-tier disagreement, and Ether drop-table scope.");
}
for (const [itemId, pathId, slot] of ralvuimagoStealPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  if (!ralvuimagoRecord?.steals.some((steal) => steal.itemId === itemId && steal.slot === slot) ||
    !ralvuimagoRecord.routeObjectiveIds.includes("disc-2.return-to-alexandria.ralvuimago-steals") ||
    !path || path.itemId !== itemId || path.method !== "steal" || path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.ralvuimago-steals")) {
    errors.push(`Ralvuimago's ${itemId} steal must connect its bestiary table to the existing one-time item path and objective.`);
  }
}
const lindblumMountainPool = enemyEncounters.find((encounter) => encounter.id === "encounter.lindblum-plateau.mountain-pool");
const lindblumForestPool = enemyEncounters.find((encounter) => encounter.id === "encounter.lindblum-plateau.forest-pool");
if (!lindblumMountainPool || lindblumMountainPool.kind !== "random-pool" ||
  !lindblumMountainPool.formation.some((entry) => entry.enemyId === "enemy.carve-spider") ||
  !lindblumMountainPool.formation.some((entry) => entry.enemyId === "enemy.axe-beak") ||
  lindblumMountainPool.formation.some((entry) => entry.enemyId === "enemy.bomb") ||
  !lindblumForestPool || lindblumForestPool.kind !== "random-pool" ||
  !lindblumForestPool.formation.some((entry) => entry.enemyId === "enemy.carve-spider") ||
  !lindblumForestPool.formation.some((entry) => entry.enemyId === "enemy.axe-beak") ||
  !lindblumForestPool.formation.some((entry) => entry.enemyId === "enemy.bomb")) {
  errors.push("Lindblum Plateau must separate its mountain Carve Spider/Axe Beak pool from the forest pool that also contains Bomb.");
}
const gunitasPool = enemyEncounters.find((encounter) => encounter.id === "encounter.gunitas-basin.world-map-pool");
const lindblumLowlandsPool = enemyEncounters.find((encounter) => encounter.id === "encounter.lindblum-area.lowlands-pool");
const qusMarshPool = enemyEncounters.find((encounter) => encounter.id === "encounter.qus-marsh.disc-1-interior-pool");
if (!gunitasPool || gunitasPool.kind !== "random-pool" ||
  ["enemy.goblin", "enemy.mu", "enemy.python"].some((enemyId) => !gunitasPool.formation.some((entry) => entry.enemyId === enemyId)) ||
  gunitasPool.formation.some((entry) => entry.enemyId === "enemy.carve-spider") ||
  !lindblumLowlandsPool || lindblumLowlandsPool.kind !== "random-pool" ||
  ["enemy.clipper", "enemy.hedgehog-pie", "enemy.ironite", "enemy.ladybird", "enemy.mandragora", "enemy.serpion", "enemy.vice"].some((enemyId) => !lindblumLowlandsPool.formation.some((entry) => entry.enemyId === enemyId)) ||
  lindblumLowlandsPool.formation.some((entry) => entry.enemyId === "enemy.bomb" || entry.enemyId === "enemy.axe-beak") ||
  !qusMarshPool || qusMarshPool.kind !== "random-pool" ||
  !qusMarshPool.formation.some((entry) => entry.enemyId === "enemy.axolotl") ||
  !qusMarshPool.formation.some((entry) => entry.enemyId === "enemy.gigan-toad-a") ||
  qusMarshPool.formation.some((entry) => entry.enemyId === "enemy.anemone" || entry.enemyId === "enemy.sahagin" || entry.enemyId === "enemy.gigan-toad-b")) {
  errors.push("Gunitas Basin, Lindblum lowlands, and the Disc I Qu's Marsh must retain their distinct source-listed enemy pools.");
}
const outerContinentQuMarshPool = enemyEncounters.find((encounter) => encounter.id === "encounter.qus-marsh.outer-continent-disc-ii-pool");
const sahaginRecord = enemyRecords.find((enemy) => enemy.id === "enemy.sahagin");
const giganToadBRecord = enemyRecords.find((enemy) => enemy.id === "enemy.gigan-toad-b");
const outerContinentMarshBlueMagicObjective = objectivesById.get("disc-2.journey-to-outer-continent.blue-magic");
const outerContinentWalkthrough = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.outer-continent");
if (!outerContinentQuMarshPool || outerContinentQuMarshPool.kind !== "random-pool" ||
  outerContinentQuMarshPool.chapterId !== "disc-2.journey-to-outer-continent" ||
  outerContinentQuMarshPool.formation.length !== 2 ||
  !outerContinentQuMarshPool.formation.some((entry) => entry.enemyId === "enemy.sahagin" && entry.quantity === null) ||
  !outerContinentQuMarshPool.formation.some((entry) => entry.enemyId === "enemy.gigan-toad-b" && entry.quantity === null) ||
  outerContinentQuMarshPool.formation.some((entry) => entry.enemyId === "enemy.axolotl" || entry.enemyId === "enemy.gigan-toad-a" || entry.enemyId === "enemy.anemone") ||
  !outerContinentQuMarshPool.objectiveIds.includes("disc-2.journey-to-outer-continent.quina-rejoin") ||
  !outerContinentQuMarshPool.objectiveIds.includes("disc-2.journey-to-outer-continent.frog-catching") ||
  !outerContinentQuMarshPool.objectiveIds.includes("disc-2.journey-to-outer-continent.blue-magic") ||
  outerContinentQuMarshPool.missableIds.length !== 0 || outerContinentQuMarshPool.cutoffIds.length !== 0 ||
  !sahaginRecord || sahaginRecord.chapterId !== "disc-2.journey-to-outer-continent" ||
  !sahaginRecord.encounterIds.includes("encounter.qus-marsh.outer-continent-disc-ii-pool") ||
  sahaginRecord.stats.find((stat) => stat.field === "HP")?.value !== 1375 ||
  sahaginRecord.stats.find((stat) => stat.field === "HP")?.verification !== "cross-checked" ||
  !sahaginRecord.steals.some((slot) => slot.slot === "rare" && slot.itemId === "game-item.ether") ||
  !sahaginRecord.drops.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.phoenix-down") ||
  !sahaginRecord.blueMagic.some((skill) => skill.name === "Aqua Breath" && skill.objectiveIds.includes("disc-2.journey-to-outer-continent.blue-magic")) ||
  !giganToadBRecord || giganToadBRecord.chapterId !== "disc-2.journey-to-outer-continent" ||
  !giganToadBRecord.encounterIds.includes("encounter.qus-marsh.outer-continent-disc-ii-pool") ||
  giganToadBRecord.stats.find((stat) => stat.field === "level")?.value !== 7 ||
  giganToadBRecord.stats.find((stat) => stat.field === "HP")?.value !== 297 ||
  !giganToadBRecord.steals.some((slot) => slot.slot === "common" && slot.itemId === "game-item.ore") ||
  !giganToadBRecord.drops.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.echo-screen") ||
  !giganToadBRecord.blueMagic.some((skill) => skill.name === "Frog Drop" && skill.objectiveIds.includes("disc-2.journey-to-outer-continent.blue-magic")) ||
  !outerContinentMarshBlueMagicObjective?.title.includes("Aqua Breath") ||
  !outerContinentMarshBlueMagicObjective.title.includes("Frog Drop") ||
  !outerContinentMarshBlueMagicObjective.sourceIds.includes("flactem-disc-2-fossil-roo-outer-continent") ||
  !outerContinentWalkthrough?.sections.some((section) => section.id === "outer-continent-world-map" &&
    section.steps.some((step) => step.id === "outer-continent-qu-marsh-blue-magic" && step.objectiveIds?.includes("disc-2.journey-to-outer-continent.blue-magic")))) {
  errors.push("The Outer Continent Qu's Marsh must have its separate Sahagin/Gigan Toad [B] pool, sourced stats/loot/Blue Magic links, and walkthrough context without borrowing Disc I variants or adding a cutoff.");
}
const outerMarshLootPaths = [
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-sahagin-hi-potion-steal", "enemy.sahagin", "game-item.hi-potion", "steal", "common"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-sahagin-ether-steal", "enemy.sahagin", "game-item.ether", "steal", "rare"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-sahagin-phoenix-down-drop", "enemy.sahagin", "game-item.phoenix-down", "drop", "uncommon"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-sahagin-ether-drop", "enemy.sahagin", "game-item.ether", "drop", "rare"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-gigan-toad-b-ore-steal", "enemy.gigan-toad-b", "game-item.ore", "steal", "common"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-gigan-toad-b-potion-drop", "enemy.gigan-toad-b", "game-item.potion", "drop", "common"],
  ["item-path.disc-2.journey-to-outer-continent.outer-marsh-gigan-toad-b-echo-screen-drop", "enemy.gigan-toad-b", "game-item.echo-screen", "drop", "uncommon"],
] as const;
for (const [pathId, enemyId, itemId, method, slot] of outerMarshLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const lootTable = method === "steal" ? enemy?.steals : enemy?.drops;
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-2.journey-to-outer-continent" ||
    path.method !== method || path.availability !== "repeatable" ||
    !path.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    !lootTable?.some((entry) => entry.itemId === itemId && entry.slot === slot)) {
    errors.push(`Outer Continent Qu's Marsh item path ${pathId} must match its repeatable enemy-table loot slot.`);
  }
}
const lanarMarshPool = enemyEncounters.find((encounter) => encounter.id === "encounter.lanar-island.qus-marsh.anemone-opportunity");
const blairsurpassMarshPool = enemyEncounters.find((encounter) => encounter.id === "encounter.blairsurpass.qus-marsh.anemone-opportunity");
const anemoneRecord = enemyRecords.find((enemy) => enemy.id === "enemy.anemone");
const highSeasWalkthrough = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.on-the-high-seas");
const forgottenContinentWalkthrough = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent");
if (!lanarMarshPool || lanarMarshPool.kind !== "random-pool" ||
  lanarMarshPool.chapterId !== "disc-3.on-the-high-seas" ||
  lanarMarshPool.formation.length !== 1 ||
  lanarMarshPool.formation[0]?.enemyId !== "enemy.anemone" ||
  !lanarMarshPool.objectiveIds.includes("disc-3.on-the-high-seas.blue-magic") ||
  !lanarMarshPool.objectiveIds.includes("disc-3.on-the-high-seas.lanar-frogs") ||
  lanarMarshPool.missableIds.length !== 0 || lanarMarshPool.cutoffIds.length !== 0 ||
  !anemoneRecord || anemoneRecord.chapterId !== "disc-3.on-the-high-seas" ||
  !anemoneRecord.encounterIds.includes("encounter.lanar-island.qus-marsh.anemone-opportunity") ||
  anemoneRecord.stats.find((stat) => stat.field === "HP")?.value !== 3586 ||
  anemoneRecord.stats.find((stat) => stat.field === "HP")?.verification !== "cross-checked" ||
  !anemoneRecord.stats.some((stat) => stat.field === "AP" && stat.value === 2 && stat.verification === "disputed") ||
  !anemoneRecord.stats.some((stat) => stat.field === "AP" && stat.value === 3 && stat.verification === "disputed") ||
  !anemoneRecord.blueMagic.some((skill) => skill.name === "Bad Breath" && skill.objectiveIds.includes("disc-3.on-the-high-seas.blue-magic")) ||
  !highSeasWalkthrough?.sections.some((section) => section.id === "high-seas-lanar-island" &&
    section.steps.some((step) => step.id === "high-seas-lanar-blue-magic" && step.objectiveIds?.includes("disc-3.on-the-high-seas.blue-magic")))) {
  errors.push("The Lanar Island Qu's Marsh opportunity must link Anemone's repeatable Bad Breath lesson to the Disc III walkthrough without claiming a cutoff or complete pond roster.");
}
const lanarAnemoneLootPaths = [
  ["item-path.disc-3.on-the-high-seas.lanar-anemone-ore-steal", "game-item.ore", "steal", "common"],
  ["item-path.disc-3.on-the-high-seas.lanar-anemone-tent-steal", "game-item.tent", "steal", "uncommon"],
  ["item-path.disc-3.on-the-high-seas.lanar-anemone-hi-potion-drop", "game-item.hi-potion", "drop", "common"],
  ["item-path.disc-3.on-the-high-seas.lanar-anemone-eye-drops-drop", "game-item.eye-drops", "drop", "uncommon"],
  ["item-path.disc-3.on-the-high-seas.lanar-anemone-ether-drop", "game-item.ether", "drop", "rare"],
] as const;
for (const [pathId, itemId, method, slot] of lanarAnemoneLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const lootTable = method === "steal" ? anemoneRecord?.steals : anemoneRecord?.drops;
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-3.on-the-high-seas" ||
    path.method !== method || path.availability !== "repeatable" ||
    !path.sourceIds.includes("gamefaqs-item-locations-54996") ||
    !lootTable?.some((entry) => entry.itemId === itemId && entry.slot === slot)) {
    errors.push(`Lanar Island Anemone item path ${pathId} must match its repeatable enemy-table loot slot.`);
  }
}
const blairsurpassAnemoneLootPaths = [
  ["item-path.disc-3.forgotten-continent.blairsurpass-anemone-ore-steal", "game-item.ore", "steal", "common"],
  ["item-path.disc-3.forgotten-continent.blairsurpass-anemone-tent-steal", "game-item.tent", "steal", "uncommon"],
  ["item-path.disc-3.forgotten-continent.blairsurpass-anemone-hi-potion-drop", "game-item.hi-potion", "drop", "common"],
  ["item-path.disc-3.forgotten-continent.blairsurpass-anemone-eye-drops-drop", "game-item.eye-drops", "drop", "uncommon"],
  ["item-path.disc-3.forgotten-continent.blairsurpass-anemone-ether-drop", "game-item.ether", "drop", "rare"],
] as const;
const forgottenMarshFrogObjective = objectivesById.get("disc-3.forgotten-continent.qus-marsh-frogs");
const regionalBlueMagicObjective = objectivesById.get("disc-3.on-the-high-seas.blue-magic");
if (!blairsurpassMarshPool || blairsurpassMarshPool.kind !== "random-pool" ||
  blairsurpassMarshPool.chapterId !== "disc-3.forgotten-continent" ||
  blairsurpassMarshPool.formation.length !== 1 ||
  blairsurpassMarshPool.formation[0]?.enemyId !== "enemy.anemone" ||
  !blairsurpassMarshPool.objectiveIds.includes("disc-3.on-the-high-seas.blue-magic") ||
  !blairsurpassMarshPool.objectiveIds.includes("disc-3.forgotten-continent.qus-marsh-frogs") ||
  blairsurpassMarshPool.missableIds.length !== 0 || blairsurpassMarshPool.cutoffIds.length !== 0 ||
  !blairsurpassMarshPool.sourceIds.includes("gamefaqs-qus-marsh-60521") ||
  !anemoneRecord?.encounterIds.includes("encounter.blairsurpass.qus-marsh.anemone-opportunity") ||
  !forgottenContinentWalkthrough?.sections.some((section) => section.id === "forgotten-continent-landing" &&
    section.steps.some((step) => step.id === "forgotten-continent-anemone-bad-breath" &&
      step.objectiveIds?.includes("disc-3.on-the-high-seas.blue-magic") &&
      step.objectiveIds.includes("disc-3.forgotten-continent.qus-marsh-frogs"))) ||
  !forgottenMarshFrogObjective?.sourceIds.includes("gamefaqs-qus-marsh-60521") ||
  !regionalBlueMagicObjective?.chapterIds.includes("disc-3.forgotten-continent")) {
  errors.push("Blairsurpass Plains Qu's Marsh must keep its scoped repeatable Anemone opportunity linked to Bad Breath, the frog objective, sources, and Disc III walkthrough without claiming a cutoff or complete pond roster.");
}
for (const [pathId, itemId, method, slot] of blairsurpassAnemoneLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const lootTable = method === "steal" ? anemoneRecord?.steals : anemoneRecord?.drops;
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-3.forgotten-continent" ||
    path.method !== method || path.availability !== "repeatable" ||
    !path.sourceIds.includes("gamefaqs-item-locations-54996") ||
    !lootTable?.some((entry) => entry.itemId === itemId && entry.slot === slot)) {
    errors.push(`Blairsurpass Plains Anemone item path ${pathId} must match its repeatable enemy-table loot slot.`);
  }
}
const grottoPool = enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.random-pool");
const grottoTypeAFights = [
  enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.type-a-first-pair"),
  enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.type-a-second-pair"),
];
const gizamalukeEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.gizamaluke");
const gizamalukeRecord = enemyRecords.find((enemy) => enemy.id === "enemy.gizamaluke");
const grottoRoster = ["enemy.hornet", "enemy.lamia", "enemy.skeleton", "enemy.type-a"];
const gizamalukeElixirStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.journey-to-burmecia.elixir-gizamaluke-steal");
const gizamalukeIceStaffStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.journey-to-burmecia.ice-staff-gizamaluke-steal");
const cleyraIceStaffPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.ice-staff-trunk-chest");
if (!grottoPool || grottoPool.kind !== "random-pool" || grottoRoster.some((enemyId) => !grottoPool.formation.some((member) => member.enemyId === enemyId && member.quantity === null)) ||
  grottoTypeAFights.some((encounter) => !encounter || encounter.kind !== "fixed" || !encounter.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2)) ||
  !gizamalukeEncounter || gizamalukeEncounter.kind !== "boss" || !gizamalukeEncounter.formation.some((member) => member.enemyId === "enemy.gizamaluke" && member.quantity === 1) ||
  !gizamalukeRecord || gizamalukeRecord.kind !== "boss" || gizamalukeRecord.stats.find((stat) => stat.field === "HP")?.value !== 3175 ||
  !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.elixir") || !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.magus-hat") ||
  !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.ice-staff") || !gizamalukeRecord.drops.some((slot) => slot.itemId === "game-item.tent") ||
  !gizamalukeRecord.missableIds.includes("missable.disc-1.journey-to-burmecia.gizamaluke-steals") ||
  !gizamalukeElixirStealPath || gizamalukeElixirStealPath.method !== "steal" || !gizamalukeElixirStealPath.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.gizamaluke-steals") ||
  !gizamalukeIceStaffStealPath || gizamalukeIceStaffStealPath.method !== "steal" ||
  !cleyraIceStaffPath || cleyraIceStaffPath.method !== "chest" || cleyraIceStaffPath.chapterId !== "disc-2.cleyra") {
  errors.push("Gizamaluke's Grotto must keep its regional pool, two fixed Type A pairs, boss steal warning, and later Ice Staff recovery linked across the bestiary and item catalog.");
}
const burmeciaCityPool = enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.city-random-pool");
const burmeciaRegionPool = enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia-region.world-map-pool");
const burmeciaTypeAPair = enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.type-a-pair");
const burmeciaMimicEncounters = [
  enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.suburb.mimic-chest-1"),
  enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.suburb.mimic-chest-2"),
  enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.uptown.mimic-chest"),
];
const burmeciaBossEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.burmecia.beatrix");
const burmeciaBoss = enemyRecords.find((enemy) => enemy.id === "enemy.beatrix-burmecia");
const burmeciaCityRoster = ["enemy.basilisk", "enemy.ironite", "enemy.magic-vice"];
const burmeciaRegionRoster = ["enemy.lizard-man", "enemy.nymph", "enemy.sand-scorpion", "enemy.skeleton", "enemy.yeti"];
const burmeciaBossSteals = [
  { itemId: "game-item.phoenix-down", pathId: "item-path.burmecia.phoenix-down-beatrix" },
  { itemId: "game-item.chain-plate", pathId: "item-path.burmecia.beatrix-chain-plate" },
  { itemId: "game-item.mythril-sword", pathId: "item-path.burmecia.beatrix-mythril-sword" },
];
if (!burmeciaCityPool || burmeciaCityPool.chapterId !== "disc-1.burmecia" || burmeciaCityPool.kind !== "random-pool" ||
  burmeciaCityRoster.some((enemyId) => !burmeciaCityPool.formation.some((member) => member.enemyId === enemyId && member.quantity === null)) ||
  burmeciaCityPool.formation.some((member) => member.enemyId === "enemy.mimic" || member.enemyId === "enemy.type-a") ||
  !burmeciaRegionPool || burmeciaRegionPool.kind !== "random-pool" || burmeciaRegionPool.chapterId !== "disc-1.journey-to-burmecia" ||
  burmeciaRegionRoster.some((enemyId) => !burmeciaRegionPool.formation.some((member) => member.enemyId === enemyId && member.quantity === null)) ||
  !burmeciaTypeAPair || burmeciaTypeAPair.kind !== "fixed" || !burmeciaTypeAPair.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2) ||
  burmeciaMimicEncounters.some((encounter) => !encounter || encounter.kind !== "fixed" || !encounter.formation.some((member) => member.enemyId === "enemy.mimic" && member.quantity === 1))) {
  errors.push("Burmecia must keep its city pool, regional world-map pool, scripted Type A pair, and three optional Mimic chest battles separate.");
}
const burmeciaTypeARecord = enemyRecords.find((enemy) => enemy.id === "enemy.type-a");
const burmeciaMagicVice = enemyRecords.find((enemy) => enemy.id === "enemy.magic-vice");
const burmeciaNymph = enemyRecords.find((enemy) => enemy.id === "enemy.nymph");
if (!burmeciaTypeARecord?.encounterIds.includes("encounter.burmecia.type-a-pair") ||
  !burmeciaTypeARecord.notes.some((note) => note.includes("155 EXP") && note.includes("115 EXP")) ||
  !burmeciaMagicVice?.notes.some((note) => note.includes("Echo Screen") && note.includes("Eye Drops")) ||
  !burmeciaNymph?.blueMagic.some((skill) => skill.name === "Night" && skill.objectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night"))) {
  errors.push("Burmecia's Type A table disagreement, Magic Vice steal-slot disagreement, and Nymph Night objective must remain source-linked.");
}
if (!burmeciaBossEncounter || burmeciaBossEncounter.kind !== "boss" ||
  !burmeciaBossEncounter.formation.some((member) => member.enemyId === "enemy.beatrix-burmecia" && member.quantity === 1) ||
  !burmeciaBossEncounter.objectiveIds.includes("disc-1.burmecia.beatrix-steals") ||
  !burmeciaBossEncounter.missableIds.includes("missable.disc-1.burmecia.beatrix-steals") ||
  !burmeciaBossEncounter.cutoffIds.includes("cutoff.burmecia.beatrix-steals") ||
  !burmeciaBoss || burmeciaBoss.kind !== "boss" ||
  !burmeciaBoss.stats.some((stat) => stat.field === "level" && stat.value === 14 && stat.verification === "disputed") ||
  !burmeciaBoss.stats.some((stat) => stat.field === "level" && stat.value === 16 && stat.verification === "disputed") ||
  !burmeciaBoss.stats.some((stat) => stat.field === "HP" && stat.value === 3630 && stat.verification === "disputed") ||
  !burmeciaBoss.stats.some((stat) => stat.field === "HP" && stat.value === 3360 && stat.verification === "disputed") ||
  !burmeciaBoss.stats.some((stat) => stat.field === "MP" && stat.value === 3467 && stat.verification === "disputed") ||
  !burmeciaBoss.stats.some((stat) => stat.field === "MP" && stat.value === 3367 && stat.verification === "disputed")) {
  errors.push("Beatrix's Burmecia boss dossier must link the one-time steal warning/cutoff and retain both published stat profiles as disputed claims.");
}
for (const expected of burmeciaBossSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!burmeciaBoss?.steals.some((slot) => slot.itemId === expected.itemId) ||
    !burmeciaBoss.routeObjectiveIds.includes("disc-1.burmecia.beatrix-steals") ||
    !burmeciaBoss.missableIds.includes("missable.disc-1.burmecia.beatrix-steals") ||
    !path || path.itemId !== expected.itemId || path.method !== "steal" || path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-1.burmecia.beatrix-steals")) {
    errors.push(`Beatrix's ${expected.itemId} steal must connect the bestiary to its existing one-time objective and item path.`);
  }
}
const burmeciaBeatrixWarning = missablesById.get("missable.disc-1.burmecia.beatrix-steals");
const burmeciaBeatrixRecoveryPathIds = [
  ["item-path.disc-2.treno.chain-plate-shop", "game-item.chain-plate"],
  ["item-path.disc-2.cleyra.chain-plate-shop", "game-item.chain-plate"],
  ["item-path.disc-2.return-to-lindblum.chain-plate-shop", "game-item.chain-plate"],
  ["item-path.disc-2.return-to-lindblum.dragon-gate-chain-plate-shop", "game-item.chain-plate"],
  ["item-path.disc-2.journey-to-outer-continent.fossil-roo-chain-plate-shop", "game-item.chain-plate"],
  ["item-path.disc-2.outer-continent.chain-plate-black-mage-village-shop", "game-item.chain-plate"],
  ["item-path.disc-2.treno.mythril-sword-shop", "game-item.mythril-sword"],
  ["item-path.disc-3.on-the-high-seas.esto-gaza-mythril-sword", "game-item.mythril-sword"],
];
if (
  !burmeciaBeatrixWarning?.sourceIds.includes("gamefaqs-shops-71891") ||
  !burmeciaBeatrixWarning.sourceIds.includes("gamefaqs-on-the-high-seas-71891") ||
  !burmeciaBeatrixWarning.sourceIds.includes("gamefaqs-missables-71891") ||
  !burmeciaBeatrixWarning.recovery.includes("Phoenix Down is ordinary shop stock") ||
  !burmeciaBeatrixWarning.recovery.includes("Black Mage Village (Discs II–III)") ||
  !burmeciaBeatrixWarning.recovery.includes("Esto Gaza's initial Disc III shop before Desert Palace") ||
  !burmeciaBeatrixWarning.recovery.includes("five-copy target") ||
  !burmeciaBeatrixWarning.recovery.includes("not the missed Beatrix encounter copies") ||
  burmeciaBeatrixRecoveryPathIds.some(([pathId, itemId]) => !itemAcquisitionPaths.some((path) => path.id === pathId && path.itemId === itemId)) ||
  !itemAcquisitionPaths.some((path) => path.id === "item-path.disc-2.return-to-lindblum.cleyra-recovery.phoenix-down" && path.itemId === "game-item.phoenix-down" && path.method === "shop")
) {
  errors.push("Beatrix's Burmecia warning must distinguish the one-time steal copies from the sourced Phoenix Down, Chain Plate, and Mythril Sword recovery routes.");
}
const cleyraChapterEncounters = enemyEncounters.filter((encounter) => encounter.chapterId === "disc-2.cleyra");
const cleyraPoolExpectations = [
  { id: "encounter.cleyra-trunk.bottom-sand-base.random-pool", roster: ["enemy.dragonfly", "enemy.sand-golem", "enemy.zuu"] },
  { id: "encounter.cleyra-trunk.sandfall.random-pool", roster: ["enemy.dragonfly", "enemy.sand-golem"] },
  { id: "encounter.cleyra-trunk.path-to-cleyra.random-pool", roster: ["enemy.carrion-worm", "enemy.dragonfly"] },
  { id: "encounter.cleyra-trunk.sand-fork.random-pool", roster: ["enemy.carrion-worm", "enemy.dragonfly", "enemy.sand-golem"] },
  { id: "encounter.cleyra-trunk.quicksand.random-pool", roster: ["enemy.carrion-worm", "enemy.dragonfly", "enemy.sand-scorpion", "enemy.zuu"] },
];
const sameSortedValues = (left: string[], right: string[]) => [...left].sort().join("|") === [...right].sort().join("|");
if (cleyraChapterEncounters.length !== 16 || cleyraPoolExpectations.some(({ id, roster }) => {
  const pool = cleyraChapterEncounters.find((encounter) => encounter.id === id);
  return !pool || pool.kind !== "random-pool" || !sameSortedValues(pool.formation.map((member) => member.enemyId), roster) || pool.formation.some((member) => member.quantity !== null);
})) {
  errors.push("Cleyra must keep its five room-specific random pools separate and avoid inventing formation rates or counts.");
}
const cleyraSandScorpion = enemyRecords.find((enemy) => enemy.id === "enemy.sand-scorpion");
const cleyraPitFight = cleyraChapterEncounters.find((encounter) => encounter.id === "encounter.cleyra-trunk.quicksand-pit.sand-scorpion");
if (!cleyraPitFight || cleyraPitFight.kind !== "fixed" || !cleyraPitFight.formation.some((member) => member.enemyId === "enemy.sand-scorpion" && member.quantity === 1) ||
  !cleyraSandScorpion?.encounterIds.includes("encounter.cleyra-trunk.quicksand.random-pool") ||
  !cleyraSandScorpion.encounterIds.includes("encounter.cleyra-trunk.quicksand-pit.sand-scorpion") ||
  !cleyraSandScorpion.encounterIds.includes("encounter.burmecia-region.world-map-pool")) {
  errors.push("Sand Scorpion must retain its shared regional and Cleyra random appearances plus the distinct forced pit-fall fight.");
}
const cleyraBlueMagicTeachers = [
  { enemyId: "enemy.carrion-worm", skill: "Auto-Life" },
  { enemyId: "enemy.dragonfly", skill: "Matra Magic" },
  { enemyId: "enemy.zuu", skill: "White Wind" },
];
for (const teacher of cleyraBlueMagicTeachers) {
  const record = enemyRecords.find((enemy) => enemy.id === teacher.enemyId);
  if (!record?.blueMagic.some((skill) => skill.name === teacher.skill && skill.objectiveIds.includes("disc-2.cleyra.blue-magic")) ||
    !record.routeObjectiveIds.includes("disc-2.cleyra.blue-magic")) {
    errors.push(`Cleyra's ${teacher.skill} teacher must link to the existing Blue Magic objective.`);
  }
}
const outerContinentPoolExpectations = [
  { id: "encounter.outer-continent.dirt-pool", chapterId: "disc-2.outer-continent", roster: ["enemy.cactuar", "enemy.goblin-mage", "enemy.griffin", "enemy.zaghnol-b"] },
  { id: "encounter.outer-continent.grass-pool", chapterId: "disc-2.outer-continent", roster: ["enemy.goblin-mage", "enemy.griffin", "enemy.friendly-ladybird", "enemy.zaghnol-b"] },
  { id: "encounter.outer-continent.marsh-pool", chapterId: "disc-2.outer-continent", roster: ["enemy.griffin", "enemy.zaghnol-b"] },
  { id: "encounter.outer-continent.forest-pool", chapterId: "disc-2.outer-continent", roster: ["enemy.griffin", "enemy.friendly-ladybird", "enemy.zaghnol-b"] },
  { id: "encounter.outer-continent.beach-pool", chapterId: "disc-2.outer-continent", roster: ["enemy.griffin", "enemy.zaghnol-b"] },
  { id: "encounter.magdalene-forest.outer-forest-pool", chapterId: "disc-2.magdalene-forest", roster: ["enemy.griffin", "enemy.friendly-ladybird", "enemy.zaghnol-b"] },
  { id: "encounter.magdalene-forest.dead-forest-pool", chapterId: "disc-2.magdalene-forest", roster: ["enemy.griffin", "enemy.myconid", "enemy.zemzelett"] },
];
const outerContinentPools = enemyEncounters.filter((encounter) => encounter.chapterId === "disc-2.outer-continent" || encounter.chapterId === "disc-2.magdalene-forest");
if (outerContinentPools.length !== outerContinentPoolExpectations.length || outerContinentPoolExpectations.some(({ id, chapterId, roster }) => {
  const pool = outerContinentPools.find((encounter) => encounter.id === id);
  return !pool || pool.kind !== "random-pool" || pool.chapterId !== chapterId ||
    !sameSortedValues(pool.formation.map((member) => member.enemyId), roster) || pool.formation.some((member) => member.quantity !== null) ||
    !pool.sourceIds.includes(id === "encounter.magdalene-forest.dead-forest-pool" ? "gamefaqs-magdalene-forest-71891" : "gamefaqs-monster-list-20490") ||
    (id === "encounter.magdalene-forest.dead-forest-pool" && !pool.sourceIds.includes("gamefaqs-enemy-list-71891"));
})) {
  errors.push("Outer Continent and Magdalene Forest must retain five terrain pools, separate world-map and Dead Forest pools, and source-backed rosters without inventing formation counts or encounter odds.");
}
const forgottenContinentPoolExpectations = [
  { id: "encounter.forgotten-continent.blairsurpass-dirt-pool", roster: ["enemy.armstrong", "enemy.cactuar", "enemy.catoblepas", "enemy.jabberwock"] },
  { id: "encounter.forgotten-continent.blairsurpass-mountain-pool", roster: ["enemy.armstrong", "enemy.catoblepas"] },
  { id: "encounter.forgotten-continent.blairsurpass-grass-pool", roster: ["enemy.armstrong"] },
  { id: "encounter.forgotten-continent.blairsurpass-forest-pool", roster: ["enemy.armstrong", "enemy.friendly-jabberwock"] },
  { id: "encounter.forgotten-continent.blairsurpass-marsh-pool", roster: ["enemy.adamantoise"] },
  { id: "encounter.forgotten-continent.seaways-dirt-pool", roster: ["enemy.armstrong", "enemy.cactuar", "enemy.catoblepas", "enemy.jabberwock"] },
  { id: "encounter.forgotten-continent.seaways-sunrise-dirt-pool", roster: ["enemy.adamantoise", "enemy.armstrong", "enemy.cactuar", "enemy.catoblepas"] },
  { id: "encounter.forgotten-continent.seaways-mountain-pool", roster: ["enemy.armstrong", "enemy.catoblepas"] },
  { id: "encounter.forgotten-continent.seaways-grass-pool", roster: ["enemy.armstrong"] },
  { id: "encounter.forgotten-continent.seaways-sunrise-grass-pool", roster: ["enemy.armstrong", "enemy.friendly-jabberwock"] },
  { id: "encounter.forgotten-continent.seaways-forest-pool", roster: ["enemy.armstrong", "enemy.friendly-jabberwock"] },
];
const forgottenContinentPools = forgottenContinentPoolExpectations.map(({ id }) => enemyEncounters.find((encounter) => encounter.id === id));
if (forgottenContinentPools.some((pool, index) => {
  const expected = forgottenContinentPoolExpectations[index];
  return !pool || pool.kind !== "random-pool" || pool.chapterId !== "disc-3.forgotten-continent" ||
    !sameSortedValues(pool.formation.map((entry) => entry.enemyId), expected.roster) || pool.formation.some((entry) => entry.quantity !== null) ||
    !pool.sourceIds.includes("gamefaqs-monster-list-20490") || pool.missableIds.length !== 0 || pool.cutoffIds.length !== 0;
})) {
  errors.push("Forgotten Continent field pools must preserve the older terrain-specific Blairsurpass/Seaways rosters, remain repeatable, and avoid invented encounter rates.");
}
const forgottenContinentEnemyExpectations = [
  { id: "enemy.adamantoise", skill: "Earth Shake", objectiveId: "disc-3.forgotten-continent.earth-shake" },
  { id: "enemy.armstrong", skill: "Matra Magic", objectiveId: "disc-3.forgotten-continent.blue-magic-recovery" },
  { id: "enemy.catoblepas", skill: "Limit Glove", objectiveId: "disc-3.forgotten-continent.blue-magic-recovery" },
  { id: "enemy.jabberwock", skill: "Limit Glove", objectiveId: "disc-3.forgotten-continent.blue-magic-recovery" },
  { id: "enemy.cactuar", skill: "1,000 Needles", objectiveId: "disc-3.forgotten-continent.blue-magic-recovery" },
];
for (const expected of forgottenContinentEnemyExpectations) {
  const record = enemyRecords.find((enemy) => enemy.id === expected.id);
  if (!record?.blueMagic.some((skill) => skill.name === expected.skill && skill.objectiveIds.includes(expected.objectiveId)) ||
    !record.routeObjectiveIds.includes(expected.objectiveId)) {
    errors.push(`Forgotten Continent ${expected.skill} must link from ${expected.id} to its existing or new Blue Magic objective.`);
  }
}
const forgottenJabberwock = enemyRecords.find((enemy) => enemy.id === "enemy.jabberwock");
const friendlyJabberwock = enemyRecords.find((enemy) => enemy.id === "enemy.friendly-jabberwock");
const forgottenContinentBlueMagicObjective = objectivesById.get("disc-3.forgotten-continent.blue-magic-recovery");
const forgottenFieldWalkthrough = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent");
if (!forgottenJabberwock || forgottenJabberwock.kind !== "ordinary" ||
  !forgottenJabberwock.stats.some((stat) => stat.field === "EXP" && stat.value === 4675 && stat.verification === "disputed") ||
  !forgottenJabberwock.stats.some((stat) => stat.field === "EXP" && stat.value === 4685 && stat.verification === "disputed") ||
  !friendlyJabberwock || friendlyJabberwock.kind !== "friendly" || friendlyJabberwock.stats.some((stat) => stat.field === "HP") ||
  !friendlyJabberwock.stats.some((stat) => stat.field === "AP" && stat.value === 40) || friendlyJabberwock.steals.length !== 0 || friendlyJabberwock.drops.length !== 0 ||
  !friendlyJabberwock.routeObjectiveIds.includes("disc-3.forgotten-continent.jabberwock") ||
  forgottenContinentPools.some((pool) => pool?.formation.some((entry) => entry.enemyId === "enemy.jabberwock" && pool.id.includes("forest"))) ||
  !forgottenContinentBlueMagicObjective?.title.includes("Limit Glove") || !forgottenContinentBlueMagicObjective.title.includes("Matra Magic") ||
  !forgottenContinentBlueMagicObjective.title.includes("1,000 Needles") ||
  !forgottenFieldWalkthrough?.sections.some((section) => section.steps.some((step) => step.id === "forgotten-continent-encounters" &&
    step.objectiveIds?.includes("disc-3.forgotten-continent.blue-magic-recovery") && step.detail?.includes("Friendly Jabberwock is a separate")))) {
  errors.push("Forgotten Continent must distinguish ordinary and Friendly Jabberwock, preserve its EXP conflict, and route each Blue Magic source without merging their encounter data.");
}
const outerContinentAndDeadForestBlueMagicTeachers = [
  { enemyId: "enemy.cactuar", skill: "1,000 Needles" },
  { enemyId: "enemy.goblin-mage", skill: "Goblin Punch" },
  { enemyId: "enemy.griffin", skill: "White Wind" },
  { enemyId: "enemy.zaghnol-b", skill: "Matra Magic" },
  { enemyId: "enemy.myconid", skill: "Mighty Guard" },
  { enemyId: "enemy.zemzelett", skill: "White Wind" },
];
for (const teacher of outerContinentAndDeadForestBlueMagicTeachers) {
  const record = enemyRecords.find((enemy) => enemy.id === teacher.enemyId);
  if (!record?.blueMagic.some((skill) => skill.name === teacher.skill && skill.objectiveIds.includes("disc-2.outer-continent.blue-magic")) ||
    !record.routeObjectiveIds.includes("disc-2.outer-continent.blue-magic")) {
    errors.push(`Outer Continent ${teacher.skill} teacher must link to its existing Blue Magic objective.`);
  }
}
const outerCactuar = enemyRecords.find((enemy) => enemy.id === "enemy.cactuar");
const outerGoblinMage = enemyRecords.find((enemy) => enemy.id === "enemy.goblin-mage");
const outerZaghnol = enemyRecords.find((enemy) => enemy.id === "enemy.zaghnol-b");
const hasDisputedStatValues = (record: typeof outerCactuar, field: string, values: number[]) => values.every((value) => record?.stats.some((stat) => stat.field === field && stat.value === value && stat.verification === "disputed"));
if (!hasDisputedStatValues(outerCactuar, "level", [1, 30]) || !hasDisputedStatValues(outerCactuar, "AP", [2, 3]) ||
  !hasDisputedStatValues(outerGoblinMage, "AP", [0, 1, 2]) || !hasDisputedStatValues(outerZaghnol, "MP", [489, 499]) || !hasDisputedStatValues(outerZaghnol, "AP", [2, 3])) {
  errors.push("Outer Continent Cactuar, Goblin Mage, and Zaghnol stat disagreements must remain separate disputed claims.");
}
const friendlyLadybird = enemyRecords.find((enemy) => enemy.id === "enemy.friendly-ladybird");
if (!friendlyLadybird || friendlyLadybird.kind !== "friendly" || friendlyLadybird.stats.some((stat) => stat.field === "HP") ||
  !friendlyLadybird.stats.some((stat) => stat.field === "AP" && stat.value === 20) || friendlyLadybird.steals.length !== 0 || friendlyLadybird.drops.length !== 0 ||
  !friendlyLadybird.routeObjectiveIds.includes("disc-2.outer-continent.friendly-ladybug") ||
  outerContinentPools.some((pool) => pool.formation.some((member) => member.enemyId === "enemy.ladybird"))) {
  errors.push("Friendly Ladybird must remain a separate non-hostile record and must not inherit ordinary Ladybird combat loot or stats.");
}
const mountainPathPoolExpectations = [
  { id: "encounter.conde-petie-mountain-path.random-pool", kind: "random-pool", roster: ["enemy.gnoll", "enemy.ochu", "enemy.troll"] },
  { id: "encounter.conde-petie-mountain-path.hilgigars", kind: "boss", roster: ["enemy.hilgigars"] },
  { id: "encounter.conde-petie-mountain-path.lucid-plains-pool", kind: "random-pool", roster: ["enemy.blazer-beetle", "enemy.goblin-mage", "enemy.troll"] },
  { id: "encounter.conde-petie-mountain-path.friendly-yeti", kind: "random-pool", roster: ["enemy.friendly-yeti"] },
];
const mountainPathEncounters = enemyEncounters.filter((encounter) => encounter.chapterId === "disc-2.conde-petie-mountain-path");
if (mountainPathEncounters.length !== mountainPathPoolExpectations.length || mountainPathPoolExpectations.some(({ id, kind, roster }) => {
  const encounter = mountainPathEncounters.find((candidate) => candidate.id === id);
  const expectedSource = id === "encounter.conde-petie-mountain-path.random-pool" ? "gamefaqs-enemy-list-71891" : "gamefaqs-conde-petie-mountain-path-71891";
  return !encounter || encounter.kind !== kind || !sameSortedValues(encounter.formation.map((member) => member.enemyId), roster) ||
    (kind === "random-pool" && encounter.formation.some((member) => member.quantity !== null)) ||
    !encounter.sourceIds.includes(expectedSource);
})) {
  errors.push("Conde Petie Mountain Path and Lucid Plains must retain their separate source-backed rosters and the dedicated Friendly Yeti encounter without inferred formations.");
}
const hilgigarsEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.conde-petie-mountain-path.hilgigars");
const hilgigarsRecord = enemyRecords.find((enemy) => enemy.id === "enemy.hilgigars");
const hilgigarsStealPathSlugs = itemAcquisitionPaths
  .filter((path) => path.walkthroughObjectiveIds?.includes("disc-2.conde-petie-mountain-path.hilgigars-steals"))
  .map((path) => path.itemId);
if (!hilgigarsEncounter || !hilgigarsRecord || hilgigarsRecord.kind !== "boss" ||
  !hilgigarsEncounter.objectiveIds.includes("disc-2.conde-petie-mountain-path.hilgigars-steals") ||
  !hilgigarsEncounter.missableIds.includes("missable.disc-2.conde-petie-mountain-path.hilgigars-steals") ||
  !hilgigarsEncounter.cutoffIds.includes("cutoff.conde-petie.hilgigars-steals") ||
  !["game-item.phoenix-down", "game-item.mythril-fork", "game-item.fairy-flute"].every((itemId) => hilgigarsStealPathSlugs.includes(itemId)) ||
  !hilgigarsRecord.notes.some((note) => note.includes("drop slots") && note.includes("Jegged"))) {
  errors.push("Hilgigars must link its boss record to the existing steal objective, warning, cutoff, three item paths, and source-specific drop disagreement.");
}
const friendlyYeti = enemyRecords.find((enemy) => enemy.id === "enemy.friendly-yeti");
const ordinaryYeti = enemyRecords.find((enemy) => enemy.id === "enemy.yeti");
const lucidPlainsPool = enemyEncounters.find((encounter) => encounter.id === "encounter.conde-petie-mountain-path.lucid-plains-pool");
if (!friendlyYeti || friendlyYeti.kind !== "friendly" || friendlyYeti.stats.some((stat) => stat.field === "HP") ||
  !friendlyYeti.stats.some((stat) => stat.field === "AP" && stat.value === 20) || friendlyYeti.steals.length !== 0 || friendlyYeti.drops.length !== 0 ||
  !friendlyYeti.routeObjectiveIds.includes("disc-2.conde-petie-mountain-path.friendly-yeti") ||
  !ordinaryYeti || ordinaryYeti.kind !== "ordinary" || ordinaryYeti.id === friendlyYeti.id ||
  lucidPlainsPool?.formation.some((member) => member.enemyId === "enemy.friendly-yeti") ||
  !lucidPlainsPool?.formation.some((member) => member.enemyId === "enemy.goblin-mage")) {
  errors.push("Lucid Plains must keep Friendly Yeti separate from ordinary Yeti combat and preserve Goblin Mage's shared Outer Continent record.");
}
const pinnacleRocksPools = enemyEncounters.filter((encounter) => encounter.chapterId === "disc-2.pinnacle-rocks");
const pinnacleRocksPool = pinnacleRocksPools.find((encounter) => encounter.id === "encounter.pinnacle-rocks.random-pool");
const seekerBat = enemyRecords.find((enemy) => enemy.id === "enemy.seeker-bat");
const pinnacleSandScorpion = enemyRecords.find((enemy) => enemy.id === "enemy.sand-scorpion");
const regularZaghnol = enemyRecords.find((enemy) => enemy.id === "enemy.zaghnol-b");
const festivalZaghnol = enemyRecords.find((enemy) => enemy.id === "enemy.zaghnol-hunt");
if (pinnacleRocksPools.length !== 1 || !pinnacleRocksPool || pinnacleRocksPool.kind !== "random-pool" ||
  !sameSortedValues(pinnacleRocksPool.formation.map((member) => member.enemyId), ["enemy.sand-scorpion", "enemy.seeker-bat", "enemy.zaghnol-b"]) ||
  pinnacleRocksPool.formation.some((member) => member.quantity !== null) ||
  !["gamefaqs-pinnacle-rocks-71891", "gamefaqs-enemy-list-71891", "cavesofnarshe-pinnacle-rocks"].every((sourceId) => pinnacleRocksPool.sourceIds.includes(sourceId)) ||
  !seekerBat || seekerBat.chapterId !== "disc-2.pinnacle-rocks" ||
  ![ ["level", 12], ["HP", 594], ["MP", 377], ["EXP", 449], ["AP", 2], ["Gil", 366] ].every(([field, value]) => seekerBat.stats.some((stat) => stat.field === field && stat.value === value)) ||
  !seekerBat.blueMagic.some((skill) => skill.name === "Night" && skill.command === "Eat" && skill.objectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night")) ||
  !seekerBat.routeObjectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night") ||
  !pinnacleRocksPool.objectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night") ||
  !seekerBat.notes.some((note) => note.includes("transposes") && note.includes("Caves of Narshe")) ||
  !pinnacleSandScorpion?.encounterIds.includes("encounter.pinnacle-rocks.random-pool") ||
  !regularZaghnol?.encounterIds.includes("encounter.pinnacle-rocks.random-pool") ||
  festivalZaghnol?.encounterIds.includes("encounter.pinnacle-rocks.random-pool")) {
  errors.push("Pinnacle Rocks must preserve its source-backed Sand Scorpion/Seeker Bat/regular Zaghnol pool, Seeker Bat's partial teacher/table data, and distinct Festival form.");
}
const fossilRooPools = enemyEncounters.filter((encounter) => encounter.chapterId === "disc-2.journey-to-outer-continent");
const fossilRooPool = enemyEncounters.find((encounter) => encounter.id === "encounter.fossil-roo.random-pool");
const abomination = enemyRecords.find((enemy) => enemy.id === "enemy.abomination");
const featherCircle = enemyRecords.find((enemy) => enemy.id === "enemy.feather-circle");
const griffin = enemyRecords.find((enemy) => enemy.id === "enemy.griffin");
const fossilSeekerBat = enemyRecords.find((enemy) => enemy.id === "enemy.seeker-bat");
const lostContinentFeatherTeacher = enemyEncounters.find((encounter) => encounter.id === "encounter.lost-continent.feather-circle-teacher");
const friendlyFeatherEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.lost-continent.friendly-feather-circle");
const friendlyFeather = enemyRecords.find((enemy) => enemy.id === "enemy.friendly-feather-circle");
if (fossilRooPools.length !== 2 || !fossilRooPool || fossilRooPool.kind !== "random-pool" ||
  !sameSortedValues(fossilRooPool.formation.map((member) => member.enemyId), ["enemy.abomination", "enemy.feather-circle", "enemy.griffin", "enemy.seeker-bat"]) ||
  fossilRooPool.formation.some((member) => member.quantity !== null) ||
  !["gamefaqs-enemy-list-71891", "gamefaqs-journey-to-outer-continent-71891", "jegged-fossil-roo"].every((sourceId) => fossilRooPool.sourceIds.includes(sourceId)) ||
  !fossilRooPool.objectiveIds.includes("disc-2.journey-to-outer-continent.blue-magic") ||
  !fossilRooPool.objectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night") ||
  !abomination?.encounterIds.includes("encounter.fossil-roo.random-pool") ||
  !abomination.blueMagic.some((skill) => skill.name === "Night" && skill.command === "Eat" && skill.objectiveIds.includes("disc-1.journey-to-burmecia.blue-magic-night")) ||
  !featherCircle?.encounterIds.includes("encounter.fossil-roo.random-pool") ||
  !featherCircle.blueMagic.some((skill) => skill.name === "LV4 Holy" && skill.command === "Eat" && skill.objectiveIds.includes("disc-2.journey-to-outer-continent.blue-magic")) ||
  !featherCircle.notes.some((note) => note.includes("Caves of Narshe") && note.includes("Water resistance")) ||
  !griffin?.encounterIds.includes("encounter.fossil-roo.random-pool") ||
  !griffin.blueMagic.some((skill) => skill.name === "White Wind" && skill.objectiveIds.includes("disc-2.outer-continent.blue-magic")) ||
  !fossilSeekerBat?.encounterIds.includes("encounter.fossil-roo.random-pool") ||
  !lostContinentFeatherTeacher || lostContinentFeatherTeacher.chapterId !== "disc-3.lost-continent" ||
  !sameSortedValues(lostContinentFeatherTeacher.formation.map((member) => member.enemyId), ["enemy.feather-circle"]) ||
  !lostContinentFeatherTeacher.notes.some((note) => note.includes("not a complete Lost Continent encounter roster")) ||
  !friendlyFeatherEncounter || !sameSortedValues(friendlyFeatherEncounter.formation.map((member) => member.enemyId), ["enemy.friendly-feather-circle"]) ||
  !friendlyFeatherEncounter.objectiveIds.includes("disc-3.lost-continent.feather-circle") ||
  !friendlyFeather || friendlyFeather.kind !== "friendly" || friendlyFeather.stats.length !== 0 ||
  !friendlyFeather.routeObjectiveIds.includes("disc-3.lost-continent.feather-circle") ||
  !friendlyFeather.strategies.some((strategy) => strategy.detail.includes("Moonstone") && strategy.detail.includes("Lapis Lazuli") && strategy.detail.includes("30 AP")) ||
  fossilRooPool?.formation.some((member) => member.enemyId === "enemy.friendly-feather-circle") ||
  friendlyFeatherEncounter?.formation.some((member) => member.enemyId === "enemy.feather-circle")) {
  errors.push("Fossil Roo must preserve its four-enemy pool, source-backed Blue Magic links, scoped Lost Continent Feather Circle opportunity, and separate Friendly Feather Circle record/reward.");
}
const huntZaghnol = enemyRecords.find((enemy) => enemy.id === "enemy.zaghnol-hunt");
if (outerZaghnol?.encounterIds.includes("encounter.lindblum.festival-zaghnol") || huntZaghnol?.encounterIds.some((encounterId) => encounterId.startsWith("encounter.outer-continent."))) {
  errors.push("The world-map Zaghnol [B] and Festival of the Hunt Zaghnol must remain separate variants.");
}
const cleyraSoldier = enemyRecords.find((enemy) => enemy.id === "enemy.soldier-a");
const cleyraReturnIds = [
  "encounter.cleyra-trunk.return.whirlpool-soldiers",
  "encounter.cleyra-trunk.return.sand-pit-soldiers",
  "encounter.cleyra-trunk.return.bridge-cave-soldiers",
];
const cleyraReturnFights = cleyraReturnIds.map((id) => cleyraChapterEncounters.find((encounter) => encounter.id === id));
if (!cleyraSoldier || !cleyraSoldier.stats.some((stat) => stat.field === "HP" && stat.value === 523) ||
  !cleyraSoldier.notes.some((note) => note.includes("distinct from Soldier [B]")) ||
  cleyraReturnFights.some((encounter) => !encounter || encounter.kind !== "fixed" || !encounter.formation.some((member) => member.enemyId === "enemy.soldier-a")) ||
  cleyraReturnFights[0]?.formation.find((member) => member.enemyId === "enemy.soldier-a")?.quantity !== 2 ||
  cleyraReturnFights.slice(1).some((encounter) => encounter?.formation.find((member) => member.enemyId === "enemy.soldier-a")?.quantity !== 2)) {
  errors.push("Cleyra's post-Antlion Trunk return must use its Soldier [A] variant and preserve the source-reported pair formation with its quantity caveat.");
}
const cleyraAssaultExpectations = [
  { id: "encounter.cleyra-assault.entrance-type-b", formation: ["enemy.type-b:1"] },
  { id: "encounter.cleyra-assault.first-soldiers", formation: ["enemy.soldier-a:3"] },
  { id: "encounter.cleyra-assault.first-type-b-pair", formation: ["enemy.type-b:2"] },
  { id: "encounter.cleyra-assault.soldiers-and-type-b", formation: ["enemy.soldier-a:2", "enemy.type-b:1"] },
  { id: "encounter.cleyra-assault.final-soldiers", formation: ["enemy.soldier-a:3"] },
];
for (const expected of cleyraAssaultExpectations) {
  const encounter = cleyraChapterEncounters.find((candidate) => candidate.id === expected.id);
  const formation = encounter?.formation.map((member) => `${member.enemyId}:${member.quantity}`).sort() ?? [];
  if (!encounter || encounter.kind !== "fixed" || !sameSortedValues(formation, expected.formation)) {
    errors.push(`Cleyra's fixed assault formation ${expected.id} must match its source-backed wave.`);
  }
}
const cleyraBossChecks = [
  {
    encounterId: "encounter.cleyra.antlion",
    enemyId: "enemy.antlion-cleyra",
    objectiveId: "disc-2.cleyra.antlion-steals",
    missableId: "missable.disc-2.cleyra.antlion-steals",
    cutoffId: "cutoff.cleyra-antlion.boss-steals",
    steals: [
      { itemId: "game-item.annoyntment", pathId: "item-path.disc-2.cleyra.antlion-annoyntment-steal" },
      { itemId: "game-item.mythril-vest", pathId: "item-path.disc-2.cleyra.mythril-vest-antlion-steal" },
      { itemId: "game-item.gold-helm", pathId: "item-path.disc-2.cleyra.antlion-gold-helm-steal" },
    ],
  },
  {
    encounterId: "encounter.cleyra.beatrix",
    enemyId: "enemy.beatrix-cleyra",
    objectiveId: "disc-2.cleyra.beatrix-steals",
    missableId: "missable.disc-2.cleyra.beatrix-steals",
    cutoffId: "cutoff.cleyra-beatrix.boss-steals",
    steals: [
      { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.cleyra.beatrix-phoenix-down-steal" },
      { itemId: "game-item.thunder-gloves", pathId: "item-path.disc-2.cleyra.beatrix-thunder-gloves-steal" },
      { itemId: "game-item.ice-brand", pathId: "item-path.disc-2.cleyra.beatrix-ice-brand-steal" },
    ],
  },
];
for (const expected of cleyraBossChecks) {
  const encounter = enemyEncounters.find((candidate) => candidate.id === expected.encounterId);
  const boss = enemyRecords.find((candidate) => candidate.id === expected.enemyId);
  if (!encounter || encounter.kind !== "boss" || encounter.chapterId !== "disc-2.cleyra" ||
    !encounter.formation.some((member) => member.enemyId === expected.enemyId && member.quantity === 1) ||
    !encounter.objectiveIds.includes(expected.objectiveId) || !encounter.missableIds.includes(expected.missableId) || !encounter.cutoffIds.includes(expected.cutoffId) ||
    !boss || boss.kind !== "boss" || !boss.routeObjectiveIds.includes(expected.objectiveId) || !boss.missableIds.includes(expected.missableId) || !boss.cutoffIds.includes(expected.cutoffId)) {
    errors.push(`${expected.enemyId} must connect its one-time encounter to the existing objective, missable warning, and cutoff.`);
    continue;
  }
  for (const steal of expected.steals) {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === steal.pathId);
    if (!boss.steals.some((slot) => slot.itemId === steal.itemId) || !path || path.itemId !== steal.itemId || path.method !== "steal" ||
      path.availability !== "one-time-encounter" || !path.walkthroughObjectiveIds?.includes(expected.objectiveId)) {
      errors.push(`${expected.enemyId}'s ${steal.itemId} steal must connect to its existing one-time item path.`);
    }
  }
}
const alexandriaBeatrixEncounter = enemyEncounters.find((candidate) => candidate.id === "encounter.return-to-alexandria.beatrix");
const alexandriaBeatrix = enemyRecords.find((candidate) => candidate.id === "enemy.beatrix-alexandria");
const alexandriaBeatrixSteals = [
  { itemId: "game-item.phoenix-down", pathId: "item-path.disc-2.return-to-alexandria.beatrix-phoenix-down-steal" },
  { itemId: "game-item.ice-brand", pathId: "item-path.disc-2.return-to-alexandria.beatrix-ice-brand-steal" },
  { itemId: "game-item.survival-vest", pathId: "item-path.disc-2.return-to-alexandria.survival-vest-beatrix-steal" },
];
if (!alexandriaBeatrixEncounter || alexandriaBeatrixEncounter.kind !== "boss" ||
  alexandriaBeatrixEncounter.chapterId !== "disc-2.return-to-alexandria" ||
  !alexandriaBeatrixEncounter.formation.some((member) => member.enemyId === "enemy.beatrix-alexandria" && member.quantity === 1) ||
  !alexandriaBeatrixEncounter.objectiveIds.includes("disc-2.return-to-alexandria.beatrix-steals") ||
  !alexandriaBeatrixEncounter.missableIds.includes("missable.disc-2.return-to-alexandria.beatrix-steals") ||
  !alexandriaBeatrixEncounter.cutoffIds.includes("cutoff.alexandria-rescue.beatrix-steals") ||
  !alexandriaBeatrix || alexandriaBeatrix.kind !== "boss" ||
  !alexandriaBeatrix.routeObjectiveIds.includes("disc-2.return-to-alexandria.beatrix-steals") ||
  !alexandriaBeatrix.missableIds.includes("missable.disc-2.return-to-alexandria.beatrix-steals") ||
  !alexandriaBeatrix.cutoffIds.includes("cutoff.alexandria-rescue.beatrix-steals") ||
  !alexandriaBeatrix.stats.some((stat) => stat.field === "HP" && stat.value === 3352 && stat.sourceIds.includes("gamefaqs-return-to-alexandria-71891"))) {
  errors.push("Alexandria's third Beatrix battle must connect its source-backed boss record, encounter, checklist, warning, and cutoff.");
}
for (const expected of alexandriaBeatrixSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!alexandriaBeatrix?.steals.some((slot) => slot.itemId === expected.itemId) || !path || path.itemId !== expected.itemId ||
    path.chapterId !== "disc-2.return-to-alexandria" || path.method !== "steal" || path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.beatrix-steals") ||
    !path.sourceIds.includes("gamefaqs-return-to-alexandria-71891")) {
    errors.push(`Alexandria Beatrix's ${expected.itemId} steal must link the enemy table, one-time item path, and warning objective.`);
  }
}
const cleyraAntlion = enemyRecords.find((enemy) => enemy.id === "enemy.antlion-cleyra");
const cleyraBeatrix = enemyRecords.find((enemy) => enemy.id === "enemy.beatrix-cleyra");
if (!cleyraAntlion?.drops.some((slot) => slot.slot === "always" && slot.itemId === "game-item.annoyntment") ||
  cleyraAntlion.drops.filter((slot) => slot.itemId === "game-item.ether").length !== 3 ||
  !cleyraBeatrix?.stats.some((stat) => stat.field === "MP" && stat.value === 3964 && stat.verification === "disputed") ||
  !cleyraBeatrix.stats.some((stat) => stat.field === "MP" && stat.value === 3694 && stat.verification === "disputed")) {
  errors.push("Cleyra must separate Antlion's guaranteed and conditional drops and preserve Beatrix's published MP conflict.");
}
const qualeEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.qus-marsh.quale-99-frogs");
const qualeRecord = enemyRecords.find((enemy) => enemy.id === "enemy.quale");
if (!qualeEncounter || qualeEncounter.kind !== "boss" ||
  !qualeEncounter.formation.some((entry) => entry.enemyId === "enemy.quale" && entry.quantity === 1) ||
  !qualeEncounter.objectiveIds.includes("disc-4.return-to-gaia.frog-catching") ||
  !qualeRecord || qualeRecord.kind !== "boss" || qualeRecord.chapterId !== "disc-4.return-to-gaia" || qualeRecord.routeObjectiveIds.length !== 1 ||
  !qualeRecord.steals.some((slot) => slot.itemId === "game-item.gluttons-robe") ||
  qualeRecord.drops.filter((slot) => slot.itemId === "game-item.elixir").length !== 4 ||
  !qualeRecord.notes.some((note) => note.includes("Gastro Fork"))) {
  errors.push("Quale must link the optional 99-frog boss encounter, its four Elixir drops, Glutton's Robe steal, and frog-catching objective.");
}
const huntPool = enemyEncounters.find((encounter) => encounter.id === "encounter.lindblum.festival-random-pool");
const huntEnemyIds = ["enemy.fang-b", "enemy.mu-b", "enemy.trick-sparrow-hunt"];
if (!huntPool || huntPool.kind !== "random-pool" || huntPool.chapterId !== "disc-1.lindblum" ||
  huntEnemyIds.some((enemyId) => !huntPool.formation.some((entry) => entry.enemyId === enemyId)) ||
  !huntPool.cutoffIds.includes("cutoff.lindblum-festival.vivi-outcome") ||
  !huntPool.missableIds.includes("missable.disc-1.lindblum.festival-vivi")) {
  errors.push("Festival random battles must use the three distinct Hunt entries and link the one-time outcome cutoff.");
}
const huntFang = enemyRecords.find((enemy) => enemy.id === "enemy.fang-b");
const huntMu = enemyRecords.find((enemy) => enemy.id === "enemy.mu-b");
const huntTrickSparrow = enemyRecords.find((enemy) => enemy.id === "enemy.trick-sparrow-hunt");
if (huntFang?.stats.find((stat) => stat.field === "HP")?.value !== 216 || huntFang.stats.find((stat) => stat.field === "level")?.value !== 5 ||
  huntMu?.stats.find((stat) => stat.field === "HP")?.value !== 201 || huntMu.stats.find((stat) => stat.field === "level")?.value !== 5 ||
  !huntMu?.notes.some((note) => note.includes("Holy resistance and Shadow weakness") && note.includes("GameFAQs lists neither")) ||
  !huntTrickSparrow?.stats.some((stat) => stat.field === "EXP" && stat.value === 65 && stat.verification === "disputed") ||
  !huntTrickSparrow?.stats.some((stat) => stat.field === "EXP" && stat.value === 0 && stat.verification === "disputed") ||
  !huntTrickSparrow?.notes.some((note) => note.includes("Caves of Narshe's Hunt row") && note.includes("no steals or drops"))) {
  errors.push("Hunt-only Fang/Mu stats and the Mu/Trick Sparrow source conflicts must remain represented as separate partial records.");
}
const zaghnolHuntEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.lindblum.festival-zaghnol");
const zaghnolHunt = enemyRecords.find((enemy) => enemy.id === "enemy.zaghnol-hunt");
if (!zaghnolHuntEncounter || zaghnolHuntEncounter.kind !== "boss" ||
  !zaghnolHuntEncounter.formation.some((entry) => entry.enemyId === "enemy.zaghnol-hunt" && entry.quantity === 1) ||
  !zaghnolHuntEncounter.objectiveIds.includes("disc-1.lindblum.zaghnol-steals") ||
  !zaghnolHuntEncounter.missableIds.includes("missable.disc-1.lindblum.zaghnol-steals") ||
  !zaghnolHuntEncounter.cutoffIds.includes("cutoff.lindblum-festival.vivi-outcome") ||
  zaghnolHunt?.stats.find((stat) => stat.field === "HP")?.value !== 1574 ||
  !zaghnolHunt?.notes.some((note) => note.includes("Caves of Narshe's event table lists no stolen items"))) {
  errors.push("The Festival Zaghnol battle must stay separate from the regular form and preserve its sourced steal disagreement and cutoff links.");
}
for (const [itemId, pathId] of [
  ["game-item.mythril-gloves", "item-path.disc-1.lindblum.zaghnol-mythril-gloves-steal"],
  ["game-item.needle-fork", "item-path.disc-1.lindblum.zaghnol-needle-fork-steal"],
] as const) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  if (!zaghnolHunt?.steals.some((slot) => slot.itemId === itemId) || !zaghnolHunt.routeObjectiveIds.includes("disc-1.lindblum.zaghnol-steals") ||
    path?.itemId !== itemId || path.availability !== "one-time-encounter" || !path.walkthroughObjectiveIds?.includes("disc-1.lindblum.zaghnol-steals")) {
    errors.push(`Zaghnol's ${itemId} steal must link the boss table, checklist objective, one-time item path, and cutoff warning.`);
  }
  const recoveryPath = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-2.return-to-lindblum.cleyra-recovery.${itemId.replace("game-item.", "")}`);
  if (recoveryPath?.itemId !== itemId || recoveryPath.availability !== "window-unverified") {
    errors.push(`Zaghnol's ${itemId} steal warning must have a later Lindblum item-type recovery route.`);
  }
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
const pinnacleOgreChest = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.pinnacle-rocks.the-ogre-chest");
if (!pinnacleOgreChest || pinnacleOgreChest.itemId !== "game-item.the-ogre" || pinnacleOgreChest.chapterId !== "disc-2.pinnacle-rocks" ||
  pinnacleOgreChest.method !== "chest" || pinnacleOgreChest.quantity !== 1 || pinnacleOgreChest.availability !== "single-use" ||
  !pinnacleOgreChest.walkthroughObjectiveIds?.includes("disc-2.pinnacle-rocks.treasure-sweep")) {
  errors.push("Pinnacle Rocks The Ogre chest needs a single-use acquisition path linked to its treasure-sweep objective.");
}
for (const sourceId of ["gamefaqs-items-71891", "gamefaqs-pinnacle-rocks-71891", "jegged-pinnacle-rocks", "gamerguides-pinnacle-rocks", "rpgclassics-pinnacle-rocks"]) {
  if (!pinnacleOgreChest?.sourceIds.includes(sourceId)) errors.push(`Pinnacle Rocks The Ogre chest is missing source ${sourceId}.`);
}
const theOgreRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.the-ogre-synthesis");
if (!theOgreRecovery || theOgreRecovery.itemId !== "game-item.the-ogre" || theOgreRecovery.method !== "synthesis" ||
  theOgreRecovery.chapterId !== "disc-4.return-to-gaia" || theOgreRecovery.recipeId !== "synthesis-recipe.the-ogre" ||
  theOgreRecovery.cost?.currency !== "gil" || theOgreRecovery.cost.amount !== 700 ||
  !theOgreRecovery.sourceIds.includes("gamefaqs-shops-71891")) {
  errors.push("The Ogre needs its source-linked 700-Gil Disc IV synthesis recovery path.");
}
const mythrilArmletLateRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-home-front.zorn-thorn.mythril-armlet-alexandria-shop");
if (!mythrilArmletLateRecovery || mythrilArmletLateRecovery.itemId !== "game-item.mythril-armlet" || mythrilArmletLateRecovery.chapterId !== "disc-3.the-home-front") {
  errors.push("Mythril Armlet needs a later shop path in addition to its Pinnacle Rocks chest.");
}
const pinnacleWarning = missablesById.get("missable.disc-2.pinnacle-rocks.treasure-sweep");
if (!pinnacleWarning?.classification.includes("recoverable-later") ||
  /replacement paths for The Ogre and Mythril Armlet.*need review/i.test(pinnacleWarning.recovery) ||
  !pinnacleWarning.recovery.includes("The Ogre") || !pinnacleWarning.recovery.includes("Mythril Armlet")) {
  errors.push("Pinnacle Rocks' warning must separate lost chest copies from the later The Ogre and Mythril Armlet item routes.");
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
const iifaTreePickupItems = [
  ["item-path.disc-2.iifa-tree.phoenix-down-chest", "game-item.phoenix-down"],
  ["item-path.disc-2.iifa-tree.healing-rod-chest", "game-item.healing-rod"],
  ["item-path.disc-2.iifa-tree.hi-potion-chest", "game-item.hi-potion"],
  ["item-path.disc-2.iifa-tree.ether-hidden-chest", "game-item.ether"],
  ["item-path.disc-2.iifa-tree.lamias-flute-chest", "game-item.lamias-flute"],
  ["item-path.disc-2.iifa-tree.remedy-chest", "game-item.remedy"],
  ["item-path.disc-2.iifa-tree.elixir-chest", "game-item.elixir"],
  ["item-path.disc-2.iifa-tree.brigandine-chest", "game-item.brigandine"],
] as const;
for (const [pathId, itemId] of iifaTreePickupItems) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  if (!gameItemIds.has(itemId) || !path || path.itemId !== itemId || path.chapterId !== "disc-2.iifa-tree" || path.method !== "chest" ||
      path.availability !== "single-use" || !path.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.treasure-sweep") ||
      !path.sourceIds.includes("gamefaqs-iifa-tree-71891") || !path.sourceIds.includes("rpgclassics-iifa-tree")) {
    errors.push(`Iifa Tree's eight-pickup audit is missing a source-linked chest path for ${itemId}.`);
  }
  if (!gameItems.find((item) => item.id === itemId)?.sourceIds.includes("rpgclassics-iifa-tree")) {
    errors.push(`Iifa Tree item ${itemId} needs the registered RPGClassics area cross-check.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === itemId && (candidate.chapterId.startsWith("disc-3.") || candidate.chapterId.startsWith("disc-4.")))) {
    errors.push(`Iifa Tree item type ${itemId} needs a later Disc III or Disc IV acquisition route.`);
  }
}
const iifaTreeWarning = missables.find((warning) => warning.id === "missable.disc-2.iifa-tree.treasure-sweep");
if (!iifaTreeWarning || !iifaTreeWarning.recovery.toLowerCase().includes("all eight item types") || !iifaTreeWarning.sourceIds.includes("rpgclassics-iifa-tree")) {
  errors.push("The Iifa Tree warning must separate the closed chest copies from the later-recoverable item types and preserve RPGClassics provenance.");
}
const iifaTreeShopExpectations = new Map([
  ["game-item.healing-rod", { count: 5, price: 1770 }],
  ["game-item.lamias-flute", { count: 4, price: 3800 }],
  ["game-item.brigandine", { count: 5, price: 4300 }],
]);
for (const [itemId, expected] of iifaTreeShopExpectations) {
  const shopPaths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && (path.method === "shop" || path.method === "mogshop"));
  if (shopPaths.length !== expected.count || shopPaths.some((path) => path.cost?.currency !== "gil" || path.cost.amount !== expected.price)) {
    errors.push(`Iifa Tree recovery for ${itemId} needs ${expected.count} shop paths priced at ${expected.price} Gil; found ${shopPaths.length}.`);
  }
}
if (!itemAcquisitionPaths.some((path) => path.id === "item-path.disc-2.iifa-tree.soulcage-brigandine-steal" &&
    path.itemId === "game-item.brigandine" && path.method === "steal" && path.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.soulcage-steals"))) {
  errors.push("Brigandine recovery coverage needs the linked one-time Soulcage steal path.");
}
for (const [itemId, targetQuantity] of [["game-item.healing-rod", 2], ["game-item.lamias-flute", 2], ["game-item.brigandine", 3]] as const) {
  if (!sourceInventoryTargets.some((target) => target.itemId === itemId && target.targetQuantity === targetQuantity)) {
    errors.push(`Iifa Tree equipment ${itemId} needs its source-listed Need ${targetQuantity} inventory target.`);
  }
}
for (const [itemId, abilityName] of [
  ["game-item.healing-rod", "Healer"], ["game-item.healing-rod", "Cura"], ["game-item.healing-rod", "Life"],
  ["game-item.lamias-flute", "Float"], ["game-item.lamias-flute", "Stona"], ["game-item.lamias-flute", "Silence"],
  ["game-item.brigandine", "Ability Up"], ["game-item.brigandine", "Return Magic"],
] as const) {
  if (!equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName)) {
    errors.push(`Iifa Tree equipment ${itemId} needs its ${abilityName} ability claim.`);
  }
}
const magicianCloakSteal = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.iifa-tree.soulcage-magician-cloak-steal");
const soulcageStealWarning = missables.find((warning) => warning.id === "missable.disc-2.iifa-tree.soulcage-steals");
if (!gameItemIds.has("game-item.magician-cloak") || !magicianCloakSteal || magicianCloakSteal.itemId !== "game-item.magician-cloak" ||
    magicianCloakSteal.method !== "steal" || !magicianCloakSteal.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.soulcage-steals") ||
    !gameItems.find((item) => item.id === "game-item.magician-cloak")?.sourceIds.includes("ffwiki-magician-cloak")) {
  errors.push("Soulcage's Magician Cloak steal needs a catalog item, linked steal path, and registered equipment provenance.");
}
const magicianCloakShopPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.magician-cloak" && (path.method === "shop" || path.method === "mogshop"));
if (magicianCloakShopPaths.length !== 4 || magicianCloakShopPaths.some((path) => path.cost?.currency !== "gil" || path.cost.amount !== 1850)) {
  errors.push(`Magician Cloak recovery needs four later shop paths priced at 1,850 Gil; found ${magicianCloakShopPaths.length}.`);
}
if (!sourceInventoryTargets.some((target) => target.itemId === "game-item.magician-cloak" && target.targetQuantity === 5) ||
    !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.magician-cloak" && claim.abilityName === "Insomniac") ||
    !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.magician-cloak" && claim.abilityName === "MP+10%")) {
  errors.push("Magician Cloak needs the source-listed Need 5 target and both equipment ability claims.");
}
if (!soulcageStealWarning || !soulcageStealWarning.recovery.includes("Morrison's Madain Sari Mogshop") ||
    !soulcageStealWarning.sourceIds.includes("ffwiki-magician-cloak")) {
  errors.push("Soulcage's warning must distinguish lost steal copies from later Magician Cloak recovery and link its source.");
}
const firstIifaTreeRootPool = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.tree-roots-pool");
const firstIifaTreeInnerPool = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.inner-roots-pool");
const firstIifaTreeZombieTrio = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.fixed-zombie-trio");
const firstIifaTreeFixedDracozombie = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.fixed-dracozombie");
const firstIifaTreeSoulcageEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.soulcage");
const firstIifaTreeSoulcage = enemyRecords.find((enemy) => enemy.id === "enemy.soulcage");
const firstIifaTreeDracozombie = enemyRecords.find((enemy) => enemy.id === "enemy.dracozombie");
const firstIifaTreeStroper = enemyRecords.find((enemy) => enemy.id === "enemy.stroper");
const firstIifaTreeZombie = enemyRecords.find((enemy) => enemy.id === "enemy.zombie");
const iifaTreeMyconid = enemyRecords.find((enemy) => enemy.id === "enemy.myconid");
const firstIifaTreeExpectedRootRoster = new Set(["enemy.dracozombie", "enemy.myconid", "enemy.stroper", "enemy.zombie"]);
const firstIifaTreeExpectedInnerRoster = new Set(["enemy.dracozombie", "enemy.stroper", "enemy.zombie"]);
if (
  firstIifaTreeRootPool?.chapterId !== "disc-2.iifa-tree" ||
  firstIifaTreeRootPool.kind !== "random-pool" ||
  firstIifaTreeRootPool.formation.length !== firstIifaTreeExpectedRootRoster.size ||
  firstIifaTreeRootPool.formation.some(({ enemyId }) => !firstIifaTreeExpectedRootRoster.has(enemyId)) ||
  !iifaTreeMyconid?.encounterIds.includes("encounter.iifa-tree.tree-roots-pool")
) {
  errors.push("The Disc II Iifa Tree Tree Roots pool must include Dracozombie, Myconid, Stroper, and Zombie with the shared Myconid record linked.");
}
if (
  firstIifaTreeInnerPool?.chapterId !== "disc-2.iifa-tree" ||
  firstIifaTreeInnerPool.kind !== "random-pool" ||
  firstIifaTreeInnerPool.formation.length !== firstIifaTreeExpectedInnerRoster.size ||
  firstIifaTreeInnerPool.formation.some(({ enemyId }) => !firstIifaTreeExpectedInnerRoster.has(enemyId)) ||
  !firstIifaTreeInnerPool.objectiveIds.includes("disc-2.iifa-tree.lv5-death")
) {
  errors.push("The Disc II Iifa Tree Inner Roots pool must stay separate and link the later LV5 Death opportunity.");
}
if (
  firstIifaTreeZombieTrio?.kind !== "fixed" ||
  firstIifaTreeZombieTrio.formation[0]?.enemyId !== "enemy.zombie" ||
  firstIifaTreeZombieTrio.formation[0]?.quantity !== 3 ||
  firstIifaTreeFixedDracozombie?.kind !== "fixed" ||
  firstIifaTreeFixedDracozombie.formation[0]?.enemyId !== "enemy.dracozombie" ||
  firstIifaTreeFixedDracozombie.formation[0]?.quantity !== 1
) {
  errors.push("The Iifa Tree's fixed descent sequence must preserve its three-Zombie battle followed by one Dracozombie.");
}
if (
  firstIifaTreeSoulcageEncounter?.kind !== "boss" ||
  firstIifaTreeSoulcageEncounter.formation[0]?.enemyId !== "enemy.soulcage" ||
  !firstIifaTreeSoulcageEncounter.objectiveIds.includes("disc-2.iifa-tree.soulcage-steals") ||
  !firstIifaTreeSoulcageEncounter.missableIds.includes("missable.disc-2.iifa-tree.soulcage-steals") ||
  firstIifaTreeSoulcage?.kind !== "boss" ||
  !firstIifaTreeSoulcage.stats.some((claim) => claim.field === "HP" && claim.value === 9765 && claim.verification === "cross-checked") ||
  !firstIifaTreeSoulcage.routeObjectiveIds.includes("disc-2.iifa-tree.soulcage-steals")
) {
  errors.push("Soulcage's Disc II boss record must preserve its cross-checked HP and connect the one-time steal warning.");
}
if (
  !firstIifaTreeDracozombie?.blueMagic.some((claim) => claim.name === "LV5 Death" && claim.objectiveIds.includes("disc-2.iifa-tree.lv5-death")) ||
  !firstIifaTreeStroper?.blueMagic.some((claim) => claim.name === "LV5 Death" && claim.objectiveIds.includes("disc-2.iifa-tree.lv5-death")) ||
  !firstIifaTreeDracozombie.notes.some((note) => note.includes("Caves of Narshe") && note.includes("disagreement")) ||
  !firstIifaTreeZombie?.notes.some((note) => note.includes("Caves of Narshe") && note.includes("disagreement"))
) {
  errors.push("The Iifa Tree LV5 Death teachers and unresolved Dracozombie/Zombie elemental reads must remain linked and source-marked.");
}
const battleIifaMistodonPair = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree-return.mistodon-upper-pair");
const battleIifaMistodonSolo = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree-return.mistodon-after-dagger");
const battleIifaMistodonDownhillPool = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree-return.mistodon-reported-downhill-pool");
const battleIifaMistodon = enemyRecords.find((enemy) => enemy.id === "enemy.mistodon-a");
const battleIifaMistodonWarning = missablesById.get("missable.disc-2.battle-of-iifa-tree.mistodon-steals");
const battleIifaMistodonCutoff = cutoffsById.get("cutoff.iifa-tree-return.mistodon-steals");
if (
  battleIifaMistodonPair?.chapterId !== "disc-2.battle-of-iifa-tree" ||
  battleIifaMistodonPair.kind !== "fixed" ||
  battleIifaMistodonPair.formation[0]?.enemyId !== "enemy.mistodon-a" ||
  battleIifaMistodonPair.formation[0]?.quantity !== 2 ||
  battleIifaMistodonSolo?.kind !== "fixed" ||
  battleIifaMistodonSolo.formation[0]?.enemyId !== "enemy.mistodon-a" ||
  battleIifaMistodonSolo.formation[0]?.quantity !== 1 ||
  battleIifaMistodonDownhillPool?.kind !== "random-pool" ||
  battleIifaMistodonDownhillPool.formation[0]?.enemyId !== "enemy.mistodon-a" ||
  battleIifaMistodonDownhillPool.formation[0]?.quantity !== null ||
  !battleIifaMistodonDownhillPool.notes.some((note) => note.includes("story guides describe further Mistodon battles as waves"))
) {
  errors.push("The Disc II return must separate the fixed Mistodon pair/solo fight from the disputed downhill pool reports.");
}
if (
  battleIifaMistodon?.name !== "Mistodon [A] (Disc II)" ||
  !battleIifaMistodon.stats.some((claim) => claim.field === "HP" && claim.value === 1473 && claim.verification === "cross-checked") ||
  !battleIifaMistodon.stats.some((claim) => claim.field === "level" && claim.value === 19 && claim.verification === "cross-checked") ||
  !battleIifaMistodon.steals.some((slot) => slot.slot === "common" && slot.itemId === "game-item.ore") ||
  !battleIifaMistodon.steals.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.hi-potion") ||
  !battleIifaMistodon.drops.some((slot) => slot.slot === "common" && slot.itemId === "game-item.peridot") ||
  !battleIifaMistodon.drops.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.ether") ||
  !battleIifaMistodon.blueMagic.some((claim) => claim.name === "Angel's Snack" && claim.objectiveIds.includes("disc-2.battle-of-iifa-tree.angel-snack")) ||
  !battleIifaMistodon.routeObjectiveIds.includes("disc-2.battle-of-iifa-tree.mistodon-steals")
) {
  errors.push("Mistodon [A] needs the cross-checked Disc II stats, its sourced steals/drops, and the Angel's Snack/steal checklist links.");
}
if (
  !battleIifaMistodonWarning?.classification.includes("missable-opportunity") ||
  battleIifaMistodonCutoff?.certainty !== "disputed" ||
  !battleIifaMistodonCutoff.missableIds.includes(battleIifaMistodonWarning.id)
) {
  errors.push("The Mistodon [A] steal warning must preserve the disputed repeat-access cutoff without claiming permanent item loss.");
}
const scarletHair = enemyRecords.find((enemy) => enemy.id === "enemy.scarlet-hair");
const scarletHairEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.return-madain-sari.scarlet-hair");
const scarletHairWarning = missablesById.get("missable.disc-2.return-to-madain-sari.scarlet-hair-steals");
const scarletHairCutoff = cutoffsById.get("cutoff.return-to-madain-sari.scarlet-hair-steals");
const scarletHairHpClaims = scarletHair?.stats.filter((claim) => claim.field === "HP").map((claim) => claim.value).sort((a, b) => a - b) ?? [];
if (
  scarletHairEncounter?.chapterId !== "disc-2.return-to-madain-sari" ||
  scarletHairEncounter.kind !== "boss" ||
  scarletHairEncounter.formation[0]?.enemyId !== "enemy.scarlet-hair" ||
  scarletHairEncounter.formation[0]?.quantity !== 1 ||
  scarletHair?.kind !== "boss" ||
  !scarletHair.encounterIds.includes(scarletHairEncounter.id) ||
  !scarletHair.routeObjectiveIds.includes("disc-2.return-to-madain-sari.scarlet-hair-steals") ||
  !scarletHair.steals.some((slot) => slot.slot === "common" && slot.itemId === "game-item.ether") ||
  !scarletHair.steals.some((slot) => slot.slot === "uncommon" && slot.itemId === "game-item.poison-knuckles") ||
  !scarletHair.drops.some((slot) => slot.slot === "always" && slot.itemId === "game-item.tent") ||
  scarletHairHpClaims.join(",") !== "6800,8985,8986,18985" ||
  !scarletHair.stats.some((claim) => claim.field === "MP" && claim.value === 5865 && claim.verification === "disputed") ||
  !scarletHair.stats.some((claim) => claim.field === "MP" && claim.value === 5685 && claim.verification === "disputed") ||
  !scarletHair.notes.some((note) => note.includes("8,985, 8,986, 18,985, and 6,800")) ||
  !scarletHairWarning?.classification.includes("missable-opportunity") ||
  scarletHairCutoff?.certainty !== "source-supported" ||
  !scarletHairCutoff.missableIds.includes(scarletHairWarning.id)
) {
  errors.push("Scarlet Hair must remain a solo Eidolon Wall boss with its HP/MP disputes, sourced loot, and existing one-fight steal warning/cutoff.");
}
const scarletHairItemPathIds = [
  "item-path.disc-2.return-to-madain-sari.scarlet-hair-ether-steal",
  "item-path.disc-2.return-to-madain-sari.scarlet-hair-poison-knuckles-steal",
  "item-path.disc-2.return-to-madain-sari.scarlet-hair-tent-drop",
  "item-path.disc-2.outer-continent.poison-knuckles-conde-petie-shop",
  "item-path.disc-2.madain-sari.poison-knuckles-shop",
  "item-path.disc-3.the-home-front.poison-knuckles-alexandria-shop",
  "item-path.disc-3.card-tournament.poison-knuckles-treno-shop",
  "item-path.disc-3.on-the-high-seas.poison-knuckles-lindblum-shop",
  "item-path.disc-3.ipsens-castle.poison-knuckles-ipsen-mogshop",
];
if (
  !gameItemIds.has("game-item.poison-knuckles") ||
  scarletHairItemPathIds.some((pathId) => !itemAcquisitionPaths.some((path) => path.id === pathId)) ||
  !sourceInventoryTargets.some((target) => target.itemId === "game-item.poison-knuckles" && target.targetQuantity === 2) ||
  !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.poison-knuckles" && claim.abilityName === "Spare Change") ||
  !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.poison-knuckles" && claim.abilityName === "Counter")
) {
  errors.push("Scarlet Hair's Ether/Poison Knuckles/Tent acquisition and recovery paths, Poison Knuckles target, and weapon abilities must remain linked in the item catalog.");
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
const ipsensEnemyById = new Map(enemyRecords.filter((enemy) => enemy.chapterId === "disc-3.ipsens-castle").map((enemy) => [enemy.id, enemy]));
const ipsensEncounterById = new Map(enemyEncounters.filter((encounter) => encounter.chapterId === "disc-3.ipsens-castle").map((encounter) => [encounter.id, encounter]));
const expectedIpsensPools: Record<string, string[]> = {
  "encounter.ipsens-castle.initial-area-pool": ["enemy.agares", "enemy.cerberus", "enemy.gargoyle", "enemy.veteran"],
  "encounter.ipsens-castle.stairwell-lift-pool": ["enemy.agares", "enemy.cerberus", "enemy.gargoyle", "enemy.tonberry", "enemy.veteran"],
  "encounter.ipsens-castle.mural-room-pool": ["enemy.agares", "enemy.gargoyle", "enemy.tonberry", "enemy.veteran"],
  "encounter.ipsens-castle.treasure-hunting-pool": ["enemy.agares", "enemy.cerberus", "enemy.gargoyle", "enemy.tonberry", "enemy.veteran"],
};
const ipsensPoolsMismatch = Object.entries(expectedIpsensPools).some(([encounterId, enemyIds]) => {
  const encounter = ipsensEncounterById.get(encounterId);
  return encounter?.kind !== "random-pool"
    || enemyIds.some((enemyId) => !encounter.formation.some((member) => member.enemyId === enemyId))
    || encounter.formation.length !== enemyIds.length
    || !encounter.sourceIds.includes("gamefaqs-ipsens-castle-71891")
    || !encounter.sourceIds.includes("gamefaqs-enemy-list-71891");
});
const ipsensBlueMagicExpected = [
  ["enemy.cerberus", "Auto-Life"],
  ["enemy.gargoyle", "Mighty Guard"],
  ["enemy.veteran", "Doom"],
];
const ipsensBlueMagicMismatch = ipsensBlueMagicExpected.some(([enemyId, name]) => {
  const enemy = ipsensEnemyById.get(enemyId);
  return !enemy?.blueMagic.some((skill) => skill.name === name && skill.command === "Eat" && skill.objectiveIds.includes("disc-3.ipsens-castle.blue-magic"));
});
const ipsensTaharka = ipsensEnemyById.get("enemy.taharka");
const ipsensTaharkaEncounter = ipsensEncounterById.get("encounter.ipsens-castle.taharka");
const ipsensTaharkaWarning = missablesById.get("missable.disc-3.ipsens-castle.taharka-steals");
const ipsensTaharkaCutoff = cutoffsById.get("cutoff.ipsens-castle.taharka-steals");
const ipsensTaharkaStealPaths = [
  ["item-path.disc-3.ipsens-castle.taharka-elixir-steal", "game-item.elixir"],
  ["item-path.disc-3.ipsens-castle.taharka-mythril-claws-steal", "game-item.mythril-claws"],
  ["item-path.disc-3.ipsens-castle.taharka-orichalcon-steal", "game-item.orichalcon"],
] as const;
const ipsensTaharkaPathMismatch = ipsensTaharkaStealPaths.some(([pathId, itemId]) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  return path?.itemId !== itemId
    || path.chapterId !== "disc-3.ipsens-castle"
    || path.method !== "steal"
    || path.availability !== "one-time-encounter"
    || !path.walkthroughObjectiveIds?.includes("disc-3.ipsens-castle.taharka-steals");
});
if (
  ipsensPoolsMismatch || ipsensBlueMagicMismatch ||
  ipsensTaharka?.kind !== "boss" ||
  ipsensTaharka.stats.find((claim) => claim.field === "HP" && claim.verification === "cross-checked")?.value !== 29186 ||
  !ipsensTaharka.routeObjectiveIds.includes("disc-3.ipsens-castle.taharka-steals") ||
  !ipsensTaharka.routeObjectiveIds.includes(taharkaRamuhCardId) ||
  !ipsensTaharka.missableIds.includes("missable.disc-3.ipsens-castle.taharka-steals") ||
  !ipsensTaharka.cutoffIds.includes("cutoff.ipsens-castle.taharka-steals") ||
  ipsensTaharkaEncounter?.kind !== "boss" ||
  !ipsensTaharkaEncounter.objectiveIds.includes("disc-3.ipsens-castle.mirrors") ||
  ipsensTaharkaStealPaths.some(([pathId]) => !itemAcquisitionPaths.some((path) => path.id === pathId)) ||
  ipsensTaharkaPathMismatch ||
  !ipsensTaharkaWarning?.sourceIds.includes("rpgclassics-bestiary-t-z") ||
  ipsensTaharkaWarning.note?.includes("HP values vary") ||
  !ipsensTaharkaCutoff?.sourceIds.includes("rpgclassics-bestiary-t-z")
) {
  errors.push("Ipsen's Castle must preserve its four source-listed random pools, three linked Blue Magic teachers, fixed Taharka encounter, Ramuh Card objective, sourced HP consensus, and three one-time steal paths without the unsupported HP-variance claim.");
}
const ipsensTonberry = ipsensEnemyById.get("enemy.tonberry");
const ipsensVeteran = ipsensEnemyById.get("enemy.veteran");
if (
  !ipsensTonberry?.stats.some((claim) => claim.field === "HP" && claim.value === 7887 && claim.verification === "disputed") ||
  !ipsensTonberry.stats.some((claim) => claim.field === "HP" && claim.value === 7886 && claim.verification === "disputed") ||
  !ipsensTonberry.facts.some((fact) => fact.label.includes("Ice") && fact.sourceIds.includes("rpgclassics-bestiary-t-z")) ||
  !ipsensTonberry.notes.some((note) => note.includes("Tonberry card drop")) ||
  !ipsensVeteran?.stats.some((claim) => claim.field === "MP" && claim.value === 1672 && claim.verification === "disputed") ||
  !ipsensVeteran.stats.some((claim) => claim.field === "MP" && claim.value === 1627 && claim.verification === "disputed") ||
  !ipsensVeteran.notes.some((note) => note.includes("both list Veteran as its card"))
) {
  errors.push("Ipsen's Castle must retain the RPGClassics/GameFAQs Tonberry HP and Ice-weakness differences and Veteran MP disagreement.");
}
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
const trenoGriffinArena = enemyRecords.find((enemy) => enemy.id === "enemy.griffin-treno-arena");
const trenoGriffinEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.treno.griffin-challenge");
const trenoGriffinCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.treno-griffin.stage");
const ordinaryGriffin = enemyRecords.find((enemy) => enemy.id === "enemy.griffin");
if (
  !trenoGriffinArena
  || trenoGriffinArena.kind !== "boss"
  || trenoGriffinArena.chapterId !== "disc-2.treno"
  || !trenoGriffinArena.stats.some((claim) => claim.field === "level" && claim.value === 16)
  || !trenoGriffinArena.stats.some((claim) => claim.field === "HP" && claim.value === 1470)
  || !["EXP", "AP", "Gil"].every((field) => trenoGriffinArena.stats.some((claim) => claim.field === field && claim.value === 0))
  || trenoGriffinArena.steals.length !== 0
  || trenoGriffinArena.drops.length !== 0
  || !trenoGriffinArena.routeObjectiveIds.includes("disc-2.treno.griffin-challenge")
  || !trenoGriffinArena.missableIds.includes("missable.disc-2.treno.griffin-challenge")
  || !trenoGriffinArena.cutoffIds.includes("cutoff.treno-griffin.stage")
  || !trenoGriffinArena.sourceIds.includes("gamefaqs-weapon-shop-monsters-71891")
  || !trenoGriffinArena.sourceIds.includes("elitegrindlab-treno")
  || !trenoGriffinEncounter
  || trenoGriffinEncounter.kind !== "boss"
  || trenoGriffinEncounter.chapterId !== "disc-2.treno"
  || trenoGriffinEncounter.formation.length !== 1
  || trenoGriffinEncounter.formation[0]?.enemyId !== "enemy.griffin-treno-arena"
  || trenoGriffinEncounter.formation[0]?.quantity !== 1
  || !trenoGriffinEncounter.objectiveIds.includes("disc-2.tonberry-card")
  || !trenoGriffinEncounter.cutoffIds.includes("cutoff.treno-griffin.stage")
  || !trenoGriffinCutoff?.missableIds.includes("missable.disc-2.treno.griffin-challenge")
  || ordinaryGriffin?.drops.length !== 4
) {
  errors.push("The Treno arena Griffin needs a separate single-enemy profile, fixed-card objective, one-time cutoff, no copied field loot, and sourced arena battle-result data.");
}
const pualeiPlainsPool = enemyEncounters.find((encounter) => encounter.id === "encounter.journey-to-iifa-tree.pualei-plains-pool");
const pualeiFriendlyNymphEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.journey-to-iifa-tree.friendly-nymph");
const pualeiFriendlyNymph = enemyRecords.find((enemy) => enemy.id === "enemy.friendly-nymph");
const hostileNymph = enemyRecords.find((enemy) => enemy.id === "enemy.nymph");
if (
  !pualeiPlainsPool
  || pualeiPlainsPool.kind !== "random-pool"
  || pualeiPlainsPool.chapterId !== "disc-2.journey-to-iifa-tree"
  || pualeiPlainsPool.formation.map((entry) => entry.enemyId).filter(Boolean).sort().join(",") !== "enemy.blazer-beetle,enemy.goblin-mage,enemy.troll"
  || !pualeiPlainsPool.sourceIds.includes("gamefaqs-journey-to-iifa-tree-71891")
  || !pualeiPlainsPool.sourceIds.includes("gamefaqs-enemy-list-71891")
  || pualeiPlainsPool.formation.some((entry) => entry.enemyId === "enemy.nymph")
  || !pualeiFriendlyNymphEncounter
  || pualeiFriendlyNymphEncounter.kind !== "random-pool"
  || pualeiFriendlyNymphEncounter.formation.length !== 1
  || pualeiFriendlyNymphEncounter.formation[0]?.enemyId !== "enemy.friendly-nymph"
  || !pualeiFriendlyNymphEncounter.objectiveIds.includes("disc-2.journey-to-iifa-tree.nymph")
  || !pualeiFriendlyNymph
  || pualeiFriendlyNymph.kind !== "friendly"
  || pualeiFriendlyNymph.chapterId !== "disc-2.journey-to-iifa-tree"
  || pualeiFriendlyNymph.steals.length !== 0
  || pualeiFriendlyNymph.drops.length !== 0
  || !pualeiFriendlyNymph.stats.some((claim) => claim.field === "AP" && claim.value === 30)
  || !pualeiFriendlyNymph.strategies.some((strategy) => strategy.title.includes("3 Ore") && strategy.detail.includes("Emerald"))
  || !pualeiFriendlyNymph.routeObjectiveIds.includes("disc-2.journey-to-iifa-tree.nymph")
  || !hostileNymph
  || hostileNymph.kind === "friendly"
) {
  errors.push("Pualei Plains needs a sourced Blazer Beetle/Goblin Mage/Troll pool and a separate Friendly Nymph record with its 3-Ore, 30-AP, Emerald quest reward.");
}
const banyanoShoresPool = enemyEncounters.find((encounter) => encounter.id === "encounter.madain-sari.banyano-shores-pool");
const banyanoShoresBlazer = enemyRecords.find((enemy) => enemy.id === "enemy.blazer-beetle");
const madainSariArrival = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.madain-sari")?.sections.find((section) => section.id === "madain-sari-arrival");
const banyanoShoresStep = madainSariArrival?.steps.find((step) => step.id === "madain-sari-banyano-shores-encounter");
if (
  !banyanoShoresPool
  || banyanoShoresPool.kind !== "random-pool"
  || banyanoShoresPool.chapterId !== "disc-2.madain-sari"
  || banyanoShoresPool.formation.length !== 1
  || banyanoShoresPool.formation[0]?.enemyId !== "enemy.blazer-beetle"
  || !banyanoShoresPool.sourceIds.includes("rpgclassics-bestiary-a-c")
  || !banyanoShoresPool.sourceIds.includes("gamefaqs-enemy-list-71891")
  || !banyanoShoresPool.notes.some((note) => note.includes("does not establish a complete shoreline roster") && note.includes("rates"))
  || !banyanoShoresBlazer?.encounterIds.includes("encounter.madain-sari.banyano-shores-pool")
  || !enemyCatalogCoverage.chapterIds.includes("disc-2.madain-sari")
  || !banyanoShoresStep?.text.includes("Banyano Shores")
  || !banyanoShoresStep.text.includes("complete shoreline roster")
  || !madainSariArrival?.sourceIds.includes("rpgclassics-bestiary-a-c")
) {
  errors.push("Madain Sari's Banyano Shores record must link the confirmed Blazer Beetle location, source evidence, partial roster limitation, and walkthrough context.");
}
const disc4WorldMapRosters: Record<string, string[]> = {
  "encounter.return-to-gaia.mist-continent-world-map": ["enemy.adamantoise", "enemy.axe-beak", "enemy.bandersnatch", "enemy.bomb", "enemy.carve-spider", "enemy.clipper", "enemy.dracozombie", "enemy.ghost", "enemy.gigan-octopus", "enemy.goblin", "enemy.grand-dragon", "enemy.hedgehog-pie", "enemy.ironite", "enemy.ladybird", "enemy.lizard-man", "enemy.malboro-pandemonium", "enemy.mandragora", "enemy.mistodon-b", "enemy.mu", "enemy.python", "enemy.sand-scorpion", "enemy.serpion", "enemy.skeleton", "enemy.trick-sparrow", "enemy.worm-hydra", "enemy.vice", "enemy.whale-zombie", "enemy.yeti"],
  "encounter.return-to-gaia.outer-continent-world-map": ["enemy.blazer-beetle", "enemy.cactuar", "enemy.dracozombie", "enemy.gigan-octopus", "enemy.goblin-mage", "enemy.grand-dragon", "enemy.griffin", "enemy.hecteyes", "enemy.land-worm", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.ogre", "enemy.troll", "enemy.whale-zombie"],
  "encounter.return-to-gaia.lost-continent-world-map": ["enemy.dracozombie", "enemy.feather-circle", "enemy.gigan-octopus", "enemy.hecteyes", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.vepal-green", "enemy.whale-zombie"],
  "encounter.return-to-gaia.forgotten-continent-world-map": ["enemy.adamantoise", "enemy.armstrong", "enemy.cactuar", "enemy.dracozombie", "enemy.gigan-octopus", "enemy.gimme-cat", "enemy.grand-dragon", "enemy.hecteyes", "enemy.jabberwock", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.worm-hydra"],
};
const disc4WorldMapRosterEncounters = Object.entries(disc4WorldMapRosters).map(([id]) => enemyEncounters.find((encounter) => encounter.id === id));
const returnToGaiaWorldMap = walkthroughChapters.find((chapter) => chapter.areaId === "disc-4.return-to-gaia")?.sections.find((section) => section.id === "gaia-return-world-map-sidequests");
const disc4IslandStep = returnToGaiaWorldMap?.steps.find((step) => step.id === "gaia-return-island-enemy-check");
if (
  disc4WorldMapRosterEncounters.some((encounter, index) => {
    const expectedId = Object.keys(disc4WorldMapRosters)[index];
    const expectedEnemyIds = disc4WorldMapRosters[expectedId] ?? [];
    return !encounter
      || encounter.kind !== "random-pool"
      || encounter.chapterId !== "disc-4.return-to-gaia"
      || encounter.formation.map((entry) => entry.enemyId).sort().join(",") !== [...expectedEnemyIds].sort().join(",")
      || encounter.formation.some((entry) => entry.quantity !== null)
      || !encounter.sourceIds.includes("gamefaqs-enemy-list-71891")
      || !encounter.objectiveIds.includes("disc-4.return-to-gaia.island-blue-magic")
      || !encounter.notes.some((note) => note.includes("continent-level roster") && note.includes("exact tiles") && note.includes("rates"));
  })
  || disc4WorldMapRosterEncounters.some((encounter, index) => {
    const id = Object.keys(disc4WorldMapRosters)[index];
    return !encounter?.formation.every((entry) => enemyRecords.find((enemy) => enemy.id === entry.enemyId)?.encounterIds.includes(id));
  })
  || !enemyCatalogCoverage.chapterIds.includes("disc-4.return-to-gaia")
  || !["Mist", "Outer", "Lost", "Forgotten"].every((continent) => disc4IslandStep?.text.includes(continent))
  || !disc4IslandStep?.detail.toLowerCase().includes("exact tiles")
  || !disc4IslandStep.objectiveIds.includes("disc-4.return-to-gaia.island-blue-magic")
  || !objectivesById.get("disc-4.return-to-gaia.island-blue-magic")?.chapterIds?.includes("disc-4.return-to-gaia")
  || !["rpgclassics-bestiary-a-c", "rpgclassics-bestiary-c-g", "rpgclassics-kraken-bestiary", "rpgclassics-bestiary-t-z"].every((sourceId) => returnToGaiaWorldMap?.sourceIds.includes(sourceId) && objectivesById.get("disc-4.return-to-gaia.island-blue-magic")?.sourceIds.includes(sourceId) && sources.some((source) => source.id === sourceId))
) {
  errors.push("Disc IV must preserve all four source-listed continent rosters, link every enemy profile reciprocally, and connect them to the Blue Magic checklist with explicit location limits.");
}
const highSeasGimmeCatPool = enemyEncounters.find((encounter) => encounter.id === "encounter.on-the-high-seas.gimme-cat-island-grass");
const disc4GimmeCatPool = enemyEncounters.find((encounter) => encounter.id === "encounter.return-to-gaia.sacrobless-gimme-cat");
const gimmeCat = enemyRecords.find((enemy) => enemy.id === "enemy.gimme-cat");
const highSeasLanarSection = highSeasWalkthrough?.sections.find((section) => section.id === "high-seas-lanar-island");
const highSeasGimmeCatStep = highSeasLanarSection?.steps.find((step) => step.id === "high-seas-lanar-blue-magic");
const disc4GimmeCatStep = returnToGaiaWorldMap?.steps.find((step) => step.id === "gaia-return-island-enemy-check");
const disc4GimmeCatObjective = objectivesById.get("disc-4.return-to-gaia.island-blue-magic");
if (
  !highSeasGimmeCatPool
  || highSeasGimmeCatPool.kind !== "random-pool"
  || highSeasGimmeCatPool.chapterId !== "disc-3.on-the-high-seas"
  || highSeasGimmeCatPool.formation.length !== 1
  || highSeasGimmeCatPool.formation[0]?.enemyId !== "enemy.gimme-cat"
  || highSeasGimmeCatPool.formation[0]?.quantity !== null
  || !highSeasGimmeCatPool.location.includes("Grassland")
  || !highSeasGimmeCatPool.notes.some((note) => note.includes("exact tiles") && note.includes("complete local roster"))
  || !highSeasGimmeCatPool.objectiveIds.includes("disc-3.on-the-high-seas.blue-magic")
  || !disc4GimmeCatPool
  || disc4GimmeCatPool.kind !== "random-pool"
  || disc4GimmeCatPool.chapterId !== "disc-4.return-to-gaia"
  || disc4GimmeCatPool.formation.length !== 1
  || disc4GimmeCatPool.formation[0]?.enemyId !== "enemy.gimme-cat"
  || disc4GimmeCatPool.formation[0]?.quantity !== null
  || !disc4GimmeCatPool.sourceIds.includes("gamefaqs-enemy-list-71891")
  || !disc4GimmeCatPool.sourceIds.includes("rpgclassics-bestiary-c-g")
  || !disc4GimmeCatPool.notes.some((note) => note.includes("not a complete island roster") && note.includes("Friendly Creature"))
  || !disc4GimmeCatPool.objectiveIds.includes("disc-4.return-to-gaia.island-blue-magic")
  || !gimmeCat
  || gimmeCat.kind !== "ordinary"
  || gimmeCat.chapterId !== "disc-3.on-the-high-seas"
  || !gimmeCat.encounterIds.includes(highSeasGimmeCatPool?.id ?? "")
  || !gimmeCat.encounterIds.includes(disc4GimmeCatPool?.id ?? "")
  || !enemyCatalogCoverage.enemyIds.includes("enemy.gimme-cat")
  || !gimmeCat.sourceIds.includes("gamefaqs-enemy-list-71891")
  || !gimmeCat.sourceIds.includes("rpgclassics-bestiary-c-g")
  || !gimmeCat.stats.some((stat) => stat.field === "level" && stat.value === 36)
  || !gimmeCat.stats.some((stat) => stat.field === "HP" && stat.value === 4683)
  || !gimmeCat.stats.some((stat) => stat.field === "MP" && stat.value === 1240)
  || !gimmeCat.stats.some((stat) => stat.field === "Gil" && stat.value === 5000)
  || !gimmeCat.steals.some((slot) => slot.itemId === "game-item.echo-screen")
  || !gimmeCat.steals.some((slot) => slot.itemId === "game-item.tent")
  || !gimmeCat.steals.some((slot) => slot.itemId === "game-item.ether")
  || !gimmeCat.drops.some((slot) => slot.itemId === "game-item.phoenix-down")
  || !gimmeCat.facts.some((fact) => fact.category === "elemental-resistance" && fact.label === "All elements absorbed")
  || !gimmeCat.blueMagic.some((skill) => skill.name === "Auto-Life" && skill.command === "Eat" && skill.objectiveIds.includes("disc-3.on-the-high-seas.blue-magic"))
  || !gimmeCat.strategies.some((strategy) => strategy.title.includes("Diamond") && strategy.detail.includes("not a Friendly Creature"))
  || !gimmeCat.strategies.some((strategy) => strategy.title.includes("non-elemental"))
  || !highSeasGimmeCatStep?.text.includes("Gimme Cat")
  || !highSeasGimmeCatStep.text.includes("Keep your Diamond")
  || !highSeasGimmeCatStep.objectiveIds?.includes("disc-3.on-the-high-seas.blue-magic")
  || !highSeasLanarSection?.sourceIds.includes("gamefaqs-enemy-list-71891")
  || !highSeasLanarSection?.sourceIds.includes("rpgclassics-bestiary-c-g")
  || !disc4GimmeCatStep?.text.includes("Gimme Cat")
  || !disc4GimmeCatStep.detail.toLowerCase().includes("keep your diamond")
  || !disc4GimmeCatStep.detail.includes("Auto-Life")
  || !disc4GimmeCatStep.objectiveIds?.includes("disc-4.return-to-gaia.island-blue-magic")
  || !disc4GimmeCatObjective?.title.includes("Quina Blue Magic")
  || !disc4GimmeCatObjective?.chapterIds?.includes("disc-4.return-to-gaia")
  || !disc4GimmeCatObjective.sourceIds.includes("rpgclassics-bestiary-c-g")
) {
  errors.push("Gimme Cat's Disc III and Disc IV opportunities must link the ordinary enemy profile, sourced Auto-Life and Diamond guidance, walkthrough objectives, and location limitations without implying a Friendly Creature exchange.");
}
const desertPalacePool = enemyEncounters.find((encounter) => encounter.id === "encounter.desert-palace.random-pool");
const desertPalaceBossEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.desert-palace.valia-pira");
const desertPalaceTeachers = [
  ["enemy.drakan", "Vanish"],
  ["enemy.grimlock", "Night"],
  ["enemy.ogre", "Matra Magic"],
  ["enemy.torama", "LV4 Holy"],
] as const;
const desertPalaceEnemies = desertPalaceTeachers.map(([enemyId]) => enemyRecords.find((enemy) => enemy.id === enemyId));
const valiaPira = enemyRecords.find((enemy) => enemy.id === "enemy.valia-pira");
if (
  !desertPalacePool
  || desertPalacePool.kind !== "random-pool"
  || desertPalacePool.chapterId !== "disc-3.desert-palace"
  || desertPalacePool.formation.map((entry) => entry.enemyId).sort().join(",") !== "enemy.drakan,enemy.grimlock,enemy.ogre,enemy.torama"
  || !desertPalacePool.sourceIds.includes("gamefaqs-desert-palace-71891")
  || !desertPalacePool.sourceIds.includes("gamefaqs-enemy-list-71891")
  || !desertPalaceBossEncounter
  || desertPalaceBossEncounter.kind !== "boss"
  || desertPalaceBossEncounter.formation.length !== 1
  || desertPalaceBossEncounter.formation[0]?.enemyId !== "enemy.valia-pira"
  || !desertPalaceBossEncounter.objectiveIds.includes("disc-3.desert-palace.valia-pira")
  || desertPalaceEnemies.some((enemy, index) => !enemy
    || enemy.chapterId !== "disc-3.desert-palace"
    || !enemy.encounterIds.includes("encounter.desert-palace.random-pool")
    || !enemy.routeObjectiveIds.includes("disc-3.desert-palace.blue-magic")
    || !enemy.blueMagic.some((skill) => skill.command === "Eat" && skill.name === desertPalaceTeachers[index]?.[1] && skill.objectiveIds.includes("disc-3.desert-palace.blue-magic")))
  || !desertPalaceEnemies.every((enemy) => enemy?.sourceIds.includes("gamefaqs-enemy-list-71891"))
  || !desertPalaceEnemies[1]?.notes.some((note) => note.includes("physical red-top form") && note.includes("magical blue-top"))
  || !valiaPira
  || valiaPira.kind !== "boss"
  || !valiaPira.routeObjectiveIds.includes("disc-3.desert-palace.valia-pira")
  || !valiaPira.stats.some((claim) => claim.field === "HP" && claim.value === 12120 && claim.verification === "disputed")
  || !valiaPira.notes.some((note) => note.includes("12,119") && note.includes("12,120"))
  || valiaPira.steals.length !== 4
  || valiaPira.steals.some((slot) => slot.itemName !== "Nothing")
  || valiaPira.drops[0]?.itemId !== "game-item.elixir"
  || valiaPira.drops.slice(1).some((slot) => slot.itemId !== "game-item.ether")
) {
  errors.push("Desert Palace needs its four sourced ordinary enemies and Eat teachers, a separate Valia Pira boss, and source-marked boss stat and loot disagreements.");
}
const alexandriaCardPlayersObjectiveId = "disc-3.the-home-front.card-players";
const alexandriaCardRosterObjectiveId = "disc-3.the-home-front.card-player-roster";
const alexandriaCardPlayersWarning = missables.find((missable) => missable.id === "missable.disc-3.the-home-front.card-players");
const alexandriaCardPlayersCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.alexandria-zidane.before-treno");
const alexandriaCardPlayersSteps = walkthroughChapters
  .filter((chapter) => chapter.areaId === "disc-3.the-home-front")
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));
const alexandriaCardPlayersStep = alexandriaCardPlayersSteps.find((step) => step.objectiveIds?.includes(alexandriaCardPlayersObjectiveId));
const alexandriaCardRosterStep = alexandriaCardPlayersSteps.find((step) => step.objectiveIds?.includes(alexandriaCardRosterObjectiveId));
const alexandriaCardRosterObjective = objectives.find((objective) => objective.id === alexandriaCardRosterObjectiveId);
if (
  !objectiveIds.has(alexandriaCardPlayersObjectiveId)
  || !alexandriaCardPlayersStep
  || !alexandriaCardPlayersWarning?.sourceIds.includes("gamefaqs-card-locations-24067")
  || !alexandriaCardPlayersWarning.sourceIds.includes("gamefaqs-tetra-master-71891")
  || !alexandriaCardPlayersWarning.sourceIds.includes("elitegrindlab-home-front")
  || !alexandriaCardPlayersWarning.sourceIds.includes("cour89-card-players")
  || alexandriaCardPlayersWarning.classification.includes("permanently-missable")
  || !alexandriaCardPlayersCutoff?.missableIds.includes(alexandriaCardPlayersWarning.id)
  || !["Michelle", "Old Lady", "Benero", "Zenero"].every((name) => alexandriaCardPlayersStep.text.includes(name))
  || !alexandriaCardPlayersCutoff.sourceIds.includes("cour89-card-players")
  || !objectiveIds.has(alexandriaCardRosterObjectiveId)
  || !alexandriaCardRosterObjective?.sourceIds.includes("cour89-card-players")
  || !alexandriaCardRosterStep
  || ![
    "Fishman", "Nikolai", "Man", "Hippaul", "Hippolady", "Guide", "Old Man", "Ryan", "Mick",
    "Signwriter Dante", "Maggie", "Doug", "Nobleman", "Noblewoman", "Tom's Mother", "Flower Girl",
    "shopkeeper", "Genero", "Synthesis Shop", "Onion Master", "Tom", "Boatman", "Retired Boatman", "Iila",
  ].every((name) => alexandriaCardRosterStep.detail?.includes(name))
) {
  errors.push("The Disc III Alexandria card checklist must preserve the original four-opponent objective, add the separately tracked Cour89 roster entries, cite the modern-release roster source, and remain separate from permanent card-type loss.");
}
const postDestructionAlexandriaCardObjectiveId = "disc-3.on-the-high-seas.alexandria-first-visit-card-players";
const postDestructionAlexandriaCardWarning = missables.find((missable) =>
  missable.id === "missable.disc-3.on-the-high-seas.alexandria-first-visit-card-players",
);
const postDestructionAlexandriaCardObjective = objectives.find((objective) => objective.id === postDestructionAlexandriaCardObjectiveId);
const postDestructionAlexandriaCardSteps = walkthroughChapters
  .filter((chapter) => ["disc-3.on-the-high-seas", "disc-4.return-to-gaia"].includes(chapter.areaId))
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .filter((step) => step.objectiveIds?.includes(postDestructionAlexandriaCardObjectiveId));
const postDestructionAlexandriaCardCutoffs = gameRouteCutoffs.filter((cutoff) =>
  cutoff.missableIds.includes(postDestructionAlexandriaCardWarning?.id ?? ""),
);
const postDestructionAlexandriaDetour = gameRouteEdges.find((edge) => edge.id === "detour.high-seas-alexandria-ruins");
const postDestructionAlexandriaDetourRejoin = gameRouteEdges.find((edge) => edge.id === "detour.alexandria-ruins-rejoin-high-seas");
if (
  !postDestructionAlexandriaCardObjective
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("cour89-card-players")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("gamefaqs-card-locations-24067")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaCardObjective.chapterIds?.includes("disc-3.on-the-high-seas")
  || !postDestructionAlexandriaCardObjective.chapterIds.includes("disc-4.return-to-gaia")
  || !postDestructionAlexandriaCardWarning
  || postDestructionAlexandriaCardWarning.classification.includes("permanently-missable")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("cour89-card-players")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("gamefaqs-card-locations-24067")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaCardWarning.note?.includes("GameFAQs' card-location FAQ lists two Red Mages and Hippaul")
  || !postDestructionAlexandriaCardWarning.note.includes("Xbox achievement guide's indexed text")
  || !postDestructionAlexandriaCardWarning.note.includes("recommend a later attempt if missed")
  || postDestructionAlexandriaCardSteps.length !== 2
  || !postDestructionAlexandriaCardSteps.every((step) =>
    ["male Red Mage", "female Red Mage", "Kabao"].every((name) => step.text.includes(name)),
  )
  || postDestructionAlexandriaCardCutoffs.length !== 2
  || postDestructionAlexandriaCardCutoffs.some((cutoff) => cutoff.certainty !== "disputed")
  || postDestructionAlexandriaCardCutoffs.some((cutoff) =>
    !cutoff.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
    || !cutoff.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
    || !cutoff.sourceIds.includes("trueachievements-tetra-master-guide")
  )
  || !postDestructionAlexandriaDetour
  || postDestructionAlexandriaDetour.relationship !== "optional-return"
  || postDestructionAlexandriaDetour.toChapterId !== "disc-1.alexandria"
  || !postDestructionAlexandriaDetour.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
  || !postDestructionAlexandriaDetour.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaDetour.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaDetourRejoin
  || postDestructionAlexandriaDetourRejoin.relationship !== "rejoin"
  || !sources.find((source) => source.id === "rpgclassics-alexandria-ruins")?.notes.includes("does not identify or time its card matches")
  || !sources.find((source) => source.id === "steam-tetra-disc4-opponents-729676856")?.notes.includes("a 2023 comment reports that Hippaul and the Red Mage are not at Alexandria Inn on Disc IV")
  || !sources.find((source) => source.id === "steam-tetra-opponents-disc4-2804532988")?.notes.includes("omission alone does not establish they are unavailable")
  || !sources.find((source) => source.id === "trueachievements-tetra-master-guide")?.notes.includes("two Red Mages and Hippaul are at the Alexandria Inn at endgame")
) {
  errors.push("The post-destruction Alexandria Inn matches must preserve the Disc III safe checkpoint, the Cour89/GameFAQs/TrueAchievements/Steam conflict, optional-match scope, and the conditional later attempt.");
}
const mountainMoonstoneObjectiveId = "disc-2.conde-petie-mountain-path.moonstone";
const mountainMoonstoneWarning = missablesById.get("missable.disc-2.conde-petie-mountain-path.moonstone");
const mountainMoonstoneFinalWarning = missablesById.get("missable.disc-3.preparing-to-leave.colored-stones-moonstone");
const mountainMoonstoneFirstPass = cutoffsById.get("cutoff.conde-petie-mountain-path.departure");
const mountainMoonstoneFinalCutoff = cutoffsById.get("cutoff.shimmering-island.disc-iii-departure");
const mountainMoonstoneObjective = objectivesById.get(mountainMoonstoneObjectiveId);
const moonstoneAchievementCriteria = achievementCatalogs.map(({ platform, records }) => ({
  platform,
  record: records.find((achievement) => achievement.id === "over-the-moon"),
}));
const mountainMoonstoneReturnStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-iifa-tree")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-iifa-retrace-path");
if (
  !mountainMoonstoneWarning?.classification.includes("recoverable-later") ||
  !mountainMoonstoneWarning.deadline.includes("Shimmering Island") ||
  !mountainMoonstoneWarning.nextAvailability.includes("post-Madain Sari route re-enters Mountain Path") ||
  !mountainMoonstoneWarning.sourceIds.includes("gamefaqs-mountain-path-return-29957") ||
  !mountainMoonstoneObjective?.chapterIds.includes("disc-2.journey-to-iifa-tree") ||
  mountainMoonstoneFirstPass?.certainty !== "conservative" ||
  !mountainMoonstoneFirstPass.title.includes("checkpoint") ||
  !mountainMoonstoneFirstPass.missableIds.includes(mountainMoonstoneWarning.id) ||
  !mountainMoonstoneFirstPass.sourceIds.includes("gamefaqs-mountain-path-return-29957") ||
  !mountainMoonstoneReturnStep?.objectiveIds?.includes(mountainMoonstoneObjectiveId) ||
  !mountainMoonstoneReturnStep.text.includes("monument near Suzuna") ||
  !gameRouteEdgesById.get("story.journey-to-iifa-tree-to-iifa-tree")?.sourceIds.includes("gamefaqs-mountain-path-return-29957") ||
  !mountainMoonstoneFinalWarning?.consequence.includes("Shimmering Island transition") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("gamefaqs-preparing-to-leave-71891") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("gamefaqs-achievements-71891") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("gamerguides-over-the-moon-achievement") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("playstationtrophies-over-the-moon") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("steam-achievements") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("xboxachievements-FFIX-list") ||
  !mountainMoonstoneObjective?.achievementPlatforms?.includes("steam") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("ps4") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("xbox") ||
  !mountainMoonstoneObjective.sourceIds.includes("gamefaqs-achievements-71891") ||
  !mountainMoonstoneObjective.sourceIds.includes("gamerguides-over-the-moon-achievement") ||
  !mountainMoonstoneObjective.sourceIds.includes("xboxachievements-FFIX-list") ||
  moonstoneAchievementCriteria.length !== 3 ||
  moonstoneAchievementCriteria.some(({ platform, record }) =>
    !record || record.criteria !== "Obtain 4 moonstones." ||
    !record.guideObjectiveIds?.includes(mountainMoonstoneObjectiveId) ||
    !record.guideSourceIds?.includes("gamerguides-over-the-moon-achievement") ||
    !["steam", "ps4", "xbox"].includes(platform)) ||
  !mountainMoonstoneFinalCutoff?.missableIds.includes(mountainMoonstoneFinalWarning.id) ||
  !mountainMoonstoneFinalCutoff?.sourceIds.includes("gamefaqs-preparing-to-leave-71891") ||
  !mountainMoonstoneFinalCutoff?.sourceIds.includes("gamefaqs-mountain-path-return-29957")
) {
  errors.push("The Conde Petie Mountain Path Moonstone must preserve its source-backed Disc II return, conservative first-departure checkpoint, and final Shimmering Island deadline.");
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
const blackHoodDeathWarning = missables.find((missable) => missable.id === "missable.disc-3.desert-palace.black-hood-death");
const blackHoodDeathClaim = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.black-hood.death");
const blackHoodItem = gameItems.find((item) => item.id === "game-item.black-hood");
const blackHoodPickupPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.desert-palace-black-hood");
const blackHoodShopPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.esto-gaza.black-hood");
const blackHoodSourceTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-3.preparing-to-leave.black-hood");
const blackHoodCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.shimmering-island.disc-iii-departure");
if (
  !blackHoodDeathWarning
  || blackHoodDeathWarning.classification.includes("permanently-missable")
  || !blackHoodDeathWarning.action.includes("no Black Hood is held")
  || !blackHoodDeathWarning.action.includes("six-copy target is optional")
  || !blackHoodDeathWarning.recovery.includes("retained Black Hood")
  || !blackHoodDeathWarning.recovery.includes("continue earning AP")
  || !blackHoodDeathWarning.sourceIds.includes("gamefaqs-missables-21725")
  || !blackHoodDeathWarning.sourceIds.includes("gamefaqs-item-ability-10332")
  || !blackHoodDeathWarning.sourceIds.includes("rpgclassics-abilities")
  || !blackHoodDeathWarning.sourceIds.includes("rpgclassics-armor")
  || !blackHoodDeathClaim?.sourceIds.includes("gamefaqs-item-ability-10332")
  || !blackHoodDeathClaim.sourceIds.includes("rpgclassics-abilities")
  || !blackHoodDeathClaim.sourceIds.includes("rpgclassics-armor")
  || !blackHoodItem?.sourceIds.includes("gamefaqs-item-ability-10332")
  || !blackHoodPickupPath?.walkthroughObjectiveIds.includes("disc-3.desert-palace.black-hood-death")
  || !blackHoodPickupPath.sourceIds.includes("rpgclassics-armor")
  || !blackHoodShopPath
  || blackHoodShopPath.cost?.amount !== 2550
  || blackHoodShopPath.availability !== "limited-window"
  || !blackHoodShopPath.conditions.includes("retained Black Hood can still teach Death")
  || !blackHoodSourceTarget
  || blackHoodSourceTarget.targetQuantity !== 6
  || !blackHoodSourceTarget.interpretation.includes("not a universal minimum")
  || !blackHoodCutoff?.missableIds.includes("missable.disc-3.desert-palace.black-hood-death")
) {
  errors.push("Black Hood's Shimmering Island warning must distinguish final item acquisition from later Death learning with a retained copy, link its two item routes and provenance, and keep the six-copy target optional.");
}
const mythrilRod = gameItems.find((item) => item.id === "game-item.mythril-rod");
const mythrilRodPathIds = [
  "item-path.disc-2.journey-to-treno.mythril-rod-summit-station",
  "item-path.disc-2.treno.mythril-rod-shop",
  "item-path.disc-2.cleyra.mythril-rod-shop",
  "item-path.disc-3.lost-continent.mythril-rod-esto-gaza-shop",
  "item-path.disc-3.ipsens-castle.mythril-rod-kumool-mogshop",
];
const mythrilRodPaths = mythrilRodPathIds.map((pathId) => itemAcquisitionPaths.find((path) => path.id === pathId));
const mythrilRodNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.mythril-rod-need-two");
const mythrilRodEndTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.mythril-rod-end-inventory-five");
const mythrilRodAbilityNames = equipmentAbilityClaims
  .filter((claim) => claim.itemId === "game-item.mythril-rod")
  .map((claim) => claim.abilityName)
  .sort();
if (
  mythrilRodPaths.some((path) => !path || path.cost?.amount !== 560 || !path.sourceIds.includes("gamefaqs-items-71891") || !path.sourceIds.includes("gamefaqs-shops-71891"))
  || mythrilRodPaths.filter(Boolean).length !== 5
  || mythrilRodPaths[3]?.availability !== "limited-window"
  || mythrilRodPaths[4]?.availability !== "repeatable"
  || !mythrilRodPaths[4]?.sourceIds.includes("rpgclassics-shops")
  || !mythrilRod?.sourceIds.includes("rpgclassics-abilities")
  || !mythrilRodNeedTarget
  || mythrilRodNeedTarget.targetQuantity !== 2
  || !mythrilRodNeedTarget.interpretation.includes("optional source-specific")
  || !mythrilRodEndTarget
  || mythrilRodEndTarget.targetQuantity !== 5
  || !mythrilRodEndTarget.interpretation.includes("distinct from Need 2")
  || mythrilRodAbilityNames.join("|") !== "Life|Shell|Silence"
) {
  errors.push("Mythril Rod must retain all five 560-Gil source-backed shops, including the later Ipsen Mogshop source, the separate optional Need/end-inventory targets, and its Life/Silence/Shell claims.");
}
const ipsensEquipmentStock = [
  ["mage-masher", 500], ["iron-sword", 660], ["mythril-spear", 1100], ["poison-knuckles", 7000],
  ["multina-racket", 750], ["mythril-rod", 560], ["lamias-flute", 3800], ["oak-staff", 2400],
  ["needle-fork", 3100], ["rising-sun", 500], ["n-kai-armlet", 3000], ["jade-armlet", 3400],
  ["venetia-shield", 2800], ["red-hat", 3000], ["golden-hairpin", 3700], ["coronet", 4400],
  ["cross-helm", 2200], ["diamond-helm", 3000], ["power-vest", 7200], ["gaia-gear", 8700],
  ["shield-armor", 4300], ["demons-mail", 5900],
] as const;
const ipsensEquipmentPaths = ipsensEquipmentStock.map(([slug]) => {
  const itemId = `game-item.${slug}`;
  return {
    slug,
    item: gameItems.find((item) => item.id === itemId),
    paths: itemAcquisitionPaths.filter((path) => path.itemId === itemId && path.shopId === "ipsens-castle.kumool-mogshop" && path.chapterId === "disc-3.ipsens-castle"),
  };
});
const ipsensStockRouteMismatch = ipsensEquipmentPaths.some(({ slug, item, paths }, index) => {
  const [expectedSlug, expectedPrice] = ipsensEquipmentStock[index];
  const path = paths[0];
  if (
    slug !== expectedSlug
    || !item
    || paths.length !== 1
    || path?.chapterId !== "disc-3.ipsens-castle"
    || path?.method !== "mogshop"
    || path?.cost?.amount !== expectedPrice
    || !path?.sourceIds.includes("gamefaqs-items-71891")
    || !path?.sourceIds.includes("gamefaqs-shops-71891")
    || !path?.sourceIds.includes("rpgclassics-shops")
    || !item.sourceIds.includes("gamefaqs-items-71891")
    || !item.sourceIds.includes("rpgclassics-shops")
  ) return true;
  if (slug === "poison-knuckles") {
    return !path.conditions.includes("7,000 Gil") || !path.conditions.includes("5,000 Gil");
  }
  if (slug === "needle-fork") {
    return !path.conditions.includes("GameFAQs Shops omits");
  }
  if (slug === "coronet") {
    return !path.conditions.includes("does not list Ipsen") || !path.conditions.includes("RPGClassics omits");
  }
  return false;
});
const ipsensInventoryTargets = [
  ["mage-masher", 4, 2], ["iron-sword", 2, 0], ["mythril-spear", 2, 1], ["poison-knuckles", 2, 1],
  ["multina-racket", 3, 5], ["mythril-rod", 2, 5], ["lamias-flute", 2, 1], ["oak-staff", 2, 0],
  ["needle-fork", 2, 5], ["n-kai-armlet", 7, 9], ["jade-armlet", 7, 9], ["venetia-shield", 3, 9],
  ["red-hat", 7, 6], ["golden-hairpin", 7, 12], ["coronet", 7, 13], ["cross-helm", 3, 4],
  ["diamond-helm", 3, 3], ["power-vest", 7, 5], ["gaia-gear", 7, 10], ["shield-armor", 3, 0],
  ["demons-mail", 3, 1],
] as const;
const ipsensTargetMismatch = ipsensInventoryTargets.some(([slug, need, endInventory]) => {
  const itemId = `game-item.${slug}`;
  const targets = sourceInventoryTargets.filter((target) => target.itemId === itemId && target.chapterId === "disc-4.final-preparations");
  const needTarget = targets.find((target) => target.targetQuantity === need && !target.id.includes("end-inventory"));
  const endTarget = targets.find((target) => target.targetQuantity === endInventory && target.id.includes("end-inventory"));
  return targets.length !== (endInventory === 0 ? 1 : 2)
    || needTarget?.sourceIds.includes("gamefaqs-items-71891") !== true
    || !needTarget.interpretation.includes("optional source-specific")
    || !needTarget.interpretation.includes(`end-inventory #${endInventory}`)
    || (endInventory > 0 && endTarget?.sourceIds.includes("gamefaqs-items-71891") !== true)
    || (endInventory > 0 && !endTarget?.interpretation.includes(`end-inventory #${endInventory}`))
    || (endInventory > 0 && !endTarget?.interpretation.includes("optional source-specific"));
});
const ipsensAbilityClaims = [
  ["mage-masher", "Flee"], ["mage-masher", "Detect"], ["iron-sword", "Minus Strike"],
  ["multina-racket", "Blind"], ["multina-racket", "Stona"], ["multina-racket", "Shell"],
  ["needle-fork", "High Tide"], ["n-kai-armlet", "Bandit"], ["n-kai-armlet", "Undead Killer"],
  ["n-kai-armlet", "Water"], ["jade-armlet", "Body Temp"], ["jade-armlet", "High Tide"],
  ["venetia-shield", "Auto-Float"], ["venetia-shield", "Counter"], ["red-hat", "Cover"],
  ["red-hat", "MP Attack"], ["golden-hairpin", "Auto-Regen"], ["golden-hairpin", "Loudmouth"],
  ["coronet", "Man Eater"], ["coronet", "Return Magic"], ["cross-helm", "Devil Killer"],
  ["cross-helm", "MP Attack"], ["diamond-helm", "Accuracy+"], ["diamond-helm", "Insomniac"],
  ["power-vest", "Counter"], ["power-vest", "Gamble Defense"], ["power-vest", "Stone Killer"],
  ["gaia-gear", "High Tide"], ["gaia-gear", "Insomniac"], ["gaia-gear", "Osmose"],
  ["shield-armor", "Distract"], ["demons-mail", "High Tide"],
] as const;
const ipsensAbilityMismatch = ipsensAbilityClaims.some(([slug, abilityName]) => !equipmentAbilityClaims.some((claim) =>
  claim.itemId === `game-item.${slug}`
  && claim.abilityName === abilityName
  && claim.sourceIds.includes("gamefaqs-items-71891")
  && claim.sourceIds.includes("gamefaqs-abilities-71891")
));
if (ipsensEquipmentStock.length !== 22 || ipsensEquipmentPaths.length !== 22 || ipsensStockRouteMismatch || ipsensTargetMismatch || ipsensAbilityMismatch) {
  errors.push("Ipsen's Castle equipment stock must retain 22 source-linked Mogshop routes, the GameFAQs/RPGClassics Poison Knuckles and stock-table differences, each Need count and positive end-inventory target except Rising Sun, zero-count end-inventory source notes, and the listed equipment abilities.");
}
const ipsensSupplyStock = [
  ["potion", 50], ["hi-potion", 200], ["phoenix-down", 150], ["echo-screen", 50],
  ["soft", 100], ["antidote", 50], ["eye-drops", 50], ["magic-tag", 100],
  ["remedy", 300], ["vaccine", 100], ["annoyntment", 150], ["tent", 800],
] as const;
const ipsensSupplyRouteMismatch = ipsensSupplyStock.some(([slug, expectedPrice]) => {
  const itemId = `game-item.${slug}`;
  const item = gameItems.find((candidate) => candidate.id === itemId);
  const paths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && path.shopId === "ipsens-castle.kumool-mogshop");
  const path = paths[0];
  if (
    !item
    || paths.length !== 1
    || path?.id !== `item-path.disc-3.ipsens-castle.kumool-mogshop.${slug}`
    || path?.chapterId !== "disc-3.ipsens-castle"
    || path?.method !== "mogshop"
    || path?.availability !== "window-unverified"
    || path?.cost?.amount !== expectedPrice
    || !path?.sourceIds.includes("gamefaqs-items-71891")
    || !path?.sourceIds.includes("gamefaqs-shops-71891")
    || !path?.sourceIds.includes("rpgclassics-shops")
    || !item.sourceIds.includes("gamefaqs-items-71891")
    || !item.sourceIds.includes("rpgclassics-shops")
  ) return true;
  if (slug === "remedy") return !path.conditions.includes("RPGClassics") || !path.conditions.includes("omits Remedy");
  return !path.conditions.includes("GameFAQs Shops") || !path.conditions.includes("RPGClassics");
});
if (ipsensEquipmentStock.length + ipsensSupplyStock.length !== 34 || ipsensSupplyRouteMismatch) {
  errors.push("Ipsen's Castle Mogshop must retain all 12 source-linked consumable prices alongside its 22 equipment routes, including GameFAQs' 300-Gil Remedy listing that RPGClassics omits.");
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
const cour89MognetLetters = sources.find((source) => source.id === "cour89-mognet-letters");
const gamefaqsMoogleFaq = sources.find((source) => source.id === "gamefaqs-moogle-faq-23306");
const gamefaqsCardTournament = sources.find((source) => source.id === "gamefaqs-card-tournament-71891");
const mogrichLetterObjective = objectivesById.get("disc-3.card-tournament.mogrich-letter");
const mogrichLetterWarning = missablesById.get("missable.disc-3.card-tournament.mogrich-letter");
const mogrichLetterCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.card-tournament.mogrich-letter");
const cardTournamentActivityCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.card-tournament.third-match");
const mogrichTournamentSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.card-tournament")
  ?.sections.find((section) => section.id === "card-tournament-treno-sweep");
const mogrichTournamentStep = mogrichTournamentSection?.steps.find((step) => step.id === "card-tournament-mogrich-letter");
if (
  !cour89MognetLetters?.notes.includes("New Champion letter")
  || !cour89MognetLetters.notes.includes("level 20 while the Treno Card Tournament is underway")
  || !cour89MognetLetters.notes.includes("level 60 or above")
  || !gamefaqsMoogleFaq?.notes.includes("if Hippaul has been raced")
  || !gamefaqsCardTournament?.notes.includes("if Athlete Queen was won")
  || !mogrichLetterObjective?.title.includes("New Champion")
  || !mogrichLetterObjective.sourceIds.includes("cour89-mognet-letters")
  || !mogrichLetterWarning?.classification.includes("conditional")
  || !mogrichLetterWarning.consequence.includes("do not establish the earliest unlock")
  || !mogrichLetterWarning.consequence.includes("does not block the separate Disc IV Mognet Central repair chain")
  || !mogrichLetterWarning.recovery.includes("later Treno visit remains unverified")
  || !mogrichLetterWarning.sourceIds.includes("gamerguides-mognet-central")
  || mogrichLetterCutoff?.certainty !== "conservative"
  || mogrichLetterCutoff.edgeId !== cardTournamentActivityCutoff?.edgeId
  || mogrichLetterCutoff.missableIds.length !== 1
  || !mogrichLetterCutoff.missableIds.includes(mogrichLetterWarning.id)
  || !mogrichLetterCutoff.trigger.includes("level 20")
  || !mogrichLetterCutoff.trigger.includes("before starting the third game")
  || cardTournamentActivityCutoff?.missableIds.includes(mogrichLetterWarning.id)
  || !mogrichTournamentSection?.sourceIds.includes("cour89-mognet-letters")
  || !mogrichTournamentStep?.objectiveIds.includes(mogrichLetterObjective.id)
  || !mogrichTournamentStep.text.includes("level 20")
  || !mogrichTournamentStep.detail?.includes("Athlete Queen")
  || !mogrichTournamentStep.detail.includes("later Treno availability is unverified")
) {
  errors.push("Mogrich's optional New Champion letter must preserve Cour89's current-release level-20 tournament condition, the older PlayStation condition differences, a separate conservative pre-final-game cutoff, and independence from Mognet Central repair.");
}
const namingwayObjective = objectivesById.get("disc-3.card-tournament.namingway-card");
const namingwayWarning = missablesById.get("missable.disc-3.card-tournament.namingway-card");
const namingwayFinalCutoff = cutoffsById.get("cutoff.shimmering-island.disc-iii-departure");
const namingwayReturnEdge = gameRouteEdgesById.get("detour.lost-continent-desert-palace-namingway-return");
const namingwayDesertPalaceExitEdge = gameRouteEdgesById.get("story.desert-palace-to-lost-continent");
const namingwayDesertPalaceStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.desert-palace")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "desert-palace-namingway-card");
if (
  !namingwayObjective?.chapterIds.includes("disc-3.card-tournament")
  || !namingwayObjective.chapterIds.includes("disc-3.desert-palace")
  || !namingwayObjective.sourceIds.includes("elitegrindlab-desert-palace")
  || !namingwayWarning?.classification.includes("recoverable-later")
  || !namingwayWarning.warningChapterIds.includes("disc-3.preparing-to-leave")
  || !namingwayWarning.deadline.includes("through the end of Disc III")
  || !namingwayWarning.deadline.includes("Shimmering Island portal")
  || !namingwayWarning.recovery.includes("mountain hole near the sandpits")
  || !namingwayWarning.sourceIds.includes("gamefaqs-preparing-to-leave-71891")
  || namingwayFinalCutoff?.edgeId !== "story.preparing-to-leave-to-portal"
  || !namingwayFinalCutoff.missableIds.includes(namingwayWarning.id)
  || !namingwayFinalCutoff.trigger.includes("Namingway Card")
  || !namingwayFinalCutoff.trigger.includes("through the end of Disc III")
  || !namingwayFinalCutoff.trigger.includes("mountain hole near the sandpits")
  || !namingwayFinalCutoff.sourceIds.includes("gamefaqs-desert-palace-71891")
  || !namingwayFinalCutoff.sourceIds.includes("gamefaqs-preparing-to-leave-71891")
  || namingwayReturnEdge?.relationship !== "optional-return"
  || namingwayReturnEdge.fromChapterId !== "disc-3.lost-continent"
  || namingwayReturnEdge.toChapterId !== "disc-3.desert-palace"
  || !namingwayReturnEdge.sourceIds.includes("gamefaqs-desert-palace-71891")
  || !namingwayReturnEdge.sourceIds.includes("elitegrindlab-desert-palace")
  || namingwayDesertPalaceExitEdge?.relationship !== "required-story"
  || !namingwayDesertPalaceStep?.objectiveIds?.includes(namingwayObjective.id)
  || !namingwayDesertPalaceStep.detail?.includes("hole in the mountain near the sandpits")
  || !namingwayDesertPalaceStep.detail.includes("Shimmering Island portal")
) {
  errors.push("Namingway's Treno and post-Oeilvert Desert Palace copies must share one objective, retain the Disc III re-entry route, and use Shimmering Island as the source-supported final cutoff.");
}
const mognetRepairObjective = objectivesById.get("disc-4.return-to-gaia.mognet-central");
const mognetRouteEdgeIds = [
  "detour.return-to-gaia-alexandria-mognet",
  "detour.alexandria-to-burmecia-mognet",
  "detour.burmecia-to-black-mage-village-mognet",
  "detour.black-mage-village-to-ipsen-mognet",
  "detour.ipsen-to-fossil-roo-mognet",
  "detour.fossil-roo-to-daguerreo-mognet",
  "detour.daguerreo-to-alexandria-mognet",
  "detour.mognet-central-repair-rejoin-gaia",
];
const mognetRouteEdges = mognetRouteEdgeIds.map((id) => gameRouteEdgesById.get(id));
const mognetRepairRoute = gameRouteEdgesById.get("detour.mognet-central-repair-rejoin-gaia");
const mognetRepairSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.find((section) => section.id === "gaia-return-mognet-central");
const mognetLetterObjectiveIds = [
  "disc-4.return-to-gaia.mognet-letter-22",
  "disc-4.return-to-gaia.mognet-letter-23",
  "disc-4.return-to-gaia.mognet-letter-24",
  "disc-4.return-to-gaia.mognet-letter-25",
  "disc-4.return-to-gaia.mognet-letter-26",
  "disc-4.return-to-gaia.mognet-letter-27",
];
const mognetSuperslickObjectiveId = "disc-4.return-to-gaia.mognet-superslick";
const mognetRepairObjectiveId = "disc-4.return-to-gaia.mognet-central";
const mognetOceanAbilityObjectiveId = "disc-3.on-the-high-seas.ocean-ability";
const mognetLetterStepIds = [
  "gaia-return-mognet-letter-22",
  "gaia-return-mognet-letter-23",
  "gaia-return-mognet-letter-24",
  "gaia-return-mognet-letter-25",
  "gaia-return-mognet-letter-26",
  "gaia-return-mognet-letter-27",
];
const mognetLetterSteps = mognetLetterStepIds.map((stepId) => mognetRepairSection?.steps.find((step) => step.id === stepId));
const mognetSuperslickStep = mognetRepairSection?.steps.find((step) => step.id === "gaia-return-mognet-superslick");
const mognetRepairStep = mognetRepairSection?.steps.find((step) => step.id === "gaia-return-mognet-central-repair");
const expectedMognetQuestEdges = [
  ...mognetLetterObjectiveIds.slice(0, -1).map((id, index) => `${id}->${mognetLetterObjectiveIds[index + 1]}`),
  `${mognetLetterObjectiveIds[mognetLetterObjectiveIds.length - 1]}->${mognetSuperslickObjectiveId}`,
  `${mognetSuperslickObjectiveId}->${mognetRepairObjectiveId}`,
].sort();
const actualMognetQuestEdges = questPrerequisiteDependencies
  .filter((dependency) => [
    ...mognetLetterObjectiveIds,
    mognetSuperslickObjectiveId,
    mognetRepairObjectiveId,
  ].includes(dependency.prerequisiteObjectiveId) || [
    ...mognetLetterObjectiveIds,
    mognetSuperslickObjectiveId,
    mognetRepairObjectiveId,
  ].includes(dependency.dependentObjectiveId))
  .map((dependency) => `${dependency.prerequisiteObjectiveId}->${dependency.dependentObjectiveId}`)
  .sort();
const expectedMognetAccessEdges = [
  `${mognetOceanAbilityObjectiveId}->disc-3.on-the-high-seas.dive-spots`,
  `${mognetOceanAbilityObjectiveId}->disc-4.return-to-gaia.mognet-central-crack`,
  `${mognetOceanAbilityObjectiveId}->${mognetRepairObjectiveId}`,
  `disc-4.return-to-gaia.mognet-central-crack->${mognetRepairObjectiveId}`,
].sort();
const actualMognetAccessEdges = objectiveAccessDependencies
  .filter((dependency) => dependency.dependentObjectiveId === "disc-3.on-the-high-seas.dive-spots"
    || dependency.dependentObjectiveId === "disc-4.return-to-gaia.mognet-central-crack"
    || dependency.dependentObjectiveId === mognetRepairObjectiveId)
  .map((dependency) => `${dependency.prerequisiteObjectiveId}->${dependency.dependentObjectiveId}`)
  .sort();
const oceanAbilityStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.on-the-high-seas")
  ?.sections.find((section) => section.id === "high-seas-chocobo-lagoon")
  ?.steps.find((step) => step.id === "high-seas-mountain-chocographs");
const wellLubricatedAchievement = steamAchievements.find((achievement) => achievement.id === "well-lubricated");
if (
  !cour89MognetLetters?.notes.includes("27 Mognet deliveries")
  || !cour89MognetLetters.notes.includes("22–27 alone suffice")
  || !mognetRepairObjective?.sourceIds.includes("cour89-mognet-letters")
  || mognetRouteEdges.some((edge) => !edge?.sourceIds.includes("jegged-mognet-central") || !edge.sourceIds.includes("cour89-mognet-letters"))
  || mognetRouteEdges.some((edge, index) => edge?.relationship !== (index === mognetRouteEdges.length - 1 ? "rejoin" : "optional-return"))
  || mognetRouteEdges.map((edge) => `${edge?.fromChapterId}->${edge?.toChapterId}`).join("|") !== [
    "disc-4.return-to-gaia->disc-1.alexandria",
    "disc-1.alexandria->disc-1.burmecia",
    "disc-1.burmecia->disc-2.magdalene-forest",
    "disc-2.magdalene-forest->disc-3.ipsens-castle",
    "disc-3.ipsens-castle->disc-2.journey-to-outer-continent",
    "disc-2.journey-to-outer-continent->disc-3.aerial-exploration",
    "disc-3.aerial-exploration->disc-1.alexandria",
    "disc-1.alexandria->disc-4.return-to-gaia",
  ].join("|")
  || !mognetRepairRoute?.summary.includes("deliveries #22–27")
  || !mognetRepairRoute.summary.includes("not all 27")
  || !mognetRepairSection?.sourceIds.includes("cour89-mognet-letters")
  || mognetLetterObjectiveIds.some((id) => !objectivesById.get(id)?.sourceIds.includes("cour89-mognet-letters")
    || !objectivesById.get(id)?.sourceIds.includes("jegged-mognet-central"))
  || actualMognetQuestEdges.join("|") !== expectedMognetQuestEdges.join("|")
  || mognetLetterSteps.some((step, index) => !step?.objectiveIds?.includes(mognetLetterObjectiveIds[index]))
  || !mognetLetterSteps[0]?.text.includes("#22")
  || !mognetLetterSteps[5]?.text.includes("#27")
  || !mognetLetterSteps[3]?.detail?.includes("Quina")
  || !mognetLetterSteps[5]?.detail?.includes("all 27 numbered letters")
  || !objectivesById.get(mognetSuperslickObjectiveId)?.sourceIds.includes("jegged-mognet-central")
  || !mognetSuperslickStep?.objectiveIds?.includes(mognetSuperslickObjectiveId)
  || !wellLubricatedAchievement?.guideObjectiveIds?.includes(mognetSuperslickObjectiveId)
  || !mognetRepairStep?.objectiveIds?.includes(mognetRepairObjectiveId)
  || !mognetRepairStep.detail?.includes("Ocean ability")
  || !mognetRepairStep.detail.includes("Dead Pepper")
  || actualMognetAccessEdges.join("|") !== expectedMognetAccessEdges.join("|")
  || !objectivesById.get(mognetOceanAbilityObjectiveId)?.sourceIds.includes("jegged-chocographs")
  || !oceanAbilityStep?.objectiveIds?.includes(mognetOceanAbilityObjectiveId)
) {
  errors.push("The Mognet repair route must track the ordered Disc IV deliveries (#22–27), Ruby's Superslick, the repair, and Ocean/crack access prerequisites with source links.");
}
const disc4TrenoReturnEdge = gameRouteEdgesById.get("detour.return-to-gaia-treno-behemoth");
const disc4TrenoRejoinEdge = gameRouteEdgesById.get("detour.treno-behemoth-rejoin-gaia");
if (
  !disc4TrenoReturnEdge?.summary.includes("Quan's Dwelling") ||
  !disc4TrenoReturnEdge.summary.includes("Ophiucus") ||
  !disc4TrenoReturnEdge.sourceIds.includes("ff9-kouryaku-disc4") ||
  !disc4TrenoReturnEdge.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  !disc4TrenoRejoinEdge?.summary.includes("Quan's Dwelling") ||
  !disc4TrenoRejoinEdge.sourceIds.includes("ff9-kouryaku-disc4")
) {
  errors.push("The Disc IV Gaia return route must connect Quan's Dwelling and Treno's optional late-game visits to a sourced rejoin.");
}
const cour89BranBal = sources.find((source) => source.id === "cour89-bran-bal");
const cour89Pandemonium = sources.find((source) => source.id === "cour89-pandemonium");
const moorockLetterObjective = objectivesById.get("disc-3.portal-to-another-world.moorock-mognet-letter");
const mozmeLetterObjective = objectivesById.get("disc-3.portal-to-another-world.mozme-letter");
const moorockLetterWarning = missablesById.get("missable.disc-3.portal-to-another-world.moorock-mognet-letter");
const moorockLetterCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.pandemonium.moorock-mognet-letter");
const portalChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world");
const branBalMoorockSection = portalChapter?.sections.find((section) => section.id === "portal-bran-bal-moorock");
const branBalMoorockStep = branBalMoorockSection?.steps.find((step) => step.id === "portal-bran-bal-wing-edge-moorock");
const pandemoniumMoorockSection = portalChapter?.sections.find((section) => section.id === "portal-pandemonium-mind-control");
const pandemoniumMoorockStep = pandemoniumMoorockSection?.steps.find((step) => step.id === "portal-pandemonium-moorock-holy-miter");
const pandemoniumMazeSection = portalChapter?.sections.find((section) => section.id === "portal-pandemonium-maze-treasures");
const mozmeDeliveryStep = pandemoniumMazeSection?.steps.find((step) => step.id === "portal-pandemonium-mozme-letter");
if (
  !cour89BranBal?.notes.includes("same letter remains available from Moorock in Pandemonium")
  || !cour89Pandemonium?.notes.includes("both receiving it and delivering it to Mozme become impossible after passing through the Maze")
  || !cour89MognetLetters?.notes.includes("Entry #21 is Moorock's letter to Mozme")
  || !moorockLetterObjective?.title.includes("Bran Bal or Pandemonium")
  || !moorockLetterObjective.sourceIds.includes("cour89-bran-bal")
  || !moorockLetterObjective.sourceIds.includes("cour89-pandemonium")
  || !mozmeLetterObjective?.sourceIds.includes("cour89-pandemonium")
  || moorockLetterWarning?.objectiveId !== mozmeLetterObjective?.id
  || !moorockLetterWarning?.classification.includes("recoverable-later")
  || !moorockLetterWarning.consequence.includes("does not block Mognet Central")
  || !moorockLetterWarning.deadline.includes("before passing through Pandemonium's Maze")
  || !moorockLetterWarning.nextAvailability?.includes("Moorock offers the same letter in the Pandemonium Hall")
  || !moorockLetterWarning.sourceIds.includes("cour89-mognet-letters")
  || !moorockLetterCutoff?.missableIds.includes(moorockLetterWarning.id)
  || moorockLetterCutoff?.certainty !== "source-supported"
  || !branBalMoorockStep?.detail?.includes("same #21 letter")
  || !pandemoniumMoorockStep?.text.includes("If you skipped his letter in Bran Bal")
  || !pandemoniumMoorockStep.objectiveIds.includes(moorockLetterObjective.id)
  || !mozmeDeliveryStep?.text.includes("before continuing through the Maze")
  || !mozmeDeliveryStep.detail?.includes("both receipt and delivery become unavailable")
) {
  errors.push("Moorock's #21 letter must preserve its Bran Bal-to-Pandemonium recovery, the Maze receipt/delivery cutoff, and its optional status for the 27-letter count rather than Mognet Central repair.");
}
const expectedMoorockStock = [
  ["game-item.dagger", 320], ["game-item.mage-masher", 500], ["game-item.mythril-dagger", 950],
  ["game-item.gladius", 2300], ["game-item.zorlin-shape", 6000], ["game-item.orichalcon", 17000],
  ["game-item.defender", 9340], ["game-item.holy-lance", 11000], ["game-item.avenger", 16000],
  ["game-item.mythril-racket", 2250], ["game-item.bistro-fork", 10300], ["game-item.rising-sun", 500],
  ["game-item.dragon-wrist", 4800], ["game-item.defense-gloves", 6000], ["game-item.coronet", 4400],
  ["game-item.flash-hat", 5200], ["game-item.adaman-hat", 6100], ["game-item.platinum-helm", 4600],
  ["game-item.demons-vest", 10250], ["game-item.minervas-plate", 12200], ["game-item.platina-armor", 10500],
  ["game-item.hi-potion", 200], ["game-item.phoenix-down", 150], ["game-item.echo-screen", 50],
  ["game-item.soft", 100], ["game-item.antidote", 50], ["game-item.eye-drops", 50],
  ["game-item.magic-tag", 100], ["game-item.vaccine", 100], ["game-item.remedy", 300],
  ["game-item.annoyntment", 150], ["game-item.tent", 800],
] as const;
const moorockBranBalPaths = itemAcquisitionPaths.filter((path) => path.shopId === "bran-bal.mogshop");
const moorockPandemoniumPaths = itemAcquisitionPaths.filter((path) => path.shopId === "pandemonium.moorock");
const moorockItemIds = new Set(expectedMoorockStock.map(([itemId]) => itemId));
const expectedMoorockAbilityClaims = [
  ["game-item.dagger", "Flee"], ["game-item.mage-masher", "Flee"], ["game-item.mage-masher", "Detect"],
  ["game-item.mythril-dagger", "Bandit"], ["game-item.gladius", "Annoy"], ["game-item.gladius", "Lucky Seven"],
  ["game-item.zorlin-shape", "Flee"], ["game-item.orichalcon", "Detect"], ["game-item.defender", "Thunder Slash"],
  ["game-item.holy-lance", "Dragon's Crest"], ["game-item.holy-lance", "Reis's Wind"],
  ["game-item.avenger", "Demi Shock"], ["game-item.avenger", "Counter"],
  ["game-item.mythril-racket", "Reflect"], ["game-item.mythril-racket", "Shell"], ["game-item.mythril-racket", "Protect"],
  ["game-item.bistro-fork", "High Tide"], ["game-item.dragon-wrist", "Jelly"], ["game-item.dragon-wrist", "Lancer"],
  ["game-item.defense-gloves", "HP+20%"], ["game-item.coronet", "Man Eater"], ["game-item.coronet", "Return Magic"],
  ["game-item.flash-hat", "Beast Killer"], ["game-item.flash-hat", "Eye 4 Eye"],
  ["game-item.adaman-hat", "Gamble Defense"], ["game-item.adaman-hat", "HP+20%"],
  ["game-item.platinum-helm", "Restore HP"], ["game-item.platinum-helm", "Stone Killer"],
  ["game-item.demons-vest", "Auto-Potion"], ["game-item.demons-vest", "Devil Killer"], ["game-item.demons-vest", "Locomotion"],
  ["game-item.minervas-plate", "High Tide"], ["game-item.minervas-plate", "Restore HP"],
  ["game-item.platina-armor", "Beast Killer"],
] as const;
const moorockAbilityClaims = equipmentAbilityClaims.filter((claim) => moorockItemIds.has(claim.itemId));
const moorockAbilityClaimKeys = new Set(moorockAbilityClaims.map((claim) => `${claim.itemId}:${claim.abilityName}`));
const branBalMoorockWarning = missablesById.get("missable.disc-3.portal-to-another-world.demons-vest-bran-bal-shop");
const zorlinMoorockWarning = missablesById.get("missable.disc-3.portal-to-another-world.zorlin-shape-final-mogshop");
const zorlinMoorockCutoff = cutoffsById.get("cutoff.pandemonium.moorock-shop");
const zorlinMoorockTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-3.portal-to-another-world.zorlin-shape");
const moorockShopObjective = objectivesById.get("disc-3.portal-to-another-world.moorock-shop-review");
const branBalShopReviewStep = branBalMoorockSection?.steps.find((step) => step.id === "portal-bran-bal-shop-review");
if (
  moorockBranBalPaths.length !== 32 || moorockPandemoniumPaths.length !== 32 ||
  ![moorockBranBalPaths, moorockPandemoniumPaths].every((paths) =>
    paths.every((path) => moorockItemIds.has(path.itemId)) && new Set(paths.map((path) => path.itemId)).size === 32,
  ) ||
  expectedMoorockStock.some(([itemId, price]) => {
    const branPath = moorockBranBalPaths.find((path) => path.itemId === itemId);
    const pandemoniumPath = moorockPandemoniumPaths.find((path) => path.itemId === itemId);
    return !branPath || !pandemoniumPath ||
      branPath.cost?.amount !== price || pandemoniumPath.cost?.amount !== price ||
      branPath.method !== "mogshop" || pandemoniumPath.method !== "mogshop" ||
      branPath.availability !== "limited-window" || pandemoniumPath.availability !== "limited-window" ||
      !branPath.walkthroughObjectiveIds?.includes("disc-3.portal-to-another-world.moorock-shop-review") ||
      !pandemoniumPath.walkthroughObjectiveIds?.includes("disc-3.portal-to-another-world.moorock-shop-review");
  }) ||
  moorockAbilityClaims.length !== expectedMoorockAbilityClaims.length ||
  expectedMoorockAbilityClaims.some(([itemId, abilityName]) => {
    const claim = equipmentAbilityClaims.find((entry) => entry.itemId === itemId && entry.abilityName === abilityName);
    return !moorockAbilityClaimKeys.has(`${itemId}:${abilityName}`) ||
      !claim?.sourceIds.includes("gamefaqs-items-71891") ||
      !claim.sourceIds.includes("gamefaqs-abilities-71891");
  }) ||
  !moorockBranBalPaths.find((path) => path.itemId === "game-item.dagger")?.conditions?.includes("GameFAQs' Shops FAQ omits Dagger") ||
  !moorockBranBalPaths.find((path) => path.itemId === "game-item.magic-tag")?.conditions?.includes("RPGClassics and EliteGrindLab omit it") ||
  !moorockBranBalPaths.find((path) => path.itemId === "game-item.zorlin-shape")?.conditions?.includes("2,300 Gil") ||
  !moorockPandemoniumPaths.find((path) => path.itemId === "game-item.zorlin-shape")?.conditions?.includes("final documented shop window") ||
  !branBalShopReviewStep?.detail.includes("32 products") ||
  !branBalShopReviewStep.detail.includes("Magic Tag but omits Dagger") ||
  !["rpgclassics-shops", "elitegrindlab-bran-bal", "ffwiki-shops", "ff9-irodori-shops"].every((sourceId) => moorockShopObjective?.sourceIds.includes(sourceId)) ||
  !pandemoniumMoorockStep?.objectiveIds.includes("disc-3.portal-to-another-world.moorock-shop-review") ||
  !zorlinMoorockWarning?.classification.includes("permanently-missable") ||
  !zorlinMoorockWarning.deadline.includes("before continuing through the Maze") ||
  !zorlinMoorockCutoff?.missableIds.includes(zorlinMoorockWarning.id) ||
  zorlinMoorockCutoff?.certainty !== "source-supported" ||
  !branBalMoorockWarning?.nextAvailability?.includes("same stock") ||
  !branBalMoorockWarning.nextAvailability.includes("Pandemonium Hall") ||
  zorlinMoorockTarget?.targetQuantity !== 9 ||
  !sources.find((source) => source.id === "ffwiki-shops")?.notes.includes("both Dagger and Magic Tag") ||
  !sources.find((source) => source.id === "ff9-irodori-shops")?.notes.includes("same inventory")
) {
  errors.push("Moorock's full Bran Bal/Pandemonium stock, disputed Dagger/Magic Tag listings, Zorlin Shape price and final purchase cutoff must stay linked to the item catalog and walkthrough.");
}
const pandemoniumTreasureObjective = objectivesById.get("disc-3.portal-to-another-world.pandemonium-treasures");
const pandemoniumTreasureWarning = missablesById.get("missable.disc-3.portal-to-another-world.pandemonium-treasures");
const pandemoniumHolyMiterPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.pandemonium-holy-miter-throne");
const pandemoniumCarabiniChestPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.pandemonium-carabini-mail-chest");
const pandemoniumCarabiniKujaPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.pandemonium-carabini-mail-kuja-steal");
const pandemoniumElixirChestPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.pandemonium-elixir-chest");
const pandemoniumBattleBootsPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.pandemonium-battle-boots-chest");
const pandemoniumCarabiniClaim = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.carabini-mail.auto-regen");
const kujaPandemoniumRecord = enemyRecords.find((enemy) => enemy.id === "enemy.kuja");
const holyMiterDisc4Recovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.black-mage-village.weapon-shop.holy-miter");
const carabiniMailDisc4Recovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.daguerreo.weapon-shop.carabini-mail");
const battleBootsGarlandRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.garland-battle-boots-steal");
const battleBootsHadesRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-battle-boots-steal");
const elixirHadesRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-elixir-drop");
const elixirNecronRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.the-final-battle.necron-elixir-common-steal");
const pandemoniumThroneStep = pandemoniumMoorockSection?.steps.find((step) => step.id === "portal-pandemonium-moorock-holy-miter");
const pandemoniumElevatorSection = portalChapter?.sections.find((section) => section.id === "portal-pandemonium-orbs-elevator");
const pandemoniumGilStep = pandemoniumElevatorSection?.steps.find((step) => step.id === "portal-pandemonium-heading-three");
const pandemoniumBluePadStep = pandemoniumMazeSection?.steps.find((step) => step.id === "portal-pandemonium-maze-entry");
if (
  !pandemoniumTreasureObjective
  || !pandemoniumTreasureWarning
  || pandemoniumTreasureWarning.objectiveId !== pandemoniumTreasureObjective.id
  || !pandemoniumTreasureWarning.classification.includes("missable-opportunity")
  || pandemoniumTreasureWarning.classification.includes("permanently-missable")
  || !pandemoniumTreasureWarning.nextAvailability.includes("Holy Miter")
  || !pandemoniumTreasureWarning.nextAvailability.includes("Carabini Mail")
  || !pandemoniumTreasureWarning.nextAvailability.includes("Battle Boots")
  || !pandemoniumTreasureWarning.nextAvailability.includes("20,007-Gil amount is a missed chest pickup")
  || !pandemoniumHolyMiterPath
  || pandemoniumHolyMiterPath.itemId !== "game-item.holy-miter"
  || pandemoniumHolyMiterPath.method !== "fixed-pickup"
  || pandemoniumHolyMiterPath.availability !== "single-use"
  || !pandemoniumHolyMiterPath.walkthroughObjectiveIds?.includes(pandemoniumTreasureObjective.id)
  || !pandemoniumCarabiniChestPath
  || pandemoniumCarabiniChestPath.itemId !== "game-item.carabini-mail"
  || pandemoniumCarabiniChestPath.method !== "chest"
  || pandemoniumCarabiniChestPath.availability !== "single-use"
  || !pandemoniumCarabiniChestPath.notes?.includes("reverse which side they call the first blue pad")
  || !pandemoniumCarabiniChestPath.walkthroughObjectiveIds?.includes(pandemoniumTreasureObjective.id)
  || !pandemoniumCarabiniKujaPath
  || pandemoniumCarabiniKujaPath.itemId !== "game-item.carabini-mail"
  || pandemoniumCarabiniKujaPath.method !== "steal"
  || pandemoniumCarabiniKujaPath.availability !== "one-time-encounter"
  || !pandemoniumCarabiniKujaPath.walkthroughObjectiveIds?.includes("disc-3.portal-to-another-world.pandemonium-boss-steals")
  || !kujaPandemoniumRecord?.steals.some((slot) => slot.itemId === "game-item.carabini-mail")
  || !pandemoniumElixirChestPath
  || pandemoniumElixirChestPath.itemId !== "game-item.elixir"
  || pandemoniumElixirChestPath.method !== "chest"
  || pandemoniumElixirChestPath.availability !== "single-use"
  || !pandemoniumElixirChestPath.walkthroughObjectiveIds?.includes(pandemoniumTreasureObjective.id)
  || !pandemoniumBattleBootsPath
  || pandemoniumBattleBootsPath.itemId !== "game-item.battle-boots"
  || !pandemoniumBattleBootsPath.walkthroughObjectiveIds?.includes(pandemoniumTreasureObjective.id)
  || !holyMiterDisc4Recovery
  || holyMiterDisc4Recovery.cost?.amount !== 8300
  || holyMiterDisc4Recovery.availability !== "repeatable"
  || !carabiniMailDisc4Recovery
  || carabiniMailDisc4Recovery.cost?.amount !== 12300
  || carabiniMailDisc4Recovery.availability !== "repeatable"
  || !battleBootsGarlandRecovery
  || !battleBootsHadesRecovery
  || !elixirHadesRecovery
  || !elixirNecronRecovery
  || !pandemoniumCarabiniClaim
  || pandemoniumCarabiniClaim.itemId !== "game-item.carabini-mail"
  || pandemoniumCarabiniClaim.abilityName !== "Auto-Regen"
  || !pandemoniumCarabiniClaim.sourceIds.includes("jegged-pandemonium")
  || !pandemoniumThroneStep?.text.includes("throne for the Holy Miter")
  || !pandemoniumGilStep?.text.includes("20,007 Gil")
  || !pandemoniumBluePadStep?.text.includes("both blue teleporters")
  || !["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "gamefaqs-shops-71891", "gamefaqs-return-to-gaia-71891"].every((sourceId) => pandemoniumTreasureWarning.sourceIds.includes(sourceId))
) {
  errors.push("Pandemonium's five fixed pickups must map to item paths, preserve the two-blue-pad source discrepancy, distinguish one-time location copies from recoverable item types, and link Carabini Mail's Kuja steal and Auto-Regen lesson.");
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
  if (target.basis === "route-need" && !/\bNeed \d+\b/.test(target.interpretation)) {
    errors.push(`Inventory target ${target.id} is marked as a route need without a sourced Need count.`);
  }
  if (target.basis === "end-inventory" && !target.id.includes("end-inventory")) {
    errors.push(`Inventory target ${target.id} is marked as end inventory without an explicit end-inventory identity.`);
  }
  if (target.basis === "purchase-recommendation" && !/buy|bought|purchase/i.test(target.interpretation)) {
    errors.push(`Inventory target ${target.id} is marked as a purchase recommendation without purchase wording.`);
  }
  if (target.basis === "buy-column-total" && !/Buy\/Synth column/i.test(target.interpretation)) {
    errors.push(`Inventory target ${target.id} uses the Buy/Synth column basis without identifying that source column.`);
  }
  if (target.sourceIds.length === 0) errors.push(`Inventory target ${target.id} has no provenance.`);
  for (const sourceId of target.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Inventory target ${target.id} references unknown source ${sourceId}.`);
  }
}
const disc3InventoryCheckpointTargets = sourceInventoryTargets.filter((target) => target.id.startsWith("item-target.disc-3.preparing-to-leave."));
if (disc3InventoryCheckpointTargets.length !== 24 || disc3InventoryCheckpointTargets.some((target) => target.basis !== "checkpoint-total")) {
  errors.push("The 24 Disc III preparation inventory targets must remain source checkpoint totals, not route Need or end-inventory counts.");
}
const finalStockItemLocationSourceId = "gamefaqs-item-locations-54996";
const finalStockItemSpecs = [
  { itemId: "game-item.bandana", slug: "bandana", quantity: 12, price: 500 },
  { itemId: "game-item.chain-plate", slug: "chain-plate", quantity: 3, price: 810 },
  { itemId: "game-item.leather-plate", slug: "leather-plate", quantity: 3, price: 530 },
  { itemId: "game-item.mythril-vest", slug: "mythril-vest", quantity: 10, price: 1180 },
];
const finalStockItemLocationSource = sources.find((source) => source.id === finalStockItemLocationSourceId);
const finalStockItemLocationWarning = missables.find((missable) => missable.id === "missable.disc-3.aerial-exploration.daguerreo-stock");
const finalStockItemLocationObjective = objectives.find((objective) => objective.id === "disc-3.aerial-exploration.daguerreo-stock");
const requiredFinalStockItemLocationEvidence = [
  "Bandana", "Treno (Disc II)", "Fossil Roo", "no Find/Win/Steal route", "Dragon's Gate hidden pickup",
  "Chain Plate", "Leather Plate", "Mythril Vest", "Church of Lindblum", "Black Waltz 2", "Beatrix steal",
  "Gargan Roo", "Cleyra's Trunk", "Pinnacle Rocks", "Antlion steal", "Esto Gaza", "Disc IV",
];
if (!finalStockItemLocationSource || requiredFinalStockItemLocationEvidence.some((claim) => !finalStockItemLocationSource.notes.includes(claim))) {
  errors.push("The original PlayStation item-location source note must identify all four final-stock items, their listed pickups/steals/shops, and the reviewed Disc IV scope.");
}
if (!finalStockItemLocationObjective?.sourceIds.includes(finalStockItemLocationSourceId)) {
  errors.push("The final Disc III stock objective must cite the item-location guide for Bandana, Chain Plate, Leather Plate, and Mythril Vest routes.");
}
if (
  !finalStockItemLocationWarning?.sourceIds.includes(finalStockItemLocationSourceId) ||
  !finalStockItemLocationWarning.classification.includes("missable-opportunity") ||
  finalStockItemLocationWarning.severity !== "high" ||
  finalStockItemLocationWarning.verification !== "partial" ||
  !finalStockItemLocationWarning.recovery.includes("source-limited") ||
  !finalStockItemLocationWarning.recovery.includes("not a claim that every possible release or route")
) {
  errors.push("The final-stock warning must cite the location guide and preserve the high, partial, source-limited recovery scope.");
}
for (const { itemId, slug, quantity, price } of finalStockItemSpecs) {
  const pathId = `item-path.disc-3-stock.black-mage-village.${slug}`;
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const target = sourceInventoryTargets.find((entry) => entry.id === `item-target.disc-3.preparing-to-leave.${slug}`);
  if (
    !path || path.itemId !== itemId || path.method !== "shop" || path.shopId !== "black-mage-village.weapon-shop" ||
    path.availability !== "limited-window" || path.cost?.amount !== price || !path.sourceIds.includes(finalStockItemLocationSourceId)
  ) {
    errors.push(`Disc III Black Mage Village final-stock path ${pathId} must retain its source-backed price and limited window.`);
  }
  if (!target || target.itemId !== itemId || target.targetQuantity !== quantity) {
    errors.push(`Final-stock inventory target for ${slug} must remain the source-specific total of ${quantity}.`);
  }
}
const bandanaDragonGatePickup = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.dragon-gate-bandana-pickup");
if (
  !bandanaDragonGatePickup ||
  bandanaDragonGatePickup.itemId !== "game-item.bandana" ||
  bandanaDragonGatePickup.availability !== "single-use" ||
  !bandanaDragonGatePickup.sourceIds.includes("gamefaqs-return-to-lindblum-71891")
) {
  errors.push("Bandana must retain its source-linked hidden Dragon's Gate pickup as an earlier acquisition route.");
}
const braveSuitRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.brave-suit");
if (
  !braveSuitRecipe?.ingredients.some((ingredient) => ingredient.itemId === "game-item.mythril-vest" && ingredient.quantity === 1) ||
  !braveSuitRecipe.sourceIds.includes("gamefaqs-shops-71891")
) {
  errors.push("The Disc IV Brave Suit recipe must preserve Mythril Vest as a sourced consumed ingredient.");
}
const silkRobeRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.silk-robe");
if (
  !silkRobeRecipe?.ingredients.some((ingredient) => ingredient.itemId === "game-item.bandana" && ingredient.quantity === 1) ||
  !silkRobeRecipe.sourceIds.includes("gamefaqs-shops-71891")
) {
  errors.push("The Silk Robe recipe must preserve Bandana as a sourced consumed ingredient.");
}
const finalStockWalkthroughSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.preparing-to-leave")
  ?.sections.find((section) => section.id === "preparing-leave-shops");
const finalStockWalkthroughStep = finalStockWalkthroughSection?.steps.find((step) => step.id === "preparing-leave-shop-inventory");
if (
  !finalStockWalkthroughSection?.sourceIds.includes(finalStockItemLocationSourceId) ||
  !finalStockWalkthroughStep?.detail.includes("Item Location Guide") ||
  !finalStockWalkthroughStep.detail.includes("Bandana ×12") ||
  !finalStockWalkthroughStep.detail.includes("Mythril Vest ×10") ||
  !finalStockWalkthroughStep.detail.includes("Bandana and Mythril Vest are consumed by the Silk Robe and Brave Suit recipes respectively")
) {
  errors.push("The final-stock walkthrough must link the item-location guide and explain Bandana/Mythril Vest recipe use.");
}
for (const claim of equipmentAbilityClaims) {
  if (!gameItemIds.has(claim.itemId)) errors.push(`Equipment ability claim ${claim.id} references unknown item ${claim.itemId}.`);
  if (!claim.abilityName.trim()) errors.push(`Equipment ability claim ${claim.id} is missing an ability name.`);
  if (claim.sourceIds.length === 0) errors.push(`Equipment ability claim ${claim.id} has no provenance.`);
  for (const sourceId of claim.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Equipment ability claim ${claim.id} references unknown source ${sourceId}.`);
  }
}
const daguerreoAbilityWarning = missablesById.get("missable.disc-3.aerial-exploration.daguerreo-unique-abilities");
const runeBladeDisc3Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.rune-blade");
const obeliskDisc3Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.obelisk");
const kainsLanceItem = gameItems.find((item) => item.id === "game-item.kains-lance");
const kainsLancePickup = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.kains-lance-hidden-pickup");
const kainsLanceTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.kains-lance-need-one");
const kainsLanceAbilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.kains-lance");
const battleBootsInitiative = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.battle-boots.initiative");
const battleBootsHadesPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-battle-boots-steal");
const daguerreoShopStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "aerial-daguerreo-weapon-shop");
const finalStockAbilityStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.preparing-to-leave")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "preparing-leave-shop-inventory");
if (
  !daguerreoAbilityWarning ||
  !daguerreoAbilityWarning.consequence.includes("only equipment source for Iai Strike") ||
  !daguerreoAbilityWarning.nextAvailability.includes("Kain's Lance") ||
  !daguerreoAbilityWarning.nextAvailability.includes("Battle Boots") ||
  !daguerreoAbilityWarning.recovery.includes("release-specific behavior") ||
  !["gamefaqs-abilities-71891", "rpgclassics-abilities", "jegged-daguerreo", "gamefaqs-memoria-71891"].every((sourceId) => daguerreoAbilityWarning.sourceIds.includes(sourceId)) ||
  !runeBladeDisc3Path || runeBladeDisc3Path.itemId !== "game-item.rune-blade" || !runeBladeDisc3Path.conditions?.includes("only equipment source for Iai Strike") ||
  !obeliskDisc3Path || obeliskDisc3Path.itemId !== "game-item.obelisk" || !obeliskDisc3Path.notes?.includes("not unique to Obelisk") ||
  !kainsLanceItem?.sourceIds.includes("gamefaqs-memoria-71891") ||
  !kainsLancePickup || kainsLancePickup.itemId !== "game-item.kains-lance" || kainsLancePickup.chapterId !== "disc-4.memoria" ||
  kainsLancePickup.method !== "hidden-pickup" || kainsLancePickup.availability !== "single-use" ||
  !kainsLancePickup.walkthroughObjectiveIds?.includes("disc-4.memoria.kains-lance") ||
  !kainsLanceTarget || kainsLanceTarget.itemId !== "game-item.kains-lance" || kainsLanceTarget.targetQuantity !== 1 ||
  !["White Draw", "Cherry Blossom", "Dragon's Crest"].every((abilityName) => kainsLanceAbilities.some((claim) => claim.abilityName === abilityName)) ||
  kainsLanceAbilities.length !== 3 ||
  !kainsLanceAbilities.every((claim) => claim.sourceIds.includes("gamefaqs-abilities-71891") && claim.sourceIds.includes("rpgclassics-abilities")) ||
  !battleBootsInitiative?.sourceIds.includes("rpgclassics-abilities") ||
  battleBootsHadesPath?.itemId !== "game-item.battle-boots" || battleBootsHadesPath.chapterId !== "disc-4.memoria" ||
  !daguerreoShopStep?.detail.includes("only equipment source for Iai Strike") || !daguerreoShopStep.detail.includes("Kain's Lance") ||
  !finalStockAbilityStep?.detail.includes("Cherry Blossom can also be learned from Kain's Lance") ||
  !finalStockAbilityStep.detail.includes("For the specific Rune Blade/Obelisk comparison, Iai Strike appears only on Rune Blade")
) {
  errors.push("The Daguerreo ability cutoff must isolate Rune Blade's documented Iai Strike opportunity, preserve Kain's Lance/Battle Boots alternatives, and link Kain's Lance's Disc IV pickup and claims.");
}
const finalStockAbilityWarning = missablesById.get("missable.disc-3.preparing-to-leave.final-stock-ability-review");
const finalStockAbilityObjective = objectives.find((objective) => objective.id === "disc-3.preparing-to-leave.final-stock-ability-review");
const finalStockAbilitySources = ["gamefaqs-abilities-71891", "rpgclassics-abilities"];
const finalStockAbilityItems = ["game-item.trident", "game-item.diamond-sword", "game-item.flame-saber", "game-item.heavy-lance"]
  .map((itemId) => gameItems.find((item) => item.id === itemId));
const finalStockAbilityClaims = [
  { itemId: "game-item.trident", abilityName: "Luna" },
  { itemId: "game-item.diamond-sword", abilityName: "Power Break" },
  { itemId: "game-item.flame-saber", abilityName: "Magic Break" },
  { itemId: "game-item.heavy-lance", abilityName: "Six Dragons" },
];
const finalStockAbilityPaths = [
  { id: "item-path.disc-3-stock.mimoza-oeilvert.trident", itemId: "game-item.trident" },
  { id: "item-path.disc-3-stock.mojito-desert-palace.trident", itemId: "game-item.trident" },
  { id: "item-path.disc-3-stock.mimoza-oeilvert.diamond-sword", itemId: "game-item.diamond-sword" },
  { id: "item-path.disc-3-stock.mojito-desert-palace.diamond-sword", itemId: "game-item.diamond-sword" },
  { id: "item-path.disc-3-stock.esto-gaza.diamond-sword", itemId: "game-item.diamond-sword" },
  { id: "item-path.disc-3-stock.esto-gaza.flame-saber", itemId: "game-item.flame-saber" },
  { id: "item-path.disc-3-stock.esto-gaza.heavy-lance", itemId: "game-item.heavy-lance" },
  { id: "item-path.disc-3.forgotten-continent.oeilvert-diamond-sword", itemId: "game-item.diamond-sword" },
].map(({ id, itemId }) => ({ id, itemId, path: itemAcquisitionPaths.find((candidate) => candidate.id === id) }));
const finalStockAbilityWalkthrough = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.preparing-to-leave")
  ?.sections.find((section) => section.steps.some((step) => step.id === "preparing-leave-shop-inventory"));
const finalStockAbilityWalkthroughStep = finalStockAbilityWalkthrough?.steps.find((step) => step.id === "preparing-leave-shop-inventory");
if (
  !finalStockAbilityWarning || finalStockAbilityWarning.severity !== "info" ||
  !finalStockAbilityWarning.consequence.includes("GameFAQs and RPGClassics PlayStation ability tables both list") ||
  !finalStockAbilityWarning.consequence.includes("not a claim that missing the gear permanently removes an ability") ||
  !finalStockAbilityWarning.nextAvailability.includes("Neither reviewed PlayStation ability table lists alternate equipment") ||
  !finalStockAbilityWarning.note.includes("post-transition and version-specific ability-source audit remains partial") ||
  !finalStockAbilitySources.every((sourceId) => finalStockAbilityWarning.sourceIds.includes(sourceId)) ||
  !finalStockAbilityObjective || !finalStockAbilitySources.every((sourceId) => finalStockAbilityObjective.sourceIds.includes(sourceId)) ||
  finalStockAbilityItems.some((item) => !item || !finalStockAbilitySources.every((sourceId) => item.sourceIds.includes(sourceId))) ||
  finalStockAbilityClaims.length !== 4 || finalStockAbilityClaims.some(({ itemId, abilityName }) =>
    !equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName &&
      finalStockAbilitySources.every((sourceId) => claim.sourceIds.includes(sourceId))),
  ) ||
  finalStockAbilityPaths.some(({ itemId, path }) => !path || path.itemId !== itemId ||
    !finalStockAbilitySources.every((sourceId) => path.sourceIds.includes(sourceId))) ||
  !finalStockAbilityWalkthroughStep ||
  !finalStockAbilityWalkthroughStep.detail.includes("both reviewed PlayStation catalogs list Luna (Trident), Power Break (Diamond Sword), Magic Break (Flame Saber), and Six Dragons (Heavy Lance)") ||
  !finalStockAbilitySources.every((sourceId) => finalStockAbilityWalkthrough?.sourceIds.includes(sourceId))
) {
  errors.push("The final-stock ability review must link both PlayStation ability catalogs to its warning, objective, four item records and claims, all seven shop routes and the Oeilvert chest, and the walkthrough checkpoint without claiming permanent ability loss.");
}
const octagonRodWarning = missablesById.get("missable.disc-3.lost-continent.octagon-rod");
const octagonRodObjective = objectives.find((objective) => objective.id === "disc-3.lost-continent.octagon-rod");
const octagonRodItem = gameItems.find((item) => item.id === "game-item.octagon-rod");
const octagonRodClaims = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.octagon-rod");
const octagonRodShopPaths = [
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.esto-gaza.octagon-rod"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.octagon-rod"),
];
const octagonRodAbilitySources = ["gamefaqs-abilities-71891", "rpgclassics-abilities"];
const octagonRodWalkthroughSteps = [
  { chapterId: "disc-3.lost-continent", stepId: "lost-continent-esto-gaza-octagon-rod" },
  { chapterId: "disc-3.aerial-exploration", stepId: "aerial-daguerreo-octagon-rod" },
  { chapterId: "disc-3.preparing-to-leave", stepId: "preparing-leave-octagon-rod" },
].map(({ chapterId, stepId }) => {
  const chapter = walkthroughChapters.find((candidate) => candidate.areaId === chapterId);
  const section = chapter?.sections.find((candidate) => candidate.steps.some((step) => step.id === stepId));
  return {
    section,
    step: section?.steps.find((candidate) => candidate.id === stepId),
  };
});
if (
  !octagonRodWarning || octagonRodWarning.severity !== "info" ||
  !octagonRodWarning.consequence.includes("only equipment source for these spells") ||
  !octagonRodWarning.recovery.includes("no later learning route is documented") ||
  !octagonRodWarning.note.includes("direct modern-release behavior remains unverified") ||
  /under review/i.test(`${octagonRodWarning.consequence} ${octagonRodWarning.nextAvailability} ${octagonRodWarning.recovery} ${octagonRodWarning.note}`) ||
  !octagonRodAbilitySources.every((sourceId) => octagonRodWarning.sourceIds.includes(sourceId)) ||
  !octagonRodObjective || !octagonRodAbilitySources.every((sourceId) => octagonRodObjective.sourceIds.includes(sourceId)) ||
  !octagonRodItem || !octagonRodAbilitySources.every((sourceId) => octagonRodItem.sourceIds.includes(sourceId)) ||
  octagonRodClaims.length !== 3 ||
  !["Firaga", "Blizzaga", "Thundaga"].every((abilityName) =>
    octagonRodClaims.some((claim) => claim.abilityName === abilityName && octagonRodAbilitySources.every((sourceId) => claim.sourceIds.includes(sourceId))),
  ) ||
  octagonRodShopPaths.some((path) => !path || path.itemId !== "game-item.octagon-rod" ||
    !path.conditions?.includes("only equipment source for Firaga, Blizzaga, and Thundaga") ||
    !octagonRodAbilitySources.every((sourceId) => path.sourceIds.includes(sourceId))) ||
  octagonRodWalkthroughSteps.some(({ section, step }) => !section || !step ||
    !/only equipment source|sole equipment source/.test(step.detail) ||
    !octagonRodAbilitySources.every((sourceId) => section.sourceIds.includes(sourceId)))
) {
  errors.push("The Octagon Rod cutoff must link both PlayStation ability catalogs to its warning, objective, item, all three ability claims, both Disc III shop paths, and each walkthrough checkpoint while preserving release uncertainty.");
}
const hamelinJewelWarning = missablesById.get("missable.disc-3.lost-continent.hamelin-jewel");
const hamelinJewelObjective = objectives.find((objective) => objective.id === "disc-3.lost-continent.hamelin-jewel");
const hamelinItem = gameItems.find((item) => item.id === "game-item.hamelin");
const hamelinJewelClaims = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.hamelin");
const hamelinJewelShopPaths = [
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.esto-gaza.hamelin"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.hamelin"),
];
const hamelinTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-3.preparing-to-leave.hamelin");
const hamelinAbilitySources = ["gamefaqs-abilities-71891", "rpgclassics-abilities"];
const hamelinWalkthroughSteps = [
  { chapterId: "disc-3.lost-continent", stepId: "lost-continent-esto-gaza-shop" },
  { chapterId: "disc-3.aerial-exploration", stepId: "aerial-daguerreo-weapon-shop" },
  { chapterId: "disc-3.preparing-to-leave", stepId: "preparing-leave-shop-inventory" },
].map(({ chapterId, stepId }) => {
  const chapter = walkthroughChapters.find((candidate) => candidate.areaId === chapterId);
  const section = chapter?.sections.find((candidate) => candidate.steps.some((step) => step.id === stepId));
  return {
    section,
    step: section?.steps.find((candidate) => candidate.id === stepId),
  };
});
if (
  !hamelinJewelWarning || hamelinJewelWarning.severity !== "info" ||
  !hamelinJewelWarning.consequence.includes("only equipment source") ||
  !hamelinJewelWarning.nextAvailability.includes("neither ability catalog lists an alternate Jewel source") ||
  !hamelinJewelWarning.action.includes("two-copy target is an inventory-planning count") ||
  !hamelinJewelWarning.recovery.includes("direct cross-release testing is incomplete") ||
  !hamelinAbilitySources.every((sourceId) => hamelinJewelWarning.sourceIds.includes(sourceId)) ||
  !hamelinJewelObjective || !hamelinAbilitySources.every((sourceId) => hamelinJewelObjective.sourceIds.includes(sourceId)) ||
  !hamelinItem || !hamelinAbilitySources.every((sourceId) => hamelinItem.sourceIds.includes(sourceId)) ||
  hamelinJewelClaims.length !== 1 || hamelinJewelClaims[0].abilityName !== "Jewel" ||
  !hamelinAbilitySources.every((sourceId) => hamelinJewelClaims[0].sourceIds.includes(sourceId)) ||
  hamelinJewelShopPaths.some((path) => !path || path.itemId !== "game-item.hamelin" ||
    !path.conditions.includes("only equipment source") ||
    !path.notes?.includes("One copy is enough to teach Jewel") ||
    !hamelinAbilitySources.every((sourceId) => path.sourceIds.includes(sourceId))) ||
  !hamelinTarget || hamelinTarget.targetQuantity !== 2 || hamelinTarget.basis !== "checkpoint-total" ||
  !hamelinTarget.interpretation.includes("not a universal minimum") ||
  hamelinWalkthroughSteps.some(({ section, step }) => !section || !step ||
    !/only (documented )?equipment source/.test(step.detail) ||
    !hamelinAbilitySources.every((sourceId) => section.sourceIds.includes(sourceId)))
) {
  errors.push("The Hamelin/Jewel cutoff must link both PlayStation ability catalogs to its warning, objective, item claim, both Disc III shop paths, and walkthrough checkpoints while keeping GameFAQs' two-copy target optional and release behavior unverified.");
}
const summitEquipmentWarning = missablesById.get("missable.disc-2.journey-to-treno.summit-station-equipment-stock");
const summitSilverGlovesTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-2.journey-to-treno.silver-gloves");
const summitIronHelmTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-2.journey-to-treno.iron-helm");
const summitSilverGlovesPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-silver-gloves-shop");
const summitIronHelmPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-iron-helm-shop");
const summitStationWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-treno-shop-and-train");
const cavesDisc3SouthGateSource = sources.find((source) => source.id === "cavesofnarshe-ff9-disc-3-map");
const gamefaqsShopsSource = sources.find((source) => source.id === "gamefaqs-shops-71891");
if (
  !summitEquipmentWarning ||
  !summitEquipmentWarning.classification.includes("limited-quantity") ||
  !summitEquipmentWarning.consequence.includes("separates the consumables-only South (Dali) Gate item shop from Summit Station's equipment shop") ||
  !summitEquipmentWarning.recovery.includes("no post-Summit route is confirmed") ||
  !summitEquipmentWarning.note.includes("item table gives Need 3") ||
  !summitEquipmentWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  !summitEquipmentWarning.sourceIds.includes("neoseeker-item-locations-182566") ||
  !summitEquipmentWarning.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitSilverGlovesTarget || summitSilverGlovesTarget.targetQuantity !== 4 ||
  !summitIronHelmTarget || summitIronHelmTarget.targetQuantity !== 3 ||
  !summitSilverGlovesTarget.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitIronHelmTarget.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitSilverGlovesPath?.notes?.includes("generic South Gate shop") ||
  !summitIronHelmPath?.notes?.includes("generic South Gate shop") ||
  !summitStationWalkthroughStep?.detail.includes("GameFAQs' missables list recommends four Silver Gloves") ||
  !summitStationWalkthroughStep.detail.includes("separates the consumables-only South (Dali) Gate shop from Summit Station's equipment stock") ||
  !summitStationWalkthroughStep.detail.includes("Caves of Narshe's Disc III map") ||
  !cavesDisc3SouthGateSource?.notes.includes("does not identify its Disc III listing as either named location") ||
  !gamefaqsShopsSource?.notes.includes("separates the consumables-only South (Dali) Gate item shop from Summit Station's equipment shop")
) {
  errors.push("The Summit Station inventory warning must preserve the GameFAQs/Neoseeker cutoff and Caves of Narshe's ambiguous Disc III South Gate stock, without presenting later recovery as verified.");
}
const moonstoneId = "game-item.moonstone";
const rubyId = "game-item.ruby";
const rubyPaths = itemAcquisitionPaths.filter((path) => path.itemId === rubyId);
if (!gameItems.some((item) => item.id === rubyId && item.name === "Ruby" && item.category === "equipment")) {
  errors.push("Ruby must be present in the equipment catalog.");
}
if (rubyPaths.length !== 2) {
  errors.push(`Ruby must map its Iifa Tree reward and Stiltzkin bundle; found ${rubyPaths.length} path(s).`);
}
const iifaTreeRubyPath = rubyPaths.find((path) => path.id === "item-path.disc-2.iifa-tree.ruby-seal-reward");
if (iifaTreeRubyPath?.method !== "quest-reward" || iifaTreeRubyPath.chapterId !== "disc-2.iifa-tree" ||
  iifaTreeRubyPath.availability !== "single-use" ||
  !iifaTreeRubyPath.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.treasure-sweep") ||
  !iifaTreeRubyPath.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.carbuncle-ruby") ||
  !iifaTreeRubyPath.sourceIds.includes("gamefaqs-iifa-tree-71891")) {
  errors.push("Ruby's Iifa Tree reward must link its story chapter, Ruby checklist objectives, and walkthrough source.");
}
const stiltzkinRubyPath = rubyPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.ruby-stiltzkin-eighth-bundle");
if (stiltzkinRubyPath?.method !== "mogshop" || stiltzkinRubyPath.chapterId !== "disc-4.return-to-gaia" ||
  stiltzkinRubyPath.cost?.amount !== 5555 || stiltzkinRubyPath.cost.bundleId !== "alexandria-stiltzkin-eighth-bundle" ||
  stiltzkinRubyPath.shopId !== "stiltzkin-alexandria-eighth" ||
  !stiltzkinRubyPath.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.stiltzkin-eighth-bundle") ||
  !stiltzkinRubyPath.sourceIds.includes("gamefaqs-stiltzkin-shopping-71891")) {
  errors.push("Ruby's Disc IV Stiltzkin path must record the one-time Alexandria bundle, shared 5,555-Gil price, and source objective.");
}
const expectedRubyAbilities = new Set(["Carbuncle", "Reflect"]);
const rubyAbilities = new Set(equipmentAbilityClaims.filter((claim) => claim.itemId === rubyId).map((claim) => claim.abilityName));
if ([...expectedRubyAbilities].some((ability) => !rubyAbilities.has(ability)) || rubyAbilities.size !== expectedRubyAbilities.size) {
  errors.push("Ruby must have exactly the Carbuncle and Reflect ability claims.");
}
const flameStaffId = "game-item.flame-staff";
const flameStaffPaths = itemAcquisitionPaths.filter((path) => path.itemId === flameStaffId);
const expectedFlameStaffPathIds = new Set([
  "item-path.disc-2.journey-to-treno.flame-staff-black-waltz-3-steal",
  "item-path.disc-2.cleyra.flame-staff-cleyra-trunk-chest",
  "item-path.disc-2.treno.flame-staff-shop",
  "item-path.disc-2.cleyra.flame-staff-shop",
  "item-path.disc-2.return-to-lindblum.cleyra-recovery.flame-staff",
  "item-path.disc-2.outer-continent.conde-petie-flame-staff-shop",
  "item-path.disc-2.magdalene-forest.black-mage-village-flame-staff-shop",
  "item-path.disc-3.the-home-front.alexandria-flame-staff-shop",
]);
const actualFlameStaffPathIds = new Set(flameStaffPaths.map((path) => path.id));
if (!gameItems.some((item) => item.id === flameStaffId && item.name === "Flame Staff" && item.category === "equipment")) {
  errors.push("Flame Staff must be present in the equipment catalog.");
}
if (flameStaffPaths.length !== expectedFlameStaffPathIds.size ||
  [...expectedFlameStaffPathIds].some((pathId) => !actualFlameStaffPathIds.has(pathId))) {
  errors.push(`Flame Staff must map its Black Waltz 3 steal, Cleyra Trunk chest, and six shops; found ${flameStaffPaths.length} path(s).`);
}
const flameStaffSteal = flameStaffPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.flame-staff-black-waltz-3-steal");
if (flameStaffSteal?.method !== "steal" || flameStaffSteal.availability !== "one-time-encounter" ||
  !flameStaffSteal.walkthroughObjectiveIds?.includes("disc-2.journey-to-treno.black-waltz-3-steals")) {
  errors.push("Flame Staff's Black Waltz 3 route must remain a one-time steal linked to the battle objective.");
}
const flameStaffChest = flameStaffPaths.find((path) => path.id === "item-path.disc-2.cleyra.flame-staff-cleyra-trunk-chest");
if (flameStaffChest?.method !== "chest" || flameStaffChest.chapterId !== "disc-2.cleyra" ||
  !flameStaffChest.walkthroughObjectiveIds?.includes("disc-2.cleyra.treasure-sweep")) {
  errors.push("Flame Staff's Cleyra Trunk chest must link the Disc II Cleyra treasure sweep.");
}
const expectedFlameStaffShops = new Set([
  "treno.weapon-shop.disc-2",
  "cleyra.burmecian-soldier-dan.weapon-shop",
  "lindblum.weapon-shop.disc-2",
  "conde-petie.weapon-shop",
  "black-mage-village.weapon-shop.disc-2-3",
  "alexandria.weapon-shop.disc-3-4",
]);
const flameStaffShops = flameStaffPaths.filter((path) => path.method === "shop");
const actualFlameStaffShops = new Set(flameStaffShops.map((path) => path.shopId));
if (flameStaffShops.length !== expectedFlameStaffShops.size ||
  flameStaffShops.some((path) => path.cost?.amount !== 1100) ||
  [...expectedFlameStaffShops].some((shopId) => !actualFlameStaffShops.has(shopId))) {
  errors.push("Flame Staff must have six source-listed 1,100-Gil shops: Treno, Cleyra, Lindblum, Conde Petie, Black Mage Village, and Alexandria.");
}
const expectedFlameStaffAbilities = new Set(["Fira", "Sleep"]);
const flameStaffAbilities = new Set(equipmentAbilityClaims.filter((claim) => claim.itemId === flameStaffId).map((claim) => claim.abilityName));
if ([...expectedFlameStaffAbilities].some((ability) => !flameStaffAbilities.has(ability)) ||
  flameStaffAbilities.size !== expectedFlameStaffAbilities.size) {
  errors.push("Flame Staff must have exactly the Fira and Sleep ability claims.");
}
const blackWaltz3StealWarning = missables.find((missable) => missable.id === "missable.disc-2.journey-to-treno.black-waltz-3-steals");
if (!blackWaltz3StealWarning ||
  !blackWaltz3StealWarning.classification.includes("recoverable-later") ||
  !["Treno", "Cleyra", "Lindblum", "Conde Petie", "Black Mage Village", "Alexandria"].every((shop) => blackWaltz3StealWarning.recovery.includes(shop)) ||
  !blackWaltz3StealWarning.sourceIds.includes("gamefaqs-equipment-33383")) {
  errors.push("The Black Waltz 3 missable warning must classify the item types as recoverable later and list Flame Staff shop recoveries with their independent equipment source.");
}
const steepledHatId = "game-item.steepled-hat";
const steepledHatBmvPath = itemAcquisitionPaths.find((path) => path.itemId === steepledHatId && path.id === "item-path.disc-2.outer-continent.steepled-hat-black-mage-village-shop");
if (!steepledHatBmvPath || steepledHatBmvPath.shopId !== "black-mage-village.weapon-shop.disc-2-3" ||
  steepledHatBmvPath.cost?.amount !== 260 || steepledHatBmvPath.availability !== "limited-window" ||
  !steepledHatBmvPath.sourceIds.includes("gamefaqs-items-71891") || !steepledHatBmvPath.sourceIds.includes("gamefaqs-shops-71891")) {
  errors.push("Steepled Hat's Disc II–III Black Mage Village recovery must remain a source-linked 260-Gil shop path.");
}
const steepledHatNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.steepled-hat");
const steepledHatEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.steepled-hat-end-inventory");
if (!steepledHatNeedTarget || steepledHatNeedTarget.targetQuantity !== 7 ||
  steepledHatNeedTarget.basis !== "route-need" ||
  !steepledHatNeedTarget.interpretation.includes("Need 7") ||
  !steepledHatNeedTarget.interpretation.includes("end-inventory #10") ||
  !steepledHatEndInventoryTarget || steepledHatEndInventoryTarget.targetQuantity !== 10 ||
  steepledHatEndInventoryTarget.basis !== "end-inventory" ||
  !steepledHatEndInventoryTarget.interpretation.includes("including equipped copies") ||
  !steepledHatEndInventoryTarget.interpretation.includes("not a purchase total") ||
  sourceInventoryTargets.some((target) => target.id === "item-target.disc-4.final-preparations.steepled-hat-buy")) {
  errors.push("Steepled Hat's GameFAQs Need 7 and end-inventory #10 must remain distinct; #10 is not a Buy total.");
}
for (const [targetId, expectedBasis] of [
  ["item-target.disc-2.treno.air-racket", "purchase-recommendation"],
  ["item-target.disc-2.journey-to-treno.silver-gloves", "checkpoint-total"],
  ["item-target.disc-2.journey-to-treno.iron-helm", "checkpoint-total"],
  ["item-target.disc-2.return-to-lindblum.chain-mail", "checkpoint-total"],
  ["item-target.disc-3.portal-to-another-world.zorlin-shape", "purchase-recommendation"],
] as const) {
  if (sourceInventoryTargets.find((target) => target.id === targetId)?.basis !== expectedBasis) {
    errors.push(`Inventory target ${targetId} must retain its ${expectedBasis} semantics.`);
  }
}
if (itemAcquisitionPaths.some((path) => path.itemId === steepledHatId && path.shopId === "treno.weapon-shop.disc-2") ||
  !blackWaltz3StealWarning?.recovery.includes("Steepled Hat can be bought at Atla") ||
  !blackWaltz3StealWarning.recovery.includes("Black Mage Village (Discs II–III)") ||
  !blackWaltz3StealWarning.recovery.includes("Treno's Disc II weapon-shop list does not include it")) {
  errors.push("Black Waltz 3 recovery must name Steepled Hat's Atla/Black Mage Village routes and keep Treno excluded for that item.");
}
const blackWaltz3RematchSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
  ?.sections.find((section) => section.id === "journey-treno-black-waltz-3");
const blackWaltz3RematchStep = blackWaltz3RematchSection?.steps.find((step) => step.id === "journey-treno-black-waltz-3-steals");
if (!blackWaltz3RematchStep?.detail.includes("Black Mage Village (Discs II–III)") ||
  !blackWaltz3RematchStep.detail.includes("Treno's Disc II weapon shop does not list Steepled Hat") ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891"].every((sourceId) => blackWaltz3RematchSection?.sourceIds.includes(sourceId))) {
  errors.push("The Black Waltz 3 walkthrough must source Steepled Hat's Black Mage Village recovery and clarify that Treno does not sell it.");
}
const moonstonePaths = itemAcquisitionPaths.filter((path) => path.itemId === moonstoneId);
const requiredMoonstonePaths = [
  { id: "item-path.disc-1.alexandria.moonstone-brahne", objectiveId: "disc-1.alexandria.swordfight.moonstone-1" },
  { id: "item-path.disc-2.conde-petie-mountain-path.moonstone-colored-stones", objectiveId: "disc-2.conde-petie-mountain-path.moonstone" },
  { id: "item-path.disc-3.forgotten-continent.moonstone-friendly-jabberwock", objectiveId: "disc-3.forgotten-continent.jabberwock" },
  { id: "item-path.disc-4.return-to-gaia.moonstone-stiltzkin-eighth-bundle", objectiveId: "disc-4.return-to-gaia.stiltzkin-eighth-bundle" },
];
const earthGuardianRecord = enemyRecords.find((enemy) => enemy.id === "enemy.earth-guardian");
const earthGuardianEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.breaking-the-seal.earth-guardian");
const earthGuardianWarning = missablesById.get("missable.disc-3.breaking-the-seal.earth-guardian-steals");
const earthGuardianCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.earth-guardian.steals");
const earthGuardianStealExpectations = [
  { itemId: "game-item.avenger", slot: "common", pathId: "item-path.disc-3.breaking-the-seal.earth-guardian-avenger-steal", rate: "70%" },
  { itemId: "game-item.rubber-suit", slot: "uncommon", pathId: "item-path.disc-3.breaking-the-seal.earth-guardian-rubber-suit-steal", rate: "23%" },
];
if (!earthGuardianRecord || earthGuardianRecord.kind !== "boss" ||
  !earthGuardianRecord.encounterIds.includes("encounter.breaking-the-seal.earth-guardian") ||
  !earthGuardianRecord.stats.some((claim) => claim.field === "HP" && claim.value === 20756 && claim.verification === "cross-checked") ||
  !earthGuardianRecord.blueMagic.some((skill) => skill.name === "Earth Shake" && skill.objectiveIds.includes("disc-3.breaking-the-seal.earth-shake")) ||
  !earthGuardianRecord.drops.some((slot) => slot.slot === "always" && slot.itemId === "game-item.phoenix-pinion")) {
  errors.push("Earth Guardian's bestiary profile must include its fixed encounter, cross-checked HP, Earth Shake opportunity, and guaranteed Phoenix Pinion.");
}
if (!earthGuardianEncounter || earthGuardianEncounter.kind !== "boss" ||
  !earthGuardianEncounter.formation.some((entry) => entry.enemyId === "enemy.earth-guardian" && entry.quantity === 1) ||
  !earthGuardianEncounter.objectiveIds.includes("disc-3.breaking-the-seal.earth-guardian-steals") ||
  !earthGuardianEncounter.objectiveIds.includes("disc-3.breaking-the-seal.earth-shake") ||
  !earthGuardianEncounter.missableIds.includes("missable.disc-3.breaking-the-seal.earth-guardian-steals") ||
  !earthGuardianEncounter.cutoffIds.includes("cutoff.earth-guardian.steals")) {
  errors.push("Earth Guardian's fixed Earth Shrine encounter must link its steal, Earth Shake, missable, and cutoff records.");
}
for (const expected of earthGuardianStealExpectations) {
  const steal = earthGuardianRecord?.steals.find((slot) => slot.slot === expected.slot && slot.itemId === expected.itemId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!steal || !path || path.itemId !== expected.itemId || path.method !== "steal" ||
    path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-3.breaking-the-seal.earth-guardian-steals") ||
    !path.conditions?.includes(expected.rate)) {
    errors.push(`Earth Guardian's ${expected.itemId} one-time steal must match its slot, objective, and sourced chance note.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === expected.itemId &&
    candidate.chapterId !== "disc-3.breaking-the-seal" &&
    guideAreas.findIndex((area) => area.id === candidate.chapterId) > guideAreas.findIndex((area) => area.id === "disc-3.breaking-the-seal"))) {
    errors.push(`Earth Guardian's ${expected.itemId} steal must have a later item-type recovery path.`);
  }
}
const earthGuardianAvengerRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.portal-to-another-world.avenger-bran-bal-mogshop");
const earthGuardianRubberSuitRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.rubber-suit-synthesis");
if (!earthGuardianAvengerRecovery || earthGuardianAvengerRecovery.itemId !== "game-item.avenger" ||
  earthGuardianAvengerRecovery.method !== "mogshop" || earthGuardianAvengerRecovery.cost?.amount !== 16000 ||
  !earthGuardianRubberSuitRecovery || earthGuardianRubberSuitRecovery.itemId !== "game-item.rubber-suit" ||
  earthGuardianRubberSuitRecovery.method !== "synthesis" || earthGuardianRubberSuitRecovery.cost?.amount !== 20000) {
  errors.push("Earth Guardian steal recovery must link Avenger's Bran Bal purchase and Rubber Suit's Disc IV synthesis.");
}
if (!earthGuardianWarning?.classification.includes("recoverable-later") ||
  !earthGuardianWarning.nextAvailability.includes("Bran Bal Mogshop") ||
  !earthGuardianWarning.nextAvailability.includes("Black Cat synthesis") ||
  !earthGuardianWarning.recovery.includes("Black Mage Village") ||
  !earthGuardianCutoff?.missableIds.includes("missable.disc-3.breaking-the-seal.earth-guardian-steals")) {
  errors.push("Earth Guardian's steal warning must distinguish one-time encounter loss from the documented shop and synthesis recovery routes.");
}
const tantarianRecord = enemyRecords.find((enemy) => enemy.id === "enemy.tantarian");
const tantarianDisc2Encounter = enemyEncounters.find((encounter) => encounter.id === "encounter.tantarian.disc-2-library");
const tantarianDisc3Encounter = enemyEncounters.find((encounter) => encounter.id === "encounter.tantarian.disc-3-library");
const tantarianWarning = missablesById.get("missable.disc-3.trouble-on-the-home-front.tantarian");
const tantarianCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.alexandria-defense.tantarian");
const tantarianStealExpectations = [
  { itemId: "game-item.ether", slot: "common", pathId: "item-path.disc-2.return-to-alexandria.tantarian-ether-steal" },
  { itemId: "game-item.elixir", slot: "uncommon", pathId: "item-path.disc-2.return-to-alexandria.tantarian-elixir-steal" },
  { itemId: "game-item.silver-fork", slot: "semi-rare", pathId: "item-path.disc-2.return-to-alexandria.tantarian-silver-fork-steal" },
  { itemId: "game-item.demons-mail", slot: "rare", pathId: "item-path.disc-2.return-to-alexandria.tantarian-demons-mail-steal" },
];
if (!tantarianRecord || tantarianRecord.kind !== "boss" ||
  !tantarianRecord.encounterIds.includes("encounter.tantarian.disc-2-library") ||
  !tantarianRecord.encounterIds.includes("encounter.tantarian.disc-3-library") ||
  !tantarianRecord.stats.some((claim) => claim.field === "level" && claim.value === 41 && claim.verification === "cross-checked") ||
  !tantarianRecord.stats.some((claim) => claim.field === "HP" && claim.value === 21997 && claim.verification === "cross-checked") ||
  !tantarianRecord.stats.some((claim) => claim.field === "MP" && claim.value === 1456) ||
  !tantarianRecord.stats.some((claim) => claim.field === "EXP" && claim.value === 12585) ||
  !tantarianRecord.stats.some((claim) => claim.field === "AP" && claim.value === 30) ||
  !tantarianRecord.stats.some((claim) => claim.field === "Gil" && claim.value === 4472) ||
  !tantarianRecord.drops.some((slot) => slot.slot === "always" && slot.itemId === "game-item.running-shoes") ||
  !tantarianRecord.facts.some((fact) => fact.category === "elemental-weakness" && fact.label === "Holy") ||
  !tantarianRecord.facts.some((fact) => fact.category === "elemental-weakness" && fact.label.includes("Fire") && fact.detail === undefined)) {
  errors.push("Tantarian's shared boss profile must retain its cross-checked stats, two encounter windows, weaknesses, and guaranteed Running Shoes.");
}
if (!tantarianDisc2Encounter || tantarianDisc2Encounter.chapterId !== "disc-2.return-to-alexandria" ||
  !tantarianDisc2Encounter.notes.some((note) => note.includes("first of two")) ||
  !tantarianDisc3Encounter || tantarianDisc3Encounter.chapterId !== "disc-3.trouble-on-the-home-front" ||
  !tantarianDisc3Encounter.objectiveIds.includes("disc-2.return-to-alexandria.tantarian") ||
  !tantarianDisc3Encounter.missableIds.includes("missable.disc-3.trouble-on-the-home-front.tantarian") ||
  !tantarianDisc3Encounter.cutoffIds.includes("cutoff.alexandria-defense.tantarian") ||
  !tantarianWarning?.classification.includes("conditional") ||
  !tantarianWarning?.classification.includes("recoverable-later") ||
  !tantarianCutoff?.missableIds.includes("missable.disc-3.trouble-on-the-home-front.tantarian")) {
  errors.push("Tantarian's Disc II and Disc III windows must share one objective and link the final chance to its conditional warning and cutoff.");
}
for (const expected of tantarianStealExpectations) {
  const steal = tantarianRecord?.steals.find((slot) => slot.slot === expected.slot && slot.itemId === expected.itemId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!steal || !path || path.itemId !== expected.itemId || path.method !== "steal" ||
    path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.tantarian")) {
    errors.push(`Tantarian's ${expected.itemId} steal must match its bestiary slot and shared one-time encounter objective.`);
  }
}
const tantarianRunningShoesPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-alexandria.tantarian-running-shoes");
if (!tantarianRunningShoesPath || tantarianRunningShoesPath.itemId !== "game-item.running-shoes" ||
  tantarianRunningShoesPath.method !== "drop" ||
  !tantarianRunningShoesPath.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.tantarian") ||
  !tantarianRecord?.notes.some((note) => note.includes("not separate victories"))) {
  errors.push("Tantarian's guaranteed Running Shoes route must be shared across the two alternative story windows.");
}
const moonstoneItem = gameItems.find((item) => item.id === moonstoneId);
if (!moonstoneItem || moonstoneItem.name !== "Moonstone" || moonstoneItem.category !== "equipment" ||
  !moonstoneItem.sourceIds.includes("gamefaqs-achievements-71891") ||
  !moonstoneItem.sourceIds.includes("gamerguides-over-the-moon-achievement") ||
  !moonstoneItem.sourceIds.includes("xboxachievements-FFIX-list")) {
  errors.push("Moonstone must be present in the equipment catalog with cross-platform achievement citations.");
}
if (moonstonePaths.length !== requiredMoonstonePaths.length) {
  errors.push(`Moonstone must map exactly four achievement acquisition opportunities; found ${moonstonePaths.length}.`);
}
for (const expected of requiredMoonstonePaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  if (!path || path.itemId !== moonstoneId || !path.walkthroughObjectiveIds?.includes(expected.objectiveId)) {
    errors.push(`Moonstone acquisition path ${expected.id} must link the item and objective ${expected.objectiveId}.`);
  }
}
const mountainMoonstoneItemPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.conde-petie-mountain-path.moonstone-colored-stones");
if (mountainMoonstoneItemPath?.availability !== "limited-window" ||
  mountainMoonstoneItemPath.recommendedBeforeChapterId !== "disc-3.preparing-to-leave" ||
  !mountainMoonstoneItemPath.sourceIds.includes("gamefaqs-mountain-path-return-29957")) {
  errors.push("The catalog Moonstone route must keep the Disc II recovery source and Disc III final cutoff.");
}
const stiltzkinMoonstonePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.moonstone-stiltzkin-eighth-bundle");
if (stiltzkinMoonstonePath?.method !== "mogshop" || stiltzkinMoonstonePath.cost?.amount !== 5555 ||
  stiltzkinMoonstonePath.shopId !== "stiltzkin-alexandria-eighth" ||
  !stiltzkinMoonstonePath.sourceIds.includes("gamefaqs-return-to-gaia-71891")) {
  errors.push("The Disc IV Moonstone route must record Stiltzkin's Alexandria bundle and 5,555-Gil price.");
}
const pearlRougeId = "game-item.pearl-rouge";
const pearlRougeRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.pearl-rouge");
if (!gameItems.some((item) => item.id === pearlRougeId && item.name === "Pearl Rouge" && item.category === "equipment")) {
  errors.push("Pearl Rouge must be present in the equipment catalog.");
}
if (!pearlRougeRecipe || pearlRougeRecipe.resultItemId !== pearlRougeId || pearlRougeRecipe.cost.amount !== 5000 ||
  pearlRougeRecipe.ingredients.length !== 2 ||
  !pearlRougeRecipe.ingredients.some((ingredient) => ingredient.itemId === moonstoneId && ingredient.quantity === 1) ||
  !pearlRougeRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.elixir" && ingredient.quantity === 1)) {
  errors.push("Pearl Rouge synthesis must use one Moonstone and one Elixir for 5,000 Gil.");
}
const pearlRougePaths = itemAcquisitionPaths.filter((path) => path.itemId === pearlRougeId);
const pearlRougeAuction = pearlRougePaths.find((path) => path.method === "auction");
const pearlRougeSynthesisPaths = pearlRougePaths.filter((path) => path.method === "synthesis");
const pearlRougeSynthesisShops = new Set(pearlRougeSynthesisPaths.map((path) => path.shopId));
if (!pearlRougeAuction || pearlRougeAuction.availability !== "repeatable" || pearlRougeAuction.chapterId !== "disc-2.treno" ||
  pearlRougeAuction.cost || !pearlRougeAuction.conditions?.includes("17,100 Gil") ||
  !pearlRougeAuction.sourceIds.includes("gamefaqs-treno-auction-71891")) {
  errors.push("Pearl Rouge's Treno auction route must record its Disc II repeatable availability and variable bid price.");
}
for (const shopId of [
  "alexandria.synthesis-shop.disc-3",
  "treno.synthesis-shop.disc-3-4",
  "lindblum.synthesis-shop.disc-3-4",
  "daguerreo.synthesis-expert",
]) {
  if (!pearlRougeSynthesisShops.has(shopId)) errors.push(`Pearl Rouge synthesis is missing the source-listed shop ${shopId}.`);
}
if (pearlRougeSynthesisPaths.length !== 4 || pearlRougeSynthesisPaths.some((path) =>
  path.recipeId !== "synthesis-recipe.pearl-rouge" || path.cost?.amount !== 5000)) {
  errors.push("Pearl Rouge must have four priced synthesis paths linked to its 5,000-Gil recipe.");
}
const expectedPearlRougeAbilities = new Set(["Level Up", "Loudmouth", "Reflect-Null"]);
const pearlRougeAbilities = new Set(equipmentAbilityClaims.filter((claim) => claim.itemId === pearlRougeId).map((claim) => claim.abilityName));
if ([...expectedPearlRougeAbilities].some((ability) => !pearlRougeAbilities.has(ability))) {
  errors.push("Pearl Rouge must link the Level Up, Loudmouth, and Reflect-Null ability claims.");
}
if (pearlRougeAbilities.size !== expectedPearlRougeAbilities.size) {
  errors.push("Pearl Rouge must have exactly three sourced ability claims.");
}
const expectedMoonstoneAbilities = new Set(["Shell", "Beast Killer"]);
const moonstoneAbilities = new Set(equipmentAbilityClaims.filter((claim) => claim.itemId === moonstoneId).map((claim) => claim.abilityName));
if ([...expectedMoonstoneAbilities].some((ability) => !moonstoneAbilities.has(ability))) {
  errors.push("Moonstone must link the Shell and Beast Killer ability claims.");
}
if (moonstoneAbilities.size !== expectedMoonstoneAbilities.size) {
  errors.push("Moonstone must have exactly two sourced ability claims.");
}
const overTheMoonObjectives = [
  "disc-1.alexandria.swordfight.moonstone-1",
  "disc-2.conde-petie-mountain-path.moonstone",
  "disc-3.forgotten-continent.jabberwock",
  "disc-4.return-to-gaia.stiltzkin-eighth-bundle",
];
const overTheMoonRecords = achievementCatalogs.flatMap(({ records }) => records).filter((achievement) => achievement.id === "over-the-moon");
if (overTheMoonRecords.length !== 3 || overTheMoonRecords.some((achievement) =>
  JSON.stringify(achievement.guideObjectiveIds) !== JSON.stringify(overTheMoonObjectives) ||
  achievement.guideObjectiveIds?.includes("disc-3.lost-continent.feather-circle") ||
  !achievement.guideNote?.includes("Friendly Feather Circle is a separate request that consumes a Moonstone") ||
  !achievement.guideSourceIds?.includes("playstationtrophies-over-the-moon") ||
  !achievement.guideSourceIds.includes("gamefaqs-chocobo-hot-cold-ysf-9771")
)) {
  errors.push("Over the Moon must map the four actual Moonstone sources and distinguish Feather Circle's Moonstone cost.");
}
const powerBeltTrenoWarning = missablesById.get("missable.disc-2.treno.power-belt");
const tiamatGrandHelmWarning = missablesById.get("missable.disc-4.memoria.tiamat-steals");
const trenoPowerBeltCutoff = cutoffsById.get("cutoff.treno-four-armed-man.power-belt");
const tiamatStealCutoff = cutoffsById.get("cutoff.memoria.tiamat-steals");
const powerBeltRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.power-belt");
const grandHelmRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.grand-helm");
const disc4PowerBeltPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.power-belt-synthesis");
const disc4GrandHelmPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.grand-helm-synthesis");
const disc4CrossHelmPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.cross-helm-ipsen-mogshop");
const tiamatGrandHelmPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.tiamat-grand-helm-steal");
const gaiaShopWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "gaia-return-shop-stock");
const tiamatWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-tiamat-steals");
if (!powerBeltTrenoWarning?.classification.includes("conditional") ||
  !powerBeltTrenoWarning.nextAvailability?.includes("retained copy") ||
  !["gamefaqs-item-ability-10332", "gamefaqs-equipment-33383"].every((sourceId) => powerBeltTrenoWarning.sourceIds.includes(sourceId)) ||
  !trenoPowerBeltCutoff?.sourceIds.includes("gamefaqs-item-ability-10332") ||
  !trenoPowerBeltCutoff.sourceIds.includes("gamefaqs-equipment-33383") ||
  !powerBeltRecipe || powerBeltRecipe.cost.amount !== 2000 || powerBeltRecipe.ingredients.length !== 2 ||
  !powerBeltRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.glass-buckle" && ingredient.quantity === 1) ||
  !powerBeltRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.chain-mail" && ingredient.quantity === 1) ||
  !powerBeltRecipe.sourceIds.includes("gamefaqs-item-ability-10332") ||
  !disc4PowerBeltPath || disc4PowerBeltPath.shopName !== "Daguerreo Synthesis Expert (Disc IV)" ||
  !disc4PowerBeltPath.conditions?.includes("retained Chain Mail")) {
  errors.push("Power Belt recovery must retain its source-linked Disc IV recipe and the Chain Mail inventory condition.");
}
if (!tiamatGrandHelmWarning?.nextAvailability?.includes("retained Chain Mail") ||
  !tiamatGrandHelmWarning.recovery?.includes("If neither Power Belt nor Chain Mail remains") ||
  !["gamefaqs-item-ability-10332", "gamefaqs-equipment-33383"].every((sourceId) => tiamatGrandHelmWarning.sourceIds.includes(sourceId)) ||
  !tiamatStealCutoff?.sourceIds.includes("gamefaqs-item-ability-10332") ||
  !tiamatStealCutoff.sourceIds.includes("gamefaqs-equipment-33383") ||
  !grandHelmRecipe || grandHelmRecipe.cost.amount !== 20000 || grandHelmRecipe.ingredients.length !== 2 ||
  !grandHelmRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.cross-helm" && ingredient.quantity === 1) ||
  !grandHelmRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.power-belt" && ingredient.quantity === 1) ||
  !grandHelmRecipe.sourceIds.includes("gamefaqs-item-ability-10332") ||
  !disc4GrandHelmPath || !disc4GrandHelmPath.conditions?.includes("retained Chain Mail") ||
  !disc4CrossHelmPath || disc4CrossHelmPath.shopName !== "Kumool's Mogshop (Ipsen's Castle)" ||
  tiamatGrandHelmPath?.method !== "steal" || tiamatGrandHelmPath.availability !== "one-time-encounter" ||
  !tiamatWalkthroughStep?.detail?.includes("last documented Grand Helm steal") ||
  !gaiaShopWalkthroughStep?.detail?.includes("retained copy")) {
  errors.push("Grand Helm's Tiamat steal and conditional Disc IV synthesis recovery must remain linked through the route, catalog, and walkthrough.");
}
const krakenWarning = missablesById.get("missable.disc-4.memoria.kraken-steals");
const krakenStealObjective = objectivesById.get("disc-4.memoria.kraken-steals");
const wizardRodItem = gameItems.find((item) => item.id === "game-item.wizard-rod");
const wizardRodKrakenShopPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.black-mage-village.weapon-shop.wizard-rod");
const krakenWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-kraken-steals");
if (!krakenWarning?.classification.includes("recoverable-later") ||
  !krakenWarning.nextAvailability?.includes("Wizard Rod is sold at Black Mage Village's Disc IV Weapon Shop for 3,990 Gil") ||
  !krakenWarning.recovery?.includes("Wizard Rod can be bought from Black Mage Village's Disc IV Weapon Shop for 3,990 Gil") ||
  !krakenStealObjective?.sourceIds.includes("gamefaqs-shops-71891") ||
  !wizardRodItem?.sourceIds.includes("gamefaqs-equipment-33383") ||
  !wizardRodKrakenShopPath || wizardRodKrakenShopPath.chapterId !== "disc-4.return-to-gaia" ||
  wizardRodKrakenShopPath.method !== "shop" || wizardRodKrakenShopPath.cost?.amount !== 3990 ||
  !["gamefaqs-items-71891", "gamefaqs-equipment-33383", "cavesofnarshe-ff9-rods"].every((sourceId) => wizardRodKrakenShopPath.sourceIds.includes(sourceId)) ||
  !wizardRodKrakenShopPath.walkthroughObjectiveIds?.includes("disc-4.memoria.kraken-steals") ||
  !krakenWalkthroughStep?.detail?.includes("Wizard Rod can be bought later at Black Mage Village's Disc IV Weapon Shop for 3,990 Gil")) {
  errors.push("Kraken's Wizard Rod steal must be classified as recoverable through the source-linked Disc IV Black Mage Village shop path.");
}
const malirisWarning = missablesById.get("missable.disc-4.memoria.maliris-steals");
const malirisStealObjective = objectivesById.get("disc-4.memoria.maliris-steals");
const genjiArmorChocographPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.genji-armor-chocograph-21");
const ultimaSwordDaguerreoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.daguerreo.weapon-shop.ultima-sword");
const masamuneDisc4SynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.masamune-synthesis");
const malirisWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-maliris-steals");
if (!malirisWarning?.classification.includes("recoverable-later") ||
  !malirisWarning.classification.includes("limited-quantity") ||
  !malirisWarning.nextAvailability?.includes("Daguerreo's Disc IV Weapon Shop sells Ultima Sword for 14,000 Gil") ||
  !malirisWarning.nextAvailability?.includes("Black Cat synthesizes Masamune from Zorlin Shape + Orichalcon for 16,000 Gil") ||
  !malirisWarning.nextAvailability?.includes("Need 3 target conflicts with its two listed sources and end-inventory #2") ||
  !["gamefaqs-shops-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-synthesis", "rpgclassics-armor"].every((sourceId) => malirisStealObjective?.sourceIds.includes(sourceId)) ||
  !genjiArmorChocographPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.maliris-steals") ||
  !genjiArmorChocographPath.sourceIds.includes("gamefaqs-chocobo-hot-cold-71891") ||
  !ultimaSwordDaguerreoPath || ultimaSwordDaguerreoPath.method !== "shop" || ultimaSwordDaguerreoPath.cost?.amount !== 14000 ||
  !ultimaSwordDaguerreoPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !ultimaSwordDaguerreoPath.walkthroughObjectiveIds?.includes("disc-4.memoria.maliris-steals") ||
  !masamuneDisc4SynthesisPath || masamuneDisc4SynthesisPath.method !== "synthesis" ||
  masamuneDisc4SynthesisPath.recipeId !== "synthesis-recipe.masamune" || masamuneDisc4SynthesisPath.cost?.amount !== 16000 ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis"].every((sourceId) => masamuneDisc4SynthesisPath.sourceIds.includes(sourceId)) ||
  !masamuneDisc4SynthesisPath.walkthroughObjectiveIds?.includes("disc-4.memoria.maliris-steals") ||
  !malirisWalkthroughStep?.detail?.includes("Daguerreo sells Ultima Sword on Disc IV for 14,000 Gil") ||
  !malirisWalkthroughStep.detail.includes("Genji Armor Need 3 but only two sources")) {
  errors.push("Maliris's one-time steals must be linked to the documented Chocograph, Daguerreo shop, and Disc IV Masamune synthesis routes, with the Genji Armor copy-count conflict preserved.");
}
const lichWarning = missablesById.get("missable.disc-4.memoria.lich-steals");
const lichStealObjective = objectivesById.get("disc-4.memoria.lich-steals");
const genjiGlovesDivePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.genji-gloves-dive-spot-1");
const blackRobeDivePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.black-robe-dive-spot-1");
const sirensFluteShopPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4-shop.black-mage-village.weapon-shop.sirens-flute");
const blackRobeSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.black-robe-synthesis");
const blackRobeRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.black-robe");
const lichWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-lich-steals");
if (!lichWarning?.classification.includes("recoverable-later") ||
  !lichWarning.classification.includes("limited-quantity") ||
  !lichWarning.nextAvailability?.includes("Siren's Flute for 7,000 Gil") ||
  !lichWarning.nextAvailability.includes("Black Robe from Gaia Gear + N-Kai Armlet for 8,000 Gil") ||
  !lichWarning.nextAvailability.includes("Genji Gloves Need 3") ||
  !["gamefaqs-shops-71891", "gamefaqs-chocobo-hot-cold-71891", "rpgclassics-synthesis"].every((sourceId) => lichStealObjective?.sourceIds.includes(sourceId)) ||
  !genjiGlovesDivePath?.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals") ||
  !blackRobeDivePath?.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals") ||
  !sirensFluteShopPath || sirensFluteShopPath.method !== "shop" || sirensFluteShopPath.cost?.amount !== 7000 ||
  !sirensFluteShopPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !sirensFluteShopPath.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals") ||
  !blackRobeRecipe || blackRobeRecipe.cost.amount !== 8000 ||
  blackRobeRecipe.resultItemId !== "game-item.black-robe" ||
  !blackRobeRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.gaia-gear") ||
  !blackRobeRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.n-kai-armlet") ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis"].every((sourceId) => blackRobeRecipe.sourceIds.includes(sourceId)) ||
  !blackRobeSynthesisPath || blackRobeSynthesisPath.recipeId !== "synthesis-recipe.black-robe" ||
  blackRobeSynthesisPath.method !== "synthesis" || blackRobeSynthesisPath.cost?.amount !== 8000 ||
  !blackRobeSynthesisPath.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals") ||
  !lichWalkthroughStep?.detail?.includes("Siren's Flute on Disc IV for 7,000 Gil") ||
  !lichWalkthroughStep.detail.includes("Black Robe from Gaia Gear + N-Kai Armlet for 8,000 Gil") ||
  !lichWalkthroughStep.detail.includes("Genji Gloves Need 3")) {
  errors.push("Lich's one-time steals must link the Dive Spot #1 copies, the Siren's Flute Disc IV shop, the Black Robe Disc IV synthesis route, and the unresolved Genji Gloves quantity target.");
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
