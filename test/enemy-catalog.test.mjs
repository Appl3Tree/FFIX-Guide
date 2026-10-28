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
