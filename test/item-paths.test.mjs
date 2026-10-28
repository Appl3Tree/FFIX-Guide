import assert from "node:assert/strict";
import test from "node:test";
import { missables, objectives, sources } from "../src/data/guide.ts";
import { enemyEncounters, enemyRecords } from "../src/data/enemies.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage, sourceInventoryTargets } from "../src/data/items.ts";
import { synthesisRecipes } from "../src/data/synthesis.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

test("all one-time enemy loot paths link exact slots and encounters, preserving explicit conflicts", () => {
  const oneTimeLootPaths = itemAcquisitionPaths.filter((path) =>
    (path.method === "steal" || path.method === "drop") && path.availability === "one-time-encounter",
  );
  const documentedConflicts = new Map([
    ["item-path.disc-4.memoria.kraken-right-tentacle-wing-edge-steal", {
      enemyId: "enemy.kraken-right-tentacle",
      slot: "common",
      pathItemId: "game-item.wing-edge",
      normalizedSlotItemId: "game-item.elixir",
      sourceIds: ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary", "opatil-steal-list"],
    }],
  ]);
  const actualConflicts = [];

  assert.ok(oneTimeLootPaths.length > 0);
  for (const path of oneTimeLootPaths) {
    const enemy = enemyRecords.find((entry) => entry.id === path.enemyId);
    const lootTable = path.method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = lootTable?.find((entry) => entry.slot === path.enemyLootSlot);
    const conflict = documentedConflicts.get(path.id);

    assert.ok(enemy, `${path.id} links a registered enemy`);
    assert.ok(path.enemyLootSlot, `${path.id} links an exact loot slot`);
    assert.ok(lootSlot, `${path.id} slot exists in ${path.method} table`);
    assert.ok(path.encounterIds?.length, `${path.id} links at least one encounter`);
    for (const encounterId of path.encounterIds ?? []) {
      const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
      assert.ok(encounter, `${path.id} encounter ${encounterId} exists`);
      assert.ok(encounter?.formation.some((member) => member.enemyId === path.enemyId), `${path.id} enemy is present in ${encounterId}`);
    }
    for (const sourceId of path.sourceIds) assert.ok(sources.some((source) => source.id === sourceId), `${path.id} source ${sourceId} exists`);

    if (conflict) {
      actualConflicts.push(path.id);
      assert.equal(path.method, "steal");
      assert.equal(path.enemyId, conflict.enemyId);
      assert.equal(path.enemyLootSlot, conflict.slot);
      assert.equal(path.itemId, conflict.pathItemId);
      assert.equal(lootSlot?.itemId, conflict.normalizedSlotItemId);
      assert.match(path.conditions ?? "", /disputed/i);
      assert.match(path.notes ?? "", /disputed/i);
      assert.match(lootSlot?.note ?? "", /disputed/i);
      for (const sourceId of conflict.sourceIds) {
        assert.ok(path.sourceIds.includes(sourceId), `${path.id} cites conflict source ${sourceId}`);
        assert.ok(lootSlot?.sourceIds.includes(sourceId), `${path.id} slot cites conflict source ${sourceId}`);
      }
    } else {
      assert.equal(lootSlot?.itemId, path.itemId, `${path.id} item matches its normalized slot`);
    }
  }
  assert.deepEqual(actualConflicts.sort(), [...documentedConflicts.keys()].sort());
});

test("both Baku fights link each steal path to its exact enemy slot and encounter", () => {
  const expected = [
    { pathId: "item-path.disc-1.alexandria.masked-man-potion-steal", enemyId: "enemy.masked-man-opening", encounterId: "encounter.alexandria.masked-man-opening", itemId: "game-item.potion", slot: "common", objectiveId: "disc-1.alexandria.masked-man-steals" },
    { pathId: "item-path.disc-1.alexandria.masked-man-wrist-steal", enemyId: "enemy.masked-man-opening", encounterId: "encounter.alexandria.masked-man-opening", itemId: "game-item.wrist", slot: "uncommon", objectiveId: "disc-1.alexandria.masked-man-steals" },
    { pathId: "item-path.disc-1.alexandria.masked-man-mage-masher-steal", enemyId: "enemy.masked-man-opening", encounterId: "encounter.alexandria.masked-man-opening", itemId: "game-item.mage-masher", slot: "semi-rare", objectiveId: "disc-1.alexandria.masked-man-steals" },
    { pathId: "item-path.disc-1.evil-forest.baku-hi-potion-steal", enemyId: "enemy.baku-crash-site", encounterId: "encounter.evil-forest.baku-crash-site", itemId: "game-item.hi-potion", slot: "common", objectiveId: "disc-1.evil-forest.baku-steals" },
    { pathId: "item-path.disc-1.evil-forest.baku-iron-sword-steal", enemyId: "enemy.baku-crash-site", encounterId: "encounter.evil-forest.baku-crash-site", itemId: "game-item.iron-sword", slot: "uncommon", objectiveId: "disc-1.evil-forest.baku-steals" },
  ];

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const enemy = enemyRecords.find((entry) => entry.id === item.enemyId);
    const encounter = enemyEncounters.find((entry) => entry.id === item.encounterId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, item.enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [item.encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
  }
});

test("Prison Cage (Vivi) steals link exact slots and preserve their source-specific rates", () => {
  const expected = [
    {
      pathId: "item-path.disc-1.evil-forest.prison-cage-broadsword-steal",
      itemId: "game-item.broadsword",
      slot: "common",
      connectedAttemptRate: "70% per connected steal attempt",
      tableRate: "100%",
    },
    {
      pathId: "item-path.disc-1.evil-forest.leather-wrist-prison-cage-steal",
      itemId: "game-item.leather-wrist",
      slot: "uncommon",
      connectedAttemptRate: "23% per connected steal attempt",
      tableRate: "25%",
    },
  ];
  const enemyId = "enemy.prison-cage-vivi";
  const encounterId = "encounter.evil-forest.prison-cage-vivi";
  const objectiveId = "disc-1.evil-forest.prison-cage-steals";
  const warningId = "missable.disc-1.evil-forest.prison-cage-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const warning = missables.find((entry) => entry.id === warningId);

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(encounter?.missableIds.includes(warningId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  assert.ok(warning?.classification.includes("recoverable-later"));
  assert.match(warning?.note ?? "", /Jegged reports 70%\/23%.*Opa-Til lists 100%\/25%/);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const catalogItem = gameItems.find((entry) => entry.id === item.itemId);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.match(path?.notes ?? "", new RegExp(item.connectedAttemptRate));
    assert.ok(path?.notes?.includes(item.tableRate));
    assert.ok(path?.notes?.includes("not reconciled"));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok([...requiredSources].every((sourceId) => catalogItem?.sourceIds.includes(sourceId)), `${item.itemId} includes steal provenance`);
    assert.ok([...requiredSources].every((sourceId) => objective?.sourceIds.includes(sourceId)), `${objectiveId} includes source provenance`);
    assert.ok([...requiredSources].every((sourceId) => warning?.sourceIds.includes(sourceId)), `${warningId} includes source provenance`);
    assert.ok([...requiredSources].every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} references known sources`);
  }
});

test("Cargo Ship Black Waltz 3 steals link their exact one-time encounter slots", () => {
  const expected = [
    { pathId: "item-path.disc-1.cargo-ship.steepled-hat-black-waltz-3-steal", itemId: "game-item.steepled-hat", slot: "common" },
    { pathId: "item-path.disc-1.cargo-ship.black-waltz-3-linen-cuirass-steal", itemId: "game-item.linen-cuirass", slot: "uncommon" },
    { pathId: "item-path.disc-1.cargo-ship.silver-gloves-black-waltz-3-steal", itemId: "game-item.silver-gloves", slot: "semi-rare" },
  ];
  const enemyId = "enemy.black-waltz-3-cargo-ship";
  const encounterId = "encounter.cargo-ship.black-waltz-3";
  const objectiveId = "disc-1.cargo-ship.black-waltz-3-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-1.cargo-ship" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} has known sources`);
  }
});

test("Summit Station Black Waltz 3 steals link their separate rematch slots", () => {
  const expected = [
    { pathId: "item-path.disc-2.journey-to-treno.steepled-hat-black-waltz-3-steal", itemId: "game-item.steepled-hat", slot: "common" },
    { pathId: "item-path.journey-to-treno.lightning-staff-steal", itemId: "game-item.lightning-staff", slot: "uncommon" },
    { pathId: "item-path.disc-2.journey-to-treno.flame-staff-black-waltz-3-steal", itemId: "game-item.flame-staff", slot: "semi-rare" },
  ];
  const enemyId = "enemy.black-waltz-3-rematch";
  const encounterId = "encounter.summit-station.black-waltz-3-rematch";
  const objectiveId = "disc-2.journey-to-treno.black-waltz-3-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-2.journey-to-treno" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} has known sources`);
  }

  const flameStaffPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-2.journey-to-treno.flame-staff-black-waltz-3-steal");
  assert.match(flameStaffPath?.notes ?? "", /GameFAQs labels Flame Staff Semi-Rare; Jegged labels it Rare/);
});

test("Hilgigars steals link exact boss slots and preserve the Fairy Flute label conflict", () => {
  const expected = [
    { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-phoenix-down-steal", itemId: "game-item.phoenix-down", slot: "common" },
    { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-mythril-fork-steal", itemId: "game-item.mythril-fork", slot: "uncommon" },
    { pathId: "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal", itemId: "game-item.fairy-flute", slot: "rare" },
  ];
  const enemyId = "enemy.hilgigars";
  const encounterId = "encounter.conde-petie-mountain-path.hilgigars";
  const objectiveId = "disc-2.conde-petie-mountain-path.hilgigars-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-2.conde-petie-mountain-path" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} has known sources`);
  }

  const fairyFlutePath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-2.conde-petie-mountain-path.hilgigars-fairy-flute-steal");
  assert.match(fairyFlutePath?.notes ?? "", /GameFAQs places Fairy Flute in the Rare steal slot; Jegged and Gamer Guides call it Very Rare/);
});

test("Ralvurahva steals link exact slots and preserve chance-based recovery routes", () => {
  const expected = [
    { pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-bone-wrist-steal", itemId: "game-item.bone-wrist", slot: "common" },
    { pathId: "item-path.disc-2.journey-to-cleyra.ralvurahva-mythril-fork-steal", itemId: "game-item.mythril-fork", slot: "uncommon" },
  ];
  const enemyId = "enemy.ralvurahva";
  const encounterId = "encounter.gargan-roo.ralvurahva";
  const objectiveId = "disc-2.journey-to-cleyra.ralvurahva-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const warning = missables.find((entry) => entry.id === "missable.disc-2.journey-to-cleyra.ralvurahva-steals");
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-2.journey-to-cleyra" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);
  assert.equal(enemy?.drops.every((entry) => entry.itemId === null), true);
  assert.equal(warning?.classification.includes("recoverable-later"), true);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(itemAcquisitionPaths.some((candidate) => candidate.itemId === item.itemId && candidate.chapterId !== "disc-2.journey-to-cleyra"), `${item.itemId} has a later recovery path`);
  }

  const step = walkthroughChapters.flatMap((chapter) => chapter.sections ?? []).flatMap((section) => section.steps ?? []).find((entry) => entry.id === "journey-cleyra-ralvurahva-steals");
  assert.match(step?.text ?? "", /Common Bone Wrist and Uncommon Mythril Fork/);
  assert.match(step?.text ?? "", /chance-based attempt can fail/);
});

test("Burmecia Beatrix steals link Common, Uncommon, and Rare slots to the one-time boss encounter", () => {
  const expected = [
    { pathId: "item-path.burmecia.phoenix-down-beatrix", itemId: "game-item.phoenix-down", slot: "common" },
    { pathId: "item-path.burmecia.beatrix-chain-plate", itemId: "game-item.chain-plate", slot: "uncommon" },
    { pathId: "item-path.burmecia.beatrix-mythril-sword", itemId: "game-item.mythril-sword", slot: "rare" },
  ];
  const enemyId = "enemy.beatrix-burmecia";
  const encounterId = "encounter.burmecia.beatrix";
  const objectiveId = "disc-1.burmecia.beatrix-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const warning = missables.find((entry) => entry.id === "missable.disc-1.burmecia.beatrix-steals");
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-1.burmecia" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);
  assert.ok(warning?.recovery.includes("Phoenix Down is ordinary shop stock"));

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(itemAcquisitionPaths.some((candidate) => candidate.itemId === item.itemId && candidate.chapterId !== "disc-1.burmecia"), `${item.itemId} has a later recovery path`);
  }

  const step = walkthroughChapters.flatMap((chapter) => chapter.sections ?? []).flatMap((section) => section.steps ?? []).find((entry) => entry.id === "burmecia-beatrix-steals");
  assert.match(step?.text ?? "", /Common Phoenix Down and Uncommon Chain Plate/);
  assert.match(step?.text ?? "", /either chance-based attempt can fail/);
  assert.match(step?.text ?? "", /Rare Mythril Sword/);
});

test("Festival Zaghnol steals link the Hunt-only boss slots and source conflict", () => {
  const expected = [
    { pathId: "item-path.disc-1.lindblum.zaghnol-mythril-gloves-steal", itemId: "game-item.mythril-gloves", slot: "common" },
    { pathId: "item-path.disc-1.lindblum.zaghnol-needle-fork-steal", itemId: "game-item.needle-fork", slot: "uncommon" },
  ];
  const enemyId = "enemy.zaghnol-hunt";
  const encounterId = "encounter.lindblum.festival-zaghnol";
  const objectiveId = "disc-1.lindblum.zaghnol-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-1.lindblum" && entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("Caves of Narshe's Hunt table lists no steals"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} has known sources`);
  }
});

test("Scarlet Hair item paths link exact solo-boss loot slots and distinguish steal chance from the Tent drop", () => {
  const expected = [
    { pathId: "item-path.disc-2.return-to-madain-sari.scarlet-hair-ether-steal", itemId: "game-item.ether", method: "steal", slot: "common", chanceBased: true },
    { pathId: "item-path.disc-2.return-to-madain-sari.scarlet-hair-poison-knuckles-steal", itemId: "game-item.poison-knuckles", method: "steal", slot: "uncommon", chanceBased: true },
    { pathId: "item-path.disc-2.return-to-madain-sari.scarlet-hair-tent-drop", itemId: "game-item.tent", method: "drop", slot: "always", chanceBased: false },
  ];
  const enemyId = "enemy.scarlet-hair";
  const encounterId = "encounter.return-madain-sari.scarlet-hair";
  const objectiveId = "disc-2.return-to-madain-sari.scarlet-hair-steals";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => entry.chapterId === "disc-2.return-to-madain-sari" && entry.enemyId === enemyId);

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(paths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    if (item.chanceBased) {
      assert.match(path?.conditions ?? "", /chance-based/);
      assert.match(path?.conditions ?? "", /can fail/);
      assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    } else {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /defeat him/);
      assert.equal(path?.walkthroughObjectiveIds, undefined);
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} has known sources`);
  }

  const laterPoisonKnucklesPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-2.madain-sari.poison-knuckles-shop");
  assert.equal(laterPoisonKnucklesPath?.availability, "repeatable");
});

test("Alexandria boss item paths link exact slots across the Zorn/Thorn, Beatrix, Ralvuimago, and Tantarian encounters", () => {
  const zornThornEncounterId = "encounter.return-to-alexandria.zorn-thorn";
  const beatrixEncounterId = "encounter.return-to-alexandria.beatrix";
  const ralvuimagoEncounterId = "encounter.return-to-alexandria.ralvuimago";
  const tantarianEncounterIds = ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"];
  const expected = [
    { id: "item-path.disc-2.return-to-alexandria.zorn-partisan-steal", enemyId: "enemy.zorn", itemId: "game-item.partisan", method: "steal", slot: "common", encounterIds: [zornThornEncounterId], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals" },
    { id: "item-path.disc-2.return-to-alexandria.zorn-stardust-rod-steal", enemyId: "enemy.zorn", itemId: "game-item.stardust-rod", method: "steal", slot: "uncommon", encounterIds: [zornThornEncounterId], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals" },
    { id: "item-path.disc-2.return-to-alexandria.thorn-mythril-armlet-steal", enemyId: "enemy.thorn", itemId: "game-item.mythril-armlet", method: "steal", slot: "uncommon", encounterIds: [zornThornEncounterId], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals" },
    { id: "item-path.disc-2.return-to-alexandria.thorn-mythril-armor", enemyId: "enemy.thorn", itemId: "game-item.mythril-armor", method: "steal", slot: "common", encounterIds: [zornThornEncounterId], objectiveId: "disc-2.return-to-alexandria.zorn-thorn-steals" },
    { id: "item-path.disc-2.return-to-alexandria.beatrix-phoenix-down-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.phoenix-down", method: "steal", slot: "common", encounterIds: [beatrixEncounterId], objectiveId: "disc-2.return-to-alexandria.beatrix-steals" },
    { id: "item-path.disc-2.return-to-alexandria.beatrix-ice-brand-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.ice-brand", method: "steal", slot: "uncommon", encounterIds: [beatrixEncounterId], objectiveId: "disc-2.return-to-alexandria.beatrix-steals" },
    { id: "item-path.disc-2.return-to-alexandria.survival-vest-beatrix-steal", enemyId: "enemy.beatrix-alexandria", itemId: "game-item.survival-vest", method: "steal", slot: "semi-rare", encounterIds: [beatrixEncounterId], objectiveId: "disc-2.return-to-alexandria.beatrix-steals" },
    { id: "item-path.disc-2.return-to-alexandria.ralvuimago-phoenix-down-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.phoenix-down", method: "steal", slot: "common", encounterIds: [ralvuimagoEncounterId], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals" },
    { id: "item-path.disc-2.return-to-alexandria.ralvuimago-adaman-vest-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.adaman-vest", method: "steal", slot: "uncommon", encounterIds: [ralvuimagoEncounterId], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals" },
    { id: "item-path.disc-2.return-to-alexandria.ralvuimago-oak-staff-steal", enemyId: "enemy.ralvuimago", itemId: "game-item.oak-staff", method: "steal", slot: "semi-rare", encounterIds: [ralvuimagoEncounterId], objectiveId: "disc-2.return-to-alexandria.ralvuimago-steals" },
    { id: "item-path.disc-2.return-to-alexandria.tantarian-ether-steal", enemyId: "enemy.tantarian", itemId: "game-item.ether", method: "steal", slot: "common", encounterIds: tantarianEncounterIds, objectiveId: "disc-2.return-to-alexandria.tantarian" },
    { id: "item-path.disc-2.return-to-alexandria.tantarian-elixir-steal", enemyId: "enemy.tantarian", itemId: "game-item.elixir", method: "steal", slot: "uncommon", encounterIds: tantarianEncounterIds, objectiveId: "disc-2.return-to-alexandria.tantarian" },
    { id: "item-path.disc-2.return-to-alexandria.tantarian-silver-fork-steal", enemyId: "enemy.tantarian", itemId: "game-item.silver-fork", method: "steal", slot: "semi-rare", encounterIds: tantarianEncounterIds, objectiveId: "disc-2.return-to-alexandria.tantarian" },
    { id: "item-path.disc-2.return-to-alexandria.tantarian-demons-mail-steal", enemyId: "enemy.tantarian", itemId: "game-item.demons-mail", method: "steal", slot: "rare", encounterIds: tantarianEncounterIds, objectiveId: "disc-2.return-to-alexandria.tantarian" },
    { id: "item-path.disc-2.return-to-alexandria.tantarian-running-shoes", enemyId: "enemy.tantarian", itemId: "game-item.running-shoes", method: "drop", slot: "always", encounterIds: tantarianEncounterIds, objectiveId: "disc-2.return-to-alexandria.tantarian" },
  ];
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const enemy = enemyRecords.find((entry) => entry.id === item.enemyId);
    const relatedEncounters = enemyEncounters.filter((entry) => item.encounterIds.includes(entry.id));
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...relatedEncounters.flatMap((entry) => entry.sourceIds), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real enemy-table slot`);
    assert.equal(path?.method, item.method);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, item.enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, item.encounterIds);
    assert.ok(relatedEncounters.every((entry) => entry.kind === "boss" && entry.formation.some((member) => member.enemyId === item.enemyId)));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", /chance-based/);
      assert.match(path?.conditions ?? "", /can fail/);
      assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    } else {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /victory/);
      assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }

  const mythrilArmorPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-2.return-to-alexandria.thorn-mythril-armor");
  assert.match(mythrilArmorPath?.notes ?? "", /GameFAQs Items index lists Mythril Armor as Zorn's common steal/);
  assert.match(mythrilArmorPath?.notes ?? "", /boss-specific table and independent walkthroughs/);
});

test("Ozma item paths link all four steals and four drops to the optional boss table", () => {
  const enemyId = "enemy.ozma";
  const encounterId = "encounter.final-preparations.ozma";
  const encounterIds = [encounterId];
  const expected = [
    { id: "item-path.disc-4.final-preparations.ozma-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveId: "disc-4.final-preparations.ozma-steals" },
    { id: "item-path.disc-4.final-preparations.ozma-robe-of-lords-steal", itemId: "game-item.robe-of-lords", method: "steal", slot: "uncommon", objectiveId: "disc-4.final-preparations.ozma-steals" },
    { id: "item-path.disc-4.final-preparations.ozma-dark-matter-semi-rare-steal", itemId: "game-item.dark-matter", method: "steal", slot: "semi-rare", objectiveId: "disc-4.final-preparations.ozma-steals" },
    { id: "item-path.disc-4.final-preparations.ozma-pumice-piece-rare-steal", itemId: "game-item.pumice-piece", method: "steal", slot: "rare", objectiveId: "disc-4.final-preparations.ozma-steals" },
    { id: "item-path.disc-4.final-preparations.ozma-pumice-drop", itemId: "game-item.pumice", method: "drop", slot: "always", objectiveIds: ["disc-4.final-preparations.ozma-defeated", "disc-4.final-preparations.ozma-rewards"] },
    { id: "item-path.disc-4.final-preparations.ozma-dark-matter-common-drop", itemId: "game-item.dark-matter", method: "drop", slot: "common", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
    { id: "item-path.disc-4.final-preparations.ozma-dark-matter-uncommon-drop", itemId: "game-item.dark-matter", method: "drop", slot: "uncommon", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
    { id: "item-path.disc-4.final-preparations.ozma-dark-matter-rare-drop", itemId: "game-item.dark-matter", method: "drop", slot: "rare", objectiveIds: ["disc-4.final-preparations.ozma-defeated"] },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const relatedEncounters = enemyEncounters.filter((entry) => encounterIds.includes(entry.id));
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(relatedEncounters.length, encounterIds.length);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...relatedEncounters.flatMap((entry) => entry.sourceIds), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real enemy-table slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.final-preparations");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, encounterIds);
    assert.ok(relatedEncounters.every((entry) => entry.kind === "boss" && entry.formation.some((member) => member.enemyId === enemyId)));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", /chance-based/);
      assert.match(path?.conditions ?? "", /can fail/);
      assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /victory/);
      for (const objectiveId of item.objectiveIds) assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveIds[0]));
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
});

test("final-battle steal paths link Trance Kuja and Necron to their distinct loot slots", () => {
  const expected = [
    { id: "item-path.disc-4.the-final-battle.trance-kuja-ether-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.ether", slot: "common", rate: "100%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
    { id: "item-path.disc-4.the-final-battle.trance-kuja-white-robe-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.white-robe", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
    { id: "item-path.disc-4.the-final-battle.rebirth-ring-trance-kuja-steal", enemyId: "enemy.trance-kuja", encounterId: "encounter.final-battle.trance-kuja", itemId: "game-item.rebirth-ring", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.the-final-battle.trance-kuja-steals"] },
    { id: "item-path.disc-4.the-final-battle.necron-elixir-common-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "common", rate: "100%", objectiveIds: ["disc-4.the-final-battle.necron-steals", "disc-4.memoria.deathguise-steals"] },
    { id: "item-path.disc-4.the-final-battle.necron-elixir-uncommon-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
    { id: "item-path.disc-4.the-final-battle.necron-elixir-semi-rare-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "semi-rare", rate: "6.25%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
    { id: "item-path.disc-4.the-final-battle.necron-elixir-rare-steal", enemyId: "enemy.necron", encounterId: "encounter.final-battle.necron", itemId: "game-item.elixir", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.the-final-battle.necron-steals"] },
  ];

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const enemy = enemyRecords.find((entry) => entry.id === item.enemyId);
    const encounter = enemyEncounters.find((entry) => entry.id === item.encounterId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real steal slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.the-final-battle");
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, item.enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [item.encounterId]);
    assert.equal(encounter?.kind, "boss");
    assert.ok(encounter?.formation.some((member) => member.enemyId === item.enemyId));
    assert.ok(item.objectiveIds.every((objectiveId) => path?.walkthroughObjectiveIds?.includes(objectiveId)));
    assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
    if (item.enemyId === "enemy.necron") {
      assert.ok(path?.sourceIds.includes("gamefaqs-final-battle-79143"));
      assert.match(path?.conditions ?? path?.notes ?? "", /Jegged/);
    }
  }
});

test("Hades item paths link all steal and drop slots without collapsing its three Elixir outcomes", () => {
  const enemyId = "enemy.hades";
  const encounterId = "encounter.memoria.hades";
  const expected = [
    { id: "item-path.disc-4.memoria.hades-reflect-ring-steal", itemId: "game-item.reflect-ring", method: "steal", slot: "common", rate: "100%", objectiveIds: ["disc-4.memoria.hades-steals"] },
    { id: "item-path.disc-4.memoria.hades-running-shoes-steal", itemId: "game-item.running-shoes", method: "steal", slot: "uncommon", rate: "25%", objectiveIds: ["disc-4.memoria.hades-steals", "disc-4.return-to-gaia.updated-shops"] },
    { id: "item-path.disc-4.memoria.hades-battle-boots-steal", itemId: "game-item.battle-boots", method: "steal", slot: "semi-rare", rate: "6.25%", objectiveIds: ["disc-4.memoria.hades-steals"] },
    { id: "item-path.disc-4.memoria.hades-robe-of-lords-steal", itemId: "game-item.robe-of-lords", method: "steal", slot: "rare", rate: "0.39%", objectiveIds: ["disc-4.memoria.hades-steals"] },
    { id: "item-path.disc-4.memoria.hades-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveIds: ["disc-4.memoria.hades"] },
    { id: "item-path.disc-4.memoria.hades-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "common", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
    { id: "item-path.disc-4.memoria.hades-elixir-uncommon-drop", itemId: "game-item.elixir", method: "drop", slot: "uncommon", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
    { id: "item-path.disc-4.memoria.hades-elixir-rare-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.deathguise-steals"] },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real loot slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(item.objectiveIds.every((objectiveId) => path?.walkthroughObjectiveIds?.includes(objectiveId)));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /victory/);
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.notes ?? "", /do not assert three guaranteed Elixirs/);
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
});

test("Memoria Tiamat item paths link its seven item-bearing boss slots and retain source-reported rates", () => {
  const enemyId = "enemy.tiamat-memoria";
  const encounterId = "encounter.memoria.tiamat";
  const expected = [
    { id: "item-path.disc-4.memoria.tiamat-blood-sword-steal", itemId: "game-item.blood-sword", method: "steal", slot: "common", rate: "100%" },
    { id: "item-path.disc-4.memoria.tiamat-feather-boots-steal", itemId: "game-item.feather-boots", method: "steal", slot: "uncommon", rate: "25%" },
    { id: "item-path.disc-4.memoria.tiamat-grand-helm-steal", itemId: "game-item.grand-helm", method: "steal", slot: "rare", rate: "0.39%" },
    { id: "item-path.disc-4.memoria.tiamat-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always" },
    { id: "item-path.disc-4.memoria.tiamat-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
    { id: "item-path.disc-4.memoria.tiamat-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
    { id: "item-path.disc-4.memoria.tiamat-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real loot slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-steals"));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.conditions ?? "", /source-reported/);
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always slot/);
      assert.match(path?.conditions ?? "", /victory/);
      assert.ok(path?.sourceIds.includes("opatil-drop-list"));
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.notes ?? "", /source-reported, not release-verified/);
      assert.match(path?.conditions ?? "", /not guaranteed/);
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
  assert.match(itemAcquisitionPaths.find((entry) => entry.id === expected[2].id)?.notes ?? "", /Rare.*Very Rare/);
});

test("Memoria Maliris item paths link all seven boss slots and preserve Masamune's rarity disagreement", () => {
  const enemyId = "enemy.maliris";
  const encounterId = "encounter.memoria.maliris";
  const expected = [
    { id: "item-path.disc-4.memoria.maliris-genji-armor-steal", itemId: "game-item.genji-armor", method: "steal", slot: "common", rate: "100%" },
    { id: "item-path.disc-4.memoria.maliris-ultima-sword-steal", itemId: "game-item.ultima-sword", method: "steal", slot: "uncommon", rate: "25%" },
    { id: "item-path.disc-4.memoria.maliris-masamune-steal", itemId: "game-item.masamune", method: "steal", slot: "semi-rare", rate: "6.25%" },
    { id: "item-path.disc-4.memoria.maliris-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always" },
    { id: "item-path.disc-4.memoria.maliris-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
    { id: "item-path.disc-4.memoria.maliris-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
    { id: "item-path.disc-4.memoria.maliris-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real loot slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-4.memoria.maliris-steals"));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.conditions ?? "", /source-reported/);
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always/);
      assert.match(path?.conditions ?? "", /victory/);
      assert.ok(path?.sourceIds.includes("opatil-drop-list"));
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.notes ?? "", /source-reported, not release-verified/);
      assert.match(path?.conditions ?? "", /not guaranteed/);
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
  assert.match(itemAcquisitionPaths.find((entry) => entry.id === expected[2].id)?.notes ?? "", /Semi-Rare.*Rare/);
});

test("Memoria Lich item paths link all seven boss slots and preserve Black Robe's rarity disagreement", () => {
  const enemyId = "enemy.lich-memoria";
  const encounterId = "encounter.memoria.lich";
  const expected = [
    { id: "item-path.disc-4.memoria.lich-genji-gloves-steal", itemId: "game-item.genji-gloves", method: "steal", slot: "common", rate: "100%" },
    { id: "item-path.disc-4.memoria.lich-sirens-flute-steal", itemId: "game-item.sirens-flute", method: "steal", slot: "uncommon", rate: "25%" },
    { id: "item-path.disc-4.memoria.lich-black-robe-steal", itemId: "game-item.black-robe", method: "steal", slot: "semi-rare", rate: "6.25%" },
    { id: "item-path.disc-4.memoria.lich-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always" },
    { id: "item-path.disc-4.memoria.lich-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%" },
    { id: "item-path.disc-4.memoria.lich-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%" },
    { id: "item-path.disc-4.memoria.lich-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real loot slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-4.memoria.lich-steals"));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.conditions ?? "", /source-reported/);
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always/);
      assert.match(path?.conditions ?? "", /victory/);
      assert.ok(path?.sourceIds.includes("opatil-drop-list"));
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.notes ?? "", /source-reported, not release-verified/);
      assert.match(path?.conditions ?? "", /not guaranteed/);
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
  assert.match(itemAcquisitionPaths.find((entry) => entry.id === expected[2].id)?.notes ?? "", /Semi-Rare.*Rare/);
});

test("Memoria Deathguise item paths link all seven boss slots and preserve rate and rarity differences", () => {
  const enemyId = "enemy.deathguise";
  const encounterId = "encounter.memoria.deathguise";
  const expected = [
    { id: "item-path.disc-4.memoria.deathguise-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", rate: "100%", comparison: "70%", objectiveId: "disc-4.memoria.deathguise-steals" },
    { id: "item-path.disc-4.memoria.deathguise-black-belt-steal", itemId: "game-item.black-belt", method: "steal", slot: "uncommon", rate: "25%", comparison: "23%", objectiveId: "disc-4.memoria.deathguise-steals" },
    { id: "item-path.disc-4.memoria.deathguise-duel-claws-steal", itemId: "game-item.duel-claws", method: "steal", slot: "rare", rate: "0.39%", comparison: "0.4%", objectiveId: "disc-4.memoria.deathguise-steals" },
    { id: "item-path.disc-4.memoria.deathguise-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveId: "disc-4.memoria.deathguise" },
    { id: "item-path.disc-4.memoria.deathguise-phoenix-down-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rate: "37.5%", label: "Uncommon", objectiveId: "disc-4.memoria.deathguise" },
    { id: "item-path.disc-4.memoria.deathguise-ether-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "12.5%", label: "Rare", objectiveId: "disc-4.memoria.deathguise" },
    { id: "item-path.disc-4.memoria.deathguise-elixir-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", rate: "0.39%", comparison: "0.4%", label: "Very Rare", objectiveId: "disc-4.memoria.deathguise" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(linkedPaths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a real loot slot`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.conditions ?? "", new RegExp(item.comparison.replace("%", "\\%")));
      assert.match(path?.conditions ?? "", /source-reported/);
      assert.match(path?.conditions ?? "", /per connected steal/);
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always/);
      assert.match(path?.conditions ?? "", /victory/);
      assert.ok(path?.sourceIds.includes("opatil-drop-list"));
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.conditions ?? "", new RegExp(item.rate.replace("%", "\\%")));
      assert.match(path?.notes ?? "", /source-reported, not release-verified/);
      assert.match(path?.conditions ?? "", /not guaranteed/);
      assert.match(path?.notes ?? "", new RegExp(item.label));
      if (item.comparison) assert.match(path?.notes ?? "", new RegExp(item.comparison.replace("%", "\\%")));
    }
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot sources`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.id} has known sources`);
  }
  assert.match(itemAcquisitionPaths.find((entry) => entry.id === expected[2].id)?.notes ?? "", /Rare.*Very Rare/);
});

test("item inventory targets preserve the source quantity they represent", () => {
  const target = (id) => sourceInventoryTargets.find((entry) => entry.id === id);
  const steepledHatNeed = target("item-target.disc-4.final-preparations.steepled-hat");
  const steepledHatEnd = target("item-target.disc-4.final-preparations.steepled-hat-end-inventory");
  const airRacketPurchase = target("item-target.disc-2.treno.air-racket");
  const silverGlovesCheckpoint = target("item-target.disc-2.journey-to-treno.silver-gloves");
  const disc3CheckpointTargets = sourceInventoryTargets.filter((entry) => entry.id.startsWith("item-target.disc-3.preparing-to-leave."));

  assert.equal(steepledHatNeed?.targetQuantity, 7);
  assert.equal(steepledHatNeed?.basis, "route-need");
  assert.equal(steepledHatEnd?.targetQuantity, 10);
  assert.equal(steepledHatEnd?.basis, "end-inventory");
  assert.equal(airRacketPurchase?.basis, "checkpoint-total");
  assert.match(airRacketPurchase?.interpretation ?? "", /at least five Air Rackets in inventory/);
  assert.equal(silverGlovesCheckpoint?.basis, "checkpoint-total");
  assert.equal(disc3CheckpointTargets.length, 24);
  assert.ok(disc3CheckpointTargets.every((entry) => entry.basis === "checkpoint-total"));
  assert.ok(sourceInventoryTargets.every((entry) => entry.basis !== "end-inventory" || entry.id.includes("end-inventory")));
  assert.ok(sourceInventoryTargets.every((entry) => entry.basis !== "route-need" || /\bNeed \d+\b/.test(entry.interpretation)));
  assert.ok(!sourceInventoryTargets.some((entry) => entry.basis === "buy-column-total"));
  assert.ok(!sourceInventoryTargets.some((entry) => entry.id === "item-target.disc-4.final-preparations.steepled-hat-buy"));
});

test("Cleyra's Magician Shoes and rubbish-pit chests have separate item paths", () => {
  const magicianShoes = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.magician-shoes" && path.chapterId === "disc-2.cleyra");
  const silkRobe = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.cleyra.rubbish-pit-silk-robe");
  const secondShoes = magicianShoes.find((path) => path.id === "item-path.disc-2.cleyra.rubbish-pit-magician-shoes");

  assert.ok(gameItems.some((item) => item.id === "game-item.magician-shoes"));
  assert.ok(gameItems.some((item) => item.id === "game-item.silk-robe"));
  assert.equal(magicianShoes.length, 2);
  assert.equal(magicianShoes.reduce((total, path) => total + path.quantity, 0), 2);
  assert.ok(magicianShoes.some((path) => path.id === "item-path.disc-2.cleyra.trunk-magician-shoes"));
  assert.ok(silkRobe);
  assert.ok(secondShoes);

  for (const path of [silkRobe, secondShoes]) {
    assert.equal(path.availability, "limited-window");
    assert.equal(path.recommendedBeforeChapterId, "disc-2.cleyra");
    assert.match(path.conditions ?? "", /No Yummy-Yummies! and There A Mushroom!/);
    assert.ok(path.walkthroughObjectiveIds?.includes("disc-2.cleyra.rubbish-pit-chests"));
    assert.ok(path.walkthroughObjectiveIds?.includes("disc-2.cleyra.treasure-sweep"));
    for (const sourceId of ["gamefaqs-cleyra-71891", "gamerguides-cleyra", "elitegrindlab-cleyra"]) {
      assert.ok(path.sourceIds.includes(sourceId), `${path.id} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }

  const abilityUp = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.silk-robe.ability-up");
  assert.equal(abilityUp?.itemId, "game-item.silk-robe");
  assert.equal(abilityUp?.abilityName, "Ability Up");
  assert.match(silkRobe?.notes ?? "", /nine-frog reward and Silk Shirt \+ Bandana synthesis/);
  assert.ok(abilityUp?.sourceIds.includes("cavesofnarshe-ff9-robes"));
  assert.ok(objectives.some((objective) => objective.id === "disc-2.cleyra.rubbish-pit-chests"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.cleyra"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-2.cleyra"));
});

test("Soft has repeatable shop sources through the late game", () => {
  const softPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.soft");
  const shops = [
    ["item-path.burmecia.soft-atla-mogshop", "burmecia.atla-mogshop", "mogshop"],
    ["item-path.disc-2.treno.soft-item-shop", "treno.item-shop", "shop"],
    ["item-path.disc-2.outer-continent.soft-black-mage-village-shop", "black-mage-village.item-shop", "shop"],
    ["item-path.disc-3.on-the-high-seas.soft-alexandria-shop", "alexandria.item-shop.disc-3-4", "shop"],
  ];

  assert.equal(softPaths.length, 20);
  assert.ok(gameItems.find((item) => item.id === "game-item.soft")?.sourceIds.includes("gamefaqs-shops-71891"));
  for (const [pathId, shopId, method] of shops) {
    const path = softPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.shopId, shopId);
    assert.equal(path.method, method);
    assert.equal(path.availability, "repeatable");
    assert.deepEqual(path.cost, { currency: "gil", amount: 100 });
    assert.ok(path.sourceIds.includes("gamefaqs-shops-71891"));
    assert.ok(sources.some((source) => source.id === "gamefaqs-shops-71891"));
  }

  const blackMageVillage = softPaths.find((path) => path.id === shops[2][0]);
  assert.match(blackMageVillage?.conditions ?? "", /rest of the game/);
  const atlaReturn = softPaths.find((path) => path.id === "item-path.disc-2.journey-to-cleyra.atla-mogshop.soft");
  assert.equal(atlaReturn?.method, "mogshop");
  assert.equal(atlaReturn?.availability, "limited-window");
  assert.equal(softPaths.filter((path) => path.method === "chest" || path.method === "hidden-pickup").length, 2);
});

test("Disc II Atla Mogshop paths link to the pre-Cleyra stock checkpoint", () => {
  const objectiveId = "disc-2.journey-to-cleyra.atla-mogshop-stock";
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const paths = itemAcquisitionPaths.filter((path) =>
    path.chapterId === "disc-2.journey-to-cleyra" && path.shopId === "burmecia.atla-mogshop",
  );
  const expectedItems = [
    "game-item.antidote",
    "game-item.barbut",
    "game-item.bronze-vest",
    "game-item.echo-screen",
    "game-item.eye-drops",
    "game-item.glass-armlet",
    "game-item.headgear",
    "game-item.linen-cuirass",
    "game-item.magus-hat",
    "game-item.mythril-gloves",
    "game-item.needle-fork",
    "game-item.phoenix-down",
    "game-item.potion",
    "game-item.soft",
    "game-item.steepled-hat",
    "game-item.tent",
  ];
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-2.journey-to-cleyra");
  const step = chapter?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "journey-cleyra-atla-mogshop-return");

  assert.equal(paths.length, 16);
  assert.deepEqual(paths.map((path) => path.itemId).sort(), expectedItems);
  assert.equal(objective?.category, "side-content");
  assert.ok(objective?.chapterIds.includes("disc-2.journey-to-cleyra"));
  for (const sourceId of ["gamefaqs-shops-71891", "cavesofnarshe-ff9-disc-2-map", "flactem-disc-2-cleyra"]) {
    assert.ok(objective?.sourceIds.includes(sourceId), `${objectiveId} is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
  }
  for (const path of paths) {
    assert.equal(path.availability, "limited-window", `${path.id} should retain its shop-window classification`);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId), `${path.id} is not linked to the stock checkpoint`);
    assert.ok(path.sourceIds.includes("flactem-disc-2-cleyra"), `${path.id} is missing the route source`);
  }
  assert.ok(step?.objectiveIds?.includes(objectiveId));
  assert.match(step?.text ?? "", /before returning through Gizamaluke's Grotto and entering Cleyra/i);
  assert.match(step?.detail ?? "", /not proof that every listed item type becomes permanently unavailable/i);
  assert.match(step?.detail ?? "", /720 Gil.*980 Gil/i);
});

test("Disc III Mimoza and Mojito shop paths link to the final stock checkpoint", () => {
  const objectiveId = "disc-3.preparing-to-leave.final-stock-ability-review";
  const expectedPaths = [
    ["item-path.disc-3.forgotten-continent.chimera-armlet-oeilvert-mogshop", "game-item.chimera-armlet", "disc-3.forgotten-continent", "mimoza-oeilvert", 1200],
    ["item-path.disc-3.forgotten-continent.cross-helm-oeilvert-mogshop", "game-item.cross-helm", "disc-3.forgotten-continent", "oeilvert.mogshop", 2200],
    ["item-path.disc-3.forgotten-continent.healing-rod-oeilvert-mogshop", "game-item.healing-rod", "disc-3.forgotten-continent", "mimoza-oeilvert", 1770],
    ["item-path.disc-3.forgotten-continent.brigandine-oeilvert-mogshop", "game-item.brigandine", "disc-3.forgotten-continent", "mimoza-oeilvert", 4300],
    ["item-path.disc-3.desert-palace.chimera-armlet-mogshop", "game-item.chimera-armlet", "disc-3.desert-palace", "mojito-desert-palace", 1200],
    ["item-path.disc-3.desert-palace.healing-rod-mogshop", "game-item.healing-rod", "disc-3.desert-palace", "mojito-desert-palace", 1770],
    ["item-path.disc-3.desert-palace.brigandine-mogshop", "game-item.brigandine", "disc-3.desert-palace", "mojito-desert-palace", 4300],
  ];
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const paths = expectedPaths.map(([id]) => itemAcquisitionPaths.find((path) => path.id === id));
  const oeilvertSection = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent")
    ?.sections.find((section) => section.id === "oeilvert-exterior");
  const oeilvertStep = oeilvertSection?.steps.find((step) => step.id === "oeilvert-shop-and-party-stock");
  const desertPalaceStep = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.desert-palace")
    ?.sections.flatMap((section) => section.steps).find((step) => step.id === "desert-palace-mojito-letter-shop");

  assert.equal(paths.length, expectedPaths.length);
  assert.ok(objective?.chapterIds.includes("disc-3.forgotten-continent"));
  assert.ok(objective?.chapterIds.includes("disc-3.desert-palace"));
  for (const sourceId of ["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891"]) {
    assert.ok(objective?.sourceIds.includes(sourceId), `${objectiveId} is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
  }
  for (const [index, [id, itemId, chapterId, shopId, price]] of expectedPaths.entries()) {
    const path = paths[index];
    assert.ok(path, `${id} exists`);
    assert.equal(path.itemId, itemId, `${id} item`);
    assert.equal(path.chapterId, chapterId, `${id} chapter`);
    assert.equal(path.shopId, shopId, `${id} shop`);
    assert.equal(path.method, "mogshop", `${id} method`);
    assert.equal(path.availability, "limited-window", `${id} window`);
    assert.equal(path.cost?.amount, price, `${id} price`);
    assert.match(path.conditions ?? "", /Shimmering Island/i, `${id} cutoff`);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId), `${id} is not linked to the final stock checkpoint`);
    for (const sourceId of ["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891"]) {
      assert.ok(path.sourceIds.includes(sourceId), `${id} is missing ${sourceId}`);
    }
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${id} has known sources`);
    assert.ok(itemAcquisitionPaths.some((candidate) =>
      candidate.itemId === itemId && candidate.id !== id && candidate.chapterId !== chapterId && candidate.availability === "repeatable",
    ), `${id} closes a purchase source, not every later route for the item type`);
  }
  assert.ok(oeilvertStep?.objectiveIds?.includes(objectiveId));
  assert.match(oeilvertStep?.detail ?? "", /taking the Gulug Stone as the ruin's point of no return/i);
  assert.match(oeilvertStep?.detail ?? "", /do not settle when the exterior shop becomes unreachable/i);
  assert.match(oeilvertStep?.detail ?? "", /buy what you need before entering/i);
  assert.match(oeilvertStep?.detail ?? "", /purchase-source cutoff, not a claim that every item type becomes unavailable/i);
  for (const sourceId of ["gamefaqs-shops-71891", "gamefaqs-preparing-to-leave-71891", "elitegrindlab-oeilvert"]) {
    assert.ok(oeilvertSection?.sourceIds.includes(sourceId), `Oeilvert shop route is missing ${sourceId}`);
  }
  assert.ok(desertPalaceStep?.objectiveIds?.includes(objectiveId));
});

test("Alexandria's Disc III pickups and Stiltzkin bundle have item-level paths", () => {
  const alexandria = itemAcquisitionPaths.filter((path) => path.chapterId === "disc-3.the-home-front");
  const sourcesForAll = ["gamefaqs-home-front-71891", "jegged-home-front", "gamerguides-home-front", "elitegrindlab-home-front"];
  const sourceBackedItems = ["game-item.phoenix-pinion", "game-item.lapis-lazuli", "game-item.leo-stellazzio"];
  const expectedPickups = [
    "item-path.disc-3.home-front.vivi-dock-phoenix-pinion",
    "item-path.disc-3.home-front.castle-dock-ether",
    "item-path.disc-3.home-front.castle-dock-phoenix-pinion",
    "item-path.disc-3.home-front.fountain-lapis-lazuli",
    "item-path.disc-3.home-front.west-tower-phoenix-pinion",
    "item-path.disc-3.home-front.leo-stellazzio",
  ];

  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.the-home-front"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-3.the-home-front"));
  assert.deepEqual(expectedPickups.map((id) => alexandria.find((path) => path.id === id)?.id), expectedPickups);

  for (const itemId of sourceBackedItems) {
    assert.ok(gameItems.some((item) => item.id === itemId), `${itemId} is missing from the item catalog`);
  }

  const bundlePaths = alexandria.filter((path) => path.shopId === "stiltzkin-alexandria-fifth");
  assert.deepEqual(bundlePaths.map((path) => path.itemId).sort(), [
    "game-item.elixir",
    "game-item.hi-potion",
    "game-item.phoenix-pinion",
  ]);
  for (const path of bundlePaths) {
    assert.equal(path.availability, "limited-window");
    assert.equal(path.cost?.amount, 777);
    assert.equal(path.cost?.bundleId, "alexandria-stiltzkin-fifth-bundle");
    assert.ok(path.walkthroughObjectiveIds?.includes("disc-3.the-home-front.stiltzkin-5"));
  }

  const pickupPaths = [...expectedPickups.map((id) => alexandria.find((path) => path.id === id)).filter(Boolean), ...bundlePaths];
  for (const path of pickupPaths) {
    assert.ok(path.walkthroughObjectiveIds?.includes("disc-3.the-home-front.alexandria-pickups") || bundlePaths.includes(path));
    for (const sourceId of sourcesForAll) {
      assert.ok(path.sourceIds.includes(sourceId), `${path.id} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }

  assert.ok(objectives.some((objective) => objective.id === "disc-3.the-home-front.stiltzkin-5"));
  assert.ok(objectives.some((objective) => objective.id === "disc-3.the-home-front.alexandria-pickups"));
});

test("the Treno Chimera Armlet ATE path records its later item recovery sources", () => {
  const armletPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.chimera-armlet");
  const expectedPaths = [
    "item-path.disc-3.card-tournament.chimera-armlet-city-people",
    "item-path.disc-3.the-aftermath.chimera-armlet-serpents-gate",
    "item-path.disc-3.on-the-high-seas.chimera-armlet-lindblum-shop",
    "item-path.disc-3.forgotten-continent.chimera-armlet-oeilvert-mogshop",
    "item-path.disc-3.desert-palace.chimera-armlet-mogshop",
    "item-path.disc-3.aerial-exploration.chimera-armlet-daguerreo-shop",
  ];
  const trenoAtePath = armletPaths.find((path) => path.id === expectedPaths[0]);
  const daguerreoPath = armletPaths.find((path) => path.id === expectedPaths[5]);

  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.card-tournament"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.the-aftermath"));
  assert.deepEqual(expectedPaths.map((id) => armletPaths.find((path) => path.id === id)?.id), expectedPaths);
  assert.ok(gameItems.some((item) => item.id === "game-item.chimera-armlet"));
  assert.equal(trenoAtePath?.availability, "limited-window");
  assert.equal(trenoAtePath?.recommendedBeforeChapterId, "disc-3.card-tournament");
  assert.ok(trenoAtePath?.walkthroughObjectiveIds?.includes("disc-3.card-tournament.chimera-armlet"));
  assert.ok(trenoAtePath?.walkthroughObjectiveIds?.includes("disc-3.card-tournament.ates"));
  assert.match(trenoAtePath?.notes ?? "", /does not make the item type permanently unobtainable/);
  assert.equal(daguerreoPath?.availability, "limited-window");
  assert.equal(daguerreoPath?.cost?.amount, 1200);
  assert.ok(daguerreoPath?.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.daguerreo-stock"));

  for (const path of armletPaths) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }

  for (const abilityName of ["Add Status", "Mug"]) {
    assert.ok(equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.chimera-armlet" && claim.abilityName === abilityName));
  }
  assert.ok(objectives.some((objective) => objective.id === "disc-3.card-tournament.chimera-armlet"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-3.the-aftermath"));
});

test("Rebirth Ring records its acquisition sources and synthesis ingredients", () => {
  const rebirthPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.rebirth-ring");
  const tournament = rebirthPaths.find((path) => path.id === "item-path.disc-3.card-tournament.rebirth-ring-prize");
  const chocograph = rebirthPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.rebirth-ring-forgotten-island");
  const tranceKuja = rebirthPaths.find((path) => path.id === "item-path.disc-4.the-final-battle.rebirth-ring-trance-kuja-steal");
  const synthesis = rebirthPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.daguerreo-rebirth-ring-synthesis");
  const diamondPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.diamond");
  const ankletPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.anklet");
  const peridotPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.peridot");
  const linenCuirassPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.linen-cuirass");
  const orePaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.ore");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.rebirth-ring");

  assert.ok(gameItems.some((item) => item.id === "game-item.rebirth-ring"));
  assert.ok(gameItems.some((item) => item.id === "game-item.diamond"));
  assert.ok(gameItems.some((item) => item.id === "game-item.anklet"));
  assert.ok(gameItems.some((item) => item.id === "game-item.gold-choker"));
  assert.ok(gameItems.some((item) => item.id === "game-item.peridot"));
  assert.ok(gameItems.some((item) => item.id === "game-item.linen-cuirass"));
  assert.ok(gameItems.some((item) => item.id === "game-item.ore"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.card-tournament"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.aerial-exploration"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-4.the-final-battle"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.pinnacle-rocks"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.cargo-ship"));
  assert.equal(rebirthPaths.length, 4);

  assert.equal(tournament?.availability, "limited-window");
  assert.equal(tournament?.recommendedBeforeChapterId, "disc-3.card-tournament");
  assert.ok(tournament?.walkthroughObjectiveIds?.includes("disc-3.card-tournament.rebirth-ring"));

  assert.equal(chocograph?.method, "chocograph");
  assert.ok(chocograph?.conditions?.includes("Chocograph #24"));
  assert.ok(chocograph?.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.air-garden-treasures"));

  assert.equal(tranceKuja?.availability, "one-time-encounter");
  assert.ok(tranceKuja?.conditions?.includes("point of no return"));
  assert.ok(tranceKuja?.walkthroughObjectiveIds?.includes("disc-4.the-final-battle.trance-kuja-steals"));

  assert.equal(synthesis?.cost?.amount, 7000);
  assert.equal(synthesis?.recipeId, "synthesis-recipe.rebirth-ring");
  assert.ok(synthesis?.conditions?.includes("one Diamond, one Anklet"));
  assert.equal(recipe?.cost.amount, 7000);
  assert.equal(recipe?.shopId, "daguerreo.synthesis-expert");
  assert.deepEqual(recipe?.ingredients, [
    { itemId: "game-item.diamond", quantity: 1 },
    { itemId: "game-item.anklet", quantity: 1 },
  ]);
  assert.equal(diamondPaths.length, 4);
  assert.ok(diamondPaths.some((path) => path.id === "item-path.disc-2.outer-continent.conde-petie-diamond"));
  assert.ok(diamondPaths.some((path) => path.id === "item-path.disc-3.aerial-exploration.diamond-sea-at-dusk"));
  assert.ok(diamondPaths.some((path) => path.id === "item-path.disc-3.aerial-exploration.diamond-friendly-garuda"));
  assert.ok(diamondPaths.some((path) => path.id === "item-path.disc-3.portal-to-another-world.stiltzkin-diamond"));
  assert.equal(ankletPaths.length, 5);
  assert.ok(ankletPaths.some((path) => path.id === "item-path.disc-3.desert-palace.anklet-fire-chamber"));
  const hotAndColdAnklet = ankletPaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.anklet-hot-cold");
  assert.equal(hotAndColdAnklet?.availability, "repeatable");
  assert.ok(hotAndColdAnklet?.conditions?.includes("16 digging points"));
  assert.ok(hotAndColdAnklet?.conditions?.includes("not a Mene point-redemption prize"));
  assert.ok(hotAndColdAnklet?.walkthroughObjectiveIds?.includes("disc-1.exploring-lindblum-kingdom.choco-recruit"));

  const ankletAuction = ankletPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.anklet-treno-auction");
  const ankletAuctionDisc4 = ankletPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.anklet-treno-auction");
  const ankletSynthesis = ankletPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.anklet-daguerreo-synthesis");
  const ankletRecipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.anklet");
  assert.equal(ankletAuction?.method, "auction");
  assert.equal(ankletAuction?.cost, undefined);
  assert.ok(ankletAuction?.conditions?.includes("no Anklet is in the inventory"));
  assert.equal(ankletAuctionDisc4?.chapterId, "disc-4.return-to-gaia");
  assert.equal(ankletSynthesis?.cost?.amount, 4000);
  assert.deepEqual(ankletRecipe?.ingredients, [
    { itemId: "game-item.gold-choker", quantity: 1 },
    { itemId: "game-item.peridot", quantity: 1 },
  ]);

  const goldChokerRecipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.gold-choker");
  const oreSynthesisRecipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.peridot");
  const goldChokerPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.gold-choker-synthesis");
  const peridotSynthesisPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.peridot-daguerreo-synthesis");
  const oreDigPath = orePaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.ore-hot-cold-dig");
  const oreRedemptionPath = orePaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.ore-hot-cold-redemption");
  const oreExtractionPath = orePaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.ore-jewel-extraction");
  const ramuhPeridot = peridotPaths.find((path) => path.id === "item-path.disc-2.pinnacle-rocks.ramuh-peridot");
  const chocographPeridots = peridotPaths.find((path) => path.id === "item-path.disc-2.outer-continent.peridot-abandoned-beach");
  const alexandriaPeridot = peridotPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.peridot-alexandria-harbor");
  const startingLinenCuirass = linenCuirassPaths.find((path) => path.method === "starting-equipment");
  assert.equal(goldChokerPath?.cost?.amount, 1300);
  assert.equal(goldChokerRecipe?.cost.amount, 1300);
  assert.deepEqual(goldChokerRecipe?.ingredients, [
    { itemId: "game-item.linen-cuirass", quantity: 1 },
    { itemId: "game-item.soft", quantity: 1 },
  ]);
  assert.equal(oreSynthesisRecipe?.cost.amount, 100);
  assert.deepEqual(oreSynthesisRecipe?.ingredients, [
    { itemId: "game-item.ore", quantity: 1 },
    { itemId: "game-item.soft", quantity: 1 },
  ]);
  assert.equal(peridotSynthesisPath?.recipeId, "synthesis-recipe.peridot");
  assert.equal(peridotSynthesisPath?.cost?.amount, 100);
  assert.equal(oreDigPath?.availability, "repeatable");
  assert.ok(oreDigPath?.conditions?.includes("two digging points"));
  assert.ok(oreRedemptionPath?.conditions?.includes("250 Hot & Cold points"));
  assert.equal(oreRedemptionPath?.method, "point-redemption");
  assert.ok(oreExtractionPath?.conditions?.includes("Jewel"));
  assert.equal(oreExtractionPath?.method, "ability-extract");
  assert.ok(ramuhPeridot?.walkthroughObjectiveIds?.includes("disc-2.pinnacle-rocks.ramuh"));
  assert.equal(peridotPaths.length, 18);
  assert.equal(orePaths.length, 52);
  for (const id of [
    "item-path.disc-2.battle-of-iifa-tree.mistodon-upper-pair-ore-common-steal",
    "item-path.disc-2.battle-of-iifa-tree.mistodon-after-dagger-ore-common-steal",
    "item-path.disc-2.battle-of-iifa-tree.mistodon-downhill-ore-common-steal",
  ]) assert.ok(orePaths.some((path) => path.id === id));
  assert.equal(chocographPeridots?.quantity, 12);
  assert.ok(alexandriaPeridot?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.alexandria-ruins"));
  assert.ok(startingLinenCuirass?.conditions?.includes("Freya joins the party"));
  assert.equal(linenCuirassPaths.length, 6);
  assert.ok(linenCuirassPaths.some((path) => path.id === "item-path.disc-2.journey-to-cleyra.atla-mogshop.linen-cuirass"));
  assert.deepEqual(
    equipmentAbilityClaims
      .filter((claim) => ["game-item.anklet", "game-item.peridot", "game-item.gold-choker", "game-item.linen-cuirass"].includes(claim.itemId))
      .map((claim) => `${claim.itemId}:${claim.abilityName}`)
      .sort(),
    [
      "game-item.anklet:Counter",
      "game-item.anklet:Healer",
      "game-item.anklet:Locomotion",
      "game-item.gold-choker:Auto-Potion",
      "game-item.gold-choker:Flee-Gil",
      "game-item.gold-choker:Shell",
      "game-item.linen-cuirass:Cover",
      "game-item.peridot:Ramuh",
      "game-item.peridot:Thundara",
    ].sort(),
  );

  for (const path of [...rebirthPaths, ...diamondPaths, ...ankletPaths, ...peridotPaths, ...linenCuirassPaths, ...orePaths, ...(goldChokerPath ? [goldChokerPath] : [])]) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }

  assert.deepEqual(
    equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.rebirth-ring").map((claim) => claim.abilityName).sort(),
    ["Auto-Life", "Life", "Revive"],
  );
  assert.ok(objectives.some((objective) => objective.id === "disc-3.card-tournament.rebirth-ring"));
  assert.ok(objectives.some((objective) => objective.id === "disc-4.the-final-battle.trance-kuja-steals"));
  assert.ok(objectives.some((objective) => objective.id === "disc-3.desert-palace.bloodstones"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-4.the-final-battle"));
});

test("Peridot enemy routes record their source, repeatability, and conditional windows", () => {
  const enemyPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.peridot" && path.sourceIds.includes("gamefaqs-enemy-list-71891"));
  const expectedIds = [
    "item-path.disc-2.journey-to-outer-continent.griffin-peridot-drop",
    "item-path.disc-2.battle-of-iifa-tree.mistodon-a-peridot-drop",
    "item-path.disc-2.iifa-tree.stroper-peridot-drop",
    "item-path.disc-2.iifa-tree.stroper-peridot-steal",
    "item-path.disc-3.lost-continent.grenade-peridot-drop",
    "item-path.disc-3.ipsens-castle.tonberry-peridot-drop",
    "item-path.disc-4.return-to-gaia.mistodon-b-peridot-drop",
    "item-path.disc-4.memoria.tiamat-crystal-peridot-drop",
    "item-path.disc-3.forgotten-continent.epitaph-quina-mirror-peridot-drop",
    "item-path.disc-3.forgotten-continent.epitaph-quina-mirror-peridot-steal",
    "item-path.disc-3.forgotten-continent.epitaph-vivi-mirror-peridot-drop",
    "item-path.disc-3.forgotten-continent.epitaph-vivi-mirror-peridot-steal",
  ];
  const byId = new Map(enemyPaths.map((path) => [path.id, path]));
  const griffin = byId.get(expectedIds[0]);
  const mistodonA = byId.get(expectedIds[1]);
  const grenade = byId.get(expectedIds[4]);
  const tiamat = byId.get(expectedIds[7]);
  const mirrorPaths = expectedIds.slice(8).map((id) => byId.get(id));

  assert.equal(enemyPaths.length, 12);
  assert.deepEqual(expectedIds.filter((id) => !byId.has(id)), []);
  assert.ok(griffin);
  assert.equal(griffin.method, "drop");
  assert.equal(griffin.availability, "repeatable");
  assert.match(griffin.conditions ?? "", /always drops one Peridot/i);
  assert.ok(mistodonA);
  assert.equal(mistodonA.availability, "window-unverified");
  assert.match(mistodonA.conditions ?? "", /disputed/i);
  assert.ok(mistodonA.walkthroughObjectiveIds?.includes("disc-2.battle-of-iifa-tree.mistodon-steals"));
  assert.ok(grenade);
  assert.ok(!grenade.sourceIds.includes("cavesofnarshe-peridot"));
  assert.match(grenade.conditions ?? "", /Caves of Narshe.*omits/i);
  assert.ok(tiamat);
  assert.equal(tiamat.availability, "repeatable");
  assert.equal(tiamat.enemyId, "enemy.tiamat-crystal-world");
  assert.equal(tiamat.enemyLootSlot, "common");
  assert.deepEqual(tiamat.encounterIds, ["encounter.memoria.tiamat-crystal-world"]);
  assert.match(tiamat.conditions ?? "", /96\/256/);
  assert.match(tiamat.conditions ?? "", /not guaranteed/i);
  assert.match(tiamat.notes ?? "", /revived guardians lack Steals and Drops/);
  assert.ok(!tiamat.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-achievement"));
  assert.ok(mirrorPaths.every((path) => path?.availability === "conditional"));
  assert.ok(mirrorPaths.every((path) => /Quina|Vivi/.test(path?.conditions ?? "")));
  assert.deepEqual(
    ["disc-2.iifa-tree", "disc-2.battle-of-iifa-tree", "disc-3.ipsens-castle"].filter((id) => !itemCatalogCoverage.chapterIds.includes(id)),
    [],
  );

  for (const path of enemyPaths) {
    assert.ok(path.sourceIds.includes("gamefaqs-enemy-list-71891"));
    assert.ok(sources.some((source) => source.id === "gamefaqs-enemy-list-71891"));
    if (path !== grenade) assert.ok(path.sourceIds.includes("cavesofnarshe-peridot"), `${path.id} is missing the independent item reference`);
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }

  assert.equal(itemAcquisitionPaths.filter((path) => path.itemId === "game-item.peridot").length, 18);
  assert.ok(objectives.some((objective) => objective.id === "disc-4.memoria.tiamat-achievement"));
});

test("Crystal World Tiamat [B] has a separate source-scoped encounter and all eight loot paths", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.tiamat-crystal-world");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.memoria.tiamat-crystal-world");
  const timeIntervalTiamat = enemyRecords.find((entry) => entry.id === "enemy.tiamat-memoria");
  const twister = enemy?.blueMagic.find((entry) => entry.name === "Twister");
  const expected = [
    { id: "item-path.disc-4.memoria.tiamat-crystal-ether-common-steal", itemId: "game-item.ether", method: "steal", slot: "common", rate: "256/256" },
    { id: "item-path.disc-4.memoria.tiamat-crystal-ether-uncommon-steal", itemId: "game-item.ether", method: "steal", slot: "uncommon", rate: "64/256" },
    { id: "item-path.disc-4.memoria.tiamat-crystal-wing-edge-steal", itemId: "game-item.wing-edge", method: "steal", slot: "semi-rare", rate: "16/256", extraSources: ["gamefaqs-item-locations-54996", "gamefaqs-items-71891"] },
    { id: "item-path.disc-4.memoria.tiamat-crystal-wing-edge-rare-steal", itemId: "game-item.wing-edge", method: "steal", slot: "rare", rate: "1/256", extraSources: ["gamefaqs-item-locations-54996", "gamefaqs-items-71891"] },
    { id: "item-path.disc-4.memoria.tiamat-crystal-remedy-always-drop", itemId: "game-item.remedy", method: "drop", slot: "always" },
    { id: "item-path.disc-4.memoria.tiamat-crystal-peridot-drop", itemId: "game-item.peridot", method: "drop", slot: "common", rate: "96/256", extraSources: ["cavesofnarshe-peridot"] },
    { id: "item-path.disc-4.memoria.tiamat-crystal-phoenix-down-uncommon-drop", itemId: "game-item.phoenix-down", method: "drop", slot: "uncommon", rate: "32/256" },
    { id: "item-path.disc-4.memoria.tiamat-crystal-echo-screen-rare-drop", itemId: "game-item.echo-screen", method: "drop", slot: "rare", rate: "1/256" },
  ];
  const crystalLootPaths = itemAcquisitionPaths.filter((path) => path.enemyId === "enemy.tiamat-crystal-world");

  assert.ok(enemy);
  assert.equal(enemy.name, "Tiamat [B]");
  assert.equal(enemy.kind, "ordinary");
  assert.deepEqual(enemy.stats.map(({ field, value }) => [field, value]), [["level", 71], ["HP", 24127], ["MP", 3338], ["EXP", 0], ["AP", 7], ["Gil", 2956]]);
  assert.deepEqual(enemy.encounterIds, ["encounter.memoria.tiamat-crystal-world"]);
  assert.ok(!enemy.facts.some((fact) => fact.label === "Float" || fact.label === "Snort"));
  assert.ok(timeIntervalTiamat?.encounterIds.includes("encounter.memoria.tiamat"));
  assert.ok(!timeIntervalTiamat?.encounterIds.includes("encounter.memoria.tiamat-crystal-world"));
  assert.ok(encounter);
  assert.equal(encounter.kind, "random-pool");
  assert.equal(encounter.location, "Crystal World");
  assert.deepEqual(encounter.formation, [{ enemyId: "enemy.tiamat-crystal-world", quantity: null }]);
  assert.match(encounter.notes.join(" "), /loot table\/prose conflict remains unresolved/);
  assert.ok(twister);
  assert.equal(twister.command, "Eat");
  assert.ok(twister.objectiveIds.includes("disc-4.memoria.quina-blue-magic"));
  assert.ok(twister.objectiveIds.includes("disc-3.lost-continent.mount-gulug-blue-magic"));
  assert.deepEqual([...enemy.routeObjectiveIds].sort(), ["disc-3.lost-continent.mount-gulug-blue-magic", "disc-4.memoria.quina-blue-magic"].sort());
  assert.equal(crystalLootPaths.length, 8);

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const lootTable = expectedPath.method === "steal" ? enemy.steals : enemy.drops;
    const slot = lootTable.find((entry) => entry.itemId === expectedPath.itemId && entry.slot === expectedPath.slot);
    const requiredSources = new Set([...(enemy.sourceIds ?? []), ...(encounter.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.ok(slot, `${expectedPath.id} matches an enemy loot slot`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.method, expectedPath.method);
    assert.equal(path?.availability, "repeatable");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, "enemy.tiamat-crystal-world");
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.memoria.tiamat-crystal-world"]);
    assert.match(path?.notes ?? "", /revived guardians lack Steals and Drops/);
    assert.ok(!path?.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-achievement"));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains enemy, encounter, and slot provenance`);
    assert.ok((expectedPath.extraSources ?? []).every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains item-specific provenance`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
    }

    if (expectedPath.method === "steal") {
      assert.match(path?.conditions ?? "", /Steal attempt can fail/);
    } else if (expectedPath.slot === "always") {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /KO victory/);
    } else {
      assert.match(path?.conditions ?? "", /conditional and not guaranteed/);
      assert.match(path?.conditions ?? "", /KO victory/);
    }
    if (expectedPath.rate) {
      assert.match(path?.conditions ?? "", new RegExp(expectedPath.rate.replace("/", "\\/")));
      assert.match(path?.conditions ?? "", /source-reported|source-reported, not release-verified|not release-verified/);
    }
  }
});

test("Earth Guardian item paths link both conditional steals and its Always Phoenix Pinion drop", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.earth-guardian");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.breaking-the-seal.earth-guardian");
  const expected = [
    { id: "item-path.disc-3.breaking-the-seal.earth-guardian-avenger-steal", itemId: "game-item.avenger", method: "steal", slot: "common", rate: "70%", objectiveId: "disc-3.breaking-the-seal.earth-guardian-steals" },
    { id: "item-path.disc-3.breaking-the-seal.earth-guardian-rubber-suit-steal", itemId: "game-item.rubber-suit", method: "steal", slot: "uncommon", rate: "23%", objectiveId: "disc-3.breaking-the-seal.earth-guardian-steals" },
    { id: "item-path.disc-3.breaking-the-seal.earth-guardian-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always", objectiveId: "disc-3.breaking-the-seal.complete-shrines" },
  ];

  assert.ok(enemy);
  assert.equal(enemy.kind, "boss");
  assert.ok(encounter);
  assert.equal(encounter.kind, "boss");
  assert.deepEqual(encounter.formation, [{ enemyId: "enemy.earth-guardian", quantity: 1 }]);

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const lootTable = expectedPath.method === "steal" ? enemy.steals : enemy.drops;
    const slot = lootTable.find((entry) => entry.itemId === expectedPath.itemId && entry.slot === expectedPath.slot);
    const requiredSources = new Set([...(enemy.sourceIds ?? []), ...(encounter.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.ok(slot, `${expectedPath.id} matches an enemy loot slot`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.chapterId, "disc-3.breaking-the-seal");
    assert.equal(path?.method, expectedPath.method);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, "enemy.earth-guardian");
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.breaking-the-seal.earth-guardian"]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(expectedPath.objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains enemy, encounter, and slot provenance`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
    }

    if (expectedPath.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(expectedPath.rate));
      assert.match(path?.conditions ?? "", /source-reported/);
      assert.match(path?.conditions ?? "", /Steal attempt can fail/);
    } else {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /guaranteed after defeating the boss/);
    }
  }

  assert.match(itemAcquisitionPaths.find((path) => path.id === expected[0].id)?.conditions ?? "", /Moorock's Bran Bal Mogshop/);
  assert.match(itemAcquisitionPaths.find((path) => path.id === expected[1].id)?.conditions ?? "", /Black Cat synthesis for 20,000 Gil/);
});

test("Nova Dragon item paths link its Grand Armor steal and Always Wing Edge drop to exact slots", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.nova-dragon");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.iifa-tree.nova-dragon");
  const expected = [
    { id: "item-path.disc-4.second-battle-of-iifa-tree.nova-dragon-grand-armor-steal", itemId: "game-item.grand-armor", method: "steal", slot: "rare", objectiveId: "disc-4.second-battle-of-iifa-tree.nova-dragon-steals" },
    { id: "item-path.disc-4.second-battle-of-iifa-tree.nova-dragon-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", objectiveId: "disc-4.second-battle-of-iifa-tree.memoria-entry" },
  ];
  const recovery = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.black-mage-village-grand-armor-synthesis");

  assert.ok(enemy);
  assert.equal(enemy.kind, "boss");
  assert.ok(encounter);
  assert.equal(encounter.kind, "boss");
  assert.deepEqual(encounter.formation, [{ enemyId: "enemy.nova-dragon", quantity: 1 }]);

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const lootTable = expectedPath.method === "steal" ? enemy.steals : enemy.drops;
    const slot = lootTable.find((entry) => entry.itemId === expectedPath.itemId && entry.slot === expectedPath.slot);
    const requiredSources = new Set([...(enemy.sourceIds ?? []), ...(encounter.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.ok(slot, `${expectedPath.id} matches an enemy slot`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.chapterId, "disc-4.second-battle-of-iifa-tree");
    assert.equal(path?.method, expectedPath.method);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, "enemy.nova-dragon");
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.iifa-tree.nova-dragon"]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(expectedPath.objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains enemy, encounter, and slot sources`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
    }
    if (expectedPath.method === "steal") {
      assert.match(path?.conditions ?? "", /0\.4% chance per connected steal check/);
      assert.match(path?.conditions ?? "", /source-reported, not release-verified/);
      assert.match(path?.notes ?? "", /GameFAQs labels the slot Rare; Jegged calls it Very Rare/);
    } else {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", /after boss victory/);
      assert.ok(path?.sourceIds.includes("jegged-memoria-nova-dragon"));
    }
  }

  assert.ok(recovery);
  assert.equal(recovery?.method, "synthesis");
  assert.equal(recovery?.availability, "conditional");
  assert.equal(recovery?.cost?.amount, 45000);
  assert.match(recovery?.conditions ?? "", /Mythril Sword/);
});

test("Pandemonium item paths link Silver Dragon, Garland, and Kuja loot to exact slots", () => {
  const expected = [
    { id: "item-path.disc-3.portal-to-another-world.silver-dragon-wing-edge-drop", itemId: "game-item.wing-edge", method: "drop", slot: "always", enemyId: "enemy.silver-dragon", encounterId: "encounter.pandemonium.silver-dragon", objectiveId: "disc-3.portal-to-another-world.pandemonium-climax", outcome: "after the Observatory boss victory" },
    { id: "item-path.disc-3.portal-to-another-world.garland-battle-boots-steal", itemId: "game-item.battle-boots", method: "steal", slot: "common", enemyId: "enemy.garland", encounterId: "encounter.pandemonium.garland", objectiveId: "disc-3.portal-to-another-world.pandemonium-boss-steals", rate: "70% chance per connected steal check", recovery: "Battle Boots chest is available earlier in the Maze" },
    { id: "item-path.disc-3.portal-to-another-world.pandemonium-carabini-mail-kuja-steal", itemId: "game-item.carabini-mail", method: "steal", slot: "uncommon", enemyId: "enemy.kuja", encounterId: "encounter.pandemonium.kuja", objectiveId: "disc-3.portal-to-another-world.pandemonium-boss-steals", rate: "23% chance per connected steal check", recovery: "alternate item copy after the maze chest" },
  ];

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const enemy = enemyRecords.find((entry) => entry.id === expectedPath.enemyId);
    const encounter = enemyEncounters.find((entry) => entry.id === expectedPath.encounterId);
    const lootTable = expectedPath.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === expectedPath.itemId && entry.slot === expectedPath.slot);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.ok(enemy, `${expectedPath.enemyId} exists`);
    assert.equal(enemy?.kind, "boss");
    assert.ok(encounter, `${expectedPath.encounterId} exists`);
    assert.equal(encounter?.kind, "boss");
    assert.deepEqual(encounter?.formation, [{ enemyId: expectedPath.enemyId, quantity: 1 }]);
    assert.ok(slot, `${expectedPath.id} matches an enemy loot slot`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.chapterId, "disc-3.portal-to-another-world");
    assert.equal(path?.method, expectedPath.method);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, expectedPath.enemyId);
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, [expectedPath.encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(expectedPath.objectiveId));
    assert.ok(encounter?.objectiveIds.includes(expectedPath.objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains enemy, encounter, and slot provenance`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
    }

    if (expectedPath.method === "steal") {
      assert.match(path?.conditions ?? "", new RegExp(expectedPath.rate));
      assert.match(path?.conditions ?? "", /source-reported, not release-verified/);
      assert.match(path?.conditions ?? "", new RegExp(expectedPath.recovery, "i"));
    } else {
      assert.match(path?.conditions ?? "", /Always drop/);
      assert.match(path?.conditions ?? "", new RegExp(expectedPath.outcome));
    }
  }
});

test("Soulcage item paths link every sourced steal and drop slot to its one-time encounter", () => {
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.soulcage");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.iifa-tree.soulcage");
  const expected = [
    { id: "item-path.disc-2.iifa-tree.soulcage-oak-staff-steal", itemId: "game-item.oak-staff", method: "steal", slot: "common", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Common slot", "each attempt can fail"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-magician-cloak-steal", itemId: "game-item.magician-cloak", method: "steal", slot: "uncommon", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Uncommon slot", "each attempt can fail"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-brigandine-steal", itemId: "game-item.brigandine", method: "steal", slot: "semi-rare", objectiveId: "disc-2.iifa-tree.soulcage-steals", markers: ["Semi-Rare slot", "each attempt can fail", "Caves of Narshe calls it Rare"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-phoenix-pinion-drop", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always", objectiveId: null, markers: ["normal KO victory", "Always Phoenix Pinion", "Opa-Til"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-elixir-common-drop", itemId: "game-item.elixir", method: "drop", slot: "common", objectiveId: null, markers: ["normal KO victory", "37.5%", "source-reported, not release-verified", "Opa-Til lists one Common Elixir slot"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-elixir-uncommon-drop", itemId: "game-item.elixir", method: "drop", slot: "uncommon", objectiveId: null, markers: ["normal KO victory", "12.5%", "source-reported, not release-verified", "Opa-Til lists only the Common Elixir slot"] },
    { id: "item-path.disc-2.iifa-tree.soulcage-elixir-rare-drop", itemId: "game-item.elixir", method: "drop", slot: "rare", objectiveId: null, markers: ["normal KO victory", "0.391%", "source-reported, not release-verified", "Opa-Til lists only the Common Elixir slot"] },
  ];

  assert.ok(enemy);
  assert.equal(enemy?.kind, "boss");
  assert.ok(encounter);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId: "enemy.soulcage", quantity: 1 }]);
  assert.ok(enemy?.sourceIds.includes("opatil-drop-list"));

  const itemBearingSlots = [
    ...enemy.steals.filter((slot) => slot.itemId).map((slot) => ({ method: "steal", slot: slot.slot, itemId: slot.itemId })),
    ...enemy.drops.filter((slot) => slot.itemId).map((slot) => ({ method: "drop", slot: slot.slot, itemId: slot.itemId })),
  ].sort((a, b) => `${a.method}-${a.slot}-${a.itemId}`.localeCompare(`${b.method}-${b.slot}-${b.itemId}`));
  assert.deepEqual(itemBearingSlots, expected.map(({ method, slot, itemId }) => ({ method, slot, itemId }))
    .sort((a, b) => `${a.method}-${a.slot}-${a.itemId}`.localeCompare(`${b.method}-${b.slot}-${b.itemId}`)));

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const lootTable = expectedPath.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.itemId === expectedPath.itemId && entry.slot === expectedPath.slot);
    const requiredSources = new Set([...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.ok(slot, `${expectedPath.id} matches an enemy slot`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.chapterId, "disc-2.iifa-tree");
    assert.equal(path?.method, expectedPath.method);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.enemyId, "enemy.soulcage");
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.iifa-tree.soulcage"]);
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${expectedPath.id} retains enemy, encounter, and slot provenance`);
    for (const marker of expectedPath.markers) {
      assert.ok(path?.conditions?.includes(marker) || path?.notes?.includes(marker), `${expectedPath.id} retains ${marker}`);
    }
    if (expectedPath.objectiveId) assert.ok(path?.walkthroughObjectiveIds?.includes(expectedPath.objectiveId));
    else assert.ok(!path?.walkthroughObjectiveIds?.includes("disc-2.iifa-tree.soulcage-steals"), `${expectedPath.id} is not misfiled under the steal checklist`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
    }
  }
});

test("Disc II Mistodon steals separate fixed fights from the unverified downhill pool", () => {
  const expected = [
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-upper-pair-ore-common-steal", itemId: "game-item.ore", slot: "common", encounterId: "encounter.iifa-tree-return.mistodon-upper-pair", availability: "one-time-encounter", routeSourceId: "gamefaqs-battle-iifa-tree-71891" },
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-upper-pair-hi-potion-uncommon-steal", itemId: "game-item.hi-potion", slot: "uncommon", encounterId: "encounter.iifa-tree-return.mistodon-upper-pair", availability: "one-time-encounter", routeSourceId: "gamefaqs-battle-iifa-tree-71891" },
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-after-dagger-ore-common-steal", itemId: "game-item.ore", slot: "common", encounterId: "encounter.iifa-tree-return.mistodon-after-dagger", availability: "one-time-encounter", routeSourceId: "jegged-iifa-tree-revisited" },
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-after-dagger-hi-potion-uncommon-steal", itemId: "game-item.hi-potion", slot: "uncommon", encounterId: "encounter.iifa-tree-return.mistodon-after-dagger", availability: "one-time-encounter", routeSourceId: "jegged-iifa-tree-revisited" },
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-downhill-ore-common-steal", itemId: "game-item.ore", slot: "common", encounterId: "encounter.iifa-tree-return.mistodon-reported-downhill-pool", availability: "window-unverified", routeSourceId: "gamefaqs-wrapping-up-disc-2-79143" },
    { id: "item-path.disc-2.battle-of-iifa-tree.mistodon-downhill-hi-potion-uncommon-steal", itemId: "game-item.hi-potion", slot: "uncommon", encounterId: "encounter.iifa-tree-return.mistodon-reported-downhill-pool", availability: "window-unverified", routeSourceId: "gamefaqs-wrapping-up-disc-2-79143" },
  ];

  for (const expectedPath of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.id);
    const enemy = enemyRecords.find((entry) => entry.id === "enemy.mistodon-a");
    const encounter = enemyEncounters.find((entry) => entry.id === expectedPath.encounterId);
    const lootSlot = enemy?.steals.find((entry) => entry.slot === expectedPath.slot && entry.itemId === expectedPath.itemId);

    assert.ok(path, `${expectedPath.id} exists`);
    assert.equal(encounter?.chapterId, "disc-2.battle-of-iifa-tree");
    assert.ok(encounter?.formation.some((entry) => entry.enemyId === "enemy.mistodon-a"), `${expectedPath.id} encounter contains Mistodon [A]`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.availability, expectedPath.availability);
    assert.equal(path?.enemyId, "enemy.mistodon-a");
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, [expectedPath.encounterId]);
    assert.equal(path?.quantity, 1);
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-2.battle-of-iifa-tree.mistodon-steals"));
    assert.ok(path?.sourceIds.includes("gamefaqs-enemy-list-71891"), `${expectedPath.id} cites the enemy loot table`);
    assert.ok(path?.sourceIds.includes(expectedPath.routeSourceId), `${expectedPath.id} cites its route/encounter source`);
    assert.ok(path?.sourceIds.includes(lootSlot?.sourceIds[0] ?? ""), `${expectedPath.id} cites the steal slot`);
    for (const sourceId of path?.sourceIds ?? []) assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.id} references known source ${sourceId}`);
  }

  const downhillPaths = expected.filter((entry) => entry.availability === "window-unverified");
  assert.equal(downhillPaths.length, 2);
  assert.ok(downhillPaths.every((entry) => itemAcquisitionPaths.find((path) => path.id === entry.id)?.conditions?.includes("not confirmed as repeatable")));
  assert.equal(missables.find((entry) => entry.id === "missable.disc-2.battle-of-iifa-tree.mistodon-steals")?.classification.includes("permanent"), false);
});

test("Silk Robe has its frog reward, synthesis recovery, and sourced ingredients", () => {
  const silkRobePaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.silk-robe");
  const expectedSynthesisIds = [
    "item-path.disc-3.card-tournament.silk-robe-treno-synthesis",
    "item-path.disc-2.return-to-lindblum.silk-robe-synthesis",
    "item-path.disc-2.outer-continent.silk-robe-black-mage-village-synthesis",
    "item-path.disc-3.the-home-front.silk-robe-alexandria-synthesis",
    "item-path.disc-3.aerial-exploration.silk-robe-daguerreo-synthesis",
  ];
  const frogReward = silkRobePaths.find((path) => path.id === "item-path.disc-1.exploring-lindblum-kingdom.silk-robe-nine-frogs");
  const synthesisPaths = expectedSynthesisIds.map((id) => silkRobePaths.find((path) => path.id === id));
  const silkShirt = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.village-of-dali.silk-shirt-shop");
  const bandana = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.bandana-shop");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.silk-robe");

  assert.equal(gameItems.find((item) => item.id === "game-item.silk-shirt")?.name, "Silk Shirt");
  assert.equal(silkRobePaths.length, 7);
  assert.equal(frogReward?.method, "quest-reward");
  assert.equal(frogReward?.availability, "single-use");
  assert.match(frogReward?.conditions ?? "", /nine frogs/i);
  assert.ok(frogReward?.walkthroughObjectiveIds?.includes("disc-1.exploring-lindblum-kingdom.frog-catching"));
  assert.ok(synthesisPaths.every((path) => path?.method === "synthesis" && path.recipeId === "synthesis-recipe.silk-robe"));
  assert.ok(synthesisPaths.every((path) => path?.availability === "repeatable" && path.cost?.amount === 2000));
  assert.match(silkRobePaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.silk-robe-synthesis")?.conditions ?? "", /disc number/i);
  assert.deepEqual(recipe?.ingredients, [
    { itemId: "game-item.silk-shirt", quantity: 1 },
    { itemId: "game-item.bandana", quantity: 1 },
  ]);
  assert.equal(recipe?.cost.amount, 2000);
  assert.ok(silkShirt);
  assert.equal(silkShirt.cost?.amount, 400);
  assert.ok(bandana);
  assert.equal(bandana.cost?.amount, 500);
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.village-of-dali"));
  assert.ok(sources.some((source) => source.id === "cavesofnarshe-ff9-robes"));

  for (const path of [...silkRobePaths, ...(silkShirt ? [silkShirt] : []), ...(bandana ? [bandana] : [])]) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
  for (const sourceId of recipe?.sourceIds ?? []) {
    assert.ok(sources.some((source) => source.id === sourceId), `recipe references unknown source ${sourceId}`);
  }

});

test("Phoenix Pinion and Gysahl Greens have source-backed acquisition and recipe paths", () => {
  const pinionPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.phoenix-pinion");
  const pinionsById = new Map(pinionPaths.map((path) => [path.id, path]));
  const greenPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.gysahl-greens");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.phoenix-pinion");
  const synthesisPath = pinionsById.get("item-path.disc-4.memoria.phoenix-pinion-hades-synthesis");
  const fixedCleyra = [
    "item-path.disc-2.cleyra.first-staircase-phoenix-pinion",
    "item-path.disc-2.cleyra.bridge-mushrooms-phoenix-pinion",
    "item-path.disc-2.cleyra.harproom-phoenix-pinion",
  ].map((id) => pinionsById.get(id));
  const bossDrops = pinionPaths.filter((path) => path.method === "drop");
  const redemption = pinionsById.get("item-path.disc-1.exploring-lindblum-kingdom.phoenix-pinion-mene-redemption");
  const kuponut = pinionsById.get("item-path.disc-4.return-to-gaia.phoenix-pinion-kupo-nut");
  const chocoFive = pinionsById.get("item-path.disc-2.outer-continent.phoenix-pinion-abandoned-beach");
  const chocoSeventeen = pinionsById.get("item-path.disc-3.aerial-exploration.phoenix-pinion-sea-at-dusk");
  const cavesItems = sources.find((source) => source.id === "cavesofnarshe-ff9-items");
  const cavesChocobo = sources.find((source) => source.id === "cavesofnarshe-ff9-chocobo-guide");

  assert.equal(pinionPaths.length, 49);
  assert.equal(pinionsById.get("item-path.disc-1.alexandria.phoenix-pinion-starting")?.method, "starting-inventory");
  assert.equal(fixedCleyra.length, 3);
  assert.ok(fixedCleyra.every((path) => path?.availability === "single-use"));
  assert.equal(pinionsById.get("item-path.disc-2.cleyra.evacuation-cathedral-phoenix-pinion")?.availability, "conditional");
  assert.equal(pinionsById.get("item-path.disc-2.cleyra.stiltzkin-2-phoenix-pinion")?.cost?.amount, 444);
  assert.equal(pinionsById.get("item-path.disc-2.journey-to-outer-continent.stiltzkin-3-phoenix-pinion")?.cost?.amount, 555);
  assert.equal(chocoFive?.quantity, 9);
  assert.equal(chocoSeventeen?.quantity, 15);
  assert.equal(redemption?.method, "point-redemption");
  assert.match(redemption?.conditions ?? "", /150 Hot & Cold points/);
  assert.match(redemption?.conditions ?? "", /Phoenix Down/);
  assert.equal(kuponut?.availability, "conditional");
  assert.equal(bossDrops.length, 5);
  assert.ok(bossDrops.every((path) => path.availability === "one-time-encounter"));
  assert.ok(synthesisPath);
  assert.deepEqual(recipe?.ingredients, [
    { itemId: "game-item.phoenix-down", quantity: 1 },
    { itemId: "game-item.gysahl-greens", quantity: 1 },
  ]);
  assert.equal(recipe?.cost.amount, 300);
  assert.ok(equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.phoenix-pinion" && claim.abilityName === "Phoenix"));

  assert.equal(greenPaths.length, 6);
  assert.equal(greenPaths.find((path) => path.method === "shop")?.cost?.amount, 80);
  assert.match(greenPaths.find((path) => path.method === "point-redemption")?.conditions ?? "", /10 Hot & Cold points/);
  assert.ok(cavesItems?.notes.includes("Earth Guardian, Kraken, Lich, Maliris, and Soulcage"));
  assert.ok(cavesChocobo?.notes.includes("Phoenix Down"));

  for (const path of [...pinionPaths, ...greenPaths]) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
  for (const sourceId of recipe?.sourceIds ?? []) {
    assert.ok(sources.some((source) => source.id === sourceId), `recipe references unknown source ${sourceId}`);
  }
});

test("Magician Shoes and Bone Wrist have sourced acquisition and recovery paths", () => {
  const magicianShoes = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.magician-shoes");
  const boneWrist = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.bone-wrist");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.magician-shoes");
  const stealObjective = objectives.find((objective) => objective.id === "disc-2.journey-to-cleyra.ralvurahva-steals");
  const warning = missables.find((entry) => entry.id === "missable.disc-2.journey-to-cleyra.ralvurahva-steals");
  const shoesClaims = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.magician-shoes");

  assert.equal(magicianShoes.length, 8);
  assert.equal(magicianShoes.filter((path) => path.method === "chest").length, 2);
  assert.equal(magicianShoes.filter((path) => path.method === "synthesis").length, 6);
  assert.equal(boneWrist.length, 7);
  assert.equal(boneWrist.filter((path) => path.method === "shop").length, 6);
  assert.equal(boneWrist.find((path) => path.method === "steal")?.availability, "one-time-encounter");
  assert.deepEqual(recipe?.ingredients, [
    { itemId: "game-item.germinas-boots", quantity: 1 },
    { itemId: "game-item.bone-wrist", quantity: 1 },
  ]);
  assert.equal(recipe?.cost.amount, 1500);
  assert.equal(shoesClaims.length, 3);
  assert.deepEqual(new Set(shoesClaims.map((claim) => claim.abilityName)), new Set(["Blind", "Clear Headed", "MP+10%"]));
  assert.equal(equipmentAbilityClaims.find((claim) => claim.itemId === "game-item.bone-wrist")?.abilityName, "Add Status");
  assert.ok(stealObjective?.sourceIds.includes("gamefaqs-items-71891"));
  assert.ok(warning?.recovery?.includes("Bone Wrist"));
  assert.ok(warning?.recovery?.includes("Mythril Fork later at Conde Petie, Black Mage Village, Lindblum, or Esto Gaza"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.journey-to-cleyra"));

  for (const path of [...magicianShoes, ...boneWrist]) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
  for (const sourceId of recipe?.sourceIds ?? []) {
    assert.ok(sources.some((source) => source.id === sourceId), `recipe references unknown source ${sourceId}`);
  }
});

test("Silk Shirt has source-backed starting, encounter, reward, and shop routes", () => {
  const silkShirtPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.silk-shirt");
  const pathsById = new Map(silkShirtPaths.map((path) => [path.id, path]));
  const blankCopy = pathsById.get("item-path.disc-1.evil-forest.blank-silk-shirt");
  const blackWaltzSteal = pathsById.get("item-path.disc-1.ice-cavern.black-waltz-1-silk-shirt-steal");
  const swordfightReward = pathsById.get("item-path.disc-1.alexandria.swordfight-silk-shirt-reward");
  const shopPaths = [
    "item-path.disc-1.village-of-dali.silk-shirt-shop",
    "item-path.disc-2.treno.silk-shirt-shop",
    "item-path.disc-2.return-to-lindblum.silk-shirt-shop",
    "item-path.disc-2.outer-continent.silk-shirt-black-mage-village-shop",
  ].map((id) => pathsById.get(id));

  assert.equal(silkShirtPaths.length, 9);
  assert.equal(pathsById.get("item-path.disc-1.ice-cavern.garnet-starting-silk-shirt")?.method, "starting-equipment");
  assert.equal(pathsById.get("item-path.disc-2.madain-sari.eiko-starting-silk-shirt")?.method, "starting-equipment");
  assert.equal(blankCopy?.availability, "limited-window");
  assert.equal(blankCopy?.recommendedBeforeChapterId, "disc-1.evil-forest");
  assert.ok(blankCopy?.walkthroughObjectiveIds?.includes("disc-1.evil-forest.blank-equipment"));
  assert.equal(blackWaltzSteal?.availability, "one-time-encounter");
  assert.ok(blackWaltzSteal?.walkthroughObjectiveIds?.includes("disc-1.ice-cavern.boss-steals"));
  assert.equal(swordfightReward?.availability, "conditional");
  assert.match(swordfightReward?.conditions ?? "", /80–99 nobles/);
  assert.match(swordfightReward?.conditions ?? "", /100 nobles.*Moonstone #1/);
  assert.ok(shopPaths.every((path) => path?.method === "shop"));
  assert.deepEqual(shopPaths.map((path) => path?.availability), ["repeatable", "limited-window", "repeatable", "repeatable"]);
  assert.ok(shopPaths.every((path) => path?.cost?.amount === 400));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.alexandria"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.evil-forest"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.ice-cavern"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.madain-sari"));

  for (const path of silkShirtPaths) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
});

test("Bandana has a hidden pickup and source-backed Disc II/III shop routes", () => {
  const bandanaPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.bandana");
  const pathsById = new Map(bandanaPaths.map((path) => [path.id, path]));
  const pickup = pathsById.get("item-path.disc-2.return-to-lindblum.dragon-gate-bandana-pickup");
  const cleyra = pathsById.get("item-path.disc-2.cleyra.bandana-shop");
  const fossilRoo = pathsById.get("item-path.disc-2.journey-to-outer-continent.fossil-roo-bandana-shop");
  const earlyBlackMageVillage = pathsById.get("item-path.disc-2.outer-continent.bandana-black-mage-village-shop");
  const shopPaths = [
    "item-path.disc-2.treno.bandana-shop",
    "item-path.disc-2.cleyra.bandana-shop",
    "item-path.disc-2.return-to-lindblum.bandana-shop",
    "item-path.disc-2.return-to-lindblum.dragon-gate-bandana-shop",
    "item-path.disc-2.journey-to-outer-continent.fossil-roo-bandana-shop",
    "item-path.disc-2.outer-continent.bandana-black-mage-village-shop",
    "item-path.disc-3-stock.black-mage-village.bandana",
  ].map((id) => pathsById.get(id));

  assert.equal(bandanaPaths.length, 8);
  assert.equal(pickup?.method, "hidden-pickup");
  assert.ok(pickup?.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.treasure-sweep"));
  assert.equal(cleyra?.availability, "limited-window");
  assert.ok(cleyra?.walkthroughObjectiveIds?.includes("disc-2.cleyra.shop-stock"));
  assert.equal(fossilRoo?.availability, "limited-window");
  assert.equal(earlyBlackMageVillage?.availability, "repeatable");
  assert.ok(shopPaths.every((path) => path?.method === "shop" && path.cost?.amount === 500));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.journey-to-outer-continent"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.outer-continent"));

  for (const path of bandanaPaths) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
});

test("Daguerreo Disc III stock paths preserve the complete cross-source inventory", () => {
  const expectedDrsliceRows = [
    ["item-path.disc-3.aerial-exploration.gladius-daguerreo-shop", "game-item.gladius", 2300],
    ["item-path.disc-3-stock.daguerreo.zorlin-shape", "game-item.zorlin-shape", 6000],
    ["item-path.disc-3-stock.daguerreo.rune-blade", "game-item.rune-blade", 8900],
    ["item-path.disc-3-stock.daguerreo.obelisk", "game-item.obelisk", 6000],
    ["item-path.disc-3-stock.daguerreo.tiger-fangs", "game-item.tiger-fangs", 13500],
    ["item-path.disc-3-stock.daguerreo.mythril-racket", "game-item.mythril-racket", 2250],
    ["item-path.disc-3-stock.daguerreo.asuras-rod", "game-item.asuras-rod", 3180],
    ["item-path.disc-3-stock.daguerreo.hamelin", "game-item.hamelin", 5700],
    ["item-path.disc-3-stock.daguerreo.octagon-rod", "game-item.octagon-rod", 4500],
    ["item-path.disc-3-stock.daguerreo.mage-masher", "game-item.mage-masher", 500],
    ["item-path.disc-3-stock.daguerreo.mythril-dagger", "game-item.mythril-dagger", 950],
    ["item-path.disc-3-stock.daguerreo.rising-sun", "game-item.rising-sun", 500],
    ["item-path.disc-3.aerial-exploration.bone-wrist-daguerreo-shop", "game-item.bone-wrist", 330],
    ["item-path.disc-3-stock.daguerreo.mythril-armlet", "game-item.mythril-armlet", 500],
    ["item-path.disc-3.aerial-exploration.chimera-armlet-daguerreo-shop", "game-item.chimera-armlet", 1200],
    ["item-path.disc-3-stock.daguerreo.egoists-armlet", "game-item.egoists-armlet", 2000],
    ["item-path.disc-3.aerial-exploration.n-kai-armlet-daguerreo-shop", "game-item.n-kai-armlet", 3000],
    ["item-path.disc-3.aerial-exploration.jade-armlet-daguerreo-shop", "game-item.jade-armlet", 3400],
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
    ["item-path.disc-3-stock.daguerreo.diamond-armor", "game-item.diamond-armor", 8800],
  ];
  const drsliceRows = expectedDrsliceRows.map(([id]) => itemAcquisitionPaths.find((path) => path.id === id));
  const magicArmlet = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.magic-armlet");
  const magicRacket = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3-stock.daguerreo.magic-racket");
  const magicRacketItem = gameItems.find((item) => item.id === "game-item.magic-racket");
  const magicRacketRouteIds = [
    "item-path.disc-3.on-the-high-seas.magic-racket-lindblum-shop",
    "item-path.disc-3.forgotten-continent.magic-racket-oeilvert-mogshop",
    "item-path.disc-3.desert-palace.magic-racket-mogshop",
    "item-path.disc-3.lost-continent.magic-racket-esto-gaza-shop",
    "item-path.disc-3-stock.daguerreo.magic-racket",
  ];
  const magicRacketRoutes = magicRacketRouteIds.map((id) => itemAcquisitionPaths.find((path) => path.id === id));
  const magicRacketObjective = objectives.find((objective) => objective.id === "disc-3.magic-racket");
  const magicRacketTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.magic-racket");
  const jeggedRackets = sources.find((source) => source.id === "jegged-rackets");
  const stockObjective = objectives.find((objective) => objective.id === "disc-3.aerial-exploration.daguerreo-stock");

  assert.equal(expectedDrsliceRows.length, 29);
  for (const [index, [id, itemId, price]] of expectedDrsliceRows.entries()) {
    const path = drsliceRows[index];
    assert.ok(path, `${id} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.cost?.amount, price);
    assert.equal(path?.method, "shop");
    assert.equal(path?.chapterId, "disc-3.aerial-exploration");
    assert.match(path?.shopName ?? "", /Daguerreo/i);
    assert.ok(path?.sourceIds.includes("drslice-daguerreo-armory"));
    assert.ok(path?.sourceIds.includes("rpgclassics-shops"));
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.daguerreo-stock"));
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }

  assert.equal(magicArmlet?.cost?.amount, 1000);
  assert.equal(magicArmlet?.availability, "repeatable");
  assert.ok(magicArmlet?.sourceIds.includes("gamefaqs-shops-71891"));
  assert.ok(magicArmlet?.sourceIds.includes("rpgclassics-shops"));
  assert.ok(!magicArmlet?.sourceIds.includes("drslice-daguerreo-armory"));
  assert.equal(magicRacketItem?.category, "equipment");
  assert.equal(magicRacket?.cost?.amount, 1350);
  assert.equal(magicRacket?.availability, "limited-window");
  assert.match(magicRacket?.conditions ?? "", /separate from DrSlice and RPGClassics' Mythril Racket listing/);
  assert.ok(magicRacket?.notes?.includes("Mythril Racket"));
  assert.ok(magicRacket?.sourceIds.includes("gamefaqs-shops-71891"));
  assert.ok(!magicRacket?.sourceIds.includes("drslice-daguerreo-armory"));
  assert.ok(magicRacketItem?.sourceIds.includes("jegged-rackets"));
  assert.equal(magicRacketRoutes.length, 5);
  for (const path of magicRacketRoutes) {
    assert.ok(path, "each source-listed Magic Racket seller has a path");
    assert.equal(path?.itemId, "game-item.magic-racket");
    assert.equal(path?.cost?.amount, 1350);
    assert.ok(path?.sourceIds.includes("gamefaqs-items-71891"));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-3.magic-racket"));
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
  assert.equal(magicRacketRoutes[0]?.availability, "repeatable");
  assert.deepEqual(magicRacketRoutes.slice(1).map((path) => path?.availability), [
    "limited-window", "limited-window", "limited-window", "limited-window",
  ]);
  assert.ok(magicRacketRoutes[1]?.conditions?.includes("exact point when the exterior shop stops being reachable"));
  assert.ok(magicRacketRoutes[2]?.conditions?.includes("Lindblum retains a later source"));
  assert.ok(magicRacketRoutes[3]?.conditions?.includes("Lindblum's later Disc III–IV stock"));
  assert.ok(magicRacketItem?.sourceIds.includes("gamefaqs-items-71891"));
  assert.ok(!magicRacketItem?.sourceIds.includes("drslice-daguerreo-armory"));
  assert.ok(magicRacketObjective?.chapterIds.includes("disc-3.on-the-high-seas"));
  assert.ok(magicRacketObjective?.chapterIds.includes("disc-4.final-preparations"));
  assert.equal(magicRacketTargets.find((target) => target.id.endsWith("magic-racket-need-three"))?.targetQuantity, 3);
  assert.equal(magicRacketTargets.find((target) => target.id.endsWith("magic-racket-need-three"))?.basis, "route-need");
  assert.equal(magicRacketTargets.find((target) => target.id.endsWith("magic-racket-end-inventory"))?.targetQuantity, 3);
  assert.equal(magicRacketTargets.find((target) => target.id.endsWith("magic-racket-end-inventory"))?.basis, "end-inventory");
  assert.ok(jeggedRackets?.notes.includes("Protect where GameFAQs Items says Cure"));
  assert.ok(stockObjective?.sourceIds.includes("rpgclassics-shops"));
});

test("Feather Boots has sourced recovery routes for the Battle Boots ingredient chain", () => {
  const featherBootsPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.feather-boots");
  const pathsById = new Map(featherBootsPaths.map((path) => [path.id, path]));
  const chocograph = pathsById.get("item-path.disc-3.on-the-high-seas.feather-boots-abandoned-lagoon");
  const disc3Auction = pathsById.get("item-path.disc-3.on-the-high-seas.feather-boots-treno-auction");
  const disc4Auction = pathsById.get("item-path.disc-4.return-to-gaia.feather-boots-treno-auction");
  const tiamatSteal = pathsById.get("item-path.disc-4.memoria.tiamat-feather-boots-steal");
  const synthesisPaths = [
    "item-path.disc-3.the-home-front.feather-boots-alexandria-synthesis",
    "item-path.disc-3.on-the-high-seas.feather-boots-treno-synthesis",
    "item-path.disc-3.on-the-high-seas.feather-boots-lindblum-synthesis",
    "item-path.disc-3.aerial-exploration.feather-boots-daguerreo-synthesis",
  ].map((id) => pathsById.get(id));
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.battle-boots");
  const featherBootsRecipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.feather-boots");

  assert.equal(featherBootsPaths.length, 9);
  assert.equal(chocograph?.method, "chocograph");
  assert.equal(chocograph?.availability, "conditional");
  assert.ok(chocograph?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.chocographs"));
  assert.equal(disc3Auction?.availability, "conditional");
  assert.equal(disc4Auction?.availability, "conditional");
  assert.equal(disc3Auction?.cost, undefined);
  assert.ok(disc3Auction?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.auction-house"));
  assert.equal(tiamatSteal?.availability, "one-time-encounter");
  assert.ok(tiamatSteal?.walkthroughObjectiveIds?.includes("disc-4.memoria.tiamat-steals"));
  assert.ok(synthesisPaths.every((path) => path?.method === "synthesis" && path.availability === "repeatable"));
  assert.ok(synthesisPaths.every((path) => path?.recipeId === "synthesis-recipe.feather-boots"));
  assert.ok(synthesisPaths.every((path) => path?.cost?.amount === 4000));
  assert.deepEqual(featherBootsRecipe?.ingredients, [
    { itemId: "game-item.magician-shoes", quantity: 1 },
    { itemId: "game-item.phoenix-pinion", quantity: 1 },
  ]);
  assert.equal(featherBootsRecipe?.cost.amount, 4000);
  assert.deepEqual(recipe?.ingredients, [
    { itemId: "game-item.feather-boots", quantity: 1 },
    { itemId: "game-item.wing-edge", quantity: 1 },
  ]);
  assert.equal(recipe?.cost.amount, 6500);

  for (const path of featherBootsPaths) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
  for (const sourceId of featherBootsRecipe?.sourceIds ?? []) {
    assert.ok(sources.some((source) => source.id === sourceId), `Feather Boots recipe references unknown source ${sourceId}`);
  }
});

test("Wing Edge has sourced item, minigame, treasure, boss, and steal routes", () => {
  const wingEdge = gameItems.find((item) => item.id === "game-item.wing-edge");
  const wingEdgePaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.wing-edge");
  const pathsById = new Map(wingEdgePaths.map((path) => [path.id, path]));
  const expectedPathIds = [
    "item-path.disc-3.lost-continent.esto-gaza-wing-edge",
    "item-path.disc-3.lost-continent.mount-gulug-wing-edge",
    "item-path.disc-1.exploring-lindblum-kingdom.wing-edge-hot-cold-digging",
    "item-path.disc-1.exploring-lindblum-kingdom.wing-edge-point-redemption",
    "item-path.disc-3.on-the-high-seas.wing-edge-chocograph-3",
    "item-path.disc-3.on-the-high-seas.wing-edge-chocograph-13",
    "item-path.disc-3.portal-to-another-world.bran-bal-wing-edge-chest",
    "item-path.disc-3.portal-to-another-world.silver-dragon-wing-edge-drop",
    "item-path.disc-4.second-battle-of-iifa-tree.nova-dragon-wing-edge-drop",
    "item-path.disc-4.memoria.tiamat-wing-edge-drop",
    "item-path.disc-4.memoria.tiamat-crystal-wing-edge-steal",
    "item-path.disc-4.memoria.tiamat-crystal-wing-edge-rare-steal",
    "item-path.disc-4.memoria.kraken-right-tentacle-wing-edge-steal",
    "item-path.disc-4.memoria.deathguise-wing-edge-drop",
    "item-path.disc-4.memoria.hades-wing-edge-drop",
  ];
  const sourceIds = [
    "gamefaqs-items-71891",
    "gamefaqs-item-locations-54996",
    "gamefaqs-chocobo-hot-cold-71891",
    "gamefaqs-enemy-list-71891",
    "gamefaqs-on-the-high-seas-71891",
    "gamefaqs-portal-to-another-world-71891",
    "gamefaqs-second-battle-iifa-tree-71891",
    "gamefaqs-memoria-71891",
    "gamefaqs-master-synthesist-71891",
  ];

  assert.ok(wingEdge);
  assert.equal(wingEdgePaths.length, 15);
  assert.ok(sourceIds.every((sourceId) => wingEdge?.sourceIds.includes(sourceId)));
  assert.equal(pathsById.get(expectedPathIds[2])?.method, "quest-reward");
  assert.equal(pathsById.get(expectedPathIds[2])?.availability, "repeatable");
  assert.match(pathsById.get(expectedPathIds[2])?.conditions ?? "", /16-point/);
  assert.equal(pathsById.get(expectedPathIds[3])?.method, "point-redemption");
  assert.match(pathsById.get(expectedPathIds[3])?.conditions ?? "", /3,500/);
  assert.equal(pathsById.get(expectedPathIds[4])?.quantity, 3);
  assert.equal(pathsById.get(expectedPathIds[5])?.quantity, 10);
  assert.ok(pathsById.get(expectedPathIds[4])?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.chocographs"));
  assert.equal(pathsById.get(expectedPathIds[6])?.method, "chest");

  for (const pathId of [expectedPathIds[7], expectedPathIds[8], expectedPathIds[9], expectedPathIds[13], expectedPathIds[14]]) {
    const path = pathsById.get(pathId);
    assert.equal(path?.method, "drop", `${pathId} should be a boss drop`);
    assert.equal(path?.availability, "one-time-encounter", `${pathId} should be one-time`);
  }
  assert.equal(pathsById.get(expectedPathIds[10])?.method, "steal");
  assert.equal(pathsById.get(expectedPathIds[10])?.availability, "repeatable");
  assert.equal(pathsById.get(expectedPathIds[10])?.enemyLootSlot, "semi-rare");
  assert.match(pathsById.get(expectedPathIds[10])?.notes ?? "", /conflict/);
  assert.equal(pathsById.get(expectedPathIds[11])?.method, "steal");
  assert.equal(pathsById.get(expectedPathIds[11])?.availability, "repeatable");
  assert.equal(pathsById.get(expectedPathIds[11])?.enemyLootSlot, "rare");
  assert.match(pathsById.get(expectedPathIds[11])?.notes ?? "", /conflict/);
  assert.equal(pathsById.get(expectedPathIds[12])?.method, "steal");
  assert.equal(pathsById.get(expectedPathIds[12])?.availability, "one-time-encounter");
  assert.match(pathsById.get(expectedPathIds[12])?.notes ?? "", /disputed/);

  for (const pathId of expectedPathIds) {
    const path = pathsById.get(pathId);
    assert.ok(path, `${pathId} is missing`);
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references unknown source ${sourceId}`);
    }
    for (const objectiveId of path?.walkthroughObjectiveIds ?? []) {
      assert.ok(objectives.some((objective) => objective.id === objectiveId), `${pathId} references unknown objective ${objectiveId}`);
    }
  }
});

test("Germinas Boots recovery routes and both synthesis ingredients are source-linked", () => {
  const germinas = gameItems.find((item) => item.id === "game-item.germinas-boots");
  const desertBoots = gameItems.find((item) => item.id === "game-item.desert-boots");
  const fork = gameItems.find((item) => item.id === "game-item.fork");
  const germinasPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.germinas-boots");
  const desertBootsPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.desert-boots");
  const germinasRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.germinas-boots");
  const desertBootsRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.desert-boots");
  const missable = missables.find((entry) => entry.id === "missable.disc-1.burmecia.germinas-boots");
  const expectedSynthesisShops = [
    "item-path.disc-2.treno.germinas-boots-synthesis",
    "item-path.disc-2.return-to-lindblum.germinas-boots-synthesis",
    "item-path.disc-2.outer-continent.germinas-boots-synthesis",
    "item-path.disc-3.the-home-front.germinas-boots-synthesis",
    "item-path.disc-3.card-tournament.germinas-boots-treno-synthesis",
    "item-path.disc-3.on-the-high-seas.germinas-boots-lindblum-synthesis",
    "item-path.disc-4.return-to-gaia.germinas-boots-synthesis",
  ];

  assert.ok(germinas);
  assert.ok(desertBoots);
  assert.ok(fork);
  assert.equal(germinasPaths.length, 10);
  assert.equal(desertBootsPaths.length, 9);
  assert.ok(germinasPaths.some((path) => path.id === "item-path.disc-2.madain-sari.amarant-starting-germinas-boots"));
  assert.ok(germinasPaths.some((path) => path.id === "item-path.lindblum.streamside-germinas-boots" && path.quantity === 2));
  assert.ok(expectedSynthesisShops.every((id) => germinasPaths.some((path) => path.id === id)));
  assert.deepEqual(germinasRecipe?.ingredients, [
    { itemId: "game-item.desert-boots", quantity: 1 },
    { itemId: "game-item.fork", quantity: 1 },
  ]);
  assert.equal(germinasRecipe?.cost.amount, 900);
  assert.deepEqual(desertBootsRecipe?.ingredients, [
    { itemId: "game-item.leather-hat", quantity: 1 },
    { itemId: "game-item.leather-shirt", quantity: 1 },
  ]);
  assert.equal(desertBootsRecipe?.cost.amount, 300);
  assert.equal(itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.ipsens-castle.fork-chest")?.method, "chest");
  assert.ok(missable?.classification.includes("recoverable-later"));
  assert.doesNotMatch(missable?.classification.join(" ") ?? "", /permanently-missable/);
  assert.match(missable?.recovery ?? "", /Chocograph #1/);
  assert.match(missable?.recovery ?? "", /Amarant/);
  assert.ok(["Flee-Gil", "Protect", "Scan"].every((abilityName) => equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.desert-boots" && claim.abilityName === abilityName)));
  assert.ok(["Alert", "Flee", "HP+10%"].every((abilityName) => equipmentAbilityClaims.some((claim) => claim.itemId === "game-item.germinas-boots" && claim.abilityName === abilityName)));

  for (const path of [...germinasPaths, ...desertBootsPaths, ...itemAcquisitionPaths.filter((entry) => entry.itemId === "game-item.fork" || entry.itemId === "game-item.leather-hat" || entry.itemId === "game-item.leather-shirt")]) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
  for (const recipe of [germinasRecipe, desertBootsRecipe]) {
    for (const sourceId of recipe?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${recipe?.id} references unknown source ${sourceId}`);
    }
  }
});

test("Chain Plate, Leather Plate, and Mythril Vest have item-level earlier routes and recovery notes", () => {
  const expectedPathIds = [
    "item-path.disc-2.journey-to-cleyra.gargan-roo-chain-plate",
    "item-path.disc-2.treno.chain-plate-shop",
    "item-path.disc-2.cleyra.chain-plate-shop",
    "item-path.disc-2.return-to-lindblum.chain-plate-shop",
    "item-path.disc-2.return-to-lindblum.dragon-gate-chain-plate-shop",
    "item-path.disc-2.journey-to-outer-continent.fossil-roo-chain-plate-shop",
    "item-path.disc-2.outer-continent.chain-plate-black-mage-village-shop",
    "item-path.disc-1.lindblum.leather-plate-hidden-pickup",
    "item-path.disc-1.village-of-dali.leather-plate-black-waltz-2-steal",
    "item-path.disc-2.return-to-lindblum.leather-plate-shop",
    "item-path.disc-2.treno.leather-plate-shop",
    "item-path.disc-2.outer-continent.leather-plate-black-mage-village-shop",
    "item-path.disc-2.cleyra.mythril-vest-trunk-chest",
    "item-path.disc-2.pinnacle-rocks.mythril-vest-interior-chest",
    "item-path.disc-2.cleyra.mythril-vest-antlion-steal",
    "item-path.disc-2.cleyra.mythril-vest-shop",
    "item-path.disc-2.return-to-lindblum.dragon-gate-mythril-vest-shop",
    "item-path.disc-2.journey-to-outer-continent.fossil-roo-mythril-vest-shop",
    "item-path.disc-2.outer-continent.mythril-vest-black-mage-village-shop",
    "item-path.disc-3.lost-continent.esto-gaza-mythril-vest-shop",
  ];
  const newPaths = expectedPathIds.map((id) => itemAcquisitionPaths.find((path) => path.id === id));
  const pricedPaths = newPaths.filter((path) => path?.cost);
  const finalStockMissable = missables.find((entry) => entry.id === "missable.disc-3.aerial-exploration.daguerreo-stock");
  const garganMissable = missables.find((entry) => entry.id === "missable.disc-2.journey-to-cleyra.gargan-roo-chests");
  const daliMissable = missables.find((entry) => entry.id === "missable.disc-1.village-of-dali.black-waltz-2-steals");
  const antlionMissable = missables.find((entry) => entry.id === "missable.disc-2.cleyra.antlion-steals");
  const cleyraTreasureMissable = missables.find((entry) => entry.id === "missable.disc-2.cleyra.treasures");
  const pinnacleMissable = missables.find((entry) => entry.id === "missable.disc-2.pinnacle-rocks.treasure-sweep");

  assert.ok(newPaths.every(Boolean), "all 20 earlier/recovery paths should exist");
  assert.deepEqual(
    pricedPaths.map((path) => [path?.itemId, path?.cost?.amount]).sort(([aItem, aCost], [bItem, bCost]) => `${aItem}-${aCost}`.localeCompare(`${bItem}-${bCost}`)),
    [
      ...Array.from({ length: 6 }, () => ["game-item.chain-plate", 810]),
      ...Array.from({ length: 3 }, () => ["game-item.leather-plate", 530]),
      ...Array.from({ length: 5 }, () => ["game-item.mythril-vest", 1180]),
    ].sort(([aItem, aCost], [bItem, bCost]) => `${aItem}-${aCost}`.localeCompare(`${bItem}-${bCost}`)),
  );

  assert.equal(newPaths[0]?.method, "chest");
  assert.ok(newPaths[0]?.walkthroughObjectiveIds?.includes("disc-2.journey-to-cleyra.gargan-roo-chests"));
  assert.equal(newPaths[1]?.availability, "limited-window");
  assert.equal(newPaths[2]?.availability, "limited-window");
  assert.equal(newPaths[2]?.recommendedBeforeChapterId, "disc-2.cleyra");
  assert.ok(newPaths[2]?.walkthroughObjectiveIds?.includes("disc-2.cleyra.shop-stock"));
  assert.equal(newPaths[6]?.availability, "repeatable");

  assert.equal(newPaths[7]?.method, "hidden-pickup");
  assert.ok(newPaths[7]?.walkthroughObjectiveIds?.includes("disc-1.lindblum.first-visit-pickups"));
  assert.equal(newPaths[8]?.method, "steal");
  assert.ok(newPaths[8]?.walkthroughObjectiveIds?.includes("disc-1.village-of-dali.black-waltz-2-steals"));
  assert.equal(newPaths[11]?.availability, "repeatable");

  assert.equal(newPaths[12]?.method, "chest");
  assert.ok(newPaths[12]?.sourceIds.includes("cavesofnarshe-cleyra-walkthrough"));
  assert.equal(newPaths[13]?.method, "chest");
  assert.ok(newPaths[13]?.walkthroughObjectiveIds?.includes("disc-2.pinnacle-rocks.treasure-sweep"));
  assert.equal(newPaths[14]?.method, "steal");
  assert.ok(newPaths[14]?.walkthroughObjectiveIds?.includes("disc-2.cleyra.antlion-steals"));
  assert.equal(newPaths[15]?.availability, "limited-window");
  assert.ok(newPaths[15]?.walkthroughObjectiveIds?.includes("disc-2.cleyra.shop-stock"));
  assert.equal(newPaths[18]?.availability, "repeatable");
  assert.equal(newPaths[19]?.availability, "limited-window");
  assert.equal(newPaths[19]?.recommendedBeforeChapterId, "disc-3.preparing-to-leave");
  assert.ok(newPaths[19]?.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.daguerreo-stock"));

  for (const path of newPaths) {
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path?.id} references unknown source ${sourceId}`);
    }
    for (const objectiveId of path?.walkthroughObjectiveIds ?? []) {
      assert.ok(objectives.some((objective) => objective.id === objectiveId), `${path?.id} references unknown objective ${objectiveId}`);
    }
  }

  assert.match(garganMissable?.recovery ?? "", /Chain Plate's later shops can replace the armor/);
  assert.match(daliMissable?.recovery ?? "", /Leather Plate.*alternate routes/);
  assert.match(cleyraTreasureMissable?.recovery ?? "", /Other cataloged acquisition paths preserve the item types, not the original copies/);
  assert.match(antlionMissable?.recovery ?? "", /Mythril Vest has the Pinnacle Rocks chest and later shops/);
  assert.match(pinnacleMissable?.recovery ?? "", /Mythril Vest has later shop routes/);
  assert.match(finalStockMissable?.recovery ?? "", /no later purchase route for these items/);
});

test("Disc II Treno equipment targets preserve later recovery and optional stock semantics", () => {
  const equipment = [
    ["game-item.air-racket", 3],
    ["game-item.silver-gloves", 5],
    ["game-item.iron-helm", 5],
    ["game-item.chain-mail", 4],
  ];
  const expectedAbilities = [
    ["game-item.air-racket", "Scan"],
    ["game-item.air-racket", "Panacea"],
    ["game-item.silver-gloves", "Undead Killer"],
    ["game-item.iron-helm", "Bright Eyes"],
    ["game-item.iron-helm", "Level Up"],
    ["game-item.chain-mail", "Bird Killer"],
    ["game-item.chain-mail", "HP+10%"],
  ];
  const expectedWarnings = [
    "missable.disc-2.journey-to-treno.summit-station-equipment-stock",
    "missable.disc-2.treno.air-racket-purchase",
    "missable.disc-2.return-to-lindblum.chain-mail-stock",
  ];
  const requiredSourceIds = ["neoseeker-item-locations-182566", "gamefaqs-missables-71891", "gamefaqs-items-71891", "gamefaqs-shops-71891"];
  const routeIds = [
    "item-path.disc-2.journey-to-treno.summit-station-air-racket-shop",
    "item-path.disc-2.treno.air-racket-shop",
    "item-path.disc-3.ipsens-castle.air-racket-lift-chest",
    "item-path.disc-1.cargo-ship.silver-gloves-black-waltz-3-steal",
    "item-path.disc-1.lindblum.silver-gloves-synthesis-shop-pickup",
    "item-path.disc-1.lindblum.silver-gloves-shop",
    "item-path.disc-2.journey-to-treno.summit-station-silver-gloves-shop",
    "item-path.disc-1.evil-forest.iron-helm-plant-brain-steal",
    "item-path.disc-1.village-of-dali.iron-helm-underground-chest",
    "item-path.disc-1.lindblum.iron-helm-shop",
    "item-path.disc-2.journey-to-treno.summit-station-iron-helm-shop",
    "item-path.disc-2.treno.chain-mail-shop",
    "item-path.disc-2.cleyra.chain-mail-shop",
    "item-path.disc-2.cleyra.beatrix-chain-mail-equipped",
    "item-path.disc-2.return-to-lindblum.chain-mail-shop",
  ];
  const trenoChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.treno");
  const cleyraChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra");
  const lindblumChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-lindblum");
  const trenoExitStep = trenoChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "treno-mythril-dagger-supersoft");
  const cleyraShopStep = cleyraChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "cleyra-shop-stock");
  const chainMailStep = lindblumChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-perfect-chain-mail-stock");

  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.return-to-lindblum"));
  assert.deepEqual(equipment.map(([itemId]) => itemAcquisitionPaths.filter((path) => path.itemId === itemId).length), equipment.map(([, count]) => count));
  assert.deepEqual(routeIds.map((id) => itemAcquisitionPaths.find((path) => path.id === id)?.id), routeIds);

  const airRacketIpsen = itemAcquisitionPaths.find((path) => path.id === routeIds[2]);
  const beatrixChainMail = itemAcquisitionPaths.find((path) => path.id === routeIds[13]);
  assert.equal(airRacketIpsen?.chapterId, "disc-3.ipsens-castle");
  assert.match(airRacketIpsen?.conditions ?? "", /restores one item copy/);
  assert.equal(beatrixChainMail?.method, "starting-equipment");
  assert.match(beatrixChainMail?.conditions ?? "", /not a copy available in the player's inventory/);

  const targets = [
    ["item-target.disc-2.treno.air-racket", 5],
    ["item-target.disc-2.journey-to-treno.silver-gloves", 4],
    ["item-target.disc-2.journey-to-treno.iron-helm", 3],
    ["item-target.disc-2.return-to-lindblum.chain-mail", 15],
  ];
  for (const [targetId, quantity] of targets) {
    const target = sourceInventoryTargets.find((entry) => entry.id === targetId);
    assert.ok(target, `${targetId} is missing`);
    assert.equal(target.targetQuantity, quantity);
    assert.ok(target.sourceIds.length > 0);
  }
  assert.match(sourceInventoryTargets.find((target) => target.id === targets[3][0])?.interpretation ?? "", /up to 12 Power Belts/);
  assert.match(sourceInventoryTargets.find((target) => target.id === targets[3][0])?.interpretation ?? "", /Beatrix's locked copy is excluded/);

  for (const [itemId, abilityName] of expectedAbilities) {
    const claim = equipmentAbilityClaims.find((entry) => entry.itemId === itemId && entry.abilityName === abilityName);
    assert.ok(claim, `${itemId} is missing ${abilityName}`);
    assert.equal(claim.verification, "partial");
  }

  for (const warningId of expectedWarnings) {
    const warning = missables.find((entry) => entry.id === warningId);
    assert.ok(warning, `${warningId} is missing`);
    assert.ok(!warning.classification.includes("permanently-missable"), `${warningId} overstates permanent item loss`);
    assert.ok(objectives.some((objective) => objective.id === warning.objectiveId));
  }
  assert.ok(missables.find((entry) => entry.id === expectedWarnings[1])?.classification.includes("recoverable-later"));
  assert.ok(trenoExitStep?.objectiveIds?.includes("disc-2.treno.air-racket-purchase"));
  assert.ok(cleyraShopStep?.objectiveIds?.includes("disc-2.cleyra.shop-stock"));
  assert.ok(chainMailStep?.objectiveIds?.includes("disc-2.return-to-lindblum.chain-mail-stock"));

  for (const sourceId of requiredSourceIds) {
    assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
  }
  for (const path of itemAcquisitionPaths.filter((entry) => routeIds.includes(entry.id))) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
  }
});

test("Summit Station's limited-window shop paths link to the optional stock checkpoint", () => {
  const objectiveId = "disc-2.journey-to-treno.station-shop-stock";
  const expected = [
    ["item-path.disc-2.journey-to-treno.summit-station-air-racket-shop", "game-item.air-racket", 400, "disc-2.journey-to-treno"],
    ["item-path.disc-2.journey-to-treno.glass-armlet-summit-station-shop", "game-item.glass-armlet", 250, "disc-2.journey-to-treno"],
    ["item-path.disc-2.journey-to-treno.headgear-summit-station-shop", "game-item.headgear", 330, "disc-2.journey-to-treno"],
    ["item-path.disc-2.journey-to-treno.steepled-hat-summit-station-shop", "game-item.steepled-hat", 260, "disc-2.journey-to-treno"],
    ["item-path.disc-1.journey-to-burmecia.magus-hat-summit-station-shop", "game-item.magus-hat", 400, "disc-1.journey-to-burmecia"],
    ["item-path.disc-1.journey-to-burmecia.rubber-helm-summit-station-shop", "game-item.rubber-helm", 250, "disc-1.journey-to-burmecia"],
  ];
  const stockObjective = objectives.find((objective) => objective.id === objectiveId);
  const stationShopStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-2.journey-to-treno")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "journey-treno-shop-stock-review");
  const shopsSource = sources.find((source) => source.id === "gamefaqs-shops-71891");

  assert.equal(stockObjective?.category, "collection");
  assert.ok(stockObjective?.chapterIds?.includes("disc-2.journey-to-treno"));
  assert.ok(stockObjective?.profileIds?.includes("comprehensive"));
  assert.ok(["gamefaqs-shops-71891", "gamefaqs-journey-to-treno-71891", "cour89-air-racket"]
    .every((sourceId) => stockObjective?.sourceIds.includes(sourceId)));
  assert.ok(stationShopStep?.objectiveIds?.includes(objectiveId));
  assert.match(stationShopStep?.text ?? "", /Air Racket \(400 Gil\), Glass Armlet \(250\), Steepled Hat \(260\), Headgear \(330\), Magus Hat \(400\), and Rubber Helm \(250\)/);
  assert.match(stationShopStep?.detail ?? "", /closes only this seller's window/);
  assert.match(stationShopStep?.detail ?? "", /this Summit copy counts toward that total/);
  assert.match(stationShopStep?.detail ?? "", /one more copy is in Ipsen's Castle/);
  assert.match(shopsSource?.notes ?? "", /Summit stock is first-visit only/);

  for (const [pathId, itemId, price, chapterId] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.chapterId, chapterId);
    assert.equal(path?.method, "shop");
    assert.equal(path?.availability, "limited-window");
    assert.equal(path?.shopId, "summit-station.weapon-shop");
    assert.equal(path?.cost?.amount, price);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references source ${sourceId}`);
    }
  }
  assert.ok(itemAcquisitionPaths
    .find((path) => path.id === expected[0][0])
    ?.walkthroughObjectiveIds?.includes("disc-2.treno.air-racket-purchase"));
});

test("Cour89's time-limited shop table supports both Summit equipment cutoffs through the item-name mapping", () => {
  const source = sources.find((entry) => entry.id === "cour89-limited-shops");
  const cour89Gloves = sources.find((entry) => entry.id === "cour89-silver-gloves");
  const translationGuide = sources.find((entry) => entry.id === "gamefaqs-equipment-translation-8240");
  const translations = sources.find((entry) => entry.id === "ffwiki-translations");
  const summitIronHelm = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-iron-helm-shop");
  const summitSilverGloves = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.journey-to-treno.summit-station-silver-gloves-shop");
  const southGateIronHelm = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.south-gate.iron-helm-candidate");
  const southGateSilverGloves = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.south-gate.silver-gloves-candidate");
  const warning = missables.find((entry) => entry.id === "missable.disc-2.journey-to-treno.summit-station-equipment-stock");

  assert.equal(source?.url, "https://cour89.com/ff9/tips/goods.php");
  assert.match(source?.notes ?? "", /places アイアンヘルム and エスカッション at South Gate: Summit Station as the last purchase locations/);
  assert.match(cour89Gloves?.notes ?? "", /Lindblum pickup on Disc III–IV/);
  assert.match(translationGuide?.notes ?? "", /Esukashon \(Escutcheon\)/);
  assert.match(translations?.notes ?? "", /maps Japanese .* to the English-localized item Silver Gloves/);
  assert.match(cour89Gloves?.notes ?? "", /used only to identify the Japanese item entry/);
  assert.match(source?.notes ?? "", /does not identify the counter behind Caves of Narshe's generic Disc III South Gate listing/);

  assert.equal(summitIronHelm?.availability, "limited-window");
  assert.ok(summitIronHelm?.sourceIds.includes("cour89-limited-shops"));
  assert.match(summitIronHelm?.conditions ?? "", /last purchase location before boarding the train/);
  assert.equal(summitSilverGloves?.availability, "limited-window");
  assert.ok(summitSilverGloves?.sourceIds.includes("cour89-limited-shops"));
  assert.ok(summitSilverGloves?.sourceIds.includes("cour89-silver-gloves"));
  assert.ok(summitSilverGloves?.sourceIds.includes("gamefaqs-equipment-translation-8240"));
  assert.ok(summitSilverGloves?.sourceIds.includes("ffwiki-translations"));
  assert.equal(southGateIronHelm?.availability, "window-unverified");
  assert.ok(southGateIronHelm?.sourceIds.includes("cour89-limited-shops"));
  assert.match(southGateIronHelm?.conditions ?? "", /does not map Caves' generic Disc III listing to an accessible counter/);
  assert.equal(southGateSilverGloves?.availability, "window-unverified");
  assert.ok(southGateSilverGloves?.sourceIds.includes("cour89-limited-shops"));
  assert.ok(southGateSilverGloves?.sourceIds.includes("ffwiki-translations"));
  assert.ok(warning?.sourceIds.includes("cour89-limited-shops"));
  assert.ok(warning?.sourceIds.includes("ffwiki-translations"));
  assert.match(warning?.note ?? "", /Japanese-to-English translation mapping/);
});

test("Black Mage Village Disc II–III weapon paths link to the Disc III stock review", () => {
  const objectiveId = "disc-3.aerial-exploration.black-mage-village-stock";
  const expected = [
    ["item-path.disc-2.magdalene-forest.black-mage-village-flame-staff-shop", "game-item.flame-staff", 1100],
    ["item-path.disc-2.magdalene-forest.black-mage-village-lightning-staff-shop", "game-item.lightning-staff", 1200],
    ["item-path.disc-2.outer-continent.glass-armlet-black-mage-village-shop", "game-item.glass-armlet", 250],
    ["item-path.disc-2.outer-continent.leather-wrist-black-mage-village-shop", "game-item.leather-wrist", 200],
    ["item-path.disc-2.outer-continent.black-mage-village-mythril-fork-shop", "game-item.mythril-fork", 4700],
    ["item-path.disc-2.outer-continent.feather-hat-shop", "game-item.feather-hat", 200],
    ["item-path.disc-2.outer-continent.magus-hat-shop", "game-item.magus-hat", 400],
    ["item-path.disc-2.outer-continent.mythril-dagger-black-mage-village-shop", "game-item.mythril-dagger", 950],
    ["item-path.disc-2.outer-continent.gladius-black-mage-village-shop", "game-item.gladius", 2300],
    ["item-path.disc-2.magdalene-forest.headgear-black-mage-village", "game-item.headgear", 330],
    ["item-path.disc-2.outer-continent.steepled-hat-black-mage-village-shop", "game-item.steepled-hat", 260],
    ["item-path.disc-2.outer-continent.adaman-vest-black-mage-village-shop", "game-item.adaman-vest", 1600],
    ["item-path.disc-2.outer-continent.oak-staff-black-mage-village-shop", "game-item.oak-staff", 2400],
  ];
  const stockObjective = objectives.find((objective) => objective.id === objectiveId);
  const stockStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.aerial-exploration")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "aerial-bmv-inventory");
  const aerialSource = sources.find((source) => source.id === "gamefaqs-aerial-exploration-71891");

  assert.equal(stockObjective?.category, "collection");
  assert.ok(stockObjective?.chapterIds?.includes("disc-3.aerial-exploration"));
  assert.ok(stockObjective?.profileIds?.includes("comprehensive"));
  assert.ok(["gamefaqs-aerial-exploration-71891", "gamefaqs-shops-71891", "gamefaqs-items-71891"]
    .every((sourceId) => stockObjective?.sourceIds.includes(sourceId)));
  assert.ok(stockStep?.objectiveIds?.includes(objectiveId));
  assert.match(stockStep?.text ?? "", /Item, Weapon, and Black Cat Synthesis shops/);
  assert.match(stockStep?.detail ?? "", /missable wares remain available for a while/);
  assert.match(stockStep?.detail ?? "", /separate Disc IV table shows a different weapon inventory/);
  assert.match(stockStep?.detail ?? "", /exact stock-change trigger/);
  assert.match(stockStep?.detail ?? "", /This checkpoint protects the Black Mage Village seller window only/);
  assert.match(aerialSource?.notes ?? "", /shops return with the initial Disc II wares/);
  assert.match(aerialSource?.notes ?? "", /without giving an exact stock-change trigger/);

  for (const [pathId, itemId, price] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.method, "shop");
    assert.equal(path?.availability, "limited-window");
    assert.equal(path?.shopId, "black-mage-village.weapon-shop.disc-2-3");
    assert.equal(path?.cost?.amount, price);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references source ${sourceId}`);
    }
  }
});

test("Dragoos' pre-Cleyra stock paths link to the post-Festival purchase checkpoint", () => {
  const objectiveId = "disc-1.lindblum.pre-cleyra-stock";
  const expected = [
    ["item-path.disc-1.lindblum.silver-gloves-shop", "game-item.silver-gloves", 720],
    ["item-path.disc-1.lindblum.iron-helm-shop", "game-item.iron-helm", 450],
    ["item-path.disc-1.lindblum.glass-armlet-shop", "game-item.glass-armlet", 250],
    ["item-path.disc-1.lindblum.leather-wrist-shop", "game-item.leather-wrist", 200],
    ["item-path.disc-1.lindblum.mythril-dagger-shop", "game-item.mythril-dagger", 950],
    ["item-path.disc-1.lindblum.fork-shop", "game-item.fork", 1100],
    ["item-path.disc-1.lindblum.steepled-hat-shop", "game-item.steepled-hat", 260],
    ["item-path.disc-1.lindblum.headgear-dragoos-shop", "game-item.headgear", 330],
    ["item-path.disc-1.lindblum.javelin-shop", "game-item.javelin", 880],
  ];
  const stockObjective = objectives.find((objective) => objective.id === objectiveId);
  const stockStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.lindblum")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "lindblum-shop-synthesis-javelin");
  const shopsSource = sources.find((source) => source.id === "gamefaqs-shops-71891");
  const lindblumSource = sources.find((source) => source.id === "gamefaqs-lindblum-71891");

  assert.equal(stockObjective?.category, "collection");
  assert.ok(stockObjective?.chapterIds?.includes("disc-1.lindblum"));
  assert.ok(stockObjective?.profileIds?.includes("comprehensive"));
  assert.ok(["gamefaqs-shops-71891", "gamefaqs-lindblum-71891"]
    .every((sourceId) => stockObjective?.sourceIds.includes(sourceId)));
  assert.ok(stockStep?.objectiveIds?.includes(objectiveId));
  assert.match(stockStep?.text ?? "", /Review Dragoos' pre-Cleyra stock/);
  assert.match(stockStep?.detail ?? "", /inventories remain available until Cleyra is completed/);
  assert.match(stockStep?.detail ?? "", /checklist tracks that seller window only/);
  assert.match(stockStep?.detail ?? "", /does not say that missing the stock removes the item types/);
  assert.match(shopsSource?.notes ?? "", /Silver Gloves/);
  assert.match(lindblumSource?.notes ?? "", /After the Festival/);

  for (const [pathId, itemId, price] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.chapterId, "disc-1.lindblum");
    assert.equal(path?.method, "shop");
    assert.equal(path?.availability, "limited-window");
    assert.ok(path?.shopId?.startsWith("lindblum.weapon-shop"));
    assert.equal(path?.cost?.amount, price);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references source ${sourceId}`);
    }
  }

  const javelinStartingPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.freya-starting-javelin");
  const javelinNeedTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.javelin-need-two");
  const javelinEndInventoryTarget = sourceInventoryTargets.find((target) => target.id === "item-target.disc-4.final-preparations.javelin-end-inventory-one");
  const javelinDragonKillerClaim = equipmentAbilityClaims.find((claim) => claim.id === "item-ability.javelin.dragon-killer");
  assert.equal(javelinStartingPath?.itemId, "game-item.javelin");
  assert.equal(javelinStartingPath?.method, "starting-equipment");
  assert.equal(javelinNeedTarget?.targetQuantity, 2);
  assert.equal(javelinNeedTarget?.basis, "route-need");
  assert.ok(javelinNeedTarget?.interpretation.includes("optional source-specific route-need target"));
  assert.equal(javelinEndInventoryTarget?.targetQuantity, 1);
  assert.equal(javelinEndInventoryTarget?.basis, "end-inventory");
  assert.ok(javelinEndInventoryTarget?.interpretation.includes("distinct from Need 2"));
  assert.equal(javelinDragonKillerClaim?.abilityName, "Dragon Killer");
  assert.equal(javelinDragonKillerClaim?.verification, "partial");
  assert.ok(javelinDragonKillerClaim?.sourceIds.includes("gamefaqs-abilities-71891"));
});

test("Atla, Treno, Black Mage Village, and Esto Gaza shop paths link to their walkthrough stock checks", () => {
  const expected = [
    ["item-path.disc-1.burmecia.magus-hat-atla-shop", "game-item.magus-hat", "disc-1.burmecia", "mogshop", "burmecia.atla-mogshop", 400, "disc-1.burmecia.atla-mogshop-stock", "burmecia-atla-vault-mognet"],
    ["item-path.disc-1.burmecia.headgear-atla-mogshop", "game-item.headgear", "disc-1.burmecia", "mogshop", "burmecia.atla-mogshop", 330, "disc-1.burmecia.atla-mogshop-stock", "burmecia-atla-vault-mognet"],
    ["item-path.disc-2.treno.glass-armlet-shop", "game-item.glass-armlet", "disc-2.treno", "shop", "treno.weapon-shop.disc-2", 250, "disc-2.treno.shop-stock-window", "treno-mogrich-letter"],
    ["item-path.disc-2.outer-continent.bone-wrist-black-mage-village-shop", "game-item.bone-wrist", "disc-2.outer-continent", "shop", "black-mage-village.weapon-shop", 330, "disc-2.outer-continent.black-mage-village-bone-wrist-stock", "black-mage-village-shop-check", "disc-2.magdalene-forest"],
    ["item-path.disc-3.lost-continent.gladius-esto-gaza-shop", "game-item.gladius", "disc-3.lost-continent", "shop", "esto-gaza.weapon-shop.after-desert-palace", 2300, "disc-3.lost-continent.esto-gaza-stock", "lost-continent-esto-gaza-shop"],
  ];
  const getStep = (chapterId, stepId) => walkthroughChapters
    .find((chapter) => chapter.areaId === chapterId)
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === stepId);
  const checkpointPhrases = [
    ["disc-1.burmecia", "burmecia-atla-vault-mognet", /Headgear costs 330 Gil and Magus Hat 400 Gil/],
    ["disc-2.treno", "treno-mogrich-letter", /Glass Armlet at 250 Gil here/],
    ["disc-2.magdalene-forest", "black-mage-village-shop-check", /Bone Wrist \(330 Gil\)/],
    ["disc-3.lost-continent", "lost-continent-esto-gaza-shop", /Gladius \(2,300 Gil\)/],
  ];

  for (const [pathId, itemId, chapterId, method, shopId, price, objectiveId, stepId, stepChapterId = chapterId] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const objective = objectives.find((entry) => entry.id === objectiveId);
    const step = getStep(stepChapterId, stepId);
    assert.ok(path, `${pathId} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.chapterId, chapterId);
    assert.equal(path?.method, method);
    assert.equal(path?.availability, "limited-window");
    assert.equal(path?.shopId, shopId);
    assert.equal(path?.cost?.amount, price);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(objective?.chapterIds?.includes(chapterId));
    assert.ok(step?.objectiveIds?.includes(objectiveId));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references source ${sourceId}`);
    }
  }

  for (const [chapterId, stepId, phrase] of checkpointPhrases) {
    const step = getStep(chapterId, stepId);
    assert.match(`${step?.text ?? ""} ${step?.detail ?? ""}`, phrase);
  }
  const trenoGlassArmletPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-2.treno.glass-armlet-shop");
  const trenoGlassArmletCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.card-tournament.glass-armlet-treno-candidate");
  const lindblumGlassArmletCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.glass-armlet-lindblum-candidate");
  const alexandriaGlassArmletPath = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-home-front.glass-armlet-alexandria-shop");
  const drsliceTrenoArmory = sources.find((source) => source.id === "drslice-treno-armory");
  const drsliceAlexandriaArmory = sources.find((source) => source.id === "drslice-alexandria-armory");
  assert.ok(trenoGlassArmletPath?.sourceIds.includes("drslice-treno-armory"));
  assert.ok(trenoGlassArmletCandidate?.sourceIds.includes("drslice-treno-armory"));
  assert.equal(trenoGlassArmletCandidate?.availability, "window-unverified");
  assert.match(trenoGlassArmletPath?.conditions ?? "", /DrSlice independently lists it for 250 Gil under Treno \(Disk 2\)/);
  assert.match(trenoGlassArmletCandidate?.conditions ?? "", /does not resolve the Disc III candidate/);
  assert.match(drsliceTrenoArmory?.notes ?? "", /Treno \(Disk 2\)/);
  assert.ok(alexandriaGlassArmletPath?.sourceIds.includes("drslice-alexandria-armory"));
  assert.match(alexandriaGlassArmletPath?.conditions ?? "", /DrSlice independently lists the item for 250 Gil.*Alexandria \(Disk 3\)/);
  assert.equal(lindblumGlassArmletCandidate?.availability, "window-unverified");
  assert.ok(drsliceAlexandriaArmory?.url.includes("/shop/36"));
  assert.match(drsliceAlexandriaArmory?.notes ?? "", /Glass Armlet for 250 Gil.*Alexandria \(Disk 3\)/);
  assert.ok(gameItems.find((item) => item.id === "game-item.glass-armlet")?.sourceIds.includes("drslice-alexandria-armory"));
  assert.match(getStep("disc-2.treno", "treno-mogrich-letter")?.detail ?? "", /DrSlice independently lists it in the Treno Armory and labels the location Treno \(Disk 2\)/);
  assert.match(getStep("disc-2.treno", "treno-mogrich-letter")?.detail ?? "", /distinct from the unresolved later Treno listing/);
  assert.match(getStep("disc-2.magdalene-forest", "black-mage-village-shop-check")?.detail ?? "", /Alexandria remains a later seller/);
});

test("Disc II Lindblum and Dragon's Gate shop paths link to the departure stock review", () => {
  const objectiveId = "disc-2.return-to-lindblum.optional-shop-stock";
  const expected = [
    ["item-path.disc-2.return-to-lindblum.bandana-shop", "game-item.bandana", 500, "Dragoos' Weapon Shop (Disc II)"],
    ["item-path.disc-2.return-to-lindblum.bone-wrist-shop", "game-item.bone-wrist", 330, "Lindblum Weapon Shop (Disc II)"],
    ["item-path.disc-2.return-to-lindblum.headgear-dragoos-shop", "game-item.headgear", 330, "Dragoos' Weapon Shop (Lindblum, Disc II)"],
    ["item-path.disc-2.return-to-lindblum.magus-hat-shop", "game-item.magus-hat", 400, "Lindblum Weapon Shop (Disc II)"],
    ["item-path.disc-2.return-to-lindblum.dragon-gate-bandana-shop", "game-item.bandana", 500, "Dragon's Gate Merchant (Disc II)"],
  ];
  const stockObjective = objectives.find((objective) => objective.id === objectiveId);
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-2.return-to-lindblum");
  const shopStep = chapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-shop-preparation");
  const gateStep = chapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-moonte-bandana");
  const shopsSource = sources.find((source) => source.id === "gamefaqs-shops-71891");
  const routeSource = sources.find((source) => source.id === "gamefaqs-return-to-lindblum-71891");

  assert.equal(stockObjective?.category, "collection");
  assert.ok(stockObjective?.chapterIds?.includes("disc-2.return-to-lindblum"));
  assert.ok(stockObjective?.profileIds?.includes("comprehensive"));
  assert.ok(["gamefaqs-shops-71891", "gamefaqs-return-to-lindblum-71891"]
    .every((sourceId) => stockObjective?.sourceIds.includes(sourceId)));
  assert.ok(shopStep?.objectiveIds?.includes(objectiveId));
  assert.ok(gateStep?.objectiveIds?.includes(objectiveId));
  assert.match(shopStep?.detail ?? "", /only the Dragon's Gate Merchant remains available until Disc III/);
  assert.match(gateStep?.detail ?? "", /separate free pickup from the Dragon's Gate Merchant's 500-Gil Bandana listing/);
  assert.match(shopsSource?.notes ?? "", /Disc II/);
  assert.match(routeSource?.notes ?? "", /Dragon's Gate/);

  for (const [pathId, itemId, price, shopName] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} exists`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.chapterId, "disc-2.return-to-lindblum");
    assert.equal(path?.method, "shop");
    assert.equal(path?.availability, "limited-window");
    assert.equal(path?.shopName, shopName);
    assert.equal(path?.cost?.amount, price);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(path?.sourceIds.includes("gamefaqs-shops-71891"));
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} references source ${sourceId}`);
    }
  }
});

test("Power Belt and Glass Buckle recipes have complete Disc II recovery and ingredient paths", () => {
  const itemIds = ["game-item.power-belt", "game-item.glass-buckle", "game-item.glass-armlet", "game-item.leather-wrist"];
  const pathCounts = [8, 9, 12, 10];
  const powerBelt = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.power-belt");
  const glassBuckle = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.glass-buckle");
  const powerBeltPaths = itemAcquisitionPaths.filter((path) => path.itemId === itemIds[0]);
  const glassBucklePaths = itemAcquisitionPaths.filter((path) => path.itemId === itemIds[1]);
  const directReward = powerBeltPaths.find((path) => path.id === "item-path.disc-2.treno.power-belt-four-armed-man");
  const trenoChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.treno");
  const lindblumChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.return-to-lindblum");
  const interceptStep = trenoChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "treno-power-belt-intercept");
  const chainMailStep = lindblumChapter?.sections.flatMap((section) => section.steps).find((step) => step.id === "return-lindblum-perfect-chain-mail-stock");

  assert.deepEqual(gameItems.filter((item) => itemIds.includes(item.id)).map((item) => item.id).sort(), [...itemIds].sort());
  assert.deepEqual(itemIds.map((itemId) => itemAcquisitionPaths.filter((path) => path.itemId === itemId).length), pathCounts);
  assert.deepEqual(powerBelt?.ingredients, [
    { itemId: "game-item.glass-buckle", quantity: 1 },
    { itemId: "game-item.chain-mail", quantity: 1 },
  ]);
  assert.equal(powerBelt?.cost.amount, 2000);
  assert.deepEqual(glassBuckle?.ingredients, [
    { itemId: "game-item.glass-armlet", quantity: 1 },
    { itemId: "game-item.leather-wrist", quantity: 1 },
  ]);
  assert.equal(glassBuckle?.cost.amount, 500);

  assert.deepEqual(
    powerBeltPaths.filter((path) => path.method === "synthesis").map((path) => path.shopId).sort(),
    [
      "alexandria.synthesis-shop.disc-3",
      "black-mage-village.synthesis-shop.disc-2-3",
      "daguerreo.synthesis-expert",
      "daguerreo.synthesis-expert",
      "lindblum.synthesis-shop.disc-2",
      "lindblum.synthesis-shop.disc-3-4",
      "treno.synthesis-shop.disc-3-4",
    ].sort(),
  );
  assert.deepEqual(
    glassBucklePaths.map((path) => path.shopId).sort(),
    [
      "alexandria.alley-synthesist",
      "alexandria.synthesis-shop.disc-3",
      "black-mage-village.synthesis-shop.disc-2-3",
      "black-mage-village.synthesis-shop.disc-4",
      "lindblum.synthesis-shop.disc-1",
      "lindblum.synthesis-shop.disc-2",
      "lindblum.synthesis-shop.disc-3-4",
      "treno.synthesis-shop.disc-2",
      "treno.synthesis-shop.disc-3",
    ].sort(),
  );
  assert.equal(directReward?.availability, "limited-window");
  assert.match(directReward?.conditions ?? "", /Treno Tradition ATE/);
  assert.ok(directReward?.walkthroughObjectiveIds?.includes("disc-2.treno.power-belt"));
  assert.match(interceptStep?.detail ?? "", /requires viewing Treno Tradition/);
  assert.ok(interceptStep?.objectiveIds?.includes("disc-2.treno.power-belt"));
  assert.match(chainMailStep?.detail ?? "", /one Glass Buckle \+ one Chain Mail for 2,000 Gil/);
  assert.match(chainMailStep?.detail ?? "", /one Glass Armlet \+ one Leather Wrist for 500 Gil/);
  assert.ok(objectives.some((objective) => objective.id === "disc-1.evil-forest.prison-cage-steals"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-1.evil-forest"));

  const expectedAbilities = [
    [itemIds[0], "Counter"], [itemIds[0], "Fira"], [itemIds[0], "MP Attack"],
    [itemIds[1], "Add Status"], [itemIds[1], "Antibody"], [itemIds[1], "Thunder"],
    [itemIds[2], "Steal Gil"], [itemIds[2], "Antibody"],
    [itemIds[3], "Beast Killer"], [itemIds[3], "Blizzard"],
  ];
  for (const [itemId, abilityName] of expectedAbilities) {
    assert.ok(equipmentAbilityClaims.some((claim) => claim.itemId === itemId && claim.abilityName === abilityName), `${itemId} is missing ${abilityName}`);
  }

  for (const path of itemAcquisitionPaths.filter((entry) => itemIds.includes(entry.itemId))) {
    for (const sourceId of path.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${path.id} references unknown source ${sourceId}`);
    }
    for (const objectiveId of path.walkthroughObjectiveIds ?? []) {
      assert.ok(objectives.some((objective) => objective.id === objectiveId), `${path.id} references unknown objective ${objectiveId}`);
    }
  }
  for (const recipe of [powerBelt, glassBuckle]) {
    assert.ok(recipe);
    for (const sourceId of recipe.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${recipe.id} references unknown source ${sourceId}`);
    }
  }
});

test("The Aftermath pickups and three potion quest items link to the shared checklist", () => {
  const expected = [
    ["item-path.disc-3.the-aftermath.elixir-guest-room", "game-item.elixir", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.egoists-armlet-guest-room", "game-item.egoists-armlet", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.remedy-dragons-gate", "game-item.remedy", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.elixir-card-freak-house", "game-item.elixir", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.remedy-card-freak-house", "game-item.remedy", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.lapis-lazuli-michaels-studio", "game-item.lapis-lazuli", "chest", "disc-3.the-aftermath.pickups"],
    ["item-path.disc-3.the-aftermath.beautiful-potion-alice", "game-item.beautiful-potion", "quest-reward", "disc-3.the-aftermath.potions"],
    ["item-path.disc-3.the-aftermath.strange-potion-michaels-studio", "game-item.strange-potion", "hidden-pickup", "disc-3.the-aftermath.potions"],
    ["item-path.disc-3.the-aftermath.unusual-potion-cinna", "game-item.unusual-potion", "quest-reward", "disc-3.the-aftermath.potions"],
  ];
  const routeSources = ["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath", "flactem-disc-3-lindblum"];

  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-3.the-aftermath"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-3.the-aftermath"));
  for (const [pathId, itemId, method, objectiveId] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-3.the-aftermath");
    assert.equal(path.method, method);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.equal(path.availability, "single-use");
    for (const sourceId of routeSources) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }

  for (const itemId of ["game-item.beautiful-potion", "game-item.strange-potion", "game-item.unusual-potion"]) {
    assert.equal(gameItems.find((item) => item.id === itemId)?.category, "key-item");
    assert.ok(itemAcquisitionPaths.some((path) => path.itemId === itemId && path.chapterId === "disc-3.the-aftermath"));
  }

  const elixirPickups = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.elixir" && path.chapterId === "disc-3.the-aftermath");
  const remedyPickups = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.remedy" && path.chapterId === "disc-3.the-aftermath");
  assert.equal(elixirPickups.filter((path) => path.method === "chest").length, 2);
  assert.equal(remedyPickups.filter((path) => path.method === "chest").length, 2);
  assert.match(elixirPickups.find((path) => path.id.endsWith("card-freak-house"))?.conditions ?? "", /refilled for this Disc III visit/);

  const oreCandidate = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-3.the-aftermath.ore-studio-recovery-candidate");
  assert.equal(oreCandidate?.availability, "conditional");
  assert.deepEqual(oreCandidate?.sourceIds, ["gamefaqs-the-aftermath-71891"]);
  assert.match(oreCandidate?.conditions ?? "", /other reviewed Disc III walkthroughs omit this recovery/);
  const oreStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.the-aftermath")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "aftermath-the-rally-ate");
  assert.match(oreStep?.detail ?? "", /Treat it as a conditional check/);
});

test("South Gate item paths separate the lost Potion chest from conditional Multina Racket recovery", () => {
  const expected = [
    ["item-path.disc-1.journey-to-burmecia.bohden-gate-multina-racket", "game-item.multina-racket", "disc-1.journey-to-burmecia", "single-use", "disc-1.journey-to-burmecia.south-gate-pickups", ["gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "elitegrindlab-south-gate"]],
    ["item-path.disc-1.journey-to-burmecia.bohden-station-potion", "game-item.potion", "disc-1.journey-to-burmecia", "single-use", "disc-1.journey-to-burmecia.south-gate-pickups", ["gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "elitegrindlab-south-gate"]],
    ["item-path.disc-3.on-the-high-seas.bohden-gate-multina-racket-recovery", "game-item.multina-racket", "disc-3.on-the-high-seas", "conditional", "disc-3.on-the-high-seas.south-gates", ["gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss"]],
    ["item-path.disc-3.on-the-high-seas.treno-arch-elixir-front", "game-item.elixir", "disc-3.on-the-high-seas", "single-use", "disc-3.on-the-high-seas.south-gates", ["gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss"]],
    ["item-path.disc-3.on-the-high-seas.treno-arch-elixir-rear", "game-item.elixir", "disc-3.on-the-high-seas", "single-use", "disc-3.on-the-high-seas.south-gates", ["gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss"]],
  ];

  for (const [pathId, itemId, chapterId, availability, objectiveId, sourceIds] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, chapterId);
    assert.equal(path.method, "chest");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, availability);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }

  const racketRecovery = itemAcquisitionPaths.find((path) => path.id === expected[2][0]);
  const trenoArchElixirs = itemAcquisitionPaths.filter((path) => path.id.startsWith("item-path.disc-3.on-the-high-seas.treno-arch-elixir-"));
  const warning = missables.find((entry) => entry.id === "missable.disc-1.journey-to-burmecia.south-gate-pickups");
  assert.match(racketRecovery?.conditions ?? "", /only if the Disc I pickup was missed/);
  assert.match(racketRecovery?.conditions ?? "", /Elixir Card/);
  assert.equal(trenoArchElixirs.length, 2);
  assert.ok(trenoArchElixirs.every((path) => path.itemId === "game-item.elixir"));
  assert.ok(warning?.classification.includes("recoverable-later"));
  assert.match(warning?.consequence ?? "", /Potion chest/);
  assert.match(warning?.consequence ?? "", /existing copy remains at Bohden Gate/);
  assert.match(warning?.recovery ?? "", /Return to Bohden Gate on Disc III/);
  assert.ok(objectives.some((objective) => objective.id === "disc-1.journey-to-burmecia.south-gate-pickups"));
  assert.ok(objectives.some((objective) => objective.id === "disc-3.on-the-high-seas.south-gates"));

  const earlyRouteStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "journey-south-gate-station");
  const lateRouteStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.on-the-high-seas")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "high-seas-south-gates");
  assert.match(earlyRouteStep?.detail ?? "", /that chest copy does not return/);
  assert.match(earlyRouteStep?.detail ?? "", /still at Bohden Gate on the Disc III return/);
  assert.match(lateRouteStep?.text ?? "", /front and rear chests for two Elixirs/);
  assert.match(lateRouteStep?.detail ?? "", /Elixir Card is tracked in the card collection/);
});

test("Bohden Arch Ether and Moccha Coffee have separate sourced pickup records", () => {
  const expected = [
    ["item-path.disc-1.exploring-lindblum-kingdom.bohden-arch-ether", "game-item.ether", "disc-1.exploring-lindblum-kingdom.bohden-arch-ether", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke"]],
    ["item-path.disc-1.exploring-lindblum-kingdom.bohden-arch-moccha-coffee", "game-item.moccha-coffee", "disc-1.exploring-lindblum-kingdom.moccha-coffee", ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke", "rpgclassics-coffee"]],
  ];

  for (const [pathId, itemId, objectiveId, sourceIds] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.exploring-lindblum-kingdom");
    assert.equal(path.method, "fixed-pickup");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "single-use");
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(item, `${itemId} is missing from the item catalogue`);
    assert.ok(item.sourceIds.some((sourceId) => sourceIds.includes(sourceId)));
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    assert.ok(objectives.some((objective) => objective.id === objectiveId));
  }

  const ether = itemAcquisitionPaths.find((path) => path.id === expected[0][0]);
  const coffee = itemAcquisitionPaths.find((path) => path.id === expected[1][0]);
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "explore-bohden-arch-pickups");
  assert.match(ether?.conditions ?? "", /far end of Bohden Arch's bridge beside the right-hand post/);
  assert.match(coffee?.conditions ?? "", /base of the large tree on the far right/);
  assert.ok(step?.objectiveIds.includes(expected[0][2]));
  assert.ok(step?.objectiveIds.includes(expected[1][2]));
});

test("the first two Chocographs and early Pinnacle Rocks chests have item paths", () => {
  const sourcesForChocographs = ["gamefaqs-exploring-lindblum-71891", "gamefaqs-chocobo-hot-cold-71891", "jegged-chocographs"];
  const sourcesForPinnacleRocks = ["gamefaqs-exploring-lindblum-71891", "jegged-gizamaluke"];
  const expected = [
    ["item-path.disc-1.exploring-lindblum-kingdom.streamside-elixir", "game-item.elixir", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.streamside-hi-potion", "game-item.hi-potion", 3, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.streamside-ether", "game-item.ether", 4, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.lindblum.streamside-germinas-boots", "game-item.germinas-boots", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-potion", "game-item.potion", 5, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-hi-potion", "game-item.hi-potion", 5, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-tent", "game-item.tent", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.between-mountains-cotton-robe", "game-item.cotton-robe", 2, "chocograph", "disc-1.exploring-lindblum-kingdom.first-chocographs", sourcesForChocographs],
    ["item-path.disc-1.exploring-lindblum-kingdom.pinnacle-rocks-elixir", "game-item.elixir", 1, "chest", "disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups", sourcesForPinnacleRocks],
    ["item-path.disc-1.exploring-lindblum-kingdom.pinnacle-rocks-phoenix-down", "game-item.phoenix-down", 1, "chest", "disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups", sourcesForPinnacleRocks],
  ];

  for (const [pathId, itemId, quantity, method, objectiveId, sourceIds] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.exploring-lindblum-kingdom");
    assert.equal(path.method, method);
    assert.equal(path.quantity, quantity);
    assert.equal(path.availability, "single-use");
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(item, `${itemId} is missing from the item catalogue`);
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    assert.ok(objectives.some((objective) => objective.id === objectiveId));
  }

  const chocographStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "explore-first-two-chocographs");
  const pinnacleStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "explore-pinnacle-rocks-early-treasure");
  assert.match(chocographStep?.text ?? "", /2 Elixirs, 3 Hi-Potions, 4 Ethers, and 2 Germinas Boots/);
  assert.match(chocographStep?.text ?? "", /5 Potions, 5 Hi-Potions, 2 Tents, and 2 Cotton Robes/);
  assert.ok(pinnacleStep?.objectiveIds.includes("disc-1.exploring-lindblum-kingdom.pinnacle-rocks-pickups"));
});

test("Burmecia Arch's Hi-Potion and Tent chests have item paths", () => {
  const sourceIds = ["gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke"];
  const expected = [
    ["item-path.disc-1.journey-to-burmecia.burmecia-arch-hi-potion-chest", "game-item.hi-potion", /Hi-Potion.*North Gate/],
    ["item-path.disc-1.journey-to-burmecia.burmecia-arch-tent-chest", "game-item.tent", /Tent.*North Gate/],
  ];

  for (const [pathId, itemId, conditionPattern] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.journey-to-burmecia");
    assert.equal(path.method, "chest");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "single-use");
    assert.match(path.conditions ?? "", conditionPattern);
    assert.ok(path.walkthroughObjectiveIds?.includes("disc-1.journey-to-burmecia.burmecia-arch-pickups"));
    assert.ok(item, `${itemId} is missing from the item catalog`);
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }

  const objective = objectives.find((entry) => entry.id === "disc-1.journey-to-burmecia.burmecia-arch-pickups");
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "journey-burmecian-arch-pickups");
  assert.deepEqual(objective?.sourceIds, sourceIds);
  assert.ok(step?.objectiveIds.includes("disc-1.journey-to-burmecia.burmecia-arch-pickups"));
  assert.match(step?.text ?? "", /two chests for a Hi-Potion and Tent/);
});

test("Observatory Mountain's hidden Hi-Potion has a later missed-pickup check", () => {
  const sourceIds = ["gamefaqs-optional-route-47344", "gamefaqs-dali-71891", "jegged-ice-cavern", "gamerguides-dali"];
  const objectiveId = "disc-1.ice-cavern.observatory-pickups";
  const path = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-1.ice-cavern.observatory-hidden-hi-potion");
  const item = gameItems.find((entry) => entry.id === "game-item.hi-potion");
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const iceCavernStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.ice-cavern")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "observatory-mountain");
  const daliStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.village-of-dali")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "dali-observatory-recheck");

  assert.ok(path, "Observatory Mountain Hi-Potion path is missing");
  assert.equal(path.itemId, "game-item.hi-potion");
  assert.equal(path.chapterId, "disc-1.ice-cavern");
  assert.equal(path.method, "hidden-pickup");
  assert.equal(path.quantity, 1);
  assert.equal(path.availability, "single-use");
  assert.match(path.conditions ?? "", /by the entrance cart/);
  assert.match(path.conditions ?? "", /later switches to Steiner/);
  assert.match(path.notes ?? "", /calls the later Hi-Potion a chest.*unresolved/);
  assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
  assert.ok(item, "Hi-Potion is missing from the item catalog");
  assert.deepEqual(objective?.sourceIds, sourceIds);
  for (const sourceId of sourceIds) {
    assert.ok(path.sourceIds.includes(sourceId), `${path.id} is missing ${sourceId}`);
    assert.ok(item.sourceIds.includes(sourceId), `${item.id} is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
  }
  assert.ok(iceCavernStep?.objectiveIds.includes(objectiveId));
  assert.match(iceCavernStep?.text ?? "", /search the entrance cart area for a Hi-Potion/i);
  assert.match(iceCavernStep?.detail ?? "", /check this Hi-Potion location again when control switches to Steiner/i);
  assert.ok(daliStep?.objectiveIds.includes(objectiveId));
  assert.match(daliStep?.text ?? "", /check the entrance cart\/barrel area.*if either pickup is still unclaimed/i);
});

test("Black Waltz 2's guaranteed and chance-based Ether drops have separate sourced paths", () => {
  const objectiveId = "disc-1.village-of-dali.black-waltz-2-ether-drop";
  const expected = [
    ["always", "item-path.disc-1.village-of-dali.black-waltz-2-ether-always-drop", ["gamefaqs-dali-71891", "jegged-dali", "cavesofnarshe-dali-enemies"]],
    ["common", "item-path.disc-1.village-of-dali.black-waltz-2-ether-common-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
    ["uncommon", "item-path.disc-1.village-of-dali.black-waltz-2-ether-uncommon-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
    ["rare", "item-path.disc-1.village-of-dali.black-waltz-2-ether-rare-drop", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]],
  ];
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const item = gameItems.find((entry) => entry.id === "game-item.ether");
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.black-waltz-2");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.dali.black-waltz-2");
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.village-of-dali")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "dali-black-waltz-2-ether-drop");

  assert.ok(objective, "Black Waltz 2 Ether collection objective is missing");
  assert.ok(item?.sourceIds.includes("cavesofnarshe-dali-enemies"), "Ether item is missing the Black Waltz 2 enemy source");
  assert.deepEqual(enemy?.drops.map((slot) => slot.slot), expected.map(([slot]) => slot));
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  assert.ok(step?.objectiveIds.includes(objectiveId));
  assert.match(step?.text ?? "", /guaranteed Ether drop/);
  assert.match(step?.text ?? "", /each is chance-based/);
  assert.match(step?.detail ?? "", /Caves of Narshe summarizes.*Ether ×4, while Jegged lists a single Ether/);
  assert.match(enemy?.notes.join(" ") ?? "", /one guaranteed slot plus up to three conditional additional copies/);

  for (const [slot, pathId, sourceIds] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const dropSlot = enemy?.drops.find((entry) => entry.slot === slot && entry.itemId === "game-item.ether");
    const requiredProvenance = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(dropSlot?.sourceIds ?? [])]);
    assert.ok(path, `${slot} Ether drop path is missing`);
    assert.equal(path.itemId, "game-item.ether");
    assert.equal(path.chapterId, "disc-1.village-of-dali");
    assert.equal(path.method, "drop");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, "enemy.black-waltz-2");
    assert.equal(path.enemyLootSlot, slot);
    assert.deepEqual(path.encounterIds, ["encounter.dali.black-waltz-2"]);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.match(path.conditions ?? "", new RegExp(slot, "i"));
    if (slot === "always") {
      assert.match(path.conditions ?? "", /guaranteed/i);
      assert.match(path.notes ?? "", /only the guaranteed copy as unconditional/);
    } else {
      assert.match(path.conditions ?? "", /chance-based/);
      assert.match(path.conditions ?? "", /KO victory/);
      assert.match(path.notes ?? "", /not treated as guaranteed/);
    }
    for (const sourceId of requiredProvenance) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing enemy/encounter/slot source ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `Ether item is missing ${sourceId}`);
      assert.ok(objective.sourceIds.includes(sourceId), `${objectiveId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Black Waltz 2 steals link Common and Uncommon slots to their exact one-time paths", () => {
  const objectiveId = "disc-1.village-of-dali.black-waltz-2-steals";
  const sourceIds = ["gamefaqs-dali-71891", "gamefaqs-dali-79143", "jegged-dali", "cavesofnarshe-dali-enemies", "elitegrindlab-dali", "opatil-steal-list"];
  const expected = [
    { itemId: "game-item.steepled-hat", slot: "common", pathId: "item-path.disc-1.village-of-dali.steepled-hat-black-waltz-2-steal", rate: /70%.*100%/ },
    { itemId: "game-item.leather-plate", slot: "uncommon", pathId: "item-path.disc-1.village-of-dali.leather-plate-black-waltz-2-steal", rate: /23%.*25%/ },
  ];
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const warning = missables.find((entry) => entry.id === "missable.disc-1.village-of-dali.black-waltz-2-steals");
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.black-waltz-2");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.dali.black-waltz-2");
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.village-of-dali")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "dali-black-waltz-2-steals");

  assert.ok(objective, "Black Waltz 2 steal objective is missing");
  assert.ok(warning, "Black Waltz 2 one-time steal warning is missing");
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId: "enemy.black-waltz-2", quantity: 1 }]);
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  assert.ok(step?.objectiveIds.includes(objectiveId));
  assert.match(step?.text ?? "", /Common Steepled Hat and Uncommon Leather Plate/);
  assert.match(step?.text ?? "", /individual attempts can fail/);
  assert.match(step?.detail ?? "", /Jegged reports 70%\/23% per connected steal attempt/);
  assert.match(step?.detail ?? "", /EliteGrindLab and Opa-Til list 100%\/25%/);
  assert.match(warning.note, /Jegged reports 70%\/23% per connected steal attempt/);
  assert.match(warning.note, /EliteGrindLab and Opa-Til list 100%\/25%/);
  assert.match(enemy?.notes.join(" ") ?? "", /GameFAQs 71891 and 79143.*Common.*Uncommon/);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const itemRecord = gameItems.find((entry) => entry.id === item.itemId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    assert.ok(path, `${item.pathId} is missing`);
    assert.equal(slot?.itemId, item.itemId);
    assert.equal(path.itemId, item.itemId);
    assert.equal(path.chapterId, "disc-1.village-of-dali");
    assert.equal(path.method, "steal");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, "enemy.black-waltz-2");
    assert.equal(path.enemyLootSlot, item.slot);
    assert.deepEqual(path.encounterIds, ["encounter.dali.black-waltz-2"]);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.match(path.conditions ?? "", /chance-based/);
    assert.match(path.conditions ?? "", /individual attempt can fail/);
    assert.match(path.notes ?? "", item.rate);
    for (const sourceId of sourceIds) {
      assert.ok(slot?.sourceIds.includes(sourceId), `${item.slot} slot is missing ${sourceId}`);
      assert.ok(path.sourceIds.includes(sourceId), `${item.pathId} is missing ${sourceId}`);
      assert.ok(itemRecord?.sourceIds.includes(sourceId), `${item.itemId} is missing ${sourceId}`);
      assert.ok(objective.sourceIds.includes(sourceId), `${objectiveId} is missing ${sourceId}`);
      assert.ok(warning.sourceIds.includes(sourceId), `Black Waltz 2 warning is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Plant Brain's guaranteed Phoenix Down and conditional Potion drops keep separate paths", () => {
  const objectiveId = "disc-1.evil-forest.plant-brain-drops";
  const expected = [
    ["always", "game-item.phoenix-down", "item-path.disc-1.evil-forest.plant-brain-phoenix-down-always-drop"],
    ["common", "game-item.potion", "item-path.disc-1.evil-forest.plant-brain-potion-common-drop"],
    ["uncommon", "game-item.potion", "item-path.disc-1.evil-forest.plant-brain-potion-uncommon-drop"],
    ["rare", "game-item.potion", "item-path.disc-1.evil-forest.plant-brain-potion-rare-drop"],
  ];
  const sourceIds = ["gamefaqs-evil-forest-71891", "gamefaqs-enemy-list-71891", "jegged-evil-forest"];
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.plant-brain");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.evil-forest.plant-brain");
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.evil-forest")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "plant-brain-drops");

  assert.ok(objective, "Plant Brain drop objective is missing");
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  assert.ok(step?.objectiveIds.includes(objectiveId));
  assert.match(step?.text ?? "", /guaranteed Phoenix Down/);
  assert.match(step?.text ?? "", /chance-based/);
  assert.match(step?.detail ?? "", /37\.5%, 12\.5%, and 0\.4%.*different rarity labels/);
  assert.match(enemy?.notes.join(" ") ?? "", /exact slot mapping is unresolved/);
  assert.deepEqual(enemy?.drops.slice(0, 4).map((slot) => slot.slot), expected.map(([slot]) => slot));

  for (const [slot, itemId, pathId] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const dropSlot = enemy?.drops.find((entry) => entry.slot === slot && entry.itemId === itemId);
    const requiredProvenance = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(dropSlot?.sourceIds ?? [])]);
    assert.ok(path, `${slot} Plant Brain drop path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.evil-forest");
    assert.equal(path.method, "drop");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, "enemy.plant-brain");
    assert.equal(path.enemyLootSlot, slot);
    assert.deepEqual(path.encounterIds, ["encounter.evil-forest.plant-brain"]);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(item, `${itemId} is missing from the item catalog`);
    if (slot === "always") assert.match(path.conditions ?? "", /guaranteed/);
    else {
      assert.match(path.conditions ?? "", /chance-based/);
      assert.match(path.conditions ?? "", /KO victory/);
    }
    for (const sourceId of requiredProvenance) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing enemy/encounter/slot source ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
      assert.ok(objective.sourceIds.includes(sourceId), `${objectiveId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Plant Brain steals link Eye Drops and Iron Helm to exact slots and preserve the rarity conflict", () => {
  const enemyId = "enemy.plant-brain";
  const encounterId = "encounter.evil-forest.plant-brain";
  const objectiveId = "disc-1.evil-forest.plant-brain-steals";
  const warningId = "missable.disc-1.evil-forest.plant-brain-steals";
  const expected = [
    { pathId: "item-path.disc-1.evil-forest.plant-brain-eye-drops-common-steal", itemId: "game-item.eye-drops", slot: "common" },
    { pathId: "item-path.disc-1.evil-forest.iron-helm-plant-brain-steal", itemId: "game-item.iron-helm", slot: "uncommon" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const warning = missables.find((entry) => entry.id === warningId);
  const linkedStealPaths = itemAcquisitionPaths.filter((entry) => entry.enemyId === enemyId && entry.method === "steal");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(linkedStealPaths.length, expected.length);
  assert.ok(objective, "Plant Brain steal objective is missing");
  assert.ok(warning, "Plant Brain steal warning is missing");
  assert.equal(warning?.objectiveId, objectiveId);
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const catalogItem = gameItems.find((entry) => entry.id === item.itemId);

    assert.ok(path, `${item.pathId} exists`);
    assert.ok(slot, `${item.slot} Plant Brain steal slot exists`);
    assert.ok(catalogItem, `${item.itemId} is missing from the item catalog`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-1.evil-forest");
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("chance-based"));
    assert.ok(path?.conditions?.includes("can fail"));
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));

    for (const sourceId of slot?.sourceIds ?? []) {
      assert.ok(path?.sourceIds.includes(sourceId), `${item.pathId} omits slot source ${sourceId}`);
      assert.ok(catalogItem?.sourceIds.includes(sourceId), `${item.itemId} omits slot source ${sourceId}`);
      assert.ok(objective?.sourceIds.includes(sourceId), `${objectiveId} omits slot source ${sourceId}`);
      assert.ok(warning?.sourceIds.includes(sourceId), `${warningId} omits slot source ${sourceId}`);
    }
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${item.pathId} has unknown source ${sourceId}`);
    }
  }

  const ironHelmPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-1.evil-forest.iron-helm-plant-brain-steal");
  assert.match(ironHelmPath?.notes ?? "", /GameFAQs and Gamer Guides label Iron Helm Uncommon; Jegged labels it Rare and reports 6% per connected attempt/);
  assert.match(enemy?.notes.join(" ") ?? "", /GameFAQs and Gamer Guides label Plant Brain's Iron Helm steal Uncommon; Jegged labels it Rare and reports 6% per connected attempt/);
  assert.match(warning?.note ?? "", /GameFAQs and Gamer Guides label the Iron Helm steal Uncommon; Jegged labels it Rare and reports 6% per connected attempt/);
});

test("Taharka steals link all three items to their exact slots in the one-time Ipsen encounter", () => {
  const enemyId = "enemy.taharka";
  const encounterId = "encounter.ipsens-castle.taharka";
  const objectiveId = "disc-3.ipsens-castle.taharka-steals";
  const warningId = "missable.disc-3.ipsens-castle.taharka-steals";
  const expected = [
    { pathId: "item-path.disc-3.ipsens-castle.taharka-elixir-steal", itemId: "game-item.elixir", slot: "common" },
    { pathId: "item-path.disc-3.ipsens-castle.taharka-mythril-claws-steal", itemId: "game-item.mythril-claws", slot: "uncommon" },
    { pathId: "item-path.disc-3.ipsens-castle.taharka-orichalcon-steal", itemId: "game-item.orichalcon", slot: "semi-rare" },
  ];
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const warning = missables.find((entry) => entry.id === warningId);
  const linkedPaths = itemAcquisitionPaths.filter((entry) => entry.enemyId === enemyId && entry.method === "steal");
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.ipsens-castle")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "ipsens-taharka");

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  assert.equal(linkedPaths.length, expected.length);
  assert.ok(objective, "Taharka steal objective is missing");
  assert.ok(warning, "Taharka steal warning is missing");
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(enemy?.routeObjectiveIds.includes(objectiveId));
  assert.equal(warning?.objectiveId, objectiveId);

  for (const { pathId, itemId, slot: slotName } of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const slot = enemy?.steals.find((entry) => entry.itemId === itemId && entry.slot === slotName);
    const item = gameItems.find((entry) => entry.id === itemId);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${pathId} exists`);
    assert.ok(slot, `${slotName} Taharka steal slot exists`);
    assert.ok(item, `${itemId} is missing from the item catalog`);
    assert.equal(path?.itemId, itemId);
    assert.equal(path?.chapterId, "disc-3.ipsens-castle");
    assert.equal(path?.method, "steal");
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, slotName);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.match(path?.conditions ?? "", /chance-based/);
    assert.match(path?.conditions ?? "", /can fail/);
    assert.doesNotMatch(path?.conditions ?? "", /\d+(?:\.\d+)?%/);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${pathId} includes enemy, encounter, and slot provenance`);

    for (const sourceId of slot?.sourceIds ?? []) {
      assert.ok(item?.sourceIds.includes(sourceId), `${itemId} omits slot source ${sourceId}`);
      assert.ok(objective?.sourceIds.includes(sourceId), `${objectiveId} omits slot source ${sourceId}`);
      assert.ok(warning?.sourceIds.includes(sourceId), `${warningId} omits slot source ${sourceId}`);
    }
    for (const sourceId of path?.sourceIds ?? []) {
      assert.ok(sources.some((source) => source.id === sourceId), `${pathId} has unknown source ${sourceId}`);
    }
    assert.ok(itemAcquisitionPaths.some((candidate) => candidate.itemId === itemId && candidate.chapterId !== "disc-3.ipsens-castle"), `${itemId} has a later recovery path`);
  }

  assert.match(step?.text ?? "", /Common Elixir, Uncommon Mythril Claws, and Semi-Rare Orichalcon/);
  assert.match(step?.text ?? "", /Each chance-based attempt can fail/);
  assert.doesNotMatch(`${step?.text ?? ""} ${step?.detail ?? ""}`, /\d+(?:\.\d+)?%/);
});

test("early Disc I boss drops have guaranteed source-linked item paths", () => {
  const scenarios = [
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

  for (const scenario of scenarios) {
    const objective = objectives.find((entry) => entry.id === scenario.objectiveId);
    const encounter = enemyEncounters.find((entry) => entry.id === scenario.encounterId);
    const step = walkthroughChapters
      .find((chapter) => chapter.areaId === scenario.chapterId)
      ?.sections.flatMap((section) => section.steps)
      .find((entry) => entry.id === scenario.stepId);

    assert.ok(objective, `${scenario.objectiveId} is missing`);
    assert.ok(encounter?.objectiveIds.includes(scenario.objectiveId));
    assert.ok(step?.objectiveIds.includes(scenario.objectiveId));
    assert.match(step?.text ?? "", /guaranteed/);
    for (const [enemyId, itemId, pathId, slotName] of scenario.entries) {
      const enemy = enemyRecords.find((entry) => entry.id === enemyId);
      const lootSlot = enemy?.drops.find((slot) => slot.slot === slotName && slot.itemId === itemId);
      const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
      const item = gameItems.find((entry) => entry.id === itemId);
      assert.ok(enemy?.routeObjectiveIds.includes(scenario.objectiveId));
      assert.ok(lootSlot, `${enemyId} has the ${slotName} ${itemId} drop slot`);
      assert.ok(path, `${pathId} is missing`);
      assert.equal(path.itemId, itemId);
      assert.equal(path.chapterId, scenario.chapterId);
      assert.equal(path.method, "drop");
      assert.equal(path.quantity, 1);
      assert.equal(path.availability, "one-time-encounter");
      assert.equal(path.enemyId, enemyId);
      assert.equal(path.enemyLootSlot, slotName);
      assert.deepEqual(path.encounterIds, [scenario.encounterId]);
      assert.match(path.conditions ?? "", /guaranteed/);
      assert.ok(path.walkthroughObjectiveIds?.includes(scenario.objectiveId));
      for (const sourceId of lootSlot?.sourceIds ?? []) assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing loot-slot source ${sourceId}`);
      assert.ok(item, `${itemId} is missing`);
      for (const sourceId of scenario.sourceIds) {
        assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
        assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
        assert.ok(objective.sourceIds.includes(sourceId), `${scenario.objectiveId} is missing ${sourceId}`);
        assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
      }
    }
  }
});

test("Ice Cavern boss steals link every item path to its exact enemy slot and encounter", () => {
  const objectiveId = "disc-1.ice-cavern.boss-steals";
  const encounterId = "encounter.ice-cavern.black-waltz-1-sealion";
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const objective = objectives.find((entry) => entry.id === objectiveId);
  const expected = [
    { enemyId: "enemy.black-waltz-1", itemId: "game-item.remedy", slot: "common", pathId: "item-path.disc-1.ice-cavern.black-waltz-1-remedy-steal" },
    { enemyId: "enemy.black-waltz-1", itemId: "game-item.silk-shirt", slot: "uncommon", pathId: "item-path.disc-1.ice-cavern.black-waltz-1-silk-shirt-steal" },
    { enemyId: "enemy.sealion", itemId: "game-item.ether", slot: "common", pathId: "item-path.disc-1.ice-cavern.sealion-ether-steal" },
    { enemyId: "enemy.sealion", itemId: "game-item.mythril-dagger", slot: "uncommon", pathId: "item-path.disc-1.ice-cavern.sealion-mythril-dagger-steal" },
  ];

  assert.equal(encounter?.kind, "boss");
  assert.ok(encounter?.objectiveIds.includes(objectiveId));
  assert.ok(objective, `${objectiveId} is missing`);
  for (const expectedPath of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === expectedPath.enemyId);
    const slot = enemy?.steals.find((entry) => entry.slot === expectedPath.slot && entry.itemId === expectedPath.itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === expectedPath.pathId);

    assert.ok(slot, `${expectedPath.enemyId} ${expectedPath.slot} ${expectedPath.itemId} slot is missing`);
    assert.ok(path, `${expectedPath.pathId} is missing`);
    assert.equal(path?.itemId, expectedPath.itemId);
    assert.equal(path?.method, "steal");
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, expectedPath.enemyId);
    assert.equal(path?.enemyLootSlot, expectedPath.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.match(path?.conditions ?? "", /chance-based/);
    for (const sourceId of slot?.sourceIds ?? []) assert.ok(path?.sourceIds.includes(sourceId), `${expectedPath.pathId} is missing slot source ${sourceId}`);
    for (const sourceId of path?.sourceIds ?? []) assert.ok(sources.some((source) => source.id === sourceId), `${expectedPath.pathId} references unknown source ${sourceId}`);
  }
});

test("Gizamaluke item paths link all three steals and the guaranteed Tent to exact boss slots", () => {
  const enemyId = "enemy.gizamaluke";
  const encounterId = "encounter.gizamaluke-grotto.gizamaluke";
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const expected = [
    { id: "item-path.disc-1.journey-to-burmecia.elixir-gizamaluke-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
    { id: "item-path.disc-1.journey-to-burmecia.magus-hat-gizamaluke-steal", itemId: "game-item.magus-hat", method: "steal", slot: "uncommon", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
    { id: "item-path.disc-1.journey-to-burmecia.ice-staff-gizamaluke-steal", itemId: "game-item.ice-staff", method: "steal", slot: "semi-rare", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-steals" },
    { id: "item-path.disc-1.journey-to-burmecia.gizamaluke-tent-always-drop", itemId: "game-item.tent", method: "drop", slot: "always", objectiveId: "disc-1.journey-to-burmecia.gizamaluke-drops" },
  ];

  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.slot === item.slot);
    const objective = objectives.find((entry) => entry.id === item.objectiveId);
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a source-backed loot slot`);
    assert.equal(slot?.itemId, item.itemId);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.chapterId, "disc-1.journey-to-burmecia");
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    assert.ok(objective?.sourceIds.every((sourceId) => path?.sourceIds.includes(sourceId)));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)));
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", /chance-based/);
      assert.doesNotMatch(`${path?.conditions ?? ""} ${path?.notes ?? ""}`, /\d+(?:\.\d+)?%/);
    } else {
      assert.match(path?.conditions ?? "", /Always/);
      assert.match(path?.conditions ?? "", /victory/);
    }
  }
});

test("Ice Cavern mist-jet steals and conditional drops are repeatable and slot-specific", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
  const encounterId = "encounter.ice-cavern.mist-jet-pool";
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const encounterPaths = itemAcquisitionPaths.filter((path) => path.encounterIds?.includes(encounterId));
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.ice-cavern")
    ?.sections.find((entry) => entry.id === "ice-cavern-lower-path");
  const step = section?.steps.find((entry) => entry.id === "ice-mist-jets");

  assert.deepEqual(encounter?.formation.map((entry) => entry.enemyId), ["enemy.cave-imp", "enemy.flan-ice-cavern", "enemy.wyerd"]);
  assert.ok(step?.detail?.includes("drops require a KO"));
  assert.ok(section?.sourceIds.includes("gamefaqs-enemy-list-71891"));
  assert.equal(expected.length, 14);
  assert.equal(encounterPaths.length, expected.length);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.ice-cavern.${pathSuffix}`);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    assert.ok(lootSlot, `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.ice-cavern");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.equal(path.enemyId, enemyId);
    assert.equal(path.enemyLootSlot, slotName);
    assert.deepEqual(path.encounterIds, [encounterId]);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"), `${itemId} is missing the enemy list source`);
    assert.ok(lootSlot.sourceIds.includes("gamefaqs-enemy-list-71891"), `${enemyId} ${slotName} slot is missing its loot-table source`);
    if (method === "drop") {
      assert.match(path.conditions ?? "", /normal KO defeat/);
      assert.match(path.conditions ?? "", /chance-based/);
      assert.match(path.conditions ?? "", /conditional/);
    } else {
      assert.match(path.conditions ?? "", /chance-based/);
      assert.match(path.conditions ?? "", /not guaranteed/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `mist-jet encounter is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Nolrich Heights combat loot preserves the regional roster and friendly Mu distinction", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.nolrich-heights.world-map-pool");
  const chapter = walkthroughChapters.find((entry) => entry.areaId === "disc-1.ice-cavern");
  const section = chapter?.sections.find((entry) => entry.id === "exit-and-nolrich-heights");
  const step = section?.steps.find((entry) => entry.id === "nolrich-heights-world-map-loot");
  const friendlyStep = section?.steps.find((entry) => entry.id === "friendly-mu");

  assert.deepEqual(encounter?.formation.map((entry) => entry.enemyId), ["enemy.carve-spider", "enemy.mu", "enemy.python"]);
  assert.match(encounter?.notes.join(" ") ?? "", /Gunitas Basin/);
  assert.match(step?.text ?? "", /standard battles/);
  assert.match(step?.text ?? "", /Leave a friendly Mu alone/);
  assert.match(step?.detail ?? "", /Mu\/Python under Gunitas Basin/);
  assert.ok(friendlyStep?.objectiveIds?.includes("disc-1.ice-cavern.mu-friendly-monster"));
  assert.ok(section?.sourceIds.includes("gamefaqs-enemy-list-71891"));
  assert.equal(expected.length, 15);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.ice-cavern.nolrich-${pathSuffix}`);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.ice-cavern");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"), `${itemId} is missing the enemy list source`);
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO defeat/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Nolrich Heights encounter is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Dali underground enemy loot has temporary paths and preserves the Skeleton dispute", () => {
  const sourceIds = [
    "gamefaqs-enemy-list-71891",
    "gamefaqs-dali-71891",
    "jegged-dali",
    "gamerguides-dali",
    "cavesofnarshe-dali-walkthrough",
    "elitegrindlab-dali",
  ];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.dali-underground.random-pool");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.village-of-dali")
    ?.sections.find((entry) => entry.id === "dali-underground-factory");
  const step = section?.steps.find((entry) => entry.id === "dali-underground-optional-loot");

  assert.deepEqual(encounter?.formation.map((entry) => entry.enemyId), ["enemy.ghost", "enemy.vice", "enemy.skeleton"]);
  assert.match(encounter?.notes.join(" ") ?? "", /Jegged and EliteGrindLab also include Skeleton/);
  assert.match(step?.text ?? "", /before the factory seals/);
  assert.match(step?.detail ?? "", /Skeleton.*source-disputed|source-disputed.*Skeleton/i);
  assert.ok(encounter?.sourceIds.includes("ffwiki-skeleton"));
  assert.ok(section?.sourceIds.includes("ffwiki-skeleton"));
  assert.ok(sources.some((source) => source.id === "ffwiki-skeleton"));
  assert.equal(expected.length, 15);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-1.village-of-dali.underground-" + pathSuffix);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), enemyId + " " + slotName + " " + method + " slot is missing");
    assert.ok(path, pathSuffix + " path is missing");
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.village-of-dali");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "limited-window");
    assert.equal(path.walkthroughObjectiveIds, undefined, "chance-based enemy loot must not become a guaranteed completion objective");
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"), itemId + " is missing the enemy list source");
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO defeat/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    if (enemyId === "enemy.skeleton") {
      assert.match(path.notes ?? "", /source-disputed/i);
      assert.match(path.notes ?? "", /Jegged and EliteGrindLab/);
      assert.ok(path.sourceIds.includes("ffwiki-skeleton"));
      assert.ok(enemy?.sourceIds.includes("ffwiki-skeleton"));
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), pathSuffix + " is missing " + sourceId);
      assert.ok(enemy?.sourceIds.includes(sourceId), enemyId + " is missing " + sourceId);
      assert.ok(encounter?.sourceIds.includes(sourceId), "Dali underground encounter is missing " + sourceId);
      assert.ok(sources.some((source) => source.id === sourceId), "unknown source " + sourceId);
    }
  }
});

test("Gunitas Basin Goblin loot has repeatable sourced steal/drop paths", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
  const expected = [
    ["steal", "common", "game-item.potion", "potion-common-steal"],
    ["drop", "common", "game-item.potion", "potion-common-drop"],
    ["drop", "uncommon", "game-item.echo-screen", "echo-screen-uncommon-drop"],
    ["drop", "rare", "game-item.phoenix-down", "phoenix-down-rare-drop"],
  ];
  const goblin = enemyRecords.find((entry) => entry.id === "enemy.goblin");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.gunitas-basin.world-map-pool");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.ice-cavern")
    ?.sections.find((entry) => entry.id === "exit-and-nolrich-heights");
  const step = section?.steps.find((entry) => entry.id === "gunitas-basin-goblin-loot");

  assert.ok(encounter?.formation.some((entry) => entry.enemyId === "enemy.goblin"));
  assert.match(step?.text ?? "", /Gunitas Basin.*Goblin.*Mu.*Python/);
  assert.match(step?.detail ?? "", /exact encounter tiles, combinations, and rates are not published/);

  for (const [method, slotName, itemId, suffix] of expected) {
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? goblin?.steals : goblin?.drops;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.village-of-dali.gunitas-goblin-${suffix}`);
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId));
    assert.ok(path, `Goblin ${method} ${slotName} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.village-of-dali");
    assert.equal(path.method, method);
    assert.equal(path.availability, "repeatable");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `Goblin path is missing ${sourceId}`);
      assert.ok(goblin?.sourceIds.includes(sourceId), `Goblin record is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Gunitas Basin encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Gunitas Basin walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Gunitas Basin Mu and Python have repeatable regional loot paths", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.gunitas-basin.world-map-pool");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.ice-cavern")
    ?.sections.find((entry) => entry.id === "exit-and-nolrich-heights");
  const step = section?.steps.find((entry) => entry.id === "gunitas-basin-goblin-loot");

  assert.ok(encounter?.formation.some((entry) => entry.enemyId === "enemy.mu"));
  assert.ok(encounter?.formation.some((entry) => entry.enemyId === "enemy.python"));
  assert.match(step?.text ?? "", /separate steal and conditional drop slots/);
  assert.match(step?.detail ?? "", /friendly Mu belongs to the separate Friendly Monster task/);
  assert.equal(expected.length, 9);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.village-of-dali.gunitas-${pathSuffix}`);
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.village-of-dali");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO defeat/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Gunitas Basin encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Gunitas Basin walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Evil Forest Dendrobium and Fang [A] have limited-window steal/drop paths", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.evil-forest.random-pool");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.evil-forest")
    ?.sections.find((entry) => entry.id === "forest-path-monty");
  const step = section?.steps.find((entry) => entry.id === "evil-forest-goblin-loot");

  assert.ok(["enemy.dendrobium", "enemy.fang-a", "enemy.goblin"].every((enemyId) =>
    encounter?.formation.some((entry) => entry.enemyId === enemyId)));
  assert.match(step?.text ?? "", /Dendrobium, Fang \[A\], and Goblin/);
  assert.match(step?.detail ?? "", /party escapes and the forest closes/);
  assert.equal(expected.length, 12);
  assert.equal(itemAcquisitionPaths.filter((entry) =>
    entry.id.startsWith("item-path.disc-1.evil-forest.dendrobium-") ||
    entry.id.startsWith("item-path.disc-1.evil-forest.fang-a-")).length, 12);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.evil-forest.${pathSuffix}`);
    assert.ok(lootSlot, `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.evil-forest");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "limited-window");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.equal(path.enemyId, enemyId);
    assert.equal(path.enemyLootSlot, slotName);
    assert.deepEqual(path.encounterIds, ["encounter.evil-forest.random-pool"]);
    assert.match(path.conditions ?? "", /chance-based/);
    assert.ok(path.conditions?.includes("before the area closes"));
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Evil Forest encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Evil Forest walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing exact slot provenance ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Evil Forest Goblin loot has limited-window sourced steal/drop paths", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-evil-forest-71891", "jegged-evil-forest", "elitegrindlab-evil-forest"];
  const expected = [
    ["steal", "common", "game-item.potion", "potion-common-steal"],
    ["drop", "common", "game-item.potion", "potion-common-drop"],
    ["drop", "uncommon", "game-item.echo-screen", "echo-screen-uncommon-drop"],
    ["drop", "rare", "game-item.phoenix-down", "phoenix-down-rare-drop"],
  ];
  const goblin = enemyRecords.find((entry) => entry.id === "enemy.goblin");
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.evil-forest.random-pool");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.evil-forest")
    ?.sections.find((entry) => entry.id === "forest-path-monty");
  const step = section?.steps.find((entry) => entry.id === "evil-forest-goblin-loot");

  assert.ok(encounter?.formation.some((entry) => entry.enemyId === "enemy.goblin"));
  assert.equal(itemAcquisitionPaths.filter((entry) => entry.id.startsWith("item-path.disc-1.evil-forest.goblin-")).length, 4);
  assert.match(step?.text ?? "", /Dendrobium, Fang \[A\], and Goblin/);
  assert.match(step?.detail ?? "", /forest closes/);

  for (const [method, slotName, itemId, suffix] of expected) {
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? goblin?.steals : goblin?.drops;
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.evil-forest.goblin-${suffix}`);
    assert.ok(lootSlot);
    assert.ok(path, `Evil Forest Goblin ${method} ${slotName} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.evil-forest");
    assert.equal(path.method, method);
    assert.equal(path.availability, "limited-window");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.equal(path.enemyId, "enemy.goblin");
    assert.equal(path.enemyLootSlot, slotName);
    assert.deepEqual(path.encounterIds, ["encounter.evil-forest.random-pool"]);
    assert.match(path.conditions ?? "", /chance-based/);
    assert.ok(path.conditions?.includes("before the area closes"));
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `Evil Forest Goblin path is missing ${sourceId}`);
      assert.ok(goblin?.sourceIds.includes(sourceId), `Goblin record is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Evil Forest encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Evil Forest walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of new Set([...(goblin?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `Evil Forest Goblin path is missing exact slot provenance ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Gizamaluke's Grotto loot paths separate the random pool from fixed Type A pairs", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke"];
  const expected = [
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
  const poolId = "encounter.gizamaluke-grotto.random-pool";
  const pairEncounters = [
    { id: "encounter.gizamaluke-grotto.type-a-first-pair", slug: "first-pair", label: "first scripted Type A pair" },
    { id: "encounter.gizamaluke-grotto.type-a-second-pair", slug: "second-pair", label: "second scripted Type A pair" },
  ];
  const encounterIds = [poolId, ...pairEncounters.map((entry) => entry.id)];
  const pool = enemyEncounters.find((entry) => entry.id === poolId);
  const pairs = pairEncounters.map((expectedPair) => enemyEncounters.find((entry) => entry.id === expectedPair.id));
  const typeA = enemyRecords.find((entry) => entry.id === "enemy.type-a");
  const section = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.find((entry) => entry.id === "journey-grotto-bells");
  const step = section?.steps.find((entry) => entry.id === "journey-grotto-regular-enemy-loot");
  const grottoLootPaths = itemAcquisitionPaths.filter((path) => path.encounterIds?.some((id) => encounterIds.includes(id)));
  const poolLootPaths = itemAcquisitionPaths.filter((path) => path.encounterIds?.includes(poolId));
  const fixedPairLootPaths = itemAcquisitionPaths.filter((path) => pairEncounters.some((pair) => path.encounterIds?.includes(pair.id)));

  assert.deepEqual(pool?.formation.map((entry) => entry.enemyId), ["enemy.hornet", "enemy.lamia", "enemy.skeleton"]);
  assert.deepEqual(typeA?.encounterIds, [
    "encounter.gizamaluke-grotto.type-a-first-pair",
    "encounter.gizamaluke-grotto.type-a-second-pair",
    "encounter.burmecia.type-a-pair",
  ]);
  assert.ok(pairs.every((entry) => entry?.kind === "fixed" && entry.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2)));
  assert.match(step?.text ?? "", /Lamia's Always Potion is guaranteed on a KO/);
  assert.match(step?.text ?? "", /all Grotto drops require KO victories/);
  assert.match(step?.detail ?? "", /Type A item routes are linked to each fixed pair separately/);
  assert.match(step?.detail ?? "", /No random formation or encounter rate is inferred/);
  assert.equal(expected.length, 18);
  assert.equal(poolLootPaths.length, 13);
  assert.equal(fixedPairLootPaths.length, 10);
  assert.equal(grottoLootPaths.length, 23);

  for (const [enemyId, method, slotName, itemId, baseSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    assert.ok(lootSlot, `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));

    const isFixedPair = enemyId === "enemy.type-a";
    const linkedPairs = isFixedPair ? pairEncounters : [{ id: poolId, slug: "", label: "Grotto random pool" }];
    for (const pair of linkedPairs) {
      const pathSuffix = isFixedPair ? `type-a-${pair.slug}-${baseSuffix.slice("type-a-".length)}` : baseSuffix;
      const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.journey-to-burmecia.grotto-${pathSuffix}`);
      const encounter = enemyEncounters.find((entry) => entry.id === pair.id);
      assert.ok(path, `${pathSuffix} path is missing`);
      assert.equal(path.itemId, itemId);
      assert.equal(path.chapterId, "disc-1.journey-to-burmecia");
      assert.equal(path.method, method);
      assert.equal(path.quantity, isFixedPair ? 2 : 1);
      assert.equal(path.availability, isFixedPair ? "one-time-encounter" : "repeatable");
      assert.equal(path.enemyId, enemyId);
      assert.equal(path.enemyLootSlot, slotName);
      assert.deepEqual(path.encounterIds, [pair.id]);
      assert.equal(path.walkthroughObjectiveIds, undefined);
      if (method === "steal") {
        assert.match(path.conditions ?? "", /chance-based/);
        assert.match(path.conditions ?? "", /not guaranteed/);
      } else {
        assert.match(path.conditions ?? "", /normal KO victory/);
        if (slotName === "always") {
          assert.match(path.conditions ?? "", /Always drop slot yields/);
          assert.doesNotMatch(path.conditions ?? "", /conditional/);
        } else {
          assert.match(path.conditions ?? "", /chance-based/);
          assert.match(path.conditions ?? "", /conditional/);
        }
      }
      if (isFixedPair) {
        assert.match(path.conditions ?? "", new RegExp(pair.label));
        assert.match(path.notes ?? "", /two.*loot opportunity/);
      }
      for (const sourceId of new Set([
        ...sourceIds,
        ...(enemy?.sourceIds ?? []),
        ...(encounter?.sourceIds ?? []),
        ...(lootSlot?.sourceIds ?? []),
      ])) {
        assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
        assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
      }
    }
  }
});

test("Burmecia's fixed Type A pair loot paths link exact slots to both enemies", () => {
  const expected = [
    { itemId: "game-item.phoenix-down", method: "steal", slot: "common", pathId: "item-path.disc-1.burmecia.type-a-pair-phoenix-down-common-steal" },
    { itemId: "game-item.tent", method: "steal", slot: "uncommon", pathId: "item-path.disc-1.burmecia.type-a-pair-tent-uncommon-steal" },
    { itemId: "game-item.potion", method: "drop", slot: "common", pathId: "item-path.disc-1.burmecia.type-a-pair-potion-common-drop" },
    { itemId: "game-item.phoenix-down", method: "drop", slot: "uncommon", pathId: "item-path.disc-1.burmecia.type-a-pair-phoenix-down-uncommon-drop" },
    { itemId: "game-item.ether", method: "drop", slot: "rare", pathId: "item-path.disc-1.burmecia.type-a-pair-ether-rare-drop" },
  ];
  const enemyId = "enemy.type-a";
  const encounterId = "encounter.burmecia.type-a-pair";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")
    ?.sections.find((entry) => entry.id === "burmecia-lower-streets");
  const step = section?.steps.find((entry) => entry.id === "burmecia-type-a-pair-loot");
  const paths = itemAcquisitionPaths.filter((entry) => entry.encounterIds?.includes(encounterId));

  assert.equal(encounter?.kind, "fixed");
  assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 2 }]);
  assert.ok(enemy?.encounterIds.includes(encounterId));
  assert.equal(paths.length, expected.length);
  assert.match(step?.text ?? "", /Common Phoenix Down and Uncommon Tent steals/);
  assert.match(step?.text ?? "", /either attempt can fail/);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slots = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = slots?.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    const catalogItem = gameItems.find((entry) => entry.id === item.itemId);
    const requiredSources = new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])]);

    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 2);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.conditions?.includes("at most two"));
    if (item.method === "steal") {
      assert.ok(path?.conditions?.includes("chance-based"));
      assert.ok(path?.conditions?.includes("can fail"));
    } else {
      assert.ok(path?.conditions?.includes("normal KO victories"));
      assert.ok(path?.conditions?.includes("conditional"));
    }
    assert.ok(path?.notes?.includes("two per-enemy slot opportunities"));
    assert.ok(path?.notes?.includes("separate from the two Type A pairs in Gizamaluke's Grotto"));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.pathId} preserves encounter and slot sources`);
    assert.ok([...requiredSources].every((sourceId) => catalogItem?.sourceIds.includes(sourceId)), `${item.itemId} includes acquisition provenance`);
    assert.ok([...requiredSources].every((sourceId) => section?.sourceIds.includes(sourceId)), `${section?.id} includes acquisition provenance`);
    assert.ok([...requiredSources].every((sourceId) => sources.some((source) => source.id === sourceId)), `${item.pathId} references known sources`);
  }
});

test("Burmecia's three Mimic chests link their loot slots to separate optional encounters", () => {
  const chests = [
    { slug: "suburb-balcony", encounterId: "encounter.burmecia.suburb.mimic-chest-1" },
    { slug: "suburb-stairwell", encounterId: "encounter.burmecia.suburb.mimic-chest-2" },
    { slug: "uptown", encounterId: "encounter.burmecia.uptown.mimic-chest" },
  ];
  const lootSlots = [
    { id: "steal-hi-potion", itemId: "game-item.hi-potion", method: "steal", slot: "common" },
    { id: "steal-antidote", itemId: "game-item.antidote", method: "steal", slot: "uncommon" },
    { id: "drop-ether-always", itemId: "game-item.ether", method: "drop", slot: "always" },
    { id: "drop-hi-potion-common", itemId: "game-item.hi-potion", method: "drop", slot: "common" },
    { id: "drop-phoenix-down-uncommon", itemId: "game-item.phoenix-down", method: "drop", slot: "uncommon" },
    { id: "drop-ether-rare", itemId: "game-item.ether", method: "drop", slot: "rare" },
  ];
  const enemyId = "enemy.mimic";
  const enemy = enemyRecords.find((entry) => entry.id === enemyId);
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")
    ?.sections.find((entry) => entry.id === "burmecia-lower-streets");
  const step = section?.steps.find((entry) => entry.id === "burmecia-mimic-chest-loot");
  const expectedStepSources = [
    "gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "elitegrindlab-burmecia",
    "gamefaqs-enemy-list-71891", "drslice-mimic", "opatil-drop-list", "megane-kangaroo-disc4-burmecia-recovery",
  ];

  assert.equal(step?.kind, "optional");
  assert.match(step?.text ?? "", /Common Hi-Potion and Uncommon Antidote/);
  assert.match(step?.text ?? "", /either steal can fail/);
  assert.match(step?.detail ?? "", /not requirements for the Burmecia treasure-sweep checklist/);
  assert.ok(expectedStepSources.every((sourceId) => section?.sourceIds.includes(sourceId)));

  for (const chest of chests) {
    const encounter = enemyEncounters.find((entry) => entry.id === chest.encounterId);
    const paths = itemAcquisitionPaths.filter((entry) => entry.encounterIds?.includes(chest.encounterId));

    assert.equal(encounter?.kind, "fixed");
    assert.deepEqual(encounter?.formation, [{ enemyId, quantity: 1 }]);
    assert.ok(enemy?.encounterIds.includes(chest.encounterId));
    assert.equal(paths.length, lootSlots.length);

    for (const expected of lootSlots) {
      const pathId = `item-path.disc-1.burmecia.mimic-${chest.slug}.${expected.id}`;
      const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
      const slotRecord = (expected.method === "steal" ? enemy?.steals : enemy?.drops)
        ?.find((entry) => entry.itemId === expected.itemId && entry.slot === expected.slot);
      const catalogItem = gameItems.find((entry) => entry.id === expected.itemId);
      const expectedSources = new Set([
        ...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slotRecord?.sourceIds ?? []),
        "drslice-mimic", ...(expected.method === "drop" ? ["opatil-drop-list"] : []),
      ]);

      assert.ok(path, `${pathId} exists`);
      assert.equal(path?.itemId, expected.itemId);
      assert.equal(path?.method, expected.method);
      assert.equal(path?.chapterId, "disc-1.burmecia");
      assert.equal(path?.quantity, 1);
      assert.equal(path?.availability, "one-time-encounter");
      assert.equal(path?.enemyId, enemyId);
      assert.equal(path?.enemyLootSlot, expected.slot);
      assert.deepEqual(path?.encounterIds, [chest.encounterId]);
      assert.equal(path?.walkthroughObjectiveIds, undefined);
      assert.match(path?.notes ?? "", /same encounter if its chest was left unopened earlier/);
      if (expected.method === "steal") {
        assert.match(path?.conditions ?? "", /chance-based and can fail/);
      } else {
        assert.match(path?.conditions ?? "", /KO defeat/);
        if (expected.slot === "always") {
          assert.match(path?.conditions ?? "", /Always drop slot yields Ether/);
          assert.doesNotMatch(path?.conditions ?? "", /conditional/);
        } else {
          assert.match(path?.conditions ?? "", /chance-based and conditional/);
        }
      }
      assert.ok(catalogItem?.sourceIds.includes("gamefaqs-enemy-list-71891"));
      assert.ok([...expectedSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${pathId} includes enemy, encounter, and slot provenance`);
      assert.ok([...expectedSources].every((sourceId) => sources.some((source) => source.id === sourceId)), `${pathId} references known sources`);
    }
  }
});

test("Burmecia's city-pool enemies have repeatable loot paths with the Magic Vice dispute retained", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-burmecia-71891", "jegged-burmecia"];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.burmecia.city-random-pool");
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")
    ?.sections.find((entry) => entry.id === "burmecia-lower-streets");
  const step = section?.steps.find((entry) => entry.id === "burmecia-city-regular-enemy-loot");

  assert.equal(expected.length, 17);
  assert.ok(["enemy.basilisk", "enemy.ironite", "enemy.magic-vice"].every((enemyId) =>
    encounter?.formation.some((entry) => entry.enemyId === enemyId && entry.quantity === null)));
  assert.match(step?.text ?? "", /defeat enemies with KO for their drop slots/);
  assert.match(step?.detail ?? "", /all 17 item-bearing steal and drop slots/);
  assert.match(step?.detail ?? "", /Magic Vice Common steal route follows the GameFAQs Enemy List and Jegged table/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [enemyId, method, slotName, itemId, pathSuffix] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.burmecia.city-${pathSuffix}`);
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), `${enemyId} ${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.burmecia");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      if (slotName === "always") {
        assert.match(path.conditions ?? "", /Always drop slot yields/);
        assert.doesNotMatch(path.conditions ?? "", /conditional/);
      } else {
        assert.match(path.conditions ?? "", /conditional/);
      }
    }
    if (enemyId === "enemy.magic-vice" && slotName === "common" && method === "steal") {
      assert.match(path.notes ?? "", /GameFAQs and Jegged list Echo Screen.*EliteGrindLab lists Eye Drops/);
      assert.ok(path.sourceIds.includes("elitegrindlab-burmecia"));
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Burmecia city encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Burmecia walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Burmecia's fixed Type A pair has separate one-time loot opportunities", () => {
  const sourceIds = ["gamefaqs-enemy-list-71891", "gamefaqs-burmecia-71891", "jegged-burmecia"];
  const expected = [
    ["steal", "common", "game-item.phoenix-down", "phoenix-down-common-steal"],
    ["steal", "uncommon", "game-item.tent", "tent-uncommon-steal"],
    ["drop", "common", "game-item.potion", "potion-common-drop"],
    ["drop", "uncommon", "game-item.phoenix-down", "phoenix-down-uncommon-drop"],
    ["drop", "rare", "game-item.ether", "ether-rare-drop"],
  ];
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.burmecia.type-a-pair");
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.type-a");
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.burmecia")
    ?.sections.find((entry) => entry.id === "burmecia-lower-streets");
  const step = section?.steps.find((entry) => entry.id === "burmecia-type-a-pair-loot");

  assert.equal(expected.length, 5);
  assert.equal(encounter?.kind, "fixed");
  assert.ok(encounter?.formation.some((member) => member.enemyId === "enemy.type-a" && member.quantity === 2));
  assert.match(step?.text ?? "", /try each enemy's Common Phoenix Down and Uncommon Tent steals/);
  assert.match(step?.text ?? "", /either attempt can fail/);
  assert.match(step?.detail ?? "", /each listed slot has two per-enemy opportunities/);
  assert.match(step?.detail ?? "", /separate from the two fixed Type A pairs in Gizamaluke's Grotto/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [method, slotName, itemId, pathSuffix] of expected) {
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.burmecia.type-a-pair-${pathSuffix}`);
    assert.ok(slots?.some((slot) => slot.slot === slotName && slot.itemId === itemId), `${slotName} ${method} slot is missing`);
    assert.ok(path, `${pathSuffix} path is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.burmecia");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 2);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.match(path.notes ?? "", /two per-enemy slot opportunities/);
    assert.ok(gameItems.find((item) => item.id === itemId)?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victories/);
      assert.match(path.conditions ?? "", /slot is conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathSuffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `Type A is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `Burmecia Type A encounter is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Burmecia walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Burmecia/Cleyra world-map enemies have repeatable paths for all item-bearing loot slots", () => {
  const sourceIds = [
    "gamefaqs-enemy-list-71891",
    "gamefaqs-journey-to-burmecia-71891",
    "jegged-gizamaluke",
    "cavesofnarshe-enemies",
    "elitegrindlab-burmecia",
  ];
  const expected = [
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
  const encounter = enemyEncounters.find((entry) => entry.id === "encounter.burmecia-region.world-map-pool");
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.find((entry) => entry.id === "journey-daines-horse-basin-detours");
  const step = section?.steps.find((entry) => entry.id === "journey-burmecia-region-enemy-loot");

  assert.equal(expected.length, 30);
  assert.match(step?.text ?? "", /KO enemies if pursuing drops/);
  assert.match(step?.detail ?? "", /Only an enemy's Always item drop is guaranteed on a KO victory/);
  assert.match(step?.detail ?? "", /These optional loot chances are not completion objectives/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [enemyId, method, slotName, itemId] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const item = gameItems.find((entry) => entry.id === itemId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const suffix = `${enemyId.replace("enemy.", "")}-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-1.journey-to-burmecia.region-${suffix}`);
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), `${enemyId} ${slotName} ${method} slot missing`);
    assert.ok(enemy?.encounterIds.includes("encounter.burmecia-region.world-map-pool"));
    assert.ok(path, `${suffix} item route missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.journey-to-burmecia");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.match(path.notes ?? "", /exact world-map tile/);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      if (slotName === "always") {
        assert.match(path.conditions ?? "", /Always drop slot yields/);
        assert.doesNotMatch(path.conditions ?? "", /conditional/);
      } else {
        assert.match(path.conditions ?? "", /conditional/);
      }
    } else {
      assert.match(path.conditions ?? "", /success is not guaranteed/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} is missing ${sourceId}`);
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `regional pool is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `regional walkthrough is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
  }
});

test("Cleyra Trunk enemies have limited-window paths for all item-bearing loot slots", () => {
  const sourceIds = [
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
  const expected = [
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
  const encounters = new Map(enemyEncounters.map((entry) => [entry.id, entry]));
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")
    ?.sections.find((entry) => entry.id === "cleyra-trunk");
  const step = section?.steps.find((entry) => entry.id === "cleyra-trunk-enemy-loot");

  assert.equal(expected.length, 30);
  assert.match(step?.text ?? "", /every drop requires a KO victory/);
  assert.match(step?.detail ?? "", /does not say whether random encounters recur there/);
  assert.match(step?.detail ?? "", /Cleyra and its Trunk close after the post-Beatrix departure to the Red Rose/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [enemyId, method, slotName, itemId] of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const suffix = `${enemyId.replace("enemy.", "")}-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-2.cleyra.trunk-loot-${suffix}`);
    const item = gameItems.find((entry) => entry.id === itemId);
    const hasTrunkRandomPool = enemy?.encounterIds.some((id) => {
      const encounter = encounters.get(id);
      return id.startsWith("encounter.cleyra-trunk.") && encounter?.kind === "random-pool";
    });
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId), `${enemyId} ${slotName} ${method} slot missing`);
    assert.ok(hasTrunkRandomPool, `${enemyId} is missing a Cleyra Trunk random pool`);
    assert.ok(path, `${suffix} item path missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-2.cleyra");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "limited-window");
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.match(path.notes ?? "", /Trunk/);
    assert.ok(item?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "drop") {
      assert.match(path.conditions ?? "", /KO victory/);
      if (slotName === "always") {
        assert.match(path.conditions ?? "", /Always drop slot yields/);
        assert.doesNotMatch(path.conditions ?? "", /conditional/);
      } else {
        assert.match(path.conditions ?? "", /conditional/);
      }
    } else {
      assert.match(path.conditions ?? "", /success is not guaranteed/);
    }
    if (enemyId === "enemy.sand-golem" && method === "drop") {
      assert.match(path.notes ?? "", /Core/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} is missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Cleyra Trunk section is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of sourceIds.slice(0, 7)) {
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} is missing ${sourceId}`);
      assert.ok(enemy?.encounterIds.some((id) => encounters.get(id)?.sourceIds.includes(sourceId)), `${enemyId} encounters are missing ${sourceId}`);
    }
  }
});

test("Cleyra's fixed assault battles record per-enemy steal and conditional drop opportunities", () => {
  const sourceIds = [
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
  const groups = [
    ["entrance-type-b", "enemy.type-b", 1],
    ["first-soldiers", "enemy.soldier-a", 3],
    ["first-type-b-pair", "enemy.type-b", 2],
    ["soldiers-and-type-b", "enemy.soldier-a", 2],
    ["soldiers-and-type-b", "enemy.type-b", 1],
    ["final-soldiers", "enemy.soldier-a", 3],
  ];
  const encounters = new Map(enemyEncounters.map((entry) => [entry.id, entry]));
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")
    ?.sections.find((entry) => entry.id === "cleyra-antlion-evacuation");
  const step = section?.steps.find((entry) => entry.id === "cleyra-assault-enemy-loot");
  const expected = groups.flatMap(([encounterSlug, enemyId, quantity]) => {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    return [
      ...(enemy?.steals ?? []).filter((entry) => entry.itemId).map((entry) => [encounterSlug, enemyId, quantity, "steal", entry.slot, entry.itemId]),
      ...(enemy?.drops ?? []).filter((entry) => entry.itemId).map((entry) => [encounterSlug, enemyId, quantity, "drop", entry.slot, entry.itemId]),
    ];
  });

  assert.equal(expected.length, 39);
  assert.equal(itemAcquisitionPaths.filter((entry) => entry.id.startsWith("item-path.disc-2.cleyra.assault-loot-")).length, 39);
  assert.match(step?.text ?? "", /try any desired steals before defeating each group/);
  assert.match(step?.text ?? "", /all listed item-bearing drops are conditional/);
  assert.match(step?.detail ?? "", /happen once before the post-Beatrix Red Rose departure closes Cleyra/);
  assert.match(step?.detail ?? "", /first pair count is unnumbered in Jegged but listed as two by Gamer Guides/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [encounterSlug, enemyId, quantity, method, slotName, itemId] of expected) {
    const encounterId = `encounter.cleyra-assault.${encounterSlug}`;
    const encounter = encounters.get(encounterId);
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    const suffix = `${encounterSlug}-${enemyId.replace("enemy.", "")}-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-2.cleyra.assault-loot-${suffix}`);
    assert.ok(encounter?.kind === "fixed" && encounter.formation.some((member) => member.enemyId === enemyId && member.quantity === quantity));
    assert.ok(enemy?.encounterIds.includes(encounterId));
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId));
    assert.ok(path, `${suffix} path missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-2.cleyra");
    assert.equal(path.method, method);
    assert.equal(path.quantity, quantity);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, enemyId);
    assert.equal(path.enemyLootSlot, slotName);
    assert.deepEqual(path.encounterIds, [encounterId]);
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.match(path.notes ?? "", /per-enemy slot opportunities/);
    assert.ok(gameItems.find((entry) => entry.id === itemId)?.sourceIds.includes("gamefaqs-enemy-list-71891"));
    if (method === "steal") {
      assert.match(path.conditions ?? "", /success is not guaranteed/);
    } else {
      assert.match(path.conditions ?? "", /KO victories/);
      assert.match(path.conditions ?? "", /slot is conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Cleyra assault section missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of sourceIds.slice(0, 7)) {
      assert.ok(enemy?.sourceIds.includes(sourceId), `${enemyId} missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `${encounterId} missing ${sourceId}`);
    }
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    assert.ok(lootSlot);
    for (const sourceId of new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} missing linked enemy/encounter/slot provenance ${sourceId}`);
    }
  }
});

test("Cleyra's forced Trunk-return Soldier fights link each loot slot and retain the first-count caveat", () => {
  const sourceIds = [
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
  const groups = [
    ["whirlpool-soldiers", 2, /Jegged describes Soldiers at the whirlpool but does not print a count/],
    ["sand-pit-soldiers", 2, /Jegged and Gamer Guides report a pair/],
    ["bridge-cave-soldiers", 2, /Jegged and Gamer Guides report a pair/],
  ];
  const encounters = new Map(enemyEncounters.map((entry) => [entry.id, entry]));
  const section = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra")
    ?.sections.find((entry) => entry.id === "cleyra-antlion-evacuation");
  const step = section?.steps.find((entry) => entry.id === "cleyra-return-enemy-loot");
  const enemy = enemyRecords.find((entry) => entry.id === "enemy.soldier-a");
  const expected = groups.flatMap(([encounterSlug, quantity]) => [
    ...(enemy?.steals ?? []).filter((entry) => entry.itemId).map((entry) => [encounterSlug, quantity, "steal", entry.slot, entry.itemId]),
    ...(enemy?.drops ?? []).filter((entry) => entry.itemId).map((entry) => [encounterSlug, quantity, "drop", entry.slot, entry.itemId]),
  ]);

  assert.equal(expected.length, 21);
  assert.equal(itemAcquisitionPaths.filter((entry) => entry.id.startsWith("item-path.disc-2.cleyra.trunk-return-loot-")).length, 21);
  assert.match(step?.text ?? "", /try desired steals from each Soldier \[A\]/);
  assert.match(step?.text ?? "", /KO the enemies if pursuing drops/);
  assert.match(step?.text ?? "", /reported per-enemy opportunities rather than guaranteed items/);
  assert.match(step?.detail ?? "", /first, dormant-whirlpool fight/);
  assert.match(step?.detail ?? "", /GameFAQs confirms the three-fight sequence but does not print counts/);
  assert.equal(step?.objectiveIds, undefined);

  for (const [encounterSlug, quantity, method, slotName, itemId] of expected) {
    const encounterId = `encounter.cleyra-trunk.return.${encounterSlug}`;
    const encounter = encounters.get(encounterId);
    const suffix = `${encounterSlug}-soldier-a-${itemId.replace("game-item.", "")}-${slotName}-${method}`;
    const path = itemAcquisitionPaths.find((entry) => entry.id === `item-path.disc-2.cleyra.trunk-return-loot-${suffix}`);
    const slots = method === "steal" ? enemy?.steals : enemy?.drops;
    assert.ok(encounter?.kind === "fixed" && encounter.formation.some((member) => member.enemyId === "enemy.soldier-a" && member.quantity === quantity));
    assert.ok(enemy?.encounterIds.includes(encounterId));
    assert.ok(slots?.some((entry) => entry.slot === slotName && entry.itemId === itemId));
    assert.ok(path, `${suffix} path missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-2.cleyra");
    assert.equal(path.method, method);
    assert.equal(path.quantity, quantity);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, "enemy.soldier-a");
    assert.equal(path.enemyLootSlot, slotName);
    assert.deepEqual(path.encounterIds, [encounterId]);
    assert.equal(path.walkthroughObjectiveIds, undefined);
    assert.match(path.notes ?? "", /source-reported per-enemy opportunities/);
    assert.match(path.notes ?? "", /Cleyra closes after the post-Beatrix departure/);
    const countNotePattern = groups.find(([slug]) => slug === encounterSlug)?.[2];
    assert.match(path.notes ?? "", countNotePattern);
    if (encounterSlug === "whirlpool-soldiers") {
      assert.match(path.notes ?? "", /Jegged describes Soldiers at the whirlpool but does not print a count/);
    }
    if (method === "steal") {
      assert.match(path.conditions ?? "", /success is not guaranteed/);
    } else {
      assert.match(path.conditions ?? "", /KO victory/);
      assert.match(path.conditions ?? "", /conditional/);
    }
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} missing ${sourceId}`);
      assert.ok(section?.sourceIds.includes(sourceId), `Cleyra Trunk return section missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    for (const sourceId of sourceIds.slice(0, 7)) {
      assert.ok(enemy?.sourceIds.includes(sourceId), `Soldier [A] missing ${sourceId}`);
      assert.ok(encounter?.sourceIds.includes(sourceId), `${encounterId} missing ${sourceId}`);
    }
    const lootSlot = slots?.find((entry) => entry.slot === slotName && entry.itemId === itemId);
    assert.ok(lootSlot);
    for (const sourceId of new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `${suffix} missing linked enemy/encounter/slot provenance ${sourceId}`);
    }
  }
});

test("Cleyra boss item paths link exact loot slots while keeping Antlion's Always drop outside its steal checklist", () => {
  const expected = [
    { pathId: "item-path.disc-2.cleyra.antlion-annoyntment-steal", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "common", itemId: "game-item.annoyntment", method: "steal", objectiveId: "disc-2.cleyra.antlion-steals" },
    { pathId: "item-path.disc-2.cleyra.mythril-vest-antlion-steal", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "uncommon", itemId: "game-item.mythril-vest", method: "steal", objectiveId: "disc-2.cleyra.antlion-steals" },
    { pathId: "item-path.disc-2.cleyra.antlion-gold-helm-steal", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "semi-rare", itemId: "game-item.gold-helm", method: "steal", objectiveId: "disc-2.cleyra.antlion-steals" },
    { pathId: "item-path.disc-2.cleyra.antlion-annoyntment-drop", enemyId: "enemy.antlion-cleyra", encounterId: "encounter.cleyra.antlion", slot: "always", itemId: "game-item.annoyntment", method: "drop", objectiveId: null },
    { pathId: "item-path.disc-2.cleyra.beatrix-phoenix-down-steal", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "common", itemId: "game-item.phoenix-down", method: "steal", objectiveId: "disc-2.cleyra.beatrix-steals" },
    { pathId: "item-path.disc-2.cleyra.beatrix-thunder-gloves-steal", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "uncommon", itemId: "game-item.thunder-gloves", method: "steal", objectiveId: "disc-2.cleyra.beatrix-steals" },
    { pathId: "item-path.disc-2.cleyra.beatrix-ice-brand-steal", enemyId: "enemy.beatrix-cleyra", encounterId: "encounter.cleyra.beatrix", slot: "semi-rare", itemId: "game-item.ice-brand", method: "steal", objectiveId: "disc-2.cleyra.beatrix-steals" },
  ];
  const encounters = new Map(enemyEncounters.map((entry) => [entry.id, entry]));

  for (const item of expected) {
    const enemy = enemyRecords.find((entry) => entry.id === item.enemyId);
    const encounter = encounters.get(item.encounterId);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const lootSlot = lootTable?.find((entry) => entry.slot === item.slot && entry.itemId === item.itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    assert.ok(enemy?.kind === "boss");
    assert.ok(encounter?.kind === "boss");
    assert.deepEqual(encounter?.formation, [{ enemyId: item.enemyId, quantity: 1 }]);
    assert.ok(enemy?.encounterIds.includes(item.encounterId));
    assert.ok(lootSlot, `${item.pathId} matches its exact enemy slot`);
    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path.itemId, item.itemId);
    assert.equal(path.chapterId, "disc-2.cleyra");
    assert.equal(path.method, item.method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "one-time-encounter");
    assert.equal(path.enemyId, item.enemyId);
    assert.equal(path.enemyLootSlot, item.slot);
    assert.deepEqual(path.encounterIds, [item.encounterId]);
    if (item.objectiveId) assert.ok(path.walkthroughObjectiveIds?.includes(item.objectiveId));
    else assert.ok(!path.walkthroughObjectiveIds?.includes("disc-2.cleyra.antlion-steals"));
    if (item.method === "steal") assert.match(path.conditions ?? "", /each attempt can fail/);
    else {
      assert.match(path.conditions ?? "", /normal KO victory/);
      assert.match(path.conditions ?? "", /Always Annoyntment drop/);
      assert.match(path.notes ?? "", /independent of the Common Annoyntment steal/);
    }
    for (const sourceId of new Set([...(encounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `${item.pathId} missing slot/encounter provenance ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `${item.pathId} cites known source ${sourceId}`);
    }
  }
  assert.equal(expected.length, 7);
});

test("Mount Gulug loot paths separate Meltigemini's four Vaccine slots and link Red Dragon's fixed Ether drops", () => {
  const meltigeminiExpected = [
    { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-steal", slot: "common", method: "steal", itemId: "game-item.vaccine" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-golden-hairpin-steal", slot: "uncommon", method: "steal", itemId: "game-item.golden-hairpin" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-demons-vest-steal", slot: "semi-rare", method: "steal", itemId: "game-item.demons-vest" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-drop", slot: "always", method: "drop", itemId: "game-item.vaccine" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-common-drop", slot: "common", method: "drop", itemId: "game-item.vaccine" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-uncommon-drop", slot: "uncommon", method: "drop", itemId: "game-item.vaccine" },
    { pathId: "item-path.disc-3.lost-continent.meltigemini-vaccine-rare-drop", slot: "rare", method: "drop", itemId: "game-item.vaccine" },
  ];
  const encounterMap = new Map(enemyEncounters.map((entry) => [entry.id, entry]));
  const meltigemini = enemyRecords.find((entry) => entry.id === "enemy.meltigemini");
  const meltigeminiEncounterId = "encounter.mount-gulug.meltigemini";
  const meltigeminiEncounter = encounterMap.get(meltigeminiEncounterId);
  assert.equal(meltigeminiExpected.length, 7);

  for (const item of meltigeminiExpected) {
    const lootTable = item.method === "steal" ? meltigemini?.steals : meltigemini?.drops;
    const lootSlot = lootTable?.find((entry) => entry.slot === item.slot && entry.itemId === item.itemId);
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    assert.ok(meltigemini?.kind === "boss");
    assert.ok(meltigeminiEncounter?.kind === "boss");
    assert.deepEqual(meltigeminiEncounter?.formation, [{ enemyId: "enemy.meltigemini", quantity: 1 }]);
    assert.ok(meltigemini?.encounterIds.includes(meltigeminiEncounterId));
    assert.ok(lootSlot, `${item.pathId} matches its exact slot`);
    assert.ok(path, `${item.pathId} exists`);
    assert.equal(path.enemyId, "enemy.meltigemini");
    assert.equal(path.enemyLootSlot, item.slot);
    assert.deepEqual(path.encounterIds, [meltigeminiEncounterId]);
    assert.equal(path.itemId, item.itemId);
    assert.equal(path.method, item.method);
    assert.equal(path.availability, "one-time-encounter");
    if (item.method === "steal") {
      assert.match(path.conditions ?? "", /each attempt can fail/);
      assert.ok(path.walkthroughObjectiveIds?.includes("disc-3.lost-continent.meltigemini-steals"));
    } else {
      assert.ok(!path.walkthroughObjectiveIds?.includes("disc-3.lost-continent.meltigemini-steals"));
      if (item.slot === "always") assert.match(path.conditions ?? "", /normal KO victory.*Always drop slot guarantees one Vaccine/);
      else {
        assert.match(path.conditions ?? "", /normal KO victory/);
        assert.match(path.conditions ?? "", /source-reported, not release-verified/);
        assert.match(path.conditions ?? "", item.slot === "common" ? /96\/256 \(37\.5%\)/ : item.slot === "uncommon" ? /32\/256 \(12\.5%\)/ : /1\/256 \(~0\.391%\)/);
      }
    }
    for (const sourceId of new Set([...(meltigeminiEncounter?.sourceIds ?? []), ...(lootSlot?.sourceIds ?? [])])) {
      assert.ok(path.sourceIds.includes(sourceId), `${item.pathId} missing slot/encounter source ${sourceId}`);
    }
  }

  const redDragon = enemyRecords.find((entry) => entry.id === "enemy.red-dragon");
  const redDragonEncounterIds = [
    "encounter.mount-gulug.red-dragon-return-pair",
    "encounter.mount-gulug.red-dragon-mineshaft",
    "encounter.mount-gulug.red-dragon-lower-pair",
  ];
  const redDragonPath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-3.lost-continent.mount-gulug-red-dragon-ether-drop");
  const redDragonSlot = redDragon?.drops.find((entry) => entry.slot === "always" && entry.itemId === "game-item.ether");
  assert.ok(redDragon);
  assert.ok(redDragonSlot);
  assert.ok(redDragonPath);
  assert.deepEqual(redDragon?.encounterIds, redDragonEncounterIds);
  assert.equal(redDragonPath.enemyId, "enemy.red-dragon");
  assert.equal(redDragonPath.enemyLootSlot, "always");
  assert.deepEqual(redDragonPath.encounterIds, redDragonEncounterIds);
  assert.match(redDragonPath.conditions ?? "", /three or four encounters/);
  assert.match(redDragonPath.conditions ?? "", /does not claim a total copy count/);
  assert.equal(redDragonPath.walkthroughObjectiveIds, undefined);
  for (const encounterId of redDragonEncounterIds) {
    const encounter = encounterMap.get(encounterId);
    assert.ok(encounter?.kind === "fixed");
    assert.ok(encounter.formation.some((member) => member.enemyId === "enemy.red-dragon"));
    for (const sourceId of encounter.sourceIds) assert.ok(redDragonPath.sourceIds.includes(sourceId), `Red Dragon Ether path missing ${sourceId}`);
  }
  for (const sourceId of redDragonSlot?.sourceIds ?? []) assert.ok(redDragonPath.sourceIds.includes(sourceId));
});

test("Lani, Ark, and Quale loot paths link to exact one-time boss slots", () => {
  const laniExpected = [
    { pathId: "item-path.disc-2.journey-to-outer-continent.lani-ether-steal", itemId: "game-item.ether", slot: "common" },
    { pathId: "item-path.disc-2.journey-to-outer-continent.lani-gladius-steal", itemId: "game-item.gladius", slot: "uncommon" },
    { pathId: "item-path.disc-2.journey-to-outer-continent.lani-coral-sword-steal", itemId: "game-item.coral-sword", slot: "semi-rare" },
  ];
  const arkExpected = [
    { pathId: "item-path.disc-3.forgotten-continent.ark-elixir-steal", itemId: "game-item.elixir", method: "steal", slot: "common", objectiveId: "disc-3.forgotten-continent.ark-steals" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-power-vest-steal", itemId: "game-item.power-vest", method: "steal", slot: "uncommon", objectiveId: "disc-3.forgotten-continent.ark-steals" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-holy-lance-steal", itemId: "game-item.holy-lance", method: "steal", slot: "semi-rare", objectiveId: "disc-3.forgotten-continent.ark-steals" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-ether-common-drop", itemId: "game-item.ether", method: "drop", slot: "common", rate: "96/256 (37.5%)" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-ether-uncommon-drop", itemId: "game-item.ether", method: "drop", slot: "uncommon", rate: "32/256 (12.5%)" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-ether-rare-drop", itemId: "game-item.ether", method: "drop", slot: "rare", rate: "1/256 (~0.391%)" },
    { pathId: "item-path.disc-3.forgotten-continent.ark-pumice-piece-drop", itemId: "game-item.pumice-piece", method: "drop", slot: "always", objectiveId: "disc-3.forgotten-continent.pumice-piece" },
  ];
  const lani = enemyRecords.find((entry) => entry.id === "enemy.lani");
  const laniEncounter = enemyEncounters.find((entry) => entry.id === "encounter.fossil-roo.lani");
  const laniObjective = objectives.find((entry) => entry.id === "disc-2.journey-to-outer-continent.lani-steals");
  const laniWarning = missables.find((entry) => entry.id === "missable.disc-2.journey-to-outer-continent.lani-steals");
  const ark = enemyRecords.find((entry) => entry.id === "enemy.ark");
  const arkEncounter = enemyEncounters.find((entry) => entry.id === "encounter.oeilvert.ark");

  assert.equal(lani?.kind, "boss");
  assert.equal(laniEncounter?.kind, "boss");
  assert.deepEqual(laniEncounter?.formation, [{ enemyId: "enemy.lani", quantity: 1 }]);
  assert.ok(laniObjective);
  assert.ok(laniWarning?.classification.includes("recoverable-later"));
  assert.ok(laniEncounter?.missableIds.includes("missable.disc-2.journey-to-outer-continent.lani-steals"));
  assert.ok(laniEncounter?.cutoffIds.includes("cutoff.fossil-roo.lani-steals"));
  assert.ok(lani?.stats.some((stat) => stat.field === "HP" && stat.value === 5709 && stat.verification === "disputed"));
  assert.ok(lani?.stats.some((stat) => stat.field === "HP" && stat.value === 5708 && stat.verification === "disputed"));

  for (const item of laniExpected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slot = lani?.steals.find((entry) => entry.itemId === item.itemId && entry.slot === item.slot);
    assert.ok(path, item.pathId + " exists");
    assert.ok(slot, item.slot + " Lani slot exists");
    assert.equal(path?.method, "steal");
    assert.equal(path?.enemyId, "enemy.lani");
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.fossil-roo.lani"]);
    assert.equal(path?.availability, "one-time-encounter");
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-2.journey-to-outer-continent.lani-steals"));
    assert.match(path?.conditions ?? "", /chance-based.*can fail/);
    for (const sourceId of new Set([...(lani?.sourceIds ?? []), ...(laniEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])])) {
      assert.ok(path?.sourceIds.includes(sourceId), item.pathId + " missing provenance " + sourceId);
      assert.ok(sources.some((source) => source.id === sourceId));
    }
  }

  assert.equal(ark?.kind, "boss");
  assert.equal(arkEncounter?.kind, "boss");
  assert.deepEqual(arkEncounter?.formation, [{ enemyId: "enemy.ark", quantity: 1 }]);
  assert.ok(arkEncounter?.missableIds.includes("missable.disc-3.forgotten-continent.ark-steals"));
  assert.ok(arkEncounter?.cutoffIds.includes("cutoff.oeilvert.ark-steals"));
  assert.equal(itemAcquisitionPaths.filter((entry) => entry.enemyId === "enemy.ark").length, arkExpected.length);
  assert.equal(ark?.drops.filter((entry) => entry.itemId === "game-item.ether").length, 3);
  assert.ok(ark?.drops.some((entry) => entry.slot === "always" && entry.itemId === "game-item.pumice-piece"));

  for (const item of arkExpected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.pathId);
    const slots = item.method === "steal" ? ark?.steals : ark?.drops;
    const slot = slots?.find((entry) => entry.slot === item.slot && entry.itemId === item.itemId);
    assert.ok(path, item.pathId + " exists");
    assert.ok(slot, item.slot + " Ark slot exists");
    assert.equal(path?.method, item.method);
    assert.equal(path?.enemyId, "enemy.ark");
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, ["encounter.oeilvert.ark"]);
    assert.equal(path?.availability, "one-time-encounter");
    if (item.objectiveId) assert.ok(path?.walkthroughObjectiveIds?.includes(item.objectiveId));
    if (item.method === "steal") assert.match(path?.conditions ?? "", /chance-based.*can fail/);
    if (item.method === "drop" && item.slot !== "always") {
      assert.ok(!path?.walkthroughObjectiveIds?.includes("disc-3.forgotten-continent.ark-steals"));
      assert.ok(path?.conditions?.includes(item.rate));
      assert.match(path?.conditions ?? "", /normal KO.*not guaranteed/);
      assert.match(path?.conditions ?? "", /source-reported, not release-verified/);
    }
    if (item.slot === "always") {
      assert.ok(path?.walkthroughObjectiveIds?.includes("disc-3.forgotten-continent.pumice-piece"));
      assert.match(path?.conditions ?? "", /Always slot guarantees.*normal KO/);
    }
    for (const sourceId of new Set([...(ark?.sourceIds ?? []), ...(arkEncounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])])) {
      assert.ok(path?.sourceIds.includes(sourceId), item.pathId + " missing provenance " + sourceId);
      assert.ok(sources.some((source) => source.id === sourceId));
    }
  }

  const qualePath = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-2.outer-continent.quale-gluttons-robe-steal");
  const quale = enemyRecords.find((entry) => entry.id === "enemy.quale");
  const qualeEncounter = enemyEncounters.find((entry) => entry.id === "encounter.qus-marsh.quale-99-frogs");
  const qualeSlot = quale?.steals.find((entry) => entry.itemId === "game-item.gluttons-robe" && entry.slot === "semi-rare");
  assert.ok(qualePath);
  assert.ok(qualeSlot);
  assert.equal(quale?.chapterId, "disc-4.return-to-gaia");
  assert.equal(qualeEncounter?.chapterId, "disc-4.return-to-gaia");
  assert.match(qualeEncounter?.location ?? "", /whichever of the four Qu's Marsh ponds/);
  assert.match(qualeEncounter?.notes.join(" ") ?? "", /not a game restriction.*Disc III/);
  assert.equal(qualePath?.chapterId, "disc-4.return-to-gaia");
  assert.equal(qualePath?.enemyId, "enemy.quale");
  assert.equal(qualePath?.enemyLootSlot, "semi-rare");
  assert.deepEqual(qualePath?.encounterIds, ["encounter.qus-marsh.quale-99-frogs"]);
  assert.ok(qualePath?.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.frog-catching"));
  assert.match(qualePath?.conditions ?? "", /whichever Qu's Marsh pond.*can happen earlier/);
  assert.match(qualePath?.conditions ?? "", /chance-based and can fail/);
  for (const sourceId of new Set([...(quale?.sourceIds ?? []), ...(qualeEncounter?.sourceIds ?? []), ...(qualeSlot?.sourceIds ?? [])])) {
    assert.ok(qualePath?.sourceIds.includes(sourceId), "Quale Glutton's Robe path missing provenance " + sourceId);
  }
});

test("Gizamaluke's three hidden equipment pickups have sourced paths", () => {
  const sourceIds = [
    "gamefaqs-journey-to-burmecia-71891",
    "jegged-gizamaluke",
    "opatil-gizamaluke-map",
    "elitegrindlab-gizamaluke",
  ];
  const objectiveId = "disc-1.journey-to-burmecia.grotto-hidden-equipment";
  const expected = [
    ["item-path.disc-1.journey-to-burmecia.bronze-vest-grotto-hidden-chest", "game-item.bronze-vest", /lower-left.*small door/i, "journey-grotto-type-a-and-bronze-vest"],
    ["item-path.disc-1.journey-to-burmecia.mythril-gloves-grotto-hidden-chest", "game-item.mythril-gloves", /Bell Room.*spiral stairs/i, "journey-grotto-mythril-magus-hat"],
    ["item-path.disc-1.journey-to-burmecia.magus-hat-grotto-chest", "game-item.magus-hat", /ledge beneath the bridge/i, "journey-grotto-mythril-magus-hat"],
  ];

  for (const [pathId, itemId, conditionPattern, stepId] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.journey-to-burmecia");
    assert.equal(path.method, "chest");
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "single-use");
    assert.match(path.conditions ?? "", conditionPattern);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(item, `${itemId} is missing from the item catalog`);
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    const step = walkthroughChapters
      .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
      ?.sections.flatMap((section) => section.steps)
      .find((entry) => entry.id === stepId);
    assert.ok(step?.objectiveIds.includes(objectiveId), `${stepId} is not linked to ${objectiveId}`);
  }

  const objective = objectives.find((entry) => entry.id === objectiveId);
  assert.deepEqual(objective?.sourceIds, sourceIds);
});

test("the Disc I Kupo Nut reward has a Holy Bell key-item path", () => {
  const sourceIds = [
    "gamefaqs-journey-to-burmecia-71891",
    "gamefaqs-kupo-nuts-71891",
    "jegged-gizamaluke",
    "opatil-gizamaluke-map",
  ];
  const objectiveId = "disc-1.journey-to-burmecia.kupo-nut-holy-bell";
  const item = gameItems.find((entry) => entry.id === "game-item.holy-bell");
  const path = itemAcquisitionPaths.find((entry) => entry.id === "item-path.disc-1.journey-to-burmecia.holy-bell-kupo-nut-reward");
  assert.ok(item, "Holy Bell is missing from the key-item catalog");
  assert.equal(item.category, "key-item");
  assert.ok(path, "Holy Bell reward path is missing");
  assert.equal(path.itemId, item.id);
  assert.equal(path.chapterId, "disc-1.journey-to-burmecia");
  assert.equal(path.method, "quest-reward");
  assert.equal(path.quantity, 1);
  assert.equal(path.availability, "single-use");
  assert.match(path.conditions ?? "", /story Kupo Nut.*Mogmi.*Moguta.*Holy Bell/);
  assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
  for (const sourceId of sourceIds) {
    assert.ok(path.sourceIds.includes(sourceId), `Holy Bell path is missing ${sourceId}`);
    assert.ok(item.sourceIds.includes(sourceId), `Holy Bell item is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
  }

  const objective = objectives.find((entry) => entry.id === objectiveId);
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.journey-to-burmecia")
    ?.sections.flatMap((section) => section.steps)
    .find((entry) => entry.id === "journey-grotto-kupo-nut-and-holy-bell");
  assert.deepEqual(objective?.sourceIds, sourceIds);
  assert.ok(step?.objectiveIds.includes(objectiveId));
  assert.match(step?.text ?? "", /Moguta supplies the Holy Bell/);
});

test("Lindblum's first-visit pickups and rewards have item paths", () => {
  const sharedSources = ["gamefaqs-lindblum-71891", "jegged-lindblum"];
  const festivalSources = [...sharedSources, "gamefaqs-hunt-minigame-71891"];
  const expected = [
    ["item-path.disc-1.lindblum.ether-guest-room-chest", "game-item.ether", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.hi-potion-business-district-chest", "game-item.hi-potion", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.echo-screen-business-district-chest", "game-item.echo-screen", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.tent-church-street-hidden-pickup", "game-item.tent", "hidden-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.bronze-vest-industrial-district-pickup", "game-item.bronze-vest", "fixed-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.ore-theater-district-chest", "game-item.ore", "chest", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.mini-burmecia-hideout-hidden-pickup", "game-item.mini-burmecia", "hidden-pickup", "single-use", "disc-1.lindblum.first-visit-pickups", sharedSources],
    ["item-path.disc-1.lindblum.autograph-lowell-reward", "game-item.autograph", "quest-reward", "single-use", "disc-1.lindblum.autograph-moogle-suit", [...sharedSources, "gamefaqs-missables-71891", "gamefaqs-missables-21725"]],
    ["item-path.disc-1.lindblum.moogle-suit-theater-studio-hidden-pickup", "game-item.moogle-suit", "hidden-pickup", "single-use", "disc-1.lindblum.autograph-moogle-suit", [...sharedSources, "gamefaqs-missables-71891", "gamefaqs-missables-21725"]],
    ["item-path.disc-1.lindblum.kupo-nut-vivi-shopping-ate", "game-item.kupo-nut", "quest-reward", "single-use", "disc-1.lindblum.kupo-nut", ["gamefaqs-lindblum-71891"]],
    ["item-path.disc-1.lindblum.master-hunter-festival-reward", "game-item.master-hunter", "quest-reward", "single-use", "disc-1.lindblum.master-hunter", festivalSources],
    ["item-path.disc-1.lindblum.coral-ring-freya-festival-reward", "game-item.coral-ring", "quest-reward", "conditional", "disc-1.lindblum.festival-freya-win", festivalSources],
  ];

  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.lindblum"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-1.lindblum"));

  for (const [pathId, itemId, method, availability, objectiveId, sourceIds] of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === pathId);
    const item = gameItems.find((entry) => entry.id === itemId);
    assert.ok(path, `${pathId} is missing`);
    assert.equal(path.itemId, itemId);
    assert.equal(path.chapterId, "disc-1.lindblum");
    assert.equal(path.method, method);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, availability);
    assert.ok(path.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok(item, `${itemId} is missing from the item catalog`);
    for (const sourceId of sourceIds) {
      assert.ok(path.sourceIds.includes(sourceId), `${pathId} is missing ${sourceId}`);
      assert.ok(item.sourceIds.includes(sourceId), `${itemId} is missing ${sourceId}`);
      assert.ok(sources.some((source) => source.id === sourceId), `unknown source ${sourceId}`);
    }
    assert.ok(objectives.some((objective) => objective.id === objectiveId));
  }

  const lindblumSteps = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.lindblum")
    ?.sections.flatMap((section) => section.steps);
  const viviAte = lindblumSteps?.find((step) => step.id === "lindblum-vivis-shopping-ate");
  const firstVisitCheck = lindblumSteps?.find((step) => step.id === "lindblum-first-visit-pickup-check");
  const freyaPrize = itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.coral-ring-freya-festival-reward");

  assert.match(viviAte?.text ?? "", /Vivi's Shopping ATE.*Kupo Nut/);
  assert.ok(viviAte?.objectiveIds?.includes("disc-1.lindblum.kupo-nut"));
  assert.ok(firstVisitCheck?.objectiveIds?.includes("disc-1.lindblum.first-visit-pickups"));
  assert.match(freyaPrize?.conditions ?? "", /Choose Freya/);
  assert.match(itemAcquisitionPaths.find((path) => path.id === "item-path.disc-1.lindblum.master-hunter-festival-reward")?.conditions ?? "", /with Zidane, Freya, or Vivi/);
});

test("Lindblum Plateau, lowlands, and first Qu's Marsh enemy loot slots have separate item paths", () => {
  const encounterIds = [
    "encounter.lindblum-plateau.mountain-pool",
    "encounter.lindblum-plateau.forest-pool",
    "encounter.lindblum-area.lowlands-pool",
    "encounter.qus-marsh.disc-1-interior-pool",
  ];
  const encounters = encounterIds.map((id) => enemyEncounters.find((entry) => entry.id === id));
  assert.ok(encounters.every(Boolean));

  const enemyIds = [...new Set(encounters.flatMap((entry) => entry.formation.map((member) => member.enemyId)))];
  const expectedSlots = [];
  for (const enemyId of enemyIds) {
    const enemy = enemyRecords.find((entry) => entry.id === enemyId);
    assert.ok(enemy, `${enemyId} is missing from the bestiary`);
    for (const [method, slots] of [["steal", enemy.steals], ["drop", enemy.drops]]) {
      for (const slot of slots.filter((entry) => entry.itemId)) {
        expectedSlots.push(`${enemyId}|${method}|${slot.slot}|${slot.itemId}`);
      }
    }
  }

  const paths = itemAcquisitionPaths.filter((path) =>
    path.chapterId === "disc-1.exploring-lindblum-kingdom" && path.enemyId);
  assert.equal(expectedSlots.length, 67);
  assert.equal(paths.length, expectedSlots.length);
  assert.deepEqual(paths.map((path) => `${path.enemyId}|${path.method}|${path.enemyLootSlot}|${path.itemId}`).sort(), expectedSlots.sort());
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-1.exploring-lindblum-kingdom"));

  for (const path of paths) {
    const enemy = enemyRecords.find((entry) => entry.id === path.enemyId);
    const slot = (path.method === "steal" ? enemy.steals : enemy.drops)
      .find((entry) => entry.slot === path.enemyLootSlot && entry.itemId === path.itemId);
    const item = gameItems.find((entry) => entry.id === path.itemId);
    const relatedEncounters = encounters.filter((encounter) =>
      encounter.formation.some((member) => member.enemyId === path.enemyId));

    assert.ok(slot, `${path.id} must match an enemy loot slot`);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.deepEqual(path.encounterIds, relatedEncounters.map((entry) => entry.id));
    assert.ok(path.sourceIds.includes("gamefaqs-enemy-list-71891"));
    assert.ok(slot.sourceIds.every((sourceId) => path.sourceIds.includes(sourceId)));
    assert.ok(relatedEncounters.every((encounter) => encounter.sourceIds.every((sourceId) => path.sourceIds.includes(sourceId))));
    assert.ok(item, `${path.itemId} is missing from the item catalog`);
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)), `${path.id} has an unknown source`);
    assert.equal(path.walkthroughObjectiveIds, undefined, "chance-based loot must not become guaranteed checklist progress");
    assert.match(path.conditions ?? "", /chance-based/);
    if (path.method === "drop") {
      assert.match(path.conditions ?? "", /by KO/);
      assert.match(path.conditions ?? "", /not guaranteed/);
    } else {
      assert.match(path.conditions ?? "", /may fail/);
    }
  }

  const walkthroughStep = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-1.exploring-lindblum-kingdom")
    ?.sections.find((section) => section.id === "explore-lindblum-plateau")
    ?.steps.find((step) => step.id === "explore-lindblum-field-loot");
  assert.match(walkthroughStep?.text ?? "", /use Steal before ending a battle/);
  assert.match(walkthroughStep?.detail ?? "", /status victories do not award drops/);
});

test("Conde Petie Mountain Path, Lucid Plains, and Pualei Plains enemy loot has area-specific paths", () => {
  const pools = [
    {
      encounterId: "encounter.conde-petie-mountain-path.random-pool",
      chapterId: "disc-2.conde-petie-mountain-path",
    },
    {
      encounterId: "encounter.conde-petie-mountain-path.lucid-plains-pool",
      chapterId: "disc-2.conde-petie-mountain-path",
    },
    {
      encounterId: "encounter.journey-to-iifa-tree.pualei-plains-pool",
      chapterId: "disc-2.journey-to-iifa-tree",
    },
  ];
  const encounters = pools.map(({ encounterId }) => enemyEncounters.find((entry) => entry.id === encounterId));
  assert.ok(encounters.every(Boolean));

  const expected = pools.flatMap((pool) => {
    const encounter = enemyEncounters.find((entry) => entry.id === pool.encounterId);
    return encounter.formation.flatMap(({ enemyId }) => {
      const enemy = enemyRecords.find((entry) => entry.id === enemyId);
      assert.ok(enemy, `${enemyId} is missing from the bestiary`);
      return [
        ...enemy.steals.filter((slot) => slot.itemId).map((slot) => ({ pool, enemy, enemyId, method: "steal", slot })),
        ...enemy.drops.filter((slot) => slot.itemId).map((slot) => ({ pool, enemy, enemyId, method: "drop", slot })),
      ];
    });
  });
  assert.equal(expected.length, 31);
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.conde-petie-mountain-path"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.journey-to-iifa-tree"));

  const paths = itemAcquisitionPaths.filter((path) =>
    pools.some((pool) => path.encounterIds?.includes(pool.encounterId)));
  assert.equal(paths.length, expected.length);
  assert.deepEqual(
    paths.map((path) => `${path.encounterIds[0]}|${path.enemyId}|${path.method}|${path.enemyLootSlot}|${path.itemId}`).sort(),
    expected.map(({ pool, enemyId, method, slot }) => `${pool.encounterId}|${enemyId}|${method}|${slot.slot}|${slot.itemId}`).sort(),
  );

  for (const { pool, enemy, enemyId, method, slot } of expected) {
    const path = paths.find((entry) => entry.encounterIds?.[0] === pool.encounterId && entry.enemyId === enemyId &&
      entry.method === method && entry.enemyLootSlot === slot.slot && entry.itemId === slot.itemId);
    assert.ok(path, `${pool.encounterId} ${enemyId} ${method} ${slot.slot} path is missing`);
    assert.equal(path.chapterId, pool.chapterId);
    assert.equal(path.quantity, 1);
    assert.equal(path.availability, "repeatable");
    assert.deepEqual(path.encounterIds, [pool.encounterId]);
    assert.ok(path.sourceIds.includes("gamefaqs-enemy-list-71891"));
    assert.ok(enemy.sourceIds.every((sourceId) => path.sourceIds.includes(sourceId)));
    assert.ok(slot.sourceIds.every((sourceId) => path.sourceIds.includes(sourceId)));
    assert.ok(enemyEncounters.find((entry) => entry.id === pool.encounterId).sourceIds.every((sourceId) => path.sourceIds.includes(sourceId)));
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
    assert.equal(path.walkthroughObjectiveIds, undefined, "chance-based loot must not become guaranteed checklist progress");
    assert.match(path.conditions ?? "", /chance-based/);
    if (method === "drop") {
      assert.match(path.conditions ?? "", /by normal KO/);
      assert.match(path.conditions ?? "", /not guaranteed/);
    } else {
      assert.match(path.conditions ?? "", /may fail/);
    }
  }

  const gnoll = enemyRecords.find((entry) => entry.id === "enemy.gnoll");
  const sapphireDrop = gnoll.drops.find((slot) => slot.slot === "common");
  assert.equal(sapphireDrop?.itemId, "game-item.sapphire");
  assert.ok(sapphireDrop?.sourceIds.includes("elitegrindlab-conde-petie-mountain-path"));
  assert.ok(gameItems.find((item) => item.id === "game-item.sapphire")?.sourceIds.includes("gamefaqs-enemy-list-71891"));

  const chapter = (areaId) => walkthroughChapters.find((entry) => entry.areaId === areaId);
  const mountainPathStep = chapter("disc-2.conde-petie-mountain-path")?.sections
    .find((section) => section.id === "mountain-path-hilgigars-and-stones")?.steps
    .find((step) => step.id === "mountain-path-field-loot");
  const lucidPlainsStep = chapter("disc-2.conde-petie-mountain-path")?.sections
    .find((section) => section.id === "mountain-path-hilgigars-and-stones")?.steps
    .find((step) => step.id === "lucid-plains-field-loot");
  const pualeiPlainsStep = chapter("disc-2.journey-to-iifa-tree")?.sections
    .find((section) => section.id === "journey-iifa-mountain-path-return")?.steps
    .find((step) => step.id === "pualei-plains-field-loot");
  for (const step of [mountainPathStep, lucidPlainsStep, pualeiPlainsStep]) {
    assert.match(step?.text ?? "", /use Steal before/);
    assert.match(step?.text ?? "", /normal KO/);
    assert.match(step?.detail ?? "", /chance-based/);
    assert.doesNotMatch(step?.text ?? "", /objective|checklist/i);
  }
  assert.match(mountainPathStep?.detail ?? "", /Gnoll's Common drop is a Sapphire/);
});

test("Kraken body and tentacle loot paths link to the one-time encounter and preserve side conflicts", () => {
  const encounterId = "encounter.memoria.kraken";
  const objectiveId = "disc-4.memoria.kraken-steals";
  const expected = [
    { id: "item-path.disc-4.memoria.kraken-genji-helmet-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.genji-helmet", method: "steal", slot: "common", rates: ["100%", "70%"] },
    { id: "item-path.disc-4.memoria.kraken-wizard-rod-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.wizard-rod", method: "steal", slot: "uncommon", rates: ["25%", "23%"] },
    { id: "item-path.disc-4.memoria.kraken-gluttons-robe-steal", enemyId: "enemy.kraken-memoria", itemId: "game-item.gluttons-robe", method: "steal", slot: "rare", rates: ["0.39%", "0.4%"] },
    { id: "item-path.disc-4.memoria.kraken-phoenix-pinion-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.phoenix-pinion", method: "drop", slot: "always", rates: ["100%"] },
    { id: "item-path.disc-4.memoria.kraken-phoenix-down-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.phoenix-down", method: "drop", slot: "common", rates: ["37.5%"] },
    { id: "item-path.disc-4.memoria.kraken-ether-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.ether", method: "drop", slot: "uncommon", rates: ["12.5%"] },
    { id: "item-path.disc-4.memoria.kraken-elixir-drop", enemyId: "enemy.kraken-memoria", itemId: "game-item.elixir", method: "drop", slot: "rare", rates: ["0.39%", "0.4%"] },
    { id: "item-path.disc-4.memoria.kraken-right-tentacle-wing-edge-steal", enemyId: "enemy.kraken-right-tentacle", itemId: "game-item.wing-edge", alternateSlotItemId: "game-item.elixir", method: "steal", slot: "common", rates: ["100%"], disputed: true, labelNormalization: "Very Common" },
    { id: "item-path.disc-4.memoria.kraken-left-tentacle-elixir-steal", enemyId: "enemy.kraken-left-tentacle", itemId: "game-item.elixir", method: "steal", slot: "common", rates: ["100%"], labelNormalization: "Very Common" },
    { id: "item-path.disc-4.memoria.kraken-right-tentacle-elixir-steal", enemyId: "enemy.kraken-right-tentacle", itemId: "game-item.elixir", method: "steal", slot: "common", disputed: true },
  ];
  const encounter = enemyEncounters.find((entry) => entry.id === encounterId);
  const paths = itemAcquisitionPaths.filter((entry) => expected.some((item) => item.id === entry.id));

  assert.equal(paths.length, expected.length);
  assert.equal(encounter?.kind, "boss");
  assert.deepEqual(encounter?.formation, [
    { enemyId: "enemy.kraken-memoria", quantity: 1 },
    { enemyId: "enemy.kraken-left-tentacle", quantity: 1 },
    { enemyId: "enemy.kraken-right-tentacle", quantity: 1 },
  ]);

  for (const item of expected) {
    const path = itemAcquisitionPaths.find((entry) => entry.id === item.id);
    const enemy = enemyRecords.find((entry) => entry.id === item.enemyId);
    const lootTable = item.method === "steal" ? enemy?.steals : enemy?.drops;
    const slot = lootTable?.find((entry) => entry.slot === item.slot &&
      (entry.itemId === item.itemId || entry.itemId === item.alternateSlotItemId));
    const requiredSources = new Set([...(enemy?.sourceIds ?? []), ...(encounter?.sourceIds ?? []), ...(slot?.sourceIds ?? [])]);

    assert.ok(path, `${item.id} exists`);
    assert.ok(slot, `${item.id} maps to a source-backed loot slot`);
    if (item.alternateSlotItemId) {
      assert.equal(slot?.itemId, item.alternateSlotItemId);
      assert.match(slot?.note ?? "", /Wing Edge/);
    }
    assert.equal(path?.chapterId, "disc-4.memoria");
    assert.equal(path?.itemId, item.itemId);
    assert.equal(path?.method, item.method);
    assert.equal(path?.quantity, 1);
    assert.equal(path?.availability, "one-time-encounter");
    assert.equal(path?.enemyId, item.enemyId);
    assert.equal(path?.enemyLootSlot, item.slot);
    assert.deepEqual(path?.encounterIds, [encounterId]);
    assert.ok(path?.walkthroughObjectiveIds?.includes(objectiveId));
    assert.ok([...requiredSources].every((sourceId) => path?.sourceIds.includes(sourceId)), `${item.id} includes enemy, encounter, and slot provenance`);
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
    for (const rate of item.rates ?? []) assert.ok(path?.conditions?.includes(rate), `${item.id} preserves source-reported ${rate}`);
    if (item.method === "steal") {
      assert.match(path?.conditions ?? "", /chance-based/);
      assert.ok(path?.sourceIds.includes("opatil-steal-list"));
    } else if (item.slot === "always") {
      assert.match(path?.conditions ?? "", /Always/);
      assert.match(path?.conditions ?? "", /victory/);
    } else {
      assert.match(path?.conditions ?? "", /conditional/);
      assert.match(path?.conditions ?? "", /normal KO/);
      assert.match(path?.conditions ?? "", /not guaranteed/);
      assert.ok(path?.sourceIds.includes("opatil-drop-list"));
    }
    if (item.disputed) assert.match(`${path?.conditions ?? ""} ${path?.notes ?? ""}`, /disputed/i);
    if (item.labelNormalization) {
      assert.match(`${path?.conditions ?? ""} ${path?.notes ?? ""}`, new RegExp(item.labelNormalization));
      assert.match(`${path?.conditions ?? ""} ${path?.notes ?? ""}`, /normaliz\w* to Common/i);
    }
  }

  const rightTentacle = enemyRecords.find((entry) => entry.id === "enemy.kraken-right-tentacle");
  const rightTentacleSlot = rightTentacle?.steals.find((slot) => slot.slot === "common");
  assert.equal(rightTentacle?.steals.filter((slot) => slot.slot === "common").length, 1);
  assert.ok(rightTentacleSlot?.itemId === "game-item.elixir");
  assert.ok(rightTentacleSlot?.sourceIds.includes("gamefaqs-memoria-71891"));
  assert.ok(["gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary", "opatil-steal-list"].every((sourceId) => rightTentacleSlot?.sourceIds.includes(sourceId)));
  assert.match(rightTentacleSlot?.note ?? "", /disputed/i);
  assert.match(rightTentacleSlot?.note ?? "", /Very Common.*normalizes.*Common/i);
  const leftTentacle = enemyRecords.find((entry) => entry.id === "enemy.kraken-left-tentacle");
  const leftTentacleSlot = leftTentacle?.steals.find((slot) => slot.slot === "common");
  assert.match(leftTentacleSlot?.note ?? "", /Very Common.*normalizes.*Common/i);
});

test("White Robe links the Sea at Dusk treasure, repeatable Daguerreo synthesis, and optional inventory targets", () => {
  const whiteRobePaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.white-robe");
  const chocographPath = whiteRobePaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.white-robe-sea-at-dusk");
  const synthesisPath = whiteRobePaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.white-robe-daguerreo-synthesis");
  const kujaPath = whiteRobePaths.find((path) => path.id === "item-path.disc-4.the-final-battle.trance-kuja-white-robe-steal");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.white-robe");
  const objective = objectives.find((entry) => entry.id === "disc-3.white-robe");
  const targets = sourceInventoryTargets.filter((entry) => entry.itemId === "game-item.white-robe");
  const abilities = equipmentAbilityClaims.filter((entry) => entry.itemId === "game-item.white-robe");
  const steps = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));

  assert.equal(whiteRobePaths.length, 3);
  assert.equal(chocographPath?.method, "chocograph");
  assert.equal(chocographPath?.availability, "single-use");
  assert.match(chocographPath?.conditions ?? "", /Chocograph #17: Sea at Dusk/);
  assert.equal(synthesisPath?.method, "synthesis");
  assert.equal(synthesisPath?.availability, "repeatable");
  assert.equal(synthesisPath?.recipeId, "synthesis-recipe.white-robe");
  assert.equal(synthesisPath?.cost?.amount, 8000);
  assert.equal(recipe?.resultItemId, "game-item.white-robe");
  assert.equal(recipe?.cost.amount, 8000);
  assert.deepEqual(recipe?.ingredients.map((ingredient) => ingredient.itemId).sort(), ["game-item.gaia-gear", "game-item.jade-armlet"]);
  assert.ok(kujaPath?.walkthroughObjectiveIds?.includes("disc-3.white-robe"));
  assert.ok(objective?.chapterIds?.includes("disc-4.final-preparations"));
  assert.equal(targets.find((entry) => entry.basis === "route-need")?.targetQuantity, 3);
  assert.equal(targets.find((entry) => entry.basis === "end-inventory")?.targetQuantity, 1);
  assert.deepEqual(abilities.map((entry) => entry.abilityName).sort(), ["Auto-Potion", "Holy", "Loudmouth"]);
  assert.ok(steps.find((step) => step.id === "high-seas-ocean-chocographs")?.text.includes("White Robe"));
  assert.ok(steps.find((step) => step.id === "aerial-daguerreo-rank-and-synthesis")?.detail?.includes("White Robe from Gaia Gear + Jade Armlet for 8,000 Gil"));
  assert.ok(steps.find((step) => step.id === "final-preparations-open-activities")?.objectiveIds?.includes("disc-3.white-robe"));
  for (const path of [chocographPath, synthesisPath, kujaPath]) {
    assert.ok(path?.walkthroughObjectiveIds?.includes("disc-3.white-robe"));
    assert.ok(path?.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
});

test("Reflect Ring and Madain's Ring link every listed recovery route, recipe, and optional quantity", () => {
  const reflectRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.reflect-ring");
  const madainRingPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.madain-ring");
  const reflectRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.reflect-ring");
  const madainRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.madain-ring");
  const reflectObjective = objectives.find((objective) => objective.id === "disc-2.reflect-ring");
  const madainObjective = objectives.find((objective) => objective.id === "disc-2.madain-ring");
  const reflectTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.reflect-ring");
  const madainTargets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.madain-ring");
  const reflectAbilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.reflect-ring");
  const madainAbilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.madain-ring");
  const steps = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));
  const reflectSynthesisPaths = reflectRingPaths.filter((path) => path.method === "synthesis");
  const madainSynthesisPaths = madainRingPaths.filter((path) => path.method === "synthesis");
  const reflectAuction = reflectRingPaths.find((path) => path.method === "auction");
  const madainAuction = madainRingPaths.find((path) => path.method === "auction");
  const fossilPath = madainRingPaths.find((path) => path.id === "item-path.disc-2.journey-to-outer-continent.madain-ring-fossil-roo-digging");
  const crackPath = madainRingPaths.find((path) => path.id === "item-path.disc-3.forgotten-continent.madain-ring-near-landing-mountain-crack");
  const hadesPath = reflectRingPaths.find((path) => path.id === "item-path.disc-4.memoria.hades-reflect-ring-steal");

  assert.equal(gameItems.find((item) => item.id === "game-item.madain-ring")?.name, "Madain's Ring");
  assert.equal(reflectRingPaths.length, 7);
  assert.equal(madainRingPaths.length, 8);
  assert.equal(reflectAuction?.availability, "single-use");
  assert.match(reflectAuction?.conditions ?? "", /non-repeatable/);
  assert.equal(madainAuction?.availability, "repeatable");
  assert.equal(fossilPath?.availability, "conditional");
  assert.ok(fossilPath?.walkthroughObjectiveIds?.includes("disc-2.journey-to-outer-continent.one-ring"));
  assert.equal(crackPath?.availability, "single-use");
  assert.match(crackPath?.conditions ?? "", /#2.*#3/);
  assert.ok(crackPath?.walkthroughObjectiveIds?.includes("disc-3.forgotten-continent.mountain-cracks"));
  assert.equal(hadesPath?.method, "steal");
  assert.ok(hadesPath?.walkthroughObjectiveIds?.includes("disc-2.reflect-ring"));

  assert.deepEqual(reflectSynthesisPaths.map((path) => path.shopId).sort(), [
    "alexandria.synthesis-shop.disc-3-4",
    "black-mage-village.synthesis-shop.disc-2-3",
    "daguerreo.synthesis-expert",
    "lindblum.synthesis-shop.disc-3-4",
    "treno.synthesis-shop.disc-3-4",
  ].sort());
  assert.deepEqual(madainSynthesisPaths.map((path) => path.shopId).sort(), [
    "alexandria.synthesis-shop.disc-3-4",
    "black-mage-village.synthesis-shop.disc-2-3",
    "daguerreo.synthesis-expert",
    "lindblum.synthesis-shop.disc-3-4",
    "treno.synthesis-shop.disc-3-4",
  ].sort());
  for (const path of [...reflectSynthesisPaths, ...madainSynthesisPaths]) {
    assert.equal(path.availability, "repeatable");
    assert.ok(path.recipeId);
    assert.ok(path.walkthroughObjectiveIds?.some((id) => id === "disc-2.reflect-ring" || id === "disc-2.madain-ring"));
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }

  assert.equal(reflectRecipe?.resultItemId, "game-item.reflect-ring");
  assert.equal(reflectRecipe?.cost.amount, 7000);
  assert.deepEqual(reflectRecipe?.ingredients.map((ingredient) => ingredient.itemId).sort(), ["game-item.anklet", "game-item.madain-ring"]);
  assert.equal(madainRecipe?.resultItemId, "game-item.madain-ring");
  assert.equal(madainRecipe?.cost.amount, 3000);
  assert.deepEqual(madainRecipe?.ingredients.map((ingredient) => ingredient.itemId).sort(), ["game-item.bone-wrist", "game-item.stardust-rod"]);
  assert.ok(reflectObjective?.chapterIds?.includes("disc-4.memoria"));
  assert.ok(madainObjective?.chapterIds?.includes("disc-3.forgotten-continent"));
  assert.equal(reflectTargets.find((target) => target.basis === "route-need")?.targetQuantity, 9);
  assert.equal(reflectTargets.find((target) => target.basis === "end-inventory")?.targetQuantity, 8);
  assert.equal(madainTargets.find((target) => target.basis === "route-need")?.targetQuantity, 9);
  assert.equal(madainTargets.find((target) => target.basis === "end-inventory")?.targetQuantity, 22);
  assert.deepEqual(reflectAbilities.map((claim) => claim.abilityName).sort(), ["Auto-Reflect", "Distract", "Reflect"]);
  assert.deepEqual(madainAbilities.map((claim) => claim.abilityName).sort(), ["Body Temp", "Chemist", "Guardian Mog"]);

  assert.ok(steps.find((step) => step.id === "treno-fairy-earrings-auction")?.objectiveIds?.includes("disc-2.reflect-ring"));
  assert.ok(steps.find((step) => step.id === "fossil-roo-madains-ring")?.detail?.includes("later sources provide alternatives"));
  assert.ok(steps.find((step) => step.id === "forgotten-continent-mountain-cracks")?.objectiveIds?.includes("disc-2.madain-ring"));
  assert.ok(steps.find((step) => step.id === "aerial-daguerreo-rank-and-synthesis")?.detail?.includes("Reflect Ring (Anklet + Madain's Ring, 7,000 Gil)"));
  for (const path of [...reflectRingPaths, ...madainRingPaths]) {
    assert.ok(path.walkthroughObjectiveIds?.includes(path.itemId === "game-item.reflect-ring" ? "disc-2.reflect-ring" : "disc-2.madain-ring"));
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
});

test("Rosetta Ring links its Stellazzio, Friendly Yan, Mountain Crack, and Disc IV synthesis routes", () => {
  const rosettaPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.rosetta-ring");
  const stellaPath = rosettaPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.rosetta-ring-stellazzio-reward");
  const yanPath = rosettaPaths.find((path) => path.id === "item-path.disc-3.aerial-exploration.rosetta-ring-friendly-yan-gift");
  const crackPath = rosettaPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.rosetta-ring-mountain-crack-1");
  const synthesisPath = rosettaPaths.find((path) => path.id === "item-path.disc-4.return-to-gaia.rosetta-ring-black-mage-village-synthesis");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.rosetta-ring");
  const objective = objectives.find((entry) => entry.id === "disc-3.aerial-exploration.rosetta-ring-stellazzio");
  const targets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.rosetta-ring");
  const abilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.rosetta-ring");
  const steps = walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps));

  assert.equal(rosettaPaths.length, 4);
  assert.ok(stellaPath);
  assert.equal(stellaPath.method, "quest-reward");
  assert.equal(stellaPath.availability, "single-use");
  assert.ok(stellaPath.conditions.includes("ten Stellazzio"));
  assert.ok(stellaPath.walkthroughObjectiveIds.includes("disc-3.aerial-exploration.rosetta-ring-stellazzio"));
  assert.equal(yanPath?.method, "quest-reward");
  assert.equal(yanPath?.availability, "conditional");
  assert.match(yanPath?.conditions ?? "", /other eight.*Diamond/);
  assert.match(yanPath?.notes ?? "", /Always drop.*gift route.*not directly verified/);
  assert.ok(yanPath?.walkthroughObjectiveIds?.includes("disc-3.aerial-exploration.friendly-yan"));
  assert.equal(crackPath?.availability, "single-use");
  assert.ok(crackPath?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.mountain-crack"));
  assert.equal(synthesisPath?.availability, "repeatable");
  assert.equal(synthesisPath?.shopId, "black-mage-village.synthesis-shop.disc-4");
  assert.equal(synthesisPath?.cost?.amount, 24000);
  assert.ok(synthesisPath?.walkthroughObjectiveIds?.includes("disc-4.return-to-gaia.updated-shops"));

  assert.equal(recipe?.resultItemId, "game-item.rosetta-ring");
  assert.equal(recipe?.cost.amount, 24000);
  assert.deepEqual(recipe?.ingredients.map((ingredient) => ingredient.itemId).sort(), ["game-item.holy-lance", "game-item.madain-ring"]);
  assert.ok(objective?.chapterIds?.includes("disc-3.aerial-exploration"));
  assert.equal(targets.find((target) => target.basis === "route-need")?.targetQuantity, 9);
  assert.equal(targets.find((target) => target.basis === "end-inventory")?.targetQuantity, 13);
  assert.deepEqual(abilities.map((claim) => claim.abilityName).sort(), ["Concentrate", "Level Up", "Reflectx2"]);
  assert.ok(steps.find((step) => step.id === "aerial-treno-stellazzio")?.objectiveIds?.includes("disc-3.aerial-exploration.rosetta-ring-stellazzio"));
  assert.ok(steps.find((step) => step.id === "aerial-friendly-yan-gift")?.text.includes("Rosetta Ring"));
  assert.ok(steps.find((step) => step.id === "gaia-return-shop-stock")?.detail?.includes("Rosetta Ring from Madain's Ring + Holy Lance (24,000)"));
  assert.ok(steps.find((step) => step.id === "final-preparations-open-activities")?.detail?.includes("end-inventory #13"));
  for (const path of rosettaPaths) {
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
});

test("Coral Ring keeps its Festival prize, synthesis recovery routes, abilities, and optional quantities distinct", () => {
  const coralPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.coral-ring");
  const coralSynthesisPaths = coralPaths.filter((path) => path.method === "synthesis");
  const festivalPath = coralPaths.find((path) => path.id === "item-path.disc-1.lindblum.coral-ring-freya-festival-reward");
  const lindblumPath = coralPaths.find((path) => path.id === "item-path.disc-2.return-to-lindblum.coral-ring-post-cleyra-synthesis");
  const trenoCandidate = coralPaths.find((path) => path.id === "item-path.disc-2.treno.coral-ring-synthesis-candidate");
  const laterTrenoPath = coralPaths.find((path) => path.id === "item-path.disc-3.on-the-high-seas.coral-ring-treno-synthesis");
  const recipe = synthesisRecipes.find((entry) => entry.id === "synthesis-recipe.coral-ring");
  const targets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.coral-ring");
  const abilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.coral-ring");
  const item = gameItems.find((entry) => entry.id === "game-item.coral-ring");
  const returnLindblumSections = walkthroughChapters.flatMap((chapter) => chapter.sections);
  const returnLindblumStep = returnLindblumSections.flatMap((section) => section.steps)
    .find((step) => step.id === "return-lindblum-shop-preparation");
  const returnLindblumSection = returnLindblumSections.find((section) => section.id === "return-lindblum-business-district");

  assert.equal(coralPaths.length, 9);
  assert.equal(coralSynthesisPaths.length, 8);
  assert.ok(coralSynthesisPaths.every((path) => path.recipeId === "synthesis-recipe.coral-ring" && path.cost?.amount === 1200));
  assert.equal(festivalPath?.method, "quest-reward");
  assert.equal(festivalPath?.availability, "conditional");
  assert.equal(lindblumPath?.availability, "repeatable");
  assert.equal(lindblumPath?.cost?.amount, 1200);
  assert.ok(lindblumPath?.walkthroughObjectiveIds?.includes("disc-2.return-to-lindblum.cleyra-recovery-shops"));
  assert.equal(trenoCandidate?.availability, "window-unverified");
  assert.match(trenoCandidate?.conditions ?? "", /GameFAQs Shops.*omits Coral Ring/i);
  assert.ok(trenoCandidate?.conditions?.includes("Disc III–IV Treno route"));
  assert.equal(laterTrenoPath?.availability, "repeatable");

  assert.equal(recipe?.resultItemId, "game-item.coral-ring");
  assert.equal(recipe?.cost.amount, 1200);
  assert.deepEqual(recipe?.ingredients.map((ingredient) => ingredient.itemId).sort(), ["game-item.lightning-staff", "game-item.rod"]);
  assert.equal(targets.find((target) => target.basis === "route-need")?.targetQuantity, 9);
  assert.equal(targets.find((target) => target.basis === "end-inventory")?.targetQuantity, 8);
  assert.deepEqual(abilities.map((claim) => claim.abilityName).sort(), ["Insomniac", "Lancer", "Man Eater"]);
  assert.ok(item?.sourceIds.includes("rpgclassics-synthesis"));
  assert.ok(returnLindblumStep?.detail?.includes("Lightning Staff + Rod for 1,200 Gil"));
  assert.ok(returnLindblumSection?.sourceIds?.includes("rpgclassics-synthesis"));
  for (const path of coralPaths) {
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
});

test("Rod links Garnet's starting copy, shop and chest sources, Coral Ring synthesis, and its abilities", () => {
  const rodPaths = itemAcquisitionPaths.filter((path) => path.itemId === "game-item.rod");
  const startingPath = rodPaths.find((path) => path.method === "starting-equipment");
  const daliPath = rodPaths.find((path) => path.id === "item-path.disc-1.village-of-dali.rod-shop");
  const lindblumPath = rodPaths.find((path) => path.id === "item-path.disc-1.lindblum.rod-pre-cleyra-shop");
  const ipsenPath = rodPaths.find((path) => path.id === "item-path.disc-3.ipsens-castle.rod-chest");
  const coralRecipe = synthesisRecipes.find((recipe) => recipe.id === "synthesis-recipe.coral-ring");
  const targets = sourceInventoryTargets.filter((target) => target.itemId === "game-item.rod");
  const abilities = equipmentAbilityClaims.filter((claim) => claim.itemId === "game-item.rod");

  assert.equal(rodPaths.length, 4);
  assert.equal(startingPath?.chapterId, "disc-1.alexandria");
  assert.equal(daliPath?.cost?.amount, 260);
  assert.equal(lindblumPath?.availability, "limited-window");
  assert.equal(lindblumPath?.cost?.amount, 260);
  assert.ok(lindblumPath?.walkthroughObjectiveIds?.includes("disc-1.lindblum.pre-cleyra-stock"));
  assert.equal(ipsenPath?.method, "chest");
  assert.ok(ipsenPath?.walkthroughObjectiveIds?.includes("disc-3.ipsens-castle.pickups"));
  assert.ok(coralRecipe?.ingredients.some((ingredient) => ingredient.itemId === "game-item.rod"));
  assert.equal(targets.find((target) => target.basis === "route-need")?.targetQuantity, 2);
  assert.equal(targets.find((target) => target.basis === "end-inventory")?.targetQuantity, 8);
  assert.deepEqual(abilities.map((claim) => claim.abilityName).sort(), ["Cure", "Panacea", "Protect"]);
  for (const path of rodPaths) {
    assert.ok(path.sourceIds.every((sourceId) => sources.some((source) => source.id === sourceId)));
  }
});
