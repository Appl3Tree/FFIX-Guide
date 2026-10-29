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

test("Earth Guardian preparation equips Zidane and Quina without inferring a party level", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.earth-guardian");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-breaking-the-seal-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-four-shrines-terra");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.breaking-the-seal");
  const recovery = chapter?.sections.find((entry) => entry.id === "breaking-seal-recovery");
  const restorationStep = recovery?.steps.find((entry) => entry.id === "breaking-seal-restore-weapons");
  const shrine = chapter?.sections.find((entry) => entry.id === "breaking-seal-earth-shrine");
  const landingStep = shrine?.steps.find((entry) => entry.id === "breaking-seal-earth-shrine-landing");
  const mirrorStep = shrine?.steps.find((entry) => entry.id === "breaking-seal-earth-mirror");
  const fight = chapter?.sections.find((entry) => entry.id === "breaking-seal-earth-guardian");
  const stealsStep = fight?.steps.find((entry) => entry.id === "breaking-seal-earth-guardian-steals");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 54);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 54 is the boss's stat/);
  assert.match(guidance.levelRationale, /no normal-party level target/);
  assert.match(guidance.optionalGrinding, /No reviewed route prescribes extra battles or a grind target/);
  assert.match(guidance.optionalGrinding, /awards 0 EXP/);
  assert.match(guidance.setupAdvice, /restore normal weapons/);
  assert.match(guidance.setupAdvice, /Gaia Gear, Circlet, Feather Boots, or Auto-Float/);
  assert.match(guidance.setupAdvice, /Auto-Reflect/);
  assert.match(guidance.setupAdvice, /Insomniac if using Quina's Night/);
  assert.match(guidance.setupAdvice, /Devil Killer/);
  assert.match(guidance.setupAdvice, /White Wind, Mighty Guard, and Bad Breath/);
  assert.match(guidance.setupAdvice, /Magic Hammer/);
  assert.match(guidance.setupAdvice, /Avenger and Rubber Suit steals/);
  assert.match(guidance.setupAdvice, /avoid Earth \(absorbed\)/);
  assert.match(guidance.setupAdvice, /Earth Shake/);
  assert.ok(["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /Magic Hammer as a way to stop the -ga spells/);
  assert.match(jegged?.notes ?? "", /Mighty Guard, White Wind, and Bad Breath/);
  assert.match(restorationStep?.detail ?? "", /do not set a party-level target/);
  assert.match(landingStep?.text ?? "", /Gaia Gear, Circlet, Feather Boots, or Auto-Float/);
  assert.match(landingStep?.detail ?? "", /Magic Hammer can disrupt/);
  assert.match(mirrorStep?.detail ?? "", /both item types have later recovery routes/);
  assert.match(stealsStep?.detail ?? "", /Auto-Reflect can blunt them/);
});

test("Taharka preparation preserves Ipsen's inverted weapon rule and source-specific Orichalcon labels", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.taharka");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-ipsens-castle-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-ipsens-castle");
  const eliteGrindLab = sources.find((entry) => entry.id === "elitegrindlab-ipsens-castle");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.ipsens-castle");
  const mural = chapter?.sections.find((entry) => entry.id === "ipsens-mirrors-and-taharka");
  const prepStep = mural?.steps.find((entry) => entry.id === "ipsens-four-mirrors");
  const fightStep = mural?.steps.find((entry) => entry.id === "ipsens-taharka");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 46);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 46 is Taharka's enemy stat/);
  assert.match(guidance.levelRationale, /do not establish a normal-party level target/);
  assert.match(guidance.difficultyAssessment ?? "", /reasonably difficult without status control/);
  assert.match(guidance.difficultyAssessment ?? "", /Jegged calls it an easy fight/);
  assert.match(guidance.optionalGrinding, /No reviewed source recommends a party-level target/);
  assert.match(guidance.optionalGrinding, /Everyone's Grudge scales with total Tonberries killed/);
  assert.match(guidance.optionalGrinding, /Taharka itself awards 0 EXP/);
  assert.match(guidance.setupAdvice, /normal Attack-command damage improves with weaker weapons/);
  assert.match(guidance.setupAdvice, /magic and abilities ignore that inversion/);
  assert.match(guidance.setupAdvice, /Freya's Jump/);
  assert.match(guidance.setupAdvice, /attempt Elixir, Mythril Claws, and Orichalcon/);
  assert.match(guidance.setupAdvice, /Master Thief can help if learned/);
  assert.match(guidance.setupAdvice, /GameFAQs and RPGClassics label Orichalcon Semi-Rare/);
  assert.match(guidance.setupAdvice, /Jegged calls it Rare/);
  assert.match(guidance.setupAdvice, /Mustard Bomb or Add Status/);
  assert.match(guidance.setupAdvice, /use it only after the selected steals/);
  assert.match(guidance.setupAdvice, /exploit Fire or Wind and avoid Earth, which is nullified/);
  assert.match(enemy.notes.join(" "), /no rate is normalized/);
  assert.ok(["gamefaqs-ipsens-castle-71891", "jegged-ipsens-castle", "elitegrindlab-ipsens-castle", "rpgclassics-bestiary-t-z"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /abilities and magic keep normal damage/);
  assert.match(jegged?.notes ?? "", /calls Orichalcon Rare and reports 6% per connected attempt/);
  assert.match(eliteGrindLab?.notes ?? "", /warns not to farm Tonberries/);
  assert.match(prepStep?.detail ?? "", /No reviewed source gives a party-level target/);
  assert.match(fightStep?.text ?? "", /Common Elixir, Uncommon Mythril Claws, and Semi-Rare Orichalcon/);
  assert.match(fightStep?.detail ?? "", /wait until after selected steals/);
  assert.match(fightStep?.detail ?? "", /all three item types have later sources/);
});

test("Amdusias preparation preserves Pandemonium's forced solo opening and source-specific records", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.amdusias-fixed");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-portal-to-another-world-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-pandemonium");
  const eliteGrindLab = sources.find((entry) => entry.id === "elitegrindlab-pandemonium");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const branBal = chapter?.sections.find((entry) => entry.id === "portal-bran-bal-ates-gate");
  const prepStep = branBal?.steps.find((entry) => entry.id === "portal-bran-bal-final-sweep");
  const pandemonium = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-mind-control");
  const fightStep = pandemonium?.steps.find((entry) => entry.id === "portal-pandemonium-amdusias");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level" && entry.value === 54)?.verification, "disputed");
  assert.equal(enemy.stats.find((entry) => entry.field === "level" && entry.value === 42)?.verification, "disputed");
  assert.equal(enemy.stats.find((entry) => entry.field === "HP" && entry.value === 10926)?.verification, "disputed");
  assert.equal(enemy.stats.find((entry) => entry.field === "HP" && entry.value === 20926)?.verification, "disputed");
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /GameFAQs, while Jegged prints Level 42/);
  assert.match(guidance.levelRationale, /Neither source sets a party-level target/);
  assert.match(guidance.difficultyAssessment ?? "", /Zidane begins alone/);
  assert.match(guidance.optionalGrinding, /No reviewed source gives an Amdusias-specific party-level or grind target/);
  assert.match(guidance.optionalGrinding, /prepare in Bran Bal/);
  assert.match(guidance.setupAdvice, /Lightning reduction against Thundara and Antibody against Bio/);
  assert.match(guidance.setupAdvice, /defend or heal as needed until Freya and Amarant join/);
  assert.match(guidance.setupAdvice, /Freya can Jump, Zidane can attack, and Amarant can use support or attack/);
  assert.match(guidance.setupAdvice, /weak to Wind and nullifies Earth/);
  assert.match(guidance.setupAdvice, /GameFAQs assigns Common Tent\/Uncommon Ether/);
  assert.match(guidance.setupAdvice, /Jegged reverses those items/);
  assert.match(enemy.notes.join(" "), /Level 54 and 10,926 HP/);
  assert.match(enemy.notes.join(" "), /Level 42 and 20,926 HP/);
  assert.ok(["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /Common Tent and Uncommon Ether/);
  assert.match(jegged?.notes ?? "", /Level 42 and 20,926 HP/);
  assert.match(jegged?.notes ?? "", /reverses GameFAQs' Tent\/Ether steal slots/);
  assert.match(eliteGrindLab?.notes ?? "", /no shop or equipment change between them/);
  assert.match(prepStep?.detail ?? "", /fixed fights run consecutively without an equipment-change break/);
  assert.match(fightStep?.text ?? "", /with Zidane alone/);
  assert.match(fightStep?.detail ?? "", /no party-level target is inferred/);
});

test("Abadon preparation preserves the scripted party opening and random-form record boundary", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.abadon-fixed");
  const guidance = enemy?.preparationGuidance;
  const gamefaqsStory = sources.find((entry) => entry.id === "gamefaqs-portal-to-another-world-71891");
  const gamefaqsBattleGuide = sources.find((entry) => entry.id === "gamefaqs-pandemonium-79143");
  const jegged = sources.find((entry) => entry.id === "jegged-pandemonium");
  const eliteGrindLab = sources.find((entry) => entry.id === "elitegrindlab-pandemonium");
  const flactem = sources.find((entry) => entry.id === "flactem-pandemonium");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const branBal = chapter?.sections.find((entry) => entry.id === "portal-bran-bal-ates-gate");
  const prepStep = branBal?.steps.find((entry) => entry.id === "portal-bran-bal-final-sweep");
  const pandemonium = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-mind-control");
  const fightStep = pandemonium?.steps.find((entry) => entry.id === "portal-pandemonium-abadon");

  assert.ok(enemy);
  assert.ok(guidance);
  for (const [field, value] of [["level", 54], ["level", 58], ["HP", 10926], ["HP", 12658]]) {
    assert.equal(enemy.stats.find((entry) => entry.field === field && entry.value === value)?.verification, "disputed");
  }
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /GameFAQs' story walkthrough lists Level 54 and 10,926 HP/);
  assert.match(guidance.levelRationale, /matching the separate random Abadon \[B\] record/);
  assert.match(guidance.levelRationale, /None of these figures is a party-level target/);
  assert.match(guidance.difficultyAssessment ?? "", /High Wind damages the whole party heavily/);
  assert.match(guidance.optionalGrinding, /No reviewed route sets an Abadon-specific party-level target/);
  assert.match(guidance.setupAdvice, /Coral Rings on Steiner and Quina to absorb Thundaga/);
  assert.match(guidance.setupAdvice, /Defend for the first two enemy turns/);
  assert.match(guidance.setupAdvice, /High Wind hits the entire party hard/);
  assert.match(guidance.setupAdvice, /White Wind or Mighty Guard if learned/);
  assert.match(guidance.setupAdvice, /keep everyone alive without taking dangerous extra turns/);
  assert.match(guidance.setupAdvice, /Quina cannot Eat this scripted form for Twister/);
  assert.match(guidance.setupAdvice, /GameFAQs lists Vaccine and Ether steals/);
  assert.match(enemy.notes.join(" "), /Preserve both records/);
  assert.ok(["gamefaqs-portal-to-another-world-71891", "gamefaqs-pandemonium-79143", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqsStory?.notes ?? "", /For fixed Abadon it reports Level 54, 10,926 HP/);
  assert.match(gamefaqsBattleGuide?.notes ?? "", /defending with Steiner and Quina for two turns/);
  assert.match(jegged?.notes ?? "", /Level 58\/12,658 HP/);
  assert.match(eliteGrindLab?.notes ?? "", /does not claim that this resolves the scripted encounter's identity/);
  assert.match(flactem?.notes ?? "", /scripted Abadon during You're Not Alone cannot be eaten/);
  assert.match(prepStep?.detail ?? "", /Coral Rings on Steiner and Quina can absorb Abadon's Thundaga/);
  assert.match(fightStep?.text ?? "", /Zidane joins after Abadon's second turn/);
  assert.match(fightStep?.detail ?? "", /No party-level target is inferred/);
});

test("fixed Shell Dragon does not claim Quina's Earth Shake Eat opportunity", () => {
  const fixed = enemyRecords.find((entry) => entry.id === "enemy.shell-dragon-fixed");
  const random = enemyRecords.find((entry) => entry.id === "enemy.shell-dragon-b");
  const fixedEncounter = enemyEncounters.find((entry) => entry.id === "encounter.pandemonium.fixed-shell-dragon");
  const randomPool = enemyEncounters.find((entry) => entry.id === "encounter.pandemonium.random-pool");
  const oldGameFaqs = sources.find((entry) => entry.id === "gamefaqs-pandemonium-29957");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const mindControl = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-mind-control");
  const fightStep = mindControl?.steps.find((entry) => entry.id === "portal-pandemonium-shell-dragon");
  const maze = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-maze-treasures");
  const blueMagicStep = maze?.steps.find((entry) => entry.id === "portal-pandemonium-blue-magic");
  const objectiveId = "disc-3.portal-to-another-world.pandemonium-blue-magic";

  assert.ok(fixed);
  assert.ok(random);
  assert.ok(fixedEncounter);
  assert.ok(randomPool);
  assert.ok(oldGameFaqs);
  assert.deepEqual(fixed.blueMagic, []);
  assert.ok(!fixed.routeObjectiveIds.includes(objectiveId));
  assert.ok(!fixedEncounter.objectiveIds.includes(objectiveId));
  assert.ok(fixedEncounter.objectiveIds.includes("disc-3.portal-to-another-world.pandemonium-climax"));
  assert.ok(random.blueMagic.some((skill) => skill.name === "Earth Shake" && skill.objectiveIds.includes(objectiveId)));
  assert.ok(random.routeObjectiveIds.includes(objectiveId));
  assert.ok(randomPool.formation.some((member) => member.enemyId === "enemy.shell-dragon-b"));
  assert.ok(randomPool.objectiveIds.includes(objectiveId));
  for (const [field, value] of [["HP", 10921], ["HP", 12500], ["HP", 20921]]) {
    assert.equal(fixed.stats.find((entry) => entry.field === field && entry.value === value)?.verification, "disputed");
  }
  assert.equal(fixed.preparationGuidance?.suggestedLevelRange, undefined);
  assert.match(fixed.preparationGuidance?.levelRationale ?? "", /optional, source-specific benchmark/);
  assert.match(fixed.preparationGuidance?.setupAdvice ?? "", /Feather Boots absorb Earth Shake/);
  assert.match(fixed.preparationGuidance?.setupAdvice ?? "", /do not enable Auto-Float/);
  assert.ok(fixed.sourceIds.includes("gamefaqs-pandemonium-29957"));
  assert.match(fixed.notes.join(" "), /Quina is absent and cannot Eat this version/);
  assert.match(oldGameFaqs.notes, /12,500 HP/);
  assert.match(oldGameFaqs.notes, /Phoenix Pinion, Tent, Hi-Potion, and Vaccine/);
  assert.match(fightStep?.detail ?? "", /cannot Eat this Shell Dragon/);
  assert.ok(!fightStep?.objectiveIds.includes(objectiveId));
  assert.match(blueMagicStep?.text ?? "", /random Shell Dragon \[B\]/);
  assert.match(blueMagicStep?.detail ?? "", /fixed Shell Dragon story fights are not/);
});

test("Silver Dragon preparation separates its Level 58 stat from party level and covers the whole sequence", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.silver-dragon");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.pandemonium.silver-dragon");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const prepSection = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-maze-treasures");
  const bossSection = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-final-bosses");
  const prepStep = prepSection?.steps.find((entry) => entry.id === "portal-pandemonium-boss-prep");
  const fightStep = bossSection?.steps.find((entry) => entry.id === "portal-pandemonium-silver-dragon");
  const guidance = enemy?.preparationGuidance;
  const sourceIds = ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];

  assert.ok(enemy);
  assert.ok(encounter);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 58);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 58 as Silver Dragon's enemy stat/);
  assert.match(guidance.levelRationale, /neither sets a party-level target/);
  assert.match(guidance.optionalGrinding, /No reviewed route sets a Silver Dragon party-level or grinding target/);
  assert.match(guidance.setupAdvice, /At Mozme, save, use a Tent, select the party/);
  assert.match(guidance.setupAdvice, /Wind resistance reduces Twister and Aerial Slash/);
  assert.match(guidance.setupAdvice, /Locomotion protects against Garland's Stop/);
  assert.match(guidance.setupAdvice, /Give Zidane Bandit and Master Thief/);
  assert.match(guidance.setupAdvice, /Freya's Dragon Killer and Reis's Wind/);
  assert.match(guidance.setupAdvice, /Do not equip Auto-Reflect/);
  assert.match(guidance.setupAdvice, /Flactem lists Auto-Reflect among its general setup suggestions/);
  assert.match(guidance.setupAdvice, /Silence, Darkness\/Blind, Sleep, and Slow/);
  assert.match(guidance.setupAdvice, /weak to Ice and Wind and nullifies Earth/);
  for (const [value, sourceId] of [[24056, sourceIds[0]], [24055, sourceIds[1]], [34055, sourceIds[2]]]) {
    assert.equal(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.verification, "disputed");
    assert.ok(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.sourceIds.includes(sourceId));
  }
  assert.ok(encounter.sourceIds.includes("flactem-pandemonium"));
  assert.match(prepStep?.detail ?? "", /leave Auto-Reflect off for the whole sequence/);
  assert.match(fightStep?.detail ?? "", /Level 58 is the enemy stat, not a party-level target/);
  for (const sourceId of sourceIds) {
    assert.ok(guidance.sourceIds.includes(sourceId));
    assert.ok(enemy.sourceIds.includes(sourceId));
    assert.ok(sources.some((source) => source.id === sourceId));
  }
});

test("Garland preparation separates its Level 62 stat from party level and prioritizes Silence", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.garland");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.pandemonium.garland");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const prepStep = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-maze-treasures")
    ?.steps.find((entry) => entry.id === "portal-pandemonium-boss-prep");
  const fightStep = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-final-bosses")
    ?.steps.find((entry) => entry.id === "portal-pandemonium-garland");
  const guidance = enemy?.preparationGuidance;
  const sourceIds = ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];

  assert.ok(enemy);
  assert.ok(encounter);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 62);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 62 as Garland's enemy stat/);
  assert.match(guidance.levelRationale, /neither sets a party-level target/);
  assert.match(guidance.optionalGrinding, /good optional grinding location/);
  assert.match(guidance.optionalGrinding, /no reviewed source sets a Garland party-level target/);
  assert.match(guidance.setupAdvice, /prioritize Silence to suppress Flare and Stop/);
  assert.match(guidance.setupAdvice, /Locomotion to block Garland's Stop/);
  assert.match(guidance.setupAdvice, /Darkness can make Wave miss more often/);
  assert.match(guidance.setupAdvice, /no listed elemental weakness/);
  assert.match(guidance.setupAdvice, /Bandit and Master Thief/);
  assert.match(guidance.setupAdvice, /leave Auto-Reflect off for Kuja/);
  for (const [value, sourceId] of [[40729, sourceIds[0]], [40728, sourceIds[1]], [50728, sourceIds[2]]]) {
    assert.equal(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.verification, "disputed");
    assert.ok(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.sourceIds.includes(sourceId));
  }
  assert.ok(encounter.sourceIds.includes("flactem-pandemonium"));
  assert.match(prepStep?.detail ?? "", /leave Auto-Reflect off for the whole sequence/);
  assert.match(fightStep?.text ?? "", /prioritize Silence to suppress Flare and Stop/);
  assert.match(fightStep?.detail ?? "", /Level 62 is an enemy stat, not a party-level target/);
  for (const sourceId of sourceIds) {
    assert.ok(guidance.sourceIds.includes(sourceId));
    assert.ok(enemy.sourceIds.includes(sourceId));
    assert.ok(sources.some((source) => source.id === sourceId));
  }
});

test("Kuja preparation blocks Reflect and zero-MP Flare Star triggers without inventing a party level", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.kuja");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.pandemonium.kuja");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-3.portal-to-another-world");
  const prepStep = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-maze-treasures")
    ?.steps.find((entry) => entry.id === "portal-pandemonium-boss-prep");
  const fightStep = chapter?.sections.find((entry) => entry.id === "portal-pandemonium-final-bosses")
    ?.steps.find((entry) => entry.id === "portal-pandemonium-kuja");
  const guidance = enemy?.preparationGuidance;
  const sourceIds = ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];

  assert.ok(enemy);
  assert.ok(encounter);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 64);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 64 as Kuja's enemy stat/);
  assert.match(guidance.levelRationale, /neither sets a party-level target/);
  assert.match(guidance.optionalGrinding, /no reviewed source sets a Kuja party-level target/);
  assert.match(guidance.setupAdvice, /use Shell to reduce his magic damage/);
  assert.match(guidance.setupAdvice, /do not cast Reflect, use Carbuncle's Reflect effect, or reduce his MP to zero/);
  assert.match(guidance.setupAdvice, /repeated Flare Star/);
  assert.match(guidance.setupAdvice, /Ether, Carabini Mail, and the rare Light Robe/);
  assert.match(guidance.setupAdvice, /scripted Ultima reduces the party to 1 HP/);
  for (const [value, sourceId] of [[42383, sourceIds[0]], [42382, sourceIds[1]], [52382, sourceIds[2]]]) {
    assert.equal(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.verification, "disputed");
    assert.ok(enemy.stats.find((entry) => entry.field === "HP" && entry.value === value)?.sourceIds.includes(sourceId));
  }
  assert.ok(encounter.sourceIds.includes("flactem-pandemonium"));
  assert.match(prepStep?.detail ?? "", /leave Auto-Reflect off for the whole sequence/);
  assert.match(fightStep?.text ?? "", /do not use Reflect\/Carbuncle or reduce his MP to zero/i);
  assert.match(fightStep?.detail ?? "", /Level 64 is an enemy stat, not a party-level target/);
  for (const sourceId of sourceIds) {
    assert.ok(guidance.sourceIds.includes(sourceId));
    assert.ok(enemy.sourceIds.includes(sourceId));
    assert.ok(sources.some((source) => source.id === sourceId));
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

test("Opening Masked Man preparation covers the forced tutorial and source-backed steals", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.masked-man-opening");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-alexandria-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-prima-vista");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-1.alexandria")
    ?.sections.find((entry) => entry.id === "tantalus-opening");
  const prepStep = section?.steps.find((entry) => entry.id === "masked-man-preparation");
  const stealStep = section?.steps.find((entry) => entry.id === "masked-man-steals");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 1);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 1 is the Masked Man's enemy stat/);
  assert.match(guidance.levelRationale, /no party-level recommendation/);
  assert.match(guidance.difficultyAssessment ?? "", /subjective route assessment/);
  assert.match(guidance.optionalGrinding, /No grinding is possible/);
  assert.match(guidance.optionalGrinding, /no EXP or AP/);
  assert.match(guidance.setupAdvice, /collect the room's 47 Gil and Potion/);
  assert.match(guidance.setupAdvice, /All four characters have Steal/);
  assert.match(guidance.setupAdvice, /Potion, Wrist, and Mage Masher/);
  assert.match(guidance.setupAdvice, /Ow/);
  assert.match(guidance.setupAdvice, /188/);
  assert.match(guidance.setupAdvice, /160/);
  assert.ok(["gamefaqs-alexandria-71891", "jegged-prima-vista", "rpgclassics-primavista"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /all four party members can steal/);
  assert.match(jegged?.notes ?? "", /Level 1, 188 HP/);
  assert.ok(section?.sourceIds.includes("jegged-prima-vista"));
  assert.match(prepStep?.text ?? "", /no party-level target/);
  assert.match(prepStep?.detail ?? "", /older FAQ lists 160/);
  assert.match(stealStep?.text ?? "", /all four characters can attempt steals/);
});

test("Crash Site Baku preparation keeps the solo duel, level guidance, and steal conflicts scoped", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.baku-crash-site");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-evil-forest-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-evil-forest");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-1.evil-forest")
    ?.sections.find((entry) => entry.id === "prima-vista-wreckage");
  const fightStep = section?.steps.find((entry) => entry.id === "baku-wreckage-fight");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 2);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 2 is Baku's enemy stat/);
  assert.match(guidance.levelRationale, /no party-level recommendation/);
  assert.match(guidance.levelRationale, /Plant Brain, not Baku/);
  assert.match(guidance.optionalGrinding, /0 EXP, AP, and Gil/);
  assert.match(guidance.setupAdvice, /Potion from the chest/);
  assert.match(guidance.setupAdvice, /Mage Masher/);
  assert.match(guidance.setupAdvice, /60 HP/);
  assert.match(guidance.setupAdvice, /no Fire caster/);
  assert.ok(["gamefaqs-evil-forest-71891", "jegged-evil-forest", "gamefaqs-walkthrough-15690"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /solo Zidane/);
  assert.match(jegged?.notes ?? "", /Rare Iron Sword \(6%\) per connected steal attempt/);
  assert.match(fightStep?.text ?? "", /Fight Baku alone as Zidane/);
  assert.match(fightStep?.detail ?? "", /Level 2 is Baku's enemy stat, not a party target/);
  assert.match(fightStep?.detail ?? "", /older FAQ estimates about 160/);
  assert.match(fightStep?.detail ?? "", /Jegged reports Rare at 6%/);
});

test("Treno Griffin preparation keeps the enemy stat separate from optional Steiner benchmarks", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.griffin-treno-arena");
  const guidance = enemy?.preparationGuidance;
  const olderGameFAQs = sources.find((entry) => entry.id === "gamefaqs-boss-guide-37182");
  const jegged = sources.find((entry) => entry.id === "jegged-treno");
  const vgr = sources.find((entry) => entry.id === "vgr-no-spoiler-walkthrough");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.treno")
    ?.sections.find((entry) => entry.id === "treno-city-pickups-and-mognet");
  const fightStep = section?.steps.find((entry) => entry.id === "treno-griffin-arena");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 16);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 16 is the arena Griffin's enemy stat/);
  assert.match(guidance.levelRationale, /optional PlayStation benchmark/);
  assert.match(guidance.levelRationale, /Disc I/);
  assert.match(guidance.optionalGrinding, /No reviewed route establishes a required party level/);
  assert.match(guidance.optionalGrinding, /lower levels/);
  assert.match(guidance.setupAdvice, /Blood Sword/);
  assert.match(guidance.setupAdvice, /Gold Choker/);
  assert.match(guidance.setupAdvice, /Bird Killer/);
  assert.match(guidance.setupAdvice, /Auto-Reflect does not block Aero or Aera/);
  assert.match(guidance.setupAdvice, /Quina's Twister/);
  assert.ok(["gamefaqs-boss-guide-37182", "jegged-treno", "rpgclassics-treno-monsters", "vgr-no-spoiler-walkthrough"]
    .every((id) => guidance.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(olderGameFAQs?.notes ?? "", /Level 15–16/);
  assert.match(olderGameFAQs?.notes ?? "", /labels the Knight's House Griffin Disc I/);
  assert.match(jegged?.notes ?? "", /two or three hits even at lower levels/);
  assert.match(vgr?.notes ?? "", /Auto-Reflect does not block the spells/);
  assert.match(fightStep?.text ?? "", /choose one active fighter/);
  assert.match(fightStep?.detail ?? "", /Level 16 is the arena Griffin's enemy stat/);
  assert.match(fightStep?.detail ?? "", /Level 15–16 Steiner/);
  assert.match(fightStep?.detail ?? "", /Aero\/Aera can still KO the fighter/);
  assert.ok(section?.sourceIds.includes("gamefaqs-boss-guide-37182"));
  assert.ok(section?.sourceIds.includes("vgr-no-spoiler-walkthrough"));
});

test("Scarlet Hair preparation keeps Zidane's level open and preserves the movement-timing disagreement", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.scarlet-hair");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-return-to-madain-sari-71891");
  const jegged = sources.find((entry) => entry.id === "jegged-return-to-madain-sari");
  const gamerGuides = sources.find((entry) => entry.id === "gamerguides-revisiting-madain-sari");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-2.return-to-madain-sari")
    ?.sections.find((entry) => entry.id === "return-madain-scarlet-hair");
  const fightStep = section?.steps.find((entry) => entry.id === "return-madain-scarlet-steals");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 22);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.equal(guidance.confidence, "disputed");
  assert.match(guidance.levelRationale, /Level 22 is Scarlet Hair's enemy stat, not a Zidane target/);
  assert.match(guidance.levelRationale, /do not establish a required or recommended party-level range/);
  assert.match(guidance.optionalGrinding, /No reviewed standard route prescribes extra battles/);
  assert.match(guidance.setupAdvice, /Morrison's free healing/);
  assert.match(guidance.setupAdvice, /Man Eater and Counter if learned/);
  assert.match(guidance.setupAdvice, /Auto-Haste only if it fits/);
  assert.match(guidance.setupAdvice, /Common Ether and Uncommon Poison Knuckles/);
  assert.match(guidance.setupAdvice, /Gamer Guides recommends waiting/);
  assert.match(guidance.setupAdvice, /Jegged says attacks can still hit/);
  assert.ok(["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /equipping Man Eater and Counter/);
  assert.match(jegged?.notes ?? "", /Zidane can still hit it/);
  assert.match(gamerGuides?.notes ?? "", /waiting for “Here I go”/);
  assert.match(fightStep?.text ?? "", /while Jegged says attacks can still hit/);
  assert.match(fightStep?.detail ?? "", /no exact HP or turn count/);
});

test("Quale preparation keeps the 99-frog trigger optional and records sourced countermeasures", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.quale");
  const guidance = enemy?.preparationGuidance;
  const gamefaqs = sources.find((entry) => entry.id === "gamefaqs-frog-catching-71891");
  const eliteGrindLab = sources.find((entry) => entry.id === "elitegrindlab-qus-marsh");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-4.return-to-gaia");
  const frogStep = chapter?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "gaia-return-frog-catching");

  assert.ok(enemy);
  assert.ok(guidance);
  assert.equal(enemy.stats.find((entry) => entry.field === "level")?.value, 76);
  assert.equal(guidance.suggestedLevelRange, undefined);
  assert.match(guidance.levelRationale, /Level 76 is Quale's enemy stat/);
  assert.match(guidance.levelRationale, /no party-level target is inferred/);
  assert.match(guidance.optionalGrinding, /Stop at 98 frogs/);
  assert.match(guidance.optionalGrinding, /not a game restriction/);
  assert.match(guidance.setupAdvice, /Water-resistant gear/);
  assert.match(guidance.setupAdvice, /Antibody, Clear Headed, Loudmouth, and Accuracy\+/);
  assert.match(guidance.setupAdvice, /Bandit and Master Thief/);
  assert.match(guidance.setupAdvice, /Quina ready with Magic Hammer/);
  assert.match(guidance.setupAdvice, /rare Robe of Lords/);
  assert.match(guidance.setupAdvice, /exploit Lightning and avoid Water/);
  assert.ok(["gamefaqs-frog-catching-71891", "elitegrindlab-qus-marsh"]
    .every((id) => guidance.sourceIds.includes(id) && enemy.sourceIds.includes(id) && sources.some((source) => source.id === id)));
  assert.match(gamefaqs?.notes ?? "", /saving at 98/);
  assert.match(eliteGrindLab?.notes ?? "", /Master Thief recommendation/);
  assert.match(frogStep?.text ?? "", /stop at 98 until ready/);
  assert.match(frogStep?.detail ?? "", /automatically starts Quale at whichever pond/);
  assert.match(frogStep?.detail ?? "", /planned route timing, not a game restriction/);
});

test("Prison Cage preparation prioritizes captive survival across the back-to-back forms", () => {
  const garnetEnemy = enemyRecords.find((entry) => entry.id === "enemy.prison-cage-garnet");
  const viviEnemy = enemyRecords.find((entry) => entry.id === "enemy.prison-cage-vivi");
  const garnetGuidance = garnetEnemy?.preparationGuidance;
  const viviGuidance = viviEnemy?.preparationGuidance;
  const jegged = sources.find((entry) => entry.id === "jegged-evil-forest");
  const section = walkthroughChapters.find((entry) => entry.areaId === "disc-1.evil-forest")
    ?.sections.find((entry) => entry.id === "crash-site-and-prison-cages");
  const garnetStep = section?.steps.find((entry) => entry.id === "prison-cage-garnet");
  const viviStep = section?.steps.find((entry) => entry.id === "prison-cage-vivi");

  assert.ok(garnetEnemy);
  assert.ok(viviEnemy);
  assert.ok(garnetGuidance);
  assert.ok(viviGuidance);
  assert.equal(garnetEnemy.stats.find((entry) => entry.field === "level")?.value, 2);
  assert.equal(viviEnemy.stats.find((entry) => entry.field === "level")?.value, 2);
  assert.equal(garnetGuidance.suggestedLevelRange, undefined);
  assert.equal(viviGuidance.suggestedLevelRange, undefined);
  assert.match(garnetGuidance.levelRationale, /Level 2 is this Prison Cage form's enemy stat/);
  assert.match(garnetGuidance.optionalGrinding, /Garnet's survival/);
  assert.match(garnetGuidance.setupAdvice, /enters Trance automatically/);
  assert.match(garnetGuidance.setupAdvice, /Free Energy/);
  assert.match(garnetGuidance.setupAdvice, /do not use Tidal Flame/);
  assert.match(garnetGuidance.setupAdvice, /[Aa]fter two Absorb attacks/);
  assert.match(garnetGuidance.setupAdvice, /Trance does not carry/);
  assert.equal(garnetGuidance.confidence, "partial");
  assert.match(viviGuidance.levelRationale, /Level 2 is the Prison Cage's enemy stat/);
  assert.match(viviGuidance.levelRationale, /513 or 533/);
  assert.match(viviGuidance.optionalGrinding, /starts immediately after the Garnet battle/);
  assert.match(viviGuidance.setupAdvice, /Vivi starts trapped and casts Fire/);
  assert.match(viviGuidance.setupAdvice, /Common Broadsword and Uncommon Leather Wrist/);
  assert.match(viviGuidance.setupAdvice, /Potion after two Absorb attacks/);
  assert.match(viviGuidance.setupAdvice, /533 by GameFAQs versus 513 by Jegged/);
  assert.equal(viviGuidance.confidence, "disputed");
  assert.ok(["gamefaqs-evil-forest-71891", "jegged-evil-forest"].every((id) =>
    garnetGuidance.sourceIds.includes(id) && viviGuidance.sourceIds.includes(id)));
  assert.match(jegged?.notes ?? "", /Lv\. 3–4 suggestion is for Plant Brain preparation, not the Prison Cage fights/);
  assert.ok(section?.sourceIds.includes("gamefaqs-evil-forest-71891"));
  assert.match(garnetStep?.detail ?? "", /[Uu]se a Potion after two Absorbs/);
  assert.match(garnetStep?.detail ?? "", /no party-level target/);
  assert.match(viviStep?.text ?? "", /no preparation pause/);
  assert.match(viviStep?.text ?? "", /after two Absorbs/);
  assert.match(viviStep?.detail ?? "", /70%\/23% per connected steal attempt/);
});
