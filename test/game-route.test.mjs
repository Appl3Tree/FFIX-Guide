import assert from "node:assert/strict";
import test from "node:test";
import { missables, sources } from "../src/data/guide.ts";
import { gameRouteCoverage, gameRouteEdges, storyPartySequences } from "../src/data/progression.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

test("the researched story route simulates through the ending and all optional paths rejoin", () => {
  const mainPath = [gameRouteCoverage.chapterIds[0]];
  const visited = new Set(mainPath);
  while (mainPath.at(-1) !== gameRouteCoverage.throughChapterId) {
    const currentChapterId = mainPath.at(-1);
    const nextEdges = gameRouteEdges.filter((edge) => edge.relationship === "required-story" && edge.fromChapterId === currentChapterId);
    assert.equal(nextEdges.length, 1, `${currentChapterId} should have exactly one next story gate`);
    const nextChapterId = nextEdges[0].toChapterId;
    assert.ok(!visited.has(nextChapterId), `the required story path loops back to ${nextChapterId}`);
    visited.add(nextChapterId);
    mainPath.push(nextChapterId);
  }

  assert.equal(mainPath[0], "disc-1.alexandria");
  assert.equal(mainPath.at(-1), "disc-4.the-final-battle");
  const mainPathIds = new Set(mainPath);
  const detours = gameRouteEdges.filter((edge) => edge.relationship === "optional-detour");
  const offPathChapterIds = gameRouteCoverage.chapterIds.filter((chapterId) => !mainPathIds.has(chapterId));
  assert.deepEqual(offPathChapterIds.sort(), detours.map((edge) => edge.toChapterId).sort());

  for (const detour of detours) {
    assert.ok(mainPathIds.has(detour.fromChapterId), `${detour.id} does not start on the story path`);
    const rejoin = gameRouteEdges.find((edge) => edge.relationship === "rejoin" && edge.fromChapterId === detour.toChapterId);
    assert.ok(rejoin, `${detour.id} has no explicit rejoin`);
    assert.ok(mainPathIds.has(rejoin.toChapterId), `${detour.id} rejoins outside the story path`);
  }

  const canReach = (startChapterId, targetChapterId) => {
    const pending = [startChapterId];
    const reached = new Set();
    while (pending.length > 0) {
      const currentChapterId = pending.shift();
      if (!currentChapterId || reached.has(currentChapterId)) continue;
      if (currentChapterId === targetChapterId) return true;
      reached.add(currentChapterId);
      for (const edge of gameRouteEdges) {
        if (edge.fromChapterId === currentChapterId && !reached.has(edge.toChapterId)) pending.push(edge.toChapterId);
      }
    }
    return false;
  };

  for (const optionalReturn of gameRouteEdges.filter((edge) => edge.relationship === "optional-return")) {
    assert.ok(mainPathIds.has(optionalReturn.fromChapterId), `${optionalReturn.id} starts outside the main story path`);
    assert.ok(canReach(optionalReturn.toChapterId, optionalReturn.fromChapterId), `${optionalReturn.id} has no route back to its departure point`);
  }
});

test("the Oeilvert and Desert Palace route preserves the sourced party split order", () => {
  const splitGate = gameRouteEdges.find((edge) => edge.id === "story.picking-up-the-trail-to-forgotten-continent");
  assert.ok(splitGate);
  assert.match(splitGate.summary, /locks the party into the Oeilvert\/Desert Palace split/);

  const toDesertPalace = gameRouteEdges.find((edge) => edge.id === "story.forgotten-continent-to-desert-palace");
  assert.ok(toDesertPalace);
  assert.match(toDesertPalace.summary, /completes Oeilvert and retrieves the Gulug Stone before control switches to Cid's team/);
  for (const sourceId of ["gamefaqs-forgotten-continent-71891", "gamefaqs-desert-palace-71891", "jegged-returning-desert-palace"]) {
    assert.ok(toDesertPalace.sourceIds.includes(sourceId), `party-split edge is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const oeilvert = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.forgotten-continent");
  const gulugStone = oeilvert?.sections.flatMap((section) => section.steps).find((step) => step.id === "oeilvert-take-gulug-stone");
  const desertPalace = walkthroughChapters.find((chapter) => chapter.areaId === "disc-3.desert-palace");
  const cidEscape = desertPalace?.sections.flatMap((section) => section.steps).find((step) => step.id === "desert-palace-cid-hourglass-key");
  assert.ok(gulugStone);
  assert.ok(cidEscape);
  assert.match(gulugStone.text, /changes focus to the other party at the Desert Palace/);
  assert.match(cidEscape.text, /After the scenes.*Cid's Hourglass Key minigame/);

  const rejoin = gameRouteEdges.find((edge) => edge.id === "story.desert-palace-to-lost-continent");
  assert.ok(rejoin);
  assert.match(rejoin.summary, /reunites the parties/);
});

test("early party handoffs record Bohden Gate and the Dagger-Steiner Treno branch", () => {
  const bohden = storyPartySequences.find((sequence) => sequence.id === "party-sequence.bohden-gate");
  assert.ok(bohden);
  assert.deepEqual(bohden.phases.map(({ party, location }) => [party, location]), [
    ["Zidane's group", "Gizamaluke's Grotto"],
    ["Dagger and Steiner", "Bohden Gate and Station"],
    ["Zidane's group", "Daines-horse Basin"],
  ]);
  assert.ok(bohden.sourceIds.includes("gamefaqs-journey-to-burmecia-71891"));

  const treno = storyPartySequences.find((sequence) => sequence.id === "party-sequence.dagger-steiner-treno");
  assert.ok(treno);
  assert.deepEqual(treno.phases.map(({ party }) => party), ["Zidane's group", "Dagger and Steiner", "Zidane's group"]);
  assert.ok(treno.phases[1].chapterIds.includes("disc-2.treno"));
  assert.ok(treno.phases[2].chapterIds.includes("disc-2.journey-to-cleyra"));
  assert.match(treno.phases[2].summary, /returns to Zidane's group in Burmecia/);

  for (const sequence of [bohden, treno]) {
    for (const sourceId of sequence.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${sequence.id} references unknown source ${sourceId}`);
    }
  }
});

test("Disc III Treno retrieves Vivi from Quan only after the ATE route and before Dali", () => {
  const sequence = storyPartySequences.find((entry) => entry.id === "party-sequence.card-tournament-vivi-quan");
  assert.ok(sequence);
  assert.equal(sequence.phases.length, 3);
  assert.match(sequence.phases[0].summary, /only if.*ATE sent Vivi home/i);
  assert.match(sequence.phases[0].summary, /finish the Treno ATE route and the first two tournament matches/);
  assert.equal(sequence.phases[1].location, "Quan's Dwelling, then the western South Gate route to Dali");
  assert.match(sequence.phases[1].summary, /After the Treno ATEs.*Quan's Dwelling.*bring Vivi back.*before the final tournament match/);
  assert.match(sequence.phases[2].summary, /return to Treno before playing the final match/);
  for (const sourceId of ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "flactem-disc-3-treno"]) {
    assert.ok(sequence.sourceIds.includes(sourceId));
    assert.ok(sources.some((source) => source.id === sourceId));
  }

  const detour = gameRouteEdges.find((edge) => edge.id === "detour.card-tournament-dali-return");
  assert.ok(detour);
  assert.match(detour.summary, /retrieve him there first.*western South Gate route/);
  const step = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.card-tournament")
    ?.sections.find((section) => section.id === "card-tournament-dali-detour")
    ?.steps.find((entry) => entry.id === "card-tournament-return-to-quan");
  assert.ok(step);
  assert.match(step.text, /after the Treno ATEs are finished/);
  assert.match(step.detail, /If Vivi stayed in Treno, go directly to Dali/);
});

test("Journey to Cleyra includes the sourced Lindblum Basin frog detour", () => {
  const returnToMarsh = gameRouteEdges.find((edge) => edge.id === "detour.journey-to-cleyra-lindblum-basin-frogs");
  assert.ok(returnToMarsh, "the pre-Cleyra return to Qu's Marsh is represented");
  assert.equal(returnToMarsh.fromChapterId, "disc-2.journey-to-cleyra");
  assert.equal(returnToMarsh.toChapterId, "disc-1.exploring-lindblum-kingdom");
  assert.equal(returnToMarsh.relationship, "optional-return");
  assert.match(returnToMarsh.summary, /third Frog Catching visit/);
  assert.match(returnToMarsh.summary, /golden frog/);

  for (const sourceId of [
    "gamefaqs-journey-to-cleyra-71891",
    "gamefaqs-frog-catching-71891",
    "gamefaqs-exploring-lindblum-71891",
  ]) {
    assert.ok(returnToMarsh.sourceIds.includes(sourceId), `return edge is missing ${sourceId}`);
  }
  for (const sourceId of returnToMarsh.sourceIds) {
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const rejoin = gameRouteEdges.find((edge) => edge.id === "detour.journey-to-cleyra-lindblum-basin-rejoin");
  assert.ok(rejoin);
  assert.equal(rejoin.fromChapterId, "disc-1.exploring-lindblum-kingdom");
  assert.equal(rejoin.toChapterId, "disc-2.journey-to-cleyra");
  assert.equal(rejoin.relationship, "rejoin");
  assert.match(rejoin.summary, /Burmecian territory/);

  const approach = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.journey-to-cleyra");
  const frogStop = approach?.sections.flatMap((section) => section.steps).find((step) => step.id === "journey-cleyra-frog-catching");
  assert.ok(frogStop);
  assert.match(frogStop.text, /through Gizamaluke's Grotto/);
  assert.match(frogStop.text, /Qu's Marsh in Lindblum Basin/);
});

test("Lindblum's city cutoff is attached to the Grotto entry route", () => {
  const lindblumExit = gameRouteEdges.find((edge) => edge.id === "story.lindblum-to-journey-to-burmecia");
  assert.ok(lindblumExit);
  assert.equal(lindblumExit.relationship, "required-story");
  assert.match(lindblumExit.summary, /before entering the Grotto as the safe route checkpoint/);
  assert.match(lindblumExit.summary, /sources disagree about whether the trolley\/district lockout begins at entry or after completing the Grotto/);
  assert.match(lindblumExit.summary, /only the Dragon's Gate merchant remains/);

  for (const sourceId of [
    "gamefaqs-optional-route-47344",
    "gamerguides-gizamaluke",
    "gamerevolution-ffix-walkthrough",
    "elitegrindlab-gizamaluke",
  ]) {
    assert.ok(lindblumExit.sourceIds.includes(sourceId), `route is missing ${sourceId}`);
  }
  for (const sourceId of lindblumExit.sourceIds) {
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }
});

test("Cleyra's story departure records its closure and disputed local cutoff", () => {
  const departure = gameRouteEdges.find((edge) => edge.id === "story.cleyra-to-return-to-alexandria");
  assert.ok(departure);
  assert.equal(departure.relationship, "required-story");
  assert.match(departure.summary, /story departure closes Cleyra and its Trunk/);
  assert.match(departure.summary, /Guides disagree on the broad last-safe-action label/);
  assert.match(departure.summary, /missed chests during it/);
  assert.match(departure.summary, /Freya's post-Antlion Emerald\/Stiltzkin window/);

  for (const sourceId of ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra"]) {
    assert.ok(departure.sourceIds.includes(sourceId), `route is missing ${sourceId}`);
  }
  for (const sourceId of departure.sourceIds) {
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const treasureWindow = missables.find((entry) => entry.id === "missable.disc-2.cleyra.treasures");
  assert.ok(treasureWindow);
  assert.match(treasureWindow.deadline, /exact final cutoff is described differently across guides/);
});

test("Disc III's Alexandria departure keeps the conservative Treno cutoff visible", () => {
  const departure = gameRouteEdges.find((edge) => edge.id === "story.home-front-to-card-tournament");
  assert.ok(departure);
  assert.equal(departure.fromChapterId, "disc-3.the-home-front");
  assert.equal(departure.toChapterId, "disc-3.card-tournament");
  assert.equal(departure.relationship, "required-story");
  assert.match(departure.summary, /story moves to Treno/);
  assert.match(departure.summary, /sources differ on whether remaining optional activities close/);
  assert.match(departure.summary, /Complete the later city sweep before the story moves to Treno/);

  for (const sourceId of ["gamefaqs-home-front-71891", "jegged-home-front", "gamerguides-home-front", "elitegrindlab-home-front"]) {
    assert.ok(departure.sourceIds.includes(sourceId), `Alexandria departure is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const localCutoff = walkthroughChapters
    .find((chapter) => chapter.areaId === "disc-3.the-home-front")
    ?.sections.flatMap((section) => section.steps)
    .find((step) => step.id === "home-front-check-ates-and-transition");
  assert.ok(localCutoff);
  assert.match(localCutoff.text, /Before continuing from the castle to Treno/);
  assert.match(localCutoff.detail, /Sources differ on whether remaining optional city content closes/);

  for (const missableId of [
    "missable.disc-3.the-home-front.hippaul-racing",
    "missable.disc-3.the-home-front.ates",
    "missable.disc-3.the-home-front.stiltzkin-5",
    "missable.disc-3.the-home-front.found-in-the-shuffle",
  ]) {
    const warning = missables.find((entry) => entry.id === missableId);
    assert.ok(warning, `missing Alexandria warning ${missableId}`);
    assert.ok(warning.warningChapterIds.includes("disc-3.the-home-front"), `${missableId} is not warned in Alexandria`);
  }
});

test("Disc IV's Burmecia Mognet return is scoped to Atla's Vault", () => {
  const atlaVisit = gameRouteEdges.find((edge) => edge.id === "detour.alexandria-to-burmecia-mognet");
  assert.ok(atlaVisit);
  assert.equal(atlaVisit.relationship, "optional-return");
  assert.equal(atlaVisit.fromChapterId, "disc-1.alexandria");
  assert.equal(atlaVisit.toChapterId, "disc-1.burmecia");
  assert.match(atlaVisit.summary, /Atla in the Vault/);
  assert.match(atlaVisit.summary, /deliver the letter for Mogryo/);
  assert.match(atlaVisit.summary, /long, monster-occupied route through the former city/);
  assert.match(atlaVisit.summary, /A first-hand Disc IV recovery run documents/);
  assert.match(atlaVisit.summary, /does not establish the availability of every old chest/);

  for (const sourceId of ["gamefaqs-return-to-gaia-71891", "jegged-mognet-central", "elitegrindlab-burmecia", "gamerguides-side-questing-4"]) {
    assert.ok(atlaVisit.sourceIds.includes(sourceId), `Burmecia return is missing ${sourceId}`);
    assert.ok(sources.some((source) => source.id === sourceId), `unknown route source ${sourceId}`);
  }

  const rejoin = gameRouteEdges.find((edge) => edge.id === "detour.mognet-central-repair-rejoin-gaia");
  assert.ok(rejoin);
  assert.equal(rejoin.fromChapterId, "disc-1.alexandria");
  assert.equal(rejoin.toChapterId, "disc-4.return-to-gaia");
  assert.equal(rejoin.relationship, "rejoin");
  assert.match(rejoin.summary, /Superslick from Ruby/);
  assert.match(rejoin.summary, /Ocean-capable Chocobo and a Dead Pepper/);
  assert.ok(rejoin.sourceIds.includes("gamefaqs-return-to-gaia-71891"));
});

test("Disc IV Mognet route graph follows letters 22–27 through each recipient", () => {
  const expectedStops = [
    ["detour.return-to-gaia-alexandria-mognet", "disc-4.return-to-gaia", "disc-1.alexandria", /Kupo in Alexandria's Steeple.*letter for Atla/],
    ["detour.alexandria-to-burmecia-mognet", "disc-1.alexandria", "disc-1.burmecia", /letter for Mogryo/],
    ["detour.burmecia-to-black-mage-village-mognet", "disc-1.burmecia", "disc-2.magdalene-forest", /letter #22.*#23.*Mogryo.*#24/],
    ["detour.black-mage-village-to-ipsen-mognet", "disc-2.magdalene-forest", "disc-3.ipsens-castle", /letter #24.*#25/],
    ["detour.ipsen-to-fossil-roo-mognet", "disc-3.ipsens-castle", "disc-2.journey-to-outer-continent", /letter #25.*#26.*Quina/],
    ["detour.fossil-roo-to-daguerreo-mognet", "disc-2.journey-to-outer-continent", "disc-3.aerial-exploration", /letter #26.*#27/],
    ["detour.daguerreo-to-alexandria-mognet", "disc-3.aerial-exploration", "disc-1.alexandria", /letter #27.*Superslick/],
    ["detour.mognet-central-repair-rejoin-gaia", "disc-1.alexandria", "disc-4.return-to-gaia", /Mognet Central.*Protect Ring/],
  ];

  for (const [index, [id, from, to, detail]] of expectedStops.entries()) {
    const edge = gameRouteEdges.find((candidate) => candidate.id === id);
    assert.ok(edge, `${id} is represented`);
    assert.equal(edge.fromChapterId, from);
    assert.equal(edge.toChapterId, to);
    assert.equal(edge.relationship, index === expectedStops.length - 1 ? "rejoin" : "optional-return");
    assert.match(edge.summary, detail);
    if (id !== "detour.mognet-central-repair-rejoin-gaia") {
      assert.ok(edge.sourceIds.includes("jegged-mognet-central"));
      assert.ok(edge.sourceIds.includes("cour89-mognet-letters"));
    }
    for (const sourceId of edge.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `${id} references unknown source ${sourceId}`);
    }
  }
});

test("Dali keeps the Ice Cavern return open until the Cargo Ship departure", () => {
  const returnToCavern = gameRouteEdges.find((edge) => edge.id === "return.dali-to-ice-cavern");
  assert.ok(returnToCavern, "Dali's optional Ice Cavern return is represented");
  assert.equal(returnToCavern.fromChapterId, "disc-1.village-of-dali");
  assert.equal(returnToCavern.toChapterId, "disc-1.ice-cavern");
  assert.equal(returnToCavern.relationship, "optional-return");
  assert.match(returnToCavern.summary, /sweep missed Ice Cavern chests/);
  assert.match(returnToCavern.summary, /boarding the Cargo Ship/);
  assert.match(returnToCavern.summary, /Game8 and Jinsoku list a broader Disc I\/Beatrix window/);

  for (const sourceId of [
    "gamefaqs-ice-cavern-71891",
    "steam-missable-content-guide-2988011418",
    "gamefaqs-missables-71891",
    "gamefaqs-dali-71891",
    "jegged-ice-cavern",
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
  assert.match(moisLetter.note, /Sources agree it is Disc I mail but differ on the exact end point/);
  assert.match(moisLetter.recovery, /had already accepted the letter/);
  assert.ok(moisLetter.sourceIds.includes("steam-missable-content-guide-2988011418"));
  assert.ok(moisLetter.sourceIds.includes("elitegrindlab-ice-cavern"));

  const chestSweep = missables.find((record) => record.id === "missable.disc-1.ice-cavern.treasures");
  assert.ok(chestSweep);
  assert.ok(chestSweep.warningChapterIds.includes("disc-1.village-of-dali"), "the chest warning remains active during the return window");

  const counts = gameRouteEdges.reduce((result, edge) => {
    result[edge.relationship] += 1;
    return result;
  }, { "required-story": 0, "optional-detour": 0, "optional-return": 0, rejoin: 0 });
  assert.equal(gameRouteEdges.length, 96);
  assert.deepEqual(counts, { "required-story": 41, "optional-detour": 2, "optional-return": 30, rejoin: 23 });
  assert.equal(storyPartySequences.length, 10);
});
