import assert from "node:assert/strict";
import test from "node:test";
import { objectives, sources } from "../src/data/guide.ts";
import { equipmentAbilityClaims, gameItems, itemAcquisitionPaths, itemCatalogCoverage } from "../src/data/items.ts";
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

  assert.equal(softPaths.length, 7);
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
  assert.equal(orePaths.length, 3);
  assert.equal(chocographPeridots?.quantity, 12);
  assert.ok(alexandriaPeridot?.walkthroughObjectiveIds?.includes("disc-3.on-the-high-seas.alexandria-ruins"));
  assert.ok(startingLinenCuirass?.conditions?.includes("Freya joins the party"));
  assert.equal(linenCuirassPaths.length, 4);
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
