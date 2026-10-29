import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  Check,
  ChevronDown,
  Clapperboard,
  CircleHelp,
  Compass,
  Database,
  ExternalLink,
  Menu,
  Map,
  Search,
  ShieldAlert,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { androidAchievements, iosAchievements, ps4Trophies, steamAchievements, xboxAchievements, type AchievementRecord } from "./data/achievements";
import {
  excalibur2Checkpoints,
  EXCALIBUR_II_CUTOFF_SECONDS,
  EXCALIBUR_II_SIGNIFICANT_DELAY_SECONDS,
  formatClock,
  parseClock,
} from "./data/excalibur2";
import { activeTimeEvents, movieCriticEligibleEvents, movieCriticTarget } from "./data/ates";
import { enemyCatalogCoverage, enemyEncounters, enemyRecords, type EnemyFact, type EnemyRecord } from "./data/enemies";
import { gameItems } from "./data/items";
import {
  ateObjectiveDependencies,
  gameRouteCoverage,
  gameRouteCutoffs,
  gameRouteEdges,
  guideChapterSequence,
  guideSequenceEdges,
  objectiveAccessDependencies,
  questPrerequisiteDependencies,
  storyPartySequences,
} from "./data/progression";
import {
  achievementSourceCounts,
  arcs,
  guideAreas,
  missables,
  objectives,
  referenceInventory,
  sideContentInventory,
  sources,
  type GuideArea,
  type GoalProfile,
  type MissableClassification,
  type MissableRecord,
  type PlatformChoice,
  type RouteChoice,
  type WalkthroughStepKind,
} from "./data/guide";
import { walkthroughChapters } from "./data/walkthrough";
import {
  normalizeLibrary,
  readLibrary,
  STORAGE_KEY,
  setMark,
  setWarningAcknowledgement,
  toggleMark,
  type PlaythroughProfile,
  type ProgressLibrary,
} from "./domain/progress";
import { unmetObjectivePrerequisites } from "./domain/progression";

type View = "overview" | "route" | "walkthrough" | "ates" | "missables" | "achievements" | "reference";

const navItems: { id: View; label: string; icon: typeof Compass }[] = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "route", label: "Route Map", icon: Map },
  { id: "walkthrough", label: "Walkthrough", icon: BookOpen },
  { id: "ates", label: "ATE Tracker", icon: Clapperboard },
  { id: "missables", label: "Missables", icon: ShieldAlert },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "reference", label: "Reference", icon: Database },
];

const goalLabels: Record<GoalProfile, string> = {
  comprehensive: "Comprehensive Playthrough",
  achievements: "100% Achievements",
  "excalibur-ii": "Excalibur II Run",
  perfect: "Advanced Perfect Game",
  custom: "Custom Completion",
};

const routeLabels: Record<RouteChoice, string> = {
  standard: "Standard route",
  "excalibur-ii": "Excalibur II route",
  "advanced-perfect": "Advanced perfect-game route",
};

const platformLabels: Record<PlatformChoice, string> = {
  unselected: "Choose platform",
  ps1: "Original PlayStation",
  steam: "Steam / PC",
  ps4: "PlayStation 4 (also playable on PS5)",
  xbox: "Xbox One / Series X|S / Windows app",
  switch: "Nintendo Switch",
  ios: "iOS / iPadOS",
  android: "Android",
  playstation: "Legacy PlayStation (version unspecified)",
  mobile: "Legacy mobile (store unspecified)",
};

const missableClassificationLabels: Record<MissableClassification, string> = {
  "permanently-missable": "Permanent on this save",
  "missable-opportunity": "One-time opportunity",
  "recoverable-later": "Recoverable later",
  "limited-quantity": "Limited quantity",
  "recommended-now": "Recommended now",
  "mutually-exclusive": "Exclusive outcome",
  "time-sensitive": "Timed",
  conditional: "Conditional",
  "version-dependent": "Version-dependent",
};

const walkthroughStepLabels: Record<WalkthroughStepKind, string> = {
  required: "Story",
  pickup: "Collect",
  optional: "Optional",
  cutoff: "Limited window",
  combat: "Battle",
  save: "Save / Mognet",
};

function walkthroughChapterContent(areaId: string) {
  return walkthroughChapters.find((chapter) => chapter.areaId === areaId);
}

function enemyChapterScope(areaId: string) {
  const area = guideAreas.find((chapter) => chapter.id === areaId);
  const arc = area ? arcs.find((entry) => entry.id === area.arcId) : undefined;
  return area ? `${arc?.label ?? "Story"} · ${area.title}` : areaId;
}

function walkthroughSearchText(areaId: string) {
  const content = walkthroughChapterContent(areaId);
  if (!content) return "";
  return [content.overview, ...content.sections.flatMap((section) => [
    section.title,
    section.summary ?? "",
    ...(section.preparationGuidance ? [
      section.preparationGuidance.levelRationale,
      section.preparationGuidance.difficultyAssessment ?? "",
      section.preparationGuidance.optionalGrinding,
      section.preparationGuidance.setupAdvice,
    ] : []),
    ...section.steps.flatMap((step) => [step.text, step.detail ?? ""]),
  ])].join(" ").toLowerCase();
}

function objectiveAppliesToProfile(objective: (typeof objectives)[number], profile: PlaythroughProfile) {
  const goalApplies = !objective.profileIds || objective.profileIds.includes(profile.goal);
  // Achievement platform tags constrain the achievement goal; they do not
  // remove otherwise valid game objectives from comprehensive/custom goals.
  const platformApplies = profile.goal !== "achievements"
    || !objective.achievementPlatforms
    || objective.achievementPlatforms.includes(profile.platform);
  return goalApplies && platformApplies;
}

function achievementGuideAreas(achievement: AchievementRecord) {
  const linkedChapterIds = [
    ...(achievement.guideChapterIds ?? []),
    ...(achievement.guideObjectiveIds ?? []).flatMap((objectiveId) => objectives.find((objective) => objective.id === objectiveId)?.chapterIds ?? []),
  ];
  return [...new Set(linkedChapterIds)]
    .map((chapterId) => guideAreas.find((area) => area.id === chapterId))
    .filter((area): area is GuideArea => Boolean(area));
}

function achievementGuideMissables(achievement: AchievementRecord) {
  const linkedObjectiveIds = new Set(achievement.guideObjectiveIds ?? []);
  return missables.filter((record) => linkedObjectiveIds.has(record.objectiveId));
}

const authoredChapterCount = walkthroughChapters.length;

function platformOptions(current: PlatformChoice) {
  return Object.entries(platformLabels).filter(([value]) =>
    (value !== "playstation" && value !== "mobile") || value === current,
  );
}

function missableAppliesToProfile(record: (typeof missables)[number], profile: PlaythroughProfile) {
  const objective = objectives.find((item) => item.id === record.objectiveId);
  const objectiveApplies = !objective || objectiveAppliesToProfile(objective, profile);
  const routeApplies = !record.routeChoices || record.routeChoices.includes(profile.route);
  return objectiveApplies && routeApplies;
}

function objectiveIsComplete(profile: PlaythroughProfile, objectiveId: string) {
  if (profile.marks[objectiveId]?.complete === true) return true;
  const groupedEvents = activeTimeEvents.filter((event) => event.groupObjectiveId === objectiveId);
  return groupedEvents.length > 0 && ateGroupIsComplete(profile, objectiveId);
}

function ateGroupIsComplete(profile: PlaythroughProfile, objectiveId: string) {
  const groupedEvents = activeTimeEvents.filter((event) => event.groupObjectiveId === objectiveId);
  if (groupedEvents.length === 0) return false;
  const checkedExclusiveGroups = new Set<string>();
  return groupedEvents.every((event) => {
    if (!event.exclusiveGroupId) return profile.marks[event.objectiveId]?.complete === true;
    if (checkedExclusiveGroups.has(event.exclusiveGroupId)) return true;
    checkedExclusiveGroups.add(event.exclusiveGroupId);
    return groupedEvents.some((candidate) => candidate.exclusiveGroupId === event.exclusiveGroupId && profile.marks[candidate.objectiveId]?.complete === true);
  });
}

function missableProgressState(record: (typeof missables)[number], profile: PlaythroughProfile) {
  if (!missableAppliesToProfile(record, profile)) return "excluded" as const;
  if (objectiveIsComplete(profile, record.objectiveId)) return "complete" as const;
  const currentIndex = guideChapterSequence.indexOf(profile.currentAreaId ?? "");
  if (currentIndex < 0 || !record.warningChapterIds?.length) return "unplaced" as const;
  const warningIndexes = record.warningChapterIds
    .map((chapterId) => guideChapterSequence.indexOf(chapterId))
    .filter((index) => index >= 0);
  if (warningIndexes.length === 0) return "unplaced" as const;
  const firstWarningIndex = Math.min(...warningIndexes);
  const lastWarningIndex = Math.max(...warningIndexes);
  if (currentIndex < firstWarningIndex) return "available-later" as const;
  if (currentIndex > lastWarningIndex) {
    return record.classification.includes("recoverable-later") ? "recoverable" as const : "missed" as const;
  }
  return "actionable" as const;
}

function applicableMissables(profile: PlaythroughProfile) {
  return missables.filter((record) => missableAppliesToProfile(record, profile));
}

function pendingMissables(profile: PlaythroughProfile) {
  return applicableMissables(profile).filter((record) => missableProgressState(record, profile) !== "complete");
}

function warningIsAcknowledged(record: MissableRecord, profile: PlaythroughProfile) {
  return profile.acknowledgedWarnings[record.id]?.complete === true;
}

function readView(): View {
  const value = window.location.hash.replace(/^#\/?/, "");
  return navItems.some((item) => item.id === value) ? (value as View) : "overview";
}

function makeProfile(name: string, now = Date.now()): PlaythroughProfile {
  const normalizedName = name.trim();
  const id = `profile.${normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${now.toString(36)}`;
  return {
    id,
    name: normalizedName || "New playthrough",
    goal: "comprehensive",
    route: "standard",
    platform: "unselected",
    currentAreaId: null,
    playtimeSeconds: null,
    routeCheckpointTimes: {},
    acknowledgedWarnings: {},
    marks: {},
    createdAt: now,
    updatedAt: now,
  };
}

function App() {
  const [library, setLibrary] = useState<ProgressLibrary>(() => readLibrary());
  const [view, setView] = useState<View>(() => readView());
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingGateReview, setPendingGateReview] = useState<{ profileId: string; targetAreaId: string; records: MissableRecord[] } | null>(null);
  const [pendingAteChoice, setPendingAteChoice] = useState<{ groupObjectiveId: string; events: typeof activeTimeEvents } | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const activeProfile = library.profiles.find((profile) => profile.id === library.selectedProfileId) ?? library.profiles[0];
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    const matches = [
      ...guideAreas.map((item) => ({ label: item.title, context: "Walkthrough chapter", view: "walkthrough" as View })),
      ...walkthroughChapters.flatMap((chapter) => chapter.sections.flatMap((section) => section.steps.map((step) => ({ label: step.text, context: section.title, view: "walkthrough" as View })))),
      ...missables.map((item) => ({ label: item.title, context: "Missables", view: "missables" as View })),
      ...sideContentInventory.map((label) => ({ label, context: "Side content", view: "reference" as View })),
      ...referenceInventory.map((label) => ({ label, context: "Reference database", view: "reference" as View })),
      ...navItems.map((item) => ({ label: item.label, context: "Guide section", view: item.id })),
    ];
    return matches.filter((item) => item.label.toLowerCase().includes(query)).slice(0, 7);
  }, [search]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch {
      // Keep the guide usable if browser storage is unavailable; export remains available.
    }
  }, [library]);

  useEffect(() => {
    const handleHash = () => setView(readView());
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    setMobileNavOpen(false);
    setSearchOpen(false);
    if (window.location.hash !== `#${nextView}`) window.location.hash = nextView;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openChapter = (chapterId: string) => {
    const area = guideAreas.find((item) => item.id === chapterId);
    if (!area) return;
    setSearch(area.title);
    navigate("walkthrough");
  };

  const updateProfile = (updates: Partial<PlaythroughProfile>) => {
    setLibrary((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === activeProfile.id
        ? { ...profile, ...updates, updatedAt: Date.now() }
        : profile),
    }));
  };

  const updateGoal = (goal: GoalProfile) => {
    const route: RouteChoice = goal === "excalibur-ii" ? "excalibur-ii" : goal === "perfect" ? "advanced-perfect" : "standard";
    updateProfile({ goal, route });
  };

  const requestCurrentAreaChange = (targetAreaId: string | null) => {
    const currentAreaId = activeProfile.currentAreaId;
    if (!targetAreaId || !currentAreaId) {
      updateProfile({ currentAreaId: targetAreaId });
      return;
    }
    const currentIndex = guideChapterSequence.indexOf(currentAreaId);
    const targetIndex = guideChapterSequence.indexOf(targetAreaId);
    if (targetIndex <= currentIndex || currentIndex < 0 || targetIndex < 0) {
      updateProfile({ currentAreaId: targetAreaId });
      return;
    }
    const gateRecords = applicableMissables(activeProfile).filter((record) => {
      if (record.severity === "info" || activeProfile.marks[record.objectiveId]?.complete === true || warningIsAcknowledged(record, activeProfile)) return false;
      const hasCutoffClassification = record.classification.some((classification) =>
        classification === "permanently-missable"
        || classification === "missable-opportunity"
        || classification === "limited-quantity"
        || classification === "mutually-exclusive"
        || classification === "time-sensitive",
      );
      if (!hasCutoffClassification || !record.warningChapterIds?.length) return false;
      const warningIndexes = record.warningChapterIds.map((chapterId) => guideChapterSequence.indexOf(chapterId)).filter((index) => index >= 0);
      if (warningIndexes.length === 0) return false;
      const finalWarningIndex = Math.max(...warningIndexes);
      return finalWarningIndex >= currentIndex && finalWarningIndex < targetIndex;
    });
    if (gateRecords.length > 0) setPendingGateReview({ profileId: activeProfile.id, targetAreaId, records: gateRecords });
    else updateProfile({ currentAreaId: targetAreaId });
  };

  const acknowledgeWarning = (warningId: string) => {
    setLibrary((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => profile.id === activeProfile.id
        ? setWarningAcknowledgement(profile, warningId, !profile.acknowledgedWarnings[warningId]?.complete, current.deviceId)
        : profile),
    }));
  };

  const acknowledgeGateAndContinue = () => {
    if (!pendingGateReview) return;
    const { profileId, targetAreaId, records } = pendingGateReview;
    const now = Date.now();
    setLibrary((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => {
        if (profile.id !== profileId) return profile;
        const nextProfile = records.reduce(
          (next, record) => setWarningAcknowledgement(next, record.id, true, current.deviceId, now),
          profile,
        );
        return { ...nextProfile, currentAreaId: targetAreaId, updatedAt: now };
      }),
    }));
    setPendingGateReview(null);
  };

  const addProfile = () => {
    const nextProfile = makeProfile(profileName);
    if (!nextProfile.name.trim()) return;
    setLibrary((current) => ({
      ...current,
      profiles: [...current.profiles, nextProfile],
      selectedProfileId: nextProfile.id,
    }));
    setProfileName("");
    setProfileMessage(`Created “${nextProfile.name}”.`);
  };

  const toggleObjective = (id: string) => {
    const groupedEvents = activeTimeEvents.filter((event) => event.groupObjectiveId === id);
    const event = activeTimeEvents.find((item) => item.objectiveId === id);
    if (groupedEvents.length > 0 && !objectiveIsComplete(activeProfile, id)) {
      const choiceEvents = groupedEvents.filter((candidate) => candidate.exclusiveGroupId);
      const selectedChoice = choiceEvents.find((candidate) => activeProfile.marks[candidate.objectiveId]?.complete === true);
      if (choiceEvents.length > 0 && !selectedChoice) {
        setPendingAteChoice({ groupObjectiveId: id, events: choiceEvents });
        return;
      }
    }
    setLibrary((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => {
        if (profile.id !== activeProfile.id) return profile;
        const now = Date.now();
        if (groupedEvents.length > 0) {
          const complete = !objectiveIsComplete(profile, id);
          const selectedChoice = groupedEvents.find((candidate) => candidate.exclusiveGroupId && profile.marks[candidate.objectiveId]?.complete === true);
          const nextProfile = groupedEvents.reduce((next, groupedEvent) => {
            const eventComplete = groupedEvent.exclusiveGroupId
              ? complete && groupedEvent.objectiveId === selectedChoice?.objectiveId
              : complete;
            return setMark(next, groupedEvent.objectiveId, eventComplete, current.deviceId, now);
          }, profile);
          return setMark(nextProfile, id, complete, current.deviceId, now);
        }
        if (event) {
          const complete = !profile.marks[id]?.complete;
          let nextProfile = profile;
          if (complete && event.exclusiveGroupId) {
            nextProfile = activeTimeEvents
              .filter((candidate) => candidate.exclusiveGroupId === event.exclusiveGroupId && candidate.objectiveId !== id)
              .reduce((next, sibling) => setMark(next, sibling.objectiveId, false, current.deviceId, now), nextProfile);
          }
          nextProfile = setMark(nextProfile, id, complete, current.deviceId, now);
          const allGroupEventsComplete = ateGroupIsComplete(nextProfile, event.groupObjectiveId);
          return setMark(nextProfile, event.groupObjectiveId, allGroupEventsComplete, current.deviceId, now);
        }
        return toggleMark(profile, id, current.deviceId, now);
      }),
    }));
  };

  const completeAteGroup = (groupObjectiveId: string, selectedBranchObjectiveId: string) => {
    const groupEvents = activeTimeEvents.filter((event) => event.groupObjectiveId === groupObjectiveId);
    const branchGroupId = groupEvents.find((event) => event.objectiveId === selectedBranchObjectiveId)?.exclusiveGroupId;
    if (!branchGroupId) return;
    setLibrary((current) => ({
      ...current,
      profiles: current.profiles.map((profile) => {
        if (profile.id !== activeProfile.id) return profile;
        const now = Date.now();
        const nextProfile = groupEvents.reduce((next, event) => {
          const complete = event.exclusiveGroupId === branchGroupId
            ? event.objectiveId === selectedBranchObjectiveId
            : true;
          return setMark(next, event.objectiveId, complete, current.deviceId, now);
        }, profile);
        return setMark(nextProfile, groupObjectiveId, true, current.deviceId, now);
      }),
    }));
    setPendingAteChoice(null);
  };

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "FFIX-Guide-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setProfileMessage("Progress backup downloaded.");
  };

  const importProgress = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = normalizeLibrary(parsed);
      if (!restored.profiles.length) throw new Error("The backup contains no playthrough profiles.");
      setLibrary(restored);
      setProfileMessage(`Restored ${restored.profiles.length} playthrough profile${restored.profiles.length === 1 ? "" : "s"}.`);
    } catch {
      setProfileMessage("That file could not be read as an FFIX Guide backup.");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeView={view}
        mobileOpen={mobileNavOpen}
        onNavigate={navigate}
        onClose={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="breadcrumb"><span>FFIX GUIDE</span><span className="slash">/</span><strong>{navItems.find((item) => item.id === view)?.label}</strong></div>
          <div className="topbar-tools">
            <div className="search-wrap">
              <label className="searchbox">
                <Search size={16} aria-hidden="true" />
                <input ref={searchInput} value={search} onFocus={() => setSearchOpen(true)} onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }} placeholder="Search this guide" aria-label="Search this guide" aria-controls="guide-search-results" aria-expanded={searchOpen && search.length > 0} />
                <kbd>⌘ K</kbd>
              </label>
              {searchOpen && search.trim() && <div className="search-results" id="guide-search-results" role="listbox" aria-label="Guide search results">
                {searchResults.length > 0 ? searchResults.map((result, index) => <button key={`${result.view}.${result.label}.${index}`} role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => { navigate(result.view); setSearch(result.view === "walkthrough" ? search : ""); }}><strong>{result.label}</strong><span>{result.context}</span></button>) : <p>No matching guide records yet.</p>}
              </div>}
            </div>
            <label className="profile-select-label">
              <span className="sr-only">Active playthrough profile</span>
              <select
                value={activeProfile.id}
                onChange={(event) => setLibrary((current) => ({ ...current, selectedProfileId: event.target.value }))}
              >
                {library.profiles.map((profile) => <option value={profile.id} key={profile.id}>{profile.name}</option>)}
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
          </div>
        </header>

        <main id="main-content" className="content-area">
          {view === "overview" && <Overview
            profile={activeProfile}
            profileCount={library.profiles.length}
            profiles={library.profiles}
            activeProfileId={activeProfile.id}
            profileName={profileName}
            profileMessage={profileMessage}
            onNameChange={setProfileName}
            onProfileChange={(selectedProfileId) => setLibrary((current) => ({ ...current, selectedProfileId }))}
            onAddProfile={addProfile}
            onGoalChange={updateGoal}
            onRouteChange={(route) => updateProfile({ route })}
            onPlatformChange={(platform) => updateProfile({ platform })}
            onCurrentAreaChange={requestCurrentAreaChange}
            onAcknowledgeWarning={acknowledgeWarning}
            onPlaytimeChange={(playtimeSeconds) => updateProfile({ playtimeSeconds })}
            onRecordRouteCheckpoint={(checkpointId, seconds) => updateProfile({
              routeCheckpointTimes: { ...activeProfile.routeCheckpointTimes, [checkpointId]: seconds },
            })}
            onNavigate={navigate}
            onToggle={toggleObjective}
            onExport={exportProgress}
            onImport={() => importInput.current?.click()}
          />}
          {view === "route" && <RouteMap profile={activeProfile} onOpenChapter={openChapter} onSetCurrentArea={requestCurrentAreaChange} />}
          {view === "walkthrough" && <Walkthrough profile={activeProfile} search={search} onClearSearch={() => setSearch("")} onNavigate={navigate} onToggleObjective={toggleObjective} onSetCurrentArea={requestCurrentAreaChange} onAcknowledgeWarning={acknowledgeWarning} />}
          {view === "ates" && <AteTracker profile={activeProfile} onToggle={toggleObjective} onOpenChapter={openChapter} />}
          {view === "missables" && <Missables profile={activeProfile} onToggle={toggleObjective} onAcknowledgeWarning={acknowledgeWarning} />}
          {view === "achievements" && <Achievements profile={activeProfile} platform={activeProfile.platform} onPlatformChange={(platform) => updateProfile({ platform })} onToggle={toggleObjective} onOpenChapter={openChapter} onOpenAteTracker={() => navigate("ates")} />}
          {view === "reference" && <Reference
            profile={activeProfile}
            profileCount={library.profiles.length}
            profileMessage={profileMessage}
            onExport={exportProgress}
            onImport={() => importInput.current?.click()}
            onToggleObjective={toggleObjective}
            onOpenChapter={openChapter}
            onNavigate={navigate}
          />}
        </main>
      </div>
      {pendingGateReview && <GateReviewDialog
        targetAreaId={pendingGateReview.targetAreaId}
        records={pendingGateReview.records}
        onCancel={() => setPendingGateReview(null)}
        onAcknowledgeAndContinue={acknowledgeGateAndContinue}
      />}
      {pendingAteChoice && <AteBranchChoiceDialog
        key={pendingAteChoice.groupObjectiveId}
        events={pendingAteChoice.events}
        onCancel={() => setPendingAteChoice(null)}
        onConfirm={(objectiveId) => completeAteGroup(pendingAteChoice.groupObjectiveId, objectiveId)}
      />}
      <input ref={importInput} className="sr-only" type="file" accept="application/json,.json" aria-label="Restore progress backup" onChange={importProgress} />
    </div>
  );
}

function GateReviewDialog({ targetAreaId, records, onCancel, onAcknowledgeAndContinue }: {
  targetAreaId: string;
  records: MissableRecord[];
  onCancel: () => void;
  onAcknowledgeAndContinue: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const targetArea = guideAreas.find((area) => area.id === targetAreaId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    stayButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return <dialog
    ref={dialogRef}
    className="gate-review-dialog"
    aria-labelledby="gate-review-title"
    aria-describedby="gate-review-description"
    onCancel={(event) => { event.preventDefault(); onCancel(); }}
  >
    <div className="gate-review-heading"><span className="gate-review-icon"><AlertTriangle size={18} aria-hidden="true" /></span><div><span className="eyebrow">ONE-WAY GATE REVIEW</span><h2 id="gate-review-title">Review cutoff warnings before moving on</h2></div></div>
    <p id="gate-review-description">Moving your current area to <strong>{targetArea?.title ?? "the selected chapter"}</strong> passes one or more open warning windows. Acknowledging them records that you reviewed the route; it does not mark their objectives complete.</p>
    <ul className="gate-warning-list">{records.map((record) => <li key={record.id}><strong>{record.title}</strong><span>{record.deadline} {record.action}</span></li>)}</ul>
    <div className="gate-review-actions"><button ref={stayButtonRef} className="secondary-button" type="button" onClick={onCancel}>Stay in current area</button><button className="record-checkpoint-button" type="button" onClick={onAcknowledgeAndContinue}>Acknowledge warnings and continue</button></div>
  </dialog>;
}

function AteBranchChoiceDialog({ events, onCancel, onConfirm }: {
  events: typeof activeTimeEvents;
  onCancel: () => void;
  onConfirm: (objectiveId: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedId, setSelectedId] = useState(events[0]?.objectiveId ?? "");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    confirmButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return <dialog ref={dialogRef} className="gate-review-dialog" aria-labelledby="ate-choice-title" aria-describedby="ate-choice-description" onCancel={(event) => { event.preventDefault(); onCancel(); }}>
    <div className="gate-review-heading"><span className="gate-review-icon"><Clapperboard size={18} aria-hidden="true" /></span><div><span className="eyebrow">ONE SAVE · ONE BRANCH</span><h2 id="ate-choice-title">Which Treno ATE did you view?</h2></div></div>
    <p id="ate-choice-description">Vivi's Treno decision produces one of two scenes. Choose the scene on this save so the chapter checklist can track the 79-event Movie Critic route without counting both alternatives.</p>
    <fieldset className="ate-choice-options"><legend>Recorded scene</legend>{events.map((event) => <label key={event.objectiveId}><input type="radio" name="ate-choice" value={event.objectiveId} checked={selectedId === event.objectiveId} onChange={() => setSelectedId(event.objectiveId)} /><span><strong>{event.title}</strong><small>{event.trigger}</small></span></label>)}</fieldset>
    <div className="gate-review-actions"><button className="secondary-button" type="button" onClick={onCancel}>Cancel</button><button ref={confirmButtonRef} className="record-checkpoint-button" type="button" disabled={!selectedId} onClick={() => onConfirm(selectedId)}>Record branch and complete checklist</button></div>
  </dialog>;
}

function Sidebar({
  activeView,
  mobileOpen,
  onNavigate,
  onClose,
}: {
  activeView: View;
  mobileOpen: boolean;
  onNavigate: (view: View) => void;
  onClose: () => void;
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
      <div className="brand-lockup">
        <div className="brand-crest" aria-hidden="true"><span>IX</span><i /></div>
        <div><strong>FFIX</strong><span>FIELD GUIDE</span></div>
      </div>
      <div className="nav-kicker">YOUR JOURNEY</div>
      <nav className="primary-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-link ${activeView === id ? "is-active" : ""}`} aria-current={activeView === id ? "page" : undefined} onClick={() => onNavigate(id)}>
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
            {id === "missables" && <span className="nav-count" aria-label={`${missables.length} researched records`}>{missables.length}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="sidebar-note-icon"><Sparkles size={15} /></span>
          <div><strong>Built for careful runs</strong><p>Source-linked content with research status shown.</p></div>
        </div>
      <div className="sidebar-version"><span className="status-dot" /> Phase 3 · Completion systems</div>
      </div>
      <button className="mobile-close" aria-label="Close navigation" onClick={onClose}><X size={18} /></button>
    </aside>
  );
}

function Overview({
  profile,
  profileCount,
  profiles,
  activeProfileId,
  profileName,
  profileMessage,
  onNameChange,
  onProfileChange,
  onAddProfile,
  onGoalChange,
  onRouteChange,
  onPlatformChange,
  onCurrentAreaChange,
  onAcknowledgeWarning,
  onPlaytimeChange,
  onRecordRouteCheckpoint,
  onNavigate,
  onToggle,
  onExport,
  onImport,
}: {
  profile: PlaythroughProfile;
  profileCount: number;
  profiles: PlaythroughProfile[];
  activeProfileId: string;
  profileName: string;
  profileMessage: string;
  onNameChange: (value: string) => void;
  onProfileChange: (id: string) => void;
  onAddProfile: () => void;
  onGoalChange: (goal: GoalProfile) => void;
  onRouteChange: (route: RouteChoice) => void;
  onPlatformChange: (platform: PlatformChoice) => void;
  onCurrentAreaChange: (areaId: string | null) => void;
  onAcknowledgeWarning: (warningId: string) => void;
  onPlaytimeChange: (seconds: number | null) => void;
  onRecordRouteCheckpoint: (checkpointId: string, seconds: number) => void;
  onNavigate: (view: View) => void;
  onToggle: (id: string) => void;
  onExport: () => void;
  onImport: () => void;
}) {
  const pendingMissableRecords = pendingMissables(profile);
  const unacknowledgedMissables = pendingMissableRecords.filter((record) => !warningIsAcknowledged(record, profile));
  const warningCandidates = unacknowledgedMissables.length > 0 ? unacknowledgedMissables : pendingMissableRecords;
  const warningOrder = ["actionable", "available-later", "unplaced", "recoverable", "missed"] as const;
  const nextMissable = warningOrder.flatMap((state) => warningCandidates.filter((record) => missableProgressState(record, profile) === state))[0];
  const nextMissableAcknowledged = nextMissable ? warningIsAcknowledged(nextMissable, profile) : false;
  const nextMissableState = nextMissable ? missableProgressState(nextMissable, profile) : null;
  const [clockInput, setClockInput] = useState(profile.playtimeSeconds === null ? "" : formatClock(profile.playtimeSeconds));

  useEffect(() => {
    setClockInput(profile.playtimeSeconds === null ? "" : formatClock(profile.playtimeSeconds));
  }, [profile.playtimeSeconds]);
  return (
    <>
      <div className="page-heading page-heading-spread">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> PLAYTHROUGH SETUP</div>
          <h1>Your journey</h1>
          <p className="page-lead">Choose a goal and version, then update your current area. The guide will show the cutoffs that still lie ahead.</p>
        </div>
        <div className="overview-profile-tools">
          <label className="overview-profile-select"><span className="label-muted">ACTIVE PROFILE</span><select value={activeProfileId} onChange={(event) => onProfileChange(event.target.value)}>{profiles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
          <div className="local-state"><span className="local-state-dot" /> Saved on this device</div>
        </div>
      </div>

      <section className="setup-band" aria-labelledby="setup-title">
        <div className="setup-copy">
          <div className="setup-index">01 / RUN PROFILE</div>
          <h2 id="setup-title">Set the rules for this save.</h2>
          <p>Completion goals and route constraints stay with each playthrough profile.</p>
        </div>
        <div className="setup-controls">
          <label className="field-label" htmlFor="goal-profile">Completion goal</label>
          <select id="goal-profile" value={profile.goal} onChange={(event) => onGoalChange(event.target.value as GoalProfile)}>
            {Object.entries(goalLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label className="field-label" htmlFor="route-choice">Route</label>
          <select id="route-choice" value={profile.route} onChange={(event) => onRouteChange(event.target.value as RouteChoice)}>
            {Object.entries(routeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <label className="field-label" htmlFor="platform-choice">Game version</label>
          <select id="platform-choice" value={profile.platform} onChange={(event) => onPlatformChange(event.target.value as PlatformChoice)}>
            {platformOptions(profile.platform).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </section>

      <div className="overview-grid">
        <section className="work-panel current-run" aria-labelledby="run-heading">
          <div className="section-topline">
            <div><div className="eyebrow">ACTIVE SAVE</div><h2 id="run-heading">{profile.name}</h2></div>
            <span className="tag tag-quiet">{goalLabels[profile.goal]}</span>
          </div>
          <div className="run-illustration" aria-hidden="true">
            <svg viewBox="0 0 600 170" role="presentation" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#213444"/><stop offset="1" stopColor="#476b72"/></linearGradient>
                <linearGradient id="water" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#557b79"/><stop offset="1" stopColor="#142a37"/></linearGradient>
              </defs>
              <rect width="600" height="170" fill="url(#sky)" />
              <circle cx="456" cy="38" r="20" fill="#e1c891" opacity=".9" />
              <path d="M0 104 80 77l55 21 66-47 69 38 50-24 64 38 70-32 65 33 81-29v45H0Z" fill="#324e54" />
              <path d="M0 116 74 101l73 14 80-33 56 24 88-21 63 26 74-26 92 19v66H0Z" fill="#223c47" />
              <rect y="126" width="600" height="44" fill="url(#water)" />
              <path d="m0 139 88-6 74 7 72-9 70 8 89-8 82 9 125-7" fill="none" stroke="#a7b8a3" strokeOpacity=".38" strokeWidth="1" />
              <path d="m275 97 37-23 37 23-10 5h-55Z" fill="#d9ccaa" />
              <path d="M292 74h35l-15-19Z" fill="#e6dab9" />
              <path d="M306 53v43" stroke="#243640" strokeWidth="2" />
              <path d="m298 74-23 20h23Z" fill="#738b82" />
              <path d="M300 102h29l-8 13h-20Z" fill="#192c37" />
              <path d="M312 115v18" stroke="#ccb98d" strokeWidth="1" opacity=".7" />
              <g fill="#f0dfb1" opacity=".8"><circle cx="61" cy="40" r="1.2"/><circle cx="108" cy="28" r="1"/><circle cx="197" cy="44" r="1.2"/><circle cx="367" cy="31" r="1"/><circle cx="534" cy="68" r="1.2"/><circle cx="565" cy="25" r="1"/></g>
            </svg>
            <div className="art-caption"><span>FIELD NOTE 001</span><strong>Alexandria at dusk</strong></div>
          </div>
          <div className="run-footer">
            <label className="current-area-field" htmlFor="current-area"><span className="label-muted">CURRENT AREA</span><select id="current-area" value={profile.currentAreaId ?? ""} onChange={(event) => onCurrentAreaChange(event.target.value || null)}><option value="">Not started</option>{arcs.map((arc) => <optgroup label={arc.label} key={arc.id}>{arc.areas.map((area) => <option value={`${arc.id}.${area.id}`} key={area.id}>{area.title}</option>)}</optgroup>)}</select></label>
          <div className="clock-field"><label className="label-muted" htmlFor="playtime-clock">GAME CLOCK {profile.route !== "standard" && <span>(MANUAL)</span>}</label>{profile.route !== "standard"
              ? <input id="playtime-clock" value={clockInput} onChange={(event) => setClockInput(event.target.value)} onBlur={() => {
                  const seconds = parseClock(clockInput);
                  if (seconds === undefined) setClockInput(profile.playtimeSeconds === null ? "" : formatClock(profile.playtimeSeconds));
                  else onPlaytimeChange(seconds);
                }} placeholder="HH:MM:SS" inputMode="numeric" aria-describedby="playtime-note" />
              : <strong>Not tracked</strong>}</div>
            <button className="text-action" onClick={() => onNavigate("walkthrough")}>Open walkthrough <span aria-hidden="true">↗</span></button>
          </div>
          {profile.route !== "standard" && <span id="playtime-note" className="manual-clock-note">Enter the save-file clock; this guide cannot read the game.</span>}
          {profile.route === "excalibur-ii" && <ExcaliburTimer profile={profile} onRecordCheckpoint={onRecordRouteCheckpoint} />}
        </section>

        <aside className={`risk-panel ${nextMissable?.severity === "critical" && nextMissableState === "actionable" ? "risk-active" : ""}`} aria-labelledby="risk-heading">
          <div className="risk-header"><span className="risk-icon"><AlertTriangle size={17} /></span><span className="eyebrow">{!nextMissable ? "PROFILE CHECK" : nextMissableAcknowledged ? "ACKNOWLEDGED · STILL UNMARKED" : nextMissableState === "missed" ? "UNMARKED PAST CUTOFF" : nextMissableState === "recoverable" ? "RECOVERABLE LATER" : nextMissableState === "unplaced" ? "WARNING TIMING NEEDS RESEARCH" : nextMissableState === "actionable" ? "CURRENT WARNING WINDOW" : profile.currentAreaId === null ? "SET CURRENT AREA" : "UPCOMING WINDOW"}</span></div>
          <h2 id="risk-heading">{nextMissable?.title ?? "No unmarked missable objective."}</h2>
          <p>{nextMissable
            ? nextMissableAcknowledged
              ? "You acknowledged this warning, but the objective is still unmarked. Acknowledgement does not count as completion; review the recovery details or mark the objective complete."
              : profile.currentAreaId === null
                ? `Set your current story area to place this warning. ${nextMissable.deadline} ${nextMissable.action}`
                : nextMissableState === "unplaced"
                  ? "This warning is not linked to a cutoff chapter yet. Review its details and the walkthrough before relying on route timing."
                  : `${nextMissable.deadline} ${nextMissable.action}`
            : "Every applicable missable objective is marked complete. The content inventory is still being expanded."}</p>
          {nextMissable && <div className="risk-actions">
            <button className="acknowledge-warning-button" type="button" aria-pressed={nextMissableAcknowledged} onClick={() => onAcknowledgeWarning(nextMissable.id)}>{nextMissableAcknowledged ? "Clear acknowledgement" : "Acknowledge warning"}</button>
            <label className="objective-check">
            <input type="checkbox" checked={objectiveIsComplete(profile, nextMissable.objectiveId)} onChange={() => onToggle(nextMissable.objectiveId)} />
            <span className="custom-check" aria-hidden="true"><Check size={13} /></span>
            <span>Mark this objective complete</span>
            </label>
          </div>}
          <button className="risk-link" onClick={() => onNavigate("missables")}>Review {pendingMissableRecords.length} applicable missable objective{pendingMissableRecords.length === 1 ? "" : "s"} <span aria-hidden="true">→</span></button>
        </aside>
      </div>

      <section className="coverage-section" aria-labelledby="coverage-title">
        <div className="section-heading-row">
          <div><div className="eyebrow">CONTENT STATUS</div><h2 id="coverage-title">Guide coverage</h2></div>
          <span className="coverage-hint">Coverage describes the guide, not your in-game completion.</span>
        </div>
        <div className="coverage-list">
          {[
            { label: "Main story walkthrough", sub: `${authoredChapterCount} chapters have partial source-linked instructions; route, optional-content, and version verification remain in progress.`, status: `${authoredChapterCount} / ${guideAreas.length} partial`, view: "walkthrough" as View },
          { label: "Missable registry", sub: `${missables.length} source-linked records span all four discs; item-level recovery paths and remaining content classes are still under review.`, status: "Partial research", view: "missables" as View },
            { label: "Achievements", sub: "Steam, PS4, and Xbox criteria have walkthrough pointers; trigger and missability verification remain in progress.", status: "Three catalogs · partial", view: "achievements" as View },
          ].map((item) => (
            <button className="coverage-row" key={item.label} onClick={() => onNavigate(item.view)}>
              <span className="coverage-mark"><span /></span>
              <span className="coverage-copy"><strong>{item.label}</strong><small>{item.sub}</small></span>
              <span className="coverage-status">{item.status}</span>
              <span className="coverage-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="profile-tools" aria-labelledby="profiles-title">
        <div className="profile-tools-copy"><div className="eyebrow">LOCAL PROFILES</div><h2 id="profiles-title">Keep separate saves apart.</h2><p>{profileCount} profile{profileCount === 1 ? "" : "s"} on this device. Cloud sign-in will be added after sync rules and data migration are ready.</p></div>
        <div className="profile-tools-actions">
          <form className="new-profile-form" onSubmit={(event) => { event.preventDefault(); onAddProfile(); }}>
            <label className="sr-only" htmlFor="new-profile-name">New playthrough name</label>
            <input id="new-profile-name" value={profileName} onChange={(event) => onNameChange(event.target.value)} placeholder="Name a new playthrough" maxLength={40} />
            <button type="submit" disabled={!profileName.trim()}>Add profile</button>
          </form>
          <div className="backup-actions">
            <button className="secondary-button" onClick={onExport}><ArrowDownToLine size={15} /> Export</button>
            <button className="secondary-button" onClick={onImport}><ArrowUpFromLine size={15} /> Restore</button>
          </div>
          <span className="sr-only" aria-live="polite">{profileMessage}</span>
        </div>
      </section>
    </>
  );
}

function suggestedExcaliburCheckpoint(currentAreaId: string | null, routeCheckpointTimes: Record<string, number>) {
  const unrecorded = (checkpointId: string) => routeCheckpointTimes[checkpointId] === undefined;
  const latestRecorded = [...excalibur2Checkpoints].reverse().find((checkpoint) => !unrecorded(checkpoint.id));
  const nextTargetSeconds = latestRecorded?.targetSeconds ?? -1;
  const inCurrentArea = excalibur2Checkpoints.find((checkpoint) =>
    checkpoint.chapterId === currentAreaId && checkpoint.targetSeconds > nextTargetSeconds && unrecorded(checkpoint.id),
  );
  if (inCurrentArea) return inCurrentArea.id;
  const currentIndex = guideChapterSequence.indexOf(currentAreaId ?? "");
  return excalibur2Checkpoints.find((checkpoint) => {
    const checkpointIndex = guideChapterSequence.indexOf(checkpoint.chapterId);
    return unrecorded(checkpoint.id) && checkpoint.targetSeconds > nextTargetSeconds && (currentIndex < 0 || checkpointIndex >= currentIndex);
  })?.id ?? latestRecorded?.id ?? excalibur2Checkpoints[excalibur2Checkpoints.length - 1].id;
}

function ExcaliburTimer({ profile, onRecordCheckpoint }: {
  profile: PlaythroughProfile;
  onRecordCheckpoint: (checkpointId: string, seconds: number) => void;
}) {
  const currentAreaId = profile.currentAreaId;
  const checkpointTimesRef = useRef(profile.routeCheckpointTimes);
  checkpointTimesRef.current = profile.routeCheckpointTimes;
  const [selectedCheckpointId, setSelectedCheckpointId] = useState(() => suggestedExcaliburCheckpoint(currentAreaId, profile.routeCheckpointTimes));
  const selectedCheckpoint = excalibur2Checkpoints.find((checkpoint) => checkpoint.id === selectedCheckpointId) ?? excalibur2Checkpoints[0];
  const currentSeconds = profile.playtimeSeconds;
  const difference = currentSeconds === null ? null : currentSeconds - selectedCheckpoint.targetSeconds;
  const significantlyBehind = difference !== null && difference > EXCALIBUR_II_SIGNIFICANT_DELAY_SECONDS;
  const remainingSeconds = currentSeconds === null ? null : EXCALIBUR_II_CUTOFF_SECONDS - currentSeconds;
  const recorded = excalibur2Checkpoints.filter((checkpoint) => profile.routeCheckpointTimes[checkpoint.id] !== undefined);

  useEffect(() => {
    setSelectedCheckpointId(suggestedExcaliburCheckpoint(currentAreaId, checkpointTimesRef.current));
  }, [currentAreaId]);

  const recordCheckpoint = () => {
    if (currentSeconds === null) return;
    onRecordCheckpoint(selectedCheckpoint.id, currentSeconds);
    const next = excalibur2Checkpoints.find((checkpoint) =>
      checkpoint.targetSeconds > selectedCheckpoint.targetSeconds && profile.routeCheckpointTimes[checkpoint.id] === undefined,
    );
    if (next) setSelectedCheckpointId(next.id);
  };

  return (
    <section className="excalibur-timer" aria-labelledby="excalibur-timer-title">
      <div className="excalibur-timer-heading">
        <div><div className="eyebrow">EXCALIBUR II ROUTE</div><h3 id="excalibur-timer-title">Checkpoint clock</h3></div>
        <span className="tag tag-quiet">Manual tracking</span>
      </div>
      <div className={`deadline-readout ${remainingSeconds !== null && remainingSeconds <= 0 ? "is-over" : ""}`}>
        <span>TIME REMAINING TO 12:00:00</span>
        <strong>{remainingSeconds === null ? "—" : remainingSeconds <= 0 ? "Cutoff reached" : formatClock(remainingSeconds)}</strong>
        <small>{remainingSeconds === null ? "Enter the save-file clock above." : remainingSeconds <= 0 ? "The source route requires a timer below 12:00:00 at the pickup." : "Save with less than 12 hours on the game clock to collect the weapon."}</small>
      </div>
      <p className="checkpoint-source-note">Checkpoint targets are source-reported for the original PlayStation NTSC baseline paths A, B, and Level 1. This guide has not independently timed the route.</p>
      {profile.platform !== "ps1" && <p className="checkpoint-version-note">Your selected version is not Original PlayStation. The timer is manual, and these target splits are not verified for this release.</p>}
      <div className="checkpoint-controls">
        <label className="field-label" htmlFor="excalibur-checkpoint">Compare or record a route checkpoint</label>
        <select id="excalibur-checkpoint" value={selectedCheckpoint.id} onChange={(event) => setSelectedCheckpointId(event.target.value)}>
          {excalibur2Checkpoints.map((checkpoint) => <option key={checkpoint.id} value={checkpoint.id}>{formatClock(checkpoint.targetSeconds)} · {checkpoint.label}</option>)}
        </select>
        <div className="checkpoint-target-line">
          <span>Source target <strong>{formatClock(selectedCheckpoint.targetSeconds)}</strong></span>
          {difference !== null && <span className={`checkpoint-comparison ${significantlyBehind ? "is-behind" : difference > 0 ? "is-late" : "is-ahead"}`}>
            {difference > 0 ? `${formatClock(difference)} behind` : difference < 0 ? `${formatClock(-difference)} ahead` : "on target"}
          </span>}
        </div>
        {significantlyBehind && <p className="checkpoint-delay-warning" role="status">You are more than five minutes behind this source target. Re-check the selected route and remaining budget before continuing.</p>}
        <button className="record-checkpoint-button" type="button" disabled={currentSeconds === null} onClick={recordCheckpoint}>Record current clock at this checkpoint</button>
      </div>
      <div className="recorded-checkpoints">
        <div className="recorded-checkpoints-heading"><strong>Saved route splits</strong><span>{recorded.length} / {excalibur2Checkpoints.length}</span></div>
        {recorded.length > 0
          ? <ul>{recorded.map((checkpoint) => {
              const actual = profile.routeCheckpointTimes[checkpoint.id];
              const delta = actual - checkpoint.targetSeconds;
              return <li key={checkpoint.id}><span>{checkpoint.label}</span><span>{formatClock(actual)}</span><span className={delta > EXCALIBUR_II_SIGNIFICANT_DELAY_SECONDS ? "is-behind" : ""}>{delta > 0 ? `+${formatClock(delta)}` : delta < 0 ? `−${formatClock(-delta)}` : "on target"}</span></li>;
            })}</ul>
          : <p>No route checkpoints recorded yet.</p>}
      </div>
    </section>
  );
}

function AteTracker({ profile, onToggle, onOpenChapter }: {
  profile: PlaythroughProfile;
  onToggle: (id: string) => void;
  onOpenChapter: (chapterId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleEvents = activeTimeEvents.filter((event) => {
    const objective = objectives.find((item) => item.id === event.objectiveId);
    const applies = !objective || objectiveAppliesToProfile(objective, profile);
    const matches = !normalizedQuery || `${event.title} ${event.location} ${event.trigger} ${event.note ?? ""}`.toLowerCase().includes(normalizedQuery);
    return applies && matches;
  });
  const markedCount = movieCriticEligibleEvents.filter((event) => profile.marks[event.objectiveId]?.complete === true).length;
  const markedDependencyCount = ateObjectiveDependencies.filter((dependency) => objectiveIsComplete(profile, dependency.prerequisiteObjectiveId)).length;
  const hasMovieCriticAchievement = ["steam", "ps4", "xbox", "android"].includes(profile.platform);
  const accessObjectiveGroups = [...new Set(objectiveAccessDependencies.map((dependency) => dependency.dependentObjectiveId))]
    .map((objectiveId) => ({
      objective: objectives.find((objective) => objective.id === objectiveId),
      dependencies: objectiveAccessDependencies.filter((dependency) => dependency.dependentObjectiveId === objectiveId),
    }))
    .filter((group): group is { objective: (typeof objectives)[number]; dependencies: typeof objectiveAccessDependencies } => Boolean(group.objective));
  const legacyGroupIds = [...new Set(activeTimeEvents.map((event) => event.groupObjectiveId))]
    .filter((groupId) => profile.marks[groupId]?.complete === true && !ateGroupIsComplete(profile, groupId));
  const ateSourceRecords = [...new Set(activeTimeEvents.flatMap((event) => event.sourceIds))]
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is (typeof sources)[number] => Boolean(source));

  return <>
    <PageHeading eyebrow="SIDE CONTENT · SCENE INDEX" title="Active Time Events" lead="Track each named ATE and its trigger in story order. For platforms with Movie Critic, 80 eligible scenes and one mutually exclusive Treno branch leave 79 scenes achievable on one save; the iOS Game Center catalog does not list Movie Critic." />
    {hasMovieCriticAchievement
      ? <section className="ate-progress-panel" aria-label="Movie Critic event progress">
          <div><span className="eyebrow">MOVIE CRITIC · STEAM / PS4 / XBOX / ANDROID</span><strong>{markedCount} / {movieCriticTarget} target scenes marked</strong><small>{markedCount >= movieCriticTarget ? "The single-save target is reached." : `${Math.max(0, movieCriticTarget - markedCount)} more eligible scene${movieCriticTarget - markedCount === 1 ? "" : "s"} to reach the target.`}</small></div>
          <div className="ate-progress-meter" role="progressbar" aria-label="Movie Critic target scenes marked" aria-valuemin={0} aria-valuemax={movieCriticTarget} aria-valuenow={Math.min(markedCount, movieCriticTarget)}><span style={{ width: `${Math.min(100, markedCount / movieCriticTarget * 100)}%` }} /></div>
        </section>
      : <section className="ate-progress-panel" aria-label="Movie Critic platform availability">
          <div><span className="eyebrow">MOVIE CRITIC · PLATFORM STATUS</span><strong>{profile.platform === "ios" ? "Not listed for iOS Game Center" : `No confirmed Movie Critic catalog for ${platformLabels[profile.platform]}`}</strong><small>The ATE scene checklist remains available for general completion tracking.</small></div>
        </section>}
    {ateObjectiveDependencies.length > 0 && <section className="ate-dependency-summary" aria-label="Tracked ATE prerequisite links">
      <div><span className="eyebrow">DOCUMENTED ATE ORDER</span><strong>{markedDependencyCount} / {ateObjectiveDependencies.length} linked prerequisite objectives marked</strong></div>
      <p>These links describe earlier tracked objectives. They do not predict whether an ATE prompt is currently available; trigger timing is still being verified.</p>
    </section>}
    {accessObjectiveGroups.length > 0 && <section className="ate-access-dependencies" aria-label="Tracked access prerequisites for optional objectives">
      <div className="ate-access-heading"><div><span className="eyebrow">OPTIONAL OBJECTIVE ACCESS</span><h2>Requirements that open extra routes</h2></div><p>These links describe access to optional content. They do not add an ATE order requirement or predict prompt timing.</p></div>
      {accessObjectiveGroups.map(({ objective, dependencies }) => {
        const markedCount = dependencies.filter((dependency) => objectiveIsComplete(profile, dependency.prerequisiteObjectiveId)).length;
        const chapterId = objective.chapterIds?.[0];
        return <article className="ate-access-objective" key={objective.id}>
          <div className="ate-access-objective-heading"><strong>{objective.title}</strong><span>{markedCount} / {dependencies.length} linked requirements marked</span></div>
          <ul>{dependencies.map((dependency) => {
            const event = activeTimeEvents.find((candidate) => candidate.objectiveId === dependency.prerequisiteObjectiveId);
            const prerequisite = objectives.find((candidate) => candidate.id === dependency.prerequisiteObjectiveId);
            const done = objectiveIsComplete(profile, dependency.prerequisiteObjectiveId);
            return <li className={done ? "is-complete" : ""} key={dependency.prerequisiteObjectiveId}><span className="ate-access-mark" aria-hidden="true">{done ? "✓" : "·"}</span><span>{event?.title ?? prerequisite?.title ?? dependency.prerequisiteObjectiveId}</span><span>{done ? "Marked" : "Not marked"}</span></li>;
          })}</ul>
          {chapterId && <button type="button" className="text-action" onClick={() => onOpenChapter(chapterId)}>Open {chapterId === "disc-2.cleyra" ? "Cleyra walkthrough" : "related walkthrough"} <span aria-hidden="true">↗</span></button>}
        </article>;
      })}
    </section>}
    <div className="ate-source-note"><p><strong>80 eligible scene choices are listed, but only 79 countable scenes fit on one save.</strong> Choose one of the two Vivi outcomes in Treno. Comprehensive and Custom profiles can track the three Teach Me, Mogster! tutorials as separate non-achievement checkboxes. ATE trigger ordering can vary by route; unresolved directions stay labeled.</p>
      {profile.platform === "ps1" && <p>Original PlayStation has no platform achievement list. This page still tracks scenes for story and completionist reference.</p>}
      {profile.platform === "switch" && <p>Nintendo Switch has no platform achievement catalog in this guide. ATEs remain available as game content, but they are not linked to a confirmed Switch achievement set.</p>}
      {profile.platform === "ios" && <p>The iOS Game Center catalog does not include Movie Critic. The ATE list is still useful as route context, but its 79-scene target is not an iOS achievement requirement.</p>}
    </div>
    {legacyGroupIds.length > 0 && <p className="ate-legacy-note" role="status">This profile has {legacyGroupIds.length} earlier chapter-level ATE mark{legacyGroupIds.length === 1 ? "" : "s"} without scene-by-scene details. Those marks remain preserved; review the rows to get an exact Movie Critic count.</p>}
    <label className="ate-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search ATEs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scene, location, or trigger" /></label>
    <div className="ate-disc-list">
      {arcs.map((arc) => {
        const arcAreas = guideAreas.filter((area) => area.arcId === arc.id);
        const hasEvents = arcAreas.some((area) => visibleEvents.some((event) => event.chapterId === area.id));
        if (!hasEvents) return null;
        return <section className="ate-disc-section" key={arc.id} aria-labelledby={`ate-${arc.id}`}>
          <div className="ate-disc-heading"><span className="eyebrow">{arc.label.toUpperCase()}</span><h2 id={`ate-${arc.id}`}>{arc.label}</h2></div>
          {arcAreas.map((area) => {
            const chapterEvents = visibleEvents.filter((event) => event.chapterId === area.id);
            if (chapterEvents.length === 0) return null;
            const chapterGroupIds = [...new Set(chapterEvents.map((event) => event.groupObjectiveId))];
            return <section className="ate-chapter-group" key={area.id} aria-labelledby={`ate-area-${area.id}`}>
              <div className="ate-chapter-heading"><div><h3 id={`ate-area-${area.id}`}>{area.title}</h3><span>{chapterEvents.filter((event) => event.countsTowardMovieCritic).length} eligible · {chapterEvents.filter((event) => !event.countsTowardMovieCritic).length} tutorial</span></div><button type="button" className="text-action" onClick={() => onOpenChapter(area.id)}>Open walkthrough <span aria-hidden="true">↗</span></button></div>
              {chapterGroupIds.map((groupObjectiveId) => {
                const groupEvents = chapterEvents.filter((event) => event.groupObjectiveId === groupObjectiveId);
                const renderedChoice = new Set<string>();
                return <div className="ate-event-list" key={groupObjectiveId}>
                  {groupEvents.map((event) => {
                    if (event.exclusiveGroupId) {
                      if (renderedChoice.has(event.exclusiveGroupId)) return null;
                      renderedChoice.add(event.exclusiveGroupId);
                      const choices = groupEvents.filter((candidate) => candidate.exclusiveGroupId === event.exclusiveGroupId);
                      return <fieldset className="ate-choice-card" key={event.exclusiveGroupId}>
                        <legend>Vivi's mutually exclusive Treno outcome · choose one</legend>
                        {choices.map((choice) => <label className="ate-event-row" key={choice.objectiveId}>
                          <input type="radio" name={choice.exclusiveGroupId} checked={profile.marks[choice.objectiveId]?.complete === true} onChange={() => onToggle(choice.objectiveId)} />
                          <span className="ate-event-copy"><strong>{choice.title}</strong><small>{choice.location} · {choice.trigger}</small></span><span className="ate-event-status">{profile.marks[choice.objectiveId]?.complete ? "Viewed" : "Alternate"}</span>
                        </label>)}
                      </fieldset>;
                    }
                    const done = profile.marks[event.objectiveId]?.complete === true;
                    const prerequisites = unmetObjectivePrerequisites(event.objectiveId, ateObjectiveDependencies, (id) => objectiveIsComplete(profile, id));
                    const allPrerequisites = ateObjectiveDependencies.filter((dependency) => dependency.dependentObjectiveId === event.objectiveId);
                    return <label className={`ate-event-row ${done ? "is-complete" : ""}`} key={event.objectiveId}>
                      <input type="checkbox" checked={done} onChange={() => onToggle(event.objectiveId)} />
                      <span className="ate-event-copy"><strong>{event.title}</strong><small>{event.location} · {event.trigger}</small>{allPrerequisites.length > 0 && <small className="ate-prerequisite-note"><strong>Prerequisites {prerequisites.length > 0 ? "not all marked" : "marked"}:</strong> {allPrerequisites.map((dependency) => {
                        const title = activeTimeEvents.find((candidate) => candidate.objectiveId === dependency.prerequisiteObjectiveId)?.title
                          ?? objectives.find((objective) => objective.id === dependency.prerequisiteObjectiveId)?.title
                          ?? dependency.prerequisiteObjectiveId;
                        return `${title} (${objectiveIsComplete(profile, dependency.prerequisiteObjectiveId) ? "marked" : "not marked"})`;
                      }).join("; ")}</small>}{event.note && <small className="ate-event-note">{event.note}</small>}</span>
                      <span className={`ate-event-kind ${event.countsTowardMovieCritic ? "is-eligible" : "is-tutorial"}`}>{event.countsTowardMovieCritic ? "Counts" : "Tutorial"}</span>
                    </label>;
                  })}
                  <div className="ate-group-state"><span>{objectiveIsComplete(profile, groupObjectiveId) ? "Chapter checklist complete" : "Chapter checklist open"}</span><button type="button" className="ate-group-toggle" onClick={() => onToggle(groupObjectiveId)}>{objectiveIsComplete(profile, groupObjectiveId) ? "Clear chapter checklist" : "Mark chapter checklist complete"}</button></div>
                </div>;
              })}
            </section>;
          })}
        </section>;
      })}
      {visibleEvents.length === 0 && <div className="empty-state">No ATE names or trigger notes match “{query}”.</div>}
    </div>
    <div className="source-footnote"><span>Source status</span><span>Scene names and route anchors use a chronological community checklist, cross-checked against Movie Critic achievement/trophy guides.</span><small>Some screen-order and version-specific triggers remain partial and are flagged beside their scene.</small><div className="ate-source-links">{ateSourceRecords.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={11} aria-hidden="true" /></a>)}</div></div>
  </>;
}

function RouteMap({ profile, onOpenChapter, onSetCurrentArea }: {
  profile: PlaythroughProfile;
  onOpenChapter: (chapterId: string) => void;
  onSetCurrentArea: (chapterId: string) => void;
}) {
  const orderedAreas = guideChapterSequence.flatMap((chapterId) => {
    const area = guideAreas.find((candidate) => candidate.id === chapterId);
    return area ? [area] : [];
  });
  const currentIndex = guideChapterSequence.indexOf(profile.currentAreaId ?? "");
  const routeSourceIds = [...new Set(guideSequenceEdges.flatMap((edge) => edge.sourceIds))];
  const routeSources = routeSourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is (typeof sources)[number] => Boolean(source));
  const gameRouteCounts = gameRouteEdges.reduce((counts, edge) => {
    counts[edge.relationship] += 1;
    return counts;
  }, { "required-story": 0, "optional-detour": 0, "optional-return": 0, rejoin: 0 });
  const gameRouteRelationshipLabels = {
    "required-story": "Story gate",
    "optional-detour": "Optional detour",
    "optional-return": "Optional return",
    rejoin: "Rejoins story",
  } as const;
  const chapterTitle = (chapterId: string) => guideAreas.find((area) => area.id === chapterId)?.title ?? chapterId;

  return <>
    <PageHeading eyebrow="CHAPTER NAVIGATION · GUIDE ORDER" title="Route Map" lead="Browse all 44 walkthrough chapters in the source guide's table-of-contents order. A separate evidence-backed graph below follows researched story gates through the ending, with optional branches and cutoffs still incomplete." />
    <section className="route-map-summary" aria-label="Guide route summary">
      <div><span className="eyebrow">SOURCE-ORDERED CHAPTERS</span><strong>{orderedAreas.length} chapters · {guideSequenceEdges.length} guide-order links</strong></div>
      <p>{profile.currentAreaId ? `Current-area marker: ${guideAreas.find((area) => area.id === profile.currentAreaId)?.title ?? "Unknown chapter"}.` : "Set a current-area marker to see its position in the guide sequence."} Changing the marker can open the existing missable cutoff review.</p>
    </section>
    <div className="route-map-discs">
      {arcs.map((arc) => {
        const discAreas = orderedAreas.filter((area) => area.arcId === arc.id);
        return <section className="route-map-disc" key={arc.id} aria-labelledby={`route-${arc.id}`}>
          <div className="route-map-disc-heading"><div><span className="eyebrow">{arc.label.toUpperCase()}</span><h2 id={`route-${arc.id}`}>{arc.label}</h2></div><span>{discAreas.length} chapters</span></div>
          <ol className="guide-route-list">
            {discAreas.map((area) => {
              const sequenceIndex = guideChapterSequence.indexOf(area.id);
              const isCurrent = profile.currentAreaId === area.id;
              const position = isCurrent ? "Current marker" : currentIndex < 0 ? "Marker not set" : sequenceIndex < currentIndex ? "Earlier in guide order" : "Later in guide order";
              const contentState = area.state === "partial" ? "Partial content" : "Outline only";
              return <li className={`guide-route-entry ${isCurrent ? "is-current" : ""}`} key={area.id}>
                <span className="guide-route-number">{String(sequenceIndex + 1).padStart(2, "0")}</span>
                <div className="guide-route-copy"><strong>{area.title}</strong><span>{position} · {contentState}</span></div>
                <div className="guide-route-actions">
                  <button type="button" className="route-open-button" onClick={() => onOpenChapter(area.id)}>Open walkthrough</button>
                  <button type="button" className="route-current-button" onClick={() => onSetCurrentArea(area.id)} disabled={isCurrent}>{isCurrent ? "Current area" : "Set current area"}</button>
                </div>
              </li>;
            })}
          </ol>
        </section>;
      })}
    </div>
    <section className="game-route-section" aria-labelledby="game-route-heading">
      <div className="game-route-heading">
        <div><span className="eyebrow">IN-GAME PROGRESSION · PARTIAL</span><h2 id="game-route-heading">Verified story route</h2></div>
        <span className="game-route-scope">Through {chapterTitle(gameRouteCoverage.throughChapterId)}</span>
      </div>
        <p className="game-route-intro">These source-checked links follow the main story through the final battle, including the forced Oeilvert/Desert Palace party split and the optional return to Gaia after Deathguise. They also record the Dagger-and-Steiner Treno branch and twenty-nine optional area returns, including Memoria's entrance-light exit for Gaia and Nero Family errands, the pre-Cargo-Ship Dali return to Ice Cavern, the pre-Cleyra Lindblum Basin return, the Disc III Hilda Garde docking at Lindblum Castle for the ship Elixir (without implying access to other city areas), the return to Black Mage Village to check which Disc II shop items remain available in Disc III (Flactem's earlier Blue Narciss visit does not verify this Hilda Garde timing; the forest route and first-visit ATEs remain closed), Quan's Dwelling with Vivi and Quina for the Running Shoes scene, Dali for the optional Cotton Robe money loop, and Treno for Amdusias and Stellazzio. The Disc IV Mognet route now shows its six letter stops through Burmecia, Black Mage Village, Ipsen's Castle, Fossil Roo, Daguerreo, and Alexandria before Mognet Central; Kupo Nut, Treno, and Madain Sari routes are also included. The Iifa Tree portal reopens Memoria; the later Crystal World warp only returns to the dungeon entrance. Party control handoffs are mapped separately below. Many side routes, cutoff conditions, and objective prerequisites remain outside this partial graph.</p>
      <div className="game-route-counts" aria-label="Route relationship and cutoff counts">
        <span>{gameRouteCounts["required-story"]} story gates</span><span>{gameRouteCounts["optional-detour"]} optional detour{gameRouteCounts["optional-detour"] === 1 ? "" : "s"}</span><span>{gameRouteCounts["optional-return"]} optional return{gameRouteCounts["optional-return"] === 1 ? "" : "s"}</span><span>{gameRouteCounts.rejoin} rejoin{gameRouteCounts.rejoin === 1 ? "" : "s"}</span>
        <span>{gameRouteCutoffs.length} cutoff windows linked</span>
      </div>
      <div className="party-sequence-section">
        <h3>Party control handoffs</h3>
        <ol className="party-sequence-list">
          {storyPartySequences.map((sequence) => {
            const sequenceSources = sequence.sourceIds
              .map((sourceId) => sources.find((source) => source.id === sourceId))
              .filter((source): source is (typeof sources)[number] => Boolean(source));
            return <li className="party-sequence-entry" key={sequence.id}>
              <h4>{sequence.title}</h4>
              <ol className="party-sequence-phases">
                {sequence.phases.map((phase, index) => <li className="party-sequence-phase" key={`${sequence.id}-${index}`}>
                  <div className="party-sequence-phase-heading"><strong>{phase.party}</strong><span>{phase.location}</span></div>
                  <p>{phase.summary}</p>
                  <small>{[...new Set(phase.chapterIds)].map(chapterTitle).join(" · ")}</small>
                </li>)}
              </ol>
              <details className="game-route-sources"><summary>Sources ({sequenceSources.length})</summary><div>{sequenceSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={11} aria-hidden="true" /></a>)}</div></details>
            </li>;
          })}
        </ol>
      </div>
      <ol className="game-route-list">
        {gameRouteEdges.map((edge) => {
          const edgeSources = edge.sourceIds
            .map((sourceId) => sources.find((source) => source.id === sourceId))
            .filter((source): source is (typeof sources)[number] => Boolean(source));
          const edgeCutoffs = gameRouteCutoffs.filter((cutoff) => cutoff.edgeId === edge.id);
          return <li className={`game-route-entry is-${edge.relationship}`} key={edge.id}>
            <div className="game-route-edge-topline">
              <div className="game-route-edge-endpoints"><strong>{chapterTitle(edge.fromChapterId)}</strong><span aria-hidden="true">→</span><strong>{chapterTitle(edge.toChapterId)}</strong></div>
              <span className="game-route-kind">{gameRouteRelationshipLabels[edge.relationship]}</span>
            </div>
            <p>{edge.summary}</p>
            {edgeCutoffs.length > 0 && <details className="game-route-cutoffs">
              <summary>Cutoff review ({edgeCutoffs.length} window{edgeCutoffs.length === 1 ? "" : "s"})</summary>
              <div className="game-route-cutoff-list">
                {edgeCutoffs.map((cutoff) => {
                  const linkedMissables = cutoff.missableIds
                    .map((missableId) => missables.find((record) => record.id === missableId))
                    .filter((record): record is (typeof missables)[number] => Boolean(record));
                  const cutoffSources = cutoff.sourceIds
                    .map((sourceId) => sources.find((source) => source.id === sourceId))
                    .filter((source): source is (typeof sources)[number] => Boolean(source));
                  return <section className="game-route-cutoff" key={cutoff.id}>
                    <div className="game-route-cutoff-heading"><h4>{cutoff.title}</h4><span className={`game-route-certainty is-${cutoff.certainty}`}>{cutoff.certainty.replaceAll("-", " ")}</span></div>
                    <p>{cutoff.trigger}</p>
                    <ul className="game-route-cutoff-missables">
                      {linkedMissables.map((record) => {
                        const state = missableProgressState(record, profile);
                        const warningChapterId = record.warningChapterIds?.find((chapterId) => chapterId === edge.fromChapterId || chapterId === edge.toChapterId) ?? edge.fromChapterId;
                        return <li key={record.id}>
                          <div className="game-route-cutoff-record"><strong>{record.title}</strong><small>Deadline: {record.deadline}</small></div>
                          <span className={`game-route-cutoff-state is-${state}`}>{state.replaceAll("-", " ")}</span>
                          <button type="button" className="game-route-open-warning" onClick={() => onOpenChapter(warningChapterId)}>Open warning</button>
                        </li>;
                      })}
                    </ul>
                    <details className="game-route-sources"><summary>Cutoff sources ({cutoffSources.length})</summary><div>{cutoffSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={11} aria-hidden="true" /></a>)}</div></details>
                  </section>;
                })}
              </div>
            </details>}
            <details className="game-route-sources"><summary>Sources ({edgeSources.length})</summary><div>{edgeSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={11} aria-hidden="true" /></a>)}</div></details>
          </li>;
        })}
      </ol>
      <p className="game-route-caveat">Source coverage: original PlayStation walkthroughs, with independent chapter routes linked per relationship where available. “Story gate” means the documented main-story transition; it does not imply that every optional objective in the source chapter is required.</p>
    </section>
    <div className="source-footnote route-map-source"><span>Sequence source</span><span>The chapter list follows the registered GameFAQs walkthrough contents page.</span><small>TOC order is not evidence of hard prerequisites between every pair of chapters.</small>{routeSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={11} aria-hidden="true" /></a>)}</div>
  </>;
}

function Walkthrough({ profile, search, onClearSearch, onNavigate, onToggleObjective, onSetCurrentArea, onAcknowledgeWarning }: {
  profile: PlaythroughProfile;
  search: string;
  onClearSearch: () => void;
  onNavigate: (view: View) => void;
  onToggleObjective: (id: string) => void;
  onSetCurrentArea: (areaId: string) => void;
  onAcknowledgeWarning: (warningId: string) => void;
}) {
  const [activeArc, setActiveArc] = useState(arcs[0].id);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>("disc-1.alexandria");
  const query = search.trim().toLowerCase();
  const visibleAreas = useMemo(() => guideAreas.filter((area) => {
    if (area.arcId !== activeArc) return false;
    if (!query || area.title.toLowerCase().includes(query)) return true;
    return walkthroughSearchText(area.id).includes(query);
  }), [activeArc, query]);
  const relevantPending = pendingMissables(profile).filter((record) => ["actionable", "available-later", "unplaced"].includes(missableProgressState(record, profile)));

  useEffect(() => {
    if (!query) return;
    const matchingArea = guideAreas.find((area) => area.title.toLowerCase() === query)
      ?? guideAreas.find((area) => walkthroughSearchText(area.id).includes(query));
    if (matchingArea) {
      setActiveArc(matchingArea.arcId);
      if (walkthroughChapterContent(matchingArea.id)) setExpandedChapterId(matchingArea.id);
    }
  }, [query]);

  const contentStatus = (state: GuideArea["state"]) => state === "partial"
    ? "Partial · source-checked"
    : state === "verified" ? "Verified" : state === "implemented-unverified" ? "Needs review" : "Chapter details pending";

  return (
    <>
      <PageHeading eyebrow="STORY ROUTE" title="Walkthrough" lead={`${authoredChapterCount} of ${guideAreas.length} chapters have partial source-linked walkthrough instructions; route and version verification remain in progress.`} />
      <div className="research-banner"><CircleHelp size={17} /><p><strong>Coverage is explicit.</strong> All {authoredChapterCount} chapter headings have partial walkthrough content; source disagreements and unfinished route checks are labeled in place.</p><span>{authoredChapterCount} / {guideAreas.length} authored</span></div>
      <div className="arc-tabs" role="tablist" aria-label="Story disc">
        {arcs.map((arc) => <button key={arc.id} role="tab" aria-selected={activeArc === arc.id} className={activeArc === arc.id ? "is-active" : ""} onClick={() => setActiveArc(arc.id)}>{arc.label}<span>{arc.areas.length.toString().padStart(2, "0")}</span></button>)}
      </div>
      <section className="chapter-list" aria-label={`${arcs.find((arc) => arc.id === activeArc)?.label} chapter inventory`}>
        {visibleAreas.map((area, index) => {
          const chapter = walkthroughChapterContent(area.id);
          const isExpanded = Boolean(chapter && expandedChapterId === area.id);
          const storyArc = arcs.find((arc) => arc.id === area.arcId);
          const arcChapterIndex = storyArc?.areas.findIndex((chapterArea) => `${area.arcId}.${chapterArea.id}` === area.id) ?? index;
          const areaWarnings = relevantPending.filter((record) => record.warningChapterIds?.includes(area.id));
          return <div className="chapter-entry" key={area.id}>
            <div className="chapter-row">
              <span className="chapter-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="chapter-row-copy">
                {chapter
                  ? <button className="chapter-title-button" aria-expanded={isExpanded} aria-controls={`chapter-content-${area.id}`} onClick={() => setExpandedChapterId(isExpanded ? null : area.id)}><strong>{area.title}</strong><span>{isExpanded ? "Hide chapter instructions" : "Open chapter instructions"}</span></button>
                  : <><strong>{area.title}</strong><span>Chapter instructions pending source review</span></>}
                {areaWarnings.length > 0 && <button className="chapter-warning-link" onClick={() => onNavigate("missables")}>
                  <ShieldAlert size={13} aria-hidden="true" /> {areaWarnings.length} cutoff warning{areaWarnings.length === 1 ? "" : "s"}
                </button>}
              </div>
              <span className="status-label"><span className={`state-dot ${area.state === "planned" ? "planned" : area.state === "verified" ? "verified" : "partial"}`} /> {contentStatus(area.state)}</span>
            </div>
            {chapter && <article className="walkthrough-chapter" id={`chapter-content-${area.id}`} aria-label={`${area.title} instructions`} hidden={!isExpanded}>
              <div className="walkthrough-chapter-header">
                  <div><span className="eyebrow">{storyArc?.label.toUpperCase() ?? "STORY"} · CHAPTER {String(arcChapterIndex + 1).padStart(2, "0")}</span><p>{chapter.overview}</p></div>
                <div className="chapter-header-actions">
                  {areaWarnings.some((record) => !warningIsAcknowledged(record, profile)) && <button className="chapter-acknowledge-button" type="button" onClick={() => areaWarnings.filter((record) => !warningIsAcknowledged(record, profile)).forEach((record) => onAcknowledgeWarning(record.id))}>Acknowledge {areaWarnings.filter((record) => !warningIsAcknowledged(record, profile)).length} warnings</button>}
                  <button className={`chapter-current-button ${profile.currentAreaId === area.id ? "is-current" : ""}`} onClick={() => onSetCurrentArea(area.id)} disabled={profile.currentAreaId === area.id}>{profile.currentAreaId === area.id ? "Current area" : "Set current area"}</button>
                </div>
              </div>
              {profile.route !== "standard" && chapter.timedRouteNote && <div className="chapter-route-note"><AlertTriangle size={16} aria-hidden="true" /><p>{chapter.timedRouteNote}</p></div>}
              <div className="walkthrough-sections">
                {chapter.sections.map((section) => <section className="walkthrough-section" key={section.id} aria-labelledby={`section-${section.id}`}>
                  <div className="walkthrough-section-heading"><h3 id={`section-${section.id}`}>{section.title}</h3>{section.summary && <p>{section.summary}</p>}</div>
                  {section.preparationGuidance && <div className="chapter-preparation-guidance enemy-preparation-guidance">
                    <h4>Story checkpoint preparation</h4>
                    <p>{section.preparationGuidance.suggestedLevelRange && <><strong>Optional level range:</strong> Lv. {section.preparationGuidance.suggestedLevelRange.min}–{section.preparationGuidance.suggestedLevelRange.max}. </>}<strong>Party level:</strong> {section.preparationGuidance.levelRationale}</p>
                    {section.preparationGuidance.difficultyAssessment && <p><strong>Encounter profile:</strong> {section.preparationGuidance.difficultyAssessment}</p>}
                    <p><strong>Grinding:</strong> {section.preparationGuidance.optionalGrinding}</p>
                    <p><strong>Setup:</strong> {section.preparationGuidance.setupAdvice}</p>
                    <p className="enemy-preparation-confidence"><strong>Evidence status:</strong> {section.preparationGuidance.confidence === "partial" ? "Partial; source and version coverage is limited, and guidance is not gameplay-tested." : "Disputed; compare the linked sources."}</p>
                  </div>}
                  <ol className="walkthrough-steps">
                    {section.steps.map((step) => {
                      const linkedObjectives = (step.objectiveIds ?? []).map((id) => objectives.find((objective) => objective.id === id)).filter((objective) => objective && objectiveAppliesToProfile(objective, profile));
                      return <li className={`walkthrough-step step-${step.kind}`} key={step.id}>
                        <div className="walkthrough-step-top"><span className="step-kind">{walkthroughStepLabels[step.kind]}</span><p>{step.text}</p></div>
                        {step.detail && <p className="walkthrough-step-detail">{step.detail}</p>}
                        {linkedObjectives.map((objective) => {
                          if (!objective) return null;
                          const prerequisites = questPrerequisiteDependencies.filter((dependency) => dependency.dependentObjectiveId === objective.id);
                          const objectiveControl = <label className="chapter-objective">
                            <input type="checkbox" checked={objectiveIsComplete(profile, objective.id)} onChange={() => onToggleObjective(objective.id)} />
                            <span className="custom-check" aria-hidden="true"><Check size={13} /></span>
                            <span>{objective.title}</span>
                          </label>;
                          if (prerequisites.length === 0) return <div key={objective.id}>{objectiveControl}</div>;
                          const unmetPrerequisites = unmetObjectivePrerequisites(objective.id, questPrerequisiteDependencies, (id) => objectiveIsComplete(profile, id));
                          const markedCount = prerequisites.length - unmetPrerequisites.length;
                          const remainingTitles = unmetPrerequisites.map((dependency) => objectives.find((item) => item.id === dependency.prerequisiteObjectiveId)?.title ?? dependency.prerequisiteObjectiveId);
                          const isFriendlyYan = objective.id === "disc-3.aerial-exploration.friendly-yan";
                          const isStiltzkinRibbon = objective.id === "disc-4.return-to-gaia.stiltzkin-ribbon";
                          const prerequisiteLabel = isFriendlyYan ? "Yan prerequisites" : isStiltzkinRibbon ? "Stiltzkin purchases" : "Quest prerequisites";
                          const completedPrerequisiteNote = isFriendlyYan
                            ? "all eight other creatures marked; confirm you still have the Diamond"
                            : isStiltzkinRibbon
                              ? "all eight purchases marked; speak to Stiltzkin again and claim the Ribbon"
                              : "all prerequisites marked";
                          return <div className="chapter-objective-group" key={objective.id}>
                            {objectiveControl}
                            <small className="chapter-prerequisite-status" role="status">
                              {prerequisiteLabel}: {markedCount}/{prerequisites.length} marked{remainingTitles.length > 0 ? ` · Remaining: ${remainingTitles.join(", ")}` : ` · ${completedPrerequisiteNote}`}
                            </small>
                          </div>;
                        })}
                      </li>;
                    })}
                  </ol>
                  <div className="walkthrough-sources"><span>Section sources</span>{section.sourceIds.map((sourceId) => {
                    const source = sources.find((item) => item.id === sourceId);
                    return source ? <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher}: {source.title} <ExternalLink size={12} aria-hidden="true" /></a> : null;
                  })}</div>
                </section>)}
              </div>
            </article>}
          </div>;
        })}
        {visibleAreas.length === 0 && <div className="empty-state">No chapter names or instructions match “{search}”. <button className="inline-link" onClick={onClearSearch}>Clear search</button></div>}
      </section>
      <div className="source-footnote"><span>Research status</span><span>Detailed section sources are linked in each expanded chapter.</span><small>All 44 headings have partial walkthrough text; route and version audits remain in progress.</small></div>
    </>
  );
}

function Missables({ profile, onToggle, onAcknowledgeWarning }: { profile: PlaythroughProfile; onToggle: (id: string) => void; onAcknowledgeWarning: (warningId: string) => void }) {
  const records = applicableMissables(profile);
  const excludedRecords = missables.filter((record) => !missableAppliesToProfile(record, profile));
  const trackedObjectiveIds = new Set(records.map((record) => record.objectiveId));
  const completedCount = [...trackedObjectiveIds].filter((objectiveId) => objectiveIsComplete(profile, objectiveId)).length;
  const acknowledgedCount = records.filter((record) => warningIsAcknowledged(record, profile) && !objectiveIsComplete(profile, record.objectiveId)).length;
  return (
    <>
      <PageHeading eyebrow="DEADLINES & ONE-WAY CUTS" title="Missables" lead="Warnings are classified by consequence. An unavailable pickup is not automatically a permanently lost item." />
      <div className="registry-summary"><div><span className="summary-icon"><ShieldAlert size={18} /></span><div><strong>{completedCount} of {trackedObjectiveIds.size} tracked objectives complete</strong><small>{acknowledgedCount} warning{acknowledgedCount === 1 ? "" : "s"} acknowledged but still incomplete · showing {goalLabels[profile.goal]}</small></div></div><span className="coverage-status">{records.length} applicable · {excludedRecords.length} excluded</span></div>
      <section className="missable-list" aria-label="Missable records for this profile">
        {records.map((record) => {
          const progressState = missableProgressState(record, profile);
          const done = progressState === "complete";
          const acknowledged = warningIsAcknowledged(record, profile);
          const severityLabel = record.severity === "critical" ? "Critical cutoff" : record.severity === "high" ? "One-time window" : "Follow-up needed";
          const verificationLabel = record.verification === "verified" ? "Source-checked" : "Partial · follow-up review";
          const progressLabel = done ? "MARKED COMPLETE" : acknowledged ? "ACKNOWLEDGED · STILL UNMARKED" : progressState === "actionable" ? "OPEN WINDOW · ACT NOW" : progressState === "available-later" ? "AVAILABLE LATER" : progressState === "missed" ? "MISSED · REVIEW RECOVERY" : progressState === "recoverable" ? "RECOVERABLE LATER" : "CUTOFF TIMING NEEDS REVIEW";
          return <article className={`missable-record record-severity-${record.severity} ${done ? "missable-done" : progressState === "missed" ? "missable-past" : record.severity === "critical" && progressState === "actionable" ? "missable-active" : ""}`} key={record.id}>
            <div className="missable-main">
              <div className="missable-top"><div className="missable-title-line"><span className="severity-icon"><AlertTriangle size={18} /></span><div><span className="eyebrow">{progressLabel}</span><h2>{record.title}</h2><div className="missable-classifications">{record.classification.map((classification) => <span className="classification-tag" key={classification}>{missableClassificationLabels[classification]}</span>)}</div></div></div><span className={`tag ${record.severity === "critical" ? "tag-critical" : record.severity === "high" ? "tag-high" : "tag-info"}`}>{severityLabel}</span></div>
              <p className="missable-consequence">{record.consequence}</p>
              <div className="missable-facts">
                <div><span className="label-muted">WHEN TO ACT</span><p>{record.deadline}</p></div>
                <div><span className="label-muted">LATER AVAILABILITY</span><p>{record.nextAvailability ?? "No verified later availability is recorded yet."}</p></div>
                <div><span className="label-muted">WHAT TO DO / RECOVERY</span><p>{record.action} {record.recovery}</p></div>
              </div>
              {record.note && <p className="missable-note">{record.note}</p>}
              <div className="missable-footer"><span className="verification-chip"><span className={`state-dot ${record.verification === "verified" ? "verified" : "partial"}`} /> {verificationLabel}</span><div className="missable-sources">{record.sourceIds.map((sourceId) => {
                const source = sources.find((item) => item.id === sourceId);
                return source ? <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.publisher} <ExternalLink size={12} /></a> : null;
              })}</div></div>
            </div>
            <label className="objective-check missable-check"><input type="checkbox" checked={done} onChange={() => onToggle(record.objectiveId)} /><span className="custom-check" aria-hidden="true"><Check size={13} /></span><span>Mark this objective complete</span></label>
            {!done && <button className="missable-acknowledgement" type="button" aria-pressed={acknowledged} onClick={() => onAcknowledgeWarning(record.id)}>{acknowledged ? "Clear warning acknowledgement" : "I reviewed this warning"}</button>}
          </article>;
        })}
        {records.length === 0 && <div className="empty-state">No researched missable objectives are assigned to this profile yet.</div>}
      </section>
      {excludedRecords.length > 0 && <details className="excluded-missables"><summary>{excludedRecords.length} warning records excluded by this profile</summary><p>These records are outside the selected goal, route, or platform. They do not count as missing progress for this profile.</p><ul>{excludedRecords.map((record) => <li key={record.id}><strong>{record.title}</strong><span>{record.classification.map((classification) => missableClassificationLabels[classification]).join(" · ")}</span></li>)}</ul></details>}
      <section className="classification-guide">
        <div className="eyebrow">CLASSIFICATION RULE</div>
        <p><strong>Permanent loss</strong> means no normal acquisition path remains on this save. A missed opportunity with a later shop, synthesis, or encounter source will be labeled separately.</p>
        <button className="text-action" onClick={() => { window.location.hash = "#reference"; }}>View the data model <span aria-hidden="true">↗</span></button>
      </section>
    </>
  );
}

function Achievements({ profile, platform, onPlatformChange, onToggle, onOpenChapter, onOpenAteTracker }: {
  profile: PlaythroughProfile;
  platform: PlatformChoice;
  onPlatformChange: (platform: PlatformChoice) => void;
  onToggle: (id: string) => void;
  onOpenChapter: (chapterId: string) => void;
  onOpenAteTracker: () => void;
}) {
  const steam = achievementSourceCounts.steam;
  const ps4 = achievementSourceCounts.ps4;
  const xbox = achievementSourceCounts.xbox;
  const ios = achievementSourceCounts.ios;
  const android = achievementSourceCounts.android;
  const activeCatalog = platform === "steam"
    ? { id: "steam", label: "Steam", records: steamAchievements }
    : platform === "ps4"
      ? { id: "ps4", label: "PlayStation 4", records: ps4Trophies }
      : platform === "xbox"
        ? { id: "xbox", label: "Xbox", records: xboxAchievements }
        : platform === "ios"
          ? { id: "ios", label: "iOS / Game Center", records: iosAchievements }
          : platform === "android"
            ? { id: "android", label: "Android / Google Play", records: androidAchievements }
            : null;
  const activeCatalogDescription = platform === "steam"
    ? "Names and criteria are transcribed from Steam's global list. Mark an achievement when Steam records it as unlocked; the guide cannot read Steam's unlock state."
    : platform === "ps4"
      ? "The 51 gameplay criteria match Xbox; Heroes of Gaia is the automatic Platinum trophy. Mark a trophy after PlayStation records it as earned."
      : platform === "xbox"
        ? "These 51 Xbox criteria match the PS4 gameplay trophy set. Mark an achievement after Xbox records it as unlocked."
        : platform === "ios"
          ? "The 83-entry iOS list is catalogued from the Game Center criteria. It does not include Backstabber or Movie Critic; direct device unlock testing remains open."
          : "The 85-entry Android list is catalogued from Google Play criteria. It includes Backstabber and Movie Critic, matching Steam's current count; direct device unlock testing remains open.";
  const activeCompleted = activeCatalog?.records.filter((achievement) => profile.marks[achievement.objectiveId]?.complete === true).length ?? 0;
  const activeMapped = activeCatalog?.records.filter((achievement) => achievementGuideAreas(achievement).length > 0).length ?? 0;
  const catalogTitleId = activeCatalog ? `${activeCatalog.id}-catalog-title` : undefined;
  return (
    <>
      <PageHeading eyebrow="PLATFORM GOALS" title="Achievements" lead="View platform criteria, follow walkthrough pointers, and mark recorded unlocks. Trigger details and full missability remain under research; mobile catalogs are tracked separately because iOS and Android differ." />
      <div className="achievement-toolbar"><label className="field-label" htmlFor="achievement-platform">Selected platform</label><select id="achievement-platform" value={platform} onChange={(event) => onPlatformChange(event.target.value as PlatformChoice)}>{platformOptions(platform).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><span className="coverage-status">{activeCatalog ? `${activeCompleted} / ${activeCatalog.records.length} marked unlocked · guide links for ${activeMapped}` : "No catalog is confirmed for this platform"}</span></div>
      <section className="achievement-source-list" aria-label="Achievement source coverage">
        <div className="achievement-source-row"><span className="platform-monogram">PS1</span><div className="achievement-source-copy"><strong>Original PlayStation</strong><span>No platform trophy or achievement checklist applies to the original release; game completion objectives are tracked separately.</span></div><span className="status-label"><span className="state-dot verified" /> No platform set</span><span className="source-unavailable">—</span></div>
        <div className="achievement-source-row"><span className="platform-monogram">PC</span><div className="achievement-source-copy"><strong>Steam</strong><span>All {steam.count} names and criteria are imported, with chapter or objective pointers for each. Trigger details and full missability remain under review.</span></div><span className="status-label"><span className="state-dot partial" /> Catalogued</span><a href={sources.find((source) => source.id === steam.sourceId)?.url} target="_blank" rel="noreferrer" aria-label="Open Steam achievement list"><ExternalLink size={15} /></a></div>
        <div className="achievement-source-row"><span className="platform-monogram">PS</span><div className="achievement-source-copy"><strong>PlayStation 4 / PS5 compatibility</strong><span>All {ps4.count} trophies are catalogued: 51 gameplay criteria shared with Xbox plus the automatic Heroes of Gaia Platinum. Trigger and missability audits remain in progress; PS5 feature omissions may apply.</span></div><span className="status-label"><span className="state-dot partial" /> Catalogued</span><a href={sources.find((source) => source.id === ps4.sourceId)?.url} target="_blank" rel="noreferrer" aria-label="Open PlayStation trophy list"><ExternalLink size={15} /></a></div>
        <div className="achievement-source-row"><span className="platform-monogram">XB</span><div className="achievement-source-copy"><strong>Xbox One / Series X|S / Windows app</strong><span>All {xbox.count} criteria are catalogued and match the PS4 gameplay trophy set. The list is worth 1,000 Gamerscore; trigger and missability audits remain in progress.</span></div><span className="status-label"><span className="state-dot partial" /> Catalogued</span><a href={sources.find((source) => source.id === xbox.sourceId)?.url} target="_blank" rel="noreferrer" aria-label="Open Xbox achievement list"><ExternalLink size={15} /></a></div>
        <div className="achievement-source-row"><span className="platform-monogram">NS</span><div className="achievement-source-copy"><strong>Nintendo Switch</strong><span>The official listing confirms the remaster and boosters, but does not establish a platform achievement set. Applicability remains under review.</span></div><span className="status-label"><span className="state-dot planned" /> Unresolved</span><a href={sources.find((source) => source.id === "nintendo-switch-store")?.url} target="_blank" rel="noreferrer" aria-label="Open Nintendo source"><ExternalLink size={15} /></a></div>
        <div className="achievement-source-row"><span className="platform-monogram">iOS</span><div className="achievement-source-copy"><strong>iOS / iPadOS · Game Center</strong><span>{ios.count} achievements are catalogued. This list omits Backstabber and Movie Critic from the 85-entry Steam/Android sets; trigger and missability audits remain open.</span></div><span className="status-label"><span className="state-dot partial" /> Catalogued</span><a href={sources.find((source) => source.id === ios.sourceId)?.url} target="_blank" rel="noreferrer" aria-label="Open iOS achievement list"><ExternalLink size={15} /></a></div>
        <div className="achievement-source-row"><span className="platform-monogram">AOS</span><div className="achievement-source-copy"><strong>Android · Google Play</strong><span>{android.count} achievements are catalogued, including Backstabber and Movie Critic; this list matches Steam by criterion. Trigger and missability audits remain open.</span></div><span className="status-label"><span className="state-dot partial" /> Catalogued</span><a href={sources.find((source) => source.id === android.sourceId)?.url} target="_blank" rel="noreferrer" aria-label="Open Android achievement list"><ExternalLink size={15} /></a></div>
      </section>
      {activeCatalog && catalogTitleId ? <section className="achievement-catalog" aria-labelledby={catalogTitleId}>
        <div className="achievement-catalog-header"><div><div className="eyebrow">{activeCatalog.label.toUpperCase()} · MANUAL TRACKER</div><h2 id={catalogTitleId}>All {activeCatalog.records.length} {platform === "ps4" ? "trophies" : "achievements"}</h2><p>{activeCatalogDescription} Walkthrough pointers cover {activeMapped} catalog entries; trigger detail and full missability remain under review.</p></div><span className="coverage-status">{activeCompleted} / {activeCatalog.records.length} marked unlocked</span></div>
        <div className="achievement-catalog-list" aria-label={`${activeCatalog.label} achievement criteria`}>
          {activeCatalog.records.map((achievement) => {
            const done = profile.marks[achievement.objectiveId]?.complete === true;
            const linkedAreas = achievementGuideAreas(achievement);
            const linkedMissables = achievementGuideMissables(achievement);
            const linkedSources = (achievement.guideSourceIds ?? []).map((sourceId) => sources.find((source) => source.id === sourceId)).filter((source): source is (typeof sources)[number] => Boolean(source));
            const isMovieCritic = achievement.id === "movie-critic" || ("parityId" in achievement && achievement.parityId === "movie-critic");
            const ateMarkedCount = isMovieCritic ? movieCriticEligibleEvents.filter((event) => profile.marks[event.objectiveId]?.complete === true).length : 0;
            const controlId = `${activeCatalog.id}-achievement-${achievement.id}`;
            const chapterLink = (area: GuideArea) => <button type="button" key={area.id} onClick={() => onOpenChapter(area.id)} aria-label={`Open ${area.title} walkthrough`}><BookOpen size={12} aria-hidden="true" /> {area.title}</button>;
            return <div className={`achievement-entry ${done ? "achievement-entry-done" : ""}`} key={achievement.id}>
              <label className="achievement-entry-control" htmlFor={controlId}>
                <input id={controlId} type="checkbox" checked={done} onChange={() => onToggle(achievement.objectiveId)} aria-label={`${done ? "Unmark" : "Mark"} ${achievement.name} unlocked`} />
                <span className="custom-check" aria-hidden="true"><Check size={12} /></span>
              </label>
              <label className="achievement-entry-copy" htmlFor={controlId}><strong>{achievement.name}</strong><small>{achievement.criteria}</small></label>
              <span className="achievement-entry-state">{done ? "Unlocked" : "Not marked"}</span>
              {linkedAreas.length === 1 && <div className="achievement-guide-links">{chapterLink(linkedAreas[0])}</div>}
              {linkedAreas.length > 1 && <details className="achievement-guide-links"><summary>Guide sections · {linkedAreas.length}</summary><div>{linkedAreas.map(chapterLink)}</div></details>}
              {(achievement.guideNote || linkedMissables.length > 0 || isMovieCritic) && <div className="achievement-guide-context">
                {isMovieCritic && <p className="achievement-ate-progress"><span><strong>ATE scenes marked:</strong> {Math.min(ateMarkedCount, movieCriticTarget)} / {movieCriticTarget}</span><button className="text-action" type="button" onClick={onOpenAteTracker}><Clapperboard size={12} aria-hidden="true" /> Open ATE Tracker</button></p>}
                {achievement.guideNote && <p>{achievement.guideNote}{linkedSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" aria-label={`Open source: ${source.title}`} key={source.id}><ExternalLink size={11} aria-hidden="true" /></a>)}</p>}
                {linkedMissables.length === 1 && <p className="achievement-missable-note"><AlertTriangle size={12} aria-hidden="true" /><span><strong>Missable cutoff:</strong> {linkedMissables[0].deadline}</span></p>}
                {linkedMissables.length > 1 && <details className="achievement-missable-list"><summary><AlertTriangle size={12} aria-hidden="true" /> Missable windows · {linkedMissables.length}</summary><ul>{linkedMissables.map((record) => <li key={record.id}><strong>{record.title}:</strong> {record.deadline}</li>)}</ul></details>}
              </div>}
            </div>;
          })}
        </div>
      </section> : <p className="method-note">Platform counts checked 26 Oct 2026. Nintendo Switch has no platform catalog confirmed in this review; iOS and Android lists are transcribed from their service-specific catalogs.</p>}
    </>
  );
}

const enemyFieldLabels = {
  level: "Level",
  HP: "HP",
  MP: "MP",
  EXP: "EXP",
  AP: "AP",
  Gil: "Gil",
} as const;

const enemyFactLabels: Record<EnemyFact["category"], string> = {
  type: "Type",
  "elemental-weakness": "Weak to",
  "elemental-resistance": "Resists",
  "status-vulnerability": "Status weaknesses",
  attack: "Attack",
};

const partialReferenceSections = new Set([
  "Enemies and variants",
  "Bosses",
  "Items and equipment",
  "Abilities and equipment sources",
  "Synthesis",
  "Treasures and field pickups",
  "ATEs",
  "Achievements",
  "Locations and encounters",
]);

function Reference({ profile, profileCount, profileMessage, onExport, onImport, onToggleObjective, onOpenChapter, onNavigate }: {
  profile: PlaythroughProfile;
  profileCount: number;
  profileMessage: string;
  onExport: () => void;
  onImport: () => void;
  onToggleObjective: (id: string) => void;
  onOpenChapter: (id: string) => void;
  onNavigate: (view: View) => void;
}) {
  const [enemyQuery, setEnemyQuery] = useState("");
  const [enemyKindFilter, setEnemyKindFilter] = useState<"all" | EnemyRecord["kind"]>("all");
  const encounterKindCounts = enemyEncounters.reduce((counts, encounter) => ({ ...counts, [encounter.kind]: counts[encounter.kind] + 1 }), { fixed: 0, boss: 0, "random-pool": 0 });
  const filteredEnemies = enemyRecords.filter((enemy) => {
    if (enemyKindFilter !== "all" && enemy.kind !== enemyKindFilter) return false;
    const query = enemyQuery.trim().toLowerCase();
    if (!query) return true;
    const relatedText = [
      enemy.name,
      ...enemy.facts.flatMap((fact) => [fact.label, fact.detail ?? ""]),
      ...enemy.blueMagic.map((entry) => entry.name),
      ...enemy.strategies.flatMap((strategy) => [strategy.title, strategy.detail]),
      ...(enemy.preparationGuidance ? [
        enemy.preparationGuidance.levelRationale,
        ...(enemy.preparationGuidance.difficultyAssessment ? [enemy.preparationGuidance.difficultyAssessment] : []),
        enemy.preparationGuidance.optionalGrinding,
        enemy.preparationGuidance.setupAdvice,
        ...(enemy.preparationGuidance.suggestedLevelRange ? [
          `level ${enemy.preparationGuidance.suggestedLevelRange.min} ${enemy.preparationGuidance.suggestedLevelRange.max}`,
        ] : []),
      ] : []),
      ...enemy.steals.map((entry) => lootItemName(entry.itemId, entry.itemName)),
      ...enemy.drops.map((entry) => lootItemName(entry.itemId, entry.itemName)),
    ].join(" ").toLowerCase();
    return relatedText.includes(query);
  });

  return (
    <>
      <PageHeading eyebrow="SYSTEMS & DATA" title="Reference" lead="Browse the source-linked combat and collection records now available." />
      <section className="enemy-reference" aria-labelledby="enemy-reference-heading">
        <div className="enemy-reference-heading">
          <div>
            <div className="eyebrow">BESTIARY · PARTIAL COVERAGE</div>
            <h2 id="enemy-reference-heading">Enemy, boss, and friendly encounters</h2>
            <p>{enemyRecords.length} enemy records · {enemyEncounters.length} encounter groups ({encounterKindCounts.fixed} fixed, {encounterKindCounts.boss} boss, {encounterKindCounts["random-pool"]} random pools) · {enemyCatalogCoverage.note}</p>
          </div>
          <div className="enemy-reference-actions">
            {enemyCatalogCoverage.chapterIds.map((chapterId) => {
              const area = guideAreas.find((chapter) => chapter.id === chapterId);
              return <button className="secondary-button" type="button" key={chapterId} onClick={() => onOpenChapter(chapterId)}>Open {area?.title ?? "walkthrough"} <span aria-hidden="true">→</span></button>;
            })}
          </div>
        </div>
        <div className="enemy-reference-toolbar">
          <label className="enemy-search-label">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">Search enemy records</span>
            <input type="search" value={enemyQuery} onChange={(event) => setEnemyQuery(event.target.value)} placeholder="Search names, items, attacks, or weaknesses" />
          </label>
          <label className="enemy-filter-label">
            <span>Record type</span>
            <select value={enemyKindFilter} onChange={(event) => setEnemyKindFilter(event.target.value as typeof enemyKindFilter)}>
              <option value="all">All records</option>
              <option value="ordinary">Ordinary enemy</option>
              <option value="boss">Boss</option>
              <option value="component">Boss component</option>
              <option value="friendly">Friendly creature</option>
            </select>
          </label>
        </div>
        <div className="enemy-reference-list">
          {filteredEnemies.map((enemy, index) => {
            const statsByField = enemy.stats.reduce<Partial<Record<keyof typeof enemyFieldLabels, EnemyRecord["stats"]>>>(
              (groups, claim) => ({ ...groups, [claim.field]: [...(groups[claim.field] ?? []), claim] }),
              {},
            );
            const encounterTitles = enemy.encounterIds
              .map((encounterId) => enemyEncounters.find((encounter) => encounter.id === encounterId))
              .filter((encounter): encounter is (typeof enemyEncounters)[number] => Boolean(encounter));
            const relatedMissables = enemy.missableIds
              .map((missableId) => missables.find((record) => record.id === missableId))
              .filter((record): record is MissableRecord => Boolean(record));
            const linkedObjectives = [...new Set([...enemy.routeObjectiveIds, ...enemy.blueMagic.flatMap((entry) => entry.objectiveIds)])]
              .map((objectiveId) => objectives.find((objective) => objective.id === objectiveId))
              .filter((objective): objective is (typeof objectives)[number] => Boolean(objective));

            return <details className="enemy-record" key={enemy.id}>
              <summary className="enemy-record-summary">
                <span className="reference-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="enemy-record-name"><strong>{enemy.name}</strong><small>{enemy.kind === "friendly" ? "Friendly creature" : enemy.kind === "boss" ? "Story boss" : enemy.kind === "component" ? "Boss component" : encounterTitles.some((encounter) => encounter.kind === "random-pool") ? "Random encounter enemy" : "Fixed encounter enemy"} · {encounterTitles.length} linked {encounterTitles.length === 1 ? "encounter group" : "encounter groups"}</small></span>
                <span className="enemy-record-scope">{enemyChapterScope(enemy.chapterId)}</span>
                <ChevronDown className="enemy-record-chevron" size={16} aria-hidden="true" />
              </summary>
              <div className="enemy-record-body">
                <p className="enemy-version-note">{enemy.versionScope}</p>
                <div className="enemy-detail-grid">
                  <section className="enemy-detail-section" aria-label={`${enemy.name} statistics`}>
                    <h3>Statistics</h3>
                    <dl className="enemy-stat-list">
                      {Object.entries(enemyFieldLabels).map(([field, label]) => {
                        const claims = statsByField[field as keyof typeof enemyFieldLabels] ?? [];
                        if (claims.length === 0) return null;
                        return <div key={field}><dt>{label}</dt><dd>{claims.map((claim) => <span className={claim.verification === "disputed" ? "enemy-stat-disputed" : ""} key={`${field}-${claim.value}`}>{claim.value.toLocaleString()}{claim.verification === "disputed" ? " · source difference" : ""}</span>)}</dd></div>;
                      })}
                    </dl>
                  </section>
                  <section className="enemy-detail-section" aria-label={`${enemy.name} steals and drops`}>
                    <h3>Steal and drop tables</h3>
                    <div className="enemy-loot-tables">
                      {(["steals", "drops"] as const).map((tableName) => <div key={tableName}>
                        <h4>{tableName === "steals" ? "Steals" : "Drops"}</h4>
                        {enemy[tableName].length === 0 ? <p>No entries in the cited table.</p> : <dl>{enemy[tableName].map((entry) => <div key={`${tableName}-${entry.slot}`}>
                          <dt>{entry.slot}</dt>
                          <dd>{lootItemName(entry.itemId, entry.itemName)}{entry.note && <small>{entry.note}</small>}</dd>
                        </div>)}</dl>}
                      </div>)}
                    </div>
                  </section>
                  <section className="enemy-detail-section enemy-combat-facts" aria-label={`${enemy.name} combat details`}>
                    <h3>Combat details</h3>
                    <dl>{enemy.facts.map((fact, factIndex) => <div key={`${fact.category}-${factIndex}`}>
                      <dt>{enemyFactLabels[fact.category]}</dt>
                      <dd><strong>{fact.label}</strong>{fact.detail && <small>{fact.detail}</small>}</dd>
                    </div>)}</dl>
                    {enemy.blueMagic.length > 0 && <div className="enemy-blue-magic">
                      <h4>Blue Magic</h4>
                      {enemy.blueMagic.map((entry) => <p key={entry.name}><strong>{entry.name}</strong> — Quina learns it with {entry.command}.</p>)}
                    </div>}
                  </section>
                  <section className="enemy-detail-section" aria-label={`${enemy.name} route and preparation notes`}>
                    <h3>Route and preparation</h3>
                    {enemy.preparationGuidance && <div className="enemy-preparation-guidance">
                      <h4>Optional preparation guidance</h4>
                      <p>{enemy.preparationGuidance.suggestedLevelRange && <><strong>Optional level range:</strong> Lv. {enemy.preparationGuidance.suggestedLevelRange.min}–{enemy.preparationGuidance.suggestedLevelRange.max}. </>}{enemy.preparationGuidance.levelRationale}</p>
                      {enemy.preparationGuidance.difficultyAssessment && <p><strong>Published difficulty:</strong> {enemy.preparationGuidance.difficultyAssessment}</p>}
                      <p><strong>Grinding:</strong> {enemy.preparationGuidance.optionalGrinding}</p>
                      <p><strong>Setup:</strong> {enemy.preparationGuidance.setupAdvice}</p>
                      <p className="enemy-preparation-confidence"><strong>Evidence status:</strong> {enemy.preparationGuidance.confidence === "partial" ? "Partial; source and version coverage is limited, and guidance is not gameplay-tested." : "Disputed; compare the linked sources."}</p>
                      <div className="enemy-preparation-sources"><span>Guidance sources</span>{enemy.preparationGuidance.sourceIds.map((sourceId) => {
                        const source = sources.find((item) => item.id === sourceId);
                        return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={10} aria-hidden="true" /></a> : null;
                      })}</div>
                    </div>}
                    <ul className="enemy-strategies">{enemy.strategies.map((strategy) => <li key={strategy.title}><strong>{strategy.title}</strong><span>{strategy.detail}</span></li>)}</ul>
                    {encounterTitles.length > 0 && <div className="enemy-encounter-list"><h4>Encounter locations</h4><ul>{encounterTitles.map((encounter) => <li key={encounter.id}><strong>{encounter.kind === "random-pool" ? "Random encounter pool" : encounter.kind === "boss" ? "Story boss" : "Fixed encounter"}</strong><span>{encounter.title}</span><small>{encounter.location}</small></li>)}</ul></div>}
                    {enemy.notes.map((note) => <p className="enemy-conflict-note" key={note}>{note}</p>)}
                    {relatedMissables.length > 0 && <div className="enemy-cutoff-links">
                      {relatedMissables.map((record) => <p key={record.id}><strong>One-time window:</strong> {record.deadline} <button type="button" className="inline-link" onClick={() => onNavigate("missables")}>Review missable</button></p>)}
                    </div>}
                    {linkedObjectives.length > 0 && <div className="enemy-objectives">
                      {linkedObjectives.map((objective) => <label className="chapter-objective enemy-objective" key={objective.id}>
                        <input type="checkbox" checked={objectiveIsComplete(profile, objective.id)} onChange={() => onToggleObjective(objective.id)} />
                        <span className="custom-check"><Check size={12} /></span>
                        <span>{objective.title}</span>
                      </label>)}
                    </div>}
                  </section>
                </div>
                <div className="enemy-source-list"><span>Sources</span>{enemy.sourceIds.map((sourceId) => {
                  const source = sources.find((item) => item.id === sourceId);
                  return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={11} aria-hidden="true" /></a> : null;
                })}</div>
              </div>
            </details>;
          })}
          {filteredEnemies.length === 0 && <p className="empty-state">No enemy records match those filters.</p>}
        </div>
        <p className="enemy-coverage-footnote">This bestiary is partial. Expand a dossier to review its source scope, loot, encounter links, and any unresolved differences. Other areas and release-by-release parity remain to be researched.</p>
      </section>
      <section className="reference-coverage" aria-label="Reference database inventory">
        {referenceInventory.map((item, index) => {
          const partial = partialReferenceSections.has(item);
          return <div key={item} className="reference-row"><span className="reference-index">{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><span className="status-label"><span className={`state-dot ${partial ? "partial" : "planned"}`} />{partial ? "Partial" : "Planned"}</span></div>;
        })}
      </section>
      <section className="data-principles">
        <div><div className="eyebrow">CONTENT RELATIONSHIPS</div><h2>One objective, one progress ID.</h2><p>Walkthrough checklists and global reference trackers will point to the same stable objective IDs. Updating chapter text will not reset saved progress.</p></div>
        <div className="profile-backup-panel"><div className="backup-heading"><Archive size={17} /><div><strong>Progress backup</strong><span>{profileCount} local profile{profileCount === 1 ? "" : "s"} · cloud sync not configured</span></div></div><div className="backup-actions"><button className="secondary-button" onClick={onExport}><ArrowDownToLine size={15} /> Export all</button><button className="secondary-button" onClick={onImport}><ArrowUpFromLine size={15} /> Restore backup</button></div><span className="sr-only" aria-live="polite">{profileMessage}</span></div>
      </section>
      <div className="inventory-strip"><strong>Side-content inventory seed</strong><span>{sideContentInventory.length} activity headings identified for later verification.</span></div>
    </>
  );
}

function lootItemName(itemId: string | null, itemName?: string) {
  if (itemId) return gameItems.find((item) => item.id === itemId)?.name ?? itemId;
  return itemName ?? "Unrecorded";
}

function PageHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <div className="page-heading"><div className="eyebrow"><span className="eyebrow-line" /> {eyebrow}</div><h1>{title}</h1><p className="page-lead">{lead}</p></div>;
}

export { App };
