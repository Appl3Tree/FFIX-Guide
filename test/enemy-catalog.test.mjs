import assert from "node:assert/strict";
import test from "node:test";
import { enemyCatalogCoverage, enemyEncounters, enemyRecords } from "../src/data/enemies.ts";
import { objectives, sources } from "../src/data/guide.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

const objectiveId = "disc-4.return-to-gaia.island-blue-magic";
const sourceId = "gamefaqs-enemy-list-71891";
const rosters = {
  "encounter.return-to-gaia.mist-continent-world-map": ["enemy.adamantoise", "enemy.axe-beak", "enemy.bandersnatch", "enemy.bomb", "enemy.carve-spider", "enemy.clipper", "enemy.dracozombie", "enemy.ghost", "enemy.gigan-octopus", "enemy.goblin", "enemy.grand-dragon", "enemy.hedgehog-pie", "enemy.ironite", "enemy.ladybird", "enemy.lizard-man", "enemy.malboro-pandemonium", "enemy.mandragora", "enemy.mistodon-b", "enemy.mu", "enemy.python", "enemy.sand-scorpion", "enemy.serpion", "enemy.skeleton", "enemy.trick-sparrow", "enemy.worm-hydra", "enemy.vice", "enemy.whale-zombie", "enemy.yeti"],
  "encounter.return-to-gaia.outer-continent-world-map": ["enemy.blazer-beetle", "enemy.cactuar", "enemy.dracozombie", "enemy.gigan-octopus", "enemy.goblin-mage", "enemy.grand-dragon", "enemy.griffin", "enemy.hecteyes", "enemy.land-worm", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.ogre", "enemy.troll", "enemy.whale-zombie"],
  "encounter.return-to-gaia.lost-continent-world-map": ["enemy.dracozombie", "enemy.feather-circle", "enemy.gigan-octopus", "enemy.hecteyes", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.vepal-green", "enemy.whale-zombie"],
  "encounter.return-to-gaia.forgotten-continent-world-map": ["enemy.adamantoise", "enemy.armstrong", "enemy.cactuar", "enemy.dracozombie", "enemy.gigan-octopus", "enemy.gimme-cat", "enemy.grand-dragon", "enemy.hecteyes", "enemy.jabberwock", "enemy.malboro-pandemonium", "enemy.mistodon-b", "enemy.worm-hydra"],
};

test("Disc IV continent rosters match the source-listed member sets", () => {
  assert.equal(enemyCatalogCoverage.status, "partial");

  for (const [encounterId, expectedEnemyIds] of Object.entries(rosters)) {
    const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
    assert.ok(encounter, `missing ${encounterId}`);
    assert.equal(encounter.kind, "random-pool");
    assert.equal(encounter.chapterId, "disc-4.return-to-gaia");
    assert.deepEqual(encounter.formation.map((entry) => entry.enemyId).sort(), [...expectedEnemyIds].sort());
    assert.ok(encounter.formation.every((entry) => entry.quantity === null));
    assert.ok(encounter.sourceIds.includes(sourceId));
    assert.ok(encounter.objectiveIds.includes(objectiveId));
    assert.ok(encounter.notes.some((note) => note.includes("continent-level roster") && note.includes("exact tiles") && note.includes("rates")));

    for (const enemyId of expectedEnemyIds) {
      assert.ok(enemyRecords.find((enemy) => enemy.id === enemyId)?.encounterIds.includes(encounterId), `${enemyId} lacks reciprocal link to ${encounterId}`);
    }
  }
});

test("Disc IV's new enemy profiles keep source-backed stats and the distinct Mistodon version", () => {
  const expected = [
    ["enemy.bandersnatch", 14, 899, 464, 2, "rpgclassics-bestiary-a-c"],
    ["enemy.gigan-octopus", 31, 3584, 1044, 3, "rpgclassics-bestiary-c-g"],
    ["enemy.grand-dragon", 60, 13206, 2550, 3, "rpgclassics-bestiary-c-g"],
    ["enemy.whale-zombie", 32, 3730, 1066, 3, "rpgclassics-bestiary-t-z"],
    ["enemy.hecteyes", 51, 9567, 2033, 3, "rpgclassics-kraken-bestiary"],
    ["enemy.land-worm", 29, 5296, 997, 3, "rpgclassics-kraken-bestiary"],
    ["enemy.vepal-green", 34, 4363, 1188, 2, "rpgclassics-bestiary-t-z"],
    ["enemy.mistodon-b", 56, 11434, 2301, 2, "rpgclassics-kraken-bestiary"],
  ];

  for (const [enemyId, level, hp, mp, ap, bestiarySourceId] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    assert.ok(enemy, `missing ${enemyId}`);
    assert.equal(enemy.chapterId, "disc-4.return-to-gaia");
    assert.equal(enemy.coverage, "partial");
    assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, level);
    assert.equal(enemy.stats.find((entry) => entry.field === "HP")?.value, hp);
    assert.equal(enemy.stats.find((entry) => entry.field === "MP")?.value, mp);
    assert.equal(enemy.stats.find((entry) => entry.field === "AP")?.value, ap);
    assert.ok(enemy.sourceIds.includes(sourceId));
    assert.ok(enemy.sourceIds.includes(bestiarySourceId));
    assert.ok(sources.some((source) => source.id === bestiarySourceId));
  }

  const mistodonA = enemyRecords.find((enemy) => enemy.id === "enemy.mistodon-a");
  const mistodonB = enemyRecords.find((enemy) => enemy.id === "enemy.mistodon-b");
  assert.notEqual(mistodonA?.id, mistodonB?.id);
  assert.match(mistodonA?.name ?? "", /^Mistodon \[A\]/);
  assert.equal(mistodonB?.name, "Mistodon [B]");
  assert.ok(mistodonB?.notes.some((note) => note.includes("Do not copy the older version's attack profile")));
});

test("Disc IV bestiary and Quina lessons share the Return to Gaia checklist", () => {
  const expectedSkills = new Map([
    ["enemy.bandersnatch", "Pumpkin Head"],
    ["enemy.gigan-octopus", "Mighty Guard"],
    ["enemy.grand-dragon", "LV3 Def-less"],
    ["enemy.whale-zombie", "LV5 Death"],
    ["enemy.hecteyes", "Roulette"],
    ["enemy.land-worm", "Matra Magic"],
    ["enemy.vepal-green", "Aqua Breath"],
    ["enemy.mistodon-b", "Angel's Snack"],
  ]);

  assert.ok(objectives.some((objective) => objective.id === objectiveId));
  assert.match(sources.find((source) => source.id === "rpgclassics-bestiary-a-c")?.title ?? "", /A–B/);
  for (const [enemyId, skillName] of expectedSkills) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const skill = enemy?.blueMagic.find((entry) => entry.name === skillName);
    assert.ok(skill, `${enemyId} should teach ${skillName}`);
    assert.ok(skill.objectiveIds.includes(objectiveId));
    assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  }
});

test("Hilgigars preparation keeps Kamigame's optional level benchmark source-scoped", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.hilgigars");
  const guidance = enemy?.preparationGuidance;
  const source = sources.find((entry) => entry.id === "kamigame-hilgigars");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.conde-petie-mountain-path")
    ?.sections.find((entry) => entry.id === "mountain-path-hilgigars-and-stones");
  const prepStep = section?.steps.find((entry) => entry.id === "mountain-path-encounters-and-boss-prep");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Lv\. 21 or higher/);
  assert.match(guidance.levelRationale, /single-source/);
  assert.match(guidance.levelRationale, /Level 28 is the enemy's stat/);
  assert.match(guidance.optionalGrinding, /Excalibur II or low-experience route/);
  assert.ok(guidance.sourceIds.includes("kamigame-hilgigars"));
  assert.ok(guidance.sourceIds.includes("gamefaqs-conde-petie-mountain-path-71891"));
  assert.ok(enemy.sourceIds.includes("kamigame-hilgigars"));
  assert.match(source?.notes ?? "", /platform or game build/);
  assert.ok(section?.sourceIds.includes("kamigame-hilgigars"));
  assert.match(prepStep?.text ?? "", /Lv\. 21 or higher as an optional benchmark/);
  assert.match(prepStep?.detail ?? "", /does not identify the platform or build/);
  assert.match(prepStep?.detail ?? "", /Excalibur II or low-experience route/);
});

test("Soulcage preparation explains the opening LV5 Death without inventing a party level", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.soulcage");
  const guidance = enemy?.preparationGuidance;
  const source = sources.find((entry) => entry.id === "kamigame-soulcage");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.iifa-tree")
    ?.sections.find((entry) => entry.id === "iifa-tree-elevator-bottom");
  const prepStep = section?.steps.find((entry) => entry.id === "iifa-tree-boss-preparation");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 26/);
  assert.match(guidance.levelRationale, /rather than a party recommendation/);
  assert.match(guidance.levelRationale, /divisible by five/);
  assert.match(guidance.setupAdvice, /Body Temp/);
  assert.match(guidance.setupAdvice, /before using Raise\/Life or a Phoenix Down/);
  assert.match(guidance.optionalGrinding, /EXP-free route/);
  assert.ok(guidance.sourceIds.includes("kamigame-soulcage"));
  assert.ok(guidance.sourceIds.includes("gamefaqs-boss-guide-31490"));
  assert.ok(enemy.sourceIds.includes("kamigame-soulcage"));
  assert.match(source?.notes ?? "", /does not set a numeric party-level target/);
  assert.ok(section?.sourceIds.includes("kamigame-soulcage"));
  assert.match(prepStep?.detail ?? "", /opens with LV5 Death/);
  assert.match(prepStep?.detail ?? "", /Level 26 is the enemy stat/);
  assert.match(prepStep?.detail ?? "", /EXP-free route/);
});

test("Ralvurahva preparation scopes the party benchmark and Marcus grind to their sources", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.ralvurahva");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-treno-71891");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-gargan-roo");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.journey-to-cleyra")
    ?.sections.find((entry) => entry.id === "gargan-roo-mognet-and-chests");
  const levelingStep = section?.steps.find((entry) => entry.id === "journey-cleyra-gargan-roo-optional-leveling");
  const rideStepIndex = section?.steps.findIndex((entry) => entry.id === "journey-cleyra-route-the-gargant") ?? -1;
  const levelingStepIndex = section?.steps.findIndex((entry) => entry.id === "journey-cleyra-gargan-roo-optional-leveling") ?? -1;

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 13 is the enemy stat/);
  assert.match(guidance.levelRationale, /party Lv\. 12–13 as an optional/);
  assert.match(guidance.difficultyAssessment ?? "", /characterizes the fight as simple/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective, single-source/);
  assert.match(guidance.optionalGrinding, /GameFAQs says Marcus's stat gains transfer/);
  assert.match(guidance.optionalGrinding, /his level does not/);
  assert.match(guidance.optionalGrinding, /not gameplay-tested here or confirmed across releases/);
  assert.match(guidance.optionalGrinding, /timer\/low-EXP plan/);
  assert.match(guidance.setupAdvice, /Antibody on Dagger and Steiner/);
  assert.match(guidance.setupAdvice, /Marcus remains vulnerable to Poison/);
  assert.ok(["gamefaqs-treno-71891", "gamerguides-gargan-roo"].every((id) => guidance.sourceIds.includes(id)));
  assert.ok(guidance.sourceIds.every((id) => enemy.sourceIds.includes(id)));
  assert.match(gamefaqs?.notes ?? "", /Marcus's stat growth transfers/);
  assert.match(gamerGuides?.notes ?? "", /Lv\. 12–13/);
  assert.match(gamerGuides?.notes ?? "", /does not specify the stat-transfer behavior by release or build/);
  assert.ok(section?.sourceIds.includes("gamefaqs-treno-71891"));
  assert.ok(section?.sourceIds.includes("gamerguides-gargan-roo"));
  assert.ok(levelingStepIndex >= 0 && rideStepIndex > levelingStepIndex);
  assert.match(levelingStep?.text ?? "", /party Lv\. 12–13 as a stopping point/);
  assert.match(levelingStep?.detail ?? "", /not gameplay-tested here or confirmed across releases/);
  assert.match(levelingStep?.detail ?? "", /Excalibur II\/low-EXP route/);
});

test("Ark preparation keeps the GameFAQs party benchmark optional and distinguishes it from enemy Level 38", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.ark");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-ark-prep-29957");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-oeilvert");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-3.forgotten-continent")
    ?.sections.find((entry) => entry.id === "oeilvert-ark-preparation");
  const prepStep = section?.steps.find((entry) => entry.id === "oeilvert-ark-preparation");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 38);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 38 is its enemy stat/);
  assert.match(guidance.levelRationale, /Lv\. 30 or higher/);
  assert.match(guidance.levelRationale, /single-source optional benchmark/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective and setup-dependent/);
  assert.match(guidance.optionalGrinding, /Excalibur II timer/);
  assert.match(guidance.setupAdvice, /anti-magic seal/);
  assert.match(guidance.setupAdvice, /Reis's Wind or Amarant's Chakra/);
  assert.ok(["gamefaqs-ark-prep-29957", "gamerguides-oeilvert", "gamefaqs-boss-guide-31490"]
    .every((id) => guidance.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /filed under Nintendo Switch.*PlayStation walkthrough/);
  assert.match(gamefaqs?.notes ?? "", /not a verified minimum/);
  assert.match(gamerGuides?.notes ?? "", /no party-level target/);
  assert.ok(section?.sourceIds.includes("gamefaqs-ark-prep-29957"));
  assert.ok(section?.sourceIds.includes("gamerguides-oeilvert"));
  assert.match(prepStep?.text ?? "", /optional advice, not a required target/);
  assert.match(prepStep?.detail ?? "", /Level 38 is an enemy stat/);
  assert.match(prepStep?.detail ?? "", /Switch title but identifies itself as a PlayStation walkthrough/);
  assert.match(prepStep?.detail ?? "", /preserve the selected Excalibur II timer\/EXP plan/);
});

test("Lani preparation distinguishes her enemy stat from party level and preserves Dagger-focused counterplay", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.lani");
  const guidance = enemy?.preparationGuidance;
  const gamefaqsBossGuide = sources.find((entry) => entry.id === "gamefaqs-boss-guide-31490");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-fossil-roo");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.journey-to-outer-continent")
    ?.sections.find((entry) => entry.id === "fossil-roo-entrance-and-lani");
  const prepStepIndex = section?.steps.findIndex((entry) => entry.id === "fossil-roo-prepare") ?? -1;
  const fightStepIndex = section?.steps.findIndex((entry) => entry.id === "fossil-roo-lani-steals") ?? -1;
  const fightStep = section?.steps.find((entry) => entry.id === "fossil-roo-lani-steals");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 19);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 19 is Lani's enemy stat/);
  assert.match(guidance.levelRationale, /no standard party-level target/);
  assert.match(guidance.difficultyAssessment ?? "", /GameFAQs boss guide calls Lani Medium/);
  assert.match(guidance.difficultyAssessment ?? "", /Gamer Guides describes her as tough/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective/);
  assert.match(guidance.optionalGrinding, /gives a party-level target/);
  assert.match(guidance.optionalGrinding, /Excalibur II timer plan/);
  assert.match(guidance.setupAdvice, /Dagger's HP/);
  assert.match(guidance.setupAdvice, /Chemist and Auto-Potion/);
  assert.match(guidance.setupAdvice, /Reflect/);
  assert.match(guidance.setupAdvice, /White Wind/);
  assert.match(guidance.setupAdvice, /Magic Hammer/);
  assert.ok(guidance.sourceIds.includes("gamefaqs-boss-guide-31490"));
  assert.ok(guidance.sourceIds.includes("gamerguides-fossil-roo"));
  assert.ok(guidance.sourceIds.every((id) => sources.some((source) => source.id === id)));
  assert.ok(gamefaqsBossGuide);
  assert.match(gamerGuides?.notes ?? "", /calls the fight tough/);
  assert.match(gamerGuides?.notes ?? "", /no numeric party-level target/);
  assert.ok(section?.sourceIds.includes("gamefaqs-boss-guide-31490"));
  assert.ok(prepStepIndex >= 0 && fightStepIndex > prepStepIndex);
  assert.match(fightStep?.detail ?? "", /Medium while Gamer Guides calls it tough/);
  assert.match(fightStep?.detail ?? "", /Level 19 enemy stat is not a party target/);
});

test("Burmecia Beatrix preparation distinguishes disputed enemy stats and preserves survival and steal priorities", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.beatrix-burmecia");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-burmecia-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-burmecia");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-burmecia");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-1.burmecia")
    ?.sections.find((entry) => entry.id === "burmecia-beatrix-preparation");
  const prepStep = section?.steps.find((entry) => entry.id === "burmecia-palace-preparation");
  const fightStep = section?.steps.find((entry) => entry.id === "burmecia-beatrix-steals");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 14/);
  assert.match(guidance.levelRationale, /Level 16/);
  assert.match(guidance.levelRationale, /not party-level targets/);
  assert.match(guidance.difficultyAssessment ?? "", /Gamer Guides describes Beatrix as tough/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective single-source/);
  assert.match(guidance.optionalGrinding, /do not prescribe a party-level target/);
  assert.match(guidance.setupAdvice, /Coral Ring absorbs Thunder Slash/);
  assert.match(guidance.setupAdvice, /Silk Shirt halves lightning damage/);
  assert.match(guidance.setupAdvice, /Vivi try Slow/);
  assert.match(guidance.setupAdvice, /Common Phoenix Down and Uncommon Chain Plate/);
  assert.match(guidance.setupAdvice, /Rare Mythril Sword is optional/);
  assert.match(guidance.setupAdvice, /tenth turn or at 0 HP/);
  assert.match(guidance.setupAdvice, /party at 1 HP/);
  assert.ok(["gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "cavesofnarshe-enemies"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /tenth turn or 0 HP/);
  assert.match(jegged?.notes ?? "", /Coral Ring\/Silk Shirt lightning protection/);
  assert.match(gamerGuides?.notes ?? "", /subjective route language/);
  assert.ok(section?.sourceIds.includes("gamefaqs-burmecia-71891"));
  assert.ok(section?.sourceIds.includes("jegged-burmecia"));
  assert.match(prepStep?.text ?? "", /Coral Ring/);
  assert.match(prepStep?.detail ?? "", /enemy stats, not party targets/);
  assert.match(fightStep?.text ?? "", /Vivi try Slow/);
  assert.match(fightStep?.text ?? "", /Common Phoenix Down and Uncommon Chain Plate/);
});

test("Black Waltz 3's Summit Station guidance accounts for the rematch party and Freeze", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.black-waltz-3-rematch");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-journey-to-treno-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-summit-station");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-summit-station");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.journey-to-treno")
    ?.sections.find((entry) => entry.id === "journey-treno-black-waltz-3");
  const prepStep = section?.steps.find((entry) => entry.id === "journey-treno-black-waltz-3-preparation");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 9);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 9 is Black Waltz 3's enemy stat/);
  assert.match(guidance.levelRationale, /do not recommend a party level/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective route assessments/);
  assert.match(guidance.optionalGrinding, /prescribes extra grinding/);
  assert.match(guidance.setupAdvice, /Dagger, Steiner, and Marcus/);
  assert.match(guidance.setupAdvice, /Black Waltz 3 does not target Dagger/);
  assert.match(guidance.setupAdvice, /Freeze prevents actions/);
  assert.match(guidance.setupAdvice, /physical hit while it remains active instantly KOs/);
  assert.match(guidance.setupAdvice, /wait for it to clear or use a Remedy/);
  assert.match(guidance.setupAdvice, /Darkness\/Blind/);
  assert.match(guidance.setupAdvice, /Marcus to try for Steepled Hat and Lightning Staff/);
  assert.match(guidance.setupAdvice, /Flame Staff if the early copy matters/);
  assert.ok(["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station", "strategywiki-summit-station"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /Freeze's physical-hit KO risk/);
  assert.match(jegged?.notes ?? "", /without setting a party-level target/);
  assert.match(gamerGuides?.notes ?? "", /Dagger should Shell and heal Steiner\/Marcus/);
  assert.ok(section?.sourceIds.includes("gamefaqs-journey-to-treno-71891"));
  assert.ok(section?.sourceIds.includes("strategywiki-summit-station"));
  assert.match(prepStep?.text ?? "", /save and heal before boarding/);
  assert.match(prepStep?.text ?? "", /Marcus providing Steal/);
  assert.match(prepStep?.detail ?? "", /Level 9 is Black Waltz 3's enemy stat, not a party target/);
  assert.match(prepStep?.detail ?? "", /avoid physical attacks on a frozen character/);
});

test("Festival Zaghnol preparation separates enemy level from the timed winner route", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.zaghnol-hunt");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-hunt-minigame-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-lindblum");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-1.lindblum")
    ?.sections.find((entry) => entry.id === "lindblum-telescope-festival");
  const prepStep = section?.steps.find((entry) => entry.id === "lindblum-festival-preparation");
  const fightStep = section?.steps.find((entry) => entry.id === "lindblum-festival-zaghnol");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 9);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 9 is Zaghnol's Hunt enemy stat/);
  assert.match(guidance.levelRationale, /not a party-level recommendation/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective, single-source/);
  assert.match(guidance.optionalGrinding, /12-minute Festival/);
  assert.match(guidance.setupAdvice, /Bandit and Beast Killer/);
  assert.match(guidance.setupAdvice, /Jump or healing while Zidane steals/);
  assert.match(guidance.setupAdvice, /about 4:30 left/);
  assert.match(guidance.setupAdvice, /Mythril Gloves and Needle Fork/);
  assert.match(guidance.setupAdvice, /weak to Water and halves Lightning/);
  assert.match(guidance.setupAdvice, /Zidane KO himself so Freya can land the final hit/);
  assert.match(guidance.setupAdvice, /KO Zidane and Freya/);
  assert.ok(guidance.sourceIds.includes("gamefaqs-hunt-minigame-71891"));
  assert.ok(guidance.sourceIds.includes("cavesofnarshe-hunt-enemies"));
  assert.ok(enemy.sourceIds.includes("jegged-lindblum"));
  assert.match(gamefaqs?.notes ?? "", /Level 9 row is the enemy stat/);
  assert.match(jegged?.notes ?? "", /no normal party-level recommendation/);
  assert.ok(section?.sourceIds.includes("gamefaqs-hunt-minigame-71891"));
  assert.match(prepStep?.text ?? "", /Bandit and Beast Killer/);
  assert.match(prepStep?.detail ?? "", /Level 9 is Zaghnol's enemy stat/);
  assert.match(fightStep?.detail ?? "", /weak to Water/);
  assert.match(fightStep?.detail ?? "", /Freya can Jump or heal/);
  assert.match(fightStep?.detail ?? "", /GameFAQs says Zidane usually needs to be KO/);
});
