import { achievementSourceCounts, arcs, guideAreas, missables, objectives, sources } from "../src/data/guide.ts";
import { androidAchievements, iosAchievements, ps4Trophies, steamAchievements, xboxAchievements } from "../src/data/achievements.ts";
import { excalibur2Checkpoints } from "../src/data/excalibur2.ts";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticExclusiveGroupId, movieCriticTarget } from "../src/data/ates.ts";
import { ateObjectiveDependencies, gameRouteCoverage, gameRouteCutoffs, gameRouteEdges, guideChapterSequence, guideSequenceEdges, objectiveAccessDependencies, objectiveDependencies, questPrerequisiteDependencies, storyPartySequences } from "../src/data/progression.ts";
import { findObjectiveDependencyCycles } from "../src/domain/progression.ts";
import { chocoboBeachLocations, chocoboBeachObjectiveId, chocoboBeachObjectiveIds } from "../src/data/chocobo.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage, sourceInventoryTargets } from "../src/data/items.ts";
import { synthesisRecipes } from "../src/data/synthesis.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";
import { enemyCatalogCoverage, enemyEncounters, enemyRecords } from "../src/data/enemies.ts";
import { ragtimeMouseFinalRewardObjectiveId, ragtimeMouseQuestions, ragtimeQuestionSourceIds } from "../src/data/ragtimeMouse.ts";

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
checkUnique("iOS Game Center achievement", iosAchievements.map((achievement) => achievement.id));
checkUnique("Android Google Play achievement", androidAchievements.map((achievement) => achievement.id));
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
checkUnique("Ragtime Mouse question", ragtimeMouseQuestions.map((question) => question.id));
checkUnique("Ragtime Mouse objective", ragtimeMouseQuestions.map((question) => question.objectiveId));

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
const ragtimeQuestionWindows = {
  "before-outer-continent": ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "before-outer-continent"),
  "outer-continent": ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "outer-continent"),
  "after-mount-gulug": ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "after-mount-gulug"),
};
const ragtimeMissable = missablesById.get("missable.disc-1.ice-cavern.ragtime-all-correct");
const ragtimeEarlyCutoff = cutoffsById.get("cutoff.ragtime-mouse.first-quiz-window");
const ragtimeFinalCutoff = cutoffsById.get("cutoff.ragtime-mouse.before-final-battle");
const chapterObjectiveIds = (chapterId: string) => walkthroughChapters
  .filter((chapter) => chapter.areaId === chapterId)
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps.flatMap((step) => step.objectiveIds ?? [])));
const ragtimeQuestionIdsByChapter = {
  "disc-1.ice-cavern": chapterObjectiveIds("disc-1.ice-cavern").filter((id) => ragtimeMouseQuestions.some((question) => question.objectiveId === id)),
  "disc-2.outer-continent": chapterObjectiveIds("disc-2.outer-continent").filter((id) => ragtimeMouseQuestions.some((question) => question.objectiveId === id)),
  "disc-3.aerial-exploration": chapterObjectiveIds("disc-3.aerial-exploration").filter((id) => ragtimeMouseQuestions.some((question) => question.objectiveId === id)),
  "disc-4.final-preparations": chapterObjectiveIds("disc-4.final-preparations").filter((id) => ragtimeMouseQuestions.some((question) => question.objectiveId === id)),
};
if (
  ragtimeMouseQuestions.length !== 16 ||
  ragtimeQuestionWindows["before-outer-continent"].length !== 4 ||
  ragtimeQuestionWindows["outer-continent"].length !== 6 ||
  ragtimeQuestionWindows["after-mount-gulug"].length !== 6 ||
  ragtimeQuestionSourceIds.some((sourceId) => !sourceIds.has(sourceId)) ||
  ragtimeMouseQuestions.some((question) => {
    const objective = objectivesById.get(question.objectiveId);
    return !question.statement.trim() || !objective || objective.category !== "side-content" ||
      question.chapterIds.some((chapterId) => !areaIds.has(chapterId) || !chapterObjectiveIds(chapterId).includes(question.objectiveId)) ||
      ragtimeQuestionSourceIds.some((sourceId) => !objective.sourceIds.includes(sourceId));
  }) ||
  ragtimeQuestionIdsByChapter["disc-1.ice-cavern"].length !== 4 ||
  ragtimeQuestionIdsByChapter["disc-2.outer-continent"].length !== 10 ||
  ragtimeQuestionIdsByChapter["disc-3.aerial-exploration"].length !== 16 ||
  ragtimeQuestionIdsByChapter["disc-4.final-preparations"].length !== 16 ||
  !ragtimeMissable ||
  ragtimeMissable.objectiveId !== ragtimeMouseFinalRewardObjectiveId ||
  !ragtimeMissable.classification.includes("permanently-missable") ||
  !["disc-1.ice-cavern", "disc-2.outer-continent", "disc-3.aerial-exploration", "disc-4.final-preparations"].every((chapterId) => ragtimeMissable.warningChapterIds?.includes(chapterId)) ||
  !ragtimeEarlyCutoff?.missableIds.includes(ragtimeMissable.id) ||
  !ragtimeFinalCutoff?.missableIds.includes(ragtimeMissable.id) ||
  !ragtimeEarlyCutoff?.sourceIds.includes("gamerguides-ragtime-blues") ||
  !ragtimeFinalCutoff?.sourceIds.includes("gamefaqs-final-preparations-71891")
) {
  errors.push("Ragtime Mouse must keep its 4/6/6 conservative guide windows, all 16 sourced answer objectives, early/final walkthrough checklists, and the all-correct missable warning linked to both route cutoffs.");
}
const achievementCatalogs = [
  { platform: "steam" as const, records: steamAchievements, expectedCount: achievementSourceCounts.steam.count },
  { platform: "ps4" as const, records: ps4Trophies, expectedCount: achievementSourceCounts.ps4.count },
  { platform: "xbox" as const, records: xboxAchievements, expectedCount: achievementSourceCounts.xbox.count },
  { platform: "ios" as const, records: iosAchievements, expectedCount: achievementSourceCounts.ios.count },
  { platform: "android" as const, records: androidAchievements, expectedCount: achievementSourceCounts.android.count },
];

const cleyraEvacuationWarning = missablesById.get("missable.disc-2.cleyra.out-of-harms-way");
const cleyraEvacuationObjective = objectivesById.get("disc-2.cleyra.out-of-harms-way");
const cleyraStiltzkinWarning = missablesById.get("missable.disc-2.cleyra.stiltzkin-2");
const cleyraEvacuationWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections
  .find((section) => section.id === "cleyra-antlion-evacuation")?.steps
  .find((step) => step.id === "cleyra-evacuation-choices");
const eliteGrindLabStiltzkinSource = sources.find((source) => source.id === "elitegrindlab-stiltzkin-bundles");
const cleyraEvacuationCutoff = cutoffsById.get("cutoff.cleyra-evacuation.choice-window");
const cleyraFreyaCutoff = cutoffsById.get("cutoff.cleyra-freya.before-reunion");
const cleyraTrunkReturnCutoff = cutoffsById.get("cutoff.cleyra-trunk-return.before-bridge");
const alexandriaTownObjectiveId = "disc-1.alexandria.town-collectibles";
const alexandriaTownWarning = missablesById.get("missable.disc-1.alexandria.town-pickups");
const alexandriaTownCutoff = cutoffsById.get("cutoff.alexandria.vivi-town-pickups");
const alexandriaWalkthroughSteps = walkthroughChapters
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));
const alexandriaPickupPathSpecs = [
  ["item-path.disc-1.alexandria.main-street-start-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "gamerguides-alexandria"]],
  ["item-path.disc-1.alexandria.memorial-square-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.north-street-awning-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.sewing-residence-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.north-street-barrel-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "elitegrindlab-prima-vista"]],
  ["item-path.disc-1.alexandria.morning-star-bar-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.steeple-potion", "game-item.potion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.synthesis-shop-ether", "game-item.ether", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.weapons-shop-remedy", "game-item.remedy", ["gamefaqs-alexandria-71891", "elitegrindlab-prima-vista", "rpgclassics-alexandria-town", "xbuster-alexandria"]],
  ["item-path.disc-1.alexandria.wagon-phoenix-pinion", "game-item.phoenix-pinion", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.ilia-house-eye-drops", "game-item.eye-drops", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
  ["item-path.disc-1.alexandria.steeple-tent", "game-item.tent", ["gamefaqs-alexandria-71891", "jegged-alexandria"]],
] as const;
const alexandriaTownObjective = objectivesById.get(alexandriaTownObjectiveId);
if (
  !alexandriaTownObjective ||
  !["gamefaqs-alexandria-71891", "jegged-alexandria", "gamerguides-alexandria", "vgkami-alexandria", "elitegrindlab-prima-vista", "rpgclassics-alexandria-town", "xbuster-alexandria", "kyokugen-alexandria-map"]
    .every((sourceId) => alexandriaTownObjective.sourceIds.includes(sourceId)) ||
  alexandriaTownObjective.chapterIds.length !== 1 || alexandriaTownObjective.chapterIds[0] !== "disc-1.alexandria"
) {
  errors.push("Alexandria's first-visit pickup objective must cite all route/discrepancy sources and stay scoped to Disc I Alexandria.");
}
for (const [pathId, itemId, requiredSourceIds] of alexandriaPickupPathSpecs) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  if (
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.alexandria" ||
    path.method !== "hidden-pickup" || path.availability !== "single-use" || path.quantity !== 1 ||
    !path.walkthroughObjectiveIds.includes(alexandriaTownObjectiveId) ||
    !requiredSourceIds.every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Alexandria pickup path ${pathId} must retain its item, one-time location, shared objective, and source provenance.`);
  }
}
if (
  !alexandriaTownWarning ||
  alexandriaTownWarning.objectiveId !== alexandriaTownObjectiveId ||
  alexandriaTownWarning.severity !== "high" ||
  !alexandriaTownWarning.classification.includes("missable-opportunity") ||
  !alexandriaTownWarning.classification.includes("recoverable-later") ||
  !alexandriaTownWarning.consequence.includes("340 points") ||
  !alexandriaTownWarning.consequence.includes("one Treasure Hunter point") ||
  !alexandriaTownWarning.note.includes("Gamer Guides reports one") ||
  !alexandriaTownWarning.note.includes("63-Gil marker") ||
  !alexandriaTownWarning.note.includes("Kyokugen's Japanese town map") ||
  !alexandriaTownWarning.note.includes("does not prove a perfect town sweep is required") ||
  !alexandriaTownWarning.sourceIds.includes("jegged-treasure-hunter") ||
  !["rpgclassics-alexandria-town", "xbuster-alexandria", "kyokugen-alexandria-map"].every((sourceId) => alexandriaTownWarning.sourceIds.includes(sourceId)) ||
  !alexandriaTownCutoff || alexandriaTownCutoff.edgeId !== "story.alexandria-to-evil-forest" ||
  !alexandriaTownCutoff.missableIds.includes("missable.disc-1.alexandria.town-pickups") ||
  !alexandriaTownCutoff.trigger.includes("planks that fall behind him") ||
  !["rpgclassics-alexandria-town", "xbuster-alexandria", "kyokugen-alexandria-map"].every((sourceId) => alexandriaTownCutoff.sourceIds.includes(sourceId)) ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "town-square-items")?.detail?.includes("GameFAQs places the Remedy near the shop counter") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "town-square-items")?.text.includes("arrow-marked corner") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "north-walkway")?.detail?.includes("Kyokugen's Japanese Main Street 1 item list") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "north-walkway")?.detail?.includes("treat the exact count as disputed") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "house-by-steeple")?.text.includes("chapel-side house") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "rooftop-treasures")?.text.includes("lower rooftop branch") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "rooftop-treasures")?.text.includes("search both candidate spots") ||
  walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.alexandria")?.sections.find((section) => section.id === "alexandria-town")?.summary.includes("not yet audited") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "starting-street-potion")?.text.toLowerCase().includes("before walking south to memorial square") ||
  !alexandriaWalkthroughSteps.find((step) => step.id === "town-pickup-cutoff")?.text.includes("falling rooftop planks")
) {
  errors.push("Alexandria's first-visit pickup warning, Treasure Hunter qualification, route cutoff, and starting-street/checkpoint steps must stay linked and source-scoped.");
}
for (const itemId of ["game-item.potion", "game-item.ether", "game-item.remedy", "game-item.phoenix-pinion", "game-item.eye-drops", "game-item.tent"]) {
  if (!itemAcquisitionPaths.some((path) => path.itemId === itemId && path.chapterId !== "disc-1.alexandria")) {
    errors.push(`Alexandria's ${itemId} pickup warning must distinguish the lost location copy from later item-type recovery.`);
  }
}
if (
  !cleyraEvacuationWarning?.action.includes("Choose Right, then Left, then Right") ||
  !cleyraEvacuationWarning.action.includes("Not Yet as the conservative recommendation") ||
  cleyraEvacuationWarning.classification.includes("version-dependent") ||
  !cleyraEvacuationWarning.note.includes("fourth observatory choice does not dictate the outcome") ||
  !cleyraEvacuationWarning.note.includes("Final Fantasy Wiki's search-indexed text") ||
  !cleyraEvacuationWarning.note.includes("indirect secondary evidence") ||
  !cleyraEvacuationWarning.sourceIds.includes("steam-cleyra-achievement-walkthrough") ||
  !cleyraEvacuationWarning.sourceIds.includes("finalfantasywiki-cleyra-evacuation") ||
  !cleyraEvacuationWarning.sourceIds.includes("jegged-cleyra") ||
  !cleyraEvacuationWarning.sourceIds.includes("gamerguides-cleyra") ||
  !cleyraEvacuationObjective?.sourceIds.includes("finalfantasywiki-cleyra-evacuation") ||
  !cleyraEvacuationCutoff?.trigger.includes("do not present its necessity as confirmed") ||
  !cleyraEvacuationCutoff.trigger.includes("search-indexed text") ||
  !cleyraEvacuationCutoff.sourceIds.includes("steam-cleyra-achievement-walkthrough") ||
  !cleyraEvacuationCutoff.sourceIds.includes("finalfantasywiki-cleyra-evacuation") ||
  !cleyraEvacuationWalkthroughStep?.detail?.includes("indirect evidence only")
) {
  errors.push("Cleyra's evacuation route must preserve Right/Left/Right, identify Not Yet as recommended rather than confirmed, and cite the fourth-choice conflict.");
}
if (
  cleyraFreyaCutoff?.certainty !== "conservative" ||
  !cleyraFreyaCutoff.trigger.includes("Freya's separate control segment") ||
  !cleyraFreyaCutoff.trigger.includes("before returning to the settlement entrance") ||
  !cleyraFreyaCutoff.trigger.includes("check the Sandpit during the later attack return") ||
  !["missable.disc-2.cleyra.emerald", "missable.disc-2.cleyra.stiltzkin-2"].every((missableId) => cleyraFreyaCutoff.missableIds.includes(missableId)) ||
  !["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "elitegrindlab-stiltzkin-bundles", "rpgclassics-cleyra-settlement"].every((sourceId) => cleyraFreyaCutoff.sourceIds.includes(sourceId)) ||
  cleyraTrunkReturnCutoff?.certainty !== "source-supported" ||
  !cleyraTrunkReturnCutoff.trigger.includes("before crossing the bridge") ||
  !cleyraTrunkReturnCutoff.missableIds.includes("missable.disc-2.cleyra.treasures") ||
  !cleyraTrunkReturnCutoff.sourceIds.includes("gamefaqs-cleyra-71891")
) {
  errors.push("Cleyra's route map must separate the conservative Freya-phase Emerald/Stiltzkin checkpoint from the source-supported Trunk-chest return before the bridge.");
}
if (
  cleyraStiltzkinWarning?.verification !== "partial" ||
  !cleyraStiltzkinWarning.note.includes("declared in both the Inn and Sandpit field scripts") ||
  !cleyraStiltzkinWarning.note.includes("recommends checking both") ||
  !["elitegrindlab-cleyra", "elitegrindlab-stiltzkin-bundles", "rpgclassics-cleyra-settlement"].every((sourceId) => cleyraStiltzkinWarning.sourceIds.includes(sourceId)) ||
  !eliteGrindLabStiltzkinSource?.url.includes("/ff9/stiltzkin/")
) {
  errors.push("Cleyra's Stiltzkin warning must preserve the Inn safe point, dual-room script evidence, unresolved active-room state, and dedicated source provenance.");
}

const lindblumTrolleyWarning = missablesById.get("missable.disc-1.lindblum.trolley-cutoff");
const lindblumTrolleyCutoff = cutoffsById.get("cutoff.lindblum-grotto-entry.trolley-lockout");
const lindblumCityAccessCutoff = cutoffsById.get("cutoff.lindblum-grotto-entry.city-access");
const lindblumTrolleyObjective = objectivesById.get("disc-1.exploring-lindblum-kingdom.before-grotto-check");
const lindblumTrolleyRoute = gameRouteEdgesById.get("story.lindblum-to-journey-to-burmecia");
const lindblumTrolleySection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
  ?.sections.find((section) => section.id === "journey-north-to-grotto");
const lindblumTrolleyStep = walkthroughChapters
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .find((step) => step.id === "journey-before-enter-grotto-lindblum-cutoff");
if (
  !lindblumTrolleyWarning?.deadline.includes("Complete remaining Lindblum city visits before entering") ||
  !lindblumTrolleyWarning.deadline.includes("GameRevolution and EliteGrindLab explicitly place the trolley closure there") ||
  !lindblumTrolleyWarning.note?.includes("GameRevolution and EliteGrindLab explicitly place trolley closure there") ||
  !lindblumTrolleyWarning.note.includes("it does not say the trolley continues to run before completion") ||
  !["gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "gamerevolution-ffix-walkthrough", "elitegrindlab-gizamaluke", "vgr-no-spoiler-walkthrough"].every((sourceId) => lindblumTrolleyWarning.sourceIds.includes(sourceId)) ||
  !lindblumTrolleyObjective?.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !lindblumTrolleyRoute?.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !lindblumTrolleySection?.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  lindblumCityAccessCutoff?.certainty !== "source-supported" ||
  !lindblumCityAccessCutoff.missableIds.includes("missable.disc-1.lindblum.trolley-cutoff") ||
  !["gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "gamerevolution-ffix-walkthrough", "elitegrindlab-gizamaluke", "vgr-no-spoiler-walkthrough"].every((sourceId) => lindblumCityAccessCutoff.sourceIds.includes(sourceId)) ||
  !lindblumCityAccessCutoff.trigger.includes("Finish all remaining Lindblum castle and district visits before entering") ||
  lindblumTrolleyCutoff?.certainty !== "source-supported" ||
  !lindblumTrolleyCutoff.missableIds.includes("missable.disc-1.lindblum.trolley-cutoff") ||
  !["gamerevolution-ffix-walkthrough", "elitegrindlab-gizamaluke"].every((sourceId) => lindblumTrolleyCutoff.sourceIds.includes(sourceId)) ||
  !lindblumTrolleyCutoff.trigger.includes("The city/district closure at Grotto entry is recorded in the separate city-access cutoff") ||
  !lindblumTrolleyCutoff.trigger.includes("GameRevolution and EliteGrindLab explicitly say that entering Gizamaluke's Grotto closes the trolley") ||
  !lindblumTrolleyCutoff.trigger.includes("does not state that trolley service continues before completion") ||
  !lindblumTrolleyStep?.detail.includes("explicitly place trolley closure at entry")
) {
  errors.push("Lindblum's route must source the city and trolley closures at Grotto entry while distinguishing Dragon's Gate access.");
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
const lindblumJavelinAcquisitionPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.javelin-shop");
const lindblumJavelinWalkthroughSection = walkthroughChapters
  .flatMap((chapter) => chapter.sections)
  .find((section) => section.id === "lindblum-after-festival-shops");
const lindblumJavelinWalkthroughStep = lindblumJavelinWalkthroughSection?.steps.find((step) => step.id === "lindblum-shop-synthesis-javelin");
if (
  lindblumJavelinWarning?.verification !== "partial" ||
  !lindblumJavelinWarning.deadline.includes("before entering Gizamaluke's Grotto") ||
  !lindblumJavelinWarning.note?.includes("the exact last reachable sale moment remains unresolved") ||
  !lindblumJavelinWarning.note.includes("city access closes at entry") ||
  !lindblumJavelinWarning.note.includes("does not establish whether that gate window includes a trolley trip back into town") ||
  !lindblumJavelinWarning.note.includes("Disc II Lindblum weapon stock omits Javelin") ||
  !lindblumJavelinWarning.recovery.includes("Freya's starting Javelin") ||
  !lindblumJavelinWarning.recovery.includes("Ipsen's Castle copy") ||
  lindblumDepartureCutoff?.missableIds.length !== 1 ||
  !lindblumDepartureCutoff?.missableIds.includes("missable.disc-1.lindblum.javelin-shop") ||
  !lindblumDepartureCutoff.trigger.includes("before entering Gizamaluke's Grotto") ||
  lindblumAteCutoff?.missableIds.includes("missable.disc-1.lindblum.javelin-shop") ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-optional-route-47344", "gamerguides-gizamaluke", "elitegrindlab-gizamaluke"].every((sourceId) => lindblumJavelinObjective?.sourceIds.includes(sourceId)) ||
  !lindblumJavelinWalkthroughStep?.text.includes("Before entering Gizamaluke's Grotto") ||
  lindblumJavelinAcquisitionPath?.itemId !== "game-item.javelin" ||
  lindblumJavelinAcquisitionPath.chapterId !== "disc-1.lindblum" ||
  lindblumJavelinAcquisitionPath.method !== "shop" ||
  lindblumJavelinAcquisitionPath.availability !== "limited-window" ||
  lindblumJavelinAcquisitionPath.shopId !== "lindblum.weapon-shop.pre-cleyra" ||
  lindblumJavelinAcquisitionPath.cost?.amount !== 880 ||
  !lindblumJavelinAcquisitionPath.walkthroughObjectiveIds?.includes("disc-1.lindblum.pre-cleyra-stock") ||
  !lindblumJavelinAcquisitionPath.walkthroughObjectiveIds?.includes("disc-1.lindblum.javelin-purchase") ||
  !["gamefaqs-items-71891", "gamefaqs-shops-71891"].every((sourceId) => lindblumJavelinAcquisitionPath.sourceIds.includes(sourceId)) ||
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
  if (enemy.preparationGuidance) {
    const guidance = enemy.preparationGuidance;
    if (guidance.confidence !== "partial" && guidance.confidence !== "disputed") {
      errors.push(`Enemy ${enemy.id} has unsupported preparation confidence ${guidance.confidence}.`);
    }
    if (!guidance.levelRationale.trim() || !guidance.optionalGrinding.trim() || !guidance.setupAdvice.trim()) {
      errors.push(`Enemy ${enemy.id} has incomplete preparation guidance.`);
    }
    const levelRange = guidance.suggestedLevelRange;
    if (levelRange && (!Number.isInteger(levelRange.min) || !Number.isInteger(levelRange.max) || levelRange.min < 1 || levelRange.max < levelRange.min)) {
      errors.push(`Enemy ${enemy.id} has an invalid optional level range.`);
    }
    if (guidance.sourceIds.length === 0) errors.push(`Enemy ${enemy.id} preparation guidance has no source provenance.`);
    for (const sourceId of guidance.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Enemy ${enemy.id} preparation guidance references unknown source ${sourceId}.`);
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
const daliDaggerTriesHarderEvent = activeTimeEvents.find((event) => event.objectiveId === "ate.dali-dagger-tries-harder");
const daliAteWarning = missables.find((missable) => missable.id === "missable.disc-1.village-of-dali.ates");
const daliAteRouteStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.village-of-dali")
  ?.sections.find((section) => section.id === "village-road-and-windmill")?.steps.find((step) => step.id === "dali-town-ate-followup");
const trueAchievementsDaliAteSource = sources.find((source) => source.id === "trueachievements-dali-ate-walkthrough");
if (
  !daliDaggerTriesHarderEvent?.trigger.includes("returning from the eastern field") ||
  !daliDaggerTriesHarderEvent.trigger.includes("Exact trigger timing remains unverified") ||
  !daliDaggerTriesHarderEvent.sourceIds.includes("trueachievements-dali-ate-walkthrough") ||
  !daliAteWarning?.note?.includes("trigger timing differs by route") ||
  !daliAteWarning.note.includes("returned HTTP 402") ||
  !daliAteWarning.action.includes("return to the inn to check for Dagger Tries Harder") ||
  !daliAteRouteStep?.detail?.includes("indirect evidence") ||
  !trueAchievementsDaliAteSource?.notes.includes("Direct page access returned HTTP 402")
) {
  errors.push("Dali's Dagger Tries Harder route must preserve the alternate source timing, conservative checks, and the indexed-source access limit.");
}
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
const disc2DaliReturnEdge = gameRouteEdgesById.get("detour.journey-to-treno-dali-return");
const disc2DaliRejoinEdge = gameRouteEdgesById.get("detour.journey-to-treno-dali-rejoin");
if (
  disc2DaliReturnEdge?.relationship !== "optional-return"
  || disc2DaliReturnEdge.fromChapterId !== "disc-2.journey-to-treno"
  || disc2DaliReturnEdge.toChapterId !== "disc-1.village-of-dali"
  || !["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "flactem-disc-2-south-gate-treno"].every((sourceId) => disc2DaliReturnEdge.sourceIds.includes(sourceId))
  || disc2DaliReturnEdge.sourceIds.includes("gamefaqs-dali-71891")
  || disc2DaliRejoinEdge?.relationship !== "rejoin"
  || disc2DaliRejoinEdge.fromChapterId !== "disc-1.village-of-dali"
  || disc2DaliRejoinEdge.toChapterId !== "disc-2.journey-to-treno"
  || !["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "flactem-disc-2-south-gate-treno"].every((sourceId) => disc2DaliRejoinEdge.sourceIds.includes(sourceId))
  || disc2DaliRejoinEdge.sourceIds.includes("gamefaqs-dali-71891")
) {
  errors.push("The optional Disc II Dali return and rejoin must cite its Disc II route sources, not the first-visit Dali walkthrough.");
}
const pinnacleRocksReturnEdge = gameRouteEdgesById.get("detour.return-to-lindblum-pinnacle-rocks-return");
const pinnacleRocksStoryRejoin = gameRouteEdgesById.get("story.pinnacle-rocks-to-return-to-lindblum");
if (
  pinnacleRocksReturnEdge?.relationship !== "optional-return"
  || pinnacleRocksReturnEdge.fromChapterId !== "disc-2.return-to-lindblum"
  || pinnacleRocksReturnEdge.toChapterId !== "disc-2.pinnacle-rocks"
  || !["gamefaqs-return-to-lindblum-71891", "gamefaqs-pinnacle-rocks-71891"].every((sourceId) => pinnacleRocksReturnEdge.sourceIds.includes(sourceId))
  || pinnacleRocksReturnEdge.sourceIds.includes("jegged-return-to-lindblum")
  || pinnacleRocksReturnEdge.sourceIds.includes("jegged-pinnacle-rocks")
  || !pinnacleRocksReturnEdge.summary.includes("entrance-side Elixir and Phoenix Down")
  || !pinnacleRocksReturnEdge.summary.includes("three interior Disc II chests")
  || pinnacleRocksStoryRejoin?.relationship !== "required-story"
  || pinnacleRocksStoryRejoin.fromChapterId !== "disc-2.pinnacle-rocks"
  || pinnacleRocksStoryRejoin.toChapterId !== "disc-2.return-to-lindblum"
  || !["gamefaqs-pinnacle-rocks-71891", "jegged-pinnacle-rocks", "jegged-return-to-lindblum"].every((sourceId) => pinnacleRocksStoryRejoin.sourceIds.includes(sourceId))
) {
  errors.push("The optional Disc II Pinnacle Rocks return must use the GameFAQs re-entry evidence, while Jegged remains scoped to the original route and its required Lindblum rejoin.");
}
const disc2KupoNutReturnEdge = gameRouteEdgesById.get("detour.journey-to-outer-continent-kupo-nut-return");
const disc2KupoNutRejoinEdge = gameRouteEdgesById.get("detour.journey-to-outer-continent-kupo-nut-rejoin");
const disc2OuterContinentSourceNotes = sources.find((source) => source.id === "gamefaqs-journey-to-outer-continent-71891")?.notes;
const gamefaqsDisc1BurmeciaSourceNotes = sources.find((source) => source.id === "gamefaqs-journey-to-burmecia-71891")?.notes;
const jeggedDisc1GrottoSourceNotes = sources.find((source) => source.id === "jegged-gizamaluke")?.notes;
const jeggedDisc2LindblumSourceNotes = sources.find((source) => source.id === "jegged-return-to-lindblum")?.notes;
const jeggedKupoNutSourceNotes = sources.find((source) => source.id === "jegged-kupo-nuts")?.notes;
if (
  disc2KupoNutReturnEdge?.relationship !== "optional-return"
  || disc2KupoNutReturnEdge.fromChapterId !== "disc-2.journey-to-outer-continent"
  || disc2KupoNutReturnEdge.toChapterId !== "disc-1.journey-to-burmecia"
  || !["gamefaqs-journey-to-outer-continent-71891", "jegged-return-to-lindblum", "jegged-kupo-nuts"].every((sourceId) => disc2KupoNutReturnEdge.sourceIds.includes(sourceId))
  || disc2KupoNutReturnEdge.sourceIds.includes("gamefaqs-journey-to-burmecia-71891")
  || disc2KupoNutReturnEdge.sourceIds.includes("jegged-gizamaluke")
  || !disc2KupoNutReturnEdge.summary.includes("Disc II Kupo Nut")
  || disc2KupoNutRejoinEdge?.relationship !== "rejoin"
  || disc2KupoNutRejoinEdge.fromChapterId !== "disc-1.journey-to-burmecia"
  || disc2KupoNutRejoinEdge.toChapterId !== "disc-2.journey-to-outer-continent"
  || disc2KupoNutRejoinEdge.sourceIds.length !== 1
  || !disc2KupoNutRejoinEdge.sourceIds.includes("gamefaqs-journey-to-outer-continent-71891")
  || !disc2KupoNutRejoinEdge.summary.includes("Dragon's Gate, which remains open")
  || !disc2OuterContinentSourceNotes?.includes("Disc II Moguta delivery for an Elixir")
  || !disc2OuterContinentSourceNotes.includes("back to Dragon's Gate, which remains open")
  || !gamefaqsDisc1BurmeciaSourceNotes?.includes("Disc I first-visit")
  || !gamefaqsDisc1BurmeciaSourceNotes.includes("does not document the later Disc II Moguta delivery")
  || !jeggedDisc1GrottoSourceNotes?.includes("Disc I first-visit")
  || !jeggedDisc1GrottoSourceNotes.includes("does not document the later Disc II Moguta delivery")
  || !jeggedDisc2LindblumSourceNotes?.includes("does not describe returning from the delivery to Dragon's Gate")
  || !jeggedKupoNutSourceNotes?.includes("does not describe returning from the Grotto to Dragon's Gate")
) {
  errors.push("The Disc II Kupo Nut detour must keep reward and optional-visit sources on the detour while the direct GameFAQs Dragon's Gate route alone supports its rejoin.");
}
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
  || !tournamentDaliReturnEdge?.sourceIds.includes("jegged-returning-treno-disc-3")
  || !tournamentDaliReturnEdge.summary.includes("Jegged independently documents the direct Dali visit")
  || !tournamentDaliReturnEdge.summary.includes("does not cover the alternate Quan's Dwelling branch")
  || !tournamentDaliReturnEdge.summary.includes("or independently establish the full Treno ATE order")
  || !tournamentDaliReturnEdge.sourceIds.includes("gamefaqs-card-tournament-71891")
  || !tournamentDaliReturnEdge.sourceIds.includes("jegged-returning-treno-disc-3")
  || tournamentDaliReturnEdge.sourceIds.includes("gamefaqs-dali-71891")
  || tournamentDaliReturnEdge.sourceIds.includes("jegged-dali")
  || !tournamentDaliReturnEdge?.summary.includes("retrieve him there first")
  || !tournamentDaliReturnEdge.summary.includes("western South Gate route")
  || !gameRouteEdgesById.get("detour.card-tournament-dali-rejoin")?.sourceIds.includes("jegged-returning-treno-disc-3")
  || gameRouteEdgesById.get("detour.card-tournament-dali-rejoin")?.sourceIds.includes("gamefaqs-dali-71891")
  || gameRouteEdgesById.get("detour.card-tournament-dali-rejoin")?.sourceIds.includes("jegged-dali")
  || !gameRouteEdgesById.get("detour.card-tournament-dali-rejoin")?.summary.includes("continues to tournament registration")
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
  if (!fourShrinesPartySequence.phases[0]?.summary.includes("GamerSky and a Traditional Chinese route both say the four shrine stops must be visited in the Water → Fire → Wind → Earth order") ||
    !fourShrinesPartySequence.phases[0].summary.includes("Direct game and release verification remain open")) {
    errors.push("The Four Shrines party sequence must record the source-supported mandatory order and its unverified gameplay status.");
  }
  const shrineRouteSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.breaking-the-seal")?.sections.find((section) => section.id === "breaking-seal-world-map-dropoffs");
  const fourShrinesObjective = objectives.find((objective) => objective.id === "disc-3.breaking-the-seal.four-shrines");
  if (!shrineRouteSection?.summary.includes("Visit Water → Fire → Wind → Earth in that order") ||
    !shrineRouteSection.summary.includes("GamerSky and a Traditional Chinese route explicitly say the four stops must be entered in order") ||
    !shrineRouteSection.summary.includes("does not establish that another order works") ||
    !shrineRouteSection.summary.includes("Direct game and release verification remain open")) {
    errors.push("The Four Shrines walkthrough must follow the source-supported ordered route and preserve its unverified gameplay status.");
  }
  if (!fourShrinesPartySequence.phases[3]?.location.includes("Hilda Garde 3")) {
    errors.push("The Four Shrines sequence must end with the party regroup on the Hilda Garde 3.");
  }
  const requiredFourShrinesRouteSourceIds = [
    "gamefaqs-breaking-the-seal-71891",
    "gamefaqs-four-shrines-gbness-26505",
    "gamefaqs-unlocking-terra-79143",
    "gamersky-four-shrines",
    "neocities-vv0817-four-shrines",
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
    !fourShrinesSourceNotes.get("gamersky-four-shrines")?.includes("must be entered in order") ||
    !fourShrinesSourceNotes.get("gamersky-four-shrines")?.includes("Water → Fire → Wind → Earth as the correct order") ||
    !fourShrinesSourceNotes.get("neocities-vv0817-four-shrines")?.includes("must visit the shrines in Water → Fire → Wind → Earth order") ||
    !fourShrinesSourceNotes.get("gamedog-four-shrines-order")?.includes("does not demonstrate or explicitly confirm that another order works") ||
    !fourShrinesSourceNotes.get("gamefaqs-four-shrines-gbness-26505")?.includes("explicitly lists the Water, Fire, Wind, and Earth shrines in that order") ||
    !fourShrinesSourceNotes.get("gamefaqs-unlocking-terra-79143")?.includes("sends Dagger/Eiko to Water, Freya/Amarant to Fire, Vivi/Steiner to Wind, and Zidane/Quina to Earth") ||
    !fourShrinesSourceNotes.get("rpgclassics-four-shrines")?.includes("Water first, Fire next, Wind third, and Earth last")
  ) {
    errors.push("The expanded Four Shrines route cross-check must preserve the mandatory-order source, explicit sequence, and fixed-pair evidence.");
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
const memoriaEarlyReturn = gameRouteEdgesById.get("detour.memoria-early-return-to-gaia");
if (
  memoriaEarlyReturn?.relationship !== "optional-return" ||
  !memoriaEarlyReturn.summary.includes("GameFAQs specifically says Zidane must be outside") ||
  !memoriaEarlyReturn.sourceIds.includes("gamefaqs-memoria-71891") ||
  !memoriaEarlyReturn.sourceIds.includes("rpgclassics-memoria") ||
  !memoriaEarlyReturn.sourceIds.includes("gamerguides-memoria-1-maliris")
) {
  errors.push("The early Memoria exit must preserve GameFAQs' party condition and its independent entrance-return cross-checks.");
}
const aerialTrenoRejoin = gameRouteEdgesById.get("detour.aerial-treno-rejoin");
const gamefaqsDisc2TrenoSourceNotes = sources.find((source) => source.id === "gamefaqs-treno-71891")?.notes;
const gamefaqsAerialExplorationSourceNotes = sources.find((source) => source.id === "gamefaqs-aerial-exploration-71891")?.notes;
const jeggedHildaGardeSourceNotes = sources.find((source) => source.id === "jegged-lindblum-hilda-garde")?.notes;
if (
  aerialTrenoReturn?.relationship !== "optional-return" ||
  aerialTrenoReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialTrenoReturn.toChapterId !== "disc-2.treno" ||
  !aerialTrenoReturn.summary.includes("Amdusias") ||
  !aerialTrenoReturn.summary.includes("Running Shoes") ||
  !aerialTrenoReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialTrenoReturn.sourceIds.includes("jegged-lindblum-hilda-garde") ||
  aerialTrenoReturn.sourceIds.includes("gamefaqs-treno-71891") ||
  aerialTrenoRejoin?.relationship !== "rejoin" ||
  aerialTrenoRejoin.fromChapterId !== "disc-2.treno" ||
  aerialTrenoRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialTrenoRejoin.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialTrenoRejoin.sourceIds.includes("jegged-lindblum-hilda-garde") ||
  !gamefaqsDisc2TrenoSourceNotes?.includes("Disc II first-visit") ||
  !gamefaqsDisc2TrenoSourceNotes.includes("does not document the later Hilda Garde III free-flight return to Treno") ||
  !gamefaqsAerialExplorationSourceNotes?.includes("Treno Weapon Shop Amdusias fight and Queen Stella's available Stellazzio returns") ||
  !jeggedHildaGardeSourceNotes?.includes("Knight's House Amdusias fight and its Running Shoes reward")
) {
  errors.push("The Disc III Hilda Garde Treno return and rejoin must cite its Disc III routes and exclude the first-visit Disc II Treno walkthrough.");
}
const aerialDaliReturn = gameRouteEdgesById.get("detour.aerial-dali-cotton-robe");
const aerialDaliRejoin = gameRouteEdgesById.get("detour.aerial-dali-rejoin");
const jeggedDisc3TrenoSource = sources.find((source) => source.id === "jegged-returning-treno-disc-3");
const jeggedCottonRobeSource = sources.find((source) => source.id === "jegged-cotton-robe-trick");
if (
  aerialDaliReturn?.relationship !== "optional-return" ||
  aerialDaliReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialDaliReturn.toChapterId !== "disc-1.village-of-dali" ||
  !aerialDaliReturn.summary.includes("Cotton Robe") ||
  !aerialDaliReturn.summary.includes("Wrists") ||
  !aerialDaliReturn.summary.includes("GameFAQs directly places this Dali trip in the free-flight window") ||
  !aerialDaliReturn.summary.includes("separate earlier Disc III Dali shop stop") ||
  !aerialDaliReturn.summary.includes("neither page independently confirms this later Hilda Garde return") ||
  !aerialDaliReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialDaliReturn.sourceIds.includes("jegged-returning-treno-disc-3") ||
  !aerialDaliReturn.sourceIds.includes("jegged-cotton-robe-trick") ||
  aerialDaliReturn.sourceIds.includes("gamefaqs-dali-71891") ||
  !jeggedDisc3TrenoSource?.url.endsWith("/Disc-3/27-Treno.html") ||
  !jeggedDisc3TrenoSource.notes.includes("earlier Disc III Dali stop") ||
  !jeggedCottonRobeSource?.url.endsWith("/Cotton-Robe-Trick.html") ||
  !jeggedCottonRobeSource.notes.includes("does not identify the later Hilda Garde III free-flight Dali return") ||
  aerialDaliRejoin?.relationship !== "rejoin" ||
  aerialDaliRejoin.fromChapterId !== "disc-1.village-of-dali" ||
  aerialDaliRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialDaliRejoin.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  aerialDaliRejoin.sourceIds.includes("gamefaqs-dali-71891") ||
  !aerialDaliRejoin.summary.includes("GameFAQs' aerial route is the source for this free-flight return")
) {
  errors.push("The Disc III Hilda Garde Dali return and rejoin must preserve the optional Cotton Robe route and source links.");
}
const aerialAtlaReturn = gameRouteEdgesById.get("detour.aerial-atla-mogshop");
const aerialAtlaRejoin = gameRouteEdgesById.get("detour.aerial-atla-mogshop-rejoin");
if (
  aerialAtlaReturn?.relationship !== "optional-return" ||
  aerialAtlaReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialAtlaReturn.toChapterId !== "disc-1.burmecia" ||
  !aerialAtlaReturn.summary.includes("Atla's Mogshop") ||
  !aerialAtlaReturn.summary.includes("Steepled Hat, not Headgear") ||
  !aerialAtlaReturn.summary.includes("330 Gil") ||
  !aerialAtlaReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialAtlaReturn.sourceIds.includes("gamefaqs-equipment-33383") ||
  !aerialAtlaReturn.sourceIds.includes("ff9-irodori-items-armor") ||
  aerialAtlaRejoin?.relationship !== "rejoin" ||
  aerialAtlaRejoin.fromChapterId !== "disc-1.burmecia" ||
  aerialAtlaRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialAtlaRejoin.sourceIds.includes("gamefaqs-aerial-exploration-71891")
) {
  errors.push("The Disc III Atla Mogshop return and rejoin must preserve the optional Cotton Robe route, Headgear price, and scoped sources.");
}
const aerialBlackMageVillageReturn = gameRouteEdgesById.get("detour.aerial-black-mage-village-shops");
const aerialBlackMageVillageRejoin = gameRouteEdgesById.get("detour.aerial-black-mage-village-rejoin");
const gamefaqsDisc2MagdaleneSourceNotes = sources.find((source) => source.id === "gamefaqs-magdalene-forest-71891")?.notes;
if (
  aerialBlackMageVillageReturn?.relationship !== "optional-return" ||
  aerialBlackMageVillageReturn.fromChapterId !== "disc-3.aerial-exploration" ||
  aerialBlackMageVillageReturn.toChapterId !== "disc-2.magdalene-forest" ||
  !aerialBlackMageVillageReturn.summary.includes("Disc II shop stock") ||
  !aerialBlackMageVillageReturn.summary.includes("for a while") ||
  !aerialBlackMageVillageReturn.summary.includes("Disc II village walkthrough supplies first-visit stock details, not evidence for this later return") ||
  !aerialBlackMageVillageReturn.summary.includes("Flactem independently confirms a Disc III return") ||
  !aerialBlackMageVillageReturn.summary.includes("earlier Blue Narciss phase") ||
  !aerialBlackMageVillageReturn.summary.includes("does not reopen the forest route") ||
  !aerialBlackMageVillageReturn.summary.includes("first-visit ATEs") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-magdalene-forest-71891") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("gamefaqs-shops-71891") ||
  !aerialBlackMageVillageReturn.sourceIds.includes("flactem-disc-3-lindblum") ||
  !gamefaqsDisc2MagdaleneSourceNotes?.includes("does not document the later Disc III Hilda Garde return") ||
  !gamefaqsDisc2MagdaleneSourceNotes.includes("or establish that Disc II shop stock remains available then") ||
  aerialBlackMageVillageRejoin?.relationship !== "rejoin" ||
  aerialBlackMageVillageRejoin.fromChapterId !== "disc-2.magdalene-forest" ||
  aerialBlackMageVillageRejoin.toChapterId !== "disc-3.aerial-exploration" ||
  !aerialBlackMageVillageRejoin.sourceIds.includes("jegged-lindblum-hilda-garde")
) {
  errors.push("The Disc III Hilda Garde Black Mage Village shop return and rejoin must preserve GameFAQs' direct timing evidence, Flactem's earlier Blue Narciss scope, the Disc II stock window, and source links.");
}
const cleyraFrogReturn = gameRouteEdgesById.get("detour.journey-to-cleyra-lindblum-basin-frogs");
const cleyraFrogRejoin = gameRouteEdgesById.get("detour.journey-to-cleyra-lindblum-basin-rejoin");
if (
  cleyraFrogReturn?.relationship !== "optional-return" ||
  cleyraFrogReturn.fromChapterId !== "disc-2.journey-to-cleyra" ||
  cleyraFrogReturn.toChapterId !== "disc-1.exploring-lindblum-kingdom" ||
  !cleyraFrogReturn.summary.includes("third Frog Catching visit") ||
  !cleyraFrogReturn.summary.includes("Jegged independently confirms") ||
  !cleyraFrogReturn.summary.includes("does not number the visit") ||
  !["gamefaqs-journey-to-cleyra-71891", "gamefaqs-frog-catching-71891", "gamefaqs-exploring-lindblum-71891", "jegged-gargan-roo"].every((sourceId) => cleyraFrogReturn.sourceIds.includes(sourceId)) ||
  !sources.find((source) => source.id === "gamefaqs-exploring-lindblum-71891")?.notes.includes("does not document the Disc II return/rejoin from Qu's Marsh before Cleyra") ||
  cleyraFrogRejoin?.relationship !== "rejoin" ||
  cleyraFrogRejoin.fromChapterId !== "disc-1.exploring-lindblum-kingdom" ||
  cleyraFrogRejoin.toChapterId !== "disc-2.journey-to-cleyra" ||
  !cleyraFrogRejoin.sourceIds.includes("gamefaqs-journey-to-cleyra-71891") ||
  !cleyraFrogRejoin.sourceIds.includes("jegged-gargan-roo") ||
  cleyraFrogRejoin.sourceIds.includes("gamefaqs-frog-catching-71891") ||
  cleyraFrogRejoin.sourceIds.includes("gamefaqs-exploring-lindblum-71891")
) {
  errors.push("The pre-Cleyra return must retain the Disc I-area and frog-strategy sources on the detour, then cite only Disc II travel sources for the route rejoin.");
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
const optionalRouteBranches = gameRouteEdges.filter((edge) => edge.relationship === "optional-detour" || edge.relationship === "optional-return");
let optionalRouteBranchesWithRejoin = 0;
for (const branch of optionalRouteBranches) {
  const requiredStoryRejoinChapters = new Set([branch.fromChapterId]);
  const pendingStoryChapters = [branch.fromChapterId];
  while (pendingStoryChapters.length > 0) {
    const chapterId = pendingStoryChapters.shift();
    if (!chapterId) continue;
    for (const edge of gameRouteEdges) {
      if (edge.relationship === "required-story" && edge.fromChapterId === chapterId && !requiredStoryRejoinChapters.has(edge.toChapterId)) {
        requiredStoryRejoinChapters.add(edge.toChapterId);
        pendingStoryChapters.push(edge.toChapterId);
      }
    }
  }
  const reachedChapters = new Set<string>();
  const pendingBranchChapters = [branch.toChapterId];
  let rejoinsRequiredRoute = false;
  while (pendingBranchChapters.length > 0) {
    const chapterId = pendingBranchChapters.shift();
    if (!chapterId || reachedChapters.has(chapterId)) continue;
    if (requiredStoryRejoinChapters.has(chapterId)) {
      rejoinsRequiredRoute = true;
      break;
    }
    reachedChapters.add(chapterId);
    for (const edge of gameRouteEdges) {
      if (edge.id !== branch.id && edge.fromChapterId === chapterId && !reachedChapters.has(edge.toChapterId)) {
        pendingBranchChapters.push(edge.toChapterId);
      }
    }
  }
  if (!rejoinsRequiredRoute) {
    errors.push(`Optional route ${branch.id} has no directed path back to its launch chapter or forward into its required-story path.`);
  } else {
    optionalRouteBranchesWithRejoin += 1;
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
const chocoboBeachUnlockObjective = objectivesById.get(chocoboBeachUnlockObjectiveId);
const chocoboBeachCompletionObjective = objectivesById.get(chocoboBeachCompletionObjectiveId);
for (const dependency of chocoboBeachUnlockEdges) {
  for (const sourceId of ["gamefaqs-chocobo-hot-cold-71891", "jegged-chocobo-beaches", "jegged-chocobo-dive-spots", "jegged-chocobo-mountain-cracks", "jegged-chocographs", "gameclue-chocobo-beaches"]) {
    if (!dependency.sourceIds.includes(sourceId)) errors.push(`Chocobo Beach unlock dependency ${dependency.prerequisiteObjectiveId} must cite ${sourceId}.`);
  }
}
if (!chocoboBeachUnlockObjective?.sourceIds.includes("gameclue-chocobo-beaches") ||
  !chocoboBeachCompletionObjective?.sourceIds.includes("gameclue-chocobo-beaches")) {
  errors.push("The Chocobo Beach activation and completion objectives must retain the independent GameClue cross-check.");
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
  { id: "item-path.disc-2.journey-to-outer-continent.lani-ether-steal", itemId: "game-item.ether", slot: "common" },
  { id: "item-path.disc-2.journey-to-outer-continent.lani-gladius-steal", itemId: "game-item.gladius", slot: "uncommon" },
  { id: "item-path.disc-2.journey-to-outer-continent.lani-coral-sword-steal", itemId: "game-item.coral-sword", slot: "semi-rare" },
];
const laniRecord = enemyRecords.find((enemy) => enemy.id === "enemy.lani");
const laniEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.fossil-roo.lani");
const laniWarningRecord = missables.find((record) => record.id === "missable.disc-2.journey-to-outer-continent.lani-steals");
const laniCutoffRecord = cutoffsById.get("cutoff.fossil-roo.lani-steals");
if (!laniRecord || laniRecord.kind !== "boss" || laniRecord.chapterId !== "disc-2.journey-to-outer-continent" ||
  !laniRecord.stats.some((stat) => stat.field === "HP" && stat.value === 5709 && stat.verification === "disputed") ||
  !laniRecord.stats.some((stat) => stat.field === "HP" && stat.value === 5708 && stat.verification === "disputed") ||
  !laniEncounter || laniEncounter.kind !== "boss" || !laniEncounter.missableIds.includes("missable.disc-2.journey-to-outer-continent.lani-steals") ||
  !laniEncounter.cutoffIds.includes("cutoff.fossil-roo.lani-steals") ||
  !laniWarningRecord || !laniCutoffRecord) {
  errors.push("Lani must have a separate one-time Fossil Roo boss encounter with her published HP disagreement and existing warning/cutoff.");
}
const laniPreparation = laniRecord?.preparationGuidance;
const laniPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.journey-to-outer-continent")
  ?.sections.find((section) => section.id === "fossil-roo-entrance-and-lani");
const laniPreparationStepIndex = laniPreparationSection?.steps.findIndex((step) => step.id === "fossil-roo-prepare") ?? -1;
const laniCombatStepIndex = laniPreparationSection?.steps.findIndex((step) => step.id === "fossil-roo-lani-steals") ?? -1;
const laniCombatStep = laniPreparationSection?.steps.find((step) => step.id === "fossil-roo-lani-steals");
if (!laniRecord || laniRecord.stats.find((stat) => stat.field === "level")?.value !== 19 ||
  !laniPreparation || laniPreparation.suggestedLevelRange !== undefined ||
  !laniPreparation.levelRationale.includes("enemy stat") || !laniPreparation.levelRationale.includes("no standard party-level target") ||
  !laniPreparation.difficultyAssessment?.includes("subjective and differ") ||
  !laniPreparation.optionalGrinding.includes("Excalibur II timer plan") ||
  !laniPreparation.setupAdvice.includes("Dagger's HP") || !laniPreparation.setupAdvice.includes("White Wind") ||
  !laniPreparation.setupAdvice.includes("Magic Hammer") ||
  !laniPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !laniCombatStep?.detail?.includes("Medium") || !laniCombatStep?.detail?.includes("tough") ||
  laniPreparationStepIndex < 0 || laniCombatStepIndex <= laniPreparationStepIndex) {
  errors.push("Lani preparation must distinguish her Level 19 stat from party level, preserve conflicting subjective ratings and the Excalibur II budget, and precede the one-time encounter.");
}
for (const expected of expectedLaniStealPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id && entry.itemId === expected.itemId);
  const slot = laniRecord?.steals.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  if (!path || path.method !== "steal" || path.enemyId !== "enemy.lani" || path.enemyLootSlot !== expected.slot ||
    path.encounterIds?.length !== 1 || path.encounterIds[0] !== "encounter.fossil-roo.lani" ||
    !path.walkthroughObjectiveIds?.includes(laniStealObjectiveId) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
    !slot || [...new Set([...(laniRecord?.sourceIds ?? []), ...(laniEncounter?.sourceIds ?? []), ...slot.sourceIds])]
      .some((sourceId) => !path.sourceIds.includes(sourceId))) {
    errors.push(`Lani's one-time-steal checklist must link ${expected.itemId} to its exact ${expected.slot} slot, encounter, and sources.`);
  }
}
const arkRecord = enemyRecords.find((enemy) => enemy.id === "enemy.ark");
const arkEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.oeilvert.ark");
const arkLootExpectations = [
  { id: "item-path.disc-3.forgotten-continent.ark-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveId: "disc-3.forgotten-continent.ark-steals" },
  { id: "item-path.disc-3.forgotten-continent.ark-power-vest-steal", itemId: "game-item.power-vest", method: "steal", slot: "uncommon", objectiveId: "disc-3.forgotten-continent.ark-steals" },
  { id: "item-path.disc-3.forgotten-continent.ark-holy-lance-steal", itemId: "game-item.holy-lance", method: "steal", slot: "semi-rare", objectiveId: "disc-3.forgotten-continent.ark-steals" },
  { id: "item-path.disc-3.forgotten-continent.ark-ether-common-drop", itemId: "game-item.ether", method: "drop", slot: "common", rate: "96/256 (37.5%)" },
  { id: "item-path.disc-3.forgotten-continent.ark-ether-uncommon-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "32/256 (12.5%)" },
  { id: "item-path.disc-3.forgotten-continent.ark-ether-rare-drop", itemId: "game-item.ether", method: "drop", slot: "rare", rate: "1/256 (~0.391%)" },
  { id: "item-path.disc-3.forgotten-continent.ark-pumice-piece-drop", itemId: "game-item.pumice-piece", method: "drop", slot: "always", objectiveId: "disc-3.forgotten-continent.pumice-piece" },
];
if (!arkRecord || arkRecord.kind !== "boss" || !arkEncounter || arkEncounter.kind !== "boss" ||
  !arkEncounter.formation.some((member) => member.enemyId === "enemy.ark" && member.quantity === 1) ||
  !arkEncounter.missableIds.includes("missable.disc-3.forgotten-continent.ark-steals") ||
  !arkEncounter.cutoffIds.includes("cutoff.oeilvert.ark-steals") ||
  arkRecord.drops.filter((slot) => slot.itemId === "game-item.ether").length !== 3 ||
  !arkRecord.drops.some((slot) => slot.slot === "always" && slot.itemId === "game-item.pumice-piece") ||
  !arkRecord.notes.some((note) => note.includes("source-reported") && note.includes("normal-KO"))) {
  errors.push("Ark must separate the one-time Oeilvert boss, guaranteed Pumice Piece, and three source-rated conditional Ether drop slots.");
}
for (const expected of arkLootExpectations) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id && entry.itemId === expected.itemId);
  const lootSlots = expected.method === "steal" ? arkRecord?.steals : arkRecord?.drops;
  const slot = lootSlots?.find((entry) => entry.slot === expected.slot && entry.itemId === expected.itemId);
  if (!path || !slot || path.method !== expected.method || path.enemyId !== "enemy.ark" ||
    path.enemyLootSlot !== expected.slot || path.encounterIds?.length !== 1 || path.encounterIds[0] !== "encounter.oeilvert.ark" ||
    path.availability !== "one-time-encounter" ||
    [...new Set([...(arkRecord?.sourceIds ?? []), ...(arkEncounter?.sourceIds ?? []), ...slot.sourceIds])]
      .some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    (expected.objectiveId && !path.walkthroughObjectiveIds?.includes(expected.objectiveId)) ||
    (expected.method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes(expected.rate ?? "") ||
      !path.conditions.includes("normal KO") || !path.conditions.includes("not guaranteed") ||
      path.walkthroughObjectiveIds?.includes("disc-3.forgotten-continent.ark-steals"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always slot guarantees") ||
      !path.conditions.includes("normal KO") || !path.walkthroughObjectiveIds?.includes("disc-3.forgotten-continent.pumice-piece")))) {
    errors.push(`Ark's ${expected.method} slot ${expected.slot} must link to the exact one-time boss route with correct outcome and provenance.`);
  }
}
const arkPreparation = arkRecord?.preparationGuidance;
const arkPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent")
  ?.sections.find((section) => section.id === "oeilvert-ark-preparation");
const arkPreparationStep = arkPreparationSection?.steps.find((step) => step.id === "oeilvert-ark-preparation");
const arkGameFaqsPrepSource = sources.find((source) => source.id === "gamefaqs-ark-prep-29957");
const arkGamerGuidesSource = sources.find((source) => source.id === "gamerguides-oeilvert");
if (!arkRecord || arkRecord.stats.find((stat) => stat.field === "level")?.value !== 38 ||
  !arkPreparation || arkPreparation.suggestedLevelRange !== undefined ||
  !arkPreparation.levelRationale.includes("enemy stat") || !arkPreparation.levelRationale.includes("Lv. 30 or higher") ||
  !arkPreparation.levelRationale.includes("optional benchmark") ||
  !arkPreparation.optionalGrinding.includes("Excalibur II timer") ||
  !arkPreparation.setupAdvice.includes("anti-magic seal") || !arkPreparation.setupAdvice.includes("Photon") ||
  !arkPreparation.sourceIds.includes("gamefaqs-ark-prep-29957") ||
  !arkPreparation.sourceIds.includes("gamerguides-oeilvert") ||
  !arkPreparationSection?.sourceIds.includes("gamefaqs-ark-prep-29957") ||
  !arkPreparationSection.sourceIds.includes("gamerguides-oeilvert") ||
  !arkPreparationStep?.text.includes("optional advice") ||
  !arkPreparationStep.detail?.includes("Level 38 is an enemy stat") ||
  !arkPreparationStep.detail?.includes("Switch title") ||
  !arkGameFaqsPrepSource?.notes.includes("PlayStation walkthrough") ||
  !arkGamerGuidesSource?.notes.includes("no party-level target")) {
  errors.push("Ark preparation must preserve the enemy/party level distinction, source-scoped optional benchmark, anti-magic setup, Excalibur II caveat, and source provenance.");
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
const bronzeGlovesLindblumPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.bronze-gloves-shop");
const bronzeGlovesDaliDisc3Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.bronze-gloves-dali-shop");
const bronzeGlovesShopObjective = objectives.find((objective) => objective.id === "disc-1.lindblum.bronze-gloves-shop");
if (!bronzeGlovesLindblumPath || bronzeGlovesLindblumPath.itemId !== "game-item.bronze-gloves" ||
  bronzeGlovesLindblumPath.availability !== "limited-window" ||
  bronzeGlovesLindblumPath.shopId !== "lindblum.weapon-shop.pre-cleyra" ||
  bronzeGlovesLindblumPath.cost?.amount !== 480 ||
  !bronzeGlovesLindblumPath.conditions.includes("until Cleyra is completed") ||
  !bronzeGlovesLindblumPath.walkthroughObjectiveIds?.includes("disc-1.lindblum.bronze-gloves-shop") ||
  !bronzeGlovesShopObjective || !bronzeGlovesShopObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  !bronzeGlovesDaliDisc3Path || bronzeGlovesDaliDisc3Path.itemId !== "game-item.bronze-gloves" ||
  bronzeGlovesDaliDisc3Path.chapterId !== "disc-3.card-tournament" ||
  bronzeGlovesDaliDisc3Path.availability !== "repeatable" ||
  bronzeGlovesDaliDisc3Path.shopId !== "dali.weapon-shop" ||
  bronzeGlovesDaliDisc3Path.cost?.amount !== 480 ||
  !bronzeGlovesDaliDisc3Path.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !bronzeGlovesDaliDisc3Path.walkthroughObjectiveIds?.includes("disc-3.card-tournament.dali-detour")) {
  errors.push("Bronze Gloves must distinguish Lindblum's pre-Cleyra stock cutoff from the documented Disc III Dali recovery path.");
}
const gladiusDaguerreoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.gladius-daguerreo-shop");
const gladiusAlexandriaPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-home-front.gladius-alexandria-shop");
const gladiusTrenoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.gladius-treno-shop");
if (!gladiusDaguerreoPath || gladiusDaguerreoPath.itemId !== "game-item.gladius" ||
  gladiusDaguerreoPath.chapterId !== "disc-3.aerial-exploration" ||
  gladiusDaguerreoPath.shopId !== "daguerreo.weapon-shop" ||
  gladiusDaguerreoPath.availability !== "limited-window" ||
  gladiusDaguerreoPath.cost?.amount !== 2300 ||
  !gladiusDaguerreoPath.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.daguerreo-stock") ||
  !gladiusDaguerreoPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !gladiusDaguerreoPath.conditions.includes("Disc III") ||
  !gladiusDaguerreoPath.conditions.includes("Disc IV") ||
  !gladiusAlexandriaPath || gladiusAlexandriaPath.availability !== "repeatable" ||
  !gladiusTrenoPath || gladiusTrenoPath.availability !== "repeatable") {
  errors.push("Gladius's Disc III Daguerreo purchase must be limited by the refreshed Disc IV weapon stock while preserving its later Treno and Alexandria item-type sources.");
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
    path.availability !== "limited-window" ||
    !path.walkthroughObjectiveIds?.includes(fossilRooTreasureObjectiveId) ||
    !path.sourceIds.includes("gamefaqs-fossil-roo-reentry-qa") ||
    !path.sourceIds.includes("jegged-missables") ||
    !path.sourceIds.includes("ffwiki-unrevisitable-locations") ||
    !path.conditions.includes("limited to the Disc II visit") ||
    !path.conditions.includes("Newer-release behavior remains unverified")
  ) {
    errors.push(`Fossil Roo's PlayStation Treasure Hunter shop cutoff must link ${pathId} to its pre-exit checklist action and scoped access sources.`);
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
  !fossilRooTreasureWarning.sourceIds.includes("gamefaqs-fossil-roo-reentry-qa") ||
  !fossilRooTreasureWarning.note.includes("For the original PlayStation route") ||
  !fossilRooTreasureWarning.note.includes("does not establish access to the inner rooms or Treasure Hunter's shop") ||
  !fossilRooTreasureWarning.note.includes("Newer-release behavior remains unverified") ||
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
  !fossilRooFinalGargantCutoff?.trigger.includes("on the original PlayStation") ||
  !fossilRooFinalGargantCutoff?.trigger.includes("Newer-release shop behavior remains unverified") ||
  !fossilRooFinalGargantCutoff?.sourceIds.includes("gamefaqs-fossil-roo-reentry-qa") ||
  !fossilRooFinalGargantCutoff?.sourceIds.includes("elitegrindlab-fossil-roo") ||
  !fossilRooFinalSweepStep?.detail?.includes("accepted re-entry answer") ||
  !fossilRooFinalSweepStep?.detail?.includes("Jegged says the entrance can technically be revisited") ||
  !fossilRooFinalSweepStep?.detail?.includes("Treasure Hunter's shop") ||
  !fossilRooFinalSweepStep?.detail?.includes("Newer-release behavior remains unverified") ||
  !fossilRooFinalSweepStep?.text.includes("buy any desired stock from the separate Treasure Hunter's shop") ||
  !fossilRooFinalSweepStep?.text.includes("Original PlayStation route evidence") ||
  !fossilRooFinalSweepStep?.text.includes("newer-release access is unverified") ||
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
  if (!movieCritic) {
    if (platform !== "ios") errors.push(`${platform} catalog is missing its Movie Critic achievement.`);
    continue;
  }
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
if (
  !jumpRopeLetterObjective?.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !jumpRopeLetterWarning?.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !jumpRopeLetterWarning?.consequence.includes("independently lists the starred Kupo-to-Mosh message") ||
  !jumpRopeLetterWarning?.nextAvailability?.includes("does not resolve this read-only message's later state") ||
  !jumpRopeLetterWarning?.recovery?.includes("generic warning about missed delivery letters does not settle this message's recovery")
) {
  errors.push("The VGR walkthrough must corroborate the read-only Disc I/II Jump Rope message without resolving its post-Disc-II state.");
}
if (
  !jumpRopeLetterObjective?.sourceIds.includes("game8-jump-rope") ||
  !jumpRopeLetterWarning?.sourceIds.includes("game8-jump-rope") ||
  !jumpRopeLetterWarning?.action.includes("reach 51 consecutive jumps") ||
  !jumpRopeLetterWarning?.note.includes("must exceed 50")
) {
  errors.push("The Jump Rope letter must cite Game8's exclusive over-50 threshold wording and retain 51 as the safe target.");
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
if (
  !discTwoJumpRopeStep?.detail?.includes("documented second opportunity") ||
  !discTwoJumpRopeStep.detail.includes("VGR no-spoiler walkthrough independently lists") ||
  !discTwoJumpRopeStep.objectiveIds?.includes(jumpRopeLetterId)
) {
  errors.push("The Disc II Mosh step must explain and link the independently corroborated second Jump Rope letter opportunity.");
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
  !discOneJumpRopeCutoff.sourceIds.includes("game8-jump-rope") ||
  !discOneJumpRopeCutoff.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !discOneJumpRopeCutoff.trigger.includes("51 consecutive Jump Rope jumps") ||
  !discOneJumpRopeCutoff.trigger.includes("VGR walkthrough marks this message with its read-only asterisk") ||
  discTwoJumpRopeCutoff?.edgeId !== "story.return-to-alexandria-to-pinnacle-rocks" ||
  !discTwoJumpRopeCutoff?.sourceIds.includes("jegged-return-to-alexandria-castle") ||
  !discTwoJumpRopeCutoff.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  !discTwoJumpRopeCutoff.trigger.includes("independently lists the starred Kupo-to-Mosh message") ||
  !discTwoJumpRopeCutoff?.trigger.includes("Jump-rope Champion Appears!") ||
  discThreeJumpRopeCutoff?.edgeId !== "story.trouble-on-home-front-to-aftermath" ||
  discThreeJumpRopeCutoff.certainty !== "conservative" ||
  !discThreeJumpRopeCutoff.trigger.includes("after control returns to Zidane's party") ||
  !discThreeJumpRopeCutoff.trigger.includes("before the library/Tantarian sequence") ||
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
const moisLetterObjective = objectivesById.get("disc-1.ice-cavern.mois-letter");
const moisLetterCutoff = gameRouteCutoffs.find((cutoff) => cutoff.id === "cutoff.dali-cargo-ship.mois-letter");
const moisLetterReturnEdge = gameRouteEdgesById.get("return.dali-to-ice-cavern");
const moisLetterDiscIVSource = "gamefaqs-moogle-faq-23306";
const moisLetterRecoverySources = ["cour89-ice-cavern", "game8-mognet-letter-list", "jinsoku-mognet-letter-list"];
const moisLetterReturnSources = [
  "gamefaqs-ice-cavern-71891",
  "steam-missable-content-guide-2988011418",
  "cour89-ice-cavern",
  "game8-mognet-letter-list",
  "jinsoku-mognet-letter-list",
  "gamefaqs-missables-71891",
  "gamefaqs-dali-71891",
  "jegged-ice-cavern",
  "elitegrindlab-ice-cavern",
];
if (
  !moisLetterWarning?.deadline?.includes("before boarding the Cargo Ship from Dali") ||
  !moisLetterWarning.recovery?.includes("Cour89 independently says") ||
  !moisLetterWarning.recovery.includes("Game8 and Jinsoku") ||
  !moisLetterWarning.consequence?.includes("That later chain does not establish whether the original Gumo letter can be recovered there") ||
  !moisLetterWarning.nextAvailability?.includes("is a different Mognet step") ||
  !moisLetterWarning.recovery.includes("it does not say the original Gumo letter can be recovered there") ||
  !moisLetterWarning.note?.includes("whether it can recover this letter is unknown") ||
  !moisLetterWarning.sourceIds.includes(moisLetterDiscIVSource) ||
  !moisLetterObjective?.sourceIds.includes(moisLetterDiscIVSource) ||
  moisLetterWarning.consequence.includes("later Mois visits do not provide this letter") ||
  moisLetterWarning.consequence.includes("available only during the Disc I route") ||
  moisLetterRecoverySources.some((sourceId) => !moisLetterWarning.sourceIds.includes(sourceId))
) {
  errors.push("Mois's letter warning must preserve the post-boss return and Disc I timing disagreement while distinguishing the separate Disc IV repair letter and unresolved recovery.");
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
  moisLetterReturnSources.some((sourceId) => !moisLetterReturnEdge.sourceIds.includes(sourceId)) ||
  moisLetterReturnEdge.sourceIds.includes("gamefaqs-ice-cavern-79143") ||
  moisLetterReturnEdge.sourceIds.includes("jegged-dali")
) {
  errors.push("The Dali return route must cite its scoped Ice Cavern return evidence without treating the timed letter route or first-visit Dali chapter as return evidence.");
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
const stellazzioGamefaqsSource = sources.find((source) => source.id === "gamefaqs-stellazzio-71891");
const stellazzioGamerGuidesSource = sources.find((source) => source.id === "gamerguides-stellazzios");
const stellazzioDisc4RouteSource = sources.find((source) => source.id === "megane-kangaroo-disc4-burmecia-recovery");
const ordinaryStellazzio = [
  { itemId: "game-item.aries-stellazzio", objectiveId: "disc-1.village-of-dali.aries-stellazzio", firstPathId: "item-path.disc-1.village-of-dali.aries-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.dali-aries-stellazzio" },
  { itemId: "game-item.cancer-stellazzio", objectiveId: "disc-1.burmecia.cancer-stellazzio", firstPathId: "item-path.burmecia.cancer", latePathId: "item-path.disc-4.return-to-gaia.burmecia-cancer-stellazzio" },
  { itemId: "game-item.scorpio-stellazzio", objectiveId: "disc-2.journey-to-treno.scorpio-stellazzio", firstPathId: "item-path.disc-2.journey-to-treno.scorpio-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.quans-dwelling-scorpio-stellazzio" },
  { itemId: "game-item.gemini-stellazzio", objectiveId: "disc-2.treno.gemini-stellazzio", firstPathId: "item-path.disc-2.treno.gemini-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.treno-gemini-stellazzio" },
  { itemId: "game-item.taurus-stellazzio", objectiveId: "disc-2.treno.taurus-stellazzio", firstPathId: "item-path.disc-2.treno.taurus-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.treno-taurus-stellazzio" },
  { itemId: "game-item.virgo-stellazzio", objectiveId: "disc-2.magdalene-forest.virgo-stellazzio", firstPathId: "item-path.disc-2.magdalene-forest.virgo-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.black-mage-village-virgo-stellazzio" },
  { itemId: "game-item.libra-stellazzio", objectiveId: "disc-2.madain-sari.libra-stellazzio", firstPathId: "item-path.disc-2.madain-sari.libra-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.madain-sari-libra-stellazzio" },
  { itemId: "game-item.leo-stellazzio", objectiveId: "disc-3.the-home-front.leo-stellazzio", firstPathId: "item-path.disc-3.home-front.leo-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.alexandria-leo-stellazzio" },
  { itemId: "game-item.sagittarius-stellazzio", objectiveId: "disc-3.the-aftermath.sagittarius", firstPathId: "item-path.disc-3.the-aftermath.sagittarius-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.lindblum-sagittarius-stellazzio" },
  { itemId: "game-item.capricorn-stellazzio", objectiveId: "disc-3.aerial-exploration.capricorn-stellazzio", firstPathId: "item-path.disc-3.aerial-exploration.capricorn-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.daguerreo-capricorn-stellazzio" },
  { itemId: "game-item.aquarius-stellazzio", objectiveId: "disc-3.ipsens-castle.aquarius-stellazzio", firstPathId: "item-path.disc-3.ipsens-castle.aquarius-stellazzio", latePathId: "item-path.disc-4.return-to-gaia.ipsens-castle-aquarius-stellazzio" },
  { itemId: "game-item.pisces-stellazzio", objectiveId: "disc-4.return-to-gaia.pisces-stellazzio", firstPathId: "item-path.disc-4.return-to-gaia.pisces-stellazzio", latePathId: undefined },
];
const stellazzioSweepStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "gaia-return-stellazzio-recovery-sweep");
const ariesDisc4Step = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "gaia-return-dali-aries-stellazzio");
const ariesDisc4Route = gameRouteEdges.find((edge) => edge.id === "detour.return-to-gaia-dali-aries");
const ariesDisc4Rejoin = gameRouteEdges.find((edge) => edge.id === "detour.dali-aries-rejoin-gaia");
const lateStellazzioRoutePairs = [
  ["detour.return-to-gaia-lindblum-sagittarius", "detour.lindblum-sagittarius-rejoin-gaia"],
  ["detour.return-to-gaia-daguerreo-capricorn", "detour.daguerreo-capricorn-rejoin-gaia"],
  ["detour.return-to-gaia-ipsens-castle-aquarius", "detour.ipsens-castle-aquarius-rejoin-gaia"],
];
if (
  !stellazzioGamefaqsSource?.notes.includes("none of the Stellazzio are missable, even on Disc IV")
  || !stellazzioGamerGuidesSource?.notes.includes("all can be found on the final disc")
  || !stellazzioDisc4RouteSource?.notes.includes("images are from story progression")
  || !stellazzioDisc4RouteSource.notes.includes("does not establish the Dali-to-Invincible rejoin")
  || ordinaryStellazzio.length !== 12
  || ordinaryStellazzio.some(({ itemId, objectiveId, firstPathId, latePathId }) => {
    const item = gameItems.find((record) => record.id === itemId);
    const objective = objectivesById.get(objectiveId);
    const firstPath = itemAcquisitionPaths.find((path) => path.id === firstPathId);
    const latePath = latePathId ? itemAcquisitionPaths.find((path) => path.id === latePathId) : undefined;
    return !item
      || !item.sourceIds.includes("gamefaqs-stellazzio-71891")
      || !item.sourceIds.includes("gamerguides-stellazzios")
      || !objective?.sourceIds.includes("gamefaqs-stellazzio-71891")
      || !objective.sourceIds.includes("gamerguides-stellazzios")
      || !objective.chapterIds?.includes("disc-4.return-to-gaia")
      || firstPath?.itemId !== itemId
      || !firstPath.walkthroughObjectiveIds?.includes(objectiveId)
      || !firstPath.sourceIds.includes("gamefaqs-stellazzio-71891")
      || !firstPath.sourceIds.includes("gamerguides-stellazzios")
      || (latePathId !== undefined && (
        latePath?.itemId !== itemId
        || latePath.chapterId !== "disc-4.return-to-gaia"
        || !latePath.walkthroughObjectiveIds?.includes(objectiveId)
        || !latePath.sourceIds.includes("gamefaqs-stellazzio-71891")
        || !latePath.sourceIds.includes("gamerguides-stellazzios")
      ));
  })
  || ordinaryStellazzio.some(({ objectiveId }) => !stellazzioSweepStep?.objectiveIds?.includes(objectiveId))
  || !ariesDisc4Step?.objectiveIds?.includes("disc-1.village-of-dali.aries-stellazzio")
  || !ariesDisc4Step.detail?.includes("images are from story progression")
  || ariesDisc4Route?.fromChapterId !== "disc-4.return-to-gaia"
  || ariesDisc4Route.toChapterId !== "disc-1.village-of-dali"
  || ariesDisc4Route.relationship !== "optional-return"
  || !ariesDisc4Route.summary.includes("does not establish the Dali-to-Invincible rejoin")
  || !ariesDisc4Route.sourceIds.includes("gamefaqs-return-to-gaia-71891")
  || !ariesDisc4Route.sourceIds.includes("gamefaqs-stellazzio-71891")
  || !ariesDisc4Route.sourceIds.includes("gamerguides-stellazzios")
  || !ariesDisc4Route.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery")
  || ariesDisc4Rejoin?.fromChapterId !== "disc-1.village-of-dali"
  || ariesDisc4Rejoin.toChapterId !== "disc-4.return-to-gaia"
  || ariesDisc4Rejoin.relationship !== "rejoin"
  || !ariesDisc4Rejoin.sourceIds.includes("gamefaqs-return-to-gaia-71891")
  || ariesDisc4Rejoin.sourceIds.includes("megane-kangaroo-disc4-burmecia-recovery")
  || lateStellazzioRoutePairs.some(([detourId, rejoinId]) => {
    const detour = gameRouteEdges.find((edge) => edge.id === detourId);
    const rejoin = gameRouteEdges.find((edge) => edge.id === rejoinId);
    return detour?.fromChapterId !== "disc-4.return-to-gaia"
      || detour.relationship !== "optional-return"
      || rejoin?.toChapterId !== "disc-4.return-to-gaia"
      || rejoin.relationship !== "rejoin";
  })
) {
  errors.push("The twelve ordinary Stellazzio need first and late Disc IV paths, individual objectives, sourced coverage, connected return routes, and the Dali pickup/rejoin source scopes and image caveat.");
}
const ophiucusItem = gameItems.find((item) => item.id === "game-item.ophiucus-stellazzio");
const ophiucusPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.quans-dwelling-ophiucus-stellazzio");
const ophiucusObjective = objectivesById.get("disc-4.return-to-gaia.ophiucus-stellazzio");
const hammerItem = gameItems.find((item) => item.id === "game-item.hammer");
const hammerPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.queen-stella-hammer-reward");
const hammerObjective = objectivesById.get("disc-4.return-to-gaia.hammer-reward");
const finalStellazzioStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "gaia-return-ophiucus-hammer");
if (
  !ophiucusItem?.sourceIds.includes("gamefaqs-stellazzio-71891")
  || ophiucusPath?.itemId !== ophiucusItem?.id
  || ophiucusPath.availability !== "conditional"
  || !ophiucusPath.conditions?.includes("all twelve ordinary Stellazzio")
  || !ophiucusPath.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.ophiucus-stellazzio")
  || !ophiucusObjective?.chapterIds?.includes("disc-4.return-to-gaia")
  || !hammerItem?.sourceIds.includes("jegged-stellazzio")
  || hammerPath?.itemId !== hammerItem?.id
  || hammerPath.method !== "quest-reward"
  || hammerPath.quantity !== 1
  || !hammerPath.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.hammer-reward")
  || !hammerObjective?.chapterIds?.includes("disc-4.return-to-gaia")
  || !finalStellazzioStep?.objectiveIds?.includes("disc-4.return-to-gaia.ophiucus-stellazzio")
  || !finalStellazzioStep.objectiveIds.includes("disc-4.return-to-gaia.hammer-reward")
) {
  errors.push("Ophiucus and the unique Hammer need separate item, conditional-path, objective, source, and walkthrough links.");
}
const hadesRecipeSources = ["gamefaqs-items-71891", "gamefaqs-master-synthesist-71891", "rpgclassics-memoria", "rpgclassics-synthesis", "elitegrindlab-synthesis"];
const hadesRecipeChecks = [
  {
    recipeId: "synthesis-recipe.tin-armor",
    itemId: "game-item.tin-armor",
    ingredients: [{ itemId: "game-item.hammer", quantity: 1 }, { itemId: "game-item.ore", quantity: 1 }],
    cost: 50000,
    pathId: "item-path.disc-4.memoria.hades-tin-armor-synthesis",
  },
  {
    recipeId: "synthesis-recipe.pumice",
    itemId: "game-item.pumice",
    ingredients: [{ itemId: "game-item.pumice-piece", quantity: 2 }],
    cost: 50000,
    pathId: "item-path.disc-4.memoria.hades-pumice-synthesis",
  },
  {
    recipeId: "synthesis-recipe.pumice-piece",
    itemId: "game-item.pumice-piece",
    ingredients: [{ itemId: "game-item.hammer", quantity: 1 }, { itemId: "game-item.pumice", quantity: 1 }],
    cost: 25000,
    pathId: "item-path.disc-4.memoria.hades-pumice-piece-synthesis",
  },
];
const hadesRecipeRecordsMatch = hadesRecipeChecks.every((expected) => {
  const recipe = synthesisRecipes.find((record) => record.id === expected.recipeId);
  const path = itemAcquisitionPaths.find((record) => record.id === expected.pathId);
  return recipe?.resultItemId === expected.itemId
    && JSON.stringify(recipe.ingredients) === JSON.stringify(expected.ingredients)
    && recipe.chapterId === "disc-4.memoria"
    && recipe.shopId === "hades.master-synthesist"
    && recipe.cost.amount === expected.cost
    && hadesRecipeSources.every((sourceId) => recipe.sourceIds.includes(sourceId))
    && path?.itemId === expected.itemId
    && path.method === "synthesis"
    && path.recipeId === expected.recipeId
    && path.chapterId === "disc-4.memoria"
    && path.availability === "conditional"
    && path.shopId === "hades.master-synthesist"
    && path.cost?.amount === expected.cost
    && path.walkthroughObjectiveIds?.includes("disc-4.memoria.hades")
    && hadesRecipeSources.every((sourceId) => path.sourceIds.includes(sourceId));
});
const tinArmorItem = gameItems.find((item) => item.id === "game-item.tin-armor");
const pumiceItem = gameItems.find((item) => item.id === "game-item.pumice");
const pumicePieceItem = gameItems.find((item) => item.id === "game-item.pumice-piece");
const hammerEndingWarning = missablesById.get("missable.disc-4.final-preparations.hammer-ending");
const hammerChoiceStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.final-preparations")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "final-preparations-hammer-choice");
const hammerChoiceSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.final-preparations")
  ?.sections.find((section) => section.steps.some((step) => step.id === "final-preparations-hammer-choice"));
if (
  !hadesRecipeRecordsMatch
  || !tinArmorItem
  || !hadesRecipeSources.every((sourceId) => tinArmorItem.sourceIds.includes(sourceId))
  || !pumiceItem?.sourceIds.includes("rpgclassics-synthesis")
  || !pumiceItem.sourceIds.includes("elitegrindlab-synthesis")
  || !pumicePieceItem?.sourceIds.includes("rpgclassics-synthesis")
  || !pumicePieceItem.sourceIds.includes("elitegrindlab-synthesis")
  || !hammerItem?.sourceIds.includes("rpgclassics-synthesis")
  || !hammerItem?.sourceIds.includes("elitegrindlab-synthesis")
  || !hammerEndingWarning?.consequence.includes("Tin Armor")
  || !hammerEndingWarning.consequence.includes("Pumice Piece")
  || !hammerEndingWarning.action.includes("Tin Armor")
  || !hammerEndingWarning.action.includes("Pumice Piece")
  || !hadesRecipeSources.every((sourceId) => hammerEndingWarning.sourceIds.includes(sourceId))
  || !hammerChoiceStep?.text.includes("Tin Armor")
  || !hammerChoiceStep.text.includes("Pumice Piece")
  || !hammerChoiceStep.detail.includes("Pumice used to teach Dagger Ark")
  || !hammerChoiceSection?.sourceIds.includes("rpgclassics-memoria")
  || !hammerChoiceSection.sourceIds.includes("rpgclassics-synthesis")
  || !hammerChoiceSection.sourceIds.includes("elitegrindlab-synthesis")
) {
  errors.push("Hades's Tin Armor/Pumice/Pumice Piece recipes need exact ingredients and prices, conditional item paths, source links, and the unique-Hammer tradeoff in the warning and walkthrough.");
}
const hadesCatalogSourceIds = ["gamefaqs-items-71891", "rpgclassics-synthesis"];
const hadesCatalogChecks = [
  { recipeId: "synthesis-recipe.robe-of-lords", itemId: "game-item.robe-of-lords", ingredients: [{ itemId: "game-item.white-robe", quantity: 1 }, { itemId: "game-item.black-robe", quantity: 1 }], cost: 30000, pathId: "item-path.disc-4.memoria.hades-robe-of-lords-synthesis", elite: true },
  { recipeId: "synthesis-recipe.tin-armor", itemId: "game-item.tin-armor", ingredients: [{ itemId: "game-item.hammer", quantity: 1 }, { itemId: "game-item.ore", quantity: 1 }], cost: 50000, pathId: "item-path.disc-4.memoria.hades-tin-armor-synthesis", elite: true },
  { recipeId: "synthesis-recipe.protect-ring", itemId: "game-item.protect-ring", ingredients: [{ itemId: "game-item.dark-matter", quantity: 1 }, { itemId: "game-item.rebirth-ring", quantity: 1 }], cost: 40000, pathId: "item-path.disc-4.memoria.hades-protect-ring-synthesis", elite: true },
  { recipeId: "synthesis-recipe.pumice", itemId: "game-item.pumice", ingredients: [{ itemId: "game-item.pumice-piece", quantity: 2 }], cost: 50000, pathId: "item-path.disc-4.memoria.hades-pumice-synthesis", elite: true },
  { recipeId: "synthesis-recipe.garnet", itemId: "game-item.garnet", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.remedy", quantity: 1 }], cost: 350, pathId: "item-path.disc-4.memoria.hades-garnet-synthesis" },
  { recipeId: "synthesis-recipe.amethyst", itemId: "game-item.amethyst", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.annoyntment", quantity: 1 }], cost: 200, pathId: "item-path.disc-4.memoria.hades-amethyst-synthesis" },
  { recipeId: "synthesis-recipe.peridot", itemId: "game-item.peridot", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.soft", quantity: 1 }], cost: 100, pathId: "item-path.disc-4.memoria.hades-peridot-synthesis" },
  { recipeId: "synthesis-recipe.sapphire", itemId: "game-item.sapphire", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.antidote", quantity: 1 }], cost: 200, pathId: "item-path.disc-4.memoria.hades-sapphire-synthesis" },
  { recipeId: "synthesis-recipe.opal", itemId: "game-item.opal", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.potion", quantity: 1 }], cost: 100, pathId: "item-path.disc-4.memoria.hades-opal-synthesis" },
  { recipeId: "synthesis-recipe.topaz", itemId: "game-item.topaz", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.eye-drops", quantity: 1 }], cost: 100, pathId: "item-path.disc-4.memoria.hades-topaz-synthesis" },
  { recipeId: "synthesis-recipe.lapis-lazuli", itemId: "game-item.lapis-lazuli", ingredients: [{ itemId: "game-item.ore", quantity: 1 }, { itemId: "game-item.dead-pepper", quantity: 1 }], cost: 400, pathId: "item-path.disc-4.memoria.hades-lapis-lazuli-synthesis" },
  { recipeId: "synthesis-recipe.pumice-piece", itemId: "game-item.pumice-piece", ingredients: [{ itemId: "game-item.hammer", quantity: 1 }, { itemId: "game-item.pumice", quantity: 1 }], cost: 25000, pathId: "item-path.disc-4.memoria.hades-pumice-piece-synthesis", elite: true },
  { recipeId: "synthesis-recipe.save-the-queen", itemId: "game-item.save-the-queen", ingredients: [{ itemId: "game-item.javelin", quantity: 1 }, { itemId: "game-item.silver-gloves", quantity: 1 }], cost: 50000, pathId: "item-path.disc-4.memoria.hades-save-the-queen-synthesis", elite: true },
  { recipeId: "synthesis-recipe.phoenix-pinion", itemId: "game-item.phoenix-pinion", ingredients: [{ itemId: "game-item.phoenix-down", quantity: 1 }, { itemId: "game-item.gysahl-greens", quantity: 1 }], cost: 300, pathId: "item-path.disc-4.memoria.phoenix-pinion-hades-synthesis" },
  { recipeId: "synthesis-recipe.ether", itemId: "game-item.ether", ingredients: [{ itemId: "game-item.echo-screen", quantity: 1 }, { itemId: "game-item.vaccine", quantity: 1 }], cost: 500, pathId: "item-path.disc-4.memoria.hades-ether-synthesis" },
];
const hadesCatalogMatches = hadesCatalogChecks.every((expected) => {
  const recipe = synthesisRecipes.find((record) => record.id === expected.recipeId);
  const path = itemAcquisitionPaths.find((record) => record.id === expected.pathId);
  const item = gameItems.find((record) => record.id === expected.itemId);
  const eliteSourcePresent = !expected.elite || (
    recipe?.sourceIds.includes("elitegrindlab-synthesis")
    && path?.sourceIds.includes("elitegrindlab-synthesis")
    && item?.sourceIds.includes("elitegrindlab-synthesis")
  );
  return recipe?.resultItemId === expected.itemId
    && JSON.stringify(recipe.ingredients) === JSON.stringify(expected.ingredients)
    && recipe.cost.amount === expected.cost
    && hadesCatalogSourceIds.every((sourceId) => recipe.sourceIds.includes(sourceId))
    && path?.itemId === expected.itemId
    && path.method === "synthesis"
    && path.recipeId === expected.recipeId
    && path.chapterId === "disc-4.memoria"
    && path.availability === "conditional"
    && path.shopId === "hades.master-synthesist"
    && path.cost?.amount === expected.cost
    && path.walkthroughObjectiveIds?.includes("disc-4.memoria.hades")
    && hadesCatalogSourceIds.every((sourceId) => path.sourceIds.includes(sourceId))
    && item !== undefined
    && hadesCatalogSourceIds.every((sourceId) => item.sourceIds.includes(sourceId))
    && eliteSourcePresent;
});
const hadesCatalogPaths = itemAcquisitionPaths.filter((path) => path.method === "synthesis" && path.shopId === "hades.master-synthesist");
const javelinItem = gameItems.find((item) => item.id === "game-item.javelin");
const javelinIpsenPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.ipsens-castle.javelin-chest");
const hadesCatalogStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "memoria-hades-synthesis-shop");
const hadesCatalogObjective = objectivesById.get("disc-4.memoria.hades");
const javelinStartingPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.freya-starting-javelin");
const javelinNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.javelin-need-two");
const javelinEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.javelin-end-inventory-one");
const javelinDragonKillerClaim = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.javelin.dragon-killer");
if (
  hadesCatalogChecks.length !== 15
  || hadesCatalogPaths.length !== hadesCatalogChecks.length
  || !hadesCatalogMatches
  || !hadesCatalogStep?.text.includes("fifteen documented recipes")
  || !hadesCatalogStep.detail.includes("exact trigger remains unresolved")
  || !hadesCatalogStep.objectiveIds?.includes("disc-4.memoria.hades")
  || !hadesCatalogObjective?.sourceIds.includes("rpgclassics-synthesis")
  || !hadesCatalogObjective.sourceIds.includes("gamefaqs-items-71891")
  || !javelinItem?.sourceIds.includes("gamefaqs-ipsens-castle-71891")
  || !javelinItem?.sourceIds.includes("gamefaqs-abilities-71891")
  || javelinStartingPath?.itemId !== "game-item.javelin"
  || javelinStartingPath.method !== "starting-equipment"
  || javelinStartingPath.chapterId !== "disc-1.lindblum"
  || javelinNeedTarget?.itemId !== "game-item.javelin"
  || javelinNeedTarget.targetQuantity !== 2
  || javelinNeedTarget.basis !== "route-need"
  || !javelinNeedTarget.interpretation.includes("optional source-specific route-need target")
  || javelinEndInventoryTarget?.itemId !== "game-item.javelin"
  || javelinEndInventoryTarget.targetQuantity !== 1
  || javelinEndInventoryTarget.basis !== "end-inventory"
  || !javelinEndInventoryTarget.interpretation.includes("distinct from Need 2")
  || javelinDragonKillerClaim?.itemId !== "game-item.javelin"
  || javelinDragonKillerClaim.abilityName !== "Dragon Killer"
  || javelinDragonKillerClaim.verification !== "partial"
  || !javelinDragonKillerClaim.sourceIds.includes("gamefaqs-abilities-71891")
  || javelinIpsenPath?.itemId !== "game-item.javelin"
  || javelinIpsenPath.method !== "chest"
  || javelinIpsenPath.chapterId !== "disc-3.ipsens-castle"
  || !javelinIpsenPath.walkthroughObjectiveIds?.includes("disc-3.ipsens-castle.pickups")
  || !javelinIpsenPath.sourceIds.includes("gamefaqs-items-71891")
  || !javelinIpsenPath.sourceIds.includes("gamefaqs-ipsens-castle-71891")
) {
  errors.push("Hades's full fifteen-recipe stock, conditional item paths, Javelin's starting and Ipsen copies, source-specific Need 2 target, Dragon Killer claim, and unresolved shop-opening trigger must remain connected.");
}
const deadPepperSourceIds = ["gamefaqs-items-71891", "gamefaqs-chocobo-hot-cold-71891", "rpgsite-ffix-chocobo-guide"];
const deadPepperItem = gameItems.find((item) => item.id === "game-item.dead-pepper");
const deadPepperDigPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.dead-pepper-hot-cold-dig");
const deadPepperParadisePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.dead-pepper-paradise-refill");
const deadPepperParadiseObjective = objectivesById.get("disc-3.aerial-exploration.chocobo-paradise-refill");
if (
  !deadPepperItem
  || !deadPepperSourceIds.every((sourceId) => deadPepperItem.sourceIds.includes(sourceId))
  || deadPepperDigPath?.itemId !== "game-item.dead-pepper"
  || deadPepperDigPath.chapterId !== "disc-3.aerial-exploration"
  || deadPepperDigPath.method !== "quest-reward"
  || deadPepperDigPath.quantity !== 1
  || deadPepperDigPath.availability !== "repeatable"
  || !deadPepperDigPath.conditions?.includes("Mountain ability")
  || !deadPepperDigPath.conditions?.includes("random")
  || !deadPepperSourceIds.every((sourceId) => deadPepperDigPath.sourceIds.includes(sourceId))
  || deadPepperParadisePath?.itemId !== "game-item.dead-pepper"
  || deadPepperParadisePath.method !== "quest-reward"
  || deadPepperParadisePath.quantity !== 99
  || deadPepperParadisePath.availability !== "repeatable"
  || !deadPepperParadisePath.conditions?.includes("one Dead Pepper")
  || !deadPepperParadisePath.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.chocobo-paradise-refill")
  || !deadPepperSourceIds.every((sourceId) => deadPepperParadisePath.sourceIds.includes(sourceId))
  || !deadPepperParadiseObjective?.sourceIds.includes("rpgsite-ffix-chocobo-guide")
) {
  errors.push("Dead Pepper needs source-linked Hot & Cold and repeatable Chocobo's Paradise acquisition paths, with the Mountain ability and one-pepper entrance gates recorded.");
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
      else if (guideObjective.achievementPlatforms && !guideObjective.achievementPlatforms.includes(platform)) {
        errors.push(`${platform} achievement ${achievement.id} guide objective ${objectiveId} is filtered from its platform profile.`);
      }
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
const iosParityIds = iosAchievements.map((record) => record.parityId).sort();
const androidParityIds = androidAchievements.map((record) => record.parityId).sort();
const expectedIosParityIds = [...steamAchievementIds].filter((id) => id !== "backstabber" && id !== "movie-critic").sort();
if (ps4ParityIds.length !== 51 || new Set(ps4ParityIds).size !== 51) {
  errors.push(`PS4 catalog has ${ps4ParityIds.length} non-Platinum criteria; expected 51 unique gameplay trophies.`);
}
if (JSON.stringify(ps4ParityIds) !== JSON.stringify(xboxParityIds)) {
  errors.push("PS4 and Xbox gameplay criteria do not share the same parity IDs.");
}
for (const parityId of xboxParityIds) {
  if (!steamAchievementIds.has(parityId)) errors.push(`Console criterion ${parityId} has no Steam comparison record.`);
}
if (androidParityIds.length !== 85 || JSON.stringify(androidParityIds) !== JSON.stringify([...steamAchievementIds].sort())) {
  errors.push("Android Google Play catalog must match the 85 Steam criteria by parity ID.");
}
if (iosParityIds.length !== 83 || JSON.stringify(iosParityIds) !== JSON.stringify(expectedIosParityIds)) {
  errors.push("iOS Game Center catalog must match the 83-entry list without Backstabber and Movie Critic.");
}
if (androidAchievements.some((record) => record.sourceId !== "android-google-play-achievements") ||
  iosAchievements.some((record) => record.sourceId !== "ios-game-center-achievements")) {
  errors.push("Mobile achievement records must keep their service-specific catalog source IDs.");
}
const androidMovieCritic = androidAchievements.find((record) => record.id === "movie-critic");
const iosMovieCritic = iosAchievements.find((record) => record.id === "movie-critic");
const androidBackstabber = androidAchievements.find((record) => record.id === "backstabber");
const iosBackstabber = iosAchievements.find((record) => record.id === "backstabber");
if (!androidMovieCritic || !androidBackstabber || iosMovieCritic || iosBackstabber) {
  errors.push("Android must include Movie Critic and Backstabber; the iOS Game Center catalog must omit both.");
}
if (androidMovieCritic && activeTimeEvents.some((event) => !event.sourceIds.includes("android-google-play-achievements"))) {
  errors.push("Android Movie Critic event routes must cite the Google Play achievement catalog.");
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
const updatedShopsObjective = objectivesById.get("disc-4.return-to-gaia.updated-shops");
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
const tigerFangsDisc4CandidatePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.tiger-fangs-daguerreo-candidate");
const ffwikiTigerFangsSource = sources.find((source) => source.id === "ffwiki-tiger-fangs");
const jinsokuTigerFangsSource = sources.find((source) => source.id === "jinsoku-limited-items");
const tigerFangsItem = gameItems.find((item) => item.id === "game-item.tiger-fangs");
const tigerFangsAbilityClaims = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.tiger-fangs");
const hadesElixirDropPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-elixir-drop");
const necronElixirStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.the-final-battle.necron-elixir-common-steal");
const deathguiseWalkthroughSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.memoria")
  ?.sections.find((section) => section.steps.some((step) => step.id === "memoria-deathguise-steals"));
const deathguiseWalkthroughStep = deathguiseWalkthroughSection?.steps.find((step) => step.id === "memoria-deathguise-steals");
if (!deathguiseWarning?.classification.includes("missable-opportunity") ||
  !deathguiseWarning.classification.includes("limited-quantity") ||
  !deathguiseWarning.classification.includes("recoverable-later") ||
  !deathguiseWarning.nextAvailability?.includes("Treno on Disc IV for 4,000 Gil") ||
  !deathguiseWarning.nextAvailability.includes("only if both materials remain") ||
  !deathguiseWarning.nextAvailability.includes("Caves of Narshe lists a Disc IV Daguerreo Tiger Fangs purchase") ||
  !deathguiseWarning.nextAvailability.includes("Final Fantasy Wiki and Jinsoku support a Disc III limited purchase") ||
  !deathguiseWarning.nextAvailability.includes("retain the Disc III copy if Duel Claws matters") ||
  !deathguiseWarning.sourceIds.includes("ffwiki-tiger-fangs") ||
  !deathguiseWarning.sourceIds.includes("jinsoku-limited-items") ||
  !ffwikiTigerFangsSource?.url.includes("Tiger_Fangs_%28Final_Fantasy_IX%29") ||
  !ffwikiTigerFangsSource.notes.includes("could not be opened directly through the browser fetch") ||
  !ffwikiTigerFangsSource.notes.includes("does not resolve late stock") ||
  !jinsokuTigerFangsSource?.url.endsWith("/ff9/item/warning_item.html") ||
  !jinsokuTigerFangsSource.notes.includes("does not give a price, identify a game build") ||
  !jinsokuTigerFangsSource.notes.includes("without resolving Caves of Narshe's conflicting Disc IV map listing") ||
  !["cavesofnarshe-ff9-disc-4-map", "gamefaqs-shops-71891", "rpgclassics-shops"].every((sourceId) => deathguiseWarning.sourceIds.includes(sourceId)) ||
  !deathguiseStealObjective ||
  !["gamefaqs-shops-71891", "gamefaqs-chocobo-hot-cold-71891", "rpgclassics-synthesis", "rpgclassics-addons", "cavesofnarshe-ff9-disc-4-map", "rpgclassics-shops", "ffwiki-tiger-fangs", "jinsoku-limited-items"].every((sourceId) => deathguiseStealObjective.sourceIds.includes(sourceId)) ||
  !updatedShopsObjective ||
  !["gamefaqs-shops-71891", "rpgclassics-shops", "cavesofnarshe-ff9-disc-4-map", "jinsoku-limited-items"].every((sourceId) => updatedShopsObjective.sourceIds.includes(sourceId)) ||
  !updatedShopsObjective.sourceIds.includes("ffwiki-tiger-fangs") ||
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
  !duelClawsRecipe.sourceIds.includes("ffwiki-tiger-fangs") ||
  !duelClawsRecipe.notes.includes("describes its Daguerreo purchase as missable before Shimmering Island") ||
  !duelClawsSynthesisPath?.conditions?.includes("only if both materials remain") ||
  !duelClawsSynthesisPath.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !dragonClawsChocographPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !tigerFangsShopPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !tigerFangsShopPath.sourceIds.includes("ffwiki-tiger-fangs") ||
  !tigerFangsShopPath.sourceIds.includes("jinsoku-limited-items") ||
  !tigerFangsShopPath.sourceIds.includes("drslice-daguerreo-armory") ||
  !tigerFangsShopPath.conditions.includes("DrSlice independently lists the 13,500-Gil item in Daguerreo's Disk 3 inventory") ||
  !tigerFangsDisc4CandidatePath || tigerFangsDisc4CandidatePath.itemId !== "game-item.tiger-fangs" ||
  tigerFangsDisc4CandidatePath.chapterId !== "disc-4.return-to-gaia" || tigerFangsDisc4CandidatePath.method !== "shop" ||
  tigerFangsDisc4CandidatePath.availability !== "window-unverified" || tigerFangsDisc4CandidatePath.cost?.amount !== 13500 ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("cavesofnarshe-ff9-disc-4-map") ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("gamefaqs-shops-71891") ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("rpgclassics-shops") ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("ffwiki-tiger-fangs") ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("jinsoku-limited-items") ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes("drslice-daguerreo-armory") ||
  !tigerFangsDisc4CandidatePath.conditions.includes("DrSlice lists a 13,500-Gil Tiger Fangs in Daguerreo's Disk 3 inventory") ||
  !tigerFangsDisc4CandidatePath.conditions.includes("does not establish Disc IV stock") ||
  !tigerFangsDisc4CandidatePath.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.updated-shops") ||
  !tigerFangsDisc4CandidatePath.walkthroughObjectiveIds.includes("disc-4.memoria.deathguise-steals") ||
  !hadesElixirDropPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !necronElixirStealPath?.walkthroughObjectiveIds?.includes("disc-4.memoria.deathguise-steals") ||
  !deathguiseWalkthroughStep?.detail?.includes("Hades's drop table") ||
  !deathguiseWalkthroughStep.detail.includes("8,100 Gil total") ||
  !deathguiseWalkthroughStep.detail.includes("Caves of Narshe lists a Disc IV purchase while GameFAQs/RPGClassics omit it") ||
  !deathguiseWalkthroughStep.detail.includes("Final Fantasy Wiki's indexed item page describes the 13,500-Gil Daguerreo Tiger Fangs purchase as missable before Shimmering Island") ||
  !deathguiseWalkthroughStep.detail.includes("Jinsoku's Japanese limited-item list independently places it at Daguerreo on Disc III") ||
  !deathguiseWalkthroughSection?.sourceIds.includes("jinsoku-limited-items") ||
  !deathguiseWalkthroughStep.detail.includes("retain the Disc III copy if Duel Claws matters until confirmed")) {
  errors.push("Deathguise's one-time steals must distinguish item-type recovery, source-linked Disc IV Black Belt synthesis, and the conditional Duel Claws ingredient route, including the disputed Tiger Fangs Disc IV candidate.");
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
const headgearPathContexts = [
  { id: "item-path.disc-1.burmecia.headgear-atla-mogshop", chapterId: "disc-1.burmecia", shopId: "burmecia.atla-mogshop", availability: "limited-window" },
  { id: "item-path.disc-2.journey-to-cleyra.atla-mogshop.headgear", chapterId: "disc-2.journey-to-cleyra", shopId: "burmecia.atla-mogshop", availability: "limited-window" },
  { id: "item-path.disc-1.lindblum.headgear-dragoos-shop", chapterId: "disc-1.lindblum", shopId: "lindblum.weapon-shop", availability: "limited-window" },
  { id: "item-path.disc-2.return-to-lindblum.headgear-dragoos-shop", chapterId: "disc-2.return-to-lindblum", shopId: "lindblum.weapon-shop.disc-2", availability: "limited-window" },
  { id: "item-path.disc-2.journey-to-treno.headgear-summit-station-shop", chapterId: "disc-2.journey-to-treno", shopId: "summit-station.weapon-shop", availability: "limited-window" },
  { id: "item-path.disc-2.magdalene-forest.headgear-black-mage-village", chapterId: "disc-2.magdalene-forest", shopId: "black-mage-village.weapon-shop.disc-2-3", availability: "limited-window" },
  { id: "item-path.disc-3.aerial-exploration.headgear-atla-mogshop", chapterId: "disc-3.aerial-exploration", shopId: "burmecia.atla-mogshop", availability: "repeatable" },
  { id: "item-path.disc-4.return-to-gaia.headgear-atla-mogshop", chapterId: "disc-4.return-to-gaia", shopId: "burmecia.atla-mogshop", availability: "repeatable" },
];
const headgearPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.headgear");
const headgearItem = gameItems.find((item) => item.id === "game-item.headgear");
const headgearUndeadKillerClaim = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.headgear.undead-killer");
const aerialHeadgearInstruction = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "aerial-plan-route");
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
if (headgearPaths.length !== headgearPathContexts.length ||
  headgearPathContexts.some((context) => {
    const path = headgearPaths.find((candidate) => candidate.id === context.id);
    return !path || path.chapterId !== context.chapterId || path.shopId !== context.shopId ||
      path.availability !== context.availability || path.cost?.currency !== "gil" || path.cost.amount !== 330 ||
      !path.sourceIds.includes("gamefaqs-equipment-33383") || !path.sourceIds.includes("ff9-irodori-items-armor");
  }) ||
  !headgearItem?.sourceIds.includes("gamefaqs-equipment-33383") ||
  !headgearItem.sourceIds.includes("ff9-irodori-items-armor") ||
  !headgearPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.headgear-atla-mogshop")?.sourceIds.includes("gamefaqs-aerial-exploration-71891") ||
  !aerialHeadgearInstruction?.detail?.includes("Atla's Mogshop in Burmecia") ||
  !aerialHeadgearInstruction.detail.includes("not Headgear") ||
  !headgearUndeadKillerClaim ||
  headgearUndeadKillerClaim.abilityName !== "Undead Killer" ||
  !headgearUndeadKillerClaim.sourceIds.includes("ff9-irodori-items-armor")) {
  errors.push("Headgear's eight source-listed 330-Gil shop paths, confirmed Disc III Atla route, Disc IV recovery, and Undead Killer claim must remain linked.");
}
for (const item of gameItems) {
  if (!item.name.trim()) errors.push(`Game item ${item.id} is missing a name.`);
  if (item.sourceIds.length === 0) errors.push(`Game item ${item.id} has no provenance.`);
  for (const sourceId of item.sourceIds) {
    if (!sourceIds.has(sourceId)) errors.push(`Game item ${item.id} references unknown source ${sourceId}.`);
  }
}
const sourceDisputedOneTimeLootPathExceptions = [
  {
    pathId: "item-path.disc-4.memoria.kraken-right-tentacle-wing-edge-steal",
    enemyId: "enemy.kraken-right-tentacle",
    slot: "common",
    pathItemId: "game-item.wing-edge",
    normalizedSlotItemId: "game-item.elixir",
    sourceIds: ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary", "opatil-steal-list"],
  },
];
const observedOneTimeLootPathExceptions = new Set<string>();
for (const path of itemAcquisitionPaths) {
  if (!gameItemIds.has(path.itemId)) errors.push(`Item acquisition path ${path.id} references unknown item ${path.itemId}.`);
  if (!areaIds.has(path.chapterId)) errors.push(`Item acquisition path ${path.id} references unknown chapter ${path.chapterId}.`);
  if (!walkthroughChapterIds.has(path.chapterId)) errors.push(`Item acquisition path ${path.id} has no authored walkthrough for ${path.chapterId}.`);
  if (!itemCatalogCoverage.chapterIds.includes(path.chapterId)) errors.push(`Item acquisition path ${path.id} is outside item catalog coverage for ${path.chapterId}.`);
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
  if ((path.method === "steal" || path.method === "drop") && path.availability === "one-time-encounter") {
    const enemy = enemyRecords.find((record) => record.id === path.enemyId);
    const lootSlots = path.method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = lootSlots?.find((entry) => entry.slot === path.enemyLootSlot);
    const encounterIds = path.encounterIds ?? [];
    const linkedEncounters = encounterIds.map((encounterId) => enemyEncounters.find((entry) => entry.id === encounterId));
    if (!enemy || !path.enemyLootSlot || encounterIds.length === 0 || linkedEncounters.some((encounter) =>
      !encounter || !encounter.formation.some((member) => member.enemyId === path.enemyId))) {
      errors.push(`One-time enemy loot path ${path.id} must link a registered enemy, loot slot, and matching encounter formation.`);
    }
    if (!lootSlot) {
      errors.push(`One-time enemy loot path ${path.id} must match a registered ${path.method} slot on ${path.enemyId ?? "an enemy"}.`);
    }
    const declaredConflict = sourceDisputedOneTimeLootPathExceptions.find((entry) => entry.pathId === path.id);
    if (declaredConflict) {
      const conflictIsDocumented = path.method === "steal" &&
        path.enemyId === declaredConflict.enemyId &&
        path.enemyLootSlot === declaredConflict.slot &&
        path.itemId === declaredConflict.pathItemId &&
        lootSlot?.itemId === declaredConflict.normalizedSlotItemId &&
        path.conditions?.toLowerCase().includes("disputed") &&
        path.notes?.toLowerCase().includes("disputed") &&
        lootSlot.note?.includes("Disputed Common-slot claim") &&
        declaredConflict.sourceIds.every((sourceId) => path.sourceIds.includes(sourceId) && lootSlot.sourceIds.includes(sourceId));
      if (!conflictIsDocumented) {
        errors.push(`One-time enemy loot path ${path.id} must preserve its documented source disagreement and conflicting slot evidence.`);
      } else {
        observedOneTimeLootPathExceptions.add(path.id);
      }
    } else if (lootSlot?.itemId !== path.itemId) {
      errors.push(`One-time enemy loot path ${path.id} item does not match its ${path.method} slot ${path.enemyLootSlot}.`);
    }
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
for (const exception of sourceDisputedOneTimeLootPathExceptions) {
  if (!observedOneTimeLootPathExceptions.has(exception.pathId)) {
    errors.push(`The documented one-time enemy loot disagreement ${exception.pathId} is missing from item acquisition coverage.`);
  }
}
const limitedWindowShopPathsWithoutRouteLink = itemAcquisitionPaths.filter((path) =>
  ["shop", "mogshop", "moogle-shop"].includes(path.method) &&
  path.availability === "limited-window" &&
  !(path.walkthroughObjectiveIds ?? []).some((objectiveId) =>
    walkthroughChapters.some((chapter) =>
      chapter.sections.some((section) =>
        section.steps.some((step) => step.objectiveIds?.includes(objectiveId)),
      ),
    ),
  ),
);
if (limitedWindowShopPathsWithoutRouteLink.length) {
  errors.push(`Limited-window shop, Mogshop, and Moogle-shop paths need a walkthrough checkpoint; missing links: ${limitedWindowShopPathsWithoutRouteLink.map((path) => path.id).join(", ")}.`);
}
const aftermathCatalogPaths = [
  ["item-path.disc-3.the-aftermath.elixir-guest-room", "game-item.elixir", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.egoists-armlet-guest-room", "game-item.egoists-armlet", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.remedy-dragons-gate", "game-item.remedy", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.elixir-card-freak-house", "game-item.elixir", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.remedy-card-freak-house", "game-item.remedy", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.lapis-lazuli-michaels-studio", "game-item.lapis-lazuli", "chest", "single-use", "disc-3.the-aftermath.pickups"],
  ["item-path.disc-3.the-aftermath.beautiful-potion-alice", "game-item.beautiful-potion", "quest-reward", "single-use", "disc-3.the-aftermath.potions"],
  ["item-path.disc-3.the-aftermath.strange-potion-michaels-studio", "game-item.strange-potion", "hidden-pickup", "single-use", "disc-3.the-aftermath.potions"],
  ["item-path.disc-3.the-aftermath.unusual-potion-cinna", "game-item.unusual-potion", "quest-reward", "single-use", "disc-3.the-aftermath.potions"],
  ["item-path.disc-3.the-aftermath.ore-studio-recovery-candidate", "game-item.ore", "hidden-pickup", "conditional", "disc-3.the-aftermath.pickups"],
];
for (const [pathId, itemId, method, availability, objectiveId] of aftermathCatalogPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  if (!path || path.itemId !== itemId || path.method !== method || path.availability !== availability || !path.walkthroughObjectiveIds?.includes(objectiveId)) {
    errors.push(`The Aftermath item catalog is missing or misclassifies ${pathId}.`);
  }
}
for (const itemId of ["game-item.beautiful-potion", "game-item.strange-potion", "game-item.unusual-potion"]) {
  if (!gameItems.some((item) => item.id === itemId && item.category === "key-item")) {
    errors.push(`The Aftermath quest inventory needs a key-item record for ${itemId}.`);
  }
}
const aftermathOreRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-aftermath.ore-studio-recovery-candidate");
if (!aftermathOreRecovery?.conditions?.includes("other reviewed Disc III walkthroughs omit") || aftermathOreRecovery.sourceIds.length !== 1 || aftermathOreRecovery.sourceIds[0] !== "gamefaqs-the-aftermath-71891") {
  errors.push("Ore's Disc III studio recovery must remain a conditional, GameFAQs-only candidate rather than a confirmed extra copy.");
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
const atlaDisc2StockObjectiveId = "disc-2.journey-to-cleyra.atla-mogshop-stock";
const atlaDisc2StockObjective = objectives.find((objective) => objective.id === atlaDisc2StockObjectiveId);
if (atlaDisc2Paths.length !== atlaDisc2ShopPrices.size || atlaDisc2ItemIds.size !== atlaDisc2ShopPrices.size) {
  errors.push(`Atla's Disc II Mogshop must have exactly ${atlaDisc2ShopPrices.size} distinct priced product paths; found ${atlaDisc2Paths.length} paths for ${atlaDisc2ItemIds.size} products.`);
}
if (!atlaDisc2StockObjective || !atlaDisc2StockObjective.chapterIds.includes("disc-2.journey-to-cleyra")) {
  errors.push("Atla's Disc II Mogshop stock checkpoint must exist in the pre-Cleyra chapter.");
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
  if (path.availability !== "limited-window" || !path.walkthroughObjectiveIds?.includes(atlaDisc2StockObjectiveId)) {
    errors.push(`Atla's Disc II Mogshop path for ${itemId} must be limited-window and link to its stock checkpoint.`);
  }
  for (const sourceId of ["gamefaqs-shops-71891", "cavesofnarshe-ff9-disc-2-map"]) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Atla's Disc II Mogshop path for ${itemId} must cite ${sourceId}.`);
  }
  if (!path.sourceIds.includes("flactem-disc-2-cleyra")) {
    errors.push(`Atla's Disc II Mogshop path for ${itemId} must cite the optional return route source.`);
  }
  if (itemId === "game-item.mythril-gloves" && !path.sourceIds.includes("gamefaqs-equipment-33383")) {
    errors.push("Atla's Disc II Mythril Gloves path must cite the independent GameFAQs equipment table supporting the 980-Gil price.");
  }
  if (itemId === "game-item.mythril-gloves" && !path.sourceIds.includes("gamefaqs-shop-lists-9772")) {
    errors.push("Atla's Disc II Mythril Gloves path must cite the older GameFAQs shop list supporting the 980-Gil price.");
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
  !atlaDisc2Instruction.detail?.includes("not the accessibility of every Disc I chest room") ||
  !atlaDisc2Instruction.objectiveIds?.includes(atlaDisc2StockObjectiveId)) {
  errors.push("The optional Atla return needs a walkthrough instruction that preserves its Disc II access scope.");
}
console.log(`Atla's Disc II Mogshop: ${atlaDisc2ItemIds.size}/${atlaDisc2ShopPrices.size} sourced stock paths linked to the pre-Cleyra checkpoint.`);
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
  { pathId: "item-path.disc-2.cleyra.antlion-annoyntment-steal", itemId: "game-item.annoyntment", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "common", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.mythril-vest-antlion-steal", itemId: "game-item.mythril-vest", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "uncommon", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.antlion-gold-helm-steal", itemId: "game-item.gold-helm", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "semi-rare", objectiveId: "disc-2.cleyra.antlion-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-phoenix-down-steal", itemId: "game-item.phoenix-down", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "common", objectiveId: "disc-2.cleyra.beatrix-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-thunder-gloves-steal", itemId: "game-item.thunder-gloves", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "uncommon", objectiveId: "disc-2.cleyra.beatrix-steals" },
  { pathId: "item-path.disc-2.cleyra.beatrix-ice-brand-steal", itemId: "game-item.ice-brand", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "semi-rare", objectiveId: "disc-2.cleyra.beatrix-steals" },
];
for (const expected of cleyraBossSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  const enemy = enemyRecords.find((candidate) => candidate.id === expected.enemyId);
  const encounter = enemyEncounters.find((candidate) => candidate.id === expected.encounterId);
  const lootSlot = enemy?.steals.find((candidate) => candidate.slot === expected.slot && candidate.itemId === expected.itemId);
  if (!path || !enemy || !encounter || !lootSlot) {
    errors.push(`Cleyra boss-steal coverage is missing ${expected.pathId}.`);
    continue;
  }
  if (path.itemId !== expected.itemId || path.chapterId !== "disc-2.cleyra" || path.method !== "steal" ||
    path.quantity !== 1 || path.availability !== "one-time-encounter" || path.enemyId !== expected.enemyId ||
    path.enemyLootSlot !== expected.slot || path.encounterIds?.length !== 1 || path.encounterIds[0] !== expected.encounterId ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) || !path.conditions?.includes("each attempt can fail")) {
    errors.push(`Cleyra boss-steal path ${expected.pathId} must match its exact item slot, one-time encounter, failed-attempt semantics, and warning objective.`);
  }
  for (const sourceId of new Set([...encounter.sourceIds, ...lootSlot.sourceIds])) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Cleyra boss-steal path ${expected.pathId} is missing linked slot/encounter source ${sourceId}.`);
  }
  for (const sourceId of ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "cavesofnarshe-enemies"]) {
    if (!path.sourceIds.includes(sourceId)) errors.push(`Cleyra boss-steal path ${expected.pathId} is missing source ${sourceId}.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === expected.itemId &&
    guideAreas.findIndex((area) => area.id === candidate.chapterId) > cleyraChapterIndex)) {
    errors.push(`Cleyra boss-steal item ${expected.itemId} needs a later item-type recovery path.`);
  }
}
const antlionAnnoyntmentDrop = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.antlion-annoyntment-drop");
const antlionRecord = enemyRecords.find((enemy) => enemy.id === "enemy.antlion-cleyra");
const antlionAnnoyntmentSlot = antlionRecord?.drops.find((slot) => slot.slot === "always" && slot.itemId === "game-item.annoyntment");
const antlionEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.cleyra.antlion");
if (!antlionAnnoyntmentDrop || antlionAnnoyntmentDrop.itemId !== "game-item.annoyntment" ||
  antlionAnnoyntmentDrop.chapterId !== "disc-2.cleyra" || antlionAnnoyntmentDrop.method !== "drop" ||
  antlionAnnoyntmentDrop.quantity !== 1 || antlionAnnoyntmentDrop.availability !== "one-time-encounter" ||
  antlionAnnoyntmentDrop.enemyId !== "enemy.antlion-cleyra" || antlionAnnoyntmentDrop.enemyLootSlot !== "always" ||
  antlionAnnoyntmentDrop.encounterIds?.length !== 1 || antlionAnnoyntmentDrop.encounterIds[0] !== "encounter.cleyra.antlion" ||
  !antlionAnnoyntmentDrop.conditions.includes("normal KO") ||
  antlionAnnoyntmentDrop.walkthroughObjectiveIds?.includes("disc-2.cleyra.antlion-steals") ||
  !antlionAnnoyntmentSlot || !antlionEncounter ||
  [...new Set([...antlionAnnoyntmentSlot.sourceIds, ...antlionEncounter.sourceIds])].some((sourceId) => !antlionAnnoyntmentDrop.sourceIds.includes(sourceId)) ||
  !antlionAnnoyntmentDrop.notes?.includes("independent of the Common Annoyntment steal")) {
  errors.push("Antlion's Always Annoyntment drop needs a KO-gated, source-complete path to its exact one-time encounter slot, outside the steal checklist.");
}
const antlionPreparation = antlionRecord?.preparationGuidance;
const antlionPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections.find((section) => section.id === "cleyra-settlement-before-antlion");
const antlionPreparationStep = antlionPreparationSection?.steps.find((step) => step.id === "cleyra-prepare-antlion");
if (!antlionEncounter || antlionEncounter.kind !== "boss" ||
  !antlionEncounter.formation.some((member) => member.enemyId === "enemy.antlion-cleyra" && member.quantity === 1) ||
  !antlionRecord || antlionRecord.kind !== "boss" || antlionRecord.stats.find((stat) => stat.field === "level")?.value !== 16 ||
  !antlionPreparation || antlionPreparation.suggestedLevelRange !== undefined ||
  !antlionPreparation.levelRationale.includes("enemy stat") || !antlionPreparation.levelRationale.includes("party-level target") ||
  !antlionPreparation.difficultyAssessment?.includes("Tough") || !antlionPreparation.difficultyAssessment.includes("subjective single-source") ||
  !antlionPreparation.optionalGrinding.includes("no numeric grind target") ||
  !antlionPreparation.setupAdvice.includes("Counter") || !antlionPreparation.setupAdvice.includes("White Wind") ||
  !antlionPreparation.setupAdvice.includes("Sandstorm") || !antlionPreparation.setupAdvice.includes("Vivi's Ice") ||
  !antlionPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") || !antlionPreparation.sourceIds.includes("kamigame-antlion") ||
  !antlionPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") || !antlionPreparationSection.sourceIds.includes("kamigame-antlion") ||
  !antlionPreparationStep?.detail?.includes("Level 16 is Antlion's enemy stat") ||
  !antlionPreparationStep.detail.includes("Dagger is absent") || !antlionPreparationStep.detail.includes("Tough")) {
  errors.push("Antlion preparation must keep Level 16 as an enemy stat, label the single-source Tough rating, and link the Cleyra route's source-backed recovery and counter advice.");
}
const cleyraBeatrixPreparation = enemyRecords.find((enemy) => enemy.id === "enemy.beatrix-cleyra")?.preparationGuidance;
const cleyraBeatrixPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections.find((section) => section.id === "cleyra-antlion-evacuation");
const cleyraBeatrixPreparationStep = cleyraBeatrixPreparationSection?.steps.find((step) => step.id === "cleyra-beatrix-steals");
if (!cleyraBeatrixPreparation || cleyraBeatrixPreparation.suggestedLevelRange !== undefined ||
  !cleyraBeatrixPreparation.levelRationale.includes("enemy stat") || !cleyraBeatrixPreparation.levelRationale.includes("no normal victory condition") ||
  !cleyraBeatrixPreparation.difficultyAssessment?.includes("Rough") || !cleyraBeatrixPreparation.difficultyAssessment.includes("subjective single-source") ||
  !cleyraBeatrixPreparation.optionalGrinding.includes("neither leveling nor damage creates a normal victory") ||
  !cleyraBeatrixPreparation.setupAdvice.includes("scripted survival") || !cleyraBeatrixPreparation.setupAdvice.includes("Ice Brand") ||
  !cleyraBeatrixPreparation.setupAdvice.includes("Stock Break") ||
  !cleyraBeatrixPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") || !cleyraBeatrixPreparation.sourceIds.includes("jegged-cleyra") ||
  !cleyraBeatrixPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !cleyraBeatrixPreparationStep?.detail?.includes("Level 17 is Beatrix's enemy stat") ||
  !cleyraBeatrixPreparationStep.detail.includes("no reviewed route suggests grinding") ||
  !cleyraBeatrixPreparationStep.detail.includes("not a party target")) {
  errors.push("Cleyra Beatrix preparation must distinguish her Level 17 enemy stat from a party target and preserve the scripted survival, no-grinding, steal, and subjective Rough caveats.");
}
const cleyraAnnoyntmentRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.cleyra-recovery.annoyntment");
if (!cleyraAnnoyntmentRecovery || cleyraAnnoyntmentRecovery.itemId !== "game-item.annoyntment" || cleyraAnnoyntmentRecovery.cost?.amount !== 150) {
  errors.push("Cleyra Annoyntment recovery needs the priced 150-Gil Lindblum Disc II item-shop path.");
}
const cleyraPhoenixDownRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.cleyra-recovery.phoenix-down");
if (!cleyraPhoenixDownRecovery || cleyraPhoenixDownRecovery.itemId !== "game-item.phoenix-down" || cleyraPhoenixDownRecovery.cost?.amount !== 150) {
  errors.push("Cleyra Phoenix Down recovery needs the priced 150-Gil Lindblum Disc II item-shop path.");
}
const cleyraRecoveryCheckpointId = "disc-2.return-to-lindblum.cleyra-recovery-shops";
const cleyraRecoveryObjective = objectivesById.get(cleyraRecoveryCheckpointId);
const cleyraRecoveryWalkthroughChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-lindblum");
const cleyraRecoveryWalkthroughLinked = cleyraRecoveryWalkthroughChapter?.sections.some((section) =>
  section.steps.some((step) => step.objectiveIds?.includes(cleyraRecoveryCheckpointId)),
);
const cleyraLindblumRecoveryExpectations = [
  ["partisan", 1600], ["multina-racket", 750], ["flame-staff", 1100], ["ice-staff", 980],
  ["needle-fork", 3100], ["mythril-gloves", 980], ["mythril-armlet", 500], ["thunder-gloves", 1200],
  ["mages-hat", 600], ["mythril-helm", 1000], ["phoenix-down", 150], ["potion", 50],
  ["eye-drops", 50], ["annoyntment", 150],
] as const;
if (
  !cleyraRecoveryObjective || cleyraRecoveryObjective.chapterIds[0] !== "disc-2.return-to-lindblum" ||
  !cleyraRecoveryObjective.sourceIds.includes("gamefaqs-return-to-lindblum-71891") ||
  !cleyraRecoveryObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  !cleyraRecoveryObjective.sourceIds.includes("gamefaqs-items-71891") || !cleyraRecoveryWalkthroughLinked ||
  cleyraLindblumRecoveryExpectations.some(([slug, price]) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === `item-path.disc-2.return-to-lindblum.cleyra-recovery.${slug}`);
    return !path || path.itemId !== `game-item.${slug}` || path.chapterId !== "disc-2.return-to-lindblum" ||
      path.method !== "shop" || path.availability !== "window-unverified" || path.cost?.amount !== price ||
      !path.walkthroughObjectiveIds?.includes(cleyraRecoveryCheckpointId) ||
      !["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-return-to-lindblum-71891"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
      !path.conditions?.includes("newer-release stock has not been independently verified");
  })
) {
  errors.push("All 14 post-Cleyra Lindblum item-type recoveries must remain source-linked, price-checked, scoped to the PS route, and connected to their walkthrough checkpoint.");
}
const linenCuirassPostCleyraCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.linen-cuirass-disc-ii-candidate");
if (
  !linenCuirassPostCleyraCandidate || linenCuirassPostCleyraCandidate.itemId !== "game-item.linen-cuirass" ||
  linenCuirassPostCleyraCandidate.chapterId !== "disc-2.return-to-lindblum" || linenCuirassPostCleyraCandidate.method !== "shop" ||
  linenCuirassPostCleyraCandidate.availability !== "window-unverified" || linenCuirassPostCleyraCandidate.cost?.amount !== 800 ||
  linenCuirassPostCleyraCandidate.shopId !== "lindblum.weapon-shop.disc-2" ||
  !linenCuirassPostCleyraCandidate.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.cleyra-recovery-shops") ||
  !["gamefaqs-shops-71891", "gamefaqs-items-71891", "gamefaqs-return-to-lindblum-71891"].every((sourceId) => linenCuirassPostCleyraCandidate.sourceIds.includes(sourceId)) ||
  !linenCuirassPostCleyraCandidate.sourceIds.includes("neoseeker-lindblum-shops") ||
  !linenCuirassPostCleyraCandidate.conditions.includes("Neoseeker's indexed Lindblum article lists Linen Cuirass") ||
  !linenCuirassPostCleyraCandidate.conditions.includes("Items table lists Lindblum only before Cleyra") ||
  !linenCuirassPostCleyraCandidate.conditions.includes("window-unverified candidate") ||
  !linenCuirassPostCleyraCandidate.conditions.includes("Newer-release stock is not independently verified")
) {
  errors.push("The post-Cleyra Linen Cuirass Lindblum listing must remain a source-conflict candidate at 800 Gil and link to the displayed-stock checkpoint.");
}
const cleyraGoldHelmRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.cleyra-recovery.gold-helm-treno-shop");
if (!cleyraGoldHelmRecovery || cleyraGoldHelmRecovery.itemId !== "game-item.gold-helm" || cleyraGoldHelmRecovery.chapterId !== "disc-3.card-tournament" || cleyraGoldHelmRecovery.availability !== "repeatable" || cleyraGoldHelmRecovery.cost?.amount !== 1800 || !cleyraGoldHelmRecovery.sourceIds.includes("gamefaqs-shops-71891") || !cleyraGoldHelmRecovery.sourceIds.includes("rpgclassics-shops") || !cleyraGoldHelmRecovery.conditions.includes("newer releases")) {
  errors.push("Cleyra Gold Helm recovery needs a source-backed, repeatable Disc III Treno path priced at 1,800 Gil with its release caveat preserved.");
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
    !path.walkthroughObjectiveIds?.includes("disc-2.cleyra.stiltzkin-2") ||
    !path.sourceIds.includes("elitegrindlab-stiltzkin-bundles") ||
    !path.conditions?.includes("Inn is the source-supported safe stop") ||
    !path.conditions.includes("Sandpit");
})) {
  errors.push("Cleyra's Stiltzkin #2 bundle must catalog its Hi-Potion, Ether, and Phoenix Pinion paths at a shared 444-Gil price and checkpoint.");
}
if (
  !cleyraStiltzkinWarning?.sourceIds.includes("elitegrindlab-stiltzkin-bundles") ||
  !cleyraStiltzkinWarning.note?.includes("declared in both the Inn and Sandpit field scripts") ||
  !cleyraStiltzkinWarning.action.includes("check the Sandpit") ||
  !cleyraStiltzkinWarning.recovery?.includes("without counting it as a guaranteed recovery") ||
  !cleyraStiltzkinWarning.classification.includes("permanently-missable")
) {
  errors.push("Cleyra's Stiltzkin warning must preserve the Inn safe checkpoint, conditional Sandpit follow-up, unresolved active-room state, and dedicated bundle source.");
}
const hilgigarsChapterIndex = guideAreas.findIndex((area) => area.id === "disc-2.conde-petie-mountain-path");
const hilgigarsSteals = [
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-phoenix-down-steal", itemId: "game-item.phoenix-down", slot: "common" },
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-mythril-fork-steal", itemId: "game-item.mythril-fork", slot: "uncommon" },
  { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal", itemId: "game-item.fairy-flute", slot: "rare" },
];
const hilgigarsLootEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.hilgigars");
const hilgigarsLootEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.conde-petie-mountain-path.hilgigars");
const hilgigarsMappedStealPaths = itemAcquisitionPaths.filter((path) => path.chapterId === "disc-2.conde-petie-mountain-path" &&
  path.enemyId === "enemy.hilgigars" && path.method === "steal");
for (const expected of hilgigarsSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  const lootSlot = hilgigarsLootEnemy?.steals.find((steal) => steal.itemId === expected.itemId && steal.slot === expected.slot);
  if (!path) {
    errors.push(`Hilgigars steal coverage is missing ${expected.pathId}.`);
    continue;
  }
  const expectedSourceIds = new Set([
    ...(hilgigarsLootEnemy?.sourceIds ?? []),
    ...(hilgigarsLootEncounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ]);
  if (!lootSlot || path.itemId !== expected.itemId || path.chapterId !== "disc-2.conde-petie-mountain-path" || path.method !== "steal" ||
    path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.hilgigars" || path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.conde-petie-mountain-path.hilgigars"]) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
    !path.walkthroughObjectiveIds?.includes("disc-2.conde-petie-mountain-path.hilgigars-steals") ||
    [...expectedSourceIds].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId)) ||
    (expected.itemId === "game-item.fairy-flute" && !path.notes?.includes("GameFAQs places Fairy Flute in the Rare steal slot; Jegged and Gamer Guides call it Very Rare"))) {
    errors.push(`Hilgigars steal path ${expected.pathId} must match its exact loot slot, one-time encounter, chance, warning objective, and source provenance.`);
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
    enemyId: "enemy.ralvurahva",
    encounterId: "encounter.gargan-roo.ralvurahva",
    items: [
      { itemId: "game-item.bone-wrist", pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-bone-wrist-steal", name: "Bone Wrist", slot: "common" },
      { itemId: "game-item.mythril-fork", pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-mythril-fork-steal", name: "Mythril Fork", slot: "uncommon" },
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
    if (stealPath && expected.enemyId && expected.encounterId) {
      const enemy = enemyRecords.find((record) => record.id === expected.enemyId);
      const encounter = enemyEncounters.find((record) => record.id === expected.encounterId);
      const lootSlot = enemy?.steals.find((slot) => slot.itemId === item.itemId && slot.slot === item.slot);
      const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
      if (stealPath.enemyId !== expected.enemyId || stealPath.enemyLootSlot !== item.slot ||
        JSON.stringify(stealPath.encounterIds) !== JSON.stringify([expected.encounterId]) ||
        !stealPath.conditions?.includes("chance-based") || !stealPath.conditions.includes("can fail") ||
        !lootSlot || [...requiredSources].some((sourceId) => !stealPath.sourceIds.includes(sourceId))) {
        errors.push(`${expected.missableId} ${item.name} path must match its exact ${item.slot} steal slot, one-time encounter, chance-based outcome, and source provenance.`);
      }
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
const prisonCageViviEncounterId = "encounter.evil-forest.prison-cage-vivi";
const prisonCageViviEncounter = enemyEncounters.find((encounter) => encounter.id === prisonCageViviEncounterId);
const prisonCageStealObjectiveId = "disc-1.evil-forest.prison-cage-steals";
const prisonCageStealObjective = objectivesById.get(prisonCageStealObjectiveId);
const prisonCageStealExpectations = [
  { itemId: "game-item.broadsword", slot: "common", pathId: "item-path.disc-1.evil-forest.prison-cage-broadsword-steal", rateNote: "70% per connected steal attempt", tableRateNote: "100%" },
  { itemId: "game-item.leather-wrist", slot: "uncommon", pathId: "item-path.disc-1.evil-forest.leather-wrist-prison-cage-steal", rateNote: "23% per connected steal attempt", tableRateNote: "25%" },
];
for (const expected of prisonCageStealExpectations) {
  const slot = broadswordEnemy?.steals.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.pathId);
  const item = gameItems.find((entry) => entry.id === expected.itemId);
  const expectedSources = new Set([
    ...(broadswordEnemy?.sourceIds ?? []),
    ...(prisonCageViviEncounter?.sourceIds ?? []),
    ...(slot?.sourceIds ?? []),
  ]);
  if (!slot || !path || path.itemId !== expected.itemId || path.method !== "steal" ||
    path.availability !== "one-time-encounter" || path.quantity !== 1 ||
    path.enemyId !== "enemy.prison-cage-vivi" || path.enemyLootSlot !== expected.slot ||
    !path.encounterIds?.includes(prisonCageViviEncounterId) ||
    !path.walkthroughObjectiveIds?.includes(prisonCageStealObjectiveId) ||
    !path.conditions.includes("chance-based") || !path.conditions.includes("can fail") ||
    [...expectedSources].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    [...expectedSources].some((sourceId) => !item?.sourceIds.includes(sourceId)) ||
    [...expectedSources].some((sourceId) => !prisonCageStealObjective?.sourceIds.includes(sourceId)) ||
    [...expectedSources].some((sourceId) => !broadswordWarning?.sourceIds.includes(sourceId)) ||
    !path.notes?.includes(expected.rateNote) || !path.notes.includes(expected.tableRateNote) ||
    !path.notes.includes("not reconciled")) {
    errors.push(`Prison Cage (Vivi) ${expected.slot} ${expected.itemId} steal must link its chance-based one-time slot, encounter, checklist, and provenance while preserving source-specific rates.`);
  }
}
if (!prisonCageViviEncounter || !prisonCageViviEncounter.objectiveIds.includes(prisonCageStealObjectiveId) ||
  !prisonCageViviEncounter.missableIds.includes("missable.disc-1.evil-forest.prison-cage-steals") ||
  !broadswordEnemy?.notes.some((note) => note.includes("70%/23% per connected attempt") && note.includes("100%/25%")) ||
  !broadswordWarning?.note.includes("70%/23% per connected steal attempt") ||
  !broadswordWarning.note.includes("100%/25%")) {
  errors.push("Prison Cage (Vivi) must retain the one-time warning and source-specific steal-rate disagreement.");
}
if (!broadswordWarning?.classification.includes("recoverable-later") || !broadswordWarning.recovery.includes("Dali") || !broadswordWarning.recovery.includes("Ipsen")) {
  errors.push("The Prison Cage steal warning must distinguish the one-time steal from Broadsword's Dali and Ipsen recovery routes.");
}
const prisonCageGarnet = enemyRecords.find((enemy) => enemy.id === "enemy.prison-cage-garnet");
const prisonCageGarnetPreparation = prisonCageGarnet?.preparationGuidance;
const prisonCageViviPreparation = broadswordEnemy?.preparationGuidance;
const prisonCageRouteSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.evil-forest")?.sections.find((section) => section.id === "crash-site-and-prison-cages");
const prisonCageGarnetStep = prisonCageRouteSection?.steps.find((step) => step.id === "prison-cage-garnet");
const prisonCageViviStep = prisonCageRouteSection?.steps.find((step) => step.id === "prison-cage-vivi");
if (!prisonCageGarnetPreparation || prisonCageGarnetPreparation.suggestedLevelRange !== undefined ||
  !prisonCageGarnetPreparation.levelRationale.includes("Level 2") ||
  !prisonCageGarnetPreparation.optionalGrinding.includes("do not recommend grinding") ||
  !prisonCageGarnetPreparation.setupAdvice.includes("Free Energy") || !prisonCageGarnetPreparation.setupAdvice.includes("Tidal Flame") ||
  !prisonCageGarnetPreparation.setupAdvice.includes("After two Absorb attacks") ||
  !prisonCageGarnetPreparation.sourceIds.includes("gamefaqs-evil-forest-71891") ||
  !prisonCageViviPreparation || prisonCageViviPreparation.suggestedLevelRange !== undefined ||
  !prisonCageViviPreparation.levelRationale.includes("Level 2") ||
  !prisonCageViviPreparation.setupAdvice.includes("no pause to prepare") ||
  !prisonCageViviPreparation.setupAdvice.includes("Broadsword and Uncommon Leather Wrist") ||
  !prisonCageViviPreparation.setupAdvice.includes("Potion after two Absorb") ||
  !prisonCageGarnetStep?.detail.includes("no party-level target") ||
  !prisonCageViviStep?.text.includes("no preparation pause") ||
  !prisonCageViviStep?.detail.includes("GameFAQs reports 533 HP")) {
  errors.push("Prison Cage preparation must keep captive survival, back-to-back timing, the Level 2 enemy stat, and the Vivi-form steal/HP disputes linked to both rescue steps.");
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
const sealionEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.sealion");
const sealionPreparation = sealionEnemy?.preparationGuidance;
const sealionLevelRange = sealionPreparation?.suggestedLevelRange;
const iceMoisAndMognetSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.ice-cavern")
  ?.sections.find((section) => section.id === "mois-and-mognet");
const iceWaterfallPreparationStep = iceMoisAndMognetSection?.steps.find((step) => step.id === "ice-waterfall-path");
if (!sealionPreparation || !sealionLevelRange || sealionLevelRange.min !== 4 || sealionLevelRange.max !== 5 ||
  !sealionPreparation.levelRationale.includes("do not establish a universal minimum") ||
  !sealionPreparation.sourceIds.includes("gamefaqs-ice-cavern-79143") ||
  !sealionPreparation.sourceIds.includes("kamigame-ice-cavern-boss") ||
  !iceWaterfallPreparationStep?.detail?.includes("Lv. 4–5") ||
  !iceMoisAndMognetSection?.sourceIds.includes("kamigame-ice-cavern-boss")) {
  errors.push("Sealion preparation must retain the optional Zidane Lv. 4–5 source comparison in both bestiary and pre-boss route guidance.");
}
const iceCavernBossSteals = [
  { enemyId: "enemy.black-waltz-1", itemId: "game-item.remedy", slot: "common", pathId: "item-path.disc-1.ice-cavern.black-waltz-1-remedy-steal" },
  { enemyId: "enemy.black-waltz-1", itemId: "game-item.silk-shirt", slot: "uncommon", pathId: "item-path.disc-1.ice-cavern.black-waltz-1-silk-shirt-steal" },
  { enemyId: "enemy.sealion", itemId: "game-item.ether", slot: "common", pathId: "item-path.disc-1.ice-cavern.sealion-ether-steal" },
  { enemyId: "enemy.sealion", itemId: "game-item.mythril-dagger", slot: "uncommon", pathId: "item-path.disc-1.ice-cavern.sealion-mythril-dagger-steal" },
];
for (const expected of iceCavernBossSteals) {
  const enemy = enemyRecords.find((candidate) => candidate.id === expected.enemyId);
  const slot = enemy?.steals.find((candidate) => candidate.slot === expected.slot && candidate.itemId === expected.itemId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!slot ||
    !enemy?.routeObjectiveIds.includes("disc-1.ice-cavern.boss-steals") ||
    !enemy?.missableIds.includes("missable.disc-1.ice-cavern.boss-steals")) {
    errors.push(`Ice Cavern boss dossier ${expected.enemyId} must connect its ${expected.itemId} steal to the shared one-time warning.`);
  }
  if (!path || path.itemId !== expected.itemId || path.availability !== "one-time-encounter" ||
    path.enemyId !== expected.enemyId || path.enemyLootSlot !== expected.slot ||
    !path.encounterIds?.includes("encounter.ice-cavern.black-waltz-1-sealion") ||
    !path.walkthroughObjectiveIds?.includes("disc-1.ice-cavern.boss-steals") ||
    !path.conditions?.includes("chance-based") ||
    slot?.sourceIds.some((sourceId) => !path.sourceIds.includes(sourceId))) {
    errors.push(`Ice Cavern boss steal ${expected.itemId} must link its exact enemy slot, one-time encounter, chance-based attempt, and source provenance.`);
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
const observatoryPickupSources = ["gamefaqs-optional-route-47344", "gamefaqs-dali-71891", "jegged-ice-cavern", "gamerguides-dali"];
const observatoryPickupObjectiveId = "disc-1.ice-cavern.observatory-pickups";
const observatoryPickupPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.ice-cavern.observatory-hidden-hi-potion");
const observatoryPickupItem = gameItems.find((item) => item.id === "game-item.hi-potion");
const observatoryPickupObjective = objectivesById.get(observatoryPickupObjectiveId);
if (!observatoryPickupPath || observatoryPickupPath.itemId !== "game-item.hi-potion" ||
  observatoryPickupPath.chapterId !== "disc-1.ice-cavern" || observatoryPickupPath.method !== "hidden-pickup" ||
  observatoryPickupPath.quantity !== 1 || observatoryPickupPath.availability !== "single-use" ||
  !observatoryPickupPath.conditions?.includes("by the entrance cart") ||
  !observatoryPickupPath.conditions.includes("later switches to Steiner") ||
  !observatoryPickupPath.notes?.includes("exact in-game presentation is unresolved") ||
  !observatoryPickupPath.walkthroughObjectiveIds?.includes(observatoryPickupObjectiveId) ||
  !observatoryPickupItem || observatoryPickupSources.some((sourceId) =>
    !observatoryPickupPath.sourceIds.includes(sourceId) || !observatoryPickupItem.sourceIds.includes(sourceId)) ||
  !observatoryPickupObjective || observatoryPickupSources.some((sourceId) => !observatoryPickupObjective.sourceIds.includes(sourceId))) {
  errors.push("Observatory Mountain's Hi-Potion must have a source-backed single-use hidden-pickup path linked to the collection objective and later Steiner recheck.");
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
  !blackWaltz2Encounter.objectiveIds.includes("disc-1.village-of-dali.black-waltz-2-ether-drop") ||
  !blackWaltz2Encounter.missableIds.includes("missable.disc-1.village-of-dali.black-waltz-2-steals") ||
  !blackWaltz2Encounter.cutoffIds.includes("cutoff.dali.black-waltz-2-steals") ||
  !blackWaltz2Encounter.notes.some((note) => note.includes("Observatory Mountain") && note.includes("cargo-ship"))) {
  errors.push("Black Waltz 2 must be a separate fixed boss encounter linked to its steal warning/cutoff and documented location conflict.");
}
const blackWaltz2StealRequiredSources = ["gamefaqs-dali-71891", "gamefaqs-dali-79143", "jegged-dali", "cavesofnarshe-dali-enemies", "elitegrindlab-dali", "opatil-steal-list"];
const blackWaltz2StealObjectiveId = "disc-1.village-of-dali.black-waltz-2-steals";
const blackWaltz2StealObjective = objectivesById.get(blackWaltz2StealObjectiveId);
const blackWaltz2StealWarning = missablesById.get("missable.disc-1.village-of-dali.black-waltz-2-steals");
const blackWaltz2StealExpectations = [
  { itemId: "game-item.steepled-hat", slot: "common", pathId: "item-path.disc-1.village-of-dali.steepled-hat-black-waltz-2-steal" },
  { itemId: "game-item.leather-plate", slot: "uncommon", pathId: "item-path.disc-1.village-of-dali.leather-plate-black-waltz-2-steal" },
];
for (const expected of blackWaltz2StealExpectations) {
  const slot = blackWaltz2Record?.steals.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  const item = gameItems.find((candidate) => candidate.id === expected.itemId);
  const requiredSourcesPresent = blackWaltz2StealRequiredSources.every((sourceId) =>
    slot?.sourceIds.includes(sourceId) && path?.sourceIds.includes(sourceId) && item?.sourceIds.includes(sourceId) &&
    blackWaltz2StealObjective?.sourceIds.includes(sourceId) && blackWaltz2StealWarning?.sourceIds.includes(sourceId));
  if (!slot || !blackWaltz2Record?.routeObjectiveIds.includes(blackWaltz2StealObjectiveId) || !path ||
    path.method !== "steal" || path.availability !== "one-time-encounter" || path.enemyId !== "enemy.black-waltz-2" ||
    path.enemyLootSlot !== expected.slot || !path.encounterIds?.includes("encounter.dali.black-waltz-2") ||
    !path.walkthroughObjectiveIds?.includes(blackWaltz2StealObjectiveId) || !path.conditions?.includes("chance-based") ||
    !requiredSourcesPresent) {
    errors.push(`Black Waltz 2's ${expected.itemId} must link its exact ${expected.slot} slot, one-time encounter, objective, and source provenance to its item path.`);
  }
}
if (!blackWaltz2Record?.notes.some((note) => note.includes("Jegged reports 70%/23% per connected steal attempt") && note.includes("EliteGrindLab and Opa-Til report 100%/25%")) ||
  !blackWaltz2StealWarning?.note.includes("Jegged reports 70%/23% per connected steal attempt") ||
  !blackWaltz2StealWarning.note.includes("EliteGrindLab and Opa-Til list 100%/25%")) {
  errors.push("Black Waltz 2's conflicting steal-rate reports must remain source-specific in its enemy profile and warning.");
}
if (blackWaltz2Record?.stats.find((stat) => stat.field === "HP")?.value !== 1030 ||
  blackWaltz2Record.drops.length !== 4 || blackWaltz2Record.drops.some((slot) => slot.itemId !== "game-item.ether") ||
  !blackWaltz2Record.notes.some((note) => note.includes("one guaranteed slot plus up to three conditional additional copies")) ||
  !blackWaltz2Record.routeObjectiveIds.includes("disc-1.village-of-dali.black-waltz-2-ether-drop") ||
  !blackWaltz2Record.facts.some((fact) => fact.category === "status-vulnerability" && fact.label === "Mini" && fact.sourceIds.includes("ffwiki-black-waltz-2"))) {
  errors.push("Black Waltz 2 must preserve its cross-checked HP, four Ether drop slots, and sourced Mini-status conflict.");
}
const blackWaltz2EtherObjectiveId = "disc-1.village-of-dali.black-waltz-2-ether-drop";
const blackWaltz2EtherObjective = objectivesById.get(blackWaltz2EtherObjectiveId);
const blackWaltz2EtherItem = gameItems.find((item) => item.id === "game-item.ether");
const blackWaltz2EtherPaths: [string, string, string[]][] = [
  ["always", "item-path.disc-1.village-of-dali.black-waltz-2-ether-always-drop", ["gamefaqs-dali-71891", "jegged-dali", "cavesofnarshe-dali-enemies"]],
  ["common", "item-path.disc-1.village-of-dali.black-waltz-2-ether-common-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
  ["uncommon", "item-path.disc-1.village-of-dali.black-waltz-2-ether-uncommon-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
  ["rare", "item-path.disc-1.village-of-dali.black-waltz-2-ether-rare-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
];
if (!blackWaltz2EtherObjective || !blackWaltz2Encounter?.objectiveIds.includes(blackWaltz2EtherObjectiveId) ||
  !blackWaltz2Record?.routeObjectiveIds.includes(blackWaltz2EtherObjectiveId) ||
  blackWaltz2EtherPaths.some(([slot, pathId, sourceIds]) => {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const dropSlot = blackWaltz2Record?.drops.find((drop) => drop.slot === slot && drop.itemId === "game-item.ether");
    const requiredProvenance = new Set([...(blackWaltz2Record?.sourceIds ?? []), ...(blackWaltz2Encounter?.sourceIds ?? []), ...(dropSlot?.sourceIds ?? [])]);
    return !blackWaltz2Record?.drops.some((drop) => drop.slot === slot && drop.itemId === "game-item.ether") ||
      !path || path.itemId !== "game-item.ether" || path.chapterId !== "disc-1.village-of-dali" ||
      path.method !== "drop" || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
      path.enemyId !== "enemy.black-waltz-2" || path.enemyLootSlot !== slot ||
      JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.dali.black-waltz-2"]) ||
      !path.walkthroughObjectiveIds?.includes(blackWaltz2EtherObjectiveId) ||
      (slot === "always" ? !path.conditions?.includes("guaranteed") : !path.conditions?.includes("chance-based")) ||
      [...requiredProvenance].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
      sourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) || !blackWaltz2EtherObjective.sourceIds.includes(sourceId) || !blackWaltz2EtherItem?.sourceIds.includes(sourceId));
  })) {
  errors.push("Black Waltz 2's guaranteed and conditional Ether drop slots must have source-linked paths and a separate collection objective.");
}
const plantBrainDropsObjectiveId = "disc-1.evil-forest.plant-brain-drops";
const plantBrainDropsObjective = objectivesById.get(plantBrainDropsObjectiveId);
const plantBrainDropSourceIds = ["gamefaqs-evil-forest-71891", "gamefaqs-enemy-list-71891", "jegged-evil-forest"];
const plantBrainDropsEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.evil-forest.plant-brain");
const plantBrainDropsRecord = enemyRecords.find((enemy) => enemy.id === "enemy.plant-brain");
const plantBrainDropPathIds = [
  "item-path.disc-1.evil-forest.plant-brain-phoenix-down-always-drop",
  "item-path.disc-1.evil-forest.plant-brain-potion-common-drop",
  "item-path.disc-1.evil-forest.plant-brain-potion-uncommon-drop",
  "item-path.disc-1.evil-forest.plant-brain-potion-rare-drop",
];
const plantBrainDropItemIds = ["game-item.phoenix-down", "game-item.potion", "game-item.potion", "game-item.potion"];
if (!plantBrainDropsObjective || !plantBrainDropsEncounter?.objectiveIds.includes(plantBrainDropsObjectiveId) ||
  !plantBrainDropsRecord?.routeObjectiveIds.includes(plantBrainDropsObjectiveId) ||
  plantBrainDropPathIds.some((pathId, index) => {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === plantBrainDropItemIds[index]);
    const lootSlot = plantBrainDropsRecord?.drops[index];
    const requiredProvenance = new Set([...(plantBrainDropsRecord?.sourceIds ?? []), ...(plantBrainDropsEncounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
    return !path || !plantBrainDropsRecord?.drops[index] ||
      plantBrainDropsRecord.drops[index].itemId !== plantBrainDropItemIds[index] || path.itemId !== plantBrainDropItemIds[index] ||
      path.chapterId !== "disc-1.evil-forest" || path.method !== "drop" || path.quantity !== 1 ||
      path.availability !== "one-time-encounter" || !path.walkthroughObjectiveIds?.includes(plantBrainDropsObjectiveId) ||
      path.enemyId !== "enemy.plant-brain" || path.enemyLootSlot !== lootSlot?.slot ||
      JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.evil-forest.plant-brain"]) ||
      (index === 0 ? !path.conditions?.includes("guaranteed") : !path.conditions?.includes("chance-based")) ||
      (index > 0 && !path.conditions?.includes("KO victory")) ||
      [...requiredProvenance].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
      !item || plantBrainDropSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
        !plantBrainDropsObjective.sourceIds.includes(sourceId) || !item.sourceIds.includes(sourceId));
  }) ||
  !plantBrainDropsRecord?.notes.some((note) => note.includes("37.5%, 12.5%, and 0.4%") && note.includes("different rarity labels"))) {
  errors.push("Plant Brain's guaranteed Phoenix Down and three conditional Potion drop slots must have sourced paths and a dedicated objective preserving the rarity-label conflict.");
}
const plantBrainStealsObjectiveId = "disc-1.evil-forest.plant-brain-steals";
const plantBrainStealsObjective = objectivesById.get(plantBrainStealsObjectiveId);
const plantBrainStealsWarning = missablesById.get("missable.disc-1.evil-forest.plant-brain-steals");
const plantBrainStealsEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.evil-forest.plant-brain");
const plantBrainStealsRecord = enemyRecords.find((enemy) => enemy.id === "enemy.plant-brain");
const plantBrainStealExpectations = [
  {
    slot: "common",
    itemId: "game-item.eye-drops",
    pathId: "item-path.disc-1.evil-forest.plant-brain-eye-drops-common-steal",
    sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest", "gamerguides-evil-forest"],
  },
  {
    slot: "uncommon",
    itemId: "game-item.iron-helm",
    pathId: "item-path.disc-1.evil-forest.iron-helm-plant-brain-steal",
    sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "gamefaqs-evil-forest-79143", "gamerguides-evil-forest"],
  },
];
if (!plantBrainStealsObjective || !plantBrainStealsWarning || plantBrainStealsWarning.objectiveId !== plantBrainStealsObjectiveId ||
  !plantBrainStealsEncounter?.objectiveIds.includes(plantBrainStealsObjectiveId) ||
  !plantBrainStealsRecord?.routeObjectiveIds.includes(plantBrainStealsObjectiveId) ||
  itemAcquisitionPaths.filter((path) => path.enemyId === "enemy.plant-brain" && path.method === "steal").length !== plantBrainStealExpectations.length ||
  plantBrainStealExpectations.some(({ slot, itemId, pathId, sourceIds }) => {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const enemySlot = plantBrainStealsRecord?.steals.find((entry) => entry.slot === slot && entry.itemId === itemId);
    return !path || !item || !enemySlot || path.itemId !== itemId || path.chapterId !== "disc-1.evil-forest" ||
      path.method !== "steal" || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
      path.enemyId !== "enemy.plant-brain" || path.enemyLootSlot !== slot ||
      JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.evil-forest.plant-brain"]) ||
      !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
      !path.walkthroughObjectiveIds?.includes(plantBrainStealsObjectiveId) ||
      plantBrainStealsEncounter.sourceIds.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
      sourceIds.some((sourceId) => !enemySlot.sourceIds.includes(sourceId) || !path.sourceIds.includes(sourceId) ||
        !item.sourceIds.includes(sourceId) || !plantBrainStealsObjective.sourceIds.includes(sourceId) ||
        !plantBrainStealsWarning.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId));
  }) ||
  !plantBrainStealsRecord?.notes.some((note) => note.includes("GameFAQs and Gamer Guides label Plant Brain's Iron Helm steal Uncommon") && note.includes("Jegged labels it Rare and reports 6% per connected attempt")) ||
  !plantBrainStealsWarning.note?.includes("GameFAQs and Gamer Guides label the Iron Helm steal Uncommon") ||
  !plantBrainStealsWarning.note.includes("Jegged labels it Rare and reports 6% per connected attempt")) {
  errors.push("Plant Brain's Eye Drops and Iron Helm steals must link to their exact chance-based slots, encounter, objective, warning, and sources while preserving the Uncommon/Rare conflict.");
}
const earlyBossDropExpectations = [
  {
    chapterId: "disc-1.ice-cavern",
    objectiveId: "disc-1.ice-cavern.boss-drops",
    encounterId: "encounter.ice-cavern.black-waltz-1-sealion",
    stepId: "ice-boss-guaranteed-drops",
    sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"],
    entries: [
      ["enemy.black-waltz-1", "game-item.hi-potion", "item-path.disc-1.ice-cavern.black-waltz-1-hi-potion-always-drop", "always"],
      ["enemy.sealion", "game-item.phoenix-down", "item-path.disc-1.ice-cavern.sealion-phoenix-down-always-drop", "always"],
    ],
  },
  {
    chapterId: "disc-1.journey-to-burmecia",
    objectiveId: "disc-1.journey-to-burmecia.gizamaluke-drops",
    encounterId: "encounter.gizamaluke-grotto.gizamaluke",
    stepId: "journey-gizamaluke-guaranteed-drop",
    sourceIds: ["cavesofnarshe-gizamaluke", "ffonline-gizamaluke-boss", "jegged-gizamaluke"],
    entries: [
      ["enemy.gizamaluke", "game-item.tent", "item-path.disc-1.journey-to-burmecia.gizamaluke-tent-always-drop", "always"],
    ],
  },
];
for (const expectation of earlyBossDropExpectations) {
  const objective = objectivesById.get(expectation.objectiveId);
  const encounter = enemyEncounters.find((entry) => entry.id === expectation.encounterId);
  const step = walkthroughChapters.find((chapter) => chapter.areaId === expectation.chapterId)?.sections
    .flatMap((section) => section.steps).find((entry) => entry.id === expectation.stepId);
  if (!objective || !encounter?.objectiveIds.includes(expectation.objectiveId) ||
    !step?.objectiveIds.includes(expectation.objectiveId) ||
    expectation.entries.some(([enemyId, itemId, pathId, slotName]) => {
      const enemy = enemyRecords.find((entry) => entry.id === enemyId);
      const lootSlot = enemy?.drops.find((slot) => slot.slot === slotName && slot.itemId === itemId);
      const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
      const item = gameItems.find((entry) => entry.id === itemId);
      return !enemy?.routeObjectiveIds.includes(expectation.objectiveId) ||
        !lootSlot ||
        !path || path.itemId !== itemId || path.chapterId !== expectation.chapterId || path.method !== "drop" ||
        path.quantity !== 1 || path.availability !== "one-time-encounter" ||
        path.enemyId !== enemyId || path.enemyLootSlot !== slotName ||
        !path.encounterIds?.includes(expectation.encounterId) ||
        !path.conditions?.includes("guaranteed") || !path.walkthroughObjectiveIds?.includes(expectation.objectiveId) ||
        lootSlot?.sourceIds.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
        !item || expectation.sourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
          !item.sourceIds.includes(sourceId) || !objective.sourceIds.includes(sourceId));
    })) {
    errors.push(`Guaranteed item drop paths, encounter links, and collection objective for ${expectation.chapterId} must stay source-linked.`);
  }
}
const iceCavernRegularLootExpectations = [
  ["enemy.cave-imp", "steal", "common", "game-item.potion", "cave-imp-potion-common-steal"],
  ["enemy.cave-imp", "steal", "uncommon", "game-item.phoenix-down", "cave-imp-phoenix-down-uncommon-steal"],
  ["enemy.cave-imp", "drop", "common", "game-item.ore", "cave-imp-ore-common-drop"],
  ["enemy.cave-imp", "drop", "uncommon", "game-item.phoenix-down", "cave-imp-phoenix-down-uncommon-drop"],
  ["enemy.cave-imp", "drop", "rare", "game-item.tent", "cave-imp-tent-rare-drop"],
  ["enemy.flan-ice-cavern", "steal", "common", "game-item.potion", "flan-potion-common-steal"],
  ["enemy.flan-ice-cavern", "steal", "uncommon", "game-item.ore", "flan-ore-uncommon-steal"],
  ["enemy.flan-ice-cavern", "drop", "common", "game-item.potion", "flan-potion-common-drop"],
  ["enemy.flan-ice-cavern", "drop", "uncommon", "game-item.phoenix-down", "flan-phoenix-down-uncommon-drop"],
  ["enemy.wyerd", "steal", "common", "game-item.potion", "wyerd-potion-common-steal"],
  ["enemy.wyerd", "steal", "uncommon", "game-item.tent", "wyerd-tent-uncommon-steal"],
  ["enemy.wyerd", "steal", "semi-rare", "game-item.phoenix-down", "wyerd-phoenix-down-semi-rare-steal"],
  ["enemy.wyerd", "drop", "common", "game-item.potion", "wyerd-potion-common-drop"],
  ["enemy.wyerd", "drop", "uncommon", "game-item.ether", "wyerd-ether-uncommon-drop"],
];
const iceCavernLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
const iceCavernMistJetEncounterId = "encounter.ice-cavern.mist-jet-pool";
const iceCavernMistJetEncounter = enemyEncounters.find((entry) => entry.id === iceCavernMistJetEncounterId);
const iceCavernLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.ice-cavern")?.sections
  .find((section) => section.id === "ice-cavern-lower-path");
const iceCavernMistJetStep = iceCavernLootSection?.steps.find((step) => step.id === "ice-mist-jets");
if (!iceCavernMistJetEncounter || !["enemy.cave-imp", "enemy.flan-ice-cavern", "enemy.wyerd"].every((enemyId) =>
  iceCavernMistJetEncounter.formation.some((entry) => entry.enemyId === enemyId)) ||
  !iceCavernMistJetStep?.detail?.includes("drops require a KO") ||
  !iceCavernLootSection?.sourceIds.includes("gamefaqs-enemy-list-71891")) {
  errors.push("Ice Cavern mist-jet loot routes must remain linked to the documented Cave Imp, Flan, and Wyerd encounter pool and KO-drop guidance.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of iceCavernRegularLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.ice-cavern.${pathSuffix}`);
  if (!lootSlot ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.ice-cavern" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || path.enemyId !== enemyId || path.enemyLootSlot !== slotName ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([iceCavernMistJetEncounterId]) ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("not guaranteed"))) ||
    (method === "drop" && (!path.conditions?.includes("normal KO defeat") || !path.conditions.includes("chance-based") || !path.conditions.includes("conditional"))) ||
    iceCavernLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) || !enemy?.sourceIds.includes(sourceId) ||
      !iceCavernMistJetEncounter?.sourceIds.includes(sourceId) ||
      (sourceId === "gamefaqs-enemy-list-71891" && !lootSlot.sourceIds.includes(sourceId)))) {
    errors.push(`Ice Cavern ${method} path ${pathSuffix} must match its exact enemy, loot slot, mist-jet encounter, repeatable chance conditions, and complete provenance.`);
  }
}
const nolrichHeightsRegularLootExpectations = [
  ["enemy.carve-spider", "steal", "common", "game-item.potion", "carve-spider-potion-common-steal"],
  ["enemy.carve-spider", "steal", "uncommon", "game-item.tent", "carve-spider-tent-uncommon-steal"],
  ["enemy.carve-spider", "steal", "semi-rare", "game-item.ore", "carve-spider-ore-semi-rare-steal"],
  ["enemy.carve-spider", "drop", "common", "game-item.ore", "carve-spider-ore-common-drop"],
  ["enemy.carve-spider", "drop", "uncommon", "game-item.eye-drops", "carve-spider-eye-drops-uncommon-drop"],
  ["enemy.carve-spider", "drop", "rare", "game-item.phoenix-down", "carve-spider-phoenix-down-rare-drop"],
  ["enemy.mu", "steal", "uncommon", "game-item.potion", "mu-potion-uncommon-steal"],
  ["enemy.mu", "drop", "common", "game-item.potion", "mu-potion-common-drop"],
  ["enemy.mu", "drop", "uncommon", "game-item.echo-screen", "mu-echo-screen-uncommon-drop"],
  ["enemy.mu", "drop", "rare", "game-item.phoenix-down", "mu-phoenix-down-rare-drop"],
  ["enemy.python", "steal", "common", "game-item.potion", "python-potion-common-steal"],
  ["enemy.python", "steal", "uncommon", "game-item.ore", "python-ore-uncommon-steal"],
  ["enemy.python", "steal", "semi-rare", "game-item.hi-potion", "python-hi-potion-semi-rare-steal"],
  ["enemy.python", "steal", "rare", "game-item.phoenix-pinion", "python-phoenix-pinion-rare-steal"],
  ["enemy.python", "drop", "uncommon", "game-item.phoenix-down", "python-phoenix-down-uncommon-drop"],
];
const nolrichHeightsLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
const nolrichHeightsEncounter = enemyEncounters.find((entry) => entry.id === "encounter.nolrich-heights.world-map-pool");
const nolrichHeightsSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.ice-cavern")?.sections
  .find((section) => section.id === "exit-and-nolrich-heights");
const nolrichHeightsLootStep = nolrichHeightsSection?.steps.find((step) => step.id === "nolrich-heights-world-map-loot");
const friendlyMuStep = nolrichHeightsSection?.steps.find((step) => step.id === "friendly-mu");
if (!nolrichHeightsEncounter || !["enemy.carve-spider", "enemy.mu", "enemy.python"].every((enemyId) =>
  nolrichHeightsEncounter.formation.some((entry) => entry.enemyId === enemyId)) ||
  !nolrichHeightsEncounter.notes.join(" ").includes("Gunitas Basin") ||
  !nolrichHeightsLootStep?.text.includes("Leave a friendly Mu alone") ||
  !nolrichHeightsLootStep.detail?.includes("Mu/Python under Gunitas Basin") ||
  !friendlyMuStep?.objectiveIds?.includes("disc-1.ice-cavern.mu-friendly-monster") ||
  !nolrichHeightsSection?.sourceIds.includes("gamefaqs-enemy-list-71891")) {
  errors.push("Nolrich Heights loot routes must preserve the regional source difference and keep friendly Mu separate from standard combat.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of nolrichHeightsRegularLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.ice-cavern.nolrich-${pathSuffix}`);
  if (!slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId) ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.ice-cavern" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions?.includes("KO defeat") || !path.conditions.includes("conditional"))) ||
    nolrichHeightsLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) || !enemy?.sourceIds.includes(sourceId) ||
      !nolrichHeightsEncounter?.sourceIds.includes(sourceId))) {
    errors.push(`Nolrich Heights ${method} path ${pathSuffix} must match its enemy slot, stay repeatable, and retain item/encounter provenance.`);
  }
}
const lindblumKingdomLootEncounterIds = [
  "encounter.lindblum-plateau.mountain-pool",
  "encounter.lindblum-plateau.forest-pool",
  "encounter.lindblum-area.lowlands-pool",
  "encounter.qus-marsh.disc-1-interior-pool",
];
const lindblumKingdomLootEncounters = lindblumKingdomLootEncounterIds.map((id) =>
  enemyEncounters.find((entry) => entry.id === id));
const lindblumKingdomLootEnemyIds = [...new Set(lindblumKingdomLootEncounters.flatMap((encounter) =>
  encounter?.formation.map((member) => member.enemyId) ?? []))];
const lindblumKingdomLootExpected = lindblumKingdomLootEnemyIds.flatMap((enemyId) => {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  if (!enemy) return [];
  return [
    ...enemy.steals.filter((slot) => slot.itemId).map((slot) => ({ enemyId, method: "steal", slot })),
    ...enemy.drops.filter((slot) => slot.itemId).map((slot) => ({ enemyId, method: "drop", slot })),
  ];
});
const lindblumKingdomLootPaths = itemAcquisitionPaths.filter((path) =>
  path.chapterId === "disc-1.exploring-lindblum-kingdom" && path.enemyId);
const lindblumKingdomLootStep = walkthroughChapters.find((chapter) =>
  chapter.areaId === "disc-1.exploring-lindblum-kingdom")?.sections
  .find((section) => section.id === "explore-lindblum-plateau")?.steps
  .find((step) => step.id === "explore-lindblum-field-loot");
if (lindblumKingdomLootEncounters.some((entry) => !entry) || lindblumKingdomLootExpected.length !== 67 ||
  lindblumKingdomLootPaths.length !== lindblumKingdomLootExpected.length ||
  !itemCatalogCoverage.chapterIds.includes("disc-1.exploring-lindblum-kingdom") ||
  !lindblumKingdomLootStep?.text.includes("use Steal before ending a battle") ||
  !lindblumKingdomLootStep.detail?.includes("status victories do not award drops")) {
  errors.push("Lindblum Plateau, lowland, and first Qu's Marsh loot coverage must include every listed slot and its chance-aware walkthrough guidance.");
}
for (const expected of lindblumKingdomLootExpected) {
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const path = lindblumKingdomLootPaths.find((entry) => entry.enemyId === expected.enemyId &&
    entry.method === expected.method && entry.enemyLootSlot === expected.slot.slot && entry.itemId === expected.slot.itemId);
  const relatedEncounters = lindblumKingdomLootEncounters.filter((entry) =>
    entry?.formation.some((member) => member.enemyId === expected.enemyId));
  const requiredSources = [...new Set([
    ...expected.slot.sourceIds,
    ...(enemy?.sourceIds ?? []),
    ...relatedEncounters.flatMap((entry) => entry?.sourceIds ?? []),
  ])];
  if (!path || path.quantity !== 1 || path.availability !== "repeatable" ||
    !path.encounterIds || path.encounterIds.join("|") !== relatedEncounters.map((entry) => entry?.id).join("|") ||
    !path.conditions?.includes("chance-based") || path.walkthroughObjectiveIds?.length ||
    (expected.method === "drop" && (!path.conditions.includes("by KO") || !path.conditions.includes("not guaranteed"))) ||
    (expected.method === "steal" && !path.conditions.includes("may fail")) ||
    requiredSources.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.sourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId))) {
    errors.push(`Lindblum Kingdom ${expected.enemyId} ${expected.method} ${expected.slot.slot} path must match its enemy slot, encounters, chance conditions, and source links.`);
  }
}
const condePetieFieldLootPoolScopes = [
  { encounterId: "encounter.conde-petie-mountain-path.random-pool", chapterId: "disc-2.conde-petie-mountain-path", stepId: "mountain-path-field-loot" },
  { encounterId: "encounter.conde-petie-mountain-path.lucid-plains-pool", chapterId: "disc-2.conde-petie-mountain-path", stepId: "lucid-plains-field-loot" },
  { encounterId: "encounter.journey-to-iifa-tree.pualei-plains-pool", chapterId: "disc-2.journey-to-iifa-tree", stepId: "pualei-plains-field-loot" },
];
const condePetieFieldLootEncounters = condePetieFieldLootPoolScopes.map((pool) => ({
  ...pool,
  encounter: enemyEncounters.find((entry) => entry.id === pool.encounterId),
}));
const condePetieFieldLootExpected = condePetieFieldLootEncounters.flatMap(({ encounter, ...pool }) =>
  encounter?.formation.flatMap(({ enemyId }) => {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    if (!enemy) return [];
    return [
      ...enemy.steals.filter((slot) => slot.itemId).map((slot) => ({ pool, enemyId, method: "steal", slot })),
      ...enemy.drops.filter((slot) => slot.itemId).map((slot) => ({ pool, enemyId, method: "drop", slot })),
    ];
  }) ?? []);
const condePetieFieldLootPaths = itemAcquisitionPaths.filter((path) =>
  condePetieFieldLootPoolScopes.some((pool) => path.encounterIds?.includes(pool.encounterId)));
const condePetieFieldLootSteps = condePetieFieldLootEncounters.map(({ chapterId, stepId }) =>
  walkthroughChapters.find((chapter) => chapter.areaId === chapterId)?.sections
    .flatMap((section) => section.steps).find((step) => step.id === stepId));
const gnollSapphireSlot = enemyRecords.find((entry) => entry.id === "enemy.gnoll")?.drops
  .find((slot) => slot.slot === "common");
if (condePetieFieldLootEncounters.some(({ encounter }) => !encounter) || condePetieFieldLootExpected.length !== 31 ||
  condePetieFieldLootPaths.length !== condePetieFieldLootExpected.length ||
  !itemCatalogCoverage.chapterIds.includes("disc-2.conde-petie-mountain-path") ||
  !itemCatalogCoverage.chapterIds.includes("disc-2.journey-to-iifa-tree") ||
  condePetieFieldLootSteps.some((step) => !step?.text.includes("use Steal before") ||
    !step.text.includes("normal KO") || !step.detail?.includes("chance-based")) ||
  gnollSapphireSlot?.itemId !== "game-item.sapphire" ||
  !gnollSapphireSlot.sourceIds.includes("elitegrindlab-conde-petie-mountain-path")) {
  errors.push("Conde Petie Mountain Path, Lucid Plains, and Pualei Plains must link each item-bearing enemy slot to its area path and chance-aware walkthrough step, including Gnoll's Sapphire drop.");
}
for (const expected of condePetieFieldLootExpected) {
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === expected.pool.encounterId);
  const path = condePetieFieldLootPaths.find((entry) => entry.chapterId === expected.pool.chapterId &&
    entry.encounterIds?.length === 1 && entry.encounterIds[0] === expected.pool.encounterId &&
    entry.enemyId === expected.enemyId && entry.method === expected.method &&
    entry.enemyLootSlot === expected.slot.slot && entry.itemId === expected.slot.itemId);
  const requiredSources = [...new Set([
    ...expected.slot.sourceIds,
    ...(enemy?.sourceIds ?? []),
    ...(encounter?.sourceIds ?? []),
  ])];
  if (!path || path.quantity !== 1 || path.availability !== "repeatable" ||
    !path.conditions?.includes("chance-based") || path.walkthroughObjectiveIds?.length ||
    (expected.method === "drop" && (!path.conditions.includes("by normal KO") || !path.conditions.includes("not guaranteed"))) ||
    (expected.method === "steal" && !path.conditions.includes("may fail")) ||
    requiredSources.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.sourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId))) {
    errors.push(`Conde Petie field ${expected.pool.encounterId} ${expected.enemyId} ${expected.method} ${expected.slot.slot} path must preserve its area, loot slot, conditional behavior, and provenance.`);
  }
}
const daliUndergroundLootExpectations = [
  ["enemy.ghost", "steal", "common", "game-item.potion", "ghost-potion-common-steal"],
  ["enemy.ghost", "steal", "uncommon", "game-item.ore", "ghost-ore-uncommon-steal"],
  ["enemy.ghost", "steal", "semi-rare", "game-item.hi-potion", "ghost-hi-potion-semi-rare-steal"],
  ["enemy.ghost", "steal", "rare", "game-item.phoenix-pinion", "ghost-phoenix-pinion-rare-steal"],
  ["enemy.ghost", "drop", "uncommon", "game-item.echo-screen", "ghost-echo-screen-uncommon-drop"],
  ["enemy.vice", "steal", "common", "game-item.echo-screen", "vice-echo-screen-common-steal"],
  ["enemy.vice", "steal", "uncommon", "game-item.potion", "vice-potion-uncommon-steal"],
  ["enemy.vice", "drop", "common", "game-item.potion", "vice-potion-common-drop"],
  ["enemy.vice", "drop", "uncommon", "game-item.echo-screen", "vice-echo-screen-uncommon-drop"],
  ["enemy.vice", "drop", "rare", "game-item.phoenix-down", "vice-phoenix-down-rare-drop"],
  ["enemy.skeleton", "steal", "common", "game-item.ore", "skeleton-ore-common-steal"],
  ["enemy.skeleton", "steal", "uncommon", "game-item.hi-potion", "skeleton-hi-potion-uncommon-steal"],
  ["enemy.skeleton", "steal", "rare", "game-item.ether", "skeleton-ether-rare-steal"],
  ["enemy.skeleton", "drop", "common", "game-item.potion", "skeleton-potion-common-drop"],
  ["enemy.skeleton", "drop", "uncommon", "game-item.phoenix-down", "skeleton-phoenix-down-uncommon-drop"],
];
const daliUndergroundLootSourceIds = [
  "gamefaqs-enemy-list-71891",
  "gamefaqs-dali-71891",
  "jegged-dali",
  "gamerguides-dali",
  "cavesofnarshe-dali-walkthrough",
  "elitegrindlab-dali",
];
const daliUndergroundEncounter = enemyEncounters.find((entry) => entry.id === "encounter.dali-underground.random-pool");
const daliUndergroundSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.village-of-dali")?.sections
  .find((section) => section.id === "dali-underground-factory");
const daliUndergroundLootStep = daliUndergroundSection?.steps.find((step) => step.id === "dali-underground-optional-loot");
if (!daliUndergroundEncounter || !daliUndergroundSection ||
  !["enemy.ghost", "enemy.vice", "enemy.skeleton"].every((enemyId) =>
    daliUndergroundEncounter.formation.some((entry) => entry.enemyId === enemyId)) ||
  !daliUndergroundEncounter.notes.join(" ").includes("Jegged and EliteGrindLab also include Skeleton") ||
  !daliUndergroundLootStep?.text.includes("before the factory seals") ||
  !daliUndergroundLootStep.detail?.includes("Skeleton is source-disputed") ||
  daliUndergroundLootSourceIds.some((sourceId) => !daliUndergroundEncounter.sourceIds.includes(sourceId) ||
    !daliUndergroundSection.sourceIds.includes(sourceId)) ||
  !daliUndergroundEncounter.sourceIds.includes("ffwiki-skeleton") ||
  !daliUndergroundSection.sourceIds.includes("ffwiki-skeleton")) {
  errors.push("Dali underground enemy-loot routes must preserve the temporary access window and Skeleton encounter disagreement.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of daliUndergroundLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.village-of-dali.underground-${pathSuffix}`);
  if (!slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId) ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "limited-window" || path.walkthroughObjectiveIds?.length ||
    !path.conditions?.includes("rear door") || !path.conditions.includes("before the factory seals") ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions.includes("KO defeat") || !path.conditions.includes("conditional"))) ||
    (enemyId === "enemy.skeleton" && (!path.notes?.includes("source-disputed") || !path.notes.includes("Jegged and EliteGrindLab") ||
      !path.sourceIds.includes("ffwiki-skeleton") || !enemy?.sourceIds.includes("ffwiki-skeleton"))) ||
    daliUndergroundLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !enemy?.sourceIds.includes(sourceId) || !daliUndergroundEncounter?.sourceIds.includes(sourceId) ||
      !daliUndergroundSection?.sourceIds.includes(sourceId))) {
    errors.push(`Dali underground ${method} path ${pathSuffix} must match its enemy slot, stay limited to the factory window, and retain source conflicts.`);
  }
}
const gunitasGoblinLootExpectations = [
  ["steal", "common", "game-item.potion", "potion-common-steal"],
  ["drop", "common", "game-item.potion", "potion-common-drop"],
  ["drop", "uncommon", "game-item.echo-screen", "echo-screen-uncommon-drop"],
  ["drop", "rare", "game-item.phoenix-down", "phoenix-down-rare-drop"],
];
const gunitasBasinLootSourceIds = [
  "gamefaqs-enemy-list-71891",
  "gamefaqs-evil-forest-71891",
  "jegged-evil-forest",
];
const gunitasEncounter = enemyEncounters.find((entry) => entry.id === "encounter.gunitas-basin.world-map-pool");
const gunitasWalkthroughSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.ice-cavern")?.sections
  .find((section) => section.id === "exit-and-nolrich-heights");
const gunitasGoblinLootStep = gunitasWalkthroughSection?.steps.find((step) => step.id === "gunitas-basin-goblin-loot");
if (!gunitasEncounter || !["enemy.goblin", "enemy.mu", "enemy.python"].every((enemyId) =>
  gunitasEncounter.formation.some((entry) => entry.enemyId === enemyId)) ||
  !gunitasGoblinLootStep?.text.includes("Goblin, Mu, and Python") ||
  !gunitasGoblinLootStep.text.includes("separate steal and conditional drop slots") ||
  !gunitasGoblinLootStep.detail?.includes("exact encounter tiles, combinations, and rates are not published") ||
  !gunitasGoblinLootStep.detail?.includes("friendly Mu belongs to the separate Friendly Monster task") ||
  gunitasBasinLootSourceIds.some((sourceId) => !gunitasEncounter.sourceIds.includes(sourceId) ||
    !gunitasWalkthroughSection?.sourceIds.includes(sourceId))) {
  errors.push("Gunitas Basin Goblin, Mu, and Python loot paths must link to the documented regional encounter and route with source-backed slot context.");
}
for (const [method, slotName, itemId, pathSuffix] of gunitasGoblinLootExpectations) {
  const goblin = enemyRecords.find((entry) => entry.id === "enemy.goblin");
  const slots = method === "steal" ? goblin?.steals : goblin?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.village-of-dali.gunitas-goblin-${pathSuffix}`);
  if (!slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId) ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || path.walkthroughObjectiveIds?.length ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions?.includes("KO victory") || !path.conditions.includes("conditional"))) ||
    gunitasBasinLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !goblin?.sourceIds.includes(sourceId) || !gunitasEncounter?.sourceIds.includes(sourceId))) {
    errors.push(`Gunitas Basin Goblin ${method} path ${pathSuffix} must match the enemy slot, stay repeatable, and retain source provenance.`);
  }
}
const gunitasBasinLootExpectations = [
  ["enemy.mu", "steal", "uncommon", "game-item.potion", "mu-potion-uncommon-steal"],
  ["enemy.mu", "drop", "common", "game-item.potion", "mu-potion-common-drop"],
  ["enemy.mu", "drop", "uncommon", "game-item.echo-screen", "mu-echo-screen-uncommon-drop"],
  ["enemy.mu", "drop", "rare", "game-item.phoenix-down", "mu-phoenix-down-rare-drop"],
  ["enemy.python", "steal", "common", "game-item.potion", "python-potion-common-steal"],
  ["enemy.python", "steal", "uncommon", "game-item.ore", "python-ore-uncommon-steal"],
  ["enemy.python", "steal", "semi-rare", "game-item.hi-potion", "python-hi-potion-semi-rare-steal"],
  ["enemy.python", "steal", "rare", "game-item.phoenix-pinion", "python-phoenix-pinion-rare-steal"],
  ["enemy.python", "drop", "uncommon", "game-item.phoenix-down", "python-phoenix-down-uncommon-drop"],
];
for (const [enemyId, method, slotName, itemId, pathSuffix] of gunitasBasinLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.village-of-dali.gunitas-${pathSuffix}`);
  if (!slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId) ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.village-of-dali" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || path.walkthroughObjectiveIds?.length ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions?.includes("KO defeat") || !path.conditions.includes("conditional"))) ||
    gunitasBasinLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !enemy?.sourceIds.includes(sourceId) || !gunitasEncounter?.sourceIds.includes(sourceId))) {
    errors.push(`Gunitas Basin ${enemyId} ${method} path ${pathSuffix} must match its enemy slot, remain repeatable, and retain route provenance.`);
  }
}
const evilForestGoblinLootExpectations = [
  ["steal", "common", "game-item.potion", "potion-common-steal"],
  ["drop", "common", "game-item.potion", "potion-common-drop"],
  ["drop", "uncommon", "game-item.echo-screen", "echo-screen-uncommon-drop"],
  ["drop", "rare", "game-item.phoenix-down", "phoenix-down-rare-drop"],
];
const evilForestEncounter = enemyEncounters.find((entry) => entry.id === "encounter.evil-forest.random-pool");
const evilForestRouteSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.evil-forest")?.sections
  .find((section) => section.id === "forest-path-monty");
const evilForestGoblinLootStep = evilForestRouteSection?.steps.find((step) => step.id === "evil-forest-goblin-loot");
const evilForestRegularLootExpectations = [
  ["enemy.dendrobium", "steal", "common", "game-item.eye-drops", "dendrobium-eye-drops-common-steal"],
  ["enemy.dendrobium", "steal", "uncommon", "game-item.tent", "dendrobium-tent-uncommon-steal"],
  ["enemy.dendrobium", "steal", "semi-rare", "game-item.ore", "dendrobium-ore-semi-rare-steal"],
  ["enemy.dendrobium", "drop", "common", "game-item.eye-drops", "dendrobium-eye-drops-common-drop"],
  ["enemy.dendrobium", "drop", "uncommon", "game-item.potion", "dendrobium-potion-uncommon-drop"],
  ["enemy.dendrobium", "drop", "rare", "game-item.phoenix-down", "dendrobium-phoenix-down-rare-drop"],
  ["enemy.fang-a", "steal", "common", "game-item.potion", "fang-a-potion-common-steal"],
  ["enemy.fang-a", "steal", "uncommon", "game-item.phoenix-down", "fang-a-phoenix-down-uncommon-steal"],
  ["enemy.fang-a", "steal", "semi-rare", "game-item.hi-potion", "fang-a-hi-potion-semi-rare-steal"],
  ["enemy.fang-a", "steal", "rare", "game-item.phoenix-pinion", "fang-a-phoenix-pinion-rare-steal"],
  ["enemy.fang-a", "drop", "common", "game-item.eye-drops", "fang-a-eye-drops-common-drop"],
  ["enemy.fang-a", "drop", "uncommon", "game-item.phoenix-down", "fang-a-phoenix-down-uncommon-drop"],
];
const evilForestRegularLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
const evilForestGoblinLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest", "elitegrindlab-evil-forest"];
if (!evilForestEncounter || !["enemy.dendrobium", "enemy.fang-a", "enemy.goblin"].every((enemyId) =>
  evilForestEncounter.formation.some((entry) => entry.enemyId === enemyId)) ||
  !evilForestGoblinLootStep?.text.includes("Dendrobium, Fang [A], and Goblin") ||
  !evilForestGoblinLootStep.text.includes("chance-based steal slots and conditional drop slots") ||
  !evilForestGoblinLootStep.detail?.includes("party escapes and the forest closes") ||
  !evilForestGoblinLootStep.detail.includes("exact formations and encounter rates are not inferred") ||
  evilForestGoblinLootSourceIds.some((sourceId) => !evilForestEncounter.sourceIds.includes(sourceId) ||
    !evilForestRouteSection?.sourceIds.includes(sourceId))) {
  errors.push("Evil Forest Dendrobium, Fang, and Goblin loot paths must link to the trail encounter, its limited window, and source context.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of evilForestRegularLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.evil-forest.${pathSuffix}`);
  const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(evilForestEncounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
  if (!lootSlot ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.evil-forest" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "limited-window" || path.walkthroughObjectiveIds?.length ||
    path.enemyId !== enemyId || path.enemyLootSlot !== slotName || path.encounterIds?.length !== 1 ||
    path.encounterIds[0] !== evilForestEncounter?.id || !path.conditions?.includes("chance-based") ||
    !path.conditions?.includes("before the area closes") || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions.includes("KO victory") || !path.conditions.includes("conditional"))) ||
    [...requiredSources].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.sourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
    evilForestRegularLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !enemy?.sourceIds.includes(sourceId) || !evilForestEncounter?.sourceIds.includes(sourceId))) {
    errors.push(`Evil Forest ${enemyId} ${method} path ${pathSuffix} must match its enemy slot, remain limited to the forest window, and retain route provenance.`);
  }
}
for (const [method, slotName, itemId, pathSuffix] of evilForestGoblinLootExpectations) {
  const goblin = enemyRecords.find((entry) => entry.id === "enemy.goblin");
  const slots = method === "steal" ? goblin?.steals : goblin?.drops;
  const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.evil-forest.goblin-${pathSuffix}`);
  const requiredSources = new Set([...(goblin?.sourceIds ?? []), ...(evilForestEncounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
  if (!lootSlot ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.evil-forest" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "limited-window" || path.walkthroughObjectiveIds?.length ||
    path.enemyId !== "enemy.goblin" || path.enemyLootSlot !== slotName || path.encounterIds?.length !== 1 ||
    path.encounterIds[0] !== evilForestEncounter?.id || !path.conditions?.includes("chance-based") ||
    !path.conditions?.includes("before the area closes") || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions.includes("KO victory") || !path.conditions.includes("conditional"))) ||
    [...requiredSources].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.sourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
    evilForestGoblinLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !goblin?.sourceIds.includes(sourceId) || !evilForestEncounter?.sourceIds.includes(sourceId))) {
    errors.push(`Evil Forest Goblin ${method} path ${pathSuffix} must match the enemy slot, retain its limited window, and preserve sources.`);
  }
}
const daliBossPrepSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.village-of-dali")?.sections.find((section) => section.id === "observatory-and-black-waltz-2");
const daliBossPrepStep = daliBossPrepSection?.steps.find((step) => step.id === "dali-observatory-boss-prep");
const blackWaltz2Preparation = blackWaltz2Record?.preparationGuidance;
if (!blackWaltz2Preparation || blackWaltz2Preparation.suggestedLevelRange?.min !== 5 || blackWaltz2Preparation.suggestedLevelRange.max !== 6 ||
  !blackWaltz2Preparation.sourceIds.includes("kamigame-dali-black-waltz-2") ||
  !blackWaltz2Preparation.levelRationale.includes("not a minimum or cap") ||
  !daliBossPrepSection?.sourceIds.includes("kamigame-dali-black-waltz-2") ||
  !daliBossPrepStep?.text.includes("Lv. 5–6 or higher") || !daliBossPrepStep.text.includes("optional advice, not a verified minimum") ||
  !daliBossPrepStep.detail?.includes("platform/build is not identified")) {
  errors.push("Black Waltz 2 preparation must preserve the optional 5–6+ one-source recommendation and its build/platform limits in the route and bestiary.");
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
const cargoShipWaltzStealPaths = itemAcquisitionPaths.filter((path) => path.chapterId === "disc-1.cargo-ship" &&
  path.enemyId === "enemy.black-waltz-3-cargo-ship" && path.method === "steal");
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
  cargoShipWaltzStealPaths.length !== cargoShipWaltzSteals.length ||
  !cargoShipWaltzRecord.notes.some((note) => note.includes("Silver Greaves") && note.includes("Silver Gloves"))) {
  errors.push("The Cargo Ship Black Waltz 3 record must stay distinct, source-linked, and tied to its one-time steals, warning, cutoff, and source-name conflict.");
}
const cargoShipPreparation = cargoShipWaltzRecord?.preparationGuidance;
const cargoShipPrepSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.cargo-ship")?.sections.find((section) => section.id === "black-waltz-3");
const cargoShipPrepStep = cargoShipPrepSection?.steps.find((step) => step.id === "cargo-ship-boss-preparation");
if (!cargoShipPreparation || cargoShipPreparation.suggestedLevelRange !== undefined ||
  !cargoShipPreparation.levelRationale.includes("not a party target") ||
  !cargoShipPreparation.sourceIds.includes("gamefaqs-cargo-ship-71891") || !cargoShipPreparation.sourceIds.includes("jegged-cargo-ship") ||
  cargoShipPreparation.sourceIds.includes("game-dog-cargo-ship") ||
  !cargoShipPrepStep?.detail?.includes("not a party target") ||
  !cargoShipPrepSection?.sourceIds.includes("gamefaqs-cargo-ship-71891")) {
  errors.push("Cargo Ship Black Waltz 3 preparation must distinguish its Level 7 enemy stat from an unsupported party-level target and exclude conflicting Game Dog advice.");
}
for (const [itemId, slot] of cargoShipWaltzSteals) {
  const lootSlot = cargoShipWaltzRecord?.steals.find((steal) => steal.itemId === itemId && steal.slot === slot);
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === "disc-1.cargo-ship" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-1.cargo-ship.black-waltz-3-steals"));
  const expectedSourceIds = new Set([
    ...(cargoShipWaltzRecord?.sourceIds ?? []),
    ...(cargoShipWaltzEncounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ]);
  if (!lootSlot || !path || path.method !== "steal" || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.black-waltz-3-cargo-ship" || path.enemyLootSlot !== slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.cargo-ship.black-waltz-3"]) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
    [...expectedSourceIds].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId))) {
    errors.push(`Cargo Ship Black Waltz 3's ${itemId} steal must match its exact loot slot, one-time encounter, chance, and source provenance.`);
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
const maskedManPreparation = openingMaskedManRecord?.preparationGuidance;
const maskedManOpeningSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.alexandria")?.sections.find((section) => section.id === "tantalus-opening");
const maskedManPreparationStep = maskedManOpeningSection?.steps.find((step) => step.id === "masked-man-preparation");
if (!maskedManPreparation || maskedManPreparation.suggestedLevelRange !== undefined ||
  !maskedManPreparation.levelRationale.includes("Level 1") || !maskedManPreparation.levelRationale.includes("no party-level recommendation") ||
  !maskedManPreparation.difficultyAssessment?.includes("subjective") ||
  !maskedManPreparation.optionalGrinding.includes("no EXP or AP") ||
  !maskedManPreparation.setupAdvice.includes("Potion, Wrist, and Mage Masher") ||
  !maskedManPreparation.setupAdvice.includes("Ow") || !maskedManPreparation.setupAdvice.includes("188") ||
  !maskedManPreparation.sourceIds.includes("jegged-prima-vista") || maskedManPreparation.sourceIds.some((sourceId) => !sourceIds.has(sourceId)) ||
  !maskedManOpeningSection?.sourceIds.includes("jegged-prima-vista") ||
  !maskedManPreparationStep?.text.includes("no party-level target") || !maskedManPreparationStep?.detail.includes("older FAQ lists 160")) {
  errors.push("Opening Masked Man preparation must separate the enemy's Level 1 stat from party guidance and connect the steals, scripted opener, and disputed HP to the route.");
}
const crashSiteBakuPreparation = crashSiteBakuRecord?.preparationGuidance;
const crashSiteBakuSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.evil-forest")
  ?.sections.find((section) => section.id === "prima-vista-wreckage");
const crashSiteBakuPreparationStep = crashSiteBakuSection?.steps.find((step) => step.id === "baku-wreckage-fight");
if (!crashSiteBakuPreparation || crashSiteBakuPreparation.suggestedLevelRange !== undefined ||
  !crashSiteBakuPreparation.levelRationale.includes("Level 2 is Baku's enemy stat") ||
  !crashSiteBakuPreparation.levelRationale.includes("no party-level recommendation") ||
  !crashSiteBakuPreparation.optionalGrinding.includes("0 EXP, AP, and Gil") ||
  !crashSiteBakuPreparation.setupAdvice.includes("Mage Masher") ||
  !crashSiteBakuPreparation.setupAdvice.includes("60 HP") ||
  !crashSiteBakuPreparation.setupAdvice.includes("no Fire caster") ||
  !crashSiteBakuPreparation.sourceIds.includes("jegged-evil-forest") ||
  crashSiteBakuPreparation.sourceIds.some((sourceId) => !sourceIds.has(sourceId)) ||
  !crashSiteBakuSection?.sourceIds.includes("jegged-evil-forest") ||
  !crashSiteBakuPreparationStep?.detail.includes("older FAQ estimates about 160") ||
  !crashSiteBakuPreparationStep.detail.includes("Jegged reports Rare at 6%")) {
  errors.push("Crash Site Baku preparation must separate his enemy Level 2 from party guidance and preserve the solo setup, recovery, HP dispute, and source-specific steal reports.");
}
for (const [enemyId, itemId, slot, chapterId, objectiveId] of [
  ["enemy.masked-man-opening", "game-item.potion", "common", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.masked-man-opening", "game-item.wrist", "uncommon", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.masked-man-opening", "game-item.mage-masher", "semi-rare", "disc-1.alexandria", "disc-1.alexandria.masked-man-steals"],
  ["enemy.baku-crash-site", "game-item.hi-potion", "common", "disc-1.evil-forest", "disc-1.evil-forest.baku-steals"],
  ["enemy.baku-crash-site", "game-item.iron-sword", "uncommon", "disc-1.evil-forest", "disc-1.evil-forest.baku-steals"],
] as const) {
  const enemy = enemyRecords.find((candidate) => candidate.id === enemyId);
  const encounterId = enemyId === "enemy.masked-man-opening"
    ? "encounter.alexandria.masked-man-opening"
    : "encounter.evil-forest.baku-crash-site";
  const encounter = enemyEncounters.find((candidate) => candidate.id === encounterId);
  const lootSlot = enemy?.steals.find((steal) => steal.itemId === itemId && steal.slot === slot);
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === chapterId && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes(objectiveId));
  const requiredSources = [...new Set([
    ...(enemy?.sourceIds ?? []),
    ...(encounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ])];
  if (!lootSlot || !enemy || !encounter || !path || path.availability !== "one-time-encounter" ||
    path.enemyId !== enemyId || path.enemyLootSlot !== slot || path.encounterIds?.length !== 1 ||
    path.encounterIds[0] !== encounterId || path.quantity !== 1 ||
    !path.conditions?.includes("chance-based") || requiredSources.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.sourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId))) {
    errors.push(`${enemyId}'s ${itemId} steal must link the exact loot slot to its one-time encounter and complete provenance.`);
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
const summitStationWaltzStealPaths = itemAcquisitionPaths.filter((path) => path.chapterId === "disc-2.journey-to-treno" &&
  path.enemyId === "enemy.black-waltz-3-rematch" && path.method === "steal");
if (!summitStationWaltzEncounter || summitStationWaltzEncounter.kind !== "boss" ||
  summitStationWaltzEncounter.chapterId !== "disc-2.journey-to-treno" ||
  !summitStationWaltzEncounter.formation.some((entry) => entry.enemyId === "enemy.black-waltz-3-rematch" && entry.quantity === 1) ||
  !summitStationWaltzEncounter.objectiveIds.includes("disc-2.journey-to-treno.black-waltz-3-steals") ||
  !summitStationWaltzEncounter.missableIds.includes("missable.disc-2.journey-to-treno.black-waltz-3-steals") ||
  !summitStationWaltzEncounter.cutoffIds.includes("cutoff.journey-to-treno.black-waltz-3-steals") ||
  summitStationWaltzStealPaths.length !== summitStationWaltzSteals.length ||
  !["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station", "strategywiki-summit-station"].every((sourceId) => summitStationWaltzEncounter.sourceIds.includes(sourceId))) {
  errors.push("The Summit Station Black Waltz 3 rematch must have its own source-linked boss encounter tied to the existing steal objective, missable, and cutoff.");
}
for (const [itemId, slot] of summitStationWaltzSteals) {
  const lootSlot = summitStationWaltzRecord?.steals.find((steal) => steal.itemId === itemId && steal.slot === slot);
  const path = itemAcquisitionPaths.find((candidate) => candidate.itemId === itemId && candidate.chapterId === "disc-2.journey-to-treno" && candidate.method === "steal" && candidate.walkthroughObjectiveIds?.includes("disc-2.journey-to-treno.black-waltz-3-steals"));
  const expectedSourceIds = new Set([
    ...(summitStationWaltzRecord?.sourceIds ?? []),
    ...(summitStationWaltzEncounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ]);
  if (!lootSlot || !summitStationWaltzRecord?.routeObjectiveIds.includes("disc-2.journey-to-treno.black-waltz-3-steals") ||
    !path || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.black-waltz-3-rematch" || path.enemyLootSlot !== slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.summit-station.black-waltz-3-rematch"]) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
    [...expectedSourceIds].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId)) ||
    (itemId === "game-item.flame-staff" && !path.notes?.includes("GameFAQs labels Flame Staff Semi-Rare; Jegged labels it Rare"))) {
    errors.push(`The Summit Station Black Waltz 3 ${itemId} steal must match its exact rematch slot, one-time encounter, chance, source provenance, and any source-specific slot conflict.`);
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
const summitWaltzPreparation = summitStationWaltzRecord?.preparationGuidance;
const summitWaltzPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
  ?.sections.find((section) => section.id === "journey-treno-black-waltz-3");
const summitWaltzPreparationStep = summitWaltzPreparationSection?.steps.find((step) => step.id === "journey-treno-black-waltz-3-preparation");
if (!summitWaltzPreparation || summitWaltzPreparation.suggestedLevelRange !== undefined ||
  !summitWaltzPreparation.levelRationale.includes("Level 9 is Black Waltz 3's enemy stat") ||
  !summitWaltzPreparation.levelRationale.includes("do not recommend a party level") ||
  !summitWaltzPreparation.difficultyAssessment?.includes("subjective route assessments") ||
  !summitWaltzPreparation.optionalGrinding.includes("prescribes extra grinding") ||
  !summitWaltzPreparation.setupAdvice.includes("Dagger, Steiner, and Marcus") ||
  !summitWaltzPreparation.setupAdvice.includes("Freeze prevents actions") ||
  !summitWaltzPreparation.setupAdvice.includes("wait for it to clear or use a Remedy") ||
  !summitWaltzPreparation.setupAdvice.includes("Steepled Hat and Lightning Staff") ||
  !summitWaltzPreparation.setupAdvice.includes("Flame Staff") ||
  !["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station", "strategywiki-summit-station"]
    .every((sourceId) => summitWaltzPreparation.sourceIds.includes(sourceId) && summitStationWaltzRecord?.sourceIds.includes(sourceId)) ||
  !summitWaltzPreparationStep?.text.includes("Dagger, Steiner, and Marcus") ||
  !summitWaltzPreparationStep.text.includes("Shell") ||
  !summitWaltzPreparationStep.detail?.includes("Level 9 is Black Waltz 3's enemy stat") ||
  !summitWaltzPreparationSection?.sourceIds.includes("gamefaqs-journey-to-treno-71891")) {
  errors.push("Summit Station Black Waltz 3 preparation must distinguish enemy level from party targets and cover the changed party, Freeze response, and source-backed steal choices.");
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
const ralvurahvaPreparation = ralvurahvaRecord?.preparationGuidance;
const garganRooPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.journey-to-cleyra")?.sections.find((section) => section.id === "gargan-roo-mognet-and-chests");
const garganRooLevelingStep = garganRooPreparationSection?.steps.find((step) => step.id === "journey-cleyra-gargan-roo-optional-leveling");
const garganRooRideStepIndex = garganRooPreparationSection?.steps.findIndex((step) => step.id === "journey-cleyra-route-the-gargant") ?? -1;
const garganRooLevelingStepIndex = garganRooPreparationSection?.steps.findIndex((step) => step.id === "journey-cleyra-gargan-roo-optional-leveling") ?? -1;
if (!ralvurahvaPreparation || ralvurahvaPreparation.suggestedLevelRange !== undefined ||
  !ralvurahvaPreparation.levelRationale.includes("Level 13 is the enemy stat") ||
  !ralvurahvaPreparation.levelRationale.includes("Lv. 12–13 as an optional stopping point") ||
  !ralvurahvaPreparation.difficultyAssessment?.includes("characterizes the fight as simple") ||
  !ralvurahvaPreparation.difficultyAssessment.includes("subjective, single-source") ||
  !ralvurahvaPreparation.optionalGrinding.includes("GameFAQs says Marcus's stat gains transfer") ||
  !ralvurahvaPreparation.optionalGrinding.includes("his level does not") ||
  !ralvurahvaPreparation.optionalGrinding.includes("not gameplay-tested here or confirmed across releases") ||
  !ralvurahvaPreparation.optionalGrinding.includes("timer/low-EXP plan") ||
  !ralvurahvaPreparation.setupAdvice.includes("Antibody on Dagger and Steiner") ||
  !ralvurahvaPreparation.setupAdvice.includes("Marcus remains vulnerable to Poison") ||
  !["gamefaqs-treno-71891", "gamerguides-gargan-roo"].every((sourceId) => ralvurahvaPreparation.sourceIds.includes(sourceId) && ralvurahvaRecord?.sourceIds.includes(sourceId)) ||
  !garganRooPreparationSection?.sourceIds.includes("gamefaqs-treno-71891") ||
  !garganRooPreparationSection.sourceIds.includes("gamerguides-gargan-roo") ||
  !garganRooLevelingStep || garganRooRideStepIndex <= garganRooLevelingStepIndex ||
  !garganRooLevelingStep.text.includes("party Lv. 12–13 as a stopping point") ||
  !garganRooLevelingStep.detail?.includes("not gameplay-tested here or confirmed across releases") ||
  !garganRooLevelingStep.detail.includes("Excalibur II/low-EXP route")) {
  errors.push("Ralvurahva preparation must separate the Level 13 enemy stat from optional Lv. 12–13 party advice, keep Marcus stat-growth claims source-scoped, and place the optional detour before the one-way ride.");
}
const boneWristDaguerreoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.bone-wrist-daguerreo-shop");
const boneWristAlexandriaPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-home-front.bone-wrist-alexandria-shop");
if (
  !boneWristDaguerreoPath ||
  boneWristDaguerreoPath.itemId !== "game-item.bone-wrist" ||
  boneWristDaguerreoPath.chapterId !== "disc-3.aerial-exploration" ||
  boneWristDaguerreoPath.shopId !== "daguerreo.shop.disc-3" ||
  boneWristDaguerreoPath.method !== "shop" ||
  boneWristDaguerreoPath.availability !== "limited-window" ||
  boneWristDaguerreoPath.cost?.currency !== "gil" ||
  boneWristDaguerreoPath.cost.amount !== 330 ||
  !boneWristDaguerreoPath.conditions.includes("Disc III") ||
  !boneWristDaguerreoPath.conditions.includes("Disc IV") ||
  !boneWristDaguerreoPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !boneWristDaguerreoPath.sourceIds.includes("jegged-arm-gear") ||
  !boneWristAlexandriaPath ||
  boneWristAlexandriaPath.itemId !== "game-item.bone-wrist" ||
  boneWristAlexandriaPath.availability !== "repeatable"
) {
  errors.push("Bone Wrist's Disc III Daguerreo purchase must be marked closed by the Disc IV weapon-stock change while preserving Alexandria as a later item-type recovery source.");
}
for (const expected of [
  {
    id: "item-path.disc-2.return-to-lindblum.bone-wrist-shop",
    chapterId: "disc-2.return-to-lindblum",
    shopId: "lindblum.weapon-shop.disc-2",
    sourceStockLabel: "Disc II Lindblum",
    laterStockLabel: "Disc III–IV",
  },
  {
    id: "item-path.disc-2.outer-continent.bone-wrist-black-mage-village-shop",
    chapterId: "disc-2.outer-continent",
    shopId: "black-mage-village.weapon-shop",
    sourceStockLabel: "Discs II–III",
    laterStockLabel: "Disc IV",
  },
]) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.id);
  if (
    !path ||
    path.itemId !== "game-item.bone-wrist" ||
    path.chapterId !== expected.chapterId ||
    path.shopId !== expected.shopId ||
    path.method !== "shop" ||
    path.availability !== "limited-window" ||
    path.cost?.currency !== "gil" ||
    path.cost.amount !== 330 ||
    !path.conditions.includes(expected.sourceStockLabel) ||
    !path.conditions.includes(expected.laterStockLabel) ||
    !path.sourceIds.includes("gamefaqs-shops-71891") ||
    !path.sourceIds.includes("jegged-arm-gear")
  ) {
    errors.push(`Bone Wrist's ${expected.shopId} purchase must be marked limited to its documented pre-Disc-IV shop stock.`);
  }
}
const glassArmletBmvPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.outer-continent.glass-armlet-black-mage-village-shop");
const glassArmletAlexandriaPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-home-front.glass-armlet-alexandria-shop");
const glassArmletPreCleyraPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.glass-armlet-shop");
const glassArmletDisc2TrenoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.glass-armlet-shop");
const glassArmletDisc2LindblumPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.glass-armlet-shop");
const glassArmletDisc3TrenoCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.glass-armlet-treno-candidate");
const glassArmletDisc3LindblumCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.glass-armlet-lindblum-candidate");
const glassArmletTrenoSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.treno")?.sections.find((section) => section.id === "treno-city-pickups-and-mognet");
const glassArmletDisc3TrenoSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.card-tournament")?.sections.find((section) => section.id === "card-tournament-treno-sweep");
if (
  !glassArmletBmvPath ||
  glassArmletBmvPath.itemId !== "game-item.glass-armlet" ||
  glassArmletBmvPath.chapterId !== "disc-2.outer-continent" ||
  glassArmletBmvPath.shopId !== "black-mage-village.weapon-shop.disc-2-3" ||
  glassArmletBmvPath.availability !== "limited-window" ||
  !glassArmletBmvPath.conditions.includes("Discs II–III") ||
  !glassArmletBmvPath.conditions.includes("Disc IV") ||
  !glassArmletBmvPath.conditions.includes("No. 239's Armory (Disk 2 & 3)") ||
  !glassArmletBmvPath.conditions.includes("location footer says Black Mage Village (Disk 2)") ||
  !glassArmletBmvPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !glassArmletBmvPath.sourceIds.includes("jegged-arm-gear") ||
  !glassArmletBmvPath.sourceIds.includes("drslice-no-239-armory") ||
  !glassArmletAlexandriaPath ||
  glassArmletAlexandriaPath.availability !== "repeatable"
) {
  errors.push("Glass Armlet's Black Mage Village purchase must close with the Disc IV weapon-stock change while preserving Alexandria recovery.");
}
if (
  !glassArmletPreCleyraPath ||
  glassArmletPreCleyraPath.availability !== "limited-window" ||
  !glassArmletPreCleyraPath.conditions.includes("until Cleyra is completed") ||
  !glassArmletPreCleyraPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !glassArmletPreCleyraPath.sourceIds.includes("jegged-arm-gear") ||
  !glassArmletDisc2LindblumPath ||
  glassArmletDisc2LindblumPath.itemId !== "game-item.glass-armlet" ||
  glassArmletDisc2LindblumPath.chapterId !== "disc-2.return-to-lindblum" ||
  glassArmletDisc2LindblumPath.shopId !== "lindblum.weapon-shop.disc-2" ||
  glassArmletDisc2LindblumPath.availability !== "limited-window" ||
  glassArmletDisc2LindblumPath.cost?.amount !== 250 ||
  !glassArmletDisc2LindblumPath.conditions.includes("before leaving Middle Lindblum") ||
  !glassArmletDisc2LindblumPath.conditions.includes("remains disputed") ||
  !glassArmletDisc2LindblumPath.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.arm-gear-stock") ||
  !glassArmletDisc2LindblumPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !glassArmletDisc2LindblumPath.sourceIds.includes("jegged-arm-gear") ||
  !glassArmletDisc2TrenoPath ||
  glassArmletDisc2TrenoPath.itemId !== "game-item.glass-armlet" ||
  glassArmletDisc2TrenoPath.chapterId !== "disc-2.treno" ||
  glassArmletDisc2TrenoPath.availability !== "limited-window" ||
  glassArmletDisc2TrenoPath.cost?.amount !== 250 ||
  !glassArmletDisc2TrenoPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !glassArmletDisc2TrenoPath.sourceIds.includes("drslice-treno-armory") ||
  !glassArmletDisc2TrenoPath.conditions?.includes("DrSlice independently lists it for 250 Gil under Treno (Disk 2)") ||
  !glassArmletDisc2TrenoPath.conditions?.includes("safe purchase point")
) {
  errors.push("Glass Armlet's early Lindblum and Disc II shop purchases must remain distinct from the disputed later city listings.");
}
for (const [path, chapterId, city] of [
  [glassArmletDisc3TrenoCandidate, "disc-3.card-tournament", "Treno"],
  [glassArmletDisc3LindblumCandidate, "disc-3.aerial-exploration", "Lindblum"],
] as const) {
  if (
    !path ||
    path.itemId !== "game-item.glass-armlet" ||
    path.chapterId !== chapterId ||
    path.availability !== "window-unverified" ||
    !path.shopName?.includes("possible Disc III sale") ||
    path.cost?.amount !== 250 ||
    !path.sourceIds.includes("gamefaqs-shops-71891") ||
    !path.sourceIds.includes("gamefaqs-items-71891") ||
    !path.sourceIds.includes("gamefaqs-item-locations-54996") ||
    !path.sourceIds.includes("gamefaqs-equipment-33383") ||
    !path.sourceIds.includes("gamefaqs-walkthrough-9801") ||
    !path.sourceIds.includes("jegged-arm-gear") ||
    !path.sourceIds.includes("rpgclassics-shops") ||
    !path.sourceIds.includes("ffwiki-shops") ||
    !path.sourceIds.includes("gameclue-armlets") ||
    !path.sourceIds.includes("ffdq-glass-armlet") ||
    (city === "Treno" && (
      !path.sourceIds.includes("drslice-treno-armory") ||
      !/DrSlice independently labels its Treno Armory listing as Disk 2/i.test(path.conditions ?? "")
    )) ||
    !/unverified candidate route/i.test(path.conditions ?? "") ||
    !/(?:does not prove|do not (?:prove|establish))/i.test(path.conditions ?? "") ||
    !/GameClue's iPhone\/Android\/PS1 armlet list/i.test(path.conditions ?? "") ||
    !path.conditions.includes("FFDQ.com's disc-indexed table") ||
    !/Alexandria/i.test(path.conditions ?? "") ||
    (city === "Treno" && (
      !path.sourceIds.includes("drslice-treno-disc3-armory") ||
      !path.conditions.includes("DrSlice's Disc III Knight's Residence Armory list also omits it") ||
      !path.sourceIds.includes("neoseeker-treno-shops") ||
      !path.conditions.includes("Neoseeker's search-indexed Treno tables omit the armlet from their later Treno tables")
    )) ||
    (city === "Lindblum" && (
      !path.sourceIds.includes("drslice-lindblum-disc3-armory") ||
      !path.conditions.includes("DrSlice's Disc III Dragoos's Armory table also omits it") ||
      !path.sourceIds.includes("neoseeker-lindblum-shops") ||
      !path.conditions.includes("Neoseeker's search-indexed Lindblum page")
    ))
  ) {
    errors.push(`Glass Armlet's ${city} Disc III sale must remain a source-scoped, unverified candidate separate from Alexandria recovery.`);
  }
}
for (const pathId of [
  "item-path.disc-1.burmecia.glass-armlet-atla-mogshop",
  "item-path.disc-2.journey-to-cleyra.glass-armlet-atla-mogshop",
  "item-path.disc-1.lindblum.glass-armlet-shop",
  "item-path.disc-2.journey-to-treno.glass-armlet-summit-station-shop",
  "item-path.disc-2.treno.glass-armlet-shop",
  "item-path.disc-2.return-to-lindblum.glass-armlet-shop",
  "item-path.disc-2.outer-continent.glass-armlet-black-mage-village-shop",
  "item-path.disc-3.the-home-front.glass-armlet-alexandria-shop",
]) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  if (!path?.sourceIds.includes("ffdq-glass-armlet")) {
    errors.push("Glass Armlet source-listed shop path " + pathId + " must include the FFDQ arm-gear reference.");
  }
}
if (
  !glassArmletTrenoSection?.sourceIds.includes("ffwiki-shops") ||
  !glassArmletTrenoSection?.sourceIds.includes("neoseeker-treno-shops") ||
  !glassArmletTrenoSection?.sourceIds.includes("ffdq-glass-armlet") ||
  !glassArmletTrenoSection?.steps.find((step) => step.id === "treno-mogrich-letter")?.detail?.includes("Final Fantasy Wiki omits them from its later city tables") ||
  !glassArmletTrenoSection?.steps.find((step) => step.id === "treno-mogrich-letter")?.detail?.includes("Neoseeker's Treno tables also list Glass Armlet") ||
  !objectives.find((objective) => objective.id === "disc-2.treno.shop-stock-window")?.sourceIds.includes("neoseeker-treno-shops") ||
  !objectives.find((objective) => objective.id === "disc-2.return-to-lindblum.arm-gear-stock")?.sourceIds.includes("neoseeker-lindblum-shops") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("FFDQ.com's Japanese disc-indexed armlet table") ||
  !glassArmletDisc3TrenoSection?.sourceIds.includes("neoseeker-treno-shops") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("Neoseeker's indexed Treno page") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("ffdq-glass-armlet") ||
  !sources.find((source) => source.id === "ffdq-glass-armlet")?.notes.includes("Lindblum (Discs I–II)") ||
  !sources.find((source) => source.id === "ffdq-glass-armlet")?.notes.includes("Treno (II)") ||
  !sources.find((source) => source.id === "ffdq-glass-armlet")?.notes.includes("does not identify a platform/build") ||
  !sources.find((source) => source.id === "ffwiki-shops")?.notes.includes("For Glass Armlet, Final Fantasy Wiki lists earlier Lindblum and Disc II Treno stock")
) {
  errors.push("The Glass Armlet route and source register must preserve the Japanese FFDQ and Final Fantasy Wiki later-table omissions as corroboration, not proof of unavailable stock.");
}
if (
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("gameclue-armlets") ||
  !sources.find((source) => source.id === "gameclue-armlets")?.notes.includes("Lindblum (Discs I–II) and Burmecia") ||
  !sources.find((source) => source.id === "gameclue-armlets")?.notes.includes("not proof that the candidate Disc III stock is unavailable") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.sourceIds.includes("gameclue-armlets") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.sourceIds.includes("ffdq-glass-armlet") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.sourceIds.includes("drslice-lindblum-disc3-armory") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.sourceIds.includes("neoseeker-lindblum-shops") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.steps.find((step) => step.id === "aerial-plan-route")?.detail?.includes("DrSlice's Disc III Dragoos's Armory table also omits it") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.steps.find((step) => step.id === "aerial-plan-route")?.detail?.includes("Neoseeker's indexed Lindblum Disc III–IV") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.steps.find((step) => step.id === "aerial-plan-route")?.detail?.includes("These source differences do not prove Disc III stock is absent") ||
  !walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")?.sections.find((section) => section.id === "aerial-lindblum-and-airship")?.steps.find((step) => step.id === "aerial-plan-route")?.detail?.includes("FFDQ.com's Japanese disc-indexed armlet table")
) {
  errors.push("GameClue's scoped Glass Armlet listing must be linked to the Lindblum candidate and framed as a non-conclusive source omission.");
}
if (
  !glassArmletDisc3LindblumCandidate?.conditions.includes("Xenomic's GameFAQs Item Location Guide") ||
  !glassArmletDisc3LindblumCandidate.conditions.includes("Discs II–III") ||
  !glassArmletDisc3LindblumCandidate.conditions.includes("older _ATadeo_ GameFAQs walkthrough") ||
  !glassArmletDisc3LindblumCandidate.conditions.includes("modern Items table") ||
  !glassArmletDisc3TrenoCandidate?.conditions.includes("both older GameFAQs item/equipment references name Treno only on Disc II") ||
  !glassArmletDisc3TrenoCandidate.conditions.includes("older GameFAQs walkthrough by _ATadeo_ list Glass Armlet for 250 Gil") ||
  !glassArmletDisc3TrenoCandidate.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !glassArmletDisc3LindblumCandidate?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !sources.find((source) => source.id === "gamefaqs-item-locations-54996")?.notes.includes("Glass Armlet location row lists Lindblum (Discs II–III)") ||
  !sources.find((source) => source.id === "gamefaqs-items-71891")?.notes.includes("Xenomic's older Item Location Guide instead lists Lindblum for Discs II–III")
) {
  errors.push("Glass Armlet's Lindblum candidate must preserve the positive Disc III Item Location listing against conflicting stock tables, while Treno must retain its older GameFAQs Disc II-only listings.");
}
const glassArmletAtadeoSource = sources.find((source) => source.id === "gamefaqs-walkthrough-9801");
const glassArmletDrSliceAlexandriaSource = sources.find((source) => source.id === "drslice-alexandria-armory");
const glassArmletDrSliceLindblumDisc3Source = sources.find((source) => source.id === "drslice-lindblum-disc3-armory");
const glassArmletDrSliceTrenoDisc3Source = sources.find((source) => source.id === "drslice-treno-disc3-armory");
const glassArmletNeoseekerLindblumSource = sources.find((source) => source.id === "neoseeker-lindblum-shops");
const glassArmletNeoseekerTrenoSource = sources.find((source) => source.id === "neoseeker-treno-shops");
if (
  !glassArmletAtadeoSource?.notes.includes("Disc III Alexandria and Treno equipment lists include Glass Armlet for 250 Gil") ||
  !glassArmletAtadeoSource.notes.includes("Lindblum Disc III list omits the armlet") ||
  !glassArmletDisc3TrenoCandidate?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !glassArmletDisc3TrenoCandidate.conditions.includes("older GameFAQs walkthrough by _ATadeo_ list Glass Armlet for 250 Gil in Treno's Disc III stock") ||
  !glassArmletDisc3LindblumCandidate?.conditions.includes("omits it from Lindblum's list") ||
  !glassArmletAlexandriaPath?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !glassArmletAlexandriaPath.conditions.includes("explicitly lists Glass Armlet for 250 Gil in Alexandria's Disc III equipment stock") ||
  !glassArmletAlexandriaPath.sourceIds.includes("drslice-alexandria-armory") ||
  !glassArmletAlexandriaPath.conditions.includes("DrSlice independently lists the item for 250 Gil") ||
  !glassArmletDrSliceAlexandriaSource?.url.includes("/shop/36") ||
  !glassArmletDrSliceAlexandriaSource.notes.includes("Alexandria (Disk 3)") ||
  !glassArmletDrSliceAlexandriaSource.notes.includes("does not identify the stock-change trigger") ||
  !glassArmletDrSliceLindblumDisc3Source?.url.includes("/shop/14") ||
  !glassArmletDrSliceLindblumDisc3Source.notes.includes("Lindblum (Disk 3)") ||
  !glassArmletDrSliceLindblumDisc3Source.notes.includes("does not list Glass Armlet") ||
  !glassArmletDrSliceTrenoDisc3Source?.url.includes("/shop/21") ||
  !glassArmletDrSliceTrenoDisc3Source.notes.includes("Treno (Disk 3)") ||
  !glassArmletDrSliceTrenoDisc3Source.notes.includes("does not list Glass Armlet") ||
  !glassArmletNeoseekerTrenoSource?.url.includes("/wiki/Treno") ||
  !glassArmletNeoseekerTrenoSource.notes.includes("Disc II list includes Glass Armlet") ||
  !glassArmletNeoseekerTrenoSource.notes.includes("Disc III–IV table omits it") ||
  !glassArmletNeoseekerTrenoSource.notes.includes("returned 403") ||
  !glassArmletNeoseekerLindblumSource?.url.includes("/wiki/Lindblum_%28FFIX%29") ||
  !glassArmletNeoseekerLindblumSource.notes.includes("Disc II table") ||
  !glassArmletNeoseekerLindblumSource.notes.includes("omits it from the Disc III–IV") ||
  !glassArmletNeoseekerLindblumSource.notes.includes("returned 403") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("drslice-alexandria-armory") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("drslice-lindblum-disc3-armory") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("drslice-treno-disc3-armory") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("neoseeker-lindblum-shops") ||
  !gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("neoseeker-treno-shops")
) {
  errors.push("The older _ATadeo_ walkthrough and DrSlice Alexandria table must support only their documented Disc III seller listings without resolving the unverified city candidates.");
}
if (
  !glassArmletDisc3TrenoSection?.sourceIds.includes("gamefaqs-item-locations-54996") ||
  !glassArmletDisc3TrenoSection?.sourceIds.includes("gamefaqs-shops-71891") ||
  !glassArmletDisc3TrenoSection?.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !glassArmletDisc3TrenoSection?.sourceIds.includes("gameclue-armlets") ||
  !glassArmletDisc3TrenoSection?.sourceIds.includes("drslice-treno-disc3-armory") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("inspect Treno's displayed weapon stock") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("FFDQ.com's Japanese disc-indexed armlet table") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("DrSlice's Disc III Knight's Residence Armory omit the armlet") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("older positive listing does not establish the in-game stock window") ||
  !glassArmletDisc3TrenoSection?.steps.find((step) => step.id === "card-tournament-queen-stella")?.detail?.includes("Buy only if it appears")
) {
  errors.push("The first Disc III Treno stop must expose the uncertain Glass Armlet stock check with its source links and caveat.");
}
const linenCuirassDisc2Candidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.linen-cuirass-disc-ii-candidate");
const linenCuirassRecoveryObjective = objectivesById.get("disc-2.return-to-lindblum.cleyra-recovery-shops");
const linenCuirassRecoverySection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-lindblum")?.sections.find((section) => section.id === "return-lindblum-business-district");
const linenCuirassRecoveryStep = linenCuirassRecoverySection?.steps.find((step) => step.id === "return-lindblum-shop-preparation");
if (
  !linenCuirassDisc2Candidate ||
  linenCuirassDisc2Candidate.availability !== "window-unverified" ||
  linenCuirassDisc2Candidate.cost?.amount !== 800 ||
  !linenCuirassDisc2Candidate.conditions.includes("GameFAQs' Disc II Shops table lists Linen Cuirass for 800 Gil") ||
  !linenCuirassDisc2Candidate.conditions.includes("RPGClassics' post-attack Lindblum Dragoos table and Final Fantasy Wiki's Disc II Dragoos table omit it") ||
  !linenCuirassDisc2Candidate.conditions.includes("buy only if the displayed stock confirms it") ||
  !linenCuirassDisc2Candidate.sourceIds.includes("rpgclassics-shops") ||
  !linenCuirassDisc2Candidate.sourceIds.includes("ffwiki-lindblum") ||
  !gameItems.find((item) => item.id === "game-item.linen-cuirass")?.sourceIds.includes("rpgclassics-shops") ||
  !gameItems.find((item) => item.id === "game-item.linen-cuirass")?.sourceIds.includes("ffwiki-lindblum") ||
  !linenCuirassRecoveryObjective?.sourceIds.includes("rpgclassics-shops") ||
  !linenCuirassRecoveryObjective?.sourceIds.includes("ffwiki-lindblum") ||
  !linenCuirassRecoverySection?.sourceIds.includes("rpgclassics-shops") ||
  !linenCuirassRecoverySection?.sourceIds.includes("ffwiki-lindblum") ||
  !linenCuirassRecoverySection?.sourceIds.includes("neoseeker-lindblum-shops") ||
  !linenCuirassRecoveryStep?.detail?.includes("source-disputed, window-unverified candidate and buy only if it appears in the displayed stock") ||
  !sources.find((source) => source.id === "rpgclassics-shops")?.notes.includes("post-attack Disc II Lindblum Dragoos table omits Linen Cuirass") ||
  !sources.find((source) => source.id === "ffwiki-lindblum")?.notes.includes("omits it from the Disc II Dragoos' Weapon Shop list") ||
  !sources.find((source) => source.id === "neoseeker-lindblum-shops")?.notes.includes("lists Linen Cuirass for 800 Gil in the general Dragoos' Armory table") ||
  !sources.find((source) => source.id === "neoseeker-lindblum-shops")?.notes.includes("returned 403") ||
  !gameItems.find((item) => item.id === "game-item.linen-cuirass")?.sourceIds.includes("neoseeker-lindblum-shops") ||
  !linenCuirassRecoveryObjective?.sourceIds.includes("neoseeker-lindblum-shops")
) {
  errors.push("The post-Cleyra Linen Cuirass candidate must preserve GameFAQs' positive Lindblum stock listing against RPGClassics and Final Fantasy Wiki omissions, without resolving the shop window.");
}
const leatherWristPreCleyraPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.leather-wrist-shop");
const leatherWristTrenoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.leather-wrist-shop");
const leatherWristDisc2LindblumPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.leather-wrist-shop");
const leatherWristBmvPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.outer-continent.leather-wrist-black-mage-village-shop");
const lindblumArmGearObjective = objectivesById.get("disc-2.return-to-lindblum.arm-gear-stock");
const lindblumArmGearStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.return-to-lindblum")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "return-lindblum-shop-preparation");
if (
  !leatherWristPreCleyraPath ||
  leatherWristPreCleyraPath.availability !== "limited-window" ||
  !leatherWristPreCleyraPath.conditions.includes("until Cleyra is completed") ||
  !leatherWristPreCleyraPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !leatherWristTrenoPath ||
  leatherWristTrenoPath.availability !== "limited-window" ||
  !leatherWristTrenoPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !leatherWristTrenoPath.sourceIds.includes("jegged-arm-gear") ||
  !leatherWristDisc2LindblumPath ||
  leatherWristDisc2LindblumPath.itemId !== "game-item.leather-wrist" ||
  leatherWristDisc2LindblumPath.chapterId !== "disc-2.return-to-lindblum" ||
  leatherWristDisc2LindblumPath.shopId !== "lindblum.weapon-shop.disc-2" ||
  leatherWristDisc2LindblumPath.availability !== "limited-window" ||
  leatherWristDisc2LindblumPath.cost?.amount !== 200 ||
  !leatherWristDisc2LindblumPath.conditions.includes("before leaving Middle Lindblum") ||
  !leatherWristDisc2LindblumPath.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.arm-gear-stock") ||
  !leatherWristDisc2LindblumPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !leatherWristBmvPath ||
  leatherWristBmvPath.availability !== "limited-window" ||
  !leatherWristBmvPath.conditions.includes("Disc IV") ||
  !leatherWristBmvPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !leatherWristBmvPath.sourceIds.includes("jegged-arm-gear") ||
  lindblumArmGearObjective?.category !== "collection" ||
  !lindblumArmGearObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  !lindblumArmGearStep?.objectiveIds?.includes("disc-2.return-to-lindblum.arm-gear-stock")
) {
  errors.push("Leather Wrist's Lindblum, Treno, and Black Mage Village stock windows and the Disc II Lindblum walkthrough objective must match the cited tables.");
}
const ralvuimagoEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.return-to-alexandria.ralvuimago");
const ralvuimagoRecord = enemyRecords.find((enemy) => enemy.id === "enemy.ralvuimago");
const ralvuimagoHpClaims = ralvuimagoRecord?.stats.filter((stat) => stat.field === "HP") ?? [];
const ralvuimagoPreparation = ralvuimagoRecord?.preparationGuidance;
const ralvuimagoPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-alexandria")?.sections.find((section) => section.id === "return-alexandria-gargan-roo");
const ralvuimagoPreparationStep = ralvuimagoPreparationSection?.steps.find((step) => step.id === "return-alexandria-mosh-letter");
const ralvuimagoPrepCombatStep = ralvuimagoPreparationSection?.steps.find((step) => step.id === "return-alexandria-ralvuimago-steals");
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
  !ralvuimagoPreparation || ralvuimagoPreparation.suggestedLevelRange !== undefined ||
  !ralvuimagoPreparation.levelRationale.includes("enemy stat") || !ralvuimagoPreparation.levelRationale.includes("party-level target") ||
  !ralvuimagoPreparation.difficultyAssessment?.includes("Fair") ||
  !ralvuimagoPreparation.optionalGrinding.includes("Crawler") ||
  !ralvuimagoPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !ralvuimagoPreparation.sourceIds.includes("kamigame-ralvuimago") ||
  !ralvuimagoPreparation.sourceIds.includes("gamefaqs-treno-71891") ||
  !ralvuimagoPreparation.setupAdvice.includes("all damage or only physical hits") ||
  !ralvuimagoPreparation.setupAdvice.includes("open phase") ||
  !ralvuimagoPreparationSection?.sourceIds.includes("kamigame-ralvuimago") ||
  !ralvuimagoPreparationStep?.text.includes("check Zidane, Dagger, and Vivi") ||
  !ralvuimagoPrepCombatStep?.detail?.includes("not a party target") ||
  !ralvuimagoRecord.notes.some((note) => note.includes("5,709") && note.includes("3,352")) ||
  !ralvuimagoRecord.notes.some((note) => note.includes("Semi-Rare") && note.includes("Rare")) ||
  !ralvuimagoRecord.notes.some((note) => note.includes("all damage or only physical hits")) ||
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
const grottoRandomPoolId = "encounter.gizamaluke-grotto.random-pool";
const grottoTypeAFights = [
  enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.type-a-first-pair"),
  enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.type-a-second-pair"),
];
const gizamalukeEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.gizamaluke-grotto.gizamaluke");
const gizamalukeRecord = enemyRecords.find((enemy) => enemy.id === "enemy.gizamaluke");
const grottoRoamingEnemyIds = ["enemy.hornet", "enemy.lamia", "enemy.skeleton"];
const grottoTypeARecord = enemyRecords.find((enemy) => enemy.id === "enemy.type-a");
const gizamalukeElixirStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.journey-to-burmecia.elixir-gizamaluke-steal");
const gizamalukeIceStaffStealPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.journey-to-burmecia.ice-staff-gizamaluke-steal");
const cleyraIceStaffPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.ice-staff-trunk-chest");
if (!grottoPool || grottoPool.kind !== "random-pool" || grottoPool.formation.length !== grottoRoamingEnemyIds.length ||
  grottoRoamingEnemyIds.some((enemyId) => !grottoPool.formation.some((member) => member.enemyId === enemyId && member.quantity === null)) ||
  grottoPool.formation.some((member) => member.enemyId === "enemy.type-a") ||
  !grottoTypeARecord || grottoTypeARecord.encounterIds.includes(grottoRandomPoolId) ||
  grottoTypeAFights.some((encounter) => !encounter || encounter.kind !== "fixed" || !encounter.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2)) ||
  !gizamalukeEncounter || gizamalukeEncounter.kind !== "boss" || !gizamalukeEncounter.formation.some((member) => member.enemyId === "enemy.gizamaluke" && member.quantity === 1) ||
  !gizamalukeRecord || gizamalukeRecord.kind !== "boss" || gizamalukeRecord.stats.find((stat) => stat.field === "HP")?.value !== 3175 ||
  !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.elixir") || !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.magus-hat") ||
  !gizamalukeRecord.steals.some((slot) => slot.itemId === "game-item.ice-staff") || !gizamalukeRecord.drops.some((slot) => slot.itemId === "game-item.tent") ||
  !gizamalukeRecord.missableIds.includes("missable.disc-1.journey-to-burmecia.gizamaluke-steals") ||
  !gizamalukeElixirStealPath || gizamalukeElixirStealPath.method !== "steal" || !gizamalukeElixirStealPath.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.gizamaluke-steals") ||
  !gizamalukeIceStaffStealPath || gizamalukeIceStaffStealPath.method !== "steal" ||
  !cleyraIceStaffPath || cleyraIceStaffPath.method !== "chest" || cleyraIceStaffPath.chapterId !== "disc-2.cleyra") {
  errors.push("Gizamaluke's Grotto must separate the three roaming enemies from its two fixed Type A pairs and retain the boss steal warning and later Ice Staff recovery.");
}
const gizamalukeBossLootPaths = [
  { id: "item-path.disc-1.journey-to-burmecia.elixir-gizamaluke-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
  { id: "item-path.disc-1.journey-to-burmecia.magus-hat-gizamaluke-steal", itemId: "game-item.magus-hat", method: "steal", slot: "uncommon", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
  { id: "item-path.disc-1.journey-to-burmecia.ice-staff-gizamaluke-steal", itemId: "game-item.ice-staff", method: "steal", slot: "semi-rare", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
  { id: "item-path.disc-1.journey-to-burmecia.gizamaluke-tent-always-drop", itemId: "game-item.tent", method: "drop", slot: "always", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-drops" },
];
if (itemAcquisitionPaths.filter((path) => gizamalukeBossLootPaths.some((expected) => expected.id === path.id)).length !== gizamalukeBossLootPaths.length) {
  errors.push("Gizamaluke must retain paths for its three named steals and Always Tent drop.");
}
for (const expected of gizamalukeBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const slot = (expected.method === "steal" ? gizamalukeRecord?.steals : gizamalukeRecord?.drops)?.find((entry) => entry.slot === expected.slot);
  const objective = objectivesById.get(expected.objectiveId);
  const requiredSources = new Set([...(gizamalukeRecord?.sourceIds ?? []), ...(gizamalukeEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? []), ...(objective?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    slot.itemId !== expected.itemId ||
    path.itemId !== expected.itemId ||
    path.method !== expected.method ||
    path.chapterId !== "disc-1.journey-to-burmecia" ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.gizamaluke" ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.gizamaluke-grotto.gizamaluke"]) ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) ||
    (expected.method === "steal" && !path.conditions?.includes("chance-based")) ||
    (expected.method === "drop" && (!path.conditions?.includes("Always") || !path.conditions.includes("victory"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Gizamaluke path ${expected.id} must match its exact enemy slot, one-time encounter, outcome, objective, and provenance.`);
  }
}
const grottoRegularLootExpectations = [
  ["enemy.hornet", "steal", "common", "game-item.potion", "hornet-potion-common-steal"],
  ["enemy.hornet", "drop", "common", "game-item.potion", "hornet-potion-common-drop"],
  ["enemy.hornet", "drop", "rare", "game-item.ether", "hornet-ether-rare-drop"],
  ["enemy.lamia", "steal", "common", "game-item.ore", "lamia-ore-common-steal"],
  ["enemy.lamia", "steal", "uncommon", "game-item.phoenix-down", "lamia-phoenix-down-uncommon-steal"],
  ["enemy.lamia", "drop", "always", "game-item.potion", "lamia-potion-always-drop"],
  ["enemy.lamia", "drop", "common", "game-item.phoenix-down", "lamia-phoenix-down-common-drop"],
  ["enemy.lamia", "drop", "uncommon", "game-item.ether", "lamia-ether-uncommon-drop"],
  ["enemy.skeleton", "steal", "common", "game-item.ore", "skeleton-ore-common-steal"],
  ["enemy.skeleton", "steal", "uncommon", "game-item.hi-potion", "skeleton-hi-potion-uncommon-steal"],
  ["enemy.skeleton", "steal", "rare", "game-item.ether", "skeleton-ether-rare-steal"],
  ["enemy.skeleton", "drop", "common", "game-item.potion", "skeleton-potion-common-drop"],
  ["enemy.skeleton", "drop", "uncommon", "game-item.phoenix-down", "skeleton-phoenix-down-uncommon-drop"],
  ["enemy.type-a", "steal", "common", "game-item.phoenix-down", "type-a-phoenix-down-common-steal"],
  ["enemy.type-a", "steal", "uncommon", "game-item.tent", "type-a-tent-uncommon-steal"],
  ["enemy.type-a", "drop", "common", "game-item.potion", "type-a-potion-common-drop"],
  ["enemy.type-a", "drop", "uncommon", "game-item.phoenix-down", "type-a-phoenix-down-uncommon-drop"],
  ["enemy.type-a", "drop", "rare", "game-item.ether", "type-a-ether-rare-drop"],
];
const grottoRegularLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke"];
const grottoRegularLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")?.sections
  .find((section) => section.id === "journey-grotto-bells");
const grottoRegularLootStep = grottoRegularLootSection?.steps.find((step) => step.id === "journey-grotto-regular-enemy-loot");
const grottoRegularLootPathPrefix = "item-path.disc-1.journey-to-burmecia.grotto-";
if (!grottoRegularLootSection || !grottoRegularLootStep?.text.includes("Lamia's Always Potion is guaranteed on a KO") ||
  !grottoRegularLootStep.text.includes("all Grotto drops require KO victories") ||
  !grottoRegularLootStep.detail?.includes("Type A item routes are linked to each fixed pair separately") ||
  !grottoRegularLootStep.detail.includes("No random formation or encounter rate is inferred") ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(grottoRegularLootPathPrefix)).length !== 23 ||
  grottoRegularLootSourceIds.some((sourceId) => !grottoPool?.sourceIds.includes(sourceId) ||
    !grottoRegularLootSection.sourceIds.includes(sourceId))) {
  errors.push("Gizamaluke's Grotto loot guidance must preserve the guaranteed Lamia Always drop, KO requirement, separate Type A encounter paths, and source chain.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of grottoRegularLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
  const item = gameItems.find((entry) => entry.id === itemId);
  const fixedPair = enemyId === "enemy.type-a";
  const encounterChoices = fixedPair
    ? [
      ["first-pair", "encounter.gizamaluke-grotto.type-a-first-pair"],
      ["second-pair", "encounter.gizamaluke-grotto.type-a-second-pair"],
    ]
    : [["", grottoRandomPoolId]];
  if (!lootSlot || !item?.sourceIds.includes("gamefaqs-enemy-list-71891")) {
    errors.push(`Gizamaluke's Grotto ${enemyId} ${method} slot ${slotName} must exist in the enemy and item tables.`);
    continue;
  }
  for (const [pairSlug, encounterId] of encounterChoices) {
    const pathSlug = fixedPair ? `type-a-${pairSlug}-${pathSuffix.slice("type-a-".length)}` : pathSuffix;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `${grottoRegularLootPathPrefix}${pathSlug}`);
    const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
    const expectedSources = new Set([
      ...grottoRegularLootSourceIds,
      ...(enemy?.sourceIds ?? []),
      ...(encounter?.sourceIds ?? []),
      ...lootSlot.sourceIds,
    ]);
    if (!path || path.itemId !== itemId || path.chapterId !== "disc-1.journey-to-burmecia" || path.method !== method ||
      path.quantity !== (fixedPair ? 2 : 1) || path.availability !== (fixedPair ? "one-time-encounter" : "repeatable") ||
      path.enemyId !== enemyId || path.enemyLootSlot !== slotName ||
      JSON.stringify(path.encounterIds) !== JSON.stringify([encounterId]) || path.walkthroughObjectiveIds?.length ||
      (method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("not guaranteed"))) ||
      (method === "drop" && (!path.conditions?.includes("normal KO victory") ||
        (slotName === "always" ? !path.conditions.includes("Always drop slot yields") || path.conditions.includes("conditional")
          : !path.conditions.includes("chance-based") || !path.conditions.includes("conditional")))) ||
      (fixedPair && (!path.conditions?.includes("two Type A enemies") || !path.notes?.includes("Quantity two records one loot opportunity"))) ||
      [...expectedSources].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId)) ||
      grottoRegularLootSection?.sourceIds.some((sourceId) => expectedSources.has(sourceId) && !path.sourceIds.includes(sourceId))) {
      errors.push(`Gizamaluke's Grotto ${enemyId} ${method} path ${pathSlug} must match its exact enemy, slot, encounter, quantity, and source provenance.`);
    }
  }
}
const gizamalukePreparation = gizamalukeRecord?.preparationGuidance;
const gizamalukePrepSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")?.sections.find((section) => section.id === "journey-grotto-boss");
const gizamalukePrepStep = gizamalukePrepSection?.steps.find((step) => step.id === "journey-gizamaluke-preparation");
if (!gizamalukePreparation || gizamalukePreparation.suggestedLevelRange !== undefined ||
  !gizamalukePreparation.levelRationale.includes("not a party target") ||
  !gizamalukePreparation.levelRationale.includes("challenge route") ||
  !gizamalukePreparation.sourceIds.includes("gamefaqs-single-character-27398") ||
  !gizamalukePrepSection?.sourceIds.includes("gamefaqs-single-character-27398") ||
  !gizamalukePrepStep?.detail?.includes("route-specific")) {
  errors.push("Gizamaluke preparation must keep its Level 16 enemy stat separate from the challenge-only Lv. 15 target and mirror that caveat in the route.");
}
const hilgigarsPrepRecord = enemyRecords.find((enemy) => enemy.id === "enemy.hilgigars");
const hilgigarsPreparation = hilgigarsPrepRecord?.preparationGuidance;
const hilgigarsPrepSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.conde-petie-mountain-path")?.sections.find((section) => section.id === "mountain-path-hilgigars-and-stones");
const hilgigarsPrepStep = hilgigarsPrepSection?.steps.find((step) => step.id === "mountain-path-encounters-and-boss-prep");
if (!hilgigarsPreparation || hilgigarsPreparation.suggestedLevelRange !== undefined ||
  !hilgigarsPreparation.levelRationale.includes("21 or higher") ||
  !hilgigarsPreparation.levelRationale.includes("single-source") ||
  !hilgigarsPreparation.levelRationale.includes("enemy's stat") ||
  !hilgigarsPreparation.sourceIds.includes("kamigame-hilgigars") ||
  !hilgigarsPreparation.sourceIds.includes("gamefaqs-conde-petie-mountain-path-71891") ||
  !hilgigarsPrepSection?.sourceIds.includes("kamigame-hilgigars") ||
  !hilgigarsPrepStep?.text.includes("Lv. 21 or higher") ||
  !hilgigarsPrepStep.detail?.includes("does not identify the platform or build") ||
  !hilgigarsPrepStep.detail.includes("Excalibur II")) {
  errors.push("Hilgigars preparation must retain the optional, single-source Lv. 21+ benchmark, distinguish it from the enemy's Level 28 stat, and keep timed low-EXP routes separate.");
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
  { itemId: "game-item.phoenix-down", slot: "common", pathId: "item-path.burmecia.phoenix-down-beatrix" },
  { itemId: "game-item.chain-plate", slot: "uncommon", pathId: "item-path.burmecia.beatrix-chain-plate" },
  { itemId: "game-item.mythril-sword", slot: "rare", pathId: "item-path.burmecia.beatrix-mythril-sword" },
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
const burmeciaCityLootExpectations = [
  ["enemy.basilisk", "steal", "common", "game-item.soft", "basilisk-soft-common-steal"],
  ["enemy.basilisk", "steal", "uncommon", "game-item.hi-potion", "basilisk-hi-potion-uncommon-steal"],
  ["enemy.basilisk", "drop", "always", "game-item.potion", "basilisk-potion-always-drop"],
  ["enemy.basilisk", "drop", "common", "game-item.soft", "basilisk-soft-common-drop"],
  ["enemy.basilisk", "drop", "uncommon", "game-item.hi-potion", "basilisk-hi-potion-uncommon-drop"],
  ["enemy.basilisk", "drop", "rare", "game-item.soft", "basilisk-soft-rare-drop"],
  ["enemy.ironite", "steal", "common", "game-item.hi-potion", "ironite-hi-potion-common-steal"],
  ["enemy.ironite", "steal", "uncommon", "game-item.soft", "ironite-soft-uncommon-steal"],
  ["enemy.ironite", "drop", "always", "game-item.hi-potion", "ironite-hi-potion-always-drop"],
  ["enemy.ironite", "drop", "common", "game-item.phoenix-down", "ironite-phoenix-down-common-drop"],
  ["enemy.ironite", "drop", "uncommon", "game-item.soft", "ironite-soft-uncommon-drop"],
  ["enemy.ironite", "drop", "rare", "game-item.ether", "ironite-ether-rare-drop"],
  ["enemy.magic-vice", "steal", "common", "game-item.echo-screen", "magic-vice-echo-screen-common-steal"],
  ["enemy.magic-vice", "steal", "uncommon", "game-item.ether", "magic-vice-ether-uncommon-steal"],
  ["enemy.magic-vice", "steal", "semi-rare", "game-item.ether", "magic-vice-ether-semi-rare-steal"],
  ["enemy.magic-vice", "steal", "rare", "game-item.ether", "magic-vice-ether-rare-steal"],
  ["enemy.magic-vice", "drop", "common", "game-item.ether", "magic-vice-ether-common-drop"],
];
const burmeciaCityLootSourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-burmecia-71891", "jegged-burmecia"];
const burmeciaCityLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")?.sections
  .find((section) => section.id === "burmecia-lower-streets");
const burmeciaCityLootStep = burmeciaCityLootSection?.steps.find((step) => step.id === "burmecia-city-regular-enemy-loot");
const burmeciaCityLootPathPrefix = "item-path.disc-1.burmecia.city-";
if (!burmeciaCityLootStep?.text.includes("defeat enemies with KO for their drop slots") ||
  !burmeciaCityLootStep.detail?.includes("all 17 item-bearing steal and drop slots") ||
  !burmeciaCityLootStep.detail.includes("Magic Vice Common steal route follows the GameFAQs Enemy List and Jegged table") ||
  burmeciaCityLootStep.objectiveIds?.length ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(burmeciaCityLootPathPrefix)).length !== burmeciaCityLootExpectations.length ||
  burmeciaCityLootSourceIds.some((sourceId) => !burmeciaCityPool?.sourceIds.includes(sourceId) ||
    !burmeciaCityLootSection?.sourceIds.includes(sourceId))) {
  errors.push("Burmecia city loot guidance must cover the item-slot routes, preserve the Magic Vice Common steal disagreement, and avoid inventing checklist objectives.");
}
for (const [enemyId, method, slotName, itemId, pathSuffix] of burmeciaCityLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `${burmeciaCityLootPathPrefix}${pathSuffix}`);
  const isMagicViceDispute = enemyId === "enemy.magic-vice" && method === "steal" && slotName === "common";
  if (!slots?.some((slot) => slot.slot === slotName && slot.itemId === itemId) ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.burmecia" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || path.walkthroughObjectiveIds?.length ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "drop" && (!path.conditions?.includes("KO victory") ||
      (slotName === "always" ? !path.conditions.includes("Always drop slot yields") || path.conditions.includes("conditional")
        : !path.conditions.includes("conditional")))) ||
    (isMagicViceDispute && (!path.notes?.includes("GameFAQs and Jegged list Echo Screen") ||
      !path.notes.includes("EliteGrindLab lists Eye Drops") || !path.sourceIds.includes("elitegrindlab-burmecia"))) ||
    burmeciaCityLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !enemy?.sourceIds.includes(sourceId) || !burmeciaCityPool?.sourceIds.includes(sourceId) ||
      !burmeciaCityLootSection?.sourceIds.includes(sourceId))) {
    errors.push(`Burmecia ${enemyId} ${method} path ${pathSuffix} must match its enemy slot, preserve KO/Always behavior, and retain route provenance.`);
  }
}
const burmeciaMimicEncounterExpectations = [
  { slug: "suburb-balcony", encounterId: "encounter.burmecia.suburb.mimic-chest-1" },
  { slug: "suburb-stairwell", encounterId: "encounter.burmecia.suburb.mimic-chest-2" },
  { slug: "uptown", encounterId: "encounter.burmecia.uptown.mimic-chest" },
];
const burmeciaMimicLootExpectations = [
  { id: "steal-hi-potion", method: "steal", slot: "common", itemId: "game-item.hi-potion" },
  { id: "steal-antidote", method: "steal", slot: "uncommon", itemId: "game-item.antidote" },
  { id: "drop-ether-always", method: "drop", slot: "always", itemId: "game-item.ether" },
  { id: "drop-hi-potion-common", method: "drop", slot: "common", itemId: "game-item.hi-potion" },
  { id: "drop-phoenix-down-uncommon", method: "drop", slot: "uncommon", itemId: "game-item.phoenix-down" },
  { id: "drop-ether-rare", method: "drop", slot: "rare", itemId: "game-item.ether" },
];
const burmeciaMimicLootPathPrefix = "item-path.disc-1.burmecia.mimic-";
const burmeciaMimicLootStep = burmeciaCityLootSection?.steps.find((step) => step.id === "burmecia-mimic-chest-loot");
const burmeciaMimicLootStepSourceIds = [
  "gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "elitegrindlab-burmecia",
  "gamefaqs-enemy-list-71891", "drslice-mimic", "opatil-drop-list", "megane-kangaroo-disc4-burmecia-recovery",
];
if (itemAcquisitionPaths.filter((path) => path.id.startsWith(burmeciaMimicLootPathPrefix)).length !== 18 ||
  burmeciaMimicEncounterExpectations.some(({ encounterId }) => !burmeciaMimicEncounters.some((encounter) => encounter?.id === encounterId)) ||
  burmeciaMimicLootStep?.kind !== "optional" ||
  !burmeciaMimicLootStep.text.includes("Common Hi-Potion and Uncommon Antidote") ||
  !burmeciaMimicLootStep.text.includes("either steal can fail") ||
  !burmeciaMimicLootStep.detail?.includes("not requirements for the Burmecia treasure-sweep checklist") ||
  burmeciaMimicLootStep.objectiveIds?.length ||
  burmeciaMimicLootStepSourceIds.some((sourceId) => !burmeciaCityLootSection?.sourceIds.includes(sourceId))) {
  errors.push("Burmecia's three Mimic chests must have separate optional loot guidance, all eighteen exact paths, and no implied treasure-sweep requirement.");
}
for (const chest of burmeciaMimicEncounterExpectations) {
  const encounter = enemyEncounters.find((entry) => entry.id === chest.encounterId);
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.mimic");
  for (const expected of burmeciaMimicLootExpectations) {
    const slots = expected.method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = slots?.find((slot) => slot.slot === expected.slot && slot.itemId === expected.itemId);
    const item = gameItems.find((entry) => entry.id === expected.itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === `${burmeciaMimicLootPathPrefix}${chest.slug}.${expected.id}`);
    const expectedSources = new Set([
      ...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? []), "drslice-mimic",
      ...(expected.method === "drop" ? ["opatil-drop-list"] : []),
    ]);
    if (!encounter || encounter.kind !== "fixed" ||
      !encounter.formation.some((member) => member.enemyId === "enemy.mimic" && member.quantity === 1) ||
      !lootSlot || !path || path.itemId !== expected.itemId || path.chapterId !== "disc-1.burmecia" ||
      path.method !== expected.method || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
      path.walkthroughObjectiveIds?.length || path.enemyId !== "enemy.mimic" || path.enemyLootSlot !== expected.slot ||
      JSON.stringify(path.encounterIds) !== JSON.stringify([chest.encounterId]) ||
      !path.notes?.includes("same encounter if its chest was left unopened earlier") ||
      (expected.method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
      (expected.method === "drop" && (!path.conditions?.includes("KO defeat") ||
        (expected.slot === "always"
          ? !path.conditions.includes("Always drop slot yields Ether") || path.conditions.includes("conditional")
          : !path.conditions.includes("chance-based") || !path.conditions.includes("conditional")))) ||
      !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
      [...expectedSources].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId))) {
      errors.push(`Burmecia Mimic ${chest.slug} ${expected.method} path ${expected.id} must match the exact enemy slot, chest encounter, outcome, and provenance.`);
    }
  }
}
const burmeciaTypeALootExpectations = [
  ["steal", "common", "game-item.phoenix-down", "phoenix-down-common-steal"],
  ["steal", "uncommon", "game-item.tent", "tent-uncommon-steal"],
  ["drop", "common", "game-item.potion", "potion-common-drop"],
  ["drop", "uncommon", "game-item.phoenix-down", "phoenix-down-uncommon-drop"],
  ["drop", "rare", "game-item.ether", "ether-rare-drop"],
];
const burmeciaTypeALootPathPrefix = "item-path.disc-1.burmecia.type-a-pair-";
const burmeciaTypeALootStep = burmeciaCityLootSection?.steps.find((step) => step.id === "burmecia-type-a-pair-loot");
if (!burmeciaTypeAPair || burmeciaTypeAPair.kind !== "fixed" ||
  !burmeciaTypeAPair.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2) ||
  !burmeciaTypeALootStep?.text.includes("Common Phoenix Down and Uncommon Tent steals") ||
  !burmeciaTypeALootStep.text.includes("either attempt can fail") ||
  !burmeciaTypeALootStep.detail?.includes("each listed slot has two per-enemy opportunities") ||
  !burmeciaTypeALootStep.detail.includes("separate from the two fixed Type A pairs in Gizamaluke's Grotto") ||
  burmeciaTypeALootStep.objectiveIds?.length ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(burmeciaTypeALootPathPrefix)).length !== burmeciaTypeALootExpectations.length) {
  errors.push("Burmecia's fixed Type A pair must expose its two per-enemy loot opportunities separately from Gizamaluke's Grotto and avoid inventing collection objectives.");
}
for (const [method, slotName, itemId, pathSuffix] of burmeciaTypeALootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.type-a");
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const item = gameItems.find((entry) => entry.id === itemId);
  const path = itemAcquisitionPaths.find((entry) => entry.id === `${burmeciaTypeALootPathPrefix}${pathSuffix}`);
  const lootSlot = slots?.find((slot) => slot.slot === slotName && slot.itemId === itemId);
  const requiredSources = new Set([...(burmeciaTypeAPair?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
  if (!lootSlot ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.burmecia" || path.method !== method ||
    path.quantity !== 2 || path.availability !== "one-time-encounter" || path.walkthroughObjectiveIds?.length ||
    path.enemyId !== "enemy.type-a" || path.enemyLootSlot !== slotName ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.burmecia.type-a-pair"]) ||
    !path.conditions?.includes("at most two") ||
    !path.notes?.includes("two per-enemy slot opportunities") || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    (method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
    (method === "drop" && (!path.conditions?.includes("KO victories") || !path.conditions.includes("slot is conditional"))) ||
    [...requiredSources].some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !item?.sourceIds.includes(sourceId) || !burmeciaTypeAPair?.sourceIds.includes(sourceId) ||
      !burmeciaCityLootSection?.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId))) {
    errors.push(`Burmecia Type A ${method} path ${pathSuffix} must match the shared enemy table, two-enemy quantity, one-time window, and source chain.`);
  }
}
const burmeciaRegionLootExpectations = [
  ["enemy.lizard-man", "steal", "common", "game-item.ore"],
  ["enemy.lizard-man", "steal", "uncommon", "game-item.tent"],
  ["enemy.lizard-man", "drop", "common", "game-item.ore"],
  ["enemy.lizard-man", "drop", "uncommon", "game-item.phoenix-down"],
  ["enemy.lizard-man", "drop", "rare", "game-item.ether"],
  ["enemy.nymph", "steal", "common", "game-item.echo-screen"],
  ["enemy.nymph", "steal", "uncommon", "game-item.ore"],
  ["enemy.nymph", "steal", "semi-rare", "game-item.hi-potion"],
  ["enemy.nymph", "steal", "rare", "game-item.phoenix-pinion"],
  ["enemy.nymph", "drop", "common", "game-item.potion"],
  ["enemy.nymph", "drop", "uncommon", "game-item.annoyntment"],
  ["enemy.nymph", "drop", "rare", "game-item.ether"],
  ["enemy.sand-scorpion", "steal", "common", "game-item.ore"],
  ["enemy.sand-scorpion", "steal", "uncommon", "game-item.antidote"],
  ["enemy.sand-scorpion", "steal", "rare", "game-item.ether"],
  ["enemy.sand-scorpion", "drop", "always", "game-item.potion"],
  ["enemy.sand-scorpion", "drop", "common", "game-item.annoyntment"],
  ["enemy.sand-scorpion", "drop", "uncommon", "game-item.hi-potion"],
  ["enemy.sand-scorpion", "drop", "rare", "game-item.hi-potion"],
  ["enemy.skeleton", "steal", "common", "game-item.ore"],
  ["enemy.skeleton", "steal", "uncommon", "game-item.hi-potion"],
  ["enemy.skeleton", "steal", "rare", "game-item.ether"],
  ["enemy.skeleton", "drop", "common", "game-item.potion"],
  ["enemy.skeleton", "drop", "uncommon", "game-item.phoenix-down"],
  ["enemy.yeti", "steal", "common", "game-item.eye-drops"],
  ["enemy.yeti", "steal", "uncommon", "game-item.ore"],
  ["enemy.yeti", "steal", "semi-rare", "game-item.hi-potion"],
  ["enemy.yeti", "drop", "common", "game-item.potion"],
  ["enemy.yeti", "drop", "uncommon", "game-item.eye-drops"],
  ["enemy.yeti", "drop", "rare", "game-item.ether"],
];
const burmeciaRegionLootSourceIds = [
  "gamefaqs-enemy-list-71891",
  "gamefaqs-journey-to-burmecia-71891",
  "jegged-gizamaluke",
  "cavesofnarshe-enemies",
  "elitegrindlab-burmecia",
];
const burmeciaRegionLootPrefix = "item-path.disc-1.journey-to-burmecia.region-";
const burmeciaRegionLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")?.sections
  .find((section) => section.id === "journey-daines-horse-basin-detours");
const burmeciaRegionLootStep = burmeciaRegionLootSection?.steps.find((step) => step.id === "journey-burmecia-region-enemy-loot");
if (burmeciaRegionLootExpectations.length !== 30 ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(burmeciaRegionLootPrefix)).length !== burmeciaRegionLootExpectations.length ||
  !burmeciaRegionLootStep?.text.includes("KO enemies if pursuing drops") ||
  !burmeciaRegionLootStep.detail?.includes("Only an enemy's Always item drop is guaranteed on a KO victory") ||
  !burmeciaRegionLootStep.detail.includes("These optional loot chances are not completion objectives") ||
  burmeciaRegionLootStep.objectiveIds?.length ||
  burmeciaRegionLootSourceIds.some((sourceId) => !burmeciaRegionPool?.sourceIds.includes(sourceId) ||
    !burmeciaRegionLootSection?.sourceIds.includes(sourceId))) {
  errors.push("The Burmecia/Cleyra world-map loot guide must cover the 30 item-bearing regional slots without creating completion objectives or inventing encounter details.");
}
for (const [enemyId, method, slotName, itemId] of burmeciaRegionLootExpectations) {
  const enemy = enemyRecords.find((record) => record.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const pathSuffix = `${enemyId.replace("enemy.", "")}-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
  const path = itemAcquisitionPaths.find((entry) => entry.id === `${burmeciaRegionLootPrefix}${pathSuffix}`);
  const item = gameItems.find((entry) => entry.id === itemId);
  if (!slots?.some((slot) => slot.slot === slotName && slot.itemId === itemId) ||
    !enemy?.encounterIds.includes("encounter.burmecia-region.world-map-pool") ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-1.journey-to-burmecia" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "repeatable" || path.walkthroughObjectiveIds?.length ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    !path.notes?.includes("exact world-map tile") ||
    (method === "drop" && (!path.conditions?.includes("KO victory") ||
      (slotName === "always" ? !path.conditions.includes("Always drop slot yields") || path.conditions.includes("conditional")
        : !path.conditions.includes("conditional")))) ||
    burmeciaRegionLootSourceIds.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !enemy?.sourceIds.includes(sourceId) || !burmeciaRegionPool?.sourceIds.includes(sourceId) ||
      !burmeciaRegionLootSection?.sourceIds.includes(sourceId))) {
    errors.push(`Burmecia/Cleyra regional ${enemyId} ${method} route ${pathSuffix} must match its loot slot, repeatability, KO rule, and regional source chain.`);
  }
}
const cleyraTrunkLootExpectations = [
  ["enemy.carrion-worm", "steal", "common", "game-item.annoyntment"],
  ["enemy.carrion-worm", "steal", "uncommon", "game-item.tent"],
  ["enemy.carrion-worm", "drop", "always", "game-item.potion"],
  ["enemy.carrion-worm", "drop", "common", "game-item.eye-drops"],
  ["enemy.carrion-worm", "drop", "uncommon", "game-item.phoenix-down"],
  ["enemy.carrion-worm", "drop", "rare", "game-item.phoenix-down"],
  ["enemy.dragonfly", "steal", "common", "game-item.eye-drops"],
  ["enemy.dragonfly", "steal", "uncommon", "game-item.tent"],
  ["enemy.dragonfly", "drop", "common", "game-item.ore"],
  ["enemy.dragonfly", "drop", "uncommon", "game-item.echo-screen"],
  ["enemy.sand-golem", "steal", "common", "game-item.ore"],
  ["enemy.sand-golem", "steal", "uncommon", "game-item.hi-potion"],
  ["enemy.sand-golem", "drop", "common", "game-item.hi-potion"],
  ["enemy.sand-golem", "drop", "uncommon", "game-item.hi-potion"],
  ["enemy.sand-golem", "drop", "rare", "game-item.hi-potion"],
  ["enemy.zuu", "steal", "common", "game-item.potion"],
  ["enemy.zuu", "steal", "uncommon", "game-item.ore"],
  ["enemy.zuu", "steal", "semi-rare", "game-item.hi-potion"],
  ["enemy.zuu", "steal", "rare", "game-item.phoenix-pinion"],
  ["enemy.zuu", "drop", "always", "game-item.potion"],
  ["enemy.zuu", "drop", "common", "game-item.phoenix-down"],
  ["enemy.zuu", "drop", "uncommon", "game-item.ether"],
  ["enemy.zuu", "drop", "rare", "game-item.hi-potion"],
  ["enemy.sand-scorpion", "steal", "common", "game-item.ore"],
  ["enemy.sand-scorpion", "steal", "uncommon", "game-item.antidote"],
  ["enemy.sand-scorpion", "steal", "rare", "game-item.ether"],
  ["enemy.sand-scorpion", "drop", "always", "game-item.potion"],
  ["enemy.sand-scorpion", "drop", "common", "game-item.annoyntment"],
  ["enemy.sand-scorpion", "drop", "uncommon", "game-item.hi-potion"],
  ["enemy.sand-scorpion", "drop", "rare", "game-item.hi-potion"],
];
const cleyraTrunkLootSources = [
  "gamefaqs-enemy-list-71891",
  "gamefaqs-cleyra-71891",
  "jegged-cleyra",
  "gamerguides-cleyra",
  "elitegrindlab-cleyra",
  "cavesofnarshe-enemies",
  "cavesofnarshe-cleyra-walkthrough",
  "gamefaqs-missables-71891",
  "jegged-missables",
];
const cleyraTrunkLootSlotSources = cleyraTrunkLootSources.slice(0, 7);
const cleyraTrunkLootPrefix = "item-path.disc-2.cleyra.trunk-loot-";
const cleyraTrunkLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections
  .find((section) => section.id === "cleyra-trunk");
const cleyraTrunkLootStep = cleyraTrunkLootSection?.steps.find((step) => step.id === "cleyra-trunk-enemy-loot");
if (cleyraTrunkLootExpectations.length !== 30 ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(cleyraTrunkLootPrefix)).length !== cleyraTrunkLootExpectations.length ||
  !cleyraTrunkLootStep?.text.includes("every drop requires a KO victory") ||
  !cleyraTrunkLootStep.detail?.includes("does not say whether random encounters recur there") ||
  !cleyraTrunkLootStep.detail.includes("Cleyra and its Trunk close after the post-Beatrix departure to the Red Rose") ||
  cleyraTrunkLootStep.objectiveIds?.length ||
  cleyraTrunkLootSources.some((sourceId) => !cleyraTrunkLootSection?.sourceIds.includes(sourceId))) {
  errors.push("Cleyra Trunk loot guidance must expose all 30 enemy slots, preserve its limited story window, and avoid treating chance-based loot as required completion.");
}
for (const [enemyId, method, slotName, itemId] of cleyraTrunkLootExpectations) {
  const enemy = enemyRecords.find((record) => record.id === enemyId);
  const slots = method === "steal" ? enemy?.steals : enemy?.drops;
  const pathSuffix = `${enemyId.replace("enemy.", "")}-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
  const path = itemAcquisitionPaths.find((entry) => entry.id === `${cleyraTrunkLootPrefix}${pathSuffix}`);
  const item = gameItems.find((record) => record.id === itemId);
  const trunkRandomEncounter = enemy?.encounterIds
    .map((encounterId) => enemyEncounters.find((record) => record.id === encounterId))
    .some((encounter) => encounter?.chapterId === "disc-2.cleyra" && encounter.kind === "random-pool");
  if (!slots?.some((slot) => slot.slot === slotName && slot.itemId === itemId) || !trunkRandomEncounter ||
    !path || path.itemId !== itemId || path.chapterId !== "disc-2.cleyra" || path.method !== method ||
    path.quantity !== 1 || path.availability !== "limited-window" || path.walkthroughObjectiveIds?.length ||
    !item?.sourceIds.includes("gamefaqs-enemy-list-71891") || !path.notes?.includes("Trunk") ||
    (method === "steal" && !path.conditions?.includes("success is not guaranteed")) ||
    (method === "drop" && (!path.conditions?.includes("KO victory") ||
      (slotName === "always" ? !path.conditions.includes("Always drop slot yields") || path.conditions.includes("conditional")
        : !path.conditions.includes("conditional")))) ||
    cleyraTrunkLootSources.some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    cleyraTrunkLootSlotSources.some((sourceId) => !enemy?.sourceIds.includes(sourceId) ||
      !enemy.encounterIds.some((encounterId) => enemyEncounters.find((record) => record.id === encounterId)?.sourceIds.includes(sourceId)) ||
      !cleyraTrunkLootSection?.sourceIds.includes(sourceId)) ||
    cleyraTrunkLootSources.slice(7).some((sourceId) => !cleyraTrunkLootSection?.sourceIds.includes(sourceId))) {
    errors.push(`Cleyra Trunk ${enemyId} ${method} route ${pathSuffix} must match its enemy slot, limited window, KO rule, and source chain.`);
  }
  if (enemyId === "enemy.sand-golem" && method === "drop" && !path?.notes?.includes("Core")) {
    errors.push("Sand Golem's Cleyra drop paths must preserve the Core/body reward distinction.");
  }
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
const burmeciaBeatrixPreparation = burmeciaBoss?.preparationGuidance;
const burmeciaBeatrixPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")
  ?.sections.find((section) => section.id === "burmecia-beatrix-preparation");
const burmeciaBeatrixPrepStep = burmeciaBeatrixPreparationSection?.steps.find((step) => step.id === "burmecia-palace-preparation");
const burmeciaBeatrixStealStep = burmeciaBeatrixPreparationSection?.steps.find((step) => step.id === "burmecia-beatrix-steals");
if (!burmeciaBeatrixPreparation || burmeciaBeatrixPreparation.suggestedLevelRange !== undefined ||
  !burmeciaBeatrixPreparation.levelRationale.includes("Level 14") ||
  !burmeciaBeatrixPreparation.levelRationale.includes("Level 16") ||
  !burmeciaBeatrixPreparation.levelRationale.includes("not party-level targets") ||
  !burmeciaBeatrixPreparation.difficultyAssessment?.includes("Gamer Guides describes Beatrix as tough") ||
  !burmeciaBeatrixPreparation.difficultyAssessment.includes("subjective single-source") ||
  !burmeciaBeatrixPreparation.optionalGrinding.includes("do not prescribe a party-level target") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("Coral Ring") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("Silk Shirt") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("Slow") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("Phoenix Down and Uncommon Chain Plate") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("Rare Mythril Sword") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("tenth turn or at 0 HP") ||
  !burmeciaBeatrixPreparation.setupAdvice.includes("party at 1 HP") ||
  !["gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "cavesofnarshe-enemies"]
    .every((sourceId) => burmeciaBeatrixPreparation.sourceIds.includes(sourceId) && burmeciaBoss?.sourceIds.includes(sourceId)) ||
  !burmeciaBeatrixPrepStep?.text.includes("Coral Ring") ||
  !burmeciaBeatrixPrepStep.text.includes("Silk Shirt") ||
  !burmeciaBeatrixPrepStep.detail?.includes("enemy stats, not party targets") ||
  !burmeciaBeatrixStealStep?.text.includes("Vivi try Slow") ||
  !burmeciaBeatrixStealStep.text.includes("Common Phoenix Down and Uncommon Chain Plate")) {
  errors.push("Burmecia Beatrix preparation must distinguish her disputed enemy stats from party level and preserve source-backed survival, steal-priority, and optional gear guidance.");
}
if (itemAcquisitionPaths.filter((path) => path.enemyId === "enemy.beatrix-burmecia" && path.method === "steal").length !== burmeciaBossSteals.length) {
  errors.push("Beatrix's Burmecia encounter must have exactly three linked steal item paths.");
}
for (const expected of burmeciaBossSteals) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  const slot = burmeciaBoss?.steals.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(burmeciaBoss?.sourceIds ?? []), ...(burmeciaBossEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (!slot ||
    !burmeciaBoss.routeObjectiveIds.includes("disc-1.burmecia.beatrix-steals") ||
    !burmeciaBoss.missableIds.includes("missable.disc-1.burmecia.beatrix-steals") ||
    !path || path.itemId !== expected.itemId || path.method !== "steal" || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.beatrix-burmecia" || path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.burmecia.beatrix"]) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("can fail") ||
    !path.walkthroughObjectiveIds?.includes("disc-1.burmecia.beatrix-steals") ||
    [...requiredSources].some((sourceId) => !path.sourceIds.includes(sourceId))) {
    errors.push(`Beatrix's ${expected.itemId} steal must connect the bestiary to its exact ${expected.slot} slot, one-time encounter, failure chance, objective, and provenance.`);
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
  hilgigarsMappedStealPaths.length !== hilgigarsSteals.length ||
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
if (fossilRooPools.length !== 3 || !fossilRooPool || fossilRooPool.kind !== "random-pool" ||
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
const huntZaghnolPreparation = huntZaghnol?.preparationGuidance;
const lindblumFestivalSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.lindblum")?.sections.find((section) => section.id === "lindblum-telescope-festival");
const lindblumFestivalPrepStep = lindblumFestivalSection?.steps.find((step) => step.id === "lindblum-festival-preparation");
const lindblumFestivalFightStep = lindblumFestivalSection?.steps.find((step) => step.id === "lindblum-festival-zaghnol");
if (!huntZaghnolPreparation || huntZaghnolPreparation.suggestedLevelRange !== undefined ||
  !huntZaghnolPreparation.levelRationale.includes("Level 9") || !huntZaghnolPreparation.levelRationale.includes("not a party-level recommendation") ||
  !huntZaghnolPreparation.difficultyAssessment?.includes("subjective") ||
  !huntZaghnolPreparation.optionalGrinding.includes("12-minute Festival") ||
  !huntZaghnolPreparation.setupAdvice.includes("Bandit and Beast Killer") ||
  !huntZaghnolPreparation.setupAdvice.includes("Mythril Gloves and Needle Fork") ||
  !huntZaghnolPreparation.setupAdvice.includes("weak to Water and halves Lightning") ||
  !huntZaghnolPreparation.setupAdvice.includes("Vivi's achievement route") ||
  !huntZaghnolPreparation.sourceIds.includes("gamefaqs-hunt-minigame-71891") ||
  !lindblumFestivalSection?.sourceIds.includes("gamefaqs-hunt-minigame-71891") ||
  !lindblumFestivalPrepStep?.detail.includes("Level 9 is Zaghnol's enemy stat") ||
  !lindblumFestivalFightStep?.detail.includes("weak to Water") ||
  !lindblumFestivalFightStep?.detail.includes("Freya can Jump or heal")) {
  errors.push("Festival Zaghnol preparation must distinguish enemy level from party level and connect timed-event setup and combat advice to the route.");
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
const cleyraReturnLootPrefix = "item-path.disc-2.cleyra.trunk-return-loot-";
const cleyraReturnLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections
  .find((section) => section.id === "cleyra-antlion-evacuation");
const cleyraReturnLootStep = cleyraReturnLootSection?.steps.find((step) => step.id === "cleyra-return-enemy-loot");
const cleyraReturnLootEntries = cleyraReturnFights.flatMap((encounter) => {
  if (!encounter) return [];
  const encounterSlug = encounter.id.replace("encounter.cleyra-trunk.return.", "");
  return encounter.formation.flatMap((member) => {
    const enemy = enemyRecords.find((record) => record.id === member.enemyId);
    if (!enemy || member.quantity === null) return [];
    return (["steal", "drop"] as const).flatMap((method) => {
      const slots = method === "steal" ? enemy.steals : enemy.drops;
      return slots.flatMap((slot) => slot.itemId ? [{
        encounterSlug,
        encounterId: encounter.id,
        enemy,
        enemyId: member.enemyId,
        quantity: member.quantity,
        method,
        slotName: slot.slot,
        itemId: slot.itemId,
      }] : []);
    });
  });
});
if (cleyraReturnLootEntries.length !== 21 ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(cleyraReturnLootPrefix)).length !== cleyraReturnLootEntries.length ||
  !cleyraReturnLootStep?.text.includes("try desired steals from each Soldier [A]") ||
  !cleyraReturnLootStep.text.includes("The listed drops are conditional") ||
  !cleyraReturnLootStep.text.includes("reported per-enemy opportunities") ||
  !cleyraReturnLootStep.detail?.includes("first, dormant-whirlpool fight") ||
  !cleyraReturnLootStep.detail.includes("GameFAQs confirms the three-fight sequence but does not print counts") ||
  cleyraReturnLootStep.objectiveIds?.length ||
  cleyraTrunkLootSources.some((sourceId) => !cleyraReturnLootSection?.sourceIds.includes(sourceId))) {
  errors.push("Cleyra's Trunk-return loot must expose all 21 optional, one-time Soldier [A] paths with per-enemy counts and the first-fight count caveat.");
}
for (const entry of cleyraReturnLootEntries) {
  const pathSuffix = `${entry.encounterSlug}-soldier-a-${entry.itemId.replace("game-item.", "")}-${entry.slotName}-${entry.method}`;
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === `${cleyraReturnLootPrefix}${pathSuffix}`);
  const encounter = cleyraReturnFights.find((candidate) => candidate?.id === entry.encounterId);
  const item = gameItems.find((record) => record.id === entry.itemId);
  const lootTable = entry.method === "steal" ? entry.enemy.steals : entry.enemy.drops;
  const lootSlot = lootTable.find((slot) => slot.slot === entry.slotName && slot.itemId === entry.itemId);
  const slotAndEncounterSources = new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
  if (!encounter || encounter.kind !== "fixed" ||
    !encounter.formation.some((member) => member.enemyId === entry.enemyId && member.quantity === entry.quantity) ||
    !entry.enemy.encounterIds.includes(entry.encounterId) || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    !lootSlot || !path || [...slotAndEncounterSources].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.enemyId !== entry.enemyId || path.enemyLootSlot !== entry.slotName ||
    path.encounterIds?.length !== 1 || path.encounterIds[0] !== entry.encounterId ||
    path.itemId !== entry.itemId || path.chapterId !== "disc-2.cleyra" || path.method !== entry.method ||
    path.quantity !== entry.quantity || path.availability !== "one-time-encounter" || path.walkthroughObjectiveIds?.length ||
    !path.notes?.includes("source-reported per-enemy opportunities") || !path.notes?.includes("Cleyra closes after the post-Beatrix departure") ||
    (entry.encounterSlug === "whirlpool-soldiers" && !path.notes?.includes("Jegged describes Soldiers at the whirlpool but does not print a count")) ||
    (entry.method === "steal" && !path.conditions?.includes("success is not guaranteed")) ||
    (entry.method === "drop" && (!path.conditions?.includes("KO victory") || !path.conditions.includes("conditional"))) ||
    cleyraTrunkLootSources.some((sourceId) => !path.sourceIds.includes(sourceId) || !cleyraReturnLootSection?.sourceIds.includes(sourceId)) ||
    !cleyraTrunkLootSlotSources.every((sourceId) => entry.enemy.sourceIds.includes(sourceId) && encounter.sourceIds.includes(sourceId))) {
    errors.push(`Cleyra Trunk-return ${entry.encounterSlug} ${entry.method} route ${pathSuffix} must match its Soldier [A] table, source-reported quantity, and one-time window.`);
  }
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
const cleyraAssaultLootPrefix = "item-path.disc-2.cleyra.assault-loot-";
const cleyraAssaultLootSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")?.sections
  .find((section) => section.id === "cleyra-antlion-evacuation");
const cleyraAssaultLootStep = cleyraAssaultLootSection?.steps.find((step) => step.id === "cleyra-assault-enemy-loot");
const cleyraAssaultLootEntries = cleyraAssaultExpectations.flatMap((expected) => {
  const encounter = cleyraChapterEncounters.find((candidate) => candidate.id === expected.id);
  const encounterSlug = expected.id.replace("encounter.cleyra-assault.", "");
  return (encounter?.formation ?? []).flatMap((member) => {
    const enemy = enemyRecords.find((record) => record.id === member.enemyId);
    if (!enemy || member.quantity === null) return [];
    return (["steal", "drop"] as const).flatMap((method) => {
      const slots = method === "steal" ? enemy.steals : enemy.drops;
      return slots.flatMap((slot) => slot.itemId ? [{
        encounterSlug,
        encounterId: expected.id,
        enemyId: member.enemyId,
        enemySlug: member.enemyId.replace("enemy.", ""),
        quantity: member.quantity,
        method,
        slotName: slot.slot,
        itemId: slot.itemId,
        enemy,
        encounter,
      }] : []);
    });
  });
});
if (cleyraAssaultLootEntries.length !== 39 ||
  itemAcquisitionPaths.filter((path) => path.id.startsWith(cleyraAssaultLootPrefix)).length !== cleyraAssaultLootEntries.length ||
  !cleyraAssaultLootStep?.text.includes("try any desired steals before defeating each group") ||
  !cleyraAssaultLootStep.text.includes("all listed item-bearing drops are conditional") ||
  !cleyraAssaultLootStep.detail?.includes("happen once before the post-Beatrix Red Rose departure closes Cleyra") ||
  cleyraAssaultLootStep.objectiveIds?.length ||
  cleyraTrunkLootSources.some((sourceId) => !cleyraAssaultLootSection?.sourceIds.includes(sourceId))) {
  errors.push("Cleyra's fixed assault loot must expose all 39 one-time per-enemy slot paths and remain optional, chance-based acquisition.");
}
for (const entry of cleyraAssaultLootEntries) {
  const pathSuffix = `${entry.encounterSlug}-${entry.enemySlug}-${entry.itemId.replace("game-item.", "")}-${entry.slotName}-${entry.method}`;
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === `${cleyraAssaultLootPrefix}${pathSuffix}`);
  const item = gameItems.find((record) => record.id === entry.itemId);
  const lootTable = entry.method === "steal" ? entry.enemy.steals : entry.enemy.drops;
  const lootSlot = lootTable.find((slot) => slot.slot === entry.slotName && slot.itemId === entry.itemId);
  const slotAndEncounterSources = new Set([...(entry.encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);
  if (!entry.encounter || entry.encounter.kind !== "fixed" ||
    !entry.encounter.formation.some((member) => member.enemyId === entry.enemyId && member.quantity === entry.quantity) ||
    !entry.enemy.encounterIds.includes(entry.encounterId) || !item?.sourceIds.includes("gamefaqs-enemy-list-71891") ||
    !lootSlot || !path || [...slotAndEncounterSources].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    path.enemyId !== entry.enemyId || path.enemyLootSlot !== entry.slotName ||
    path.encounterIds?.length !== 1 || path.encounterIds[0] !== entry.encounterId ||
    path.itemId !== entry.itemId || path.chapterId !== "disc-2.cleyra" || path.method !== entry.method ||
    path.quantity !== entry.quantity || path.availability !== "one-time-encounter" || path.walkthroughObjectiveIds?.length ||
    !path.notes?.includes("per-enemy slot opportunities") ||
    (entry.method === "steal" && !path.conditions?.includes("success is not guaranteed")) ||
    (entry.method === "drop" && (!path.conditions?.includes("KO victories") ||
      (entry.slotName === "always" ? !path.conditions.includes("Always drop slot yields") || path.conditions.includes("conditional")
        : !path.conditions.includes("slot is conditional")))) ||
    cleyraTrunkLootSources.some((sourceId) => !path.sourceIds.includes(sourceId) ||
      !cleyraAssaultLootSection?.sourceIds.includes(sourceId)) ||
    cleyraTrunkLootSlotSources.some((sourceId) => !entry.enemy.sourceIds.includes(sourceId) ||
      !entry.encounter?.sourceIds.includes(sourceId))) {
    errors.push(`Cleyra assault ${entry.encounterSlug} ${entry.enemyId} ${entry.method} route ${pathSuffix} must match the fixed formation, per-enemy quantity, and source chain.`);
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
const alexandriaBeatrixPreparation = alexandriaBeatrix?.preparationGuidance;
const alexandriaBeatrixPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-alexandria")?.sections.find((section) => section.id === "return-alexandria-zorn-thorn-and-beatrix");
const alexandriaBeatrixPreparationStep = alexandriaBeatrixPreparationSection?.steps.find((step) => step.id === "return-alexandria-beatrix-steals");
if (!alexandriaBeatrix || alexandriaBeatrix.stats.find((stat) => stat.field === "level")?.value !== 19 ||
  !alexandriaBeatrixPreparation || alexandriaBeatrixPreparation.suggestedLevelRange !== undefined ||
  !alexandriaBeatrixPreparation.levelRationale.includes("enemy stat") || !alexandriaBeatrixPreparation.levelRationale.includes("party-level recommendation") ||
  !alexandriaBeatrixPreparation.difficultyAssessment?.includes("Medium") || !alexandriaBeatrixPreparation.difficultyAssessment.includes("subjective, single-source") ||
  !alexandriaBeatrixPreparation.difficultyAssessment.includes("Thunder Gloves") ||
  !alexandriaBeatrixPreparation.optionalGrinding.includes("Steiner-only") || !alexandriaBeatrixPreparation.optionalGrinding.includes("before the rescue timer") ||
  !alexandriaBeatrixPreparation.setupAdvice.includes("Survival Vest") || !alexandriaBeatrixPreparation.setupAdvice.includes("Slow") ||
  !alexandriaBeatrixPreparation.setupAdvice.includes("Climhazzard") || !alexandriaBeatrixPreparation.setupAdvice.includes("tenth turn") ||
  !alexandriaBeatrixPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !alexandriaBeatrixPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !alexandriaBeatrixPreparationStep?.detail?.includes("Medium") || !alexandriaBeatrixPreparationStep.detail.includes("Thunder Gloves") ||
  !alexandriaBeatrixPreparationStep.detail.includes("followed by Climhazzard")) {
  errors.push("Alexandria Beatrix preparation must keep Level 19 as an enemy stat, label the subjective Medium rating, and preserve the Survival Vest/survival script in bestiary and route guidance.");
}
const alexandriaZornThornEncounter = enemyEncounters.find((candidate) => candidate.id === "encounter.return-to-alexandria.zorn-thorn");
const alexandriaZorn = enemyRecords.find((candidate) => candidate.id === "enemy.zorn");
const alexandriaThorn = enemyRecords.find((candidate) => candidate.id === "enemy.thorn");
const alexandriaZornThornRecords = [alexandriaZorn, alexandriaThorn];
const alexandriaZornThornExpectedSteals = [
  { enemyId: "enemy.zorn", itemId: "game-item.partisan", pathId: "item-path.disc-2.return-to-alexandria.zorn-partisan-steal" },
  { enemyId: "enemy.zorn", itemId: "game-item.stardust-rod", pathId: "item-path.disc-2.return-to-alexandria.zorn-stardust-rod-steal" },
  { enemyId: "enemy.thorn", itemId: "game-item.mythril-armor", pathId: "item-path.disc-2.return-to-alexandria.thorn-mythril-armor" },
  { enemyId: "enemy.thorn", itemId: "game-item.mythril-armlet", pathId: "item-path.disc-2.return-to-alexandria.thorn-mythril-armlet-steal" },
];
const alexandriaZornThornPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-alexandria")?.sections.find((section) => section.id === "return-alexandria-zorn-thorn-and-beatrix");
const alexandriaZornThornPreparationStep = alexandriaZornThornPreparationSection?.steps.find((step) => step.id === "return-alexandria-zorn-thorn-steals");
const alexandriaPreTimerPreparationStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-alexandria")?.sections.find((section) => section.id === "return-alexandria-cage-and-timer")?.steps.find((step) => step.id === "return-alexandria-cage");
if (!alexandriaZornThornEncounter || alexandriaZornThornEncounter.kind !== "boss" ||
  alexandriaZornThornEncounter.chapterId !== "disc-2.return-to-alexandria" ||
  !alexandriaZornThornEncounter.formation.some((member) => member.enemyId === "enemy.zorn" && member.quantity === 1) ||
  !alexandriaZornThornEncounter.formation.some((member) => member.enemyId === "enemy.thorn" && member.quantity === 1) ||
  !alexandriaZornThornEncounter.objectiveIds.includes("disc-2.return-to-alexandria.zorn-thorn-steals") ||
  !alexandriaZornThornEncounter.missableIds.includes("missable.disc-2.return-to-alexandria.zorn-thorn-steals") ||
  !alexandriaZornThornEncounter.cutoffIds.includes("cutoff.alexandria-rescue.rotating-platform") ||
  alexandriaZornThornRecords.some((enemy) => !enemy || enemy.kind !== "boss" ||
    !enemy.encounterIds.includes("encounter.return-to-alexandria.zorn-thorn") ||
    enemy.stats.find((stat) => stat.field === "level")?.value !== 16 ||
    !enemy.routeObjectiveIds.includes("disc-2.return-to-alexandria.zorn-thorn-steals") ||
    !enemy.missableIds.includes("missable.disc-2.return-to-alexandria.zorn-thorn-steals") ||
    !enemy.cutoffIds.includes("cutoff.alexandria-rescue.rotating-platform") ||
    enemy.preparationGuidance?.suggestedLevelRange !== undefined ||
    !enemy.preparationGuidance?.levelRationale.includes("enemy stat") ||
    !enemy.preparationGuidance?.levelRationale.includes("party-level recommendation") ||
    !enemy.preparationGuidance?.difficultyAssessment?.includes("Easy") ||
    !enemy.preparationGuidance.difficultyAssessment.includes("subjective single-source") ||
    !enemy.preparationGuidance.optionalGrinding.includes("pre-timer") ||
    !enemy.preparationGuidance.setupAdvice.includes("no healer") ||
    !enemy.preparationGuidance.setupAdvice.includes("Slow") ||
    !enemy.preparationGuidance.setupAdvice.includes("rescue countdown") ||
    !enemy.preparationGuidance.sourceIds.includes("gamefaqs-boss-guide-31490")) ||
  !alexandriaZorn?.stats.some((stat) => stat.field === "HP" && stat.value === 4897 && stat.verification === "disputed") ||
  !alexandriaZorn?.stats.some((stat) => stat.field === "HP" && stat.value === 4896 && stat.verification === "disputed") ||
  !alexandriaThorn?.stats.some((stat) => stat.field === "HP" && stat.value === 2985 && stat.verification === "disputed") ||
  !alexandriaThorn?.stats.some((stat) => stat.field === "HP" && stat.value === 2984 && stat.verification === "disputed") ||
  !alexandriaZorn?.facts.some((fact) => fact.category === "attack" && fact.label === "Meteorite") ||
  !alexandriaThorn?.facts.some((fact) => fact.category === "attack" && fact.label === "Light Flare") ||
  !alexandriaZornThornPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !alexandriaZornThornPreparationStep?.detail?.includes("no healer") ||
  !alexandriaZornThornPreparationStep.detail.includes("rescue timer continues") ||
  !alexandriaPreTimerPreparationStep?.detail?.includes("optional Alexandrian Soldier loop") ||
  !alexandriaPreTimerPreparationStep.detail.includes("before the rescue timer starts")) {
  errors.push("Alexandria's Zorn/Thorn bestiary must keep the paired encounter, disputed HP values, Level 16 enemy stats, timed steal guidance, and pre-timer Steiner leveling caveat linked.");
}
for (const expected of alexandriaZornThornExpectedSteals) {
  const enemy = enemyRecords.find((candidate) => candidate.id === expected.enemyId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!enemy?.steals.some((slot) => slot.itemId === expected.itemId) || !path || path.itemId !== expected.itemId ||
    path.chapterId !== "disc-2.return-to-alexandria" || path.method !== "steal" || path.availability !== "one-time-encounter" ||
    !path.walkthroughObjectiveIds?.includes("disc-2.return-to-alexandria.zorn-thorn-steals") ||
    !path.sourceIds.includes("gamefaqs-return-to-alexandria-71891")) {
    errors.push(`Zorn and Thorn's ${expected.itemId} steal must link the correct enemy, one-time item path, and shared warning objective.`);
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
const qualeGluttonsRobePath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.outer-continent.quale-gluttons-robe-steal");
if (!qualeEncounter || qualeEncounter.kind !== "boss" ||
  !qualeEncounter.formation.some((entry) => entry.enemyId === "enemy.quale" && entry.quantity === 1) ||
  !qualeEncounter.objectiveIds.includes("disc-4.return-to-gaia.frog-catching") ||
  !qualeEncounter.location.includes("whichever of the four Qu's Marsh ponds") ||
  !qualeEncounter.notes.some((note) => note.includes("not a game restriction") && note.includes("Disc III")) ||
  !qualeRecord || qualeRecord.kind !== "boss" || qualeRecord.chapterId !== "disc-4.return-to-gaia" || qualeRecord.routeObjectiveIds.length !== 1 ||
  !qualeRecord.steals.some((slot) => slot.itemId === "game-item.gluttons-robe") ||
  qualeRecord.drops.filter((slot) => slot.itemId === "game-item.elixir").length !== 4 ||
  !qualeRecord.notes.some((note) => note.includes("Gastro Fork")) ||
  !qualeGluttonsRobePath || qualeGluttonsRobePath.itemId !== "game-item.gluttons-robe" ||
  qualeGluttonsRobePath.chapterId !== "disc-4.return-to-gaia" || qualeGluttonsRobePath.method !== "steal" ||
  qualeGluttonsRobePath.enemyId !== "enemy.quale" || qualeGluttonsRobePath.enemyLootSlot !== "semi-rare" ||
  qualeGluttonsRobePath.encounterIds?.length !== 1 || qualeGluttonsRobePath.encounterIds[0] !== qualeEncounter.id ||
  !qualeGluttonsRobePath.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.frog-catching") ||
  !qualeGluttonsRobePath.conditions?.includes("whichever Qu's Marsh pond") ||
  !qualeGluttonsRobePath.conditions.includes("can happen earlier") ||
  !qualeGluttonsRobePath.conditions.includes("chance-based and can fail") ||
  [...new Set([...(qualeRecord?.sourceIds ?? []), ...qualeEncounter.sourceIds,
    ...(qualeRecord?.steals.find((slot) => slot.itemId === "game-item.gluttons-robe" && slot.slot === "semi-rare")?.sourceIds ?? [])])]
    .some((sourceId) => !qualeGluttonsRobePath.sourceIds.includes(sourceId))) {
  errors.push("Quale must link the 99th-frog trigger at any pond and its Glutton's Robe steal to the exact enemy slot, encounter, planned timing, and sources.");
}
const qualePreparation = qualeRecord?.preparationGuidance;
const qualePreparationSources = ["gamefaqs-frog-catching-71891", "elitegrindlab-qus-marsh"];
if (!qualePreparation || qualePreparation.suggestedLevelRange !== undefined ||
  !qualePreparation.levelRationale.includes("Level 76 is Quale's enemy stat") ||
  !qualePreparation.levelRationale.includes("no party-level target is inferred") ||
  !qualePreparation.optionalGrinding.includes("Stop at 98 frogs") ||
  !qualePreparation.setupAdvice.includes("Water-resistant gear") ||
  !qualePreparation.setupAdvice.includes("Magic Hammer") ||
  !qualePreparation.setupAdvice.includes("rare Robe of Lords") ||
  !qualePreparation.setupAdvice.includes("exploit Lightning") ||
  qualePreparationSources.some((sourceId) => !qualePreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))) {
  errors.push("Quale preparation must distinguish its Level 76 enemy stat, preserve the save-at-98 trigger, and cite the sourced defense, stealing, and Lightning advice.");
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
const zaghnolHuntStealPaths = itemAcquisitionPaths.filter((path) => path.chapterId === "disc-1.lindblum" &&
  path.enemyId === "enemy.zaghnol-hunt" && path.method === "steal");
if (!zaghnolHuntEncounter || zaghnolHuntEncounter.kind !== "boss" ||
  !zaghnolHuntEncounter.formation.some((entry) => entry.enemyId === "enemy.zaghnol-hunt" && entry.quantity === 1) ||
  !zaghnolHuntEncounter.objectiveIds.includes("disc-1.lindblum.zaghnol-steals") ||
  !zaghnolHuntEncounter.missableIds.includes("missable.disc-1.lindblum.zaghnol-steals") ||
  !zaghnolHuntEncounter.cutoffIds.includes("cutoff.lindblum-festival.vivi-outcome") ||
  zaghnolHuntStealPaths.length !== 2 ||
  zaghnolHunt?.stats.find((stat) => stat.field === "HP")?.value !== 1574 ||
  !zaghnolHunt?.notes.some((note) => note.includes("Caves of Narshe's event table lists no stolen items"))) {
  errors.push("The Festival Zaghnol battle must stay separate from the regular form and preserve its sourced steal disagreement and cutoff links.");
}
for (const { itemId, pathId, slot } of [
  { itemId: "game-item.mythril-gloves", pathId: "item-path.disc-1.lindblum.zaghnol-mythril-gloves-steal", slot: "common" },
  { itemId: "game-item.needle-fork", pathId: "item-path.disc-1.lindblum.zaghnol-needle-fork-steal", slot: "uncommon" },
] as const) {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  const lootSlot = zaghnolHunt?.steals.find((steal) => steal.itemId === itemId && steal.slot === slot);
  const expectedSourceIds = new Set([
    ...(zaghnolHunt?.sourceIds ?? []),
    ...(zaghnolHuntEncounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ]);
  if (!lootSlot || !zaghnolHunt?.routeObjectiveIds.includes("disc-1.lindblum.zaghnol-steals") ||
    path?.itemId !== itemId || path.method !== "steal" || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.zaghnol-hunt" || path.enemyLootSlot !== slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.lindblum.festival-zaghnol"]) ||
    !path.conditions?.includes("chance-based") || !path.conditions.includes("Caves of Narshe's Hunt table lists no steals") ||
    !path.walkthroughObjectiveIds?.includes("disc-1.lindblum.zaghnol-steals") ||
    [...expectedSourceIds].some((sourceId) => !path.sourceIds.includes(sourceId) || !sources.some((source) => source.id === sourceId))) {
    errors.push(`Zaghnol's ${itemId} steal must link its exact Hunt-only slot to the one-time encounter, objective, source conflict, and provenance.`);
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
  ["game-item.mythril-armlet", 9],
]);
for (const [itemId, expectedCount] of zornThornShopCounts) {
  const paths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && path.method === "shop");
  if (paths.length !== expectedCount || paths.some((path) => path.cost?.currency !== "gil")) {
    errors.push(`Zorn and Thorn recovery for ${itemId} needs ${expectedCount} Gil-priced shop paths; found ${paths.length}.`);
  }
}
const stardustRodShopPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.stardust-rod" && path.method === "shop");
if (
  stardustRodShopPaths.length !== 7 ||
  stardustRodShopPaths.some((path) =>
    path.cost?.amount !== 750 ||
    !path.sourceIds.includes("gamefaqs-shops-71891") ||
    !path.sourceIds.includes("cavesofnarshe-ff9-rods") ||
    !path.sourceIds.includes("gamefaqs-shop-lists-9772") ||
    !path.sourceIds.includes("rpgclassics-shops") ||
    !path.conditions.includes("GameFAQs Shops and Caves of Narshe list 750 Gil") ||
    !path.conditions.includes("GameFAQs Items, the older GameFAQs Shop Lists, and RPGClassics Shops list 760 Gil")
  )
) {
  errors.push("Stardust Rod shop paths must use the listed 750-Gil shop-table price while preserving both 760-Gil listings and their source links.");
}
const magicianShoesLindblumDisc2Path = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.magician-shoes-post-cleyra-synthesis");
if (
  !magicianShoesLindblumDisc2Path ||
  magicianShoesLindblumDisc2Path.itemId !== "game-item.magician-shoes" ||
  magicianShoesLindblumDisc2Path.chapterId !== "disc-2.return-to-lindblum" ||
  magicianShoesLindblumDisc2Path.method !== "synthesis" ||
  magicianShoesLindblumDisc2Path.recipeId !== "synthesis-recipe.magician-shoes" ||
  magicianShoesLindblumDisc2Path.shopId !== "lindblum.synthesis-shop.disc-2" ||
  magicianShoesLindblumDisc2Path.availability !== "window-unverified" ||
  magicianShoesLindblumDisc2Path.cost?.amount !== 1500 ||
  !["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "gamefaqs-shops-71891"].every((sourceId) => magicianShoesLindblumDisc2Path.sourceIds.includes(sourceId)) ||
  !magicianShoesLindblumDisc2Path.notes?.includes("does not infer an earlier accessible window")
) {
  errors.push("Magician Shoes' first modeled Lindblum synthesis must stay on the post-Cleyra return, cite both timing labels and the Disc II shop table, and avoid inferring pre-Cleyra availability.");
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
const lindblumFirstVisitPathSpecs = [
  ["item-path.disc-1.lindblum.ether-guest-room-chest", "game-item.ether", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.hi-potion-business-district-chest", "game-item.hi-potion", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.echo-screen-business-district-chest", "game-item.echo-screen", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.tent-church-street-hidden-pickup", "game-item.tent", "hidden-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.bronze-vest-industrial-district-pickup", "game-item.bronze-vest", "fixed-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.ore-theater-district-chest", "game-item.ore", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.mini-burmecia-hideout-hidden-pickup", "game-item.mini-burmecia", "hidden-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", ["gamefaqs-lindblum-71891", "jegged-lindblum"]],
  ["item-path.disc-1.lindblum.autograph-lowell-reward", "game-item.autograph", "quest-reward", "single-use", "disc-1.lindblum.autograph-moogle-suit", ["gamefaqs-lindblum-71891", "jegged-lindblum", "gamefaqs-missables-71891", "gamefaqs-missables-21725"]],
  ["item-path.disc-1.lindblum.moogle-suit-theater-studio-hidden-pickup", "game-item.moogle-suit", "hidden-pickup", "single-use", "disc-1.lindblum.autograph-moogle-suit", ["gamefaqs-lindblum-71891", "jegged-lindblum", "gamefaqs-missables-71891", "gamefaqs-missables-21725"]],
  ["item-path.disc-1.lindblum.kupo-nut-vivi-shopping-ate", "game-item.kupo-nut", "quest-reward", "single-use", "disc-1.lindblum.kupo-nut", ["gamefaqs-lindblum-71891"]],
  ["item-path.disc-1.lindblum.master-hunter-festival-reward", "game-item.master-hunter", "quest-reward", "single-use", "disc-1.lindblum.master-hunter", ["gamefaqs-lindblum-71891", "jegged-lindblum", "gamefaqs-hunt-minigame-71891"]],
  ["item-path.disc-1.lindblum.coral-ring-freya-festival-reward", "game-item.coral-ring", "quest-reward", "conditional", "disc-1.lindblum.festival-freya-win", ["gamefaqs-lindblum-71891", "jegged-lindblum", "gamefaqs-hunt-minigame-71891"]],
] as const;
for (const [pathId, itemId, method, availability, objectiveId, requiredSources] of lindblumFirstVisitPathSpecs) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const item = gameItems.find((entry) => entry.id === itemId);
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-1.lindblum" || path.method !== method ||
    path.quantity !== 1 || path.availability !== availability || !path.walkthroughObjectiveIds?.includes(objectiveId) ||
    !item || !objectivesById.has(objectiveId)) {
    errors.push(`Lindblum first-visit path ${pathId} must keep its item, quantity, method, availability, and checklist link.`);
  }
  for (const sourceId of requiredSources) {
    if (!sourceIds.has(sourceId) || !path?.sourceIds.includes(sourceId) || !item?.sourceIds.includes(sourceId)) {
      errors.push(`Lindblum first-visit path ${pathId} and its item need source ${sourceId}.`);
    }
  }
}
const lindblumViviShoppingStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.lindblum")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "lindblum-vivis-shopping-ate");
if (!lindblumViviShoppingStep?.objectiveIds?.includes("disc-1.lindblum.kupo-nut") ||
  !lindblumViviShoppingStep.text.includes("Kupo Nut") || !objectivesById.has("disc-1.lindblum.kupo-nut")) {
  errors.push("Vivi's Shopping ATE must link its Kupo Nut reward to the dedicated Lindblum objective.");
}
const burmeciaArchPickupSpecs = [
  ["item-path.disc-1.journey-to-burmecia.burmecia-arch-hi-potion-chest", "game-item.hi-potion"],
  ["item-path.disc-1.journey-to-burmecia.burmecia-arch-tent-chest", "game-item.tent"],
] as const;
const burmeciaArchSources = ["gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke"];
for (const [pathId, itemId] of burmeciaArchPickupSpecs) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const item = gameItems.find((entry) => entry.id === itemId);
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-1.journey-to-burmecia" || path.method !== "chest" ||
    path.quantity !== 1 || path.availability !== "single-use" ||
    !path.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.burmecia-arch-pickups") || !item) {
    errors.push(`Burmecia Arch path ${pathId} must be a single-use chest linked to the pickup objective.`);
  }
  for (const sourceId of burmeciaArchSources) {
    if (!sourceIds.has(sourceId) || !path?.sourceIds.includes(sourceId) || !item?.sourceIds.includes(sourceId)) {
      errors.push(`Burmecia Arch path ${pathId} and its item need source ${sourceId}.`);
    }
  }
}
const burmeciaArchObjective = objectivesById.get("disc-1.journey-to-burmecia.burmecia-arch-pickups");
const burmeciaArchStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-burmecian-arch-pickups");
if (!burmeciaArchObjective || burmeciaArchObjective.sourceIds.length !== burmeciaArchSources.length ||
  !burmeciaArchSources.every((sourceId) => burmeciaArchObjective.sourceIds.includes(sourceId)) ||
  burmeciaArchObjective.sourceIds.includes("opatil-gizamaluke-map") ||
  !burmeciaArchStep?.objectiveIds?.includes("disc-1.journey-to-burmecia.burmecia-arch-pickups")) {
  errors.push("Burmecia Arch's pickup objective must cite its two exact route sources and stay linked to the walkthrough step.");
}
const grottoHiddenEquipmentSpecs = [
  ["item-path.disc-1.journey-to-burmecia.bronze-vest-grotto-hidden-chest", "game-item.bronze-vest", "journey-grotto-type-a-and-bronze-vest"],
  ["item-path.disc-1.journey-to-burmecia.mythril-gloves-grotto-hidden-chest", "game-item.mythril-gloves", "journey-grotto-mythril-magus-hat"],
  ["item-path.disc-1.journey-to-burmecia.magus-hat-grotto-chest", "game-item.magus-hat", "journey-grotto-mythril-magus-hat"],
] as const;
const grottoHiddenEquipmentSources = [
  "gamefaqs-journey-to-burmecia-71891",
  "jegged-gizamaluke",
  "opatil-gizamaluke-map",
  "elitegrindlab-gizamaluke",
];
for (const [pathId, itemId, stepId] of grottoHiddenEquipmentSpecs) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
  const item = gameItems.find((entry) => entry.id === itemId);
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === stepId);
  if (!path || path.itemId !== itemId || path.chapterId !== "disc-1.journey-to-burmecia" || path.method !== "chest" ||
    path.quantity !== 1 || path.availability !== "single-use" ||
    !path.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.grotto-hidden-equipment") ||
    !step?.objectiveIds?.includes("disc-1.journey-to-burmecia.grotto-hidden-equipment") || !item) {
    errors.push(`Gizamaluke's Grotto hidden-equipment path ${pathId} must be a single-use pickup linked to the walkthrough objective.`);
  }
  for (const sourceId of grottoHiddenEquipmentSources) {
    if (!sourceIds.has(sourceId) || !path?.sourceIds.includes(sourceId) || !item?.sourceIds.includes(sourceId)) {
      errors.push(`Gizamaluke's Grotto hidden-equipment path ${pathId} and its item need source ${sourceId}.`);
    }
  }
}
const grottoHiddenEquipmentObjective = objectivesById.get("disc-1.journey-to-burmecia.grotto-hidden-equipment");
if (!grottoHiddenEquipmentObjective || grottoHiddenEquipmentObjective.sourceIds.length !== grottoHiddenEquipmentSources.length ||
  !grottoHiddenEquipmentSources.every((sourceId) => grottoHiddenEquipmentObjective.sourceIds.includes(sourceId))) {
  errors.push("Gizamaluke's hidden-equipment objective must preserve the exact route, map, and independent audit sources.");
}
const grottoHolyBellSources = [
  "gamefaqs-journey-to-burmecia-71891",
  "gamefaqs-kupo-nuts-71891",
  "jegged-gizamaluke",
  "opatil-gizamaluke-map",
];
const grottoHolyBellPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-1.journey-to-burmecia.holy-bell-kupo-nut-reward");
const grottoHolyBellItem = gameItems.find((entry) => entry.id === "game-item.holy-bell");
const grottoHolyBellObjective = objectivesById.get("disc-1.journey-to-burmecia.kupo-nut-holy-bell");
const grottoHolyBellStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-grotto-kupo-nut-and-holy-bell");
if (!grottoHolyBellItem || grottoHolyBellItem.category !== "key-item" || !grottoHolyBellPath ||
  grottoHolyBellPath.itemId !== "game-item.holy-bell" || grottoHolyBellPath.chapterId !== "disc-1.journey-to-burmecia" ||
  grottoHolyBellPath.method !== "quest-reward" || grottoHolyBellPath.quantity !== 1 || grottoHolyBellPath.availability !== "single-use" ||
  !grottoHolyBellPath.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.kupo-nut-holy-bell") ||
  !grottoHolyBellStep?.objectiveIds?.includes("disc-1.journey-to-burmecia.kupo-nut-holy-bell") ||
  !grottoHolyBellStep.text.includes("Holy Bell")) {
  errors.push("The Disc I Kupo Nut exchange must have a single-use Holy Bell key-item reward linked to its walkthrough objective.");
}
for (const sourceId of grottoHolyBellSources) {
  if (!sourceIds.has(sourceId) || !grottoHolyBellPath?.sourceIds.includes(sourceId) || !grottoHolyBellItem?.sourceIds.includes(sourceId)) {
    errors.push(`The Disc I Holy Bell reward and key-item record need source ${sourceId}.`);
  }
}
if (!grottoHolyBellObjective || grottoHolyBellObjective.sourceIds.length !== grottoHolyBellSources.length ||
  !grottoHolyBellSources.every((sourceId) => grottoHolyBellObjective.sourceIds.includes(sourceId))) {
  errors.push("The Disc I Holy Bell objective must cite the reward guide, route, Grotto walkthrough, and item map.");
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
const healingRodShopPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.healing-rod" &&
  (path.method === "shop" || path.method === "mogshop"));
const healingRodItem = gameItems.find((item) => item.id === "game-item.healing-rod");
if (!healingRodItem?.sourceIds.includes("gamefaqs-shop-lists-9772") || healingRodShopPaths.length !== 5 ||
  healingRodShopPaths.some((path) => path.cost?.amount !== 1770 || !path.sourceIds.includes("gamefaqs-shop-lists-9772") ||
    !path.sourceIds.includes("gamefaqs-equipment-33383") || !path.conditions?.includes("1,170 Gil"))) {
  errors.push("Healing Rod's five shop paths must cite both GameFAQs price listings and retain the 1,170/1,770-Gil discrepancy.");
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
    !soulcageStealWarning.sourceIds.includes("ffwiki-magician-cloak") ||
    !soulcageStealWarning.action.includes("Semi-Rare slot") || !soulcageStealWarning.action.includes("Caves of Narshe calls it Rare") ||
    !soulcageStealWarning.sourceIds.includes("cavesofnarshe-ff9-brigandine")) {
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
const soulcagePreparation = firstIifaTreeSoulcage?.preparationGuidance;
const soulcagePrepSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.iifa-tree")?.sections.find((section) => section.id === "iifa-tree-elevator-bottom");
const soulcagePrepStep = soulcagePrepSection?.steps.find((step) => step.id === "iifa-tree-boss-preparation");
if (!soulcagePreparation || soulcagePreparation.suggestedLevelRange !== undefined ||
  !soulcagePreparation.levelRationale.includes("Level 26") ||
  !soulcagePreparation.levelRationale.includes("rather than a party recommendation") ||
  !soulcagePreparation.levelRationale.includes("divisible by five") ||
  !soulcagePreparation.sourceIds.includes("kamigame-soulcage") ||
  !soulcagePreparation.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !soulcagePrepSection?.sourceIds.includes("kamigame-soulcage") ||
  !soulcagePrepStep?.detail?.includes("opens with LV5 Death") ||
  !soulcagePrepStep.detail.includes("EXP-free route")) {
  errors.push("Soulcage preparation must separate its Level 26 enemy stat from party guidance, preserve the LV5 Death threshold, and keep the EXP-free route distinct.");
}
const firstIifaTreeSoulcageLootExpectations = [
  { id: "item-path.disc-2.iifa-tree.soulcage-oak-staff-steal", itemId: "game-item.oak-staff", method: "steal", slot: "common", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Common slot", "each attempt can fail"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-magician-cloak-steal", itemId: "game-item.magician-cloak", method: "steal", slot: "uncommon", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Uncommon slot", "each attempt can fail"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-brigandine-steal", itemId: "game-item.brigandine", method: "steal", slot: "semi-rare", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Semi-Rare slot", "each attempt can fail", "Caves of Narshe calls it Rare"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always", objectiveId: null, markers: ["normal KO victory", "Always Phoenix Pinion", "Opa-Til"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-elixir-common-drop", itemId: "game-item.elixir", method: "drop", slot: "common", objectiveId: null, markers: ["normal KO victory", "37.5%", "source-reported", "Opa-Til lists one Common Elixir slot"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-elixir-uncommon-drop", itemId: "game-item.elixir", method: "drop", slot: "uncommon", objectiveId: null, markers: ["normal KO victory", "12.5%", "source-reported", "Opa-Til lists only the Common Elixir slot"] },
  { id: "item-path.disc-2.iifa-tree.soulcage-elixir-rare-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", objectiveId: null, markers: ["normal KO victory", "0.391%", "source-reported", "Opa-Til lists only the Common Elixir slot"] },
];
for (const expected of firstIifaTreeSoulcageLootExpectations) {
  const lootTable = expected.method === "steal" ? firstIifaTreeSoulcage?.steals : firstIifaTreeSoulcage?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.id);
  const requiredSources = new Set([...(firstIifaTreeSoulcageEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (!slot || !path || path.itemId !== expected.itemId || path.method !== expected.method || path.chapterId !== "disc-2.iifa-tree" ||
    path.quantity !== 1 || path.availability !== "one-time-encounter" || path.enemyId !== "enemy.soulcage" ||
    path.enemyLootSlot !== expected.slot || JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.iifa-tree.soulcage"]) ||
    (expected.objectiveId ? !path.walkthroughObjectiveIds?.includes(expected.objectiveId) : Boolean(path.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.soulcage-steals"))) ||
    !expected.markers.every((marker) => path.conditions?.includes(marker) || path.notes?.includes(marker)) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))) {
    errors.push(`Soulcage path ${expected.id} must match its one-time enemy loot slot, encounter, objective scope, outcomes, and provenance.`);
  }
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
  !battleIifaMistodonDownhillPool.notes.some((note) => note.includes("GameFAQs' Excalibur II route calls one or two fights on the later descent random"))
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
const battleIifaMistodonStealPathExpectations = [
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-upper-pair-ore-common-steal", "game-item.ore", "common", "encounter.iifa-tree-return.mistodon-upper-pair", "one-time-encounter"],
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-upper-pair-hi-potion-uncommon-steal", "game-item.hi-potion", "uncommon", "encounter.iifa-tree-return.mistodon-upper-pair", "one-time-encounter"],
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-after-dagger-ore-common-steal", "game-item.ore", "common", "encounter.iifa-tree-return.mistodon-after-dagger", "one-time-encounter"],
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-after-dagger-hi-potion-uncommon-steal", "game-item.hi-potion", "uncommon", "encounter.iifa-tree-return.mistodon-after-dagger", "one-time-encounter"],
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-downhill-ore-common-steal", "game-item.ore", "common", "encounter.iifa-tree-return.mistodon-reported-downhill-pool", "window-unverified"],
  ["item-path.disc-2.battle-of-iifa-tree.mistodon-downhill-hi-potion-uncommon-steal", "game-item.hi-potion", "uncommon", "encounter.iifa-tree-return.mistodon-reported-downhill-pool", "window-unverified"],
] as const;
const battleIifaMistodonStealPaths = battleIifaMistodonStealPathExpectations.map(([id]) => itemAcquisitionPaths.find((path) => path.id === id));
if (
  battleIifaMistodonStealPaths.some((path, index) =>
    path?.itemId !== battleIifaMistodonStealPathExpectations[index][1] ||
    path?.method !== "steal" ||
    path?.enemyId !== "enemy.mistodon-a" ||
    path?.enemyLootSlot !== battleIifaMistodonStealPathExpectations[index][2] ||
    path?.availability !== battleIifaMistodonStealPathExpectations[index][4] ||
    path?.encounterIds?.length !== 1 ||
    path?.encounterIds[0] !== battleIifaMistodonStealPathExpectations[index][3] ||
    !path?.walkthroughObjectiveIds?.includes("disc-2.battle-of-iifa-tree.mistodon-steals")
  ) ||
  battleIifaMistodonStealPaths.some((path) => !path?.conditions?.includes("chance-based")) ||
  !battleIifaMistodonStealPaths.slice(4).every((path) => path?.conditions?.includes("not confirmed as repeatable"))
) {
  errors.push("Mistodon [A] Hi-Potion/Ore paths must link the exact fixed encounters and keep the reported downhill pool unverified.");
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
const scarletHairPreparation = scarletHair?.preparationGuidance;
const scarletHairPreparationSources = ["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari"];
if (
  !scarletHairPreparation ||
  scarletHairPreparation.suggestedLevelRange !== undefined ||
  !scarletHairPreparation.levelRationale.includes("Level 22 is Scarlet Hair's enemy stat") ||
  !scarletHairPreparation.levelRationale.includes("not a Zidane target") ||
  !scarletHairPreparation.setupAdvice.includes("Man Eater and Counter if learned") ||
  !scarletHairPreparation.setupAdvice.includes("Common Ether and Uncommon Poison Knuckles") ||
  !scarletHairPreparation.setupAdvice.includes("Gamer Guides recommends waiting") ||
  !scarletHairPreparation.setupAdvice.includes("Jegged says attacks can still hit") ||
  scarletHairPreparation.confidence !== "disputed" ||
  scarletHairPreparationSources.some((sourceId) => !scarletHairPreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))
) {
  errors.push("Scarlet Hair preparation must keep Level 22 separate from party level, cite Zidane's optional setup, and preserve the source-scoped movement timing disagreement.");
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
const scarletHairLootPaths = [
  { id: scarletHairItemPathIds[0], itemId: "game-item.ether", method: "steal", slot: "common", chanceBased: true },
  { id: scarletHairItemPathIds[1], itemId: "game-item.poison-knuckles", method: "steal", slot: "uncommon", chanceBased: true },
  { id: scarletHairItemPathIds[2], itemId: "game-item.tent", method: "drop", slot: "always", chanceBased: false },
];
for (const expected of scarletHairLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? scarletHair?.steals : scarletHair?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(scarletHair?.sourceIds ?? []), ...(scarletHairEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    path?.itemId !== expected.itemId ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== scarletHair?.id ||
    path.enemyLootSlot !== expected.slot ||
    path.encounterIds?.length !== 1 ||
    path.encounterIds[0] !== scarletHairEncounter?.id ||
    (expected.chanceBased && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
    (!expected.chanceBased && !path.conditions?.includes("defeat him")) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Scarlet Hair's ${expected.itemId} path must link the exact ${expected.slot} loot slot to its one-time encounter with matching yield conditions and provenance.`);
  }
}
if (
  !gameItemIds.has("game-item.poison-knuckles") ||
  scarletHairItemPathIds.some((pathId) => !itemAcquisitionPaths.some((path) => path.id === pathId)) ||
  !sourceInventoryTargets.some((target) => target.itemId === "game-item.poison-knuckles" && target.targetQuantity === 2) ||
  !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.poison-knuckles" && claim.abilityName === "Spare Change") ||
  !equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.poison-knuckles" && claim.abilityName === "Counter")
) {
  errors.push("Scarlet Hair's Ether/Poison Knuckles/Tent acquisition and recovery paths, Poison Knuckles target, and weapon abilities must remain linked in the item catalog.");
}
const alexandriaBossLootPaths = [
  { id: "item-path.disc-2.return-to-alexandria.zorn-partisan-steal", enemyId: "enemy.zorn", itemId: "game-item.partisan", method: "steal", slot: "common", encounterIds: ["encounter.return-to-alexandria.zorn-thorn"], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.zorn-stardust-rod-steal", enemyId: "enemy.zorn", itemId: "game-item.stardust-rod", method: "steal", slot: "uncommon", encounterIds: ["encounter.return-to-alexandria.zorn-thorn"], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.thorn-mythril-armlet-steal", enemyId: "enemy.thorn", itemId: "game-item.mythril-armlet", method: "steal", slot: "uncommon", encounterIds: ["encounter.return-to-alexandria.zorn-thorn"], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.thorn-mythril-armor", enemyId: "enemy.thorn", itemId: "game-item.mythril-armor", method: "steal", slot: "common", encounterIds: ["encounter.return-to-alexandria.zorn-thorn"], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.beatrix-phoenix-down-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.phoenix-down", method: "steal", slot: "common", encounterIds: ["encounter.return-to-alexandria.beatrix"], objectiveId: "disc-2.return-to-alexandria.beatrix-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.beatrix-ice-brand-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.ice-brand", method: "steal", slot: "uncommon", encounterIds: ["encounter.return-to-alexandria.beatrix"], objectiveId: "disc-2.return-to-alexandria.beatrix-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.survival-vest-beatrix-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.survival-vest", method: "steal", slot: "semi-rare", encounterIds: ["encounter.return-to-alexandria.beatrix"], objectiveId: "disc-2.return-to-alexandria.beatrix-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.ralvuimago-phoenix-down-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.phoenix-down", method: "steal", slot: "common", encounterIds: ["encounter.return-to-alexandria.ralvuimago"], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.ralvuimago-adaman-vest-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.adaman-vest", method: "steal", slot: "uncommon", encounterIds: ["encounter.return-to-alexandria.ralvuimago"], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.ralvuimago-oak-staff-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.oak-staff", method: "steal", slot: "semi-rare", encounterIds: ["encounter.return-to-alexandria.ralvuimago"], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.tantarian-ether-steal", enemyId: "enemy.tantarian", itemId: "game-item.ether", method: "steal", slot: "common", encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"], objectiveId: "disc-2.return-to-alexandria.tantarian", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.tantarian-elixir-steal", enemyId: "enemy.tantarian", itemId: "game-item.elixir", method: "steal", slot: "uncommon", encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"], objectiveId: "disc-2.return-to-alexandria.tantarian", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.tantarian-silver-fork-steal", enemyId: "enemy.tantarian", itemId: "game-item.silver-fork", method: "steal", slot: "semi-rare", encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"], objectiveId: "disc-2.return-to-alexandria.tantarian", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.tantarian-demons-mail-steal", enemyId: "enemy.tantarian", itemId: "game-item.demons-mail", method: "steal", slot: "rare", encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"], objectiveId: "disc-2.return-to-alexandria.tantarian", chanceBased: true },
  { id: "item-path.disc-2.return-to-alexandria.tantarian-running-shoes", enemyId: "enemy.tantarian", itemId: "game-item.running-shoes", method: "drop", slot: "always", encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"], objectiveId: "disc-2.return-to-alexandria.tantarian", chanceBased: false },
];
const alexandriaBossLootPathIds = new Set(alexandriaBossLootPaths.map((expected) => expected.id));
if (itemAcquisitionPaths.filter((path) => alexandriaBossLootPathIds.has(path.id)).length !== alexandriaBossLootPaths.length) {
  errors.push("Alexandria boss loot paths must retain all 15 Zorn/Thorn, Beatrix, Ralvuimago, and Tantarian entries.");
}
for (const expected of alexandriaBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const encounters = enemyEncounters.filter((entry) => expected.encounterIds.includes(entry.id));
  const lootTable = expected.method === "steal" ? enemy?.steals : enemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...encounters.flatMap((entry) => entry.sourceIds), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== expected.enemyId ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(expected.encounterIds) ||
    encounters.length !== expected.encounterIds.length ||
    !encounters.every((encounter) => encounter.kind === "boss" && encounter.formation.some((member) => member.enemyId === expected.enemyId)) ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) ||
    (expected.chanceBased && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
    (!expected.chanceBased && (!path.conditions?.includes("Always drop") || !path.conditions.includes("victory"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Alexandria boss path ${expected.id} must match its one-time encounter, exact ${expected.slot} loot slot, conditions, objective, and provenance.`);
  }
}
const thornMythrilArmorPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.return-to-alexandria.thorn-mythril-armor");
if (!thornMythrilArmorPath?.notes?.includes("The GameFAQs Items index lists Mythril Armor as Zorn's common steal")) {
  errors.push("The Thorn Mythril Armor path must preserve the source disagreement about which clown owns its steal.");
}
const ozmaLootPaths = [
  { id: "item-path.disc-4.final-preparations.ozma-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveIds: ["disc-4.final-preparations.ozma-steals"] },
  { id: "item-path.disc-4.final-preparations.ozma-robe-of-lords-steal", itemId: "game-item.robe-of-lords", method: "steal", slot: "uncommon", objectiveIds: ["disc-4.final-preparations.ozma-steals"] },
  { id: "item-path.disc-4.final-preparations.ozma-dark-matter-semi-rare-steal", itemId: "game-item.dark-matter", method: "steal", slot: "semi-rare", objectiveIds: ["disc-4.final-preparations.ozma-steals"] },
  { id: "item-path.disc-4.final-preparations.ozma-pumice-piece-rare-steal", itemId: "game-item.pumice-piece", method: "steal", slot: "rare", objectiveIds: ["disc-4.final-preparations.ozma-steals"] },
  { id: "item-path.disc-4.final-preparations.ozma-pumice-drop", itemId: "game-item.pumice", method: "drop", slot: "always", objectiveIds: ["disc-4.final-preparations.ozma-defeated", "disc-4.final-preparations.ozma-rewards"] },
  { id: "item-path.disc-4.final-preparations.ozma-dark-matter-common-drop", itemId: "game-item.dark-matter", method: "drop", slot: "common", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
  { id: "item-path.disc-4.final-preparations.ozma-dark-matter-uncommon-drop", itemId: "game-item.dark-matter", method: "drop", slot: "uncommon", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
  { id: "item-path.disc-4.final-preparations.ozma-dark-matter-rare-drop", itemId: "game-item.dark-matter", method: "drop", slot: "rare", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
];
const ozmaEncounterId = "encounter.final-preparations.ozma";
const ozmaEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.ozma");
const ozmaEncounter = enemyEncounters.find((encounter) => encounter.id === ozmaEncounterId);
if (itemAcquisitionPaths.filter((path) => ozmaLootPaths.some((expected) => expected.id === path.id)).length !== ozmaLootPaths.length) {
  errors.push("Ozma must retain all four steal paths and four distinct drop-slot paths.");
}
for (const expected of ozmaLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? ozmaEnemy?.steals : ozmaEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(ozmaEnemy?.sourceIds ?? []), ...(ozmaEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.final-preparations" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== ozmaEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([ozmaEncounterId]) ||
    ozmaEncounter?.kind !== "boss" ||
    !ozmaEncounter.formation.some((member) => member.enemyId === ozmaEnemy?.id) ||
    expected.objectiveIds.some((objectiveId) => !path.walkthroughObjectiveIds?.includes(objectiveId)) ||
    (expected.method === "steal" && (!path.conditions?.includes("chance-based") || !path.conditions.includes("can fail"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always drop") || !path.conditions.includes("victory"))) ||
    (expected.method === "drop" && expected.slot !== "always" && !path.conditions?.includes("conditional")) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Ozma path ${expected.id} must match its one-time encounter, exact ${expected.slot} loot slot, yield condition, objective, and provenance.`);
  }
}
const finalBattleStealPaths = [
  { id: "item-path.disc-4.the-final-battle.trance-kuja-ether-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.ether", slot: "common", rate: "100%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
  { id: "item-path.disc-4.the-final-battle.trance-kuja-white-robe-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.white-robe", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
  { id: "item-path.disc-4.the-final-battle.rebirth-ring-trance-kuja-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.rebirth-ring", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
  { id: "item-path.disc-4.the-final-battle.necron-elixir-common-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "common", rate: "100%", objectiveIds: ["disc-4.the-final-battle.necron-steals", "disc-4.memoria.deathguise-steals"] },
  { id: "item-path.disc-4.the-final-battle.necron-elixir-uncommon-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
  { id: "item-path.disc-4.the-final-battle.necron-elixir-semi-rare-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "semi-rare", rate: "6.25%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
  { id: "item-path.disc-4.the-final-battle.necron-elixir-rare-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
];
if (itemAcquisitionPaths.filter((path) => finalBattleStealPaths.some((expected) => expected.id === path.id)).length !== finalBattleStealPaths.length) {
  errors.push("The final sequence must retain all three item-bearing Trance Kuja steals and all four Necron Elixir tiers.");
}
for (const expected of finalBattleStealPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === expected.encounterId);
  const slot = enemy?.steals.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.the-final-battle" ||
    path.method !== "steal" ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== expected.enemyId ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([expected.encounterId]) ||
    encounter?.kind !== "boss" ||
    !encounter.formation.some((member) => member.enemyId === expected.enemyId) ||
    expected.objectiveIds.some((objectiveId) => !path.walkthroughObjectiveIds?.includes(objectiveId)) ||
    !path.conditions?.includes(expected.rate) ||
    !path.sourceIds.includes("opatil-steal-list") ||
    (expected.enemyId === "enemy.necron" && (!path.sourceIds.includes("gamefaqs-final-battle-79143") || !`${path.conditions ?? ""} ${path.notes ?? ""}`.includes("Jegged"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Final-battle path ${expected.id} must link its exact boss steal slot, sourced rate, objective, and provenance while preserving known source differences.`);
  }
}
const hadesLootPaths = [
  { id: "item-path.disc-4.memoria.hades-reflect-ring-steal", itemId: "game-item.reflect-ring", method: "steal", slot: "common", rate: "100%", objectiveIds: ["disc-4.memoria.hades-steals"] },
  { id: "item-path.disc-4.memoria.hades-running-shoes-steal", itemId: "game-item.running-shoes", method: "steal", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.memoria.hades-steals", "disc-4.return-to-gaia.updated-shops"] },
  { id: "item-path.disc-4.memoria.hades-battle-boots-steal", itemId: "game-item.battle-boots", method: "steal", slot: "semi-rare", rate: "6.25%", objectiveIds: ["disc-4.memoria.hades-steals"] },
  { id: "item-path.disc-4.memoria.hades-robe-of-lords-steal", itemId: "game-item.robe-of-lords", method: "steal", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.memoria.hades-steals"] },
  { id: "item-path.disc-4.memoria.hades-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveIds: ["disc-4.memoria.hades"] },
  { id: "item-path.disc-4.memoria.hades-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "common", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
  { id: "item-path.disc-4.memoria.hades-elixir-uncommon-drop", itemId: "game-item.elixir", method: "drop", slot: "uncommon", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
  { id: "item-path.disc-4.memoria.hades-elixir-rare-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
];
const hadesEncounterId = "encounter.memoria.hades";
const hadesEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.hades");
const hadesEncounter = enemyEncounters.find((encounter) => encounter.id === hadesEncounterId);
if (itemAcquisitionPaths.filter((path) => hadesLootPaths.some((expected) => expected.id === path.id)).length !== hadesLootPaths.length) {
  errors.push("Hades must retain all four steal slots, its guaranteed Wing Edge, and three separately recorded conditional Elixir slots.");
}
for (const expected of hadesLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? hadesEnemy?.steals : hadesEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(hadesEnemy?.sourceIds ?? []), ...(hadesEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== hadesEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([hadesEncounterId]) ||
    hadesEncounter?.kind !== "boss" ||
    !hadesEncounter.formation.some((member) => member.enemyId === hadesEnemy?.id) ||
    expected.objectiveIds.some((objectiveId) => !path.walkthroughObjectiveIds?.includes(objectiveId)) ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate) || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always drop") || !path.conditions.includes("victory"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.notes?.includes("do not assert three guaranteed Elixirs"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Hades path ${expected.id} must match its one-time encounter, exact ${expected.slot} loot slot, yield semantics, objective, and provenance.`);
  }
}
const tiamatBossLootPaths = [
  { id: "item-path.disc-4.memoria.tiamat-blood-sword-steal", itemId: "game-item.blood-sword", method: "steal", slot: "common", rate: "100%" },
  { id: "item-path.disc-4.memoria.tiamat-feather-boots-steal", itemId: "game-item.feather-boots", method: "steal", slot: "uncommon", rate: "25%" },
  { id: "item-path.disc-4.memoria.tiamat-grand-helm-steal", itemId: "game-item.grand-helm", method: "steal", slot: "rare", rate: "0.39%" },
  { id: "item-path.disc-4.memoria.tiamat-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always" },
  { id: "item-path.disc-4.memoria.tiamat-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
  { id: "item-path.disc-4.memoria.tiamat-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
  { id: "item-path.disc-4.memoria.tiamat-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
];
const tiamatEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.tiamat-memoria");
const tiamatEncounterId = "encounter.memoria.tiamat";
const tiamatEncounter = enemyEncounters.find((encounter) => encounter.id === tiamatEncounterId);
if (itemAcquisitionPaths.filter((path) => tiamatBossLootPaths.some((expected) => expected.id === path.id)).length !== tiamatBossLootPaths.length) {
  errors.push("Memoria Tiamat must retain all seven item-bearing boss slots.");
}
for (const expected of tiamatBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? tiamatEnemy?.steals : tiamatEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(tiamatEnemy?.sourceIds ?? []), ...(tiamatEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== tiamatEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([tiamatEncounterId]) ||
    tiamatEncounter?.kind !== "boss" ||
    !tiamatEncounter.formation.some((member) => member.enemyId === tiamatEnemy?.id) ||
    !path.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-steals") ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate ?? "") || !path.conditions.includes("source-reported") || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always slot") || !path.conditions.includes("victory") || !path.sourceIds.includes("opatil-drop-list"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not guaranteed") || !path.notes?.includes("source-reported, not release-verified"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Memoria Tiamat path ${expected.id} must match its exact boss slot, encounter, yield semantics, objective, and provenance.`);
  }
}
const crystalTiamatLootPaths = [
  { id: "item-path.disc-4.memoria.tiamat-crystal-ether-common-steal", itemId: "game-item.ether", method: "steal", slot: "common", rate: "256/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-ether-uncommon-steal", itemId: "game-item.ether", method: "steal", slot: "uncommon", rate: "64/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-wing-edge-steal", itemId: "game-item.wing-edge", method: "steal", slot: "semi-rare", rate: "16/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-wing-edge-rare-steal", itemId: "game-item.wing-edge", method: "steal", slot: "rare", rate: "1/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-remedy-always-drop", itemId: "game-item.remedy", method: "drop", slot: "always" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-peridot-drop", itemId: "game-item.peridot", method: "drop", slot: "common", rate: "96/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-phoenix-down-uncommon-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "uncommon", rate: "32/256" },
  { id: "item-path.disc-4.memoria.tiamat-crystal-echo-screen-rare-drop", itemId: "game-item.echo-screen", method: "drop", slot: "rare", rate: "1/256" },
];
const crystalTiamatId = "enemy.tiamat-crystal-world";
const crystalTiamatEncounterId = "encounter.memoria.tiamat-crystal-world";
const crystalTiamat = enemyRecords.find((enemy) => enemy.id === crystalTiamatId);
const crystalTiamatEncounter = enemyEncounters.find((encounter) => encounter.id === crystalTiamatEncounterId);
const timeIntervalTiamat = enemyRecords.find((enemy) => enemy.id === "enemy.tiamat-memoria");
const crystalTiamatBlueMagic = crystalTiamat?.blueMagic.find((entry) => entry.name === "Twister");
const crystalTiamatPathIds = itemAcquisitionPaths.filter((path) => path.enemyId === crystalTiamatId && path.encounterIds?.includes(crystalTiamatEncounterId));
if (
  !crystalTiamat ||
  crystalTiamat.name !== "Tiamat [B]" ||
  crystalTiamat.kind !== "ordinary" ||
  crystalTiamat.chapterId !== "disc-4.memoria" ||
  JSON.stringify(crystalTiamat.encounterIds) !== JSON.stringify([crystalTiamatEncounterId]) ||
  crystalTiamatEncounter?.kind !== "random-pool" ||
  crystalTiamatEncounter.location !== "Crystal World" ||
  JSON.stringify(crystalTiamatEncounter.formation) !== JSON.stringify([{ enemyId: crystalTiamatId, quantity: null }]) ||
  !crystalTiamatEncounter.notes.some((note) => note.includes("loot table/prose conflict remains unresolved")) ||
  !crystalTiamat.notes.some((note) => note.includes("lacks Float and Snort")) ||
  !crystalTiamatBlueMagic ||
  crystalTiamatBlueMagic.command !== "Eat" ||
  !crystalTiamatBlueMagic.objectiveIds.includes("disc-4.memoria.quina-blue-magic") ||
  !crystalTiamatBlueMagic.objectiveIds.includes("disc-3.lost-continent.mount-gulug-blue-magic") ||
  !crystalTiamat.sourceIds.includes("gamefaqs-enemy-list-71891") ||
  !crystalTiamat.sourceIds.includes("gamefaqs-memoria-71891") ||
  timeIntervalTiamat?.encounterIds.includes(crystalTiamatEncounterId) ||
  crystalTiamatPathIds.length !== crystalTiamatLootPaths.length
) {
  errors.push("Crystal World Tiamat [B] must remain a separate random encounter with its own sourced profile, Twister route, and visible table/prose conflict.");
}
const expectedCrystalTiamatStats = [["level", 71], ["HP", 24127], ["MP", 3338], ["EXP", 0], ["AP", 7], ["Gil", 2956]] as const;
for (const [field, value] of expectedCrystalTiamatStats) {
  if (!crystalTiamat?.stats.some((entry) => entry.field === field && entry.value === value && entry.verification === "single-source" && entry.sourceIds.includes("gamefaqs-enemy-list-71891"))) {
    errors.push(`Crystal World Tiamat [B] must retain its GameFAQs ${field} value of ${value}.`);
  }
}
for (const expected of crystalTiamatLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? crystalTiamat?.steals : crystalTiamat?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(crystalTiamat?.sourceIds ?? []), ...(crystalTiamatEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "repeatable" ||
    path.enemyId !== crystalTiamatId ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([crystalTiamatEncounterId]) ||
    path.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-achievement") ||
    !path.notes?.includes("revived guardians lack Steals and Drops") ||
    (expected.method === "steal" && (!path.conditions?.includes("Steal attempt can fail") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not release-verified"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always drop") || !path.conditions.includes("KO victory"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not guaranteed") || !path.conditions.includes("not release-verified"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Crystal World Tiamat [B] path ${expected.id} must match its exact repeatable enemy slot, source-reported yield, encounter, conflict note, and provenance.`);
  }
}
const malirisBossLootPaths = [
  { id: "item-path.disc-4.memoria.maliris-genji-armor-steal", itemId: "game-item.genji-armor", method: "steal", slot: "common", rate: "100%" },
  { id: "item-path.disc-4.memoria.maliris-ultima-sword-steal", itemId: "game-item.ultima-sword", method: "steal", slot: "uncommon", rate: "25%" },
  { id: "item-path.disc-4.memoria.maliris-masamune-steal", itemId: "game-item.masamune", method: "steal", slot: "semi-rare", rate: "6.25%" },
  { id: "item-path.disc-4.memoria.maliris-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always" },
  { id: "item-path.disc-4.memoria.maliris-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
  { id: "item-path.disc-4.memoria.maliris-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
  { id: "item-path.disc-4.memoria.maliris-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
];
const malirisEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.maliris");
const malirisEncounterId = "encounter.memoria.maliris";
const malirisEncounter = enemyEncounters.find((encounter) => encounter.id === malirisEncounterId);
if (itemAcquisitionPaths.filter((path) => malirisBossLootPaths.some((expected) => expected.id === path.id)).length !== malirisBossLootPaths.length) {
  errors.push("Memoria Maliris must retain all seven item-bearing boss slots.");
}
for (const expected of malirisBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? malirisEnemy?.steals : malirisEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(malirisEnemy?.sourceIds ?? []), ...(malirisEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== malirisEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([malirisEncounterId]) ||
    malirisEncounter?.kind !== "boss" ||
    !malirisEncounter.formation.some((member) => member.enemyId === malirisEnemy?.id) ||
    !path.walkthroughObjectiveIds?.includes("disc-4.memoria.maliris-steals") ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate ?? "") || !path.conditions.includes("source-reported") || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always") || !path.conditions.includes("victory") || !path.sourceIds.includes("opatil-drop-list"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not guaranteed") || !path.notes?.includes("source-reported, not release-verified"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Memoria Maliris path ${expected.id} must match its exact boss slot, encounter, yield semantics, objective, and provenance.`);
  }
}
const lichBossLootPaths = [
  { id: "item-path.disc-4.memoria.lich-genji-gloves-steal", itemId: "game-item.genji-gloves", method: "steal", slot: "common", rate: "100%" },
  { id: "item-path.disc-4.memoria.lich-sirens-flute-steal", itemId: "game-item.sirens-flute", method: "steal", slot: "uncommon", rate: "25%" },
  { id: "item-path.disc-4.memoria.lich-black-robe-steal", itemId: "game-item.black-robe", method: "steal", slot: "semi-rare", rate: "6.25%" },
  { id: "item-path.disc-4.memoria.lich-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always" },
  { id: "item-path.disc-4.memoria.lich-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
  { id: "item-path.disc-4.memoria.lich-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
  { id: "item-path.disc-4.memoria.lich-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
];
const lichEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.lich-memoria");
const lichEncounterId = "encounter.memoria.lich";
const lichEncounter = enemyEncounters.find((encounter) => encounter.id === lichEncounterId);
if (itemAcquisitionPaths.filter((path) => lichBossLootPaths.some((expected) => expected.id === path.id)).length !== lichBossLootPaths.length) {
  errors.push("Memoria Lich must retain all seven item-bearing boss slots.");
}
for (const expected of lichBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? lichEnemy?.steals : lichEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(lichEnemy?.sourceIds ?? []), ...(lichEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== lichEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([lichEncounterId]) ||
    lichEncounter?.kind !== "boss" ||
    !lichEncounter.formation.some((member) => member.enemyId === lichEnemy?.id) ||
    !path.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals") ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate ?? "") || !path.conditions.includes("source-reported") || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always") || !path.conditions.includes("victory") || !path.sourceIds.includes("opatil-drop-list"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not guaranteed") || !path.notes?.includes("source-reported, not release-verified"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId)) ||
    (expected.itemId === "game-item.black-robe" && (!path.notes?.includes("Semi-Rare") || !path.notes.includes("Rare")))
  ) {
    errors.push(`Memoria Lich path ${expected.id} must match its exact boss slot, encounter, yield semantics, objective, and provenance.`);
  }
}
const deathguiseBossLootPaths = [
  { id: "item-path.disc-4.memoria.deathguise-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", rate: "100%", comparison: "70%", objectiveId: "disc-4.memoria.deathguise-steals" },
  { id: "item-path.disc-4.memoria.deathguise-black-belt-steal", itemId: "game-item.black-belt", method: "steal", slot: "uncommon", rate: "25%", comparison: "23%", objectiveId: "disc-4.memoria.deathguise-steals" },
  { id: "item-path.disc-4.memoria.deathguise-duel-claws-steal", itemId: "game-item.duel-claws", method: "steal", slot: "rare", rate: "0.39%", comparison: "0.4%", label: "Very Rare", objectiveId: "disc-4.memoria.deathguise-steals" },
  { id: "item-path.disc-4.memoria.deathguise-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveId: "disc-4.memoria.deathguise" },
  { id: "item-path.disc-4.memoria.deathguise-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%", label: "Uncommon", objectiveId: "disc-4.memoria.deathguise" },
  { id: "item-path.disc-4.memoria.deathguise-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%", label: "Rare", objectiveId: "disc-4.memoria.deathguise" },
  { id: "item-path.disc-4.memoria.deathguise-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%", comparison: "0.4%", label: "Very Rare", objectiveId: "disc-4.memoria.deathguise" },
];
const deathguiseEnemy = enemyRecords.find((enemy) => enemy.id === "enemy.deathguise");
const deathguiseEncounterId = "encounter.memoria.deathguise";
const deathguiseEncounter = enemyEncounters.find((encounter) => encounter.id === deathguiseEncounterId);
if (itemAcquisitionPaths.filter((path) => deathguiseBossLootPaths.some((expected) => expected.id === path.id)).length !== deathguiseBossLootPaths.length) {
  errors.push("Memoria Deathguise must retain all seven item-bearing boss slots.");
}
for (const expected of deathguiseBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const lootTable = expected.method === "steal" ? deathguiseEnemy?.steals : deathguiseEnemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const requiredSources = new Set([...(deathguiseEnemy?.sourceIds ?? []), ...(deathguiseEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== deathguiseEnemy?.id ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([deathguiseEncounterId]) ||
    deathguiseEncounter?.kind !== "boss" ||
    !deathguiseEncounter.formation.some((member) => member.enemyId === deathguiseEnemy?.id) ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate ?? "") || !path.conditions.includes(expected.comparison ?? "") || !path.conditions.includes("source-reported") || !path.conditions.includes("per connected steal") || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always") || !path.conditions.includes("victory") || !path.sourceIds.includes("opatil-drop-list"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes(expected.rate ?? "") || !path.conditions.includes("not guaranteed") || !path.notes?.includes("source-reported, not release-verified"))) ||
    (expected.comparison && expected.method === "drop" && !path.notes?.includes(expected.comparison)) ||
    (expected.label && !path.notes?.includes(expected.label)) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId)) ||
    (expected.itemId === "game-item.duel-claws" && (!path.notes?.includes("Rare") || !path.notes.includes("Very Rare")))
  ) {
    errors.push(`Memoria Deathguise path ${expected.id} must match its exact boss slot, encounter, yield semantics, objective, and provenance.`);
  }
}
const krakenBossLootPaths = [
  { id: "item-path.disc-4.memoria.kraken-genji-helmet-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.genji-helmet", method: "steal", slot: "common", rate: "100%", comparison: "70%" },
  { id: "item-path.disc-4.memoria.kraken-wizard-rod-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.wizard-rod", method: "steal", slot: "uncommon", rate: "25%", comparison: "23%" },
  { id: "item-path.disc-4.memoria.kraken-gluttons-robe-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.gluttons-robe", method: "steal", slot: "rare", rate: "0.39%", comparison: "0.4%", label: "Very Rare" },
  { id: "item-path.disc-4.memoria.kraken-phoenix-pinion-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always", rate: "100%" },
  { id: "item-path.disc-4.memoria.kraken-phoenix-down-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%", label: "Uncommon" },
  { id: "item-path.disc-4.memoria.kraken-ether-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%", label: "Rare" },
  { id: "item-path.disc-4.memoria.kraken-elixir-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%", comparison: "0.4%", label: "Very Rare" },
  { id: "item-path.disc-4.memoria.kraken-right-tentacle-wing-edge-steal", enemyId: "enemy.kraken-right-tentacle", itemId: "game-item.wing-edge", alternateSlotItemId: "game-item.elixir", method: "steal", slot: "common", rate: "100%", disputed: true, labelNormalization: "Very Common" },
  { id: "item-path.disc-4.memoria.kraken-left-tentacle-elixir-steal", enemyId: "enemy.kraken-left-tentacle", itemId: "game-item.elixir", method: "steal", slot: "common", rate: "100%", labelNormalization: "Very Common" },
  { id: "item-path.disc-4.memoria.kraken-right-tentacle-elixir-steal", enemyId: "enemy.kraken-right-tentacle", itemId: "game-item.elixir", method: "steal", slot: "common", disputed: true },
];
const krakenEncounterId = "encounter.memoria.kraken";
const krakenEncounter = enemyEncounters.find((encounter) => encounter.id === krakenEncounterId);
if (itemAcquisitionPaths.filter((path) => krakenBossLootPaths.some((expected) => expected.id === path.id)).length !== krakenBossLootPaths.length) {
  errors.push("Kraken must retain seven linked body loot slots and three separately linked tentacle-steal paths.");
}
for (const expected of krakenBossLootPaths) {
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const lootTable = expected.method === "steal" ? enemy?.steals : enemy?.drops;
  const slot = lootTable?.find((entry) => entry.slot === expected.slot &&
    (entry.itemId === expected.itemId || entry.itemId === expected.alternateSlotItemId));
  const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(krakenEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (
    !path ||
    !slot ||
    (expected.alternateSlotItemId && (slot.itemId !== expected.alternateSlotItemId || !slot.note?.includes("Wing Edge"))) ||
    path.itemId !== expected.itemId ||
    path.chapterId !== "disc-4.memoria" ||
    path.method !== expected.method ||
    path.quantity !== 1 ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== expected.enemyId ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([krakenEncounterId]) ||
    krakenEncounter?.kind !== "boss" ||
    !krakenEncounter.formation.some((member) => member.enemyId === expected.enemyId) ||
    !path.walkthroughObjectiveIds?.includes("disc-4.memoria.kraken-steals") ||
    (expected.rate && !path.conditions?.includes(expected.rate)) ||
    (expected.method === "steal" && (!path.conditions?.includes("chance-based") || !path.sourceIds.includes("opatil-steal-list"))) ||
    (expected.comparison && !path.conditions?.includes(expected.comparison)) ||
    (expected.method === "steal" && expected.comparison && (!path.conditions?.includes("per connected steal") || !path.notes?.includes("rate scopes differ"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always") || !path.conditions.includes("victory") || !path.sourceIds.includes("opatil-drop-list"))) ||
    (expected.method === "drop" && expected.slot !== "always" && (!path.conditions?.includes("conditional") || !path.conditions.includes("normal KO") || !path.conditions.includes("not guaranteed") || !path.notes?.includes("source-reported, not release-verified"))) ||
    (expected.label && !path.notes?.includes(expected.label)) ||
    (expected.labelNormalization && (!`${path.conditions ?? ""} ${path.notes ?? ""}`.includes(expected.labelNormalization) || !/normaliz\w* to Common/i.test(`${path.conditions ?? ""} ${path.notes ?? ""}`))) ||
    (expected.disputed && !`${path.conditions ?? ""} ${path.notes ?? ""}`.includes("disputed")) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))
  ) {
    errors.push(`Kraken path ${expected.id} must match its one-time enemy slot, source rates, conditional outcome, and encounter provenance.`);
  }
}
const krakenRightTentacle = enemyRecords.find((enemy) => enemy.id === "enemy.kraken-right-tentacle");
const krakenLeftTentacle = enemyRecords.find((enemy) => enemy.id === "enemy.kraken-left-tentacle");
const krakenLeftElixirSlot = krakenLeftTentacle?.steals.find((slot) => slot.itemId === "game-item.elixir" && slot.slot === "common");
const krakenRightElixirSlot = krakenRightTentacle?.steals.find((slot) => slot.itemId === "game-item.elixir" && slot.slot === "common");
const krakenRightWingEdgeSlot = krakenRightTentacle?.steals.find((slot) => slot.slot === "common");
if (
  !krakenRightElixirSlot?.sourceIds.includes("gamefaqs-memoria-71891") ||
  !krakenLeftElixirSlot?.note?.includes("Very Common") ||
  !krakenLeftElixirSlot?.note?.includes("normalizes") ||
  !krakenLeftElixirSlot?.sourceIds.includes("gamefaqs-monster-list-20490") ||
  !krakenRightWingEdgeSlot ||
  krakenRightWingEdgeSlot.itemId !== "game-item.elixir" ||
  !krakenRightWingEdgeSlot.note?.includes("Wing Edge") ||
  !krakenRightWingEdgeSlot.note?.toLowerCase().includes("disputed") ||
  !krakenRightWingEdgeSlot.note.includes("Very Common") ||
  !krakenRightWingEdgeSlot.note.includes("normalizes") ||
  !["gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary", "opatil-steal-list"].every((sourceId) => krakenRightWingEdgeSlot.sourceIds.includes(sourceId))
) {
  errors.push("Kraken's Right Tentacle must preserve both the newer shared Elixir report and the older Wing Edge table as separate Common-slot source claims.");
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
const ipsensTaharkaPreparation = ipsensTaharka?.preparationGuidance;
const ipsensTaharkaPreparationSources = ["gamefaqs-ipsens-castle-71891", "jegged-ipsens-castle", "elitegrindlab-ipsens-castle", "rpgclassics-bestiary-t-z"];
const ipsensTaharkaMirrorStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.ipsens-castle")
  ?.sections.find((section) => section.id === "ipsens-mirrors-and-taharka")
  ?.steps.find((step) => step.id === "ipsens-four-mirrors");
if (!ipsensTaharkaPreparation || ipsensTaharkaPreparation.suggestedLevelRange !== undefined ||
  !ipsensTaharkaPreparation.levelRationale.includes("Level 46 is Taharka's enemy stat") ||
  !ipsensTaharkaPreparation.optionalGrinding.includes("0 EXP") ||
  !ipsensTaharkaPreparation.optionalGrinding.includes("Everyone's Grudge") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("normal Attack-command damage improves with weaker weapons") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("magic and abilities ignore that inversion") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("Orichalcon Semi-Rare") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("Jegged calls it Rare") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("Mustard Bomb or Add Status") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("after the selected steals") ||
  !ipsensTaharkaPreparation.setupAdvice.includes("avoid Earth, which is nullified") ||
  !ipsensTaharkaMirrorStep?.detail.includes("No reviewed source gives a party-level target") ||
  ipsensTaharkaPreparationSources.some((sourceId) => !ipsensTaharkaPreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))) {
  errors.push("Taharka preparation must keep Level 46 separate from party level and preserve the inverted weapon rule, Tonberry warning, source-specific Orichalcon labels, and steal-before-Heat sequence.");
}
const ipsensTaharkaStealPaths = [
  ["item-path.disc-3.ipsens-castle.taharka-elixir-steal", "game-item.elixir", "common"],
  ["item-path.disc-3.ipsens-castle.taharka-mythril-claws-steal", "game-item.mythril-claws", "uncommon"],
  ["item-path.disc-3.ipsens-castle.taharka-orichalcon-steal", "game-item.orichalcon", "semi-rare"],
] as const;
const ipsensTaharkaStealObjective = objectivesById.get("disc-3.ipsens-castle.taharka-steals");
const ipsensTaharkaPathMismatch = ipsensTaharkaStealPaths.some(([pathId, itemId, slotName]) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
  const item = gameItems.find((candidate) => candidate.id === itemId);
  const lootSlot = ipsensTaharka?.steals.find((candidate) => candidate.itemId === itemId && candidate.slot === slotName);
  const requiredSources = new Set([
    ...(ipsensTaharka?.sourceIds ?? []),
    ...(ipsensTaharkaEncounter?.sourceIds ?? []),
    ...(lootSlot?.sourceIds ?? []),
  ]);
  return !path || !item || !lootSlot || lootSlot.itemId !== itemId
    || path.itemId !== itemId
    || path.chapterId !== "disc-3.ipsens-castle"
    || path.method !== "steal"
    || path.quantity !== 1
    || path.availability !== "one-time-encounter"
    || path.enemyId !== "enemy.taharka"
    || path.enemyLootSlot !== slotName
    || JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.ipsens-castle.taharka"])
    || !path.conditions?.includes("chance-based")
    || !path.conditions.includes("can fail")
    || !path.walkthroughObjectiveIds?.includes("disc-3.ipsens-castle.taharka-steals")
    || [...requiredSources].some((sourceId) => !path.sourceIds.includes(sourceId))
    || !["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"].every((sourceId) =>
      lootSlot.sourceIds.includes(sourceId) && path.sourceIds.includes(sourceId) &&
      item.sourceIds.includes(sourceId) && ipsensTaharkaStealObjective?.sourceIds.includes(sourceId) &&
      ipsensTaharkaWarning?.sourceIds.includes(sourceId) && sourceIds.has(sourceId))
    || path.sourceIds.some((sourceId) => !sourceIds.has(sourceId))
    || /\d+(?:\.\d+)?%/.test(path.conditions);
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
  !ipsensTaharkaEncounter.objectiveIds.includes("disc-3.ipsens-castle.taharka-steals") ||
  itemAcquisitionPaths.filter((path) => path.enemyId === "enemy.taharka" && path.method === "steal").length !== ipsensTaharkaStealPaths.length ||
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
const trenoGriffinPreparation = trenoGriffinArena?.preparationGuidance;
const trenoGriffinPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.treno")
  ?.sections.find((section) => section.id === "treno-city-pickups-and-mognet");
const trenoGriffinPreparationStep = trenoGriffinPreparationSection?.steps.find((step) => step.id === "treno-griffin-arena");
if (!trenoGriffinPreparation || trenoGriffinPreparation.suggestedLevelRange !== undefined ||
  !trenoGriffinPreparation.levelRationale.includes("Level 16 is the arena Griffin's enemy stat") ||
  !trenoGriffinPreparation.levelRationale.includes("optional PlayStation benchmark") ||
  !trenoGriffinPreparation.levelRationale.includes("Disc I") ||
  !trenoGriffinPreparation.optionalGrinding.includes("No reviewed route establishes a required party level") ||
  !trenoGriffinPreparation.setupAdvice.includes("Blood Sword") ||
  !trenoGriffinPreparation.setupAdvice.includes("Gold Choker") ||
  !trenoGriffinPreparation.setupAdvice.includes("Bird Killer") ||
  !trenoGriffinPreparation.sourceIds.includes("gamefaqs-boss-guide-37182") ||
  !trenoGriffinPreparation.sourceIds.includes("vgr-no-spoiler-walkthrough") ||
  trenoGriffinPreparation.sourceIds.some((sourceId) => !sourceIds.has(sourceId)) ||
  !trenoGriffinPreparationStep?.detail.includes("older GameFAQs guide suggests a Level 15–16 Steiner") ||
  !trenoGriffinPreparationStep.detail.includes("Auto-Reflect does not block them") ||
  !trenoGriffinPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-37182") ||
  !trenoGriffinPreparationSection.sourceIds.includes("vgr-no-spoiler-walkthrough")) {
  errors.push("Treno Griffin preparation must separate its Level 16 enemy stat from the optional party benchmark and preserve source-backed setup, threat, retry, and disc-label details.");
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
const valiaPiraPreparation = valiaPira?.preparationGuidance;
const valiaPiraSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.desert-palace")?.sections.find((section) => section.id === "desert-palace-valia-pira-and-exit");
const valiaPiraPreparationStep = valiaPiraSection?.steps.find((step) => step.id === "desert-palace-valia-pira-preparation");
const valiaPiraBattleStep = valiaPiraSection?.steps.find((step) => step.id === "desert-palace-valia-pira-battle");
if (!valiaPiraPreparation || valiaPiraPreparation.suggestedLevelRange !== undefined ||
  !valiaPiraPreparation.levelRationale.includes("Level 36") ||
  !valiaPiraPreparation.levelRationale.includes("not a party-level target") ||
  !valiaPiraPreparation.difficultyAssessment?.includes("Medium") ||
  !valiaPiraPreparation.difficultyAssessment.includes("subjective single-source") ||
  !valiaPiraPreparation.optionalGrinding.includes("six bloodstones") ||
  !valiaPiraPreparation.setupAdvice.includes("all six bloodstones") ||
  !valiaPiraPreparation.setupAdvice.includes("all-element nullification") ||
  !valiaPiraPreparation.setupAdvice.includes("Body Temp") ||
  !valiaPiraPreparation.setupAdvice.includes("Reflect") ||
  !valiaPiraPreparation.setupAdvice.includes("Zidane is at Oeilvert") ||
  !valiaPiraPreparation.setupAdvice.includes("Magic Hammer or Osmose") ||
  !valiaPiraPreparation.setupAdvice.includes("Water weakness is disputed") ||
  !valiaPiraPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !valiaPira?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !valiaPiraSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !valiaPiraPreparationStep?.text.includes("all six bloodstones") ||
  !valiaPiraPreparationStep.detail?.includes("Level 36 is the boss's stat") ||
  !valiaPiraBattleStep?.detail?.includes("Water weakness is disputed")) {
  errors.push("Valia Pira preparation must distinguish enemy level from party guidance, connect the six-stone and magic counters to its boss checkpoint, and retain the Water weakness dispute.");
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
const postDestructionAlexandriaDisc3Step = postDestructionAlexandriaCardSteps.find((step) => step.id === "high-seas-alexandria-first-visit-card-players");
const postDestructionAlexandriaDisc4Step = postDestructionAlexandriaCardSteps.find((step) => step.id === "gaia-return-alexandria-first-visit-card-players");
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
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("steam-tetra-endgame-opponents-687154254")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaCardObjective.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaCardObjective.chapterIds?.includes("disc-3.on-the-high-seas")
  || !postDestructionAlexandriaCardObjective.chapterIds.includes("disc-4.return-to-gaia")
  || !postDestructionAlexandriaCardWarning
  || postDestructionAlexandriaCardWarning.classification.includes("permanently-missable")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("cour89-card-players")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("gamefaqs-card-locations-24067")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("steam-tetra-endgame-opponents-687154254")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaCardWarning.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaCardWarning.note?.includes("GameFAQs lists two Red Mages and Hippaul")
  || !postDestructionAlexandriaCardWarning.note.includes("Xbox achievement guide's indexed text")
  || !postDestructionAlexandriaCardWarning.note.includes("applicable only when Disc IV is the first Inn entry")
  || postDestructionAlexandriaCardSteps.length !== 2
  || !postDestructionAlexandriaDisc3Step
  || !["male Red Mage", "female Red Mage", "Kabao"].every((name) => postDestructionAlexandriaDisc3Step.text.includes(name))
  || !postDestructionAlexandriaDisc3Step.text.includes("first post-destruction Alexandria visit")
  || !postDestructionAlexandriaDisc4Step
  || !postDestructionAlexandriaDisc4Step.text.includes("skipped the entire Disc III Alexandria visit")
  || !postDestructionAlexandriaDisc4Step.text.includes("first Disc IV Inn entry")
  || postDestructionAlexandriaCardCutoffs.length !== 2
  || postDestructionAlexandriaCardCutoffs.some((cutoff) => cutoff.certainty !== "disputed")
  || postDestructionAlexandriaCardCutoffs.some((cutoff) =>
    !cutoff.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
    || !cutoff.sourceIds.includes("steam-tetra-endgame-opponents-687154254")
    || !cutoff.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
    || !cutoff.sourceIds.includes("trueachievements-tetra-master-guide")
  )
  || !postDestructionAlexandriaDetour
  || postDestructionAlexandriaDetour.relationship !== "optional-return"
  || postDestructionAlexandriaDetour.toChapterId !== "disc-1.alexandria"
  || !postDestructionAlexandriaDetour.sourceIds.includes("jegged-blue-narciss")
  || !postDestructionAlexandriaDetour.sourceIds.includes("steam-tetra-disc4-opponents-729676856")
  || !postDestructionAlexandriaDetour.sourceIds.includes("steam-tetra-endgame-opponents-687154254")
  || !postDestructionAlexandriaDetour.sourceIds.includes("steam-tetra-opponents-disc4-2804532988")
  || !postDestructionAlexandriaDetour.sourceIds.includes("trueachievements-tetra-master-guide")
  || !postDestructionAlexandriaDetour.sourceIds.includes("rpgclassics-alexandria-ruins")
  || !postDestructionAlexandriaDetourRejoin
  || postDestructionAlexandriaDetourRejoin.relationship !== "rejoin"
  || !postDestructionAlexandriaDetourRejoin.sourceIds.includes("gamefaqs-on-the-high-seas-71891")
  || postDestructionAlexandriaDetourRejoin.sourceIds.includes("jegged-blue-narciss")
  || postDestructionAlexandriaDetourRejoin.sourceIds.includes("rpgclassics-alexandria-ruins")
  || !sources.find((source) => source.id === "jegged-blue-narciss")?.notes.includes("does not specify returning from the Alexandria sweep to the Blue Narciss")
  || !sources.find((source) => source.id === "rpgclassics-alexandria-ruins")?.notes.includes("does not identify or time its card matches")
  || !sources.find((source) => source.id === "rpgclassics-alexandria-ruins")?.notes.includes("does not document the return to the Blue Narciss")
  || !sources.find((source) => source.id === "steam-tetra-disc4-opponents-729676856")?.notes.includes("a 2023 comment reports that Hippaul and the Red Mage are not at Alexandria Inn on Disc IV")
  || !sources.find((source) => source.id === "steam-tetra-endgame-opponents-687154254")?.notes.includes("the first Alexandria Inn entry on Disc IV triggers a scene")
  || !sources.find((source) => source.id === "steam-tetra-endgame-opponents-687154254")?.notes.includes("does not independently confirm the scene or Hippaul match")
  || !sources.find((source) => source.id === "steam-tetra-opponents-disc4-2804532988")?.notes.includes("omission alone does not establish they are unavailable")
  || !sources.find((source) => source.id === "trueachievements-tetra-master-guide")?.notes.includes("two Red Mages and Hippaul are at the Alexandria Inn at endgame")
) {
  errors.push("The post-destruction Alexandria Inn matches must preserve the Disc III safe checkpoint, the conflicting source reports, optional-match scope, and anecdotal first-Disc-IV-entry fallback; the harbor rejoin must cite the direct Blue Narciss return instruction.");
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
  !mountainMoonstoneFinalWarning.sourceIds.includes("ios-game-center-achievements") ||
  !mountainMoonstoneFinalWarning.sourceIds.includes("android-google-play-achievements") ||
  !mountainMoonstoneObjective?.achievementPlatforms?.includes("steam") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("ps4") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("xbox") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("ios") ||
  !mountainMoonstoneObjective.achievementPlatforms.includes("android") ||
  !mountainMoonstoneObjective.sourceIds.includes("gamefaqs-achievements-71891") ||
  !mountainMoonstoneObjective.sourceIds.includes("gamerguides-over-the-moon-achievement") ||
  !mountainMoonstoneObjective.sourceIds.includes("xboxachievements-FFIX-list") ||
  !mountainMoonstoneObjective.sourceIds.includes("ios-game-center-achievements") ||
  !mountainMoonstoneObjective.sourceIds.includes("android-google-play-achievements") ||
  moonstoneAchievementCriteria.length !== 5 ||
  moonstoneAchievementCriteria.some(({ platform, record }) =>
    !record || record.criteria !== "Obtain 4 moonstones." ||
    !record.guideObjectiveIds?.includes(mountainMoonstoneObjectiveId) ||
    !record.guideSourceIds?.includes("gamerguides-over-the-moon-achievement") ||
    !["steam", "ps4", "xbox", "ios", "android"].includes(platform)) ||
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
const ipsensDisc3And4EquipmentSlugs = new Set([
  "mage-masher", "iron-sword", "mythril-spear", "poison-knuckles", "multina-racket", "mythril-rod",
  "lamias-flute", "oak-staff", "needle-fork", "rising-sun", "n-kai-armlet", "jade-armlet",
  "venetia-shield", "red-hat", "golden-hairpin", "cross-helm", "diamond-helm", "power-vest",
  "gaia-gear", "shield-armor", "demons-mail",
]);
const ipsensDisc3And4EquipmentMismatch = ipsensEquipmentPaths
  .filter(({ slug }) => ipsensDisc3And4EquipmentSlugs.has(slug))
  .some(({ item, paths }) => {
    const path = paths[0];
    return paths.length !== 1
      || path?.availability !== "repeatable"
      || !path.sourceIds.includes("gamefaqs-equipment-33383")
      || !path.sourceIds.includes("icksmehl-shops-disc-4")
      || !path.conditions.includes("Disc III/IV")
      || !path.conditions.includes("icksmehl.de")
      || !item?.sourceIds.includes("gamefaqs-equipment-33383");
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
    return !path.conditions.includes("7,000 Gil") ||
      !path.conditions.includes("5,000 Gil") ||
      !path.conditions.includes("icksmehl.de lists Poison Knuckles for 5,000 Gil") ||
      !path.conditions.includes("both its Disc III and Disc IV Ipsen tables") ||
      !path.sourceIds.includes("gamefaqs-shop-lists-9772") ||
      !path.sourceIds.includes("gamefaqs-equipment-33383") ||
      !path.sourceIds.includes("icksmehl-shops-disc-3") ||
      !path.sourceIds.includes("icksmehl-shops-disc-4") ||
      !item.sourceIds.includes("gamefaqs-shop-lists-9772") ||
      !item.sourceIds.includes("gamefaqs-equipment-33383") ||
      !item.sourceIds.includes("icksmehl-shops-disc-3") ||
      !item.sourceIds.includes("icksmehl-shops-disc-4");
  }
  if (slug === "n-kai-armlet") {
    return !path.conditions.includes("Kains Armreif")
      || !path.conditions.includes("likely corresponds to N-Kai Armlet")
      || !path.conditions.includes("Disc III shop table omits that row")
      || !path.conditions.includes("not proof that Disc III stock is unavailable")
      || !path.sourceIds.includes("icksmehl-shops-disc-3")
      || !path.sourceIds.includes("icksmehl-shops-disc-4")
      || !path.sourceIds.includes("icksmehl-armlets")
      || !item.sourceIds.includes("icksmehl-armlets")
      || !item.sourceIds.includes("icksmehl-shops-disc-3")
      || !item.sourceIds.includes("icksmehl-shops-disc-4");
  }
  if (slug === "needle-fork") {
    return !path.conditions.includes("GameFAQs Shops omits");
  }
  if (slug === "coronet") {
    return path.availability !== "window-unverified"
      || !path.conditions.includes("GameFAQs Shops and Final Fantasy Online")
      || !path.conditions.includes("DrSlice classifies Kumool's Mogshop there as a Disc III shop")
      || !path.conditions.includes("do not establish exact stock timing or whether Coronet remains in stock on the Disc IV return")
      || !path.conditions.includes("icksmehl.de's Disc III/IV Ipsen tables")
      || !path.conditions.includes("these omissions do not prove absence")
      || !path.sourceIds.includes("ffonline-ipsens-castle")
      || !path.sourceIds.includes("drslice-ff9-shops")
      || !path.sourceIds.includes("ffwiki-shops")
      || !path.sourceIds.includes("gamefaqs-equipment-33383")
      || !path.sourceIds.includes("icksmehl-shops-disc-3")
      || !path.sourceIds.includes("icksmehl-shops-disc-4")
      || !item.sourceIds.includes("ffonline-ipsens-castle")
      || !item.sourceIds.includes("ffwiki-shops")
      || !item.sourceIds.includes("gamefaqs-equipment-33383")
      || !item.sourceIds.includes("icksmehl-shops-disc-3")
      || !item.sourceIds.includes("icksmehl-shops-disc-4");
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
  ["mythril-spear", "Reis's Wind"],
  ["poison-knuckles", "Spare Change"], ["poison-knuckles", "Counter"],
  ["lamias-flute", "Float"], ["lamias-flute", "Stona"], ["lamias-flute", "Silence"],
  ["oak-staff", "Stop"], ["oak-staff", "Bio"], ["oak-staff", "Drain"],
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
if (ipsensEquipmentStock.length !== 22 || ipsensEquipmentPaths.length !== 22 || ipsensDisc3And4EquipmentSlugs.size !== 21 || ipsensDisc3And4EquipmentMismatch || ipsensStockRouteMismatch || ipsensTargetMismatch || ipsensAbilityMismatch) {
  errors.push("Ipsen's Castle equipment stock must retain 22 source-linked Mogshop routes, Disc III/IV evidence for the 21 GameFAQs Equipment List sellers, the N-Kai/Kains Armreif identity inference and Disc III table omission caveat, the unverified Coronet exception, GameFAQs/RPGClassics Poison Knuckles and stock-table differences, each Need count and positive end-inventory target except Rising Sun, zero-count end-inventory source notes, and the listed equipment abilities.");
}
const nKaiAcquisitionPathExpectations = [
  { id: "item-path.disc-3.desert-palace.n-kai-armlet-bloodstone", chapterId: "disc-3.desert-palace", method: "fixed-pickup", availability: "single-use", objectiveId: "disc-3.desert-palace.bloodstones" },
  { id: "item-path.disc-3.on-the-high-seas.n-kai-armlet-abandoned-lagoon", chapterId: "disc-3.on-the-high-seas", method: "chocograph", availability: "conditional", objectiveId: "disc-3.on-the-high-seas.chocographs" },
  { id: "item-path.disc-3.lost-continent.n-kai-armlet-esto-gaza-shop", chapterId: "disc-3.lost-continent", method: "shop", availability: "limited-window", objectiveId: "disc-3.lost-continent.esto-gaza-stock", shopId: "esto-gaza.weapon-shop.after-desert-palace", price: 3000 },
  { id: "item-path.disc-3.aerial-exploration.n-kai-armlet-daguerreo-shop", chapterId: "disc-3.aerial-exploration", method: "shop", availability: "limited-window", objectiveId: "disc-3.aerial-exploration.daguerreo-stock", shopId: "daguerreo.weapon-shop", price: 3000, sourceId: "gamefaqs-return-to-gaia-71891", recommendedBeforeChapterId: "disc-3.preparing-to-leave", conditionPhrase: "omits it from the explicit Disc IV replacement list" },
  { id: "item-path.disc-3.ipsens-castle.kumool-mogshop.n-kai-armlet", chapterId: "disc-3.ipsens-castle", method: "mogshop", availability: "repeatable", shopId: "ipsens-castle.kumool-mogshop", price: 3000, sourceId: "gamefaqs-equipment-33383", conditionPhrase: "Disc III/IV" },
] as const;
const nKaiAcquisitionPathMismatch = nKaiAcquisitionPathExpectations.some((expected) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.id);
  return !path
    || path.itemId !== "game-item.n-kai-armlet"
    || path.chapterId !== expected.chapterId
    || path.method !== expected.method
    || path.availability !== expected.availability
    || ("objectiveId" in expected && !path.walkthroughObjectiveIds?.includes(expected.objectiveId))
    || !path.sourceIds.includes("gamefaqs-items-71891")
    || ("conditionPhrase" in expected && !path.conditions.includes(expected.conditionPhrase))
    || ("sourceId" in expected && !path.sourceIds.includes(expected.sourceId))
    || ("recommendedBeforeChapterId" in expected && path.recommendedBeforeChapterId !== expected.recommendedBeforeChapterId)
    || ("shopId" in expected && path.shopId !== expected.shopId)
    || ("price" in expected && path.cost?.amount !== expected.price);
}) || !gameItems.find((item) => item.id === "game-item.n-kai-armlet")?.sourceIds.includes("gamefaqs-equipment-33383");
if (nKaiAcquisitionPathMismatch) {
  errors.push("N-Kai Armlet must retain source-linked Desert Palace and Abandoned Lagoon pickups plus Esto Gaza and Disc III Daguerreo shop paths, including the Reef gate and Disc IV stock-refresh cutoff.");
}
const jadeArmletAcquisitionPathExpectations = [
  { id: "item-path.disc-3.on-the-high-seas.jade-armlet-uncultivated-land", chapterId: "disc-3.on-the-high-seas", method: "chocograph", availability: "conditional", objectiveId: "disc-3.on-the-high-seas.chocographs", sourceId: "jegged-chocographs", conditionPhrase: "GameFAQs lists no Chocobo ability requirement" },
  { id: "item-path.disc-3.lost-continent.jade-armlet-esto-gaza-shop", chapterId: "disc-3.lost-continent", method: "shop", availability: "limited-window", objectiveId: "disc-3.lost-continent.esto-gaza-stock", shopId: "esto-gaza.weapon-shop.after-desert-palace", price: 3400, sourceId: "gamefaqs-shops-71891" },
  { id: "item-path.disc-3.aerial-exploration.jade-armlet-daguerreo-shop", chapterId: "disc-3.aerial-exploration", method: "shop", availability: "limited-window", objectiveId: "disc-3.aerial-exploration.daguerreo-stock", shopId: "daguerreo.weapon-shop", price: 3400, sourceId: "gamefaqs-return-to-gaia-71891", recommendedBeforeChapterId: "disc-3.preparing-to-leave", conditionPhrase: "omits it from the explicit Disc IV replacement list" },
  { id: "item-path.disc-3.ipsens-castle.kumool-mogshop.jade-armlet", chapterId: "disc-3.ipsens-castle", method: "mogshop", availability: "repeatable", shopId: "ipsens-castle.kumool-mogshop", price: 3400, sourceId: "gamefaqs-equipment-33383", conditionPhrase: "Disc III/IV" },
] as const;
const jadeArmletAcquisitionPathMismatch = jadeArmletAcquisitionPathExpectations.some((expected) => {
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.id);
  return !path
    || path.itemId !== "game-item.jade-armlet"
    || path.chapterId !== expected.chapterId
    || path.method !== expected.method
    || path.availability !== expected.availability
    || ("objectiveId" in expected && !path.walkthroughObjectiveIds?.includes(expected.objectiveId))
    || !path.sourceIds.includes(expected.sourceId)
    || ("conditionPhrase" in expected && !path.conditions.includes(expected.conditionPhrase))
    || ("recommendedBeforeChapterId" in expected && path.recommendedBeforeChapterId !== expected.recommendedBeforeChapterId)
    || ("shopId" in expected && path.shopId !== expected.shopId)
    || ("price" in expected && path.cost?.amount !== expected.price);
}) || !gameItems.find((item) => item.id === "game-item.jade-armlet")?.sourceIds.includes("gamefaqs-equipment-33383");
if (jadeArmletAcquisitionPathMismatch) {
  errors.push("Jade Armlet must retain source-linked Chocograph #3, Esto Gaza, and Disc III Daguerreo paths with the access difference and Disc IV stock-refresh cutoff.");
}
const ipsensSupplyStock = [
  ["potion", 50], ["hi-potion", 200], ["phoenix-down", 150], ["echo-screen", 50],
  ["soft", 100], ["antidote", 50], ["eye-drops", 50], ["magic-tag", 100],
  ["remedy", 300], ["vaccine", 100], ["annoyntment", 150], ["tent", 800],
] as const;
const ipsensDisc4RepeatableSupplySlugs = new Set([
  "potion", "hi-potion", "phoenix-down", "echo-screen", "soft", "antidote",
  "eye-drops", "magic-tag", "vaccine", "annoyntment", "tent",
]);
const ipsensDisc3ListedSupplySlugs = new Set([
  "hi-potion", "phoenix-down", "magic-tag", "remedy", "vaccine", "annoyntment", "tent",
]);
const ipsensDisc3OmittedSupplySlugs = new Set([
  "potion", "echo-screen", "soft", "antidote", "eye-drops",
]);
const ipsensSupplyRouteMismatch = ipsensSupplyStock.some(([slug, expectedPrice]) => {
  const itemId = `game-item.${slug}`;
  const item = gameItems.find((candidate) => candidate.id === itemId);
  const paths = itemAcquisitionPaths.filter((path) => path.itemId === itemId && path.shopId === "ipsens-castle.kumool-mogshop");
  const disc3Path = paths.find((path) => path.chapterId === "disc-3.ipsens-castle");
  const disc4Path = paths.find((path) => path.chapterId === "disc-4.return-to-gaia");
  if (
    !item
    || paths.length !== 2
    || disc3Path?.id !== `item-path.disc-3.ipsens-castle.kumool-mogshop.${slug}`
    || disc3Path.method !== "mogshop"
    || disc3Path.availability !== "repeatable"
    || disc3Path.cost?.amount !== expectedPrice
    || !disc3Path.sourceIds.includes("gamefaqs-items-71891")
    || !disc3Path.sourceIds.includes("gamefaqs-shops-71891")
    || !disc3Path.sourceIds.includes("rpgclassics-shops")
    || !disc3Path.sourceIds.includes("icksmehl-shops-disc-3")
    || disc4Path?.id !== `item-path.disc-4.return-to-gaia.kumool-mogshop.${slug}`
    || disc4Path.method !== "mogshop"
    || disc4Path.availability !== (ipsensDisc4RepeatableSupplySlugs.has(slug) ? "repeatable" : "window-unverified")
    || disc4Path.cost?.amount !== expectedPrice
    || !disc4Path.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.mognet-letter-24")
    || !disc4Path.sourceIds.includes("icksmehl-shops-disc-4")
    || !disc4Path.sourceIds.includes("gamefaqs-return-to-gaia-71891")
    || !disc4Path.sourceIds.includes("gamefaqs-ipsens-castle-71891")
    || !disc4Path.sourceIds.includes("elitegrindlab-ipsens-castle")
    || !disc4Path.sourceIds.includes("gamefaqs-shops-71891")
    || !disc4Path.sourceIds.includes("rpgclassics-shops")
    || !item.sourceIds.includes("gamefaqs-items-71891")
    || !item.sourceIds.includes("rpgclassics-shops")
    || !item.sourceIds.includes("gamefaqs-ipsens-castle-71891")
    || !item.sourceIds.includes("elitegrindlab-ipsens-castle")
    || (slug === "magic-tag" && (!item.sourceIds.includes("ffwiki-magic-tag") || !disc3Path.sourceIds.includes("icksmehl-shops-disc-3") || !disc3Path.sourceIds.includes("ffwiki-magic-tag") || !disc4Path.sourceIds.includes("icksmehl-shops-disc-3") || !disc4Path.sourceIds.includes("ffwiki-magic-tag")))
  ) return true;
  if (slug === "remedy") return !disc3Path.conditions.includes("Disc III Ipsen table lists Remedy (Allheilmittel) for 300 Gil") || !disc4Path.conditions.includes("omits Allheilmittel (Remedy)") || !disc4Path.conditions.includes("remains unverified");
  if (slug === "magic-tag") return !disc3Path.conditions.includes("Disc III Ipsen table lists Talisman for 150 Gil") || !disc3Path.conditions.includes("Magic Tag for 100 Gil") || !disc4Path.conditions.includes("Disc III and Disc IV Ipsen inventory tables") || !disc4Path.conditions.includes("Talisman for 150 Gil") || !disc4Path.conditions.includes("Magic Tag for 100 Gil");
  if (ipsensDisc3OmittedSupplySlugs.has(slug)) return !disc3Path.conditions.includes("Disc III Ipsen table omits this product") || !disc3Path.conditions.includes("does not prove the item is unavailable in game");
  if (ipsensDisc3ListedSupplySlugs.has(slug)) return !disc3Path.conditions.includes("Disc III Ipsen table includes its corresponding German-language row at that price");
  return !disc4Path.conditions.includes("Disc IV Ipsen inventory table") || !disc4Path.conditions.includes(item.name);
});
const icksmehlIpsenDisc3Source = sources.find((source) => source.id === "icksmehl-shops-disc-3");
const icksmehlIpsenSource = sources.find((source) => source.id === "icksmehl-shops-disc-4");
const icksmehlArmletsSource = sources.find((source) => source.id === "icksmehl-armlets");
const ffwikiMagicTagSource = sources.find((source) => source.id === "ffwiki-magic-tag");
if (
  ipsensEquipmentStock.length + ipsensSupplyStock.length !== 34
  || ipsensSupplyRouteMismatch
  || !icksmehlIpsenDisc3Source?.notes.includes("seven priced supplies")
  || !icksmehlIpsenDisc3Source.notes.includes("omits Potion, Echo Screen, Soft, Antidote, and Eye Drops")
  || !icksmehlIpsenDisc3Source?.notes.includes("Poison Knuckles for 5,000 Gil")
  || !icksmehlIpsenDisc3Source.notes.includes("Talisman for 150 Gil")
  || !icksmehlIpsenDisc3Source.notes.includes("omits Coronet and Kains Armreif")
  || !icksmehlIpsenSource?.notes.includes("21 equipment products")
  || !icksmehlIpsenSource.notes.includes("Kains Armreif")
  || !icksmehlIpsenSource.notes.includes("Disc III Ipsen table omits the Kains Armreif/N-Kai row")
  || !icksmehlIpsenSource.notes.includes("omits Coronet")
  || !icksmehlIpsenSource?.notes.includes("omits Allheilmittel (Remedy)")
  || !icksmehlIpsenSource.notes.includes("Talisman for 150 Gil")
  || !icksmehlArmletsSource?.notes.includes("Kains Armreif as item 27")
  || !icksmehlArmletsSource.notes.includes("strongly support the item mapping")
  || !icksmehlArmletsSource.notes.includes("records it as an inference")
  || !ffwikiMagicTagSource?.notes.includes("Japanese name as Ofuda")
  || !ffwikiMagicTagSource.notes.includes("Talisman")
) {
  errors.push("Ipsen's Castle Mogshop must retain twelve English Disc III supply paths and twelve separate Disc IV paths, record icksmehl's seven Disc III/five omitted supply rows and Disc IV Remedy omission, classify the eleven Disc IV listed products as repeatable, preserve the Magic Tag/Talisman price conflict, and link late routes to Kumool's Mognet return.");
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
const playOnlineFrenchHippaulGuide = sources.find((source) => source.id === "playonline-guide-fr-fhiprace");
const gamefaqsHippaulRacing = sources.find((source) => source.id === "gamefaqs-hippaul-racing-10181");
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
  || !cour89MognetLetters.notes.includes("level 20 or higher while the Treno Card Tournament is underway")
  || !cour89MognetLetters.notes.includes("level 60 or above")
  || !playOnlineFrenchHippaulGuide?.notes.includes("exceeds 20 (>20)")
  || !gamefaqsHippaulRacing?.notes.includes("does not say the letter first unlocks only at level 80")
  || !gamefaqsMoogleFaq?.notes.includes("if Hippaul has been raced")
  || !gamefaqsCardTournament?.notes.includes("if Athlete Queen was won")
  || !mogrichLetterObjective?.title.includes("New Champion")
  || !mogrichLetterObjective.sourceIds.includes("cour89-mognet-letters")
  || !mogrichLetterObjective.sourceIds.includes("playonline-guide-fr-fhiprace")
  || !mogrichLetterObjective.sourceIds.includes("gamefaqs-hippaul-racing-10181")
  || !mogrichLetterWarning?.classification.includes("conditional")
  || !mogrichLetterWarning.consequence.includes("at least level 21")
  || !mogrichLetterWarning.consequence.includes("do not establish the earliest unlock")
  || !mogrichLetterWarning.consequence.includes("does not block the separate Disc IV Mognet Central repair chain")
  || !mogrichLetterWarning.recovery.includes("later Treno visit remains unverified")
  || !mogrichLetterWarning.sourceIds.includes("gamerguides-mognet-central")
  || !mogrichLetterWarning.sourceIds.includes("playonline-guide-fr-fhiprace")
  || !mogrichLetterWarning.sourceIds.includes("gamefaqs-hippaul-racing-10181")
  || mogrichLetterCutoff?.certainty !== "conservative"
  || mogrichLetterCutoff.edgeId !== cardTournamentActivityCutoff?.edgeId
  || mogrichLetterCutoff.missableIds.length !== 1
  || !mogrichLetterCutoff.missableIds.includes(mogrichLetterWarning.id)
  || !mogrichLetterCutoff.trigger.includes("level 20")
  || !mogrichLetterCutoff.trigger.includes("at least level 21")
  || !mogrichLetterCutoff.trigger.includes("before starting the third game")
  || cardTournamentActivityCutoff?.missableIds.includes(mogrichLetterWarning.id)
  || !mogrichTournamentSection?.sourceIds.includes("cour89-mognet-letters")
  || !mogrichTournamentSection.sourceIds.includes("playonline-guide-fr-fhiprace")
  || !mogrichTournamentSection.sourceIds.includes("gamefaqs-hippaul-racing-10181")
  || !mogrichTournamentStep?.objectiveIds.includes(mogrichLetterObjective.id)
  || !mogrichTournamentStep.text.includes("level 20")
  || !mogrichTournamentStep.text.includes("level 21")
  || !mogrichTournamentStep.detail?.includes("Athlete Queen")
  || !mogrichTournamentStep.detail.includes("above level 20")
  || !mogrichTournamentStep.detail.includes("Treno availability remains unverified")
) {
  errors.push("Mogrich's optional New Champion letter must preserve the Cour89 level-20 and French guide above-20 discrepancy, the level-21 fallback, older PlayStation wording, a conservative pre-final-game cutoff, and independence from Mognet Central repair.");
}
const namingwayObjective = objectivesById.get("disc-3.card-tournament.namingway-card");
const namingwayWarning = missablesById.get("missable.disc-3.card-tournament.namingway-card");
const namingwayFinalCutoff = cutoffsById.get("cutoff.shimmering-island.disc-iii-departure");
const namingwayReturnEdge = gameRouteEdgesById.get("detour.lost-continent-desert-palace-namingway-return");
const namingwayDesertPalaceExitEdge = gameRouteEdgesById.get("story.desert-palace-to-lost-continent");
const namingwayGamerGuidesSource = sources.find((source) => source.id === "gamerguides-desert-palace");
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
  || !namingwayReturnEdge.sourceIds.includes("gamefaqs-lost-continent-71891")
  || !namingwayReturnEdge.sourceIds.includes("jegged-returning-desert-palace")
  || !namingwayReturnEdge.sourceIds.includes("gamerguides-desert-palace")
  || !namingwayReturnEdge.sourceIds.includes("elitegrindlab-desert-palace")
  || !namingwayReturnEdge.summary.includes("GameFAQs alone documents this later re-entry route")
  || !namingwayReturnEdge.summary.includes("initial post-Oeilvert return")
  || !namingwayReturnEdge.summary.includes("do not verify later re-entry or retention")
  || !namingwayReturnEdge.summary.includes("Gamer Guides calls it the second and last chance")
  || !namingwayWarning.note.includes("end-of-Disc-III fallback remains directly sourced only to GameFAQs")
  || !namingwayGamerGuidesSource?.url.endsWith("/the-desert-palace-2")
  || !namingwayGamerGuidesSource.notes.includes("second and last chance")
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
const mognetDeliveryRouteEdges = mognetRouteEdges.slice(0, -1);
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
  || mognetDeliveryRouteEdges.some((edge) => !edge?.sourceIds.includes("jegged-mognet-central") || !edge.sourceIds.includes("cour89-mognet-letters"))
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
  || !mognetRepairRoute.sourceIds.includes("gamefaqs-return-to-gaia-71891")
  || mognetRepairRoute.sourceIds.includes("jegged-mognet-central")
  || mognetRepairRoute.sourceIds.includes("cour89-mognet-letters")
  || !mognetRepairSection?.sourceIds.includes("cour89-mognet-letters")
  || !mognetRepairSection.sourceIds.includes("gamefaqs-ipsens-castle-71891")
  || !mognetRepairSection.sourceIds.includes("elitegrindlab-ipsens-castle")
  || mognetLetterObjectiveIds.some((id) => !objectivesById.get(id)?.sourceIds.includes("cour89-mognet-letters")
    || !objectivesById.get(id)?.sourceIds.includes("jegged-mognet-central"))
  || actualMognetQuestEdges.join("|") !== expectedMognetQuestEdges.join("|")
  || mognetLetterSteps.some((step, index) => !step?.objectiveIds?.includes(mognetLetterObjectiveIds[index]))
  || !mognetLetterSteps[0]?.text.includes("#22")
  || !mognetLetterSteps[2]?.detail?.includes("11 consumables")
  || !mognetLetterSteps[2]?.detail?.includes("omits Coronet and Remedy (Allheilmittel)")
  || !mognetLetterSteps[2]?.detail?.includes("150 Gil")
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
  errors.push("The Mognet branch must source its delivery/reward steps, track the #22–27 repair and Ocean/crack prerequisites, and keep delivery-only references off the Invincible rejoin.");
}
const disc4TrenoReturnEdge = gameRouteEdgesById.get("detour.return-to-gaia-treno-behemoth");
const disc4TrenoRejoinEdge = gameRouteEdgesById.get("detour.treno-behemoth-rejoin-gaia");
const disc4IpsenRejoinEdge = gameRouteEdgesById.get("detour.ipsens-castle-aquarius-rejoin-gaia");
const disc4KupoNutDetourEdge = gameRouteEdgesById.get("detour.return-to-gaia-gizamaluke-kupo-nut");
const disc4KupoNutRejoinEdge = gameRouteEdgesById.get("detour.gizamaluke-kupo-nut-rejoin-gaia");
const disc4MadainSariDetourEdge = gameRouteEdgesById.get("detour.return-to-gaia-madain-sari-eidolon-wall");
const disc4MadainSariRejoinEdge = gameRouteEdgesById.get("detour.madain-sari-eidolon-wall-rejoin-gaia");
const disc4LindblumStellazzioDetourEdge = gameRouteEdgesById.get("detour.return-to-gaia-lindblum-sagittarius");
const disc4LindblumStellazzioRejoinEdge = gameRouteEdgesById.get("detour.lindblum-sagittarius-rejoin-gaia");
const disc4DaguerreoStellazzioDetourEdge = gameRouteEdgesById.get("detour.return-to-gaia-daguerreo-capricorn");
const disc4DaguerreoStellazzioRejoinEdge = gameRouteEdgesById.get("detour.daguerreo-capricorn-rejoin-gaia");
const disc4LocationListSource = sources.find((source) => source.id === "ff9-kouryaku-disc4");
if (
  !disc4TrenoReturnEdge?.summary.includes("Quan's Dwelling") ||
  !disc4TrenoReturnEdge.summary.includes("Ophiucus") ||
  !disc4TrenoReturnEdge.sourceIds.includes("ff9-kouryaku-disc4") ||
  !disc4TrenoReturnEdge.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  !disc4LocationListSource?.notes.includes("accessible-location list includes Treno and Burmecia") ||
  !disc4LocationListSource.notes.includes("does not describe returning from a Treno outing to the Invincible") ||
  !disc4TrenoRejoinEdge?.summary.includes("Quan's Dwelling") ||
  !disc4TrenoRejoinEdge.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4TrenoRejoinEdge.sourceIds.includes("ff9-kouryaku-disc4") ||
  disc4TrenoRejoinEdge.sourceIds.includes("gamefaqs-weapon-shop-monsters-71891") ||
  !disc4IpsenRejoinEdge?.summary.includes("open Disc IV Gaia route") ||
  !disc4IpsenRejoinEdge.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4IpsenRejoinEdge.sourceIds.includes("gamefaqs-ipsens-castle-71891") ||
  disc4IpsenRejoinEdge.sourceIds.includes("jegged-mognet-central") ||
  !disc4KupoNutDetourEdge?.sourceIds.includes("gamefaqs-kupo-nuts-71891") ||
  !disc4KupoNutRejoinEdge?.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4KupoNutRejoinEdge.sourceIds.includes("gamefaqs-kupo-nuts-71891") ||
  !disc4MadainSariDetourEdge?.sourceIds.includes("elitegrindlab-madain-sari-eidolon-wall") ||
  !disc4MadainSariRejoinEdge?.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4MadainSariRejoinEdge.sourceIds.includes("elitegrindlab-madain-sari-eidolon-wall") ||
  !disc4LindblumStellazzioDetourEdge?.sourceIds.includes("jegged-the-aftermath") ||
  !disc4LindblumStellazzioRejoinEdge?.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4LindblumStellazzioRejoinEdge.sourceIds.includes("gamefaqs-the-aftermath-71891") ||
  disc4LindblumStellazzioRejoinEdge.sourceIds.includes("jegged-the-aftermath") ||
  !disc4DaguerreoStellazzioDetourEdge?.sourceIds.includes("jegged-daguerreo") ||
  !disc4DaguerreoStellazzioRejoinEdge?.sourceIds.includes("gamefaqs-return-to-gaia-71891") ||
  disc4DaguerreoStellazzioRejoinEdge.sourceIds.includes("gamefaqs-daguerreo-71891") ||
  disc4DaguerreoStellazzioRejoinEdge.sourceIds.includes("jegged-daguerreo") ||
  !sources.find((source) => source.id === "elitegrindlab-madain-sari-eidolon-wall")?.notes.includes("does not document the return from Madain Sari to the Invincible") ||
  !sources.find((source) => source.id === "gamefaqs-the-aftermath-71891")?.notes.includes("does not document the later Disc IV return from Lindblum to the Invincible") ||
  !sources.find((source) => source.id === "jegged-the-aftermath")?.notes.includes("does not document the later Disc IV return from Lindblum to the Invincible") ||
  !sources.find((source) => source.id === "gamefaqs-daguerreo-71891")?.notes.includes("does not document returning from the Disc IV Daguerreo visit to the Invincible") ||
  !sources.find((source) => source.id === "jegged-daguerreo")?.notes.includes("does not document returning from Daguerreo to the Invincible")
) {
  errors.push("Disc IV Gaia rejoins must cite the return route and exclude destination, encounter, Mognet, or Stellazzio-step sources that do not support the Invincible transition.");
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
const blackMageVillageDisc3StockObjective = objectivesById.get("disc-3.aerial-exploration.black-mage-village-stock");
const blackMageVillageDisc3StockSpecs: [string, string, number, string][] = [
  ["item-path.disc-2.magdalene-forest.black-mage-village-flame-staff-shop", "game-item.flame-staff", 1100, "Flame Staff"],
  ["item-path.disc-2.magdalene-forest.black-mage-village-lightning-staff-shop", "game-item.lightning-staff", 1200, "Lightning Staff"],
  ["item-path.disc-2.outer-continent.glass-armlet-black-mage-village-shop", "game-item.glass-armlet", 250, "Glass Armlet"],
  ["item-path.disc-2.outer-continent.leather-wrist-black-mage-village-shop", "game-item.leather-wrist", 200, "Leather Wrist"],
  ["item-path.disc-2.outer-continent.black-mage-village-mythril-fork-shop", "game-item.mythril-fork", 4700, "Mythril Fork"],
  ["item-path.disc-2.outer-continent.feather-hat-shop", "game-item.feather-hat", 200, "Feather Hat"],
  ["item-path.disc-2.outer-continent.magus-hat-shop", "game-item.magus-hat", 400, "Magus Hat"],
  ["item-path.disc-2.outer-continent.mythril-dagger-black-mage-village-shop", "game-item.mythril-dagger", 950, "Mythril Dagger"],
  ["item-path.disc-2.outer-continent.gladius-black-mage-village-shop", "game-item.gladius", 2300, "Gladius"],
  ["item-path.disc-2.magdalene-forest.headgear-black-mage-village", "game-item.headgear", 330, "Headgear"],
  ["item-path.disc-2.outer-continent.steepled-hat-black-mage-village-shop", "game-item.steepled-hat", 260, "Steepled Hat"],
  ["item-path.disc-2.outer-continent.adaman-vest-black-mage-village-shop", "game-item.adaman-vest", 1600, "Adaman Vest"],
  ["item-path.disc-2.outer-continent.oak-staff-black-mage-village-shop", "game-item.oak-staff", 2400, "Oak Staff"],
];
const blackMageVillageDisc3StockPaths = blackMageVillageDisc3StockSpecs.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const blackMageVillageDisc3StockStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "aerial-bmv-inventory");
const blackMageVillageAerialSource = sources.find((source) => source.id === "gamefaqs-aerial-exploration-71891");
if (
  !blackMageVillageDisc3StockObjective ||
  blackMageVillageDisc3StockObjective.category !== "collection" ||
  !blackMageVillageDisc3StockObjective.chapterIds?.includes("disc-3.aerial-exploration") ||
  !blackMageVillageDisc3StockObjective.profileIds?.includes("comprehensive") ||
  !["gamefaqs-aerial-exploration-71891", "gamefaqs-shops-71891", "gamefaqs-items-71891"].every((sourceId) => blackMageVillageDisc3StockObjective.sourceIds.includes(sourceId)) ||
  blackMageVillageDisc3StockPaths.some((path, index) => !path ||
    path.itemId !== blackMageVillageDisc3StockSpecs[index][1] ||
    path.method !== "shop" ||
    path.availability !== "limited-window" ||
    path.shopId !== "black-mage-village.weapon-shop.disc-2-3" ||
    path.cost?.amount !== blackMageVillageDisc3StockSpecs[index][2] ||
    !path.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.black-mage-village-stock") ||
    !path.sourceIds.includes("gamefaqs-shops-71891")) ||
  !blackMageVillageDisc3StockStep?.objectiveIds?.includes("disc-3.aerial-exploration.black-mage-village-stock") ||
  !blackMageVillageDisc3StockStep.text.includes("Item, Weapon, and Black Cat Synthesis shops") ||
  !blackMageVillageDisc3StockSpecs.every(([, , price, itemName]) => blackMageVillageDisc3StockStep.detail?.includes(`${itemName} (${price.toLocaleString("en-US")}`)) ||
  !blackMageVillageDisc3StockStep.detail?.includes("available for a while") ||
  !blackMageVillageDisc3StockStep.detail.includes("separate Disc IV table shows a different weapon inventory") ||
  !blackMageVillageDisc3StockStep.detail.includes("without giving an exact stock-change trigger") ||
  !blackMageVillageDisc3StockStep.detail.includes("This checkpoint protects the Black Mage Village seller window only") ||
  !blackMageVillageAerialSource?.notes.includes("shops return with the initial Disc II wares") ||
  !blackMageVillageAerialSource.notes.includes("without giving an exact stock-change trigger")
) {
  errors.push("Black Mage Village's 13 Disc II–III weapon paths must link their exact GameFAQs prices to the Disc III restock checkpoint while keeping the Disc IV inventory change separate from item-type loss and preserving the source's imprecise timing.");
}
const lindblumPreCleyraStockObjective = objectivesById.get("disc-1.lindblum.pre-cleyra-stock");
const lindblumPreCleyraStockSpecs: [string, string, number, string][] = [
  ["item-path.disc-1.lindblum.silver-gloves-shop", "game-item.silver-gloves", 720, "Silver Gloves"],
  ["item-path.disc-1.lindblum.iron-helm-shop", "game-item.iron-helm", 450, "Iron Helm"],
  ["item-path.disc-1.lindblum.glass-armlet-shop", "game-item.glass-armlet", 250, "Glass Armlet"],
  ["item-path.disc-1.lindblum.leather-wrist-shop", "game-item.leather-wrist", 200, "Leather Wrist"],
  ["item-path.disc-1.lindblum.mythril-dagger-shop", "game-item.mythril-dagger", 950, "Mythril Dagger"],
  ["item-path.disc-1.lindblum.fork-shop", "game-item.fork", 1100, "Fork"],
  ["item-path.disc-1.lindblum.steepled-hat-shop", "game-item.steepled-hat", 260, "Steepled Hat"],
  ["item-path.disc-1.lindblum.headgear-dragoos-shop", "game-item.headgear", 330, "Headgear"],
];
const lindblumPreCleyraStockPaths = lindblumPreCleyraStockSpecs.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const lindblumPreCleyraStockStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.lindblum")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "lindblum-shop-synthesis-javelin");
const lindblumShopSource = sources.find((source) => source.id === "gamefaqs-shops-71891");
const lindblumRouteSource = sources.find((source) => source.id === "gamefaqs-lindblum-71891");
if (
  !lindblumPreCleyraStockObjective ||
  lindblumPreCleyraStockObjective.category !== "collection" ||
  !lindblumPreCleyraStockObjective.chapterIds?.includes("disc-1.lindblum") ||
  !lindblumPreCleyraStockObjective.profileIds?.includes("comprehensive") ||
  !["gamefaqs-shops-71891", "gamefaqs-lindblum-71891"].every((sourceId) => lindblumPreCleyraStockObjective.sourceIds.includes(sourceId)) ||
  lindblumPreCleyraStockPaths.some((path, index) => !path ||
    path.itemId !== lindblumPreCleyraStockSpecs[index][1] ||
    path.chapterId !== "disc-1.lindblum" ||
    path.method !== "shop" ||
    path.availability !== "limited-window" ||
    !path.shopId?.startsWith("lindblum.weapon-shop") ||
    path.cost?.amount !== lindblumPreCleyraStockSpecs[index][2] ||
    !path.walkthroughObjectiveIds?.includes("disc-1.lindblum.pre-cleyra-stock") ||
    !path.sourceIds.includes("gamefaqs-shops-71891")) ||
  !lindblumPreCleyraStockStep?.objectiveIds?.includes("disc-1.lindblum.pre-cleyra-stock") ||
  !lindblumPreCleyraStockStep.text.includes("Review Dragoos' pre-Cleyra stock") ||
  !lindblumPreCleyraStockSpecs.every(([, , price, itemName]) => lindblumPreCleyraStockStep.text.includes(`${itemName} (${price.toLocaleString("en-US")}`)) ||
  !lindblumPreCleyraStockStep.detail?.includes("inventories remain available until Cleyra is completed") ||
  !lindblumPreCleyraStockStep.detail.includes("checklist tracks that seller window only") ||
  !lindblumPreCleyraStockStep.detail.includes("does not say that missing the stock removes the item types") ||
  !lindblumShopSource?.notes.includes("until Cleyra is completed") ||
  !lindblumRouteSource?.notes.includes("After the Festival")
) {
  errors.push("Dragoos' eight pre-Cleyra stock paths must link exact prices to the post-Festival Lindblum checkpoint and preserve the shop-window versus item-type distinction.");
}
const returnLindblumShopObjective = objectivesById.get("disc-2.return-to-lindblum.optional-shop-stock");
const returnLindblumShopSpecs: [string, string, number, string][] = [
  ["item-path.disc-2.return-to-lindblum.bandana-shop", "game-item.bandana", 500, "Dragoos' Weapon Shop (Disc II)"],
  ["item-path.disc-2.return-to-lindblum.bone-wrist-shop", "game-item.bone-wrist", 330, "Lindblum Weapon Shop (Disc II)"],
  ["item-path.disc-2.return-to-lindblum.headgear-dragoos-shop", "game-item.headgear", 330, "Dragoos' Weapon Shop (Lindblum, Disc II)"],
  ["item-path.disc-2.return-to-lindblum.magus-hat-shop", "game-item.magus-hat", 400, "Lindblum Weapon Shop (Disc II)"],
  ["item-path.disc-2.return-to-lindblum.dragon-gate-bandana-shop", "game-item.bandana", 500, "Dragon's Gate Merchant (Disc II)"],
];
const returnLindblumShopPaths = returnLindblumShopSpecs.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const returnLindblumChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-lindblum");
const returnLindblumShopStep = returnLindblumChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-shop-preparation");
const returnLindblumGateShopStep = returnLindblumChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-moonte-bandana");
if (
  !returnLindblumShopObjective ||
  returnLindblumShopObjective.category !== "collection" ||
  !returnLindblumShopObjective.chapterIds?.includes("disc-2.return-to-lindblum") ||
  !returnLindblumShopObjective.profileIds?.includes("comprehensive") ||
  !["gamefaqs-shops-71891", "gamefaqs-return-to-lindblum-71891"].every((sourceId) => returnLindblumShopObjective.sourceIds.includes(sourceId)) ||
  returnLindblumShopPaths.some((path, index) => !path ||
    path.itemId !== returnLindblumShopSpecs[index][1] ||
    path.chapterId !== "disc-2.return-to-lindblum" ||
    path.method !== "shop" ||
    path.availability !== "limited-window" ||
    path.shopName !== returnLindblumShopSpecs[index][3] ||
    path.cost?.amount !== returnLindblumShopSpecs[index][2] ||
    !path.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.optional-shop-stock") ||
    !path.sourceIds.includes("gamefaqs-shops-71891")) ||
  !returnLindblumShopStep?.objectiveIds?.includes("disc-2.return-to-lindblum.optional-shop-stock") ||
  !returnLindblumGateShopStep?.objectiveIds?.includes("disc-2.return-to-lindblum.optional-shop-stock") ||
  !returnLindblumShopStep.detail?.includes("only the Dragon's Gate Merchant remains available until Disc III") ||
  !returnLindblumGateShopStep.detail?.includes("separate free pickup from the Dragon's Gate Merchant's 500-Gil Bandana listing")
) {
  errors.push("The five Disc II Lindblum and Dragon's Gate shop paths must link exact prices to the departure stock review, preserving the city lockout and separating Bandana's purchase from its chest pickup.");
}
const linkedLimitedShopSpecs = [
  { pathId: "item-path.disc-1.burmecia.magus-hat-atla-shop", itemId: "game-item.magus-hat", chapterId: "disc-1.burmecia", method: "mogshop", shopId: "burmecia.atla-mogshop", price: 400, objectiveId: "disc-1.burmecia.atla-mogshop-stock", stepId: "burmecia-atla-vault-mognet" },
  { pathId: "item-path.disc-1.burmecia.headgear-atla-mogshop", itemId: "game-item.headgear", chapterId: "disc-1.burmecia", method: "mogshop", shopId: "burmecia.atla-mogshop", price: 330, objectiveId: "disc-1.burmecia.atla-mogshop-stock", stepId: "burmecia-atla-vault-mognet" },
  { pathId: "item-path.disc-2.treno.glass-armlet-shop", itemId: "game-item.glass-armlet", chapterId: "disc-2.treno", method: "shop", shopId: "treno.weapon-shop.disc-2", price: 250, objectiveId: "disc-2.treno.shop-stock-window", stepId: "treno-mogrich-letter" },
  { pathId: "item-path.disc-2.outer-continent.bone-wrist-black-mage-village-shop", itemId: "game-item.bone-wrist", chapterId: "disc-2.outer-continent", method: "shop", shopId: "black-mage-village.weapon-shop", price: 330, objectiveId: "disc-2.outer-continent.black-mage-village-bone-wrist-stock", stepId: "black-mage-village-shop-check", stepChapterId: "disc-2.magdalene-forest" },
  { pathId: "item-path.disc-3.lost-continent.gladius-esto-gaza-shop", itemId: "game-item.gladius", chapterId: "disc-3.lost-continent", method: "shop", shopId: "esto-gaza.weapon-shop.after-desert-palace", price: 2300, objectiveId: "disc-3.lost-continent.esto-gaza-stock", stepId: "lost-continent-esto-gaza-shop" },
];
const linkedLimitedShopPaths = linkedLimitedShopSpecs.map(({ pathId }) => itemAcquisitionPaths.find((path) => path.id === pathId));
const getLinkedShopStep = (chapterId: string, stepId: string) => walkthroughChapters
  .find((chapter) => chapter.areaId === chapterId)
  ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === stepId);
const atlaMogshopObjective = objectivesById.get("disc-1.burmecia.atla-mogshop-stock");
const blackMageVillageBoneWristObjective = objectivesById.get("disc-2.outer-continent.black-mage-village-bone-wrist-stock");
const atlaMogshopStep = getLinkedShopStep("disc-1.burmecia", "burmecia-atla-vault-mognet");
const trenoGlassArmletStep = getLinkedShopStep("disc-2.treno", "treno-mogrich-letter");
const blackMageVillageBoneWristStep = getLinkedShopStep("disc-2.magdalene-forest", "black-mage-village-shop-check");
const estoGazaGladiusStep = getLinkedShopStep("disc-3.lost-continent", "lost-continent-esto-gaza-shop");
if (
  !atlaMogshopObjective || atlaMogshopObjective.category !== "collection" ||
  !atlaMogshopObjective.chapterIds?.includes("disc-1.burmecia") ||
  !atlaMogshopObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  !blackMageVillageBoneWristObjective || blackMageVillageBoneWristObjective.category !== "collection" ||
  !blackMageVillageBoneWristObjective.chapterIds?.includes("disc-2.outer-continent") ||
  !blackMageVillageBoneWristObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  linkedLimitedShopPaths.some((path, index) => {
    const spec = linkedLimitedShopSpecs[index];
    return !path || path.itemId !== spec.itemId || path.chapterId !== spec.chapterId ||
      path.method !== spec.method || path.availability !== "limited-window" || path.shopId !== spec.shopId ||
      path.cost?.amount !== spec.price || !path.walkthroughObjectiveIds?.includes(spec.objectiveId) ||
      !path.sourceIds.includes("gamefaqs-shops-71891") ||
      !getLinkedShopStep(spec.stepChapterId ?? spec.chapterId, spec.stepId)?.objectiveIds?.includes(spec.objectiveId);
  }) ||
  !atlaMogshopStep?.text.includes("Headgear costs 330 Gil and Magus Hat 400 Gil") ||
  !trenoGlassArmletStep?.detail?.includes("Glass Armlet at 250 Gil here") ||
  !trenoGlassArmletStep.detail.includes("DrSlice independently lists it in the Treno Armory") ||
  !trenoGlassArmletStep.detail.includes("later Treno listing") ||
  !blackMageVillageBoneWristStep?.detail?.includes("GameFAQs lists Bone Wrist in this Weapon Shop on Discs II–III") ||
  !blackMageVillageBoneWristStep.detail.includes("Alexandria remains a later seller") ||
  !estoGazaGladiusStep?.text.includes("Gladius (2,300 Gil)") ||
  !estoGazaGladiusStep.detail?.includes("post-Desert Palace Esto Gaza stock")
) {
  errors.push("Atla, Treno, Black Mage Village, and Esto Gaza limited-window shop paths must link their exact source-listed items and prices to the matching stock checkpoints, preserving later recovery and disputed-window scope.");
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
const legacyShopPriceCrossChecks = new Map<string, { itemId: string; price: number }>([
  ["synthesis-recipe.cotton-robe", { itemId: "game-item.cotton-robe", price: 1000 }],
  ["synthesis-recipe.gluttons-robe", { itemId: "game-item.gluttons-robe", price: 6000 }],
  ["synthesis-recipe.fairy-earrings", { itemId: "game-item.fairy-earrings", price: 3200 }],
  ["synthesis-recipe.rune-tooth", { itemId: "game-item.rune-tooth", price: 2000 }],
  ["synthesis-recipe.brave-suit", { itemId: "game-item.brave-suit", price: 26000 }],
]);
for (const [recipeId, expected] of legacyShopPriceCrossChecks) {
  const recipe = synthesisRecipes.find((record) => record.id === recipeId);
  const item = gameItems.find((record) => record.id === expected.itemId);
  const paths = itemAcquisitionPaths.filter((path) => path.recipeId === recipeId);
  if (!recipe || recipe.cost?.currency !== "gil" || recipe.cost.amount !== expected.price ||
    !recipe.sourceIds.includes("gamefaqs-shop-lists-9772") || !item?.sourceIds.includes("gamefaqs-shop-lists-9772") ||
    paths.length === 0 || paths.some((path) => path.cost?.amount !== expected.price || !path.sourceIds.includes("gamefaqs-shop-lists-9772"))) {
    errors.push(`Recipe ${recipeId} must retain its shop-list price cross-check on the recipe, item, and every acquisition path.`);
  }
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
const oeilvertMogshopObjectiveId = "disc-3.preparing-to-leave.final-stock-ability-review";
const oeilvertMogshopExpectedPaths = [
  ["item-path.disc-3.forgotten-continent.chimera-armlet-oeilvert-mogshop", "game-item.chimera-armlet", "disc-3.forgotten-continent", "mimoza-oeilvert", 1200],
  ["item-path.disc-3.forgotten-continent.cross-helm-oeilvert-mogshop", "game-item.cross-helm", "disc-3.forgotten-continent", "oeilvert.mogshop", 2200],
  ["item-path.disc-3.forgotten-continent.healing-rod-oeilvert-mogshop", "game-item.healing-rod", "disc-3.forgotten-continent", "mimoza-oeilvert", 1770],
  ["item-path.disc-3.forgotten-continent.brigandine-oeilvert-mogshop", "game-item.brigandine", "disc-3.forgotten-continent", "mimoza-oeilvert", 4300],
  ["item-path.disc-3.desert-palace.chimera-armlet-mogshop", "game-item.chimera-armlet", "disc-3.desert-palace", "mojito-desert-palace", 1200],
  ["item-path.disc-3.desert-palace.healing-rod-mogshop", "game-item.healing-rod", "disc-3.desert-palace", "mojito-desert-palace", 1770],
  ["item-path.disc-3.desert-palace.brigandine-mogshop", "game-item.brigandine", "disc-3.desert-palace", "mojito-desert-palace", 4300],
];
const oeilvertMogshopPaths = oeilvertMogshopExpectedPaths.map(([id]) => itemAcquisitionPaths.find((path) => path.id === id));
const oeilvertMogshopRouteSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent")
  ?.sections.find((section) => section.id === "oeilvert-exterior");
const oeilvertMogshopRouteStep = oeilvertMogshopRouteSection?.steps.find((step) => step.id === "oeilvert-shop-and-party-stock");
const mojitoMogshopRouteStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.desert-palace")
  ?.sections.flatMap((section) => section.steps).find((step) => step.id === "desert-palace-mojito-letter-shop");
if (
  oeilvertMogshopPaths.some((path, index) => {
    const [id, itemId, chapterId, shopId, price] = oeilvertMogshopExpectedPaths[index];
    return !path || path.itemId !== itemId || path.chapterId !== chapterId || path.shopId !== shopId ||
      path.method !== "mogshop" || path.availability !== "limited-window" || path.cost?.amount !== price ||
      !path.conditions.includes("Shimmering Island") ||
      !path.walkthroughObjectiveIds?.includes(oeilvertMogshopObjectiveId) ||
      !["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891"].every((sourceId) => path.sourceIds.includes(sourceId)) ||
      !itemAcquisitionPaths.some((candidate) => candidate.itemId === itemId && candidate.id !== id &&
        candidate.chapterId !== chapterId && candidate.availability === "repeatable");
  }) ||
  !finalStockAbilityObjective?.chapterIds.includes("disc-3.forgotten-continent") ||
  !finalStockAbilityObjective.chapterIds.includes("disc-3.desert-palace") ||
  !["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891"].every((sourceId) => finalStockAbilityObjective.sourceIds.includes(sourceId)) ||
  !oeilvertMogshopRouteStep?.objectiveIds.includes(oeilvertMogshopObjectiveId) ||
  !oeilvertMogshopRouteStep.detail.includes("taking the Gulug Stone as the ruin's point of no return") ||
  !oeilvertMogshopRouteStep.detail.includes("do not settle when the exterior shop becomes unreachable") ||
  !oeilvertMogshopRouteStep.detail.includes("Buy what you need before entering") ||
  !oeilvertMogshopRouteStep.detail.includes("purchase-source cutoff, not a claim that every item type becomes unavailable") ||
  !["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891", "elitegrindlab-oeilvert"].every((sourceId) => oeilvertMogshopRouteSection.sourceIds.includes(sourceId)) ||
  !mojitoMogshopRouteStep?.objectiveIds.includes(oeilvertMogshopObjectiveId)
) {
  errors.push("Mimoza and Mojito's seven limited-window Mogshop paths must link to the sourced final-stock checkpoint, preserve the Shimmering Island cutoff and prices, and keep Oeilvert's Gulug Stone access conflict visible.");
}
const finalStockAbilitySources = ["gamefaqs-abilities-71891", "rpgclassics-abilities"];
const finalStockTigerFangsSource = "ffwiki-tiger-fangs";
const finalStockTigerFangsWindowSource = "jinsoku-limited-items";
const finalStockAbilityItems = ["game-item.trident", "game-item.diamond-sword", "game-item.flame-saber", "game-item.heavy-lance", "game-item.scissor-fangs", "game-item.tiger-fangs"]
  .map((itemId) => gameItems.find((item) => item.id === itemId));
const finalStockAbilityClaims = [
  { itemId: "game-item.trident", abilityName: "Luna" },
  { itemId: "game-item.diamond-sword", abilityName: "Power Break" },
  { itemId: "game-item.flame-saber", abilityName: "Magic Break" },
  { itemId: "game-item.heavy-lance", abilityName: "Six Dragons" },
  { itemId: "game-item.scissor-fangs", abilityName: "Aura" },
  { itemId: "game-item.scissor-fangs", abilityName: "Counter" },
  { itemId: "game-item.tiger-fangs", abilityName: "Revive" },
  { itemId: "game-item.tiger-fangs", abilityName: "Counter" },
];
const finalStockAbilityAlternatives = [
  { itemId: "game-item.duel-claws", abilityName: "Aura" },
  { itemId: "game-item.rebirth-ring", abilityName: "Revive" },
  { itemId: "game-item.anklet", abilityName: "Counter" },
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
  { id: "item-path.disc-3-stock.esto-gaza.scissor-fangs", itemId: "game-item.scissor-fangs" },
  { id: "item-path.disc-3-stock.daguerreo.tiger-fangs", itemId: "game-item.tiger-fangs" },
  { id: "item-path.disc-4.return-to-gaia.tiger-fangs-daguerreo-candidate", itemId: "game-item.tiger-fangs" },
].map(({ id, itemId }) => ({ id, itemId, path: itemAcquisitionPaths.find((candidate) => candidate.id === id) }));
const finalStockAbilityWalkthrough = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.preparing-to-leave")
  ?.sections.find((section) => section.steps.some((step) => step.id === "preparing-leave-shop-inventory"));
const finalStockAbilityWalkthroughStep = finalStockAbilityWalkthrough?.steps.find((step) => step.id === "preparing-leave-shop-inventory");
const drsliceDaguerreoSourceId = "drslice-daguerreo-armory";
const drsliceDaguerreoItemIds = [
  "game-item.mage-masher", "game-item.mythril-dagger", "game-item.gladius", "game-item.zorlin-shape",
  "game-item.rune-blade", "game-item.obelisk", "game-item.tiger-fangs", "game-item.mythril-racket",
  "game-item.asuras-rod", "game-item.hamelin", "game-item.octagon-rod", "game-item.rising-sun",
  "game-item.bone-wrist", "game-item.mythril-armlet", "game-item.chimera-armlet", "game-item.egoists-armlet",
  "game-item.n-kai-armlet", "game-item.jade-armlet", "game-item.venetia-shield", "game-item.defense-gloves",
  "game-item.lamias-tiara", "game-item.twist-headband", "game-item.golden-hairpin", "game-item.coronet",
  "game-item.diamond-helm", "game-item.gaia-gear", "game-item.demons-vest", "game-item.demons-mail",
  "game-item.diamond-armor",
];
const drsliceDaguerreoItems = drsliceDaguerreoItemIds.map((itemId) => gameItems.find((item) => item.id === itemId));
const drsliceDaguerreoExpectedPaths = ([
  ["item-path.disc-3-stock.daguerreo.asuras-rod", "game-item.asuras-rod", 3180],
  ["item-path.disc-3-stock.daguerreo.hamelin", "game-item.hamelin", 5700],
  ["item-path.disc-3-stock.daguerreo.octagon-rod", "game-item.octagon-rod", 4500],
  ["item-path.disc-3-stock.daguerreo.obelisk", "game-item.obelisk", 6000],
  ["item-path.disc-3-stock.daguerreo.rune-blade", "game-item.rune-blade", 8900],
  ["item-path.disc-3-stock.daguerreo.tiger-fangs", "game-item.tiger-fangs", 13500],
  ["item-path.disc-3-stock.daguerreo.diamond-armor", "game-item.diamond-armor", 8800],
  ["item-path.disc-3.aerial-exploration.gladius-daguerreo-shop", "game-item.gladius", 2300],
  ["item-path.disc-3.aerial-exploration.n-kai-armlet-daguerreo-shop", "game-item.n-kai-armlet", 3000],
  ["item-path.disc-3.aerial-exploration.jade-armlet-daguerreo-shop", "game-item.jade-armlet", 3400],
  ["item-path.disc-3.aerial-exploration.chimera-armlet-daguerreo-shop", "game-item.chimera-armlet", 1200],
  ["item-path.disc-3.aerial-exploration.bone-wrist-daguerreo-shop", "game-item.bone-wrist", 330],
  ["item-path.disc-3-stock.daguerreo.mage-masher", "game-item.mage-masher", 500],
  ["item-path.disc-3-stock.daguerreo.mythril-dagger", "game-item.mythril-dagger", 950],
  ["item-path.disc-3-stock.daguerreo.zorlin-shape", "game-item.zorlin-shape", 6000],
  ["item-path.disc-3-stock.daguerreo.mythril-racket", "game-item.mythril-racket", 2250],
  ["item-path.disc-3-stock.daguerreo.rising-sun", "game-item.rising-sun", 500],
  ["item-path.disc-3-stock.daguerreo.mythril-armlet", "game-item.mythril-armlet", 500],
  ["item-path.disc-3-stock.daguerreo.egoists-armlet", "game-item.egoists-armlet", 2000],
  ["item-path.disc-3-stock.daguerreo.venetia-shield", "game-item.venetia-shield", 2800],
  ["item-path.disc-3-stock.daguerreo.defense-gloves", "game-item.defense-gloves", 6000],
  ["item-path.disc-3-stock.daguerreo.lamias-tiara", "game-item.lamias-tiara", 800],
  ["item-path.disc-3-stock.daguerreo.twist-headband", "game-item.twist-headband", 1200],
  ["item-path.disc-3-stock.daguerreo.golden-hairpin", "game-item.golden-hairpin", 3700],
  ["item-path.disc-3-stock.daguerreo.coronet", "game-item.coronet", 4400],
  ["item-path.disc-3-stock.daguerreo.diamond-helm", "game-item.diamond-helm", 3000],
  ["item-path.disc-3-stock.daguerreo.gaia-gear", "game-item.gaia-gear", 8700],
  ["item-path.disc-3-stock.daguerreo.demons-vest", "game-item.demons-vest", 10250],
  ["item-path.disc-3-stock.daguerreo.demons-mail", "game-item.demons-mail", 5900],
] as const).map(([id, itemId, price]) => ({ id, itemId, price, path: itemAcquisitionPaths.find((candidate) => candidate.id === id) }));
const drsliceDaguerreoSource = sources.find((source) => source.id === drsliceDaguerreoSourceId);
const drsliceDaguerreoObjective = objectives.find((objective) => objective.id === "disc-3.aerial-exploration.daguerreo-stock");
const drsliceDaguerreoWarning = missablesById.get("missable.disc-3.aerial-exploration.daguerreo-stock");
const drsliceDaguerreoRoute = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  ?.sections.find((section) => section.id === "aerial-daguerreo");
const drsliceMagicArmlet = gameItems.find((item) => item.id === "game-item.magic-armlet");
const daguerreoMagicArmletPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.magic-armlet");
const magicRacketItem = gameItems.find((item) => item.id === "game-item.magic-racket");
const magicRacketRoutePaths = [
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.magic-racket-lindblum-shop"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.forgotten-continent.magic-racket-oeilvert-mogshop"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.desert-palace.magic-racket-mogshop"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.lost-continent.magic-racket-esto-gaza-shop"),
  itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.magic-racket"),
];
const magicRacketObjective = objectives.find((objective) => objective.id === "disc-3.magic-racket");
const magicRacketNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.magic-racket-need-three");
const magicRacketEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.magic-racket-end-inventory");
const jeggedRacketsSource = sources.find((source) => source.id === "jegged-rackets");
const daguerreoMagicRacketPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.magic-racket");
if (
  !finalStockAbilityWarning || finalStockAbilityWarning.severity !== "info" ||
  !finalStockAbilityWarning.consequence.includes("GameFAQs and RPGClassics PlayStation ability tables both list") ||
  !finalStockAbilityWarning.consequence.includes("not a claim that missing the gear permanently removes an ability") ||
  !finalStockAbilityWarning.nextAvailability.includes("Neither reviewed PlayStation ability table lists alternate equipment for Luna") ||
  !finalStockAbilityWarning.note.includes("post-transition and version-specific ability-source audit remains partial") ||
  !finalStockAbilityWarning.note.includes("Final Fantasy Wiki's indexed entry lists Revive/Counter and calls the pre-Shimmering Island purchase missable") ||
  !finalStockAbilityWarning.note.includes("Jinsoku independently lists the Disc III Daguerreo seller under limited items") ||
  !finalStockAbilityWarning.sourceIds.includes(finalStockTigerFangsSource) ||
  !finalStockAbilityWarning.sourceIds.includes(finalStockTigerFangsWindowSource) ||
  !finalStockAbilitySources.every((sourceId) => finalStockAbilityWarning.sourceIds.includes(sourceId)) ||
  !finalStockAbilityObjective || !finalStockAbilityObjective.sourceIds.includes(finalStockTigerFangsSource) ||
  !finalStockAbilityObjective.sourceIds.includes(finalStockTigerFangsWindowSource) ||
  !finalStockAbilitySources.every((sourceId) => finalStockAbilityObjective.sourceIds.includes(sourceId)) ||
  finalStockAbilityItems.some((item) => !item || !finalStockAbilitySources.every((sourceId) => item.sourceIds.includes(sourceId))) ||
  !tigerFangsItem?.sourceIds.includes(finalStockTigerFangsSource) ||
  !tigerFangsItem.sourceIds.includes("drslice-daguerreo-armory") ||
  finalStockAbilityPaths.length !== 11 ||
  finalStockAbilityClaims.length !== 8 || finalStockAbilityClaims.some(({ itemId, abilityName }) =>
    !equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName &&
      finalStockAbilitySources.every((sourceId) => claim.sourceIds.includes(sourceId))),
  ) ||
  finalStockAbilityAlternatives.some(({ itemId, abilityName }) =>
    !equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName &&
      ["gamefaqs-items-71891", "gamefaqs-abilities-71891"].every((sourceId) => claim.sourceIds.includes(sourceId))),
  ) ||
  finalStockAbilityPaths.some(({ itemId, path }) => !path || path.itemId !== itemId ||
    !finalStockAbilitySources.every((sourceId) => path.sourceIds.includes(sourceId))) ||
  !tigerFangsShopPath?.sourceIds.includes(finalStockTigerFangsSource) ||
  !tigerFangsShopPath.sourceIds.includes(finalStockTigerFangsWindowSource) ||
  !tigerFangsDisc4CandidatePath?.sourceIds.includes(finalStockTigerFangsSource) ||
  !tigerFangsDisc4CandidatePath.sourceIds.includes(finalStockTigerFangsWindowSource) ||
  tigerFangsAbilityClaims.length !== 2 || tigerFangsAbilityClaims.some((claim) => !claim.sourceIds.includes(finalStockTigerFangsSource)) ||
  !finalStockAbilityWalkthroughStep ||
  !finalStockAbilityWalkthroughStep.detail.includes("both reviewed PlayStation catalogs list Luna (Trident), Power Break (Diamond Sword), Magic Break (Flame Saber), and Six Dragons (Heavy Lance)") ||
  !finalStockAbilitySources.every((sourceId) => finalStockAbilityWalkthrough?.sourceIds.includes(sourceId)) ||
  !finalStockAbilityWalkthrough?.sourceIds.includes(finalStockTigerFangsSource) ||
  !finalStockAbilityWalkthrough?.sourceIds.includes(finalStockTigerFangsWindowSource) ||
  !finalStockAbilityWalkthroughStep.detail.includes("Final Fantasy Wiki's indexed item page says the 13,500-Gil Daguerreo purchase ends before the Shimmering Island portal") ||
  !finalStockAbilityWalkthroughStep.detail.includes("Jinsoku's Japanese limited-item list independently places the purchase at Daguerreo on Disc III") ||
  !["cavesofnarshe-ff9-disc-4-map", "cavesofnarshe-ff9-claws", "rpgclassics-shops", "rpgclassics-weapons"].every((sourceId) =>
    finalStockAbilityWalkthrough?.sourceIds.includes(sourceId) &&
    finalStockAbilityWarning.sourceIds.includes(sourceId) && finalStockAbilityObjective.sourceIds.includes(sourceId)) ||
  !finalStockAbilityWarning.consequence.includes("those claw abilities have other listed equipment sources") ||
  !finalStockAbilityWalkthroughStep.detail.includes("alternate gear sources listed for those claw abilities")
) {
  errors.push("The final-stock ability review must link both PlayStation ability catalogs to its warning, objective, six item records, eight claims, eleven source-linked paths, and the walkthrough checkpoint while distinguishing the four abilities without listed alternatives from the claw abilities with alternatives.");
}
if (
  !drsliceDaguerreoSource?.notes.includes("Lists 29 products and prices under Daguerreo (Disk 3)") ||
  !drsliceDaguerreoSource.notes.includes("does not establish Disc IV inventory") ||
  drsliceDaguerreoItems.length !== 29 || drsliceDaguerreoItems.some((item) => !item?.sourceIds.includes(drsliceDaguerreoSourceId)) ||
  drsliceDaguerreoExpectedPaths.length !== 29 || drsliceDaguerreoExpectedPaths.some(({ itemId, price, path }) =>
    !path || path.itemId !== itemId || path.cost?.amount !== price ||
    !path.sourceIds.includes(drsliceDaguerreoSourceId) || !path.sourceIds.includes("rpgclassics-shops")) ||
  !drsliceMagicArmlet || drsliceMagicArmlet.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !daguerreoMagicArmletPath || daguerreoMagicArmletPath.itemId !== "game-item.magic-armlet" ||
  daguerreoMagicArmletPath.cost?.amount !== 1000 || daguerreoMagicArmletPath.availability !== "repeatable" ||
  !daguerreoMagicArmletPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !daguerreoMagicArmletPath.sourceIds.includes("rpgclassics-shops") ||
  daguerreoMagicArmletPath.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !magicRacketItem || !magicRacketItem.sourceIds.includes("gamefaqs-shops-71891") ||
  !magicRacketItem.sourceIds.includes("jegged-rackets") ||
  magicRacketItem.sourceIds.includes(drsliceDaguerreoSourceId) ||
  magicRacketRoutePaths.length !== 5 || magicRacketRoutePaths.some((path) =>
    !path || path.itemId !== "game-item.magic-racket" || path.cost?.amount !== 1350 ||
    !path.sourceIds.includes("gamefaqs-items-71891") || !path.sourceIds.includes("gamefaqs-shops-71891") ||
    !path.walkthroughObjectiveIds?.includes("disc-3.magic-racket")) ||
  magicRacketRoutePaths[0]?.availability !== "repeatable" ||
  magicRacketRoutePaths.slice(1).some((path) => path?.availability !== "limited-window") ||
  !magicRacketRoutePaths[1]?.conditions?.includes("exact point when the exterior shop stops being reachable") ||
  !magicRacketRoutePaths[2]?.conditions?.includes("Lindblum retains a later source") ||
  !magicRacketRoutePaths[3]?.conditions?.includes("Lindblum's later Disc III–IV stock") ||
  !magicRacketObjective?.sourceIds.includes("jegged-rackets") ||
  !magicRacketObjective.chapterIds.includes("disc-3.forgotten-continent") ||
  !magicRacketObjective.chapterIds.includes("disc-4.final-preparations") ||
  magicRacketNeedTarget?.targetQuantity !== 3 || magicRacketNeedTarget.basis !== "route-need" ||
  magicRacketEndInventoryTarget?.targetQuantity !== 3 || magicRacketEndInventoryTarget.basis !== "end-inventory" ||
  !jeggedRacketsSource?.notes.includes("Protect where GameFAQs Items says Cure") ||
  !daguerreoMagicRacketPath || daguerreoMagicRacketPath.itemId !== "game-item.magic-racket" ||
  daguerreoMagicRacketPath.cost?.amount !== 1350 || daguerreoMagicRacketPath.availability !== "limited-window" ||
  !daguerreoMagicRacketPath.sourceIds.includes("gamefaqs-shops-71891") ||
  daguerreoMagicRacketPath.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !daguerreoMagicRacketPath.conditions.includes("Keep this GameFAQs row separate") ||
  !daguerreoMagicRacketPath.notes.includes("Mythril Racket") ||
  !drsliceDaguerreoObjective?.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !drsliceDaguerreoObjective.sourceIds.includes("rpgclassics-shops") ||
  !drsliceDaguerreoWarning?.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !drsliceDaguerreoWarning.sourceIds.includes("rpgclassics-shops") ||
  !drsliceDaguerreoWarning.note.includes("omits Magic Armlet, which GameFAQs and RPGClassics list") ||
  !drsliceDaguerreoRoute?.sourceIds.includes(drsliceDaguerreoSourceId) ||
  !drsliceDaguerreoRoute.sourceIds.includes("rpgclassics-shops")
) {
  errors.push("DrSlice's Disk 3 Daguerreo table must stay linked to its 29 listed item records and all 29 matching priced shop paths, with the separate Magic Armlet, five-source Magic Racket shop routes, optional inventory targets, source-specific racket labels, and Disc IV stock uncertainty preserved.");
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
const summitEquipmentObjective = objectivesById.get("disc-2.journey-to-treno.station-equipment-targets");
const summitSilverGlovesTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-2.journey-to-treno.silver-gloves");
const summitIronHelmTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-2.journey-to-treno.iron-helm");
const summitSilverGlovesPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-silver-gloves-shop");
const summitIronHelmPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-iron-helm-shop");
const southGateSilverGlovesCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.south-gate.silver-gloves-candidate");
const southGateIronHelmCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.south-gate.iron-helm-candidate");
const southGateCandidateObjective = objectivesById.get("disc-3.aerial-exploration.south-gate-equipment-candidate-check");
const summitStationWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-treno-shop-and-train");
const cavesDisc3SouthGateSource = sources.find((source) => source.id === "cavesofnarshe-ff9-disc-3-map");
const cour89SouthGateSource = sources.find((source) => source.id === "cour89-south-gate");
const cour89LimitedShopsSource = sources.find((source) => source.id === "cour89-limited-shops");
const cour89SilverGlovesSource = sources.find((source) => source.id === "cour89-silver-gloves");
const gamefaqsEquipmentTranslationSource = sources.find((source) => source.id === "gamefaqs-equipment-translation-8240");
const ffwikiTranslationsSource = sources.find((source) => source.id === "ffwiki-translations");
const gamefaqsShopsSource = sources.find((source) => source.id === "gamefaqs-shops-71891");
const atadeoSouthGateSource = sources.find((source) => source.id === "gamefaqs-walkthrough-9801");
const gamefaqsSouthGateStationSource = sources.find((source) => source.id === "gamefaqs-south-gate-station-79143");
const summitEquipmentCutoff = cutoffsById.get("cutoff.summit-station.equipment-stock");
const southGateCandidateWalkthrough = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
  ?.sections.flatMap((section) => section.steps.map((step) => ({ section, step })))
  .find(({ step }) => step.id === "aerial-south-gate-equipment-candidate");
if (
  !summitEquipmentWarning ||
  !summitEquipmentWarning.classification.includes("limited-quantity") ||
  !summitEquipmentWarning.consequence.includes("separates the consumables-only South (Dali) Gate item shop from Summit Station's equipment shop") ||
  !summitEquipmentWarning.recovery.includes("separate window-unverified candidate paths prompt an optional stock check") ||
  !summitEquipmentWarning.note.includes("item table gives Need 3") ||
  !summitEquipmentWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  !summitEquipmentWarning.sourceIds.includes("neoseeker-item-locations-182566") ||
  !summitEquipmentWarning.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitEquipmentWarning.sourceIds.includes("cavesofnarshe-ff9-silver-gloves") ||
  !summitEquipmentWarning.sourceIds.includes("cavesofnarshe-ff9-iron-helm") ||
  !summitEquipmentWarning.sourceIds.includes("cour89-south-gate") ||
  !summitEquipmentWarning.sourceIds.includes("cour89-limited-shops") ||
  !summitEquipmentWarning.sourceIds.includes("cour89-silver-gloves") ||
  !summitEquipmentWarning.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !summitEquipmentWarning.sourceIds.includes("ffwiki-translations") ||
  !summitEquipmentWarning.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !summitEquipmentWarning.sourceIds.includes("gamefaqs-south-gate-station-79143") ||
  !summitEquipmentObjective?.sourceIds.includes("cour89-south-gate") ||
  !summitEquipmentObjective.sourceIds.includes("cour89-limited-shops") ||
  !summitEquipmentObjective.sourceIds.includes("cour89-silver-gloves") ||
  !summitEquipmentObjective.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !summitEquipmentObjective.sourceIds.includes("ffwiki-translations") ||
  !summitSilverGlovesTarget || summitSilverGlovesTarget.targetQuantity !== 4 ||
  !summitIronHelmTarget || summitIronHelmTarget.targetQuantity !== 3 ||
  !summitSilverGlovesTarget.sourceIds.includes("cour89-limited-shops") ||
  !summitSilverGlovesTarget.sourceIds.includes("cour89-silver-gloves") ||
  !summitSilverGlovesTarget.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !summitSilverGlovesTarget.sourceIds.includes("ffwiki-translations") ||
  !summitSilverGlovesTarget.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitIronHelmTarget.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitSilverGlovesPath?.notes?.includes("generic South Gate equipment-stock entry") ||
  !summitSilverGlovesPath.notes.includes("does not map the Disc III listing to an accessible equipment counter") ||
  !summitSilverGlovesPath.notes.includes("not its full stock or any Disc III counter") ||
  !summitSilverGlovesPath.notes.includes("labels the Dali-side South Gate Citadel shop as consumables-only") ||
  !summitSilverGlovesPath.sourceIds.includes("cavesofnarshe-ff9-silver-gloves") ||
  !summitSilverGlovesPath.sourceIds.includes("cour89-south-gate") ||
  !summitSilverGlovesPath.sourceIds.includes("cour89-limited-shops") ||
  !summitSilverGlovesPath.sourceIds.includes("cour89-silver-gloves") ||
  !summitSilverGlovesPath.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !summitSilverGlovesPath.sourceIds.includes("ffwiki-translations") ||
  !summitSilverGlovesPath.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !summitSilverGlovesPath.sourceIds.includes("gamefaqs-south-gate-station-79143") ||
  !summitIronHelmPath?.notes?.includes("generic South Gate equipment-stock entry") ||
  !summitIronHelmPath.notes.includes("does not map the Disc III listing to an accessible equipment counter") ||
  !summitIronHelmPath.notes.includes("not its full stock or any Disc III counter") ||
  !summitIronHelmPath.notes.includes("labels the Dali-side South Gate Citadel shop as consumables-only") ||
  !summitIronHelmPath.notes.includes("Cour89's time-limited shop table supports Iron Helm's Summit Station purchase cutoff") ||
  !summitIronHelmPath.sourceIds.includes("cavesofnarshe-ff9-iron-helm") ||
  !summitIronHelmPath.sourceIds.includes("cour89-south-gate") ||
  !summitIronHelmPath.sourceIds.includes("cour89-limited-shops") ||
  !summitIronHelmPath.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !summitIronHelmPath.sourceIds.includes("gamefaqs-south-gate-station-79143") ||
  !southGateSilverGlovesCandidate || southGateSilverGlovesCandidate.itemId !== "game-item.silver-gloves" ||
  southGateSilverGlovesCandidate.chapterId !== "disc-3.aerial-exploration" ||
  southGateSilverGlovesCandidate.method !== "shop" || southGateSilverGlovesCandidate.availability !== "window-unverified" ||
  southGateSilverGlovesCandidate.cost?.amount !== 720 ||
  southGateSilverGlovesCandidate.shopId !== "south-gate.unmapped-equipment-counter.disc-3" ||
  !southGateSilverGlovesCandidate.conditions.includes("do not rely on it for the optional four-copy target") ||
  !southGateSilverGlovesCandidate.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.south-gate-equipment-candidate-check") ||
  !["cavesofnarshe-ff9-silver-gloves", "cavesofnarshe-ff9-disc-3-map", "cour89-south-gate", "cour89-limited-shops", "cour89-silver-gloves", "gamefaqs-equipment-translation-8240", "ffwiki-translations", "gamefaqs-walkthrough-9801", "gamefaqs-south-gate-station-79143"].every((sourceId) => southGateSilverGlovesCandidate.sourceIds.includes(sourceId)) ||
  !southGateSilverGlovesCandidate.conditions.includes("no Disc III route or timing") ||
  !southGateSilverGlovesCandidate.conditions.includes("no complete stock or Disc III access evidence") ||
  !southGateIronHelmCandidate || southGateIronHelmCandidate.itemId !== "game-item.iron-helm" ||
  southGateIronHelmCandidate.chapterId !== "disc-3.aerial-exploration" ||
  southGateIronHelmCandidate.method !== "shop" || southGateIronHelmCandidate.availability !== "window-unverified" ||
  southGateIronHelmCandidate.cost?.amount !== 450 ||
  southGateIronHelmCandidate.shopId !== "south-gate.unmapped-equipment-counter.disc-3" ||
  !southGateIronHelmCandidate.conditions.includes("do not rely on it for the optional three-copy target or Bright Eyes access") ||
  !southGateIronHelmCandidate.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.south-gate-equipment-candidate-check") ||
  !["cavesofnarshe-ff9-iron-helm", "cavesofnarshe-ff9-disc-3-map", "cour89-south-gate", "gamefaqs-walkthrough-9801", "gamefaqs-south-gate-station-79143"].every((sourceId) => southGateIronHelmCandidate.sourceIds.includes(sourceId)) ||
  !southGateIronHelmCandidate.sourceIds.includes("cour89-limited-shops") ||
  !southGateIronHelmCandidate.conditions.includes("last purchase location before boarding the train") ||
  !southGateIronHelmCandidate.conditions.includes("does not map Caves' generic Disc III listing to an accessible counter") ||
  !southGateIronHelmCandidate.conditions.includes("no Disc III route or timing") ||
  !southGateIronHelmCandidate.conditions.includes("no complete stock or Disc III access evidence") ||
  !southGateCandidateObjective?.sourceIds.includes("cavesofnarshe-ff9-silver-gloves") ||
  !southGateCandidateObjective.sourceIds.includes("cavesofnarshe-ff9-iron-helm") ||
  !southGateCandidateObjective.sourceIds.includes("cour89-south-gate") ||
  !southGateCandidateObjective.sourceIds.includes("cour89-limited-shops") ||
  !southGateCandidateObjective.sourceIds.includes("cour89-silver-gloves") ||
  !southGateCandidateObjective.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !southGateCandidateObjective.sourceIds.includes("ffwiki-translations") ||
  !southGateCandidateObjective.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !southGateCandidateObjective.sourceIds.includes("gamefaqs-south-gate-station-79143") ||
  !summitStationWalkthroughStep?.detail.includes("GameFAQs' missables list recommends four Silver Gloves") ||
  !summitStationWalkthroughStep.detail.includes("Cour89's limited-shop table lists Iron Helm and the Japanese エスカッション row as last purchases at Summit") ||
  !summitStationWalkthroughStep.detail.includes("Caves of Narshe's Disc III map and its Silver Gloves and Iron Helm pages positively list the items") ||
  !summitStationWalkthroughStep.detail.includes("lists only two recommended purchases rather than complete stock") ||
  !summitStationWalkthroughStep.detail.includes("consumables-only South Gate Citadel shop") ||
  !summitStationWalkthroughStep.detail.includes("separate candidate paths stay window-unverified") ||
  !southGateCandidateWalkthrough?.step.text.includes("inspect any equipment counter you find") ||
  !southGateCandidateWalkthrough.step.detail.includes("do not map a Disc III listing to an accessible counter") ||
  !southGateCandidateWalkthrough.step.detail.includes("lists Iron Helm and the Japanese エスカッション row as last purchases there before boarding") ||
  !southGateCandidateWalkthrough.step.objectiveIds.includes("disc-3.aerial-exploration.south-gate-equipment-candidate-check") ||
  !["cavesofnarshe-ff9-disc-3-map", "cavesofnarshe-ff9-silver-gloves", "cavesofnarshe-ff9-iron-helm", "cour89-south-gate", "cour89-limited-shops", "cour89-silver-gloves", "gamefaqs-equipment-translation-8240", "ffwiki-translations", "gamefaqs-walkthrough-9801", "gamefaqs-south-gate-station-79143", "neoseeker-item-locations-182566"].every((sourceId) => southGateCandidateWalkthrough.section.sourceIds.includes(sourceId)) ||
  !cavesDisc3SouthGateSource?.notes.includes("supports separate Disc III candidate paths") ||
  !cour89SouthGateSource?.url.includes("/ff9/maps/south_gate.php") ||
  !cour89SouthGateSource.notes.includes("does not list Silver Gloves or Iron Helm stock") ||
  !cour89LimitedShopsSource?.url.includes("/ff9/tips/goods.php") ||
  !cour89LimitedShopsSource.notes.includes("places アイアンヘルム and エスカッション at South Gate: Summit Station as the last purchase locations") ||
  !cour89LimitedShopsSource.notes.includes("supports the Summit cutoff for both localized item records") ||
  !cour89SilverGlovesSource?.notes.includes("Lindblum pickup on Disc III–IV") ||
  !gamefaqsEquipmentTranslationSource?.notes.includes("Esukashon (Escutcheon)") ||
  !ffwikiTranslationsSource?.notes.includes("maps Japanese エスカッション") ||
  !summitEquipmentCutoff?.trigger.includes("keep those separate paths window-unverified") ||
  !summitEquipmentCutoff.sourceIds.includes("cavesofnarshe-ff9-disc-3-map") ||
  !summitEquipmentCutoff.sourceIds.includes("cavesofnarshe-ff9-silver-gloves") ||
  !summitEquipmentCutoff.sourceIds.includes("cavesofnarshe-ff9-iron-helm") ||
  !summitEquipmentCutoff.sourceIds.includes("cour89-south-gate") ||
  !summitEquipmentCutoff.sourceIds.includes("cour89-limited-shops") ||
  !summitEquipmentCutoff.sourceIds.includes("cour89-silver-gloves") ||
  !summitEquipmentCutoff.sourceIds.includes("gamefaqs-equipment-translation-8240") ||
  !summitEquipmentCutoff.sourceIds.includes("ffwiki-translations") ||
  !summitEquipmentCutoff.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  !summitEquipmentCutoff.sourceIds.includes("gamefaqs-south-gate-station-79143") ||
  !summitEquipmentCutoff.trigger.includes("does not give a Disc III window") ||
  !summitEquipmentCutoff.trigger.includes("only two recommended purchases") ||
  !atadeoSouthGateSource?.notes.includes("South Gate Citadel table names a consumables-only Item Shop") ||
  !atadeoSouthGateSource.notes.includes("separate Summit Station (South Gate) table lists the equipment stock") ||
  !atadeoSouthGateSource.notes.includes("does not label this equipment stock as Disc III") ||
  !gamefaqsSouthGateStationSource?.notes.includes("not a complete shop inventory") ||
  !gamefaqsSouthGateStationSource.notes.includes("does not establish any Disc III counter or stock") ||
  !gamefaqsShopsSource?.notes.includes("separates the consumables-only South (Dali) Gate item shop from Summit Station's equipment shop")
) {
  errors.push("The Summit Station inventory warning must preserve the safe checkpoint while linking Caves of Narshe's Disc III/item-page claims to both window-unverified candidate paths and the optional aerial counter check, without presenting later recovery as confirmed.");
}
const summitShopStockObjective = objectivesById.get("disc-2.journey-to-treno.station-shop-stock");
const summitShopStockPathExpectations: [string, string, number, string][] = [
  ["item-path.disc-2.journey-to-treno.summit-station-air-racket-shop", "game-item.air-racket", 400, "disc-2.journey-to-treno"],
  ["item-path.disc-2.journey-to-treno.glass-armlet-summit-station-shop", "game-item.glass-armlet", 250, "disc-2.journey-to-treno"],
  ["item-path.disc-2.journey-to-treno.headgear-summit-station-shop", "game-item.headgear", 330, "disc-2.journey-to-treno"],
  ["item-path.disc-2.journey-to-treno.steepled-hat-summit-station-shop", "game-item.steepled-hat", 260, "disc-2.journey-to-treno"],
  ["item-path.disc-1.journey-to-burmecia.magus-hat-summit-station-shop", "game-item.magus-hat", 400, "disc-1.journey-to-burmecia"],
  ["item-path.disc-1.journey-to-burmecia.rubber-helm-summit-station-shop", "game-item.rubber-helm", 250, "disc-1.journey-to-burmecia"],
];
const summitShopStockPaths = summitShopStockPathExpectations.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const summitShopStockStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-treno-shop-stock-review");
const summitShopStockSources = ["gamefaqs-shops-71891", "gamefaqs-journey-to-treno-71891", "gamefaqs-missables-71891", "gamefaqs-treno-71891", "cour89-air-racket"];
if (
  !summitShopStockObjective ||
  summitShopStockObjective.category !== "collection" ||
  !summitShopStockObjective.chapterIds?.includes("disc-2.journey-to-treno") ||
  !summitShopStockObjective.profileIds?.includes("comprehensive") ||
  summitShopStockSources.some((sourceId) => !summitShopStockObjective.sourceIds.includes(sourceId)) ||
  summitShopStockPaths.some((path, index) => !path ||
    path.itemId !== summitShopStockPathExpectations[index][1] ||
    path.chapterId !== summitShopStockPathExpectations[index][3] ||
    path.method !== "shop" ||
    path.availability !== "limited-window" ||
    path.shopId !== "summit-station.weapon-shop" ||
    path.cost?.amount !== summitShopStockPathExpectations[index][2] ||
    !path.walkthroughObjectiveIds?.includes("disc-2.journey-to-treno.station-shop-stock") ||
    !path.sourceIds.includes("gamefaqs-shops-71891")) ||
  !summitShopStockPaths[0]?.walkthroughObjectiveIds?.includes("disc-2.treno.air-racket-purchase") ||
  !summitShopStockStep?.objectiveIds?.includes("disc-2.journey-to-treno.station-shop-stock") ||
  !summitShopStockStep.text.includes("Air Racket (400 Gil), Glass Armlet (250), Steepled Hat (260), Headgear (330), Magus Hat (400), and Rubber Helm (250)") ||
  !summitShopStockStep.detail?.includes("This closes only this seller's window") ||
  !summitShopStockStep.detail.includes("this Summit copy counts toward that total") ||
  !summitShopStockStep.detail.includes("one more copy is in Ipsen's Castle") ||
  !gamefaqsShopsSource?.notes.includes("the Summit stock is first-visit only")
) {
  errors.push("Summit Station's six limited-window shop paths must link to the sourced optional stock-review checkpoint, retain their listed prices, and distinguish this seller's closure from later item-type routes.");
}
const southGateAcquisitionExpectations: [string, string, string, string, string][] = [
  ["item-path.disc-1.journey-to-burmecia.bohden-gate-multina-racket", "game-item.multina-racket", "disc-1.journey-to-burmecia", "single-use", "disc-1.journey-to-burmecia.south-gate-pickups"],
  ["item-path.disc-1.journey-to-burmecia.bohden-station-potion", "game-item.potion", "disc-1.journey-to-burmecia", "single-use", "disc-1.journey-to-burmecia.south-gate-pickups"],
  ["item-path.disc-3.on-the-high-seas.bohden-gate-multina-racket-recovery", "game-item.multina-racket", "disc-3.on-the-high-seas", "conditional", "disc-3.on-the-high-seas.south-gates"],
  ["item-path.disc-3.on-the-high-seas.treno-arch-elixir-front", "game-item.elixir", "disc-3.on-the-high-seas", "single-use", "disc-3.on-the-high-seas.south-gates"],
  ["item-path.disc-3.on-the-high-seas.treno-arch-elixir-rear", "game-item.elixir", "disc-3.on-the-high-seas", "single-use", "disc-3.on-the-high-seas.south-gates"],
];
const southGateDisc1SourceIds = ["gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "elitegrindlab-south-gate"];
const southGateDisc3SourceIds = ["gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss"];
const southGateWarning = missablesById.get("missable.disc-1.journey-to-burmecia.south-gate-pickups");
const southGateCableCarCutoff = cutoffsById.get("cutoff.south-gate.cable-car-departure");
const southGateDisc1Objective = objectivesById.get("disc-1.journey-to-burmecia.south-gate-pickups");
const southGateDisc3Objective = objectivesById.get("disc-3.on-the-high-seas.south-gates");
const southGateDisc1WalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "journey-south-gate-station");
const southGateDisc3WalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-3.on-the-high-seas")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "high-seas-south-gates");
const southGateAcquisitions = southGateAcquisitionExpectations.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
if (
  southGateAcquisitions.some((path) => !path) ||
  southGateAcquisitions.some((path, index) => !path || path.itemId !== southGateAcquisitionExpectations[index][1] || path.chapterId !== southGateAcquisitionExpectations[index][2] || path.availability !== southGateAcquisitionExpectations[index][3] || path.method !== "chest" || !path.walkthroughObjectiveIds?.includes(southGateAcquisitionExpectations[index][4])) ||
  southGateDisc1SourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
  southGateDisc3SourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
  southGateAcquisitions.slice(0, 2).some((path) => !southGateDisc1SourceIds.every((sourceId) => path?.sourceIds.includes(sourceId))) ||
  southGateAcquisitions.slice(2).some((path) => !southGateDisc3SourceIds.every((sourceId) => path?.sourceIds.includes(sourceId))) ||
  !southGateAcquisitions[0]?.conditions.includes("same copy remains available on the Disc III return") ||
  !southGateAcquisitions[1]?.conditions.includes("chest copy is lost after leaving the gate complex") ||
  !southGateAcquisitions[2]?.conditions.includes("only if the Disc I pickup was missed") ||
  !southGateAcquisitions[2]?.conditions.includes("Elixir Card") ||
  !southGateAcquisitions[3]?.conditions.includes("front Elixir chest") ||
  !southGateAcquisitions[4]?.conditions.includes("second Elixir chest farther back") ||
  !southGateAcquisitions[4]?.conditions.includes("Elixir Card") ||
  !southGateWarning?.classification.includes("recoverable-later") ||
  !southGateWarning.consequence.includes("Potion chest") ||
  !southGateWarning.consequence.includes("existing copy remains at Bohden Gate") ||
  !southGateWarning.recovery.includes("Return to Bohden Gate on Disc III") ||
  !southGateCableCarCutoff?.trigger.includes("Boarding closes the Potion chest") ||
  !southGateCableCarCutoff.trigger.includes("the Racket remains at Bohden Gate for the Disc III return") ||
  !southGateCableCarCutoff.sourceIds.includes("gamefaqs-on-the-high-seas-71891") ||
  !southGateCableCarCutoff.sourceIds.includes("jegged-blue-narciss") ||
  !southGateWarning.sourceIds.includes("gamefaqs-on-the-high-seas-71891") ||
  !southGateWarning.sourceIds.includes("jegged-blue-narciss") ||
  !southGateDisc1Objective?.sourceIds.includes("gamefaqs-on-the-high-seas-71891") ||
  !southGateDisc3Objective?.sourceIds.includes("jegged-blue-narciss") ||
  !southGateDisc1WalkthroughStep?.detail.includes("that chest copy does not return") ||
  !southGateDisc1WalkthroughStep.detail.includes("still at Bohden Gate on the Disc III return") ||
  !southGateDisc3WalkthroughStep?.text.includes("front and rear chests for two Elixirs") ||
  !southGateDisc3WalkthroughStep.text.includes("the separate chest by the gate holds 3,206 Gil") ||
  !southGateDisc3WalkthroughStep.detail.includes("Elixir Card is tracked in the card collection") ||
  !gameItems.find((item) => item.id === "game-item.multina-racket")?.sourceIds.includes("gamefaqs-on-the-high-seas-71891") ||
  !gameItems.find((item) => item.id === "game-item.elixir")?.sourceIds.includes("jegged-blue-narciss")
) {
  errors.push("South Gate acquisition paths must separate the Disc I Potion cutoff from the missed Multina Racket's conditional Disc III recovery and record both Treno Arch Elixir chests with their shared route sources.");
}
const bohdenArchAcquisitionExpectations: [string, string, string, string[]][] = [
  ["item-path.disc-1.exploring-lindblum-kingdom.bohden-arch-ether", "game-item.ether", "disc-1.exploring-lindblum-kingdom.bohden-arch-ether", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.bohden-arch-moccha-coffee", "game-item.moccha-coffee", "disc-1.exploring-lindblum-kingdom.moccha-coffee", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke", "rpgclassics-coffee"]],
];
const bohdenArchAcquisitions = bohdenArchAcquisitionExpectations.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const bohdenArchWalkthroughStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "explore-bohden-arch-pickups");
if (
  bohdenArchAcquisitions.some((path) => !path) ||
  bohdenArchAcquisitions.some((path, index) => !path || path.itemId !== bohdenArchAcquisitionExpectations[index][1] || path.chapterId !== "disc-1.exploring-lindblum-kingdom" || path.method !== "fixed-pickup" || path.quantity !== 1 || path.availability !== "single-use" || !path.walkthroughObjectiveIds?.includes(bohdenArchAcquisitionExpectations[index][2]) || !bohdenArchAcquisitionExpectations[index][3].every((sourceId) => path.sourceIds.includes(sourceId))) ||
  bohdenArchAcquisitionExpectations.flatMap(([, , , sourceIds]) => sourceIds).some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
  !bohdenArchAcquisitions[0]?.conditions.includes("far end of Bohden Arch's bridge") ||
  !bohdenArchAcquisitions[0]?.conditions.includes("right-hand post") ||
  !bohdenArchAcquisitions[1]?.conditions.includes("base of the large tree") ||
  !bohdenArchAcquisitions[1]?.conditions.includes("far right") ||
  !gameItems.find((item) => item.id === "game-item.moccha-coffee")?.sourceIds.includes("rpgclassics-coffee") ||
  !gameItems.find((item) => item.id === "game-item.ether")?.sourceIds.includes("jegged-gizamaluke") ||
  !objectivesById.get("disc-1.exploring-lindblum-kingdom.bohden-arch-ether")?.sourceIds.includes("jegged-gizamaluke") ||
  !bohdenArchWalkthroughStep?.objectiveIds.includes("disc-1.exploring-lindblum-kingdom.bohden-arch-ether") ||
  !bohdenArchWalkthroughStep?.objectiveIds.includes("disc-1.exploring-lindblum-kingdom.moccha-coffee") ||
  !bohdenArchWalkthroughStep?.text.includes("far end of the bridge") ||
  !bohdenArchWalkthroughStep?.text.includes("base of the large tree")
) {
  errors.push("Bohden Arch must keep the Ether and Moccha Coffee pickups as separate source-linked item paths and checklist objectives at their documented locations.");
}
const earlyExplorationAcquisitionExpectations: [string, string, number, "chocograph" | "chest", string, string[]][] = [
  ["item-path.disc-1.exploring-lindblum-kingdom.streamside-elixir", "game-item.elixir", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.streamside-hi-potion", "game-item.hi-potion", 3, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.streamside-ether", "game-item.ether", 4, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.lindblum.streamside-germinas-boots", "game-item.germinas-boots", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-potion", "game-item.potion", 5, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-hi-potion", "game-item.hi-potion", 5, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-tent", "game-item.tent", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-cotton-robe", "game-item.cotton-robe", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.pinnacle-rocks-elixir", "game-item.elixir", 1, "chest", "disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke"]],
  ["item-path.disc-1.exploring-lindblum-kingdom.pinnacle-rocks-phoenix-down", "game-item.phoenix-down", 1, "chest", "disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke"]],
];
const earlyExplorationAcquisitions = earlyExplorationAcquisitionExpectations.map(([pathId]) => itemAcquisitionPaths.find((path) => path.id === pathId));
const earlyExplorationSteps = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
  ?.sections.flatMap((section) => section.steps);
const firstChocographsStep = earlyExplorationSteps?.find((step) => step.id === "explore-first-two-chocographs");
const earlyPinnacleRocksStep = earlyExplorationSteps?.find((step) => step.id === "explore-pinnacle-rocks-early-treasure");
if (
  earlyExplorationAcquisitions.some((path) => !path) ||
  earlyExplorationAcquisitions.some((path, index) => !path || path.itemId !== earlyExplorationAcquisitionExpectations[index][1] || path.quantity !== earlyExplorationAcquisitionExpectations[index][2] || path.method !== earlyExplorationAcquisitionExpectations[index][3] || path.chapterId !== "disc-1.exploring-lindblum-kingdom" || path.availability !== "single-use" || !path.walkthroughObjectiveIds?.includes(earlyExplorationAcquisitionExpectations[index][4]) || !earlyExplorationAcquisitionExpectations[index][5].every((sourceId) => path.sourceIds.includes(sourceId))) ||
  earlyExplorationAcquisitionExpectations.flatMap(([, , , , , sourceIds]) => sourceIds).some((sourceId) => !sources.some((source) => source.id === sourceId)) ||
  earlyExplorationAcquisitions.some((path, index) => !path || !earlyExplorationAcquisitionExpectations[index][5].every((sourceId) => gameItems.find((item) => item.id === path.itemId)?.sourceIds.includes(sourceId))) ||
  !firstChocographsStep?.text.includes("2 Elixirs, 3 Hi-Potions, 4 Ethers, and 2 Germinas Boots") ||
  !firstChocographsStep?.text.includes("5 Potions, 5 Hi-Potions, 2 Tents, and 2 Cotton Robes") ||
  !firstChocographsStep?.objectiveIds.includes("disc-1.exploring-lindblum-kingdom.first-chocographs") ||
  !earlyPinnacleRocksStep?.objectiveIds.includes("disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups")
) {
  errors.push("The early Lindblum exploration sweep must catalog all rewards from the first two Chocographs and both Pinnacle Rocks chests with their existing objectives and source links.");
}
const trenoShopWindowObjective = objectivesById.get("disc-2.treno.shop-stock-window");
const trenoShopWindowStep = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-2.treno")
  ?.sections.flatMap((section) => section.steps)
  .find((step) => step.id === "treno-mogrich-letter");
const trenoLimitedStockPaths: [string, string, number][] = [
  ["item-path.disc-2.treno.flame-staff-shop", "game-item.flame-staff", 1100],
  ["item-path.disc-2.treno.chain-plate-shop", "game-item.chain-plate", 810],
  ["item-path.disc-2.treno.leather-plate-shop", "game-item.leather-plate", 530],
  ["item-path.disc-2.treno.silk-shirt-shop", "game-item.silk-shirt", 400],
  ["item-path.disc-2.treno.bandana-shop", "game-item.bandana", 500],
  ["item-path.disc-2.treno.bone-wrist-shop", "game-item.bone-wrist", 330],
  ["item-path.disc-2.treno.mythril-sword-shop", "game-item.mythril-sword", 1300],
  ["item-path.disc-2.treno.mythril-spear-shop", "game-item.mythril-spear", 1100],
  ["item-path.disc-2.treno.lightning-staff-shop", "game-item.lightning-staff", 1200],
  ["item-path.disc-2.treno.leather-wrist-shop", "game-item.leather-wrist", 200],
  ["item-path.disc-2.treno.magus-hat-shop", "game-item.magus-hat", 400],
  ["item-path.disc-2.treno.mythril-rod-shop", "game-item.mythril-rod", 560],
  ["item-path.disc-2.treno.fork-shop", "game-item.fork", 1100],
  ["item-path.disc-2.treno.chain-mail-shop", "game-item.chain-mail", 1200],
  ["item-path.disc-2.treno.ice-staff-shop", "game-item.ice-staff", 980],
  ["item-path.disc-2.treno.needle-fork-shop", "game-item.needle-fork", 3100],
  ["item-path.disc-2.treno.barbut-shop", "game-item.barbut", 600],
  ["item-path.disc-2.treno.bronze-vest-shop", "game-item.bronze-vest", 670],
];
const trenoPersistentShopPaths: [string, string, number][] = [
  ["item-path.disc-2.treno.dagger-shop", "game-item.dagger", 320],
  ["item-path.disc-2.treno.mage-masher-shop", "game-item.mage-masher", 500],
  ["item-path.disc-2.treno.mythril-dagger-shop", "game-item.mythril-dagger", 950],
  ["item-path.disc-2.treno.mythril-gloves-shop", "game-item.mythril-gloves", 980],
];
const trenoLinenCuirassPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.linen-cuirass-shop");
const lindblumLinenCuirassPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.linen-cuirass-shop");
const trenoShopWindowWarning = missablesById.get("missable.disc-2.treno.disc-ii-shop-stock");
const trenoShopWindowCutoff = cutoffsById.get("cutoff.treno.disc-ii-shop-stock");
if (
  trenoLimitedStockPaths.some(([pathId, itemId, price]) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
    return !path || path.itemId !== itemId || path.chapterId !== "disc-2.treno" || path.method !== "shop" ||
      path.availability !== "limited-window" || path.recommendedBeforeChapterId !== "disc-2.treno" ||
      path.cost?.amount !== price || !path.walkthroughObjectiveIds?.includes("disc-2.treno.shop-stock-window") ||
      !path.sourceIds.includes("gamefaqs-shops-71891") || !path.conditions?.includes("Disc II") || !path.conditions.includes("Disc III–IV");
  }) ||
  trenoPersistentShopPaths.some(([pathId, itemId, price]) => {
    const path = itemAcquisitionPaths.find((candidate) => candidate.id === pathId);
    return !path || path.itemId !== itemId || path.chapterId !== "disc-2.treno" || path.method !== "shop" ||
      path.availability !== "repeatable" || path.cost?.amount !== price || !path.sourceIds.includes("gamefaqs-shops-71891");
  }) ||
  !trenoLinenCuirassPath || trenoLinenCuirassPath.availability !== "repeatable" || trenoLinenCuirassPath.cost?.amount !== 800 ||
  !trenoLinenCuirassPath.conditions?.includes("Disc III–IV") || !trenoLinenCuirassPath.sourceIds.includes("gamefaqs-shops-71891") ||
  !lindblumLinenCuirassPath || lindblumLinenCuirassPath.availability !== "window-unverified" || lindblumLinenCuirassPath.cost?.amount !== 800 ||
  !trenoShopWindowObjective || trenoShopWindowObjective.category !== "advanced" ||
  !trenoShopWindowObjective.sourceIds.includes("gamefaqs-shops-71891") ||
  !trenoShopWindowStep?.objectiveIds?.includes("disc-2.treno.shop-stock-window") ||
  !trenoShopWindowStep.detail?.includes("Disc III–IV Treno table") ||
  !trenoShopWindowStep.detail.includes("the catalog keeps both later routes unverified") ||
  !trenoShopWindowWarning || trenoShopWindowWarning.objectiveId !== "disc-2.treno.shop-stock-window" ||
  !trenoShopWindowWarning.classification.includes("recoverable-later") ||
  !trenoShopWindowWarning.consequence.includes("18 tracked shop paths") ||
  !trenoShopWindowWarning.note?.includes("Glass Armlet remains unresolved") ||
  !trenoShopWindowWarning.note?.includes("older _ATadeo_ GameFAQs walkthrough list a Disc III Treno sale") ||
  !trenoShopWindowWarning.sourceIds.includes("gamefaqs-shops-71891") ||
  !trenoShopWindowWarning.sourceIds.includes("gamefaqs-walkthrough-9801") ||
  trenoShopWindowCutoff?.certainty !== "conservative" ||
  !trenoShopWindowCutoff.missableIds.includes("missable.disc-2.treno.disc-ii-shop-stock") ||
  !gamefaqsShopsSource?.notes.includes("Treno's Disc II weapon-shop table lists 25 products") ||
  !gamefaqsShopsSource.notes.includes("The Items table's 400-Gil Linen Cuirass figure is its sell value")
) {
  errors.push("Treno's Disc II shop catalog must cover the Disc II-only entries and persistent stock with the cited later table comparison, source-specific cutoff objective, and correct Linen Cuirass purchase price.");
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
  ["item-target.disc-2.treno.air-racket", "checkpoint-total"],
  ["item-target.disc-2.journey-to-treno.silver-gloves", "checkpoint-total"],
  ["item-target.disc-2.journey-to-treno.iron-helm", "checkpoint-total"],
  ["item-target.disc-2.return-to-lindblum.chain-mail", "checkpoint-total"],
  ["item-target.disc-3.portal-to-another-world.zorlin-shape", "purchase-recommendation"],
] as const) {
  if (sourceInventoryTargets.find((target) => target.id === targetId)?.basis !== expectedBasis) {
    errors.push(`Inventory target ${targetId} must retain its ${expectedBasis} semantics.`);
  }
}
const airRacketInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-2.treno.air-racket");
const airRacketObjective = objectives.find((objective) => objective.id === "disc-2.treno.air-racket-purchase");
const airRacketWarning = missables.find((missable) => missable.id === "missable.disc-2.treno.air-racket-purchase");
const airRacketTrenoPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.air-racket-shop");
const airRacketIpsensPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.ipsens-castle.air-racket-lift-chest");
const airRacketCour89Source = sources.find((source) => source.id === "cour89-air-racket");
const airRacketItem = gameItems.find((item) => item.id === "game-item.air-racket");
const priestsRacketRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.priests-racket");
const airRacketCutoff = cutoffsById.get("cutoff.treno.air-racket-stock");
const airRacketAbilityClaims = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.air-racket");
if (!airRacketInventoryTarget || airRacketInventoryTarget.targetQuantity !== 5 ||
  airRacketInventoryTarget.basis !== "checkpoint-total" ||
  !airRacketInventoryTarget.sourceIds.includes("gamefaqs-missables-71891") ||
  !airRacketInventoryTarget.sourceIds.includes("gamefaqs-treno-71891") ||
  airRacketInventoryTarget.sourceIds.includes("cour89-air-racket") ||
  !airRacketCour89Source?.url.endsWith("/ff9/items/rackets/01.php") ||
  !airRacketCour89Source.notes.includes("not GameFAQs' optional five-copy pre-Gargan inventory target") ||
  !airRacketItem?.sourceIds.includes("cour89-air-racket") ||
  !airRacketObjective?.sourceIds.includes("gamefaqs-treno-71891") ||
  !airRacketInventoryTarget.interpretation.includes("at least five Air Rackets in inventory") ||
  !airRacketInventoryTarget.interpretation.includes("sixth copy") ||
  !airRacketInventoryTarget.interpretation.includes("three for Need plus three for synthesis") ||
  !airRacketWarning?.action.includes("at least five Air Rackets in inventory") ||
  !airRacketWarning.sourceIds.includes("cour89-air-racket") ||
  !airRacketWarning.action.includes("Summit Station copy") ||
  !airRacketWarning.recovery.includes("sixth listed copy") ||
  !airRacketWarning.recovery.includes("earlier checkpoint") ||
  !airRacketTrenoPath?.conditions.includes("buy only the shortfall") ||
  !airRacketTrenoPath.sourceIds.includes("cour89-air-racket") ||
  !airRacketIpsensPath?.conditions.includes("sixth Air Racket copy") ||
  !airRacketIpsensPath.sourceIds.includes("cour89-air-racket") ||
  !priestsRacketRecipe?.sourceIds.includes("cour89-air-racket") ||
  airRacketAbilityClaims.length !== 2 ||
  !airRacketAbilityClaims.every((claim) => claim.sourceIds.includes("cour89-air-racket")) ||
  !airRacketCutoff?.sourceIds.includes("cour89-air-racket")) {
  errors.push("Air Racket must model the five-copy pre-Gargan Roo inventory checkpoint, count Summit Station copies, and keep the later sixth Ipsen's Castle copy distinct.");
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
const novaDragonRecord = enemyRecords.find((enemy) => enemy.id === "enemy.nova-dragon");
const novaDragonEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.iifa-tree.nova-dragon");
const novaDragonLootExpectations = [
  { id: "item-path.disc-4.second-battle-of-iifa-tree.nova-dragon-grand-armor-steal", itemId: "game-item.grand-armor", method: "steal", slot: "rare", objectiveId: "disc-4.second-battle-of-iifa-tree.nova-dragon-steals" },
  { id: "item-path.disc-4.second-battle-of-iifa-tree.nova-dragon-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveId: "disc-4.second-battle-of-iifa-tree.memoria-entry" },
];
for (const expected of novaDragonLootExpectations) {
  const lootTable = expected.method === "steal" ? novaDragonRecord?.steals : novaDragonRecord?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const requiredSources = new Set([...(novaDragonRecord?.sourceIds ?? []), ...(novaDragonEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (!slot || !path || path.itemId !== expected.itemId || path.chapterId !== "disc-4.second-battle-of-iifa-tree" ||
    path.method !== expected.method || path.quantity !== 1 || path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.nova-dragon" || path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.iifa-tree.nova-dragon"]) ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) ||
    (expected.method === "steal" && (!path.conditions?.includes("0.4%") || !path.conditions.includes("per connected steal check") || !path.conditions.includes("source-reported, not release-verified") || !path.notes?.includes("GameFAQs labels the slot Rare; Jegged calls it Very Rare"))) ||
    (expected.slot === "always" && (!path.conditions?.includes("Always drop") || !path.conditions.includes("after boss victory"))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))) {
    errors.push(`Nova Dragon path ${expected.id} must link its exact one-time enemy slot, encounter, source-specific outcome, and provenance.`);
  }
}
const pandemoniumLootExpectations = [
  { id: "item-path.disc-3.portal-to-another-world.silver-dragon-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", enemyId: "enemy.silver-dragon", encounterId: "encounter.pandemonium.silver-dragon", objectiveId: "disc-3.portal-to-another-world.pandemonium-climax", outcome: "after the Observatory boss victory" },
  { id: "item-path.disc-3.portal-to-another-world.garland-battle-boots-steal", itemId: "game-item.battle-boots", method: "steal", slot: "common", enemyId: "enemy.garland", encounterId: "encounter.pandemonium.garland", objectiveId: "disc-3.portal-to-another-world.pandemonium-boss-steals", rate: "70% chance per connected steal check", recovery: "Battle Boots chest is available earlier in the Maze" },
  { id: "item-path.disc-3.portal-to-another-world.pandemonium-carabini-mail-kuja-steal", itemId: "game-item.carabini-mail", method: "steal", slot: "uncommon", enemyId: "enemy.kuja", encounterId: "encounter.pandemonium.kuja", objectiveId: "disc-3.portal-to-another-world.pandemonium-boss-steals", rate: "23% chance per connected steal check", recovery: "alternate item copy after the maze chest" },
];
for (const expected of pandemoniumLootExpectations) {
  const enemy = enemyRecords.find((entry) => entry.id === expected.enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === expected.encounterId);
  const lootTable = expected.method === "steal" ? enemy?.steals : enemy?.drops;
  const slot = lootTable?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
  const path = itemAcquisitionPaths.find((entry) => entry.id === expected.id);
  const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);
  if (!enemy || enemy.kind !== "boss" || !enemy.encounterIds.includes(expected.encounterId) || !encounter ||
    encounter.kind !== "boss" || !encounter.formation.some((member) => member.enemyId === expected.enemyId && member.quantity === 1) ||
    !encounter.objectiveIds.includes(expected.objectiveId) || !slot || !path || path.itemId !== expected.itemId ||
    path.chapterId !== "disc-3.portal-to-another-world" || path.method !== expected.method || path.quantity !== 1 ||
    path.availability !== "one-time-encounter" || path.enemyId !== expected.enemyId || path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify([expected.encounterId]) ||
    !path.walkthroughObjectiveIds?.includes(expected.objectiveId) ||
    (expected.method === "steal" && (!path.conditions?.includes(expected.rate) || !path.conditions.includes("source-reported, not release-verified") || !path.conditions.includes(expected.recovery))) ||
    (expected.method === "drop" && (!path.conditions?.includes("Always drop") || !path.conditions.includes(expected.outcome))) ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))) {
    errors.push(`Pandemonium path ${expected.id} must link its exact one-time enemy slot, encounter, objective, outcome, and source provenance.`);
  }
}
const novaDragonSynthesisRecovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.black-mage-village-grand-armor-synthesis");
if (!novaDragonSynthesisRecovery || novaDragonSynthesisRecovery.itemId !== "game-item.grand-armor" ||
  novaDragonSynthesisRecovery.method !== "synthesis" || novaDragonSynthesisRecovery.availability !== "conditional" ||
  novaDragonSynthesisRecovery.cost?.amount !== 45000 || !novaDragonSynthesisRecovery.conditions?.includes("Mythril Sword")) {
  errors.push("Nova Dragon's Grand Armor route must preserve its conditional Disc IV synthesis recovery when Mythril Sword was retained.");
}
const amdusiasRecord = enemyRecords.find((enemy) => enemy.id === "enemy.amdusias-fixed");
const amdusiasPreparation = amdusiasRecord?.preparationGuidance;
const amdusiasEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.pandemonium.fixed-amdusias");
const amdusiasBranBalPrepStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-bran-bal-ates-gate")
  ?.steps.find((step) => step.id === "portal-bran-bal-final-sweep");
const amdusiasFightStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-pandemonium-mind-control")
  ?.steps.find((step) => step.id === "portal-pandemonium-amdusias");
const amdusiasPrepSources = ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"];
if (!amdusiasRecord || amdusiasRecord.kind !== "boss" || !amdusiasEncounter || amdusiasEncounter.kind !== "boss" ||
  !amdusiasEncounter.formation.some((member) => member.enemyId === "enemy.amdusias-fixed" && member.quantity === 1) ||
  !amdusiasPreparation || amdusiasPreparation.suggestedLevelRange !== undefined ||
  !amdusiasPreparation.levelRationale.includes("Neither source sets a party-level target") ||
  !amdusiasPreparation.optionalGrinding.includes("without an equipment-change break") ||
  !amdusiasPreparation.setupAdvice.includes("Lightning reduction against Thundara and Antibody against Bio") ||
  !amdusiasPreparation.setupAdvice.includes("defend or heal as needed until Freya and Amarant join") ||
  !amdusiasPreparation.setupAdvice.includes("Freya can Jump") ||
  !amdusiasPreparation.setupAdvice.includes("GameFAQs assigns Common Tent/Uncommon Ether") ||
  !amdusiasPreparation.setupAdvice.includes("Jegged reverses those items") ||
  !amdusiasPreparation.setupAdvice.includes("weak to Wind and nullifies Earth") ||
  !amdusiasBranBalPrepStep?.detail.includes("Pandemonium's fixed fights run consecutively without an equipment-change break") ||
  !amdusiasFightStep?.detail.includes("no party-level target is inferred") ||
  amdusiasPrepSources.some((sourceId) => !amdusiasPreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))) {
  errors.push("Amdusias preparation must preserve the fixed solo opening, Bran Bal preparation window, optional defenses, elemental facts, source-specific steal slots, and disputed stats without a party-level target.");
}
const abadonFixedRecord = enemyRecords.find((enemy) => enemy.id === "enemy.abadon-fixed");
const abadonPreparation = abadonFixedRecord?.preparationGuidance;
const abadonEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.pandemonium.fixed-abadon");
const abadonBranBalPrepStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-bran-bal-ates-gate")
  ?.steps.find((step) => step.id === "portal-bran-bal-final-sweep");
const abadonFightStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-pandemonium-mind-control")
  ?.steps.find((step) => step.id === "portal-pandemonium-abadon");
const abadonPrepSources = ["gamefaqs-portal-to-another-world-71891", "gamefaqs-pandemonium-79143", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];
if (!abadonFixedRecord || abadonFixedRecord.kind !== "boss" || !abadonEncounter || abadonEncounter.kind !== "boss" ||
  !abadonEncounter.formation.some((member) => member.enemyId === "enemy.abadon-fixed" && member.quantity === 1) ||
  !abadonPreparation || abadonPreparation.suggestedLevelRange !== undefined ||
  !abadonPreparation.levelRationale.includes("None of these figures is a party-level target") ||
  !abadonPreparation.setupAdvice.includes("Coral Rings on Steiner and Quina to absorb Thundaga") ||
  !abadonPreparation.setupAdvice.includes("Defend for the first two enemy turns") ||
  !abadonPreparation.setupAdvice.includes("High Wind hits the entire party hard") ||
  !abadonPreparation.setupAdvice.includes("White Wind or Mighty Guard if learned") ||
  !abadonPreparation.setupAdvice.includes("scripted form for Twister") ||
  !abadonBranBalPrepStep?.detail.includes("Coral Rings on Steiner and Quina can absorb Abadon's Thundaga") ||
  !abadonFightStep?.detail.includes("the latter match the separate random Abadon entry") ||
  abadonPrepSources.some((sourceId) => !abadonPreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))) {
  errors.push("Fixed Abadon preparation must preserve its two-turn party opening, optional Coral Ring/Quina support, random-form Twister distinction, disputed record boundary, and lack of a party-level target.");
}
for (const [field, value] of [["level", 54], ["level", 58], ["HP", 10926], ["HP", 12658]] as const) {
  if (abadonFixedRecord?.stats.find((claim) => claim.field === field && claim.value === value)?.verification !== "disputed") {
    errors.push(`Fixed Abadon ${field} ${value} must remain marked disputed across the scripted/random record ambiguity.`);
  }
}
const fixedShellDragonRecord = enemyRecords.find((enemy) => enemy.id === "enemy.shell-dragon-fixed");
const randomShellDragonRecord = enemyRecords.find((enemy) => enemy.id === "enemy.shell-dragon-b");
const fixedShellDragonEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.pandemonium.fixed-shell-dragon");
const pandemoniumRandomPool = enemyEncounters.find((encounter) => encounter.id === "encounter.pandemonium.random-pool");
const shellDragonPreparation = fixedShellDragonRecord?.preparationGuidance;
const shellDragonFightStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-pandemonium-mind-control")
  ?.steps.find((step) => step.id === "portal-pandemonium-shell-dragon");
const shellDragonBlueMagicStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.portal-to-another-world")
  ?.sections.find((section) => section.id === "portal-pandemonium-maze-treasures")
  ?.steps.find((step) => step.id === "portal-pandemonium-blue-magic");
const pandemoniumBlueMagicObjectiveId = "disc-3.portal-to-another-world.pandemonium-blue-magic";
if (!fixedShellDragonRecord || fixedShellDragonRecord.kind !== "boss" ||
  !fixedShellDragonEncounter || fixedShellDragonEncounter.kind !== "boss" ||
  !fixedShellDragonEncounter.formation.some((member) => member.enemyId === "enemy.shell-dragon-fixed" && member.quantity === 1) ||
  fixedShellDragonRecord.blueMagic.some((skill) => skill.name === "Earth Shake") ||
  fixedShellDragonRecord.routeObjectiveIds.includes(pandemoniumBlueMagicObjectiveId) ||
  fixedShellDragonEncounter.objectiveIds.includes(pandemoniumBlueMagicObjectiveId) ||
  !fixedShellDragonEncounter.objectiveIds.includes("disc-3.portal-to-another-world.pandemonium-climax") ||
  !shellDragonPreparation || shellDragonPreparation.suggestedLevelRange !== undefined ||
  !shellDragonPreparation.setupAdvice.includes("Feather Boots absorb Earth Shake") ||
  !shellDragonPreparation.setupAdvice.includes("do not enable Auto-Float") ||
  !shellDragonPreparation.levelRationale.includes("optional, source-specific benchmark") ||
  !shellDragonFightStep?.detail.includes("cannot Eat this Shell Dragon") ||
  shellDragonFightStep.objectiveIds.includes(pandemoniumBlueMagicObjectiveId) ||
  !shellDragonBlueMagicStep?.text.includes("random Shell Dragon [B]") ||
  !shellDragonBlueMagicStep.detail.includes("fixed Shell Dragon story fights are not") ||
  !randomShellDragonRecord?.blueMagic.some((skill) => skill.name === "Earth Shake" && skill.objectiveIds.includes(pandemoniumBlueMagicObjectiveId)) ||
  !randomShellDragonRecord.routeObjectiveIds.includes(pandemoniumBlueMagicObjectiveId) ||
  !pandemoniumRandomPool?.formation.some((member) => member.enemyId === "enemy.shell-dragon-b") ||
  !pandemoniumRandomPool.objectiveIds.includes(pandemoniumBlueMagicObjectiveId) ||
  !sourceIds.has("gamefaqs-pandemonium-29957") ||
  !fixedShellDragonRecord.sourceIds.includes("gamefaqs-pandemonium-29957")) {
  errors.push("The fixed Shell Dragon roster must not link Quina's Earth Shake Eat objective; preserve the random Shell Dragon teacher, optional older preparation advice, and source-specific HP/party-level reports.");
}
for (const value of [10921, 12500, 20921]) {
  if (fixedShellDragonRecord?.stats.find((claim) => claim.field === "HP" && claim.value === value)?.verification !== "disputed") {
    errors.push(`Fixed Shell Dragon HP ${value} must remain a source-scoped disputed report.`);
  }
}
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
const earthGuardianPreparation = earthGuardianRecord?.preparationGuidance;
const earthGuardianPreparationSources = ["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra"];
const earthGuardianLandingStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.breaking-the-seal")
  ?.sections.find((section) => section.id === "breaking-seal-earth-shrine")
  ?.steps.find((step) => step.id === "breaking-seal-earth-shrine-landing");
if (!earthGuardianPreparation || earthGuardianPreparation.suggestedLevelRange !== undefined ||
  !earthGuardianPreparation.levelRationale.includes("Level 54 is the boss's stat") ||
  !earthGuardianPreparation.optionalGrinding.includes("0 EXP") ||
  !earthGuardianPreparation.setupAdvice.includes("Insomniac if using Quina's Night") ||
  !earthGuardianPreparation.setupAdvice.includes("White Wind, Mighty Guard, and Bad Breath") ||
  !earthGuardianPreparation.setupAdvice.includes("Magic Hammer") ||
  !earthGuardianPreparation.setupAdvice.includes("avoid Earth (absorbed)") ||
  !earthGuardianLandingStep?.text.includes("Circlet") ||
  !earthGuardianLandingStep?.text.includes("Devil Killer") ||
  earthGuardianPreparationSources.some((sourceId) => !earthGuardianPreparation.sourceIds.includes(sourceId) || !sourceIds.has(sourceId))) {
  errors.push("Earth Guardian preparation must separate its Level 54 boss stat from party level and preserve the sourced protection, Quina support, and Earth Shake strategy.");
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
  const requiredSources = new Set([...(earthGuardianRecord?.sourceIds ?? []), ...(earthGuardianEncounter?.sourceIds ?? []), ...(steal?.sourceIds ?? [])]);
  if (!steal || !path || path.itemId !== expected.itemId || path.method !== "steal" ||
    path.availability !== "one-time-encounter" ||
    path.enemyId !== "enemy.earth-guardian" ||
    path.enemyLootSlot !== expected.slot ||
    JSON.stringify(path.encounterIds) !== JSON.stringify(["encounter.breaking-the-seal.earth-guardian"]) ||
    !path.walkthroughObjectiveIds?.includes("disc-3.breaking-the-seal.earth-guardian-steals") ||
    !path.conditions?.includes(expected.rate) ||
    !path.conditions?.includes("source-reported") ||
    !path.conditions?.includes("Steal attempt can fail") ||
    ![...requiredSources].every((sourceId) => path.sourceIds.includes(sourceId))) {
    errors.push(`Earth Guardian's ${expected.itemId} one-time steal must match its exact enemy slot, encounter, objective, chance note, and provenance.`);
  }
  if (!itemAcquisitionPaths.some((candidate) => candidate.itemId === expected.itemId &&
    candidate.chapterId !== "disc-3.breaking-the-seal" &&
    guideAreas.findIndex((area) => area.id === candidate.chapterId) > guideAreas.findIndex((area) => area.id === "disc-3.breaking-the-seal"))) {
    errors.push(`Earth Guardian's ${expected.itemId} steal must have a later item-type recovery path.`);
  }
}
const earthGuardianPinionSlot = earthGuardianRecord?.drops.find((slot) => slot.slot === "always" && slot.itemId === "game-item.phoenix-pinion");
const earthGuardianPinionPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.breaking-the-seal.earth-guardian-phoenix-pinion-drop");
const earthGuardianPinionSources = new Set([...(earthGuardianRecord?.sourceIds ?? []), ...(earthGuardianEncounter?.sourceIds ?? []), ...(earthGuardianPinionSlot?.sourceIds ?? [])]);
if (!earthGuardianPinionSlot || !earthGuardianPinionPath ||
  earthGuardianPinionPath.itemId !== "game-item.phoenix-pinion" ||
  earthGuardianPinionPath.method !== "drop" ||
  earthGuardianPinionPath.availability !== "one-time-encounter" ||
  earthGuardianPinionPath.enemyId !== "enemy.earth-guardian" ||
  earthGuardianPinionPath.enemyLootSlot !== "always" ||
  JSON.stringify(earthGuardianPinionPath.encounterIds) !== JSON.stringify(["encounter.breaking-the-seal.earth-guardian"]) ||
  !earthGuardianPinionPath.walkthroughObjectiveIds?.includes("disc-3.breaking-the-seal.complete-shrines") ||
  !earthGuardianPinionPath.conditions?.includes("Always drop") ||
  !earthGuardianPinionPath.conditions.includes("guaranteed after defeating the boss") ||
  ![...earthGuardianPinionSources].every((sourceId) => earthGuardianPinionPath.sourceIds.includes(sourceId))) {
  errors.push("Earth Guardian's Phoenix Pinion route must link its guaranteed Always drop to the exact one-time enemy encounter and provenance.");
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
const tantarianPreparation = tantarianRecord?.preparationGuidance;
const tantarianPreparationSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.trouble-on-the-home-front")?.sections.find((section) => section.id === "trouble-library-tantarian");
const tantarianPreparationStep = tantarianPreparationSection?.steps.find((step) => step.id === "trouble-tantarian-final-chance");
if (!tantarianPreparation || tantarianPreparation.suggestedLevelRange !== undefined ||
  !tantarianPreparation.levelRationale.includes("enemy stat") ||
  !tantarianPreparation.levelRationale.includes("No universal level target") ||
  !tantarianPreparation.difficultyAssessment?.includes("Tough") ||
  !tantarianPreparation.difficultyAssessment.includes("subjective, single-source") ||
  !tantarianPreparation.optionalGrinding.includes("30-minute rescue timer") ||
  !tantarianPreparation.setupAdvice.includes("Antibody") ||
  !tantarianPreparation.setupAdvice.includes("back row") ||
  !tantarianPreparation.setupAdvice.includes("Reis's Wind") ||
  !tantarianPreparation.setupAdvice.includes("150–200 total damage") ||
  !tantarianPreparation.sourceIds.includes("squareenix-tantarian") ||
  !tantarianPreparation.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !tantarianPreparation.sourceIds.includes("neoseeker-ffix-walkthrough-1816852") ||
  !tantarianPreparationSection?.sourceIds.includes("gamefaqs-boss-guide-31490") ||
  !tantarianPreparationStep?.detail?.includes("not a recommended party level") ||
  !tantarianPreparationStep.detail.includes("subjective, single-source rating") ||
  !tantarianPreparationStep.detail.includes("Master Thief")) {
  errors.push("Tantarian preparation must distinguish enemy level from party targets and connect the source-backed Disc III setup to its final library checkpoint.");
}
const meltigeminiRecord = enemyRecords.find((enemy) => enemy.id === "enemy.meltigemini");
const meltigeminiPreparation = meltigeminiRecord?.preparationGuidance;
const meltigeminiBossSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.lost-continent")?.sections.find((section) => section.id === "lost-continent-gulug-boss");
const meltigeminiCombatStep = meltigeminiBossSection?.steps.find((step) => step.id === "lost-continent-meltigemini-battle");
const meltigeminiFacts = meltigeminiRecord?.facts ?? [];
if (!meltigeminiPreparation || meltigeminiPreparation.suggestedLevelRange !== undefined ||
  !meltigeminiPreparation.levelRationale.includes("Level 42 is the boss's stat") ||
  !meltigeminiPreparation.levelRationale.includes("around party Level 35") ||
  !meltigeminiPreparation.difficultyAssessment?.includes("Hard") ||
  !meltigeminiPreparation.difficultyAssessment.includes("Rough") ||
  !meltigeminiPreparation.optionalGrinding.includes("single-source comfort suggestion") ||
  !meltigeminiPreparation.setupAdvice.includes("Antibody") ||
  !meltigeminiPreparation.setupAdvice.includes("Vaccines") ||
  !meltigeminiPreparation.setupAdvice.includes("Vivi leaves") ||
  !meltigeminiPreparation.setupAdvice.includes("Holy or non-elemental") ||
  !meltigeminiPreparation.sourceIds.includes("gamefaqs-walkthrough-gbness-26505") ||
  !meltigeminiPreparation.sourceIds.includes("kamigame-meltigemini") ||
  !meltigeminiFacts.some((fact) => fact.category === "elemental-weakness" && fact.label === "Holy") ||
  !meltigeminiFacts.some((fact) => fact.category === "elemental-weakness" && fact.label === "Fire weakness reported") ||
  !meltigeminiFacts.some((fact) => fact.category === "elemental-resistance" && fact.label === "Fire damage absorbed (disputed report)" && fact.sourceIds.includes("gamefaqs-walkthrough-gbness-26505")) ||
  !meltigeminiBossSection?.sourceIds.includes("kamigame-meltigemini") ||
  !meltigeminiCombatStep?.text.includes("Holy or non-elemental") ||
  !meltigeminiCombatStep.text.includes("Fire's affinity is disputed") ||
  !meltigeminiCombatStep.detail?.includes("single-source comfort target")) {
  errors.push("Meltigemini preparation must keep Level 42 separate from party advice, preserve the conflicting Fire reports, and link status/setup guidance to the Mount Gulug boss checkpoint.");
}
const meltigeminiLootExpectations = [
  { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-steal", method: "steal", slot: "common", itemId: "game-item.vaccine" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-golden-hairpin-steal", method: "steal", slot: "uncommon", itemId: "game-item.golden-hairpin" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-demons-vest-steal", method: "steal", slot: "semi-rare", itemId: "game-item.demons-vest" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-drop", method: "drop", slot: "always", itemId: "game-item.vaccine" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-common-drop", method: "drop", slot: "common", itemId: "game-item.vaccine" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-uncommon-drop", method: "drop", slot: "uncommon", itemId: "game-item.vaccine" },
  { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-rare-drop", method: "drop", slot: "rare", itemId: "game-item.vaccine" },
];
const meltigeminiEncounter = enemyEncounters.find((encounter) => encounter.id === "encounter.mount-gulug.meltigemini");
for (const expected of meltigeminiLootExpectations) {
  const lootTable = expected.method === "steal" ? meltigeminiRecord?.steals : meltigeminiRecord?.drops;
  const lootSlot = lootTable?.find((slot) => slot.slot === expected.slot && slot.itemId === expected.itemId);
  const path = itemAcquisitionPaths.find((candidate) => candidate.id === expected.pathId);
  if (!meltigeminiRecord || !meltigeminiEncounter || meltigeminiEncounter.kind !== "boss" || !lootSlot || !path ||
    !meltigeminiRecord.encounterIds.includes(meltigeminiEncounter.id) ||
    !meltigeminiEncounter.formation.some((member) => member.enemyId === "enemy.meltigemini" && member.quantity === 1) ||
    path.enemyId !== "enemy.meltigemini" || path.enemyLootSlot !== expected.slot ||
    path.encounterIds?.length !== 1 || path.encounterIds[0] !== meltigeminiEncounter.id ||
    path.itemId !== expected.itemId || path.chapterId !== "disc-3.lost-continent" || path.method !== expected.method ||
    path.availability !== "one-time-encounter" ||
    [...new Set([...meltigeminiEncounter.sourceIds, ...lootSlot.sourceIds])].some((sourceId) => !path.sourceIds.includes(sourceId)) ||
    (expected.method === "steal" && (!path.conditions.includes("each attempt can fail") || !path.walkthroughObjectiveIds?.includes("disc-3.lost-continent.meltigemini-steals"))) ||
    (expected.method === "drop" && path.walkthroughObjectiveIds?.includes("disc-3.lost-continent.meltigemini-steals")) ||
    (expected.slot === "always" && (!path.conditions.includes("normal KO victory") || !path.conditions.includes("Always drop slot guarantees one Vaccine"))) ||
    (expected.slot === "common" && expected.method === "drop" && (!path.conditions.includes("96/256 (37.5%)") || !path.conditions.includes("not release-verified"))) ||
    (expected.slot === "uncommon" && expected.method === "drop" && (!path.conditions.includes("32/256 (12.5%)") || !path.conditions.includes("not release-verified"))) ||
    (expected.slot === "rare" && expected.method === "drop" && (!path.conditions.includes("1/256 (~0.391%)") || !path.conditions.includes("not release-verified")))) {
    errors.push(`Meltigemini ${expected.method} slot ${expected.slot} must link to its one-time boss encounter with the correct item, outcome, and provenance.`);
  }
}
const redDragonLootRecord = enemyRecords.find((enemy) => enemy.id === "enemy.red-dragon");
const redDragonEtherSlot = redDragonLootRecord?.drops.find((slot) => slot.slot === "always" && slot.itemId === "game-item.ether");
const redDragonEtherPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.lost-continent.mount-gulug-red-dragon-ether-drop");
const redDragonLootEncounterIds = [
  "encounter.mount-gulug.red-dragon-return-pair",
  "encounter.mount-gulug.red-dragon-mineshaft",
  "encounter.mount-gulug.red-dragon-lower-pair",
];
const redDragonLootEncounters = redDragonLootEncounterIds.map((id) => enemyEncounters.find((encounter) => encounter.id === id));
if (!redDragonLootRecord || !redDragonEtherSlot || !redDragonEtherPath ||
  !sameSortedValues(redDragonLootRecord.encounterIds, redDragonLootEncounterIds) ||
  redDragonEtherPath.enemyId !== "enemy.red-dragon" || redDragonEtherPath.enemyLootSlot !== "always" ||
  !sameSortedValues(redDragonEtherPath.encounterIds ?? [], redDragonLootEncounterIds) ||
  !redDragonEtherPath.conditions.includes("three or four encounters") ||
  !redDragonEtherPath.conditions.includes("does not claim a total copy count") ||
  redDragonEtherPath.walkthroughObjectiveIds?.length ||
  redDragonLootEncounters.some((encounter) => !encounter || encounter.kind !== "fixed" ||
    !encounter.formation.some((member) => member.enemyId === "enemy.red-dragon")) ||
  [...new Set([...(redDragonEtherSlot?.sourceIds ?? []), ...redDragonLootEncounters.flatMap((encounter) => encounter?.sourceIds ?? [])])]
    .some((sourceId) => !redDragonEtherPath.sourceIds.includes(sourceId))) {
  errors.push("Red Dragon's guaranteed Ether path must link its Always slot to each fixed Mount Gulug encounter without asserting the disputed total yield.");
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
if (overTheMoonRecords.length !== 5 || overTheMoonRecords.some((achievement) =>
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
const gaiaShopWalkthroughSection = walkthroughChapters
  .find((chapter) => chapter.areaId === "disc-4.return-to-gaia")
  ?.sections.find((section) => section.steps.some((step) => step.id === "gaia-return-shop-stock"));
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
if (!gaiaShopWalkthroughStep?.detail?.includes("Caves of Narshe's Disc IV map lists Tiger Fangs at Daguerreo for 13,500 Gil") ||
  !gaiaShopWalkthroughStep.detail.includes("GameFAQs and RPGClassics omit it from their Disc IV shop tables") ||
  !gaiaShopWalkthroughStep.detail.includes("Final Fantasy Wiki's indexed item page says the 13,500-Gil Daguerreo purchase ends before Shimmering Island") ||
  !gaiaShopWalkthroughSection?.sourceIds.includes("ffwiki-tiger-fangs") ||
  !gaiaShopWalkthroughStep.detail.includes("inspect the displayed stock and price before relying on it")) {
  errors.push("The Disc IV return walkthrough must present Tiger Fangs as an unverified stock candidate with the opposing shop-table evidence.");
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
const whiteRobeObjective = objectives.find((objective) => objective.id === "disc-3.white-robe");
const whiteRobeChocographPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.white-robe-sea-at-dusk");
const whiteRobeSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.white-robe-daguerreo-synthesis");
const whiteRobeKujaPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.the-final-battle.trance-kuja-white-robe-steal");
const whiteRobeRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.white-robe");
const whiteRobeTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.white-robe");
const whiteRobeAbilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.white-robe").map((claim) => claim.abilityName);
const whiteRobeWalkthroughSteps = walkthroughChapters
  .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps))
  .filter((step) => ["high-seas-ocean-chocographs", "aerial-daguerreo-rank-and-synthesis", "final-preparations-open-activities", "final-battle-kuja-steals"].includes(step.id));
const whiteRobeWalkthroughStepIds = new Set(whiteRobeWalkthroughSteps.map((step) => step.id));
const whiteRobeNeedTarget = whiteRobeTargets.find((target) => target.id === "item-target.disc-4.final-preparations.white-robe-need-three");
const whiteRobeEndTarget = whiteRobeTargets.find((target) => target.id === "item-target.disc-4.final-preparations.white-robe-end-inventory");
if (!whiteRobeObjective ||
  !["disc-3.on-the-high-seas", "disc-3.aerial-exploration", "disc-4.final-preparations", "disc-4.the-final-battle"].every((chapterId) => whiteRobeObjective.chapterIds?.includes(chapterId)) ||
  !whiteRobeRecipe || whiteRobeRecipe.resultItemId !== "game-item.white-robe" || whiteRobeRecipe.cost.amount !== 8000 ||
  !whiteRobeRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.gaia-gear") ||
  !whiteRobeRecipe.ingredients.some((ingredient) => ingredient.itemId === "game-item.jade-armlet") ||
  !["gamefaqs-items-71891", "gamefaqs-equipment-33383", "gamefaqs-shops-71891", "rpgclassics-synthesis"].every((sourceId) => whiteRobeRecipe.sourceIds.includes(sourceId)) ||
  !whiteRobeChocographPath || whiteRobeChocographPath.method !== "chocograph" || whiteRobeChocographPath.availability !== "single-use" ||
  !whiteRobeChocographPath.conditions?.includes("Chocograph #17: Sea at Dusk") ||
  !whiteRobeChocographPath.walkthroughObjectiveIds?.includes("disc-3.white-robe") ||
  !whiteRobeSynthesisPath || whiteRobeSynthesisPath.method !== "synthesis" || whiteRobeSynthesisPath.availability !== "repeatable" ||
  whiteRobeSynthesisPath.recipeId !== "synthesis-recipe.white-robe" || whiteRobeSynthesisPath.cost?.amount !== 8000 ||
  !whiteRobeSynthesisPath.walkthroughObjectiveIds?.includes("disc-3.white-robe") ||
  !whiteRobeKujaPath?.walkthroughObjectiveIds?.includes("disc-3.white-robe") ||
  whiteRobeNeedTarget?.targetQuantity !== 3 || whiteRobeNeedTarget.basis !== "route-need" ||
  whiteRobeEndTarget?.targetQuantity !== 1 || whiteRobeEndTarget.basis !== "end-inventory" ||
  !["Auto-Potion", "Holy", "Loudmouth"].every((abilityName) => whiteRobeAbilities.includes(abilityName)) ||
  !whiteRobeWalkthroughStepIds.has("high-seas-ocean-chocographs") ||
  !whiteRobeWalkthroughSteps.find((step) => step.id === "high-seas-ocean-chocographs")?.text.includes("White Robe") ||
  !whiteRobeWalkthroughSteps.find((step) => step.id === "aerial-daguerreo-rank-and-synthesis")?.detail?.includes("White Robe from Gaia Gear + Jade Armlet for 8,000 Gil") ||
  !whiteRobeWalkthroughSteps.find((step) => step.id === "final-preparations-open-activities")?.detail?.includes("Need 3") ||
  !whiteRobeWalkthroughSteps.find((step) => step.id === "final-battle-kuja-steals")?.detail?.includes("Daguerreo synthesis routes")) {
  errors.push("White Robe must link the Sea at Dusk treasure, repeatable Daguerreo synthesis, Trance Kuja steal, source-specific inventory targets, abilities, and walkthrough checkpoints.");
}
const reflectRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.reflect-ring");
const madainRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.madain-ring");
const reflectRingObjective = objectives.find((objective) => objective.id === "disc-2.reflect-ring");
const madainRingObjective = objectives.find((objective) => objective.id === "disc-2.madain-ring");
const reflectRingRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.reflect-ring");
const madainRingRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.madain-ring");
const reflectRingSynthesisPaths = reflectRingPaths.filter((path) => path.method === "synthesis");
const madainRingSynthesisPaths = madainRingPaths.filter((path) => path.method === "synthesis");
const reflectRingTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.reflect-ring");
const madainRingTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.madain-ring");
const reflectRingAbilityNames = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.reflect-ring").map((claim) => claim.abilityName);
const madainRingAbilityNames = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.madain-ring").map((claim) => claim.abilityName);
const trenoRingAuctionStep = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps)).find((step) => step.id === "treno-fairy-earrings-auction");
const fossilMadainRingStep = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps)).find((step) => step.id === "fossil-roo-madains-ring");
const reflectRingSynthesisShops = ["alexandria.synthesis-shop.disc-3-4", "black-mage-village.synthesis-shop.disc-2-3", "daguerreo.synthesis-expert", "lindblum.synthesis-shop.disc-3-4", "treno.synthesis-shop.disc-3-4"];
if (!gameItems.some((item) => item.id === "game-item.madain-ring" && item.name === "Madain's Ring") ||
  reflectRingPaths.length !== 7 || madainRingPaths.length !== 8 ||
  !reflectRingObjective || !madainRingObjective ||
  !reflectRingObjective.chapterIds?.includes("disc-4.memoria") || !madainRingObjective.chapterIds?.includes("disc-3.forgotten-continent") ||
  !reflectRingRecipe || reflectRingRecipe.resultItemId !== "game-item.reflect-ring" || reflectRingRecipe.cost.amount !== 7000 ||
  !["game-item.anklet", "game-item.madain-ring"].every((itemId) => reflectRingRecipe.ingredients.some((ingredient) => ingredient.itemId === itemId)) ||
  !madainRingRecipe || madainRingRecipe.resultItemId !== "game-item.madain-ring" || madainRingRecipe.cost.amount !== 3000 ||
  !["game-item.bone-wrist", "game-item.stardust-rod"].every((itemId) => madainRingRecipe.ingredients.some((ingredient) => ingredient.itemId === itemId)) ||
  !reflectRingSynthesisShops.every((shopId) => reflectRingSynthesisPaths.some((path) => path.shopId === shopId && path.availability === "repeatable" && path.cost?.amount === 7000)) ||
  !reflectRingSynthesisShops.every((shopId) => madainRingSynthesisPaths.some((path) => path.shopId === shopId && path.availability === "repeatable" && path.cost?.amount === 3000)) ||
  !reflectRingPaths.some((path) => path.method === "auction" && path.availability === "single-use") ||
  !madainRingPaths.some((path) => path.method === "auction" && path.availability === "repeatable") ||
  !madainRingPaths.some((path) => path.id === "item-path.disc-2.journey-to-outer-continent.madain-ring-fossil-roo-digging" && path.walkthroughObjectiveIds?.includes("disc-2.journey-to-outer-continent.one-ring")) ||
  !madainRingPaths.some((path) => path.id === "item-path.disc-3.forgotten-continent.madain-ring-near-landing-mountain-crack" && path.conditions?.includes("#2") && path.conditions?.includes("#3")) ||
  !reflectRingPaths.some((path) => path.id === "item-path.disc-4.memoria.hades-reflect-ring-steal" && path.walkthroughObjectiveIds?.includes("disc-2.reflect-ring")) ||
  reflectRingTargets.find((target) => target.basis === "route-need")?.targetQuantity !== 9 ||
  reflectRingTargets.find((target) => target.basis === "end-inventory")?.targetQuantity !== 8 ||
  madainRingTargets.find((target) => target.basis === "route-need")?.targetQuantity !== 9 ||
  madainRingTargets.find((target) => target.basis === "end-inventory")?.targetQuantity !== 22 ||
  !["Auto-Reflect", "Distract", "Reflect"].every((abilityName) => reflectRingAbilityNames.includes(abilityName)) ||
  !["Body Temp", "Chemist", "Guardian Mog"].every((abilityName) => madainRingAbilityNames.includes(abilityName)) ||
  !trenoRingAuctionStep?.objectiveIds?.includes("disc-2.reflect-ring") ||
  !fossilMadainRingStep?.detail?.includes("later sources provide alternatives")) {
  errors.push("Reflect Ring and Madain's Ring must keep their auction, five-shop synthesis, Hades/Fossil Roo/Mountain Crack, ability, inventory-target, source, and walkthrough links complete.");
}
const rosettaRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.rosetta-ring");
const rosettaRingRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.rosetta-ring");
const rosettaRingTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.rosetta-ring");
const rosettaRingAbilityNames = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.rosetta-ring").map((claim) => claim.abilityName);
const rosettaRingStellazzioPath = rosettaRingPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.rosetta-ring-stellazzio-reward");
const rosettaRingFriendlyYanPath = rosettaRingPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.rosetta-ring-friendly-yan-gift");
const rosettaRingSynthesisPath = rosettaRingPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.rosetta-ring-black-mage-village-synthesis");
const rosettaRingStellazzioObjective = objectives.find((objective) => objective.id === "disc-3.aerial-exploration.rosetta-ring-stellazzio");
const rosettaRingSteps = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));
const rosettaRingStellazzioStep = rosettaRingSteps.find((step) => step.id === "aerial-treno-stellazzio");
const rosettaRingFriendlyYanStep = rosettaRingSteps.find((step) => step.id === "aerial-friendly-yan-gift");
const rosettaRingShopStep = rosettaRingSteps.find((step) => step.id === "gaia-return-shop-stock");
const rosettaRingFinalPrepStep = rosettaRingSteps.find((step) => step.id === "final-preparations-open-activities");
if (!gameItems.some((item) => item.id === "game-item.rosetta-ring" &&
    ["gamefaqs-stellazzio-71891", "gamefaqs-friendly-creatures-71891", "rpgclassics-synthesis"].every((sourceId) => item.sourceIds.includes(sourceId))) ||
  rosettaRingPaths.length !== 4 ||
  !rosettaRingStellazzioObjective?.chapterIds?.includes("disc-3.aerial-exploration") ||
  rosettaRingStellazzioPath?.method !== "quest-reward" || rosettaRingStellazzioPath.availability !== "single-use" ||
  !rosettaRingStellazzioPath.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.rosetta-ring-stellazzio") ||
  rosettaRingFriendlyYanPath?.method !== "quest-reward" || rosettaRingFriendlyYanPath.availability !== "conditional" ||
  !rosettaRingFriendlyYanPath?.conditions?.includes("other eight") || !rosettaRingFriendlyYanPath?.conditions?.includes("Diamond") ||
  !rosettaRingFriendlyYanPath?.notes?.includes("Always drop") || !rosettaRingFriendlyYanPath?.notes?.includes("gift route") ||
  !rosettaRingFriendlyYanPath.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.friendly-yan") ||
  !rosettaRingRecipe || rosettaRingRecipe.cost.amount !== 24000 || rosettaRingRecipe.chapterId !== "disc-4.return-to-gaia" ||
  rosettaRingRecipe.shopId !== "black-mage-village.synthesis-shop.disc-4" ||
  !["game-item.holy-lance", "game-item.madain-ring"].every((itemId) => rosettaRingRecipe.ingredients.some((ingredient) => ingredient.itemId === itemId)) ||
  rosettaRingSynthesisPath?.availability !== "repeatable" || rosettaRingSynthesisPath.cost?.amount !== 24000 ||
  rosettaRingTargets.find((target) => target.basis === "route-need")?.targetQuantity !== 9 ||
  rosettaRingTargets.find((target) => target.basis === "end-inventory")?.targetQuantity !== 13 ||
  !["Concentrate", "Level Up", "Reflectx2"].every((abilityName) => rosettaRingAbilityNames.includes(abilityName)) ||
  !rosettaRingStellazzioStep?.objectiveIds?.includes("disc-3.aerial-exploration.rosetta-ring-stellazzio") ||
  !rosettaRingStellazzioStep?.text.includes("Rosetta Ring") ||
  !rosettaRingFriendlyYanStep?.objectiveIds?.includes("disc-3.aerial-exploration.friendly-yan") ||
  !rosettaRingShopStep?.detail?.includes("Rosetta Ring from Madain's Ring + Holy Lance (24,000)") ||
  !rosettaRingFinalPrepStep?.detail?.includes("end-inventory #13")) {
  errors.push("Rosetta Ring must link its Mountain Crack, Stellazzio, Friendly Yan, and Disc IV synthesis routes, preserve the Friendly Yan drop/gift distinction, and record its targets, abilities, and walkthrough checkpoints.");
}
const coralRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.coral-ring");
const coralRingSynthesisPaths = coralRingPaths.filter((path) => path.method === "synthesis");
const coralRingRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.coral-ring");
const coralRingTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.coral-ring");
const coralRingAbilityNames = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.coral-ring").map((claim) => claim.abilityName);
const coralRingPostCleyraPath = coralRingPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.coral-ring-post-cleyra-synthesis");
const coralRingTrenoPath = coralRingPaths.find((path) => path.id === "item-path.disc-2.treno.coral-ring-synthesis");
const coralRingTrenoLaterPath = coralRingPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.coral-ring-treno-synthesis");
const coralRingSections = walkthroughChapters.flatMap((chapter) => chapter.sections);
const coralRingShopStep = coralRingSections.flatMap((section) => section.steps)
  .find((step) => step.id === "return-lindblum-shop-preparation");
const coralRingShopSection = coralRingSections.find((section) => section.id === "return-lindblum-business-district");
const coralRingTrenoSection = coralRingSections.find((section) => section.id === "treno-city-pickups-and-mognet");
const coralRingTrenoStep = coralRingSections.flatMap((section) => section.steps)
  .find((step) => step.id === "treno-mogrich-letter");
const coralRingTrenoObjective = objectives.find((objective) => objective.id === "disc-2.treno.shop-stock-window");
if (!gameItems.some((item) => item.id === "game-item.coral-ring" &&
    ["gamefaqs-hunt-minigame-71891", "gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-abilities-71891", "rpgclassics-synthesis", "drslice-treno-synthesis-disc2", "ffwiki-treno", "gamerguides-treno"].every((sourceId) => item.sourceIds.includes(sourceId))) ||
  coralRingPaths.length !== 9 ||
  coralRingSynthesisPaths.length !== 8 ||
  !coralRingSynthesisPaths.every((path) => path.recipeId === "synthesis-recipe.coral-ring" && path.cost?.amount === 1200) ||
  coralRingRecipe?.resultItemId !== "game-item.coral-ring" || coralRingRecipe.cost.amount !== 1200 ||
  !["game-item.lightning-staff", "game-item.rod"].every((itemId) => coralRingRecipe.ingredients.some((ingredient) => ingredient.itemId === itemId)) ||
  coralRingPostCleyraPath?.availability !== "repeatable" || coralRingPostCleyraPath.cost?.amount !== 1200 ||
  !coralRingPostCleyraPath.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.cleyra-recovery-shops") ||
  coralRingTrenoPath?.availability !== "repeatable" ||
  !["drslice-treno-synthesis-disc2", "ffwiki-treno", "gamerguides-treno", "rpgclassics-synthesis", "gamefaqs-shops-71891"]
    .every((sourceId) => coralRingTrenoPath?.sourceIds.includes(sourceId)) ||
  !coralRingTrenoPath?.conditions?.includes("GameFAQs Shops omits Coral Ring from its Disc II Treno list") ||
  !coralRingTrenoPath?.conditions?.includes("source-table difference") ||
  coralRingTrenoLaterPath?.availability !== "repeatable" ||
  coralRingTargets.find((target) => target.basis === "route-need")?.targetQuantity !== 9 ||
  coralRingTargets.find((target) => target.basis === "end-inventory")?.targetQuantity !== 8 ||
  !["Insomniac", "Lancer", "Man Eater"].every((abilityName) => coralRingAbilityNames.includes(abilityName)) ||
  !coralRingShopStep?.detail?.includes("Lightning Staff + Rod for 1,200 Gil") ||
  !coralRingShopSection?.sourceIds?.includes("rpgclassics-synthesis") ||
  !coralRingTrenoSection?.sourceIds?.includes("drslice-treno-synthesis-disc2") ||
  !coralRingTrenoStep?.detail?.includes("GameFAQs Shops omits Coral Ring from its Disc II Treno recipe table") ||
  !coralRingTrenoObjective?.sourceIds.includes("ffwiki-treno")) {
  errors.push("Coral Ring must retain its Festival reward, priced synthesis routes and distinct later Treno path, document the Disc II Treno source-table difference, and preserve targets, abilities, and walkthrough/source links.");
}
const rodPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.rod");
const rodDaliPath = rodPaths.find((path) => path.id === "item-path.disc-1.village-of-dali.rod-shop");
const rodNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.rod-need-two");
const rodEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.rod-end-inventory-eight");
const rodAbilityNames = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.rod").map((claim) => claim.abilityName);
if (!gameItems.some((item) => item.id === "game-item.rod" && ["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-abilities-71891", "gamefaqs-ipsens-castle-71891"].every((sourceId) => item.sourceIds.includes(sourceId))) ||
  rodPaths.length !== 4 ||
  !rodPaths.some((path) => path.method === "starting-equipment" && path.chapterId === "disc-1.alexandria") ||
  rodDaliPath?.chapterId !== "disc-1.village-of-dali" || rodDaliPath.cost?.amount !== 260 ||
  !rodPaths.some((path) => path.method === "chest" && path.chapterId === "disc-3.ipsens-castle" && path.walkthroughObjectiveIds?.includes("disc-3.ipsens-castle.pickups")) ||
  rodNeedTarget?.targetQuantity !== 2 || rodNeedTarget.basis !== "route-need" ||
  rodEndInventoryTarget?.targetQuantity !== 8 || rodEndInventoryTarget.basis !== "end-inventory" ||
  !["Cure", "Panacea", "Protect"].every((abilityName) => rodAbilityNames.includes(abilityName))) {
  errors.push("Rod must link its Garnet, Dali/Lindblum, and Ipsen sources to the Coral Ring recipe, optional quantity targets, and three listed abilities.");
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
console.log(`Optional route connectivity: ${optionalRouteBranchesWithRejoin}/${optionalRouteBranches.length} branch edges reach their launch chapter or a forward required-story chapter.`);
console.log(`Items: ${gameItems.length} partial item record(s), ${itemAcquisitionPaths.length} source-linked acquisition path(s) across ${itemCatalogCoverage.chapterIds.length} chapter slices; ${synthesisRecipes.length} synthesis recipe(s); ${sourceInventoryTargets.length} source inventory target(s), ${equipmentAbilityClaims.length} partial ability claim(s).`);
console.log(`Cleyra shops: ${cleyraShopPaths.length} priced stock path(s) for ${cleyraProductIds.length} unique products; ${cleyraProductsWithLaterPaths.length} have a later acquisition path.`);
console.log(`Enemy reference: ${enemyRecords.length} partial record(s) across ${enemyCatalogCoverage.chapterIds.length} chapter slice(s), with ${enemyEncounters.length} encounter group(s).`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);
if (errors.length > 0) process.exitCode = 1;
