import type { GoalProfile, PlatformChoice, RouteChoice } from "../data/guide.ts";

export const LIBRARY_SCHEMA_VERSION = 2;
export const STORAGE_KEY = "FFIX-Guide.progress";

export type ProgressMark = {
  complete: boolean;
  updatedAt: number;
  deviceId: string;
  revision: number;
};

export type PlaythroughProfile = {
  id: string;
  name: string;
  goal: GoalProfile;
  route: RouteChoice;
  platform: PlatformChoice;
  currentAreaId: string | null;
  playtimeSeconds: number | null;
  routeCheckpointTimes: Record<string, number>;
  marks: Record<string, ProgressMark>;
  createdAt: number;
  updatedAt: number;
};

export type ProgressLibrary = {
  schemaVersion: number;
  deviceId: string;
  profiles: PlaythroughProfile[];
  selectedProfileId: string;
};

export function newId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

export function createDefaultLibrary(now = Date.now()): ProgressLibrary {
  const deviceId = newId("device");
  const profile: PlaythroughProfile = {
    id: "profile.default",
    name: "First playthrough",
    goal: "comprehensive",
    route: "standard",
    platform: "unselected",
    currentAreaId: null,
    playtimeSeconds: null,
    routeCheckpointTimes: {},
    marks: {},
    createdAt: now,
    updatedAt: now,
  };
  return { schemaVersion: LIBRARY_SCHEMA_VERSION, deviceId, profiles: [profile], selectedProfileId: profile.id };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMark(value: unknown): ProgressMark | null {
  if (!isRecord(value) || typeof value.complete !== "boolean") return null;
  if (typeof value.updatedAt !== "number" || typeof value.deviceId !== "string") return null;
  return {
    complete: value.complete,
    updatedAt: value.updatedAt,
    deviceId: value.deviceId,
    revision: typeof value.revision === "number" ? value.revision : 0,
  };
}

export function normalizeLibrary(value: unknown): ProgressLibrary {
  const fallback = createDefaultLibrary();
  if (!isRecord(value) || !Array.isArray(value.profiles)) return fallback;
  const deviceId = typeof value.deviceId === "string" ? value.deviceId : fallback.deviceId;
  const profiles = value.profiles.filter(isRecord).flatMap((raw): PlaythroughProfile[] => {
    if (typeof raw.id !== "string" || typeof raw.name !== "string") return [];
    const marks = isRecord(raw.marks)
      ? Object.fromEntries(Object.entries(raw.marks).flatMap(([id, mark]) => {
          const normalized = normalizeMark(mark);
          return normalized ? [[id, normalized]] : [];
        }))
      : {};
    const goal = isGoal(raw.goal) ? raw.goal : "comprehensive";
    const route = isRoute(raw.route) ? raw.route : "standard";
    const platform = isPlatform(raw.platform) ? raw.platform : "unselected";
    const routeCheckpointTimes = isRecord(raw.routeCheckpointTimes)
      ? Object.fromEntries(Object.entries(raw.routeCheckpointTimes).flatMap(([id, seconds]) =>
          typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0
            ? [[id, Math.floor(seconds)]]
            : [],
        ))
      : {};
    const createdAt = typeof raw.createdAt === "number" ? raw.createdAt : Date.now();
    const updatedAt = typeof raw.updatedAt === "number" ? raw.updatedAt : createdAt;
    return [{
      id: raw.id,
      name: raw.name,
      goal,
      route,
      platform,
      currentAreaId: typeof raw.currentAreaId === "string" ? raw.currentAreaId : null,
      playtimeSeconds: typeof raw.playtimeSeconds === "number" ? raw.playtimeSeconds : null,
      routeCheckpointTimes,
      marks,
      createdAt,
      updatedAt,
    }];
  });
  if (profiles.length === 0) return fallback;
  const selectedProfileId = profiles.some((profile) => profile.id === value.selectedProfileId)
    ? String(value.selectedProfileId)
    : profiles[0].id;
  return { schemaVersion: LIBRARY_SCHEMA_VERSION, deviceId, profiles, selectedProfileId };
}

export function setMark(profile: PlaythroughProfile, objectiveId: string, complete: boolean, deviceId: string, now = Date.now()): PlaythroughProfile {
  const previous = profile.marks[objectiveId];
  return {
    ...profile,
    updatedAt: now,
    marks: {
      ...profile.marks,
      [objectiveId]: {
        complete,
        updatedAt: now,
        deviceId,
        revision: (previous?.revision ?? 0) + 1,
      },
    },
  };
}

export function mergeMarks(local: Record<string, ProgressMark>, cloud: Record<string, ProgressMark>) {
  const merged: Record<string, ProgressMark> = {};
  for (const id of new Set([...Object.keys(local), ...Object.keys(cloud)])) {
    const localMark = local[id];
    const cloudMark = cloud[id];
    if (!localMark) merged[id] = cloudMark;
    else if (!cloudMark) merged[id] = localMark;
    else merged[id] = compareMarkVersions(localMark, cloudMark) >= 0 ? localMark : cloudMark;
  }
  return merged;
}

function compareMarkVersions(a: ProgressMark, b: ProgressMark) {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
  if (a.deviceId !== b.deviceId) return a.deviceId.localeCompare(b.deviceId);
  return a.revision - b.revision;
}

export function toggleMark(profile: PlaythroughProfile, objectiveId: string, deviceId: string, now = Date.now()) {
  return setMark(profile, objectiveId, !profile.marks[objectiveId]?.complete, deviceId, now);
}

export function readLibrary(): ProgressLibrary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeLibrary(JSON.parse(raw)) : createDefaultLibrary();
  } catch {
    return createDefaultLibrary();
  }
}

export function isGoal(value: unknown): value is GoalProfile {
  return value === "comprehensive" || value === "achievements" || value === "excalibur-ii" || value === "perfect" || value === "custom";
}

export function isRoute(value: unknown): value is RouteChoice {
  return value === "standard" || value === "excalibur-ii" || value === "advanced-perfect";
}

export function isPlatform(value: unknown): value is PlatformChoice {
  return value === "unselected" || value === "ps1" || value === "steam" || value === "ps4" || value === "xbox" || value === "switch" || value === "ios" || value === "android" || value === "playstation" || value === "mobile";
}
