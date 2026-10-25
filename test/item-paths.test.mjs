import assert from "node:assert/strict";
import test from "node:test";
import { missables, objectives, sources } from "../src/data/guide.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage, sourceInventoryTargets } from "../src/data/items.ts";
import { synthesisRecipes } from "../src/data/synthesis.ts";
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

  assert.equal(softPaths.length, 9);
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
  assert.equal(softPaths.filter((path) => path.method === "chest" || path.method === "hidden-pickup").length, 2);
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
  assert.equal(peridotPaths.length, 17);
  assert.equal(orePaths.length, 5);
  assert.equal(chocographPeridots?.quantity, 12);
  assert.ok(alexandriaPeridot?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.alexandria-ruins"));
  assert.ok(startingLinenCuirass?.conditions?.includes("Freya joins the party"));
  assert.equal(linenCuirassPaths.length, 5);
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
  assert.equal(tiamat.availability, "one-time-encounter");
  assert.match(tiamat.conditions ?? "", /not guaranteed/i);
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

  assert.equal(itemAcquisitionPaths.filter((path) => path.itemId === "game-item.peridot").length, 17);
  assert.ok(objectives.some((objective) => objective.id === "disc-4.memoria.tiamat-achievement"));
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

  assert.equal(pinionPaths.length, 30);
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

  assert.equal(greenPaths.length, 5);
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
  assert.ok(shopPaths.every((path) => path?.method === "shop" && path.availability === "repeatable"));
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
  assert.equal(fossilRoo?.availability, "window-unverified");
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
  assert.equal(wingEdgePaths.length, 14);
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

  for (const pathId of [expectedPathIds[7], expectedPathIds[8], expectedPathIds[9], expectedPathIds[12], expectedPathIds[13]]) {
    const path = pathsById.get(pathId);
    assert.equal(path?.method, "drop", `${pathId} should be a boss drop`);
    assert.equal(path?.availability, "one-time-encounter", `${pathId} should be one-time`);
  }
  assert.equal(pathsById.get(expectedPathIds[10])?.method, "steal");
  assert.equal(pathsById.get(expectedPathIds[10])?.availability, "repeatable");
  assert.match(pathsById.get(expectedPathIds[10])?.notes ?? "", /conflict/);
  assert.equal(pathsById.get(expectedPathIds[11])?.method, "steal");
  assert.equal(pathsById.get(expectedPathIds[11])?.availability, "one-time-encounter");
  assert.match(pathsById.get(expectedPathIds[11])?.notes ?? "", /disputed/);

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
  assert.equal(newPaths[1]?.availability, "window-unverified");
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
  assert.match(cleyraTreasureMissable?.nextAvailability ?? "", /Mythril Vest.*Pinnacle Rocks/);
  assert.match(antlionMissable?.recovery ?? "", /Mythril Vest has the Pinnacle Rocks chest and later shops/);
  assert.match(pinnacleMissable?.recovery ?? "", /Mythril Vest has later shop routes/);
  assert.match(finalStockMissable?.recovery ?? "", /No post-transition replacement is listed/);
});

test("Disc II Treno equipment targets preserve later recovery and optional stock semantics", () => {
  const equipment = [
    ["game-item.air-racket", 3],
    ["game-item.silver-gloves", 4],
    ["game-item.iron-helm", 4],
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
  assert.match(airRacketIpsen?.conditions ?? "", /recovers one Air Racket/);
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

test("Power Belt and Glass Buckle recipes have complete Disc II recovery and ingredient paths", () => {
  const itemIds = ["game-item.power-belt", "game-item.glass-buckle", "game-item.glass-armlet", "game-item.leather-wrist"];
  const pathCounts = [7, 9, 9, 9];
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
