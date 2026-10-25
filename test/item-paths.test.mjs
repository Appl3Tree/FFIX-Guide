import assert from "node:assert/strict";
import test from "node:test";
import { objectives, sources } from "../src/data/guide.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage } from "../src/data/items.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

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
  assert.ok(objectives.some((objective) => objective.id === "disc-2.cleyra.rubbish-pit-chests"));
  assert.ok(itemCatalogCoverage.chapterIds.includes("disc-2.cleyra"));
  assert.ok(walkthroughChapters.some((chapter) => chapter.areaId === "disc-2.cleyra"));
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
