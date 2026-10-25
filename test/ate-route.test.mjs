import assert from "node:assert/strict";
import test from "node:test";
import { achievementCatalogs } from "../src/data/achievements.ts";
import {
  activeTimeEvents,
  movieCriticEligibleEvents,
  movieCriticExclusiveGroupId,
  movieCriticTarget,
} from "../src/data/ates.ts";
import { objectives } from "../src/data/guide.ts";
import { guideChapterSequence, objectiveDependencies } from "../src/data/progression.ts";

const eventByObjective = new Map(activeTimeEvents.map((event) => [event.objectiveId, event]));
const objectiveById = new Map(objectives.map((objective) => [objective.id, objective]));
const chapterOrder = new Map(guideChapterSequence.map((chapterId, index) => [chapterId, index]));
const branchEvents = movieCriticEligibleEvents.filter((event) => event.exclusiveGroupId === movieCriticExclusiveGroupId);

test("each supported Movie Critic catalog has an ordered 79-view single-save route", () => {
  assert.equal(movieCriticEligibleEvents.length, 80);
  assert.equal(branchEvents.length, 2);
  assert.equal(objectiveDependencies.length, 28);

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
