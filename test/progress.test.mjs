import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultLibrary, mergeMarks, normalizeLibrary, setMark, setWarningAcknowledgement } from "../src/domain/progress.ts";
import { formatClock, parseClock } from "../src/data/excalibur2.ts";

test("the initial profile has a stable ID independent of list position", () => {
  assert.equal(createDefaultLibrary(10).profiles[0].id, "profile.default");
});

test("normalization preserves valid marks and ignores malformed profiles", () => {
  const source = createDefaultLibrary(10);
  const profile = setMark(source.profiles[0], "story.alexandria.opening", true, source.deviceId, 11);
  const parsed = normalizeLibrary({ ...source, profiles: [profile, { id: "invalid" }] });
  assert.equal(parsed.profiles.length, 1);
  assert.equal(parsed.profiles[0].marks["story.alexandria.opening"].complete, true);
});

test("normalization preserves precise and legacy platform choices", () => {
  const source = createDefaultLibrary(10);
  const precise = { ...source.profiles[0], id: "profile.ps4", platform: "ps4" };
  const legacy = { ...source.profiles[0], id: "profile.legacy", platform: "playstation" };
  const parsed = normalizeLibrary({ ...source, profiles: [precise, legacy], selectedProfileId: precise.id });
  assert.equal(parsed.profiles[0].platform, "ps4");
  assert.equal(parsed.profiles[1].platform, "playstation");
});

test("a newer uncheck stays as a tombstone instead of resurrecting an old check", () => {
  const merged = mergeMarks(
    { "sidequest.mognet.delivery": { complete: false, updatedAt: 200, deviceId: "phone", revision: 2 } },
    { "sidequest.mognet.delivery": { complete: true, updatedAt: 100, deviceId: "laptop", revision: 1 } },
  );
  assert.equal(merged["sidequest.mognet.delivery"].complete, false);
});

test("equal timestamp merges resolve deterministically", () => {
  const a = { objective: { complete: true, updatedAt: 100, deviceId: "phone", revision: 2 } };
  const b = { objective: { complete: false, updatedAt: 100, deviceId: "laptop", revision: 2 } };
  assert.deepEqual(mergeMarks(a, b), mergeMarks(b, a));
});

test("legacy profiles migrate to checkpoint storage and valid split times survive backup restore", () => {
  const source = createDefaultLibrary(10);
  const legacyProfile = { ...source.profiles[0], routeCheckpointTimes: undefined, acknowledgedWarnings: undefined };
  const restored = normalizeLibrary({ ...source, schemaVersion: 1, profiles: [legacyProfile] });
  assert.deepEqual(restored.profiles[0].routeCheckpointTimes, {});
  assert.deepEqual(restored.profiles[0].acknowledgedWarnings, {});

  const withSplits = normalizeLibrary({
    ...source,
    profiles: [{
      ...source.profiles[0],
      routeCheckpointTimes: { "alexandria-steeple": 505, malformed: "later", negative: -2 },
    }],
  });
  assert.deepEqual(withSplits.profiles[0].routeCheckpointTimes, { "alexandria-steeple": 505 });
});

test("manual save clocks preserve seconds and reject malformed values", () => {
  assert.equal(formatClock(40_387), "11:13:07");
  assert.equal(parseClock("11:13:07"), 40_387);
  assert.equal(parseClock("12:00"), 43_200);
  assert.equal(parseClock("12:60:00"), undefined);
  assert.equal(parseClock(""), null);
});

test("warning acknowledgement is stored separately from objective completion", () => {
  const source = createDefaultLibrary(10);
  const profile = source.profiles[0];
  const acknowledged = setWarningAcknowledgement(profile, "missable.one-way-gate", true, source.deviceId, 12);
  assert.equal(acknowledged.acknowledgedWarnings["missable.one-way-gate"].complete, true);
  assert.equal(acknowledged.marks["missable.one-way-gate"], undefined);

  const restored = normalizeLibrary({ ...source, profiles: [acknowledged] });
  assert.equal(restored.profiles[0].acknowledgedWarnings["missable.one-way-gate"].complete, true);
  assert.deepEqual(restored.profiles[0].marks, {});
});
