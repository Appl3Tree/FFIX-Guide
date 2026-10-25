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
