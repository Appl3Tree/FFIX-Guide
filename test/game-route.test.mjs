import assert from "node:assert/strict";
import test from "node:test";
import { missables, sources } from "../src/data/guide.ts";
import { gameRouteEdges } from "../src/data/progression.ts";

test("Dali keeps the Ice Cavern return open until the Cargo Ship departure", () => {
  const returnToCavern = gameRouteEdges.find((edge) => edge.id === "return.dali-to-ice-cavern");
  assert.ok(returnToCavern, "Dali's optional Ice Cavern return is represented");
  assert.equal(returnToCavern.fromChapterId, "disc-1.village-of-dali");
  assert.equal(returnToCavern.toChapterId, "disc-1.ice-cavern");
  assert.equal(returnToCavern.relationship, "optional-return");
  assert.match(returnToCavern.summary, /eight Ice Cavern chests/);
  assert.match(returnToCavern.summary, /boarding the Cargo Ship/);
  assert.match(returnToCavern.summary, /no other publisher confirms/);

  for (const sourceId of [
    "gamefaqs-ice-cavern-71891",
    "gamefaqs-ice-cavern-79143",
    "steam-missable-content-guide-2988011418",
    "gamefaqs-missables-71891",
    "gamefaqs-dali-71891",
    "jegged-ice-cavern",
    "jegged-dali",
    "elitegrindlab-ice-cavern",
  ]) {
    assert.ok(returnToCavern.sourceIds.includes(sourceId), `return edge is missing ${sourceId}`);
  }
  for (const sourceId of returnToCavern.sourceIds) {
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const storyArrival = gameRouteEdges.find((edge) => edge.fromChapterId === "disc-1.ice-cavern" && edge.toChapterId === "disc-1.village-of-dali");
  assert.equal(storyArrival?.relationship, "required-story");
  assert.match(storyArrival.summary, /optional Ice Cavern sweep/);

  const moisLetter = missables.find((record) => record.id === "missable.disc-1.ice-cavern.mois-letter");
  assert.ok(moisLetter);
  assert.ok(!moisLetter.classification.includes("recoverable-later"), "disputed letter recovery is not presented as guaranteed");
  assert.deepEqual(moisLetter.warningChapterIds, ["disc-1.ice-cavern", "disc-1.village-of-dali"]);
  assert.match(moisLetter.note, /only one consulted source explicitly claims/);
  assert.match(moisLetter.recovery, /already accepted the letter before battle/);
  assert.ok(moisLetter.sourceIds.includes("steam-missable-content-guide-2988011418"));
  assert.ok(moisLetter.sourceIds.includes("elitegrindlab-ice-cavern"));

  const chestSweep = missables.find((record) => record.id === "missable.disc-1.ice-cavern.treasures");
  assert.ok(chestSweep);
  assert.ok(chestSweep.warningChapterIds.includes("disc-1.village-of-dali"), "the chest warning remains active during the return window");

  const counts = gameRouteEdges.reduce((result, edge) => {
    result[edge.relationship] += 1;
    return result;
  }, { "required-story": 0, "optional-detour": 0, "optional-return": 0, rejoin: 0 });
  assert.equal(gameRouteEdges.length, 64);
  assert.deepEqual(counts, { "required-story": 41, "optional-detour": 2, "optional-return": 11, rejoin: 10 });
});
