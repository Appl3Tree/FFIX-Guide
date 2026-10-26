import assert from "node:assert/strict";
import test from "node:test";
import { achievementCatalogs } from "../src/data/achievements.ts";
import {
  activeTimeEvents,
  movieCriticEligibleEvents,
  movieCriticExclusiveGroupId,
  movieCriticTarget,
} from "../src/data/ates.ts";
import { objectives, sources } from "../src/data/guide.ts";
import { ateObjectiveDependencies, guideChapterSequence, objectiveAccessDependencies, objectiveDependencies } from "../src/data/progression.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

const eventByObjective = new Map(activeTimeEvents.map((event) => [event.objectiveId, event]));
const objectiveById = new Map(objectives.map((objective) => [objective.id, objective]));
const chapterOrder = new Map(guideChapterSequence.map((chapterId, index) => [chapterId, index]));
const branchEvents = movieCriticEligibleEvents.filter((event) => event.exclusiveGroupId === movieCriticExclusiveGroupId);

test("each supported Movie Critic catalog has an ordered 79-view single-save route", () => {
  assert.equal(movieCriticEligibleEvents.length, 80);
  assert.equal(branchEvents.length, 2);
  assert.equal(ateObjectiveDependencies.length, 32);
  assert.equal(objectiveAccessDependencies.length, 9);
  assert.equal(objectiveDependencies.length, 111);

  assert.deepEqual(
    movieCriticEligibleEvents
      .filter((event) => event.chapterId === "disc-2.treno")
      .map((event) => event.objectiveId),
    [
      "ate.treno-tradition",
      "ate.treno-pursuit",
      "ate.treno-confusion",
      "ate.treno-ambition",
      "ate.treno-meeting-place",
      "ate.treno-unexpected-visitor",
      "ate.treno-crime-and-punishment",
    ],
    "Treno's Movie Critic route follows the four-source safe screen order",
  );

  const daliEvents = movieCriticEligibleEvents.filter((event) => event.chapterId === "disc-1.village-of-dali");
  assert.deepEqual(
    daliEvents.map((event) => event.objectiveId),
    [
      "ate.dali-vivi-confused",
      "ate.dali-dagger-tries",
      "ate.dali-cats-eye",
      "ate.dali-cats-eye-2",
      "ate.dali-dagger-tries-harder",
      "ate.dali-queen-brahnes-steiner",
    ],
    "Dali's Movie Critic route includes the opening choice, town prompts, and automatic final scene",
  );
  assert.deepEqual(eventByObjective.get("ate.dali-cats-eye-2")?.prerequisites, ["ate.dali-cats-eye"]);
  assert.deepEqual(eventByObjective.get("ate.dali-dagger-tries-harder")?.prerequisites, ["ate.dali-dagger-tries"]);
  assert.deepEqual(eventByObjective.get("ate.dali-queen-brahnes-steiner")?.prerequisites, [
    "ate.dali-dagger-tries-harder",
    "ate.dali-cats-eye",
  ]);
  for (const event of daliEvents) {
    for (const sourceId of ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"]) {
      assert.ok(event.sourceIds.includes(sourceId), `${event.title} is missing Dali source ${sourceId}`);
    }
  }

  const tournamentTrenoEvents = movieCriticEligibleEvents.filter((event) => event.chapterId === "disc-3.card-tournament");
  assert.deepEqual(
    tournamentTrenoEvents.map((event) => event.objectiveId),
    [
      "ate.treno-eiko-talks-life",
      "ate.treno-how-he-ended-up-here",
      "ate.treno-hippos-prize",
      "ate.treno-memories-by-the-water",
      "ate.treno-city-people",
      "ate.treno-good-old-days",
      "ate.treno-lessons-of-life",
      "ate.treno-home-sweet-home",
      "ate.treno-hallucination",
      "ate.treno-premonition",
    ],
    "Disc III Treno's ten named ATEs include a nine-event route with one branch choice",
  );
  assert.deepEqual(eventByObjective.get("ate.treno-home-sweet-home")?.prerequisites, [
    "ate.treno-good-old-days",
    "ate.treno-lessons-of-life",
  ]);
  for (const event of tournamentTrenoEvents) {
    for (const sourceId of ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"]) {
      assert.ok(event.sourceIds.includes(sourceId), `${event.title} is missing Disc III Treno source ${sourceId}`);
    }
  }

  assert.deepEqual(
    movieCriticEligibleEvents
      .filter((event) => event.chapterId === "disc-2.outer-continent" && event.location.startsWith("Conde Petie"))
      .map((event) => event.objectiveId),
    [
      "ate.conde-petie-vivi-and-couple",
      "ate.conde-petie-quina-accused",
      "ate.conde-petie-quina-cant-communicate",
      "ate.conde-petie-dagger-and-william",
      "ate.conde-petie-hungry-bryan",
    ],
    "Conde Petie's first-visit ATE route follows the sourced five-scene order",
  );

  assert.deepEqual(eventByObjective.get("ate.conde-petie-hungry-bryan")?.prerequisites, [
    "ate.conde-petie-vivi-and-couple",
    "ate.conde-petie-quina-accused",
    "ate.conde-petie-quina-cant-communicate",
    "ate.conde-petie-dagger-and-william",
  ]);

  assert.deepEqual(
    movieCriticEligibleEvents
      .filter((event) => event.chapterId === "disc-2.magdalene-forest")
      .map((event) => event.objectiveId),
    [
      "ate.bmv-everyday-life",
      "ate.bmv-life-on-the-run",
      "ate.bmv-gourmands-nose",
      "ate.bmv-different-language",
      "ate.bmv-visitor-not-invader",
      "ate.bmv-life-cycle",
    ],
    "Black Mage Village's first-visit ATE route follows the three-source safe order",
  );

  assert.deepEqual(eventByObjective.get("ate.bmv-life-on-the-run")?.prerequisites, ["ate.bmv-everyday-life"]);
  assert.deepEqual(eventByObjective.get("ate.bmv-gourmands-nose")?.prerequisites, ["ate.bmv-life-on-the-run"]);
  assert.deepEqual(eventByObjective.get("ate.bmv-different-language")?.prerequisites, ["ate.bmv-gourmands-nose"]);
  assert.deepEqual(eventByObjective.get("ate.bmv-visitor-not-invader")?.prerequisites, ["ate.bmv-different-language"]);
  assert.deepEqual(eventByObjective.get("ate.bmv-life-cycle")?.prerequisites, ["ate.bmv-visitor-not-invader"]);

  const cleyraEvents = movieCriticEligibleEvents.filter((event) => event.chapterId === "disc-2.cleyra");
  assert.deepEqual(
    cleyraEvents.map((event) => event.objectiveId),
    [
      "ate.cleyra-no-yummie-yummies",
      "ate.cleyra-dont-hate-me",
      "ate.cleyra-i-havent-hurt-anyone",
      "ate.cleyra-there-a-mushroom",
    ],
    "Cleyra's tracker order follows the precise pond-entry/re-entry/observatory route",
  );
  for (const event of cleyraEvents) {
    for (const sourceId of ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra"]) {
      assert.ok(event.sourceIds.includes(sourceId), `${event.title} is missing Cleyra source ${sourceId}`);
    }
  }

  for (const branchEvent of branchEvents) {
    const route = movieCriticEligibleEvents.filter((event) =>
      event.exclusiveGroupId !== movieCriticExclusiveGroupId || event.objectiveId === branchEvent.objectiveId,
    );
    const routeIndex = new Map(route.map((event, index) => [event.objectiveId, index]));

    assert.equal(route.length, movieCriticTarget);
    assert.equal(route.filter((event) => event.exclusiveGroupId === movieCriticExclusiveGroupId).length, 1);

    let previousChapter = -1;
    for (const event of route) {
      const eventChapter = chapterOrder.get(event.chapterId);
      assert.ok(eventChapter !== undefined, `${event.title} has an unordered chapter ${event.chapterId}`);
      assert.ok(eventChapter >= previousChapter, `${event.title} appears before an earlier chapter's ATEs`);
      previousChapter = eventChapter;

      for (const prerequisiteId of event.prerequisites ?? []) {
        const prerequisiteEvent = eventByObjective.get(prerequisiteId);
        if (prerequisiteEvent) {
          assert.ok(routeIndex.has(prerequisiteId), `${event.title} is missing ATE prerequisite ${prerequisiteId}`);
          assert.ok(routeIndex.get(prerequisiteId) < routeIndex.get(event.objectiveId), `${event.title} appears before ${prerequisiteEvent.title}`);
          continue;
        }

        const prerequisiteObjective = objectiveById.get(prerequisiteId);
        assert.ok(prerequisiteObjective, `${event.title} has an unmodeled prerequisite ${prerequisiteId}`);
        const prerequisiteChapters = prerequisiteObjective.chapterIds.map((chapterId) => chapterOrder.get(chapterId));
        assert.ok(prerequisiteChapters.some((index) => index !== undefined && index < eventChapter), `${event.title}'s external prerequisite is not placed earlier in the route`);
        assert.ok(prerequisiteObjective.profileIds.includes("achievements"), `${event.title}'s external prerequisite is hidden from the achievement profile`);
      }
    }

    for (const [platform, records] of Object.entries(achievementCatalogs)) {
      const record = records.find((achievement) =>
        ("parityId" in achievement ? achievement.parityId : achievement.id) === "movie-critic",
      );
      assert.ok(record, `${platform} is missing Movie Critic`);
      assert.match(record.criteria, new RegExp(String(movieCriticTarget)));
      const pointers = new Set(record.guideObjectiveIds ?? []);
      for (const event of route) {
        assert.ok(pointers.has(event.objectiveId), `${platform} Movie Critic does not point to ${event.objectiveId}`);
      }
      for (const event of route) {
        for (const prerequisiteId of event.prerequisites ?? []) {
          if (eventByObjective.has(prerequisiteId)) continue;
          const prerequisiteObjective = objectiveById.get(prerequisiteId);
          assert.ok(prerequisiteObjective.achievementPlatforms.includes(platform), `${platform} does not show ${event.title}'s external prerequisite`);
        }
      }
    }
  }
});

test("Cleyra's Quina ATEs are linked to the rubbish-pit chest objective", () => {
  const chestObjectiveId = "disc-2.cleyra.rubbish-pit-chests";
  const dependencies = objectiveAccessDependencies.filter((dependency) => dependency.dependentObjectiveId === chestObjectiveId);
  assert.deepEqual(
    dependencies.map((dependency) => dependency.prerequisiteObjectiveId),
    ["ate.cleyra-no-yummie-yummies", "ate.cleyra-there-a-mushroom"],
  );
  assert.ok(dependencies.every((dependency) => dependency.kind === "objective-access"));

  const chestObjective = objectiveById.get(chestObjectiveId);
  assert.ok(chestObjective);
  assert.equal(chestObjective.category, "exploration");
  assert.ok(chestObjective.chapterIds.includes("disc-2.cleyra"));
  for (const dependency of dependencies) {
    for (const sourceId of ["gamefaqs-cleyra-71891", "gamerguides-cleyra", "elitegrindlab-cleyra"]) {
      assert.ok(dependency.sourceIds.includes(sourceId), `${dependency.prerequisiteObjectiveId} is missing ${sourceId}`);
    }
    for (const sourceId of dependency.sourceIds) {
      assert.ok(sources.some((source) => source.id === sourceId), `unknown dependency source ${sourceId}`);
    }
  }

  const cleyraChapter = walkthroughChapters.find((chapter) => chapter.areaId === "disc-2.cleyra");
  const rubbishPitStep = cleyraChapter?.sections
    .flatMap((section) => section.steps)
    .find((step) => step.id === "cleyra-quina-rubbish-pit");
  assert.ok(rubbishPitStep);
  assert.ok(rubbishPitStep.objectiveIds.includes(chestObjectiveId));
  assert.match(rubbishPitStep.text, /No Yummy-Yummies! and There A Mushroom!/);
});
