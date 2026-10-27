import assert from "node:assert/strict";
import test from "node:test";
import { achievementCatalogs } from "../src/data/achievements.ts";
import { missables, objectives, sources } from "../src/data/guide.ts";
import { gameRouteCutoffs } from "../src/data/progression.ts";
import { ragtimeMouseFinalRewardObjectiveId, ragtimeMouseQuestions, ragtimeQuestionSourceIds } from "../src/data/ragtimeMouse.ts";
import { walkthroughChapters } from "../src/data/walkthrough.ts";

const questionById = new Map(ragtimeMouseQuestions.map((question) => [question.id, question]));
const objectiveById = new Map(objectives.map((objective) => [objective.id, objective]));
const sourceIds = new Set(sources.map((source) => source.id));
const questionIds = new Set(ragtimeMouseQuestions.map((question) => question.objectiveId));

function chapterQuestionIds(chapterId) {
  return walkthroughChapters
    .filter((chapter) => chapter.areaId === chapterId)
    .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps.flatMap((step) => step.objectiveIds ?? [])))
    .filter((objectiveId) => questionIds.has(objectiveId));
}

test("Ragtime Mouse answer key has all 16 cross-checked facts and conservative stage windows", () => {
  const expectedAnswers = {
    "fifteenth-war-date": false,
    "chocobo-forest-location": true,
    "canary-playwright": false,
    "prima-vista-shipyard": false,
    "friendly-mus": true,
    "berkmea-cable-cars": true,
    "prima-vista-mist-power": true,
    "lindblum-castle-size": true,
    "lindblum-air-cabs": true,
    "fossil-roo-connection": false,
    "prima-vista-meaning": false,
    "bobo-bird-fortune": false,
    "world-deserts": false,
    "card-carta-membership": true,
    "conde-petie-residents": false,
    "defeat-ragtimer": true,
  };
  const expectedWindowIds = {
    "before-outer-continent": ["fifteenth-war-date", "chocobo-forest-location", "canary-playwright", "prima-vista-shipyard"],
    "outer-continent": ["friendly-mus", "berkmea-cable-cars", "prima-vista-mist-power", "lindblum-castle-size", "lindblum-air-cabs", "fossil-roo-connection"],
    "after-mount-gulug": ["prima-vista-meaning", "bobo-bird-fortune", "world-deserts", "card-carta-membership", "conde-petie-residents", "defeat-ragtimer"],
  };

  assert.equal(ragtimeMouseQuestions.length, 16);
  assert.equal(new Set(ragtimeMouseQuestions.map((question) => question.id)).size, 16);
  assert.equal(new Set(ragtimeMouseQuestions.map((question) => question.objectiveId)).size, 16);
  assert.equal(ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "before-outer-continent").length, 4);
  assert.equal(ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "outer-continent").length, 6);
  assert.equal(ragtimeMouseQuestions.filter((question) => question.conservativeWindow === "after-mount-gulug").length, 6);
  assert.ok(ragtimeQuestionSourceIds.includes("cour89-ragtime-quiz"), "the cross-platform Japanese guide is included in the answer-key sources");
  assert.deepEqual(Object.fromEntries(ragtimeMouseQuestions.map((question) => [question.id, question.answer])), expectedAnswers);
  for (const [window, expectedIds] of Object.entries(expectedWindowIds)) {
    const actualIds = ragtimeMouseQuestions.filter((question) => question.conservativeWindow === window).map((question) => question.id);
    assert.deepEqual(actualIds, expectedIds, `${window} question group changed`);
  }

  for (const question of ragtimeMouseQuestions) {
    assert.equal(typeof question.answer, "boolean", question.id);
    assert.ok(question.statement.length > 8, question.id);
    assert.ok(question.chapterIds.length > 0, question.id);
    assert.ok(ragtimeQuestionSourceIds.every((sourceId) => sourceIds.has(sourceId)), question.id);
    const objective = objectiveById.get(question.objectiveId);
    assert.ok(objective, `missing objective for ${question.id}`);
    assert.equal(objective.category, "side-content");
    assert.ok(ragtimeQuestionSourceIds.every((sourceId) => objective.sourceIds.includes(sourceId)), question.id);
  }

  assert.equal(questionById.get("defeat-ragtimer")?.answer, true, "the final defeat prompt is True");
});

test("early, Outer Continent, aerial, and final-preparation checklists share stable question IDs", () => {
  assert.equal(chapterQuestionIds("disc-1.ice-cavern").length, 4);
  assert.equal(chapterQuestionIds("disc-2.outer-continent").length, 10);
  assert.equal(chapterQuestionIds("disc-3.aerial-exploration").length, 16);
  assert.equal(chapterQuestionIds("disc-4.final-preparations").length, 16);

  for (const question of ragtimeMouseQuestions) {
    for (const chapterId of question.chapterIds) {
      assert.ok(chapterQuestionIds(chapterId).includes(question.objectiveId), `${question.id} is missing from ${chapterId}`);
    }
    const stepMatches = walkthroughChapters
      .filter((chapter) => question.chapterIds.includes(chapter.areaId))
      .flatMap((chapter) => chapter.sections.flatMap((section) => section.steps.filter((step) => step.objectiveIds?.includes(question.objectiveId))));
    assert.ok(stepMatches.length >= question.chapterIds.length, `${question.id} has a stable checklist pointer in each availability stage`);
    assert.ok(stepMatches.some((step) => step.detail?.includes(question.answer ? "TRUE" : "FALSE")), `${question.id} has its correct answer in the walkthrough`);
  }
});

test("all-correct achievement warning stays active through the final route cutoff", () => {
  const warning = missables.find((record) => record.id === "missable.disc-1.ice-cavern.ragtime-all-correct");
  assert.ok(warning);
  assert.equal(warning.objectiveId, ragtimeMouseFinalRewardObjectiveId);
  assert.ok(warning.classification.includes("permanently-missable"));
  assert.deepEqual(warning.warningChapterIds, ["disc-1.ice-cavern", "disc-2.outer-continent", "disc-3.aerial-exploration", "disc-4.final-preparations"]);
  assert.ok(warning.sourceIds.includes("gamerguides-ragtime-blues"));
  assert.ok(warning.sourceIds.includes("trueachievements-ragtime-mouse"));
  assert.ok(warning.note.includes("attacking Ragtime Mouse"), "the source conflict about hitting the Mouse remains recorded");

  for (const cutoffId of ["cutoff.ragtime-mouse.first-quiz-window", "cutoff.ragtime-mouse.before-final-battle"]) {
    const cutoff = gameRouteCutoffs.find((candidate) => candidate.id === cutoffId);
    assert.ok(cutoff, `missing route cutoff ${cutoffId}`);
    assert.ok(cutoff.missableIds.includes(warning.id));
  }
});

test("supported achievement catalogs link Beating the Ragtime Blues to every answer and final reward", () => {
  for (const [platform, records] of Object.entries(achievementCatalogs)) {
    const record = records.find((candidate) => candidate.id === "beating-the-ragtime-blues");
    assert.ok(record, `${platform} achievement catalog is missing Beating the Ragtime Blues`);
    assert.ok(ragtimeMouseQuestions.every((question) => record.guideObjectiveIds?.includes(question.objectiveId)), `${platform} mapping omits a quiz question`);
    assert.ok(record.guideObjectiveIds?.includes(ragtimeMouseFinalRewardObjectiveId));
    assert.ok(record.guideSourceIds?.includes("gamerguides-ragtime-blues"));
    assert.ok(record.guideSourceIds?.includes("cour89-ragtime-quiz"));
  }
});
