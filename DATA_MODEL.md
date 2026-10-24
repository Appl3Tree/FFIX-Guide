# Data model

Last updated: 2026-10-24

## Content records

The data layer is normalized around stable domain IDs and explicit relationships. Display text, order, route, and source URL must not be used as progress identity.

- **Source** — publisher, URL, section or claim, platform/version, access date, verification status, conflict note.
- **Chapter/area** — explicit ID, disc-era grouping, title, source-ordered guide-sequence predecessor/successor, separately researched game route conditions, walkthrough blocks, and source links.
- **Walkthrough content** — a chapter `areaId`, overview, optional route note, ordered sections, and source-linked steps. Each step has a stable local ID, instruction kind, original text, optional detail, and zero or more shared objective IDs. A section's source IDs apply to its authored steps; disagreements stay in the copy and source notes until resolved.
- **Objective** — stable ID, category, prerequisites, associated chapter, rewards, platform constraints, and availability state.
- **Active Time Event** — stable scene ID and progress-objective ID, chapter and chapter-group objective, location, route trigger, prerequisites, achievement eligibility, optional exclusive-choice group, and source IDs. Tutorials reuse separate non-achievement objective IDs; each eligible scene has its own objective so the ATE tracker and chapter checklist can share progress.
- **Acquisition path** — object/enemy/event source, earliest/latest progression, conditions, probability or cost when verified, recoverability, and source IDs.
- **Missable** — classification, consequence, cutoff trigger, warning point, recovery path/difficulty, route applicability, and acknowledgement rule.
- **Enemy/boss** — variants, location/encounter sets, stats, steal/drop/Blue Magic interactions, abilities, strategy, and version scope.
- **Achievement** — platform-specific native ID/name/criteria, triggering objective, missability, and walkthrough relationships. Steam records use stable local slugs, source IDs, links to guide objectives or chapters, supplemental route notes, and extra source links for trigger details; the data audit validates those relationships. Achievement cards derive missable windows from their linked objectives when the same objective is tracked as a cutoff. Steam native IDs and complete trigger/missability review remain open.
- **Recommended preparation** — optional level range, expected difficulty, party/equipment/ability setup, source and confidence; no invented default values.
- **Product build** — stable build ID, storefront/platform, edition, region, native achievement service, booster capabilities, timer notes, and source evidence. Facts that differ by release attach here instead of to the abstract game record.

## Progress IDs and views

Contextual walkthrough checklists and global trackers point to the same objective ID. Alexandria demonstrates this with opening and sword-fight steals, Moonstone, Jump Rope, Mognet, card, pickup-sweep, and Knights of Pluto checkboxes; Evil Forest adds ATE, Steam-only achievement, boss-steal, and party-equipment objectives. The individual ATE tracker maps 80 achievement-eligible choices to scene objectives and reuses the three tutorial objectives; Movie Critic points to the eligible scenes. A Treno exclusive-group ID makes the profile count either Vivi outcome, never both. Marking a chapter-level ATE checklist cascades to its individual scene marks, and older chapter-level marks remain preserved with a notice that they lack scene detail. A progress mark is scoped to a playthrough profile, so one save can include an item while another remains independent. The current implementation uses namespaced strings such as `advanced.excalibur-ii.acquire`; chapter inventory IDs are explicit and independent of their displayed names. Authored chapters can set the profile's current story area, which feeds the cutoff-warning logic. Objective completion and warning acknowledgement use separate profile maps, so reading a warning never satisfies its objective. The data audit checks that every mapped missable warning chapter has a walkthrough checklist step linked to that missable's objective.

`src/data/progression.ts` stores all 44 stable chapter IDs in the registered walkthrough's source order and derives 43 `guide-order` links. The Route Map uses that sequence for chapter navigation and for the current-area ordering already used by warning and checkpoint logic. Separately, `gameRouteEdges` records researched `required-story`, `optional-detour`, `optional-return`, and `rejoin` relationships with explanations and source IDs. The graph is explicitly partial through the party's return to Madain Sari after the first Iifa Tree descent. It distinguishes the Dagger/Steiner Treno branch from Zidane's party, models the earlier Lindblum excursion, and records three optional returns: a Cleyra-preparation visit to Gizamaluke's Grotto, a Pinnacle Rocks pickup sweep from Lindblum, and a Kupo Nut delivery to Gizamaluke's Grotto before Fossil Roo. The two Kupo Nut routes and Lindblum excursion have dedicated rejoin edges; the Pinnacle Rocks return reconnects through the existing Pinnacle Rocks-to-Lindblum story gate instead of duplicating that link. It does not infer a game gate from TOC adjacency. The same module normalizes the currently documented ATE prerequisite relationships into reusable objective-to-objective edges. The tracker shows whether linked prerequisite objectives are marked in the active profile; this is progress context, not a claim that the dependent prompt is available. The structural audit checks chapter scope, supported edge types, endpoints, source references, duplicate links, and reachability from the opening. Later story routes, cutoff conditions, and remaining objective prerequisites still need research.

Do not renumber records or derive IDs from an array index. If an objective is split or merged, retain an explicit migration map and preserve the previous mark for review; do not silently discard it.

## Profile schema

The local library uses schema version 3, a stable per-browser `deviceId`, profile list, and selected profile ID. Each profile stores its goal, route, selected product/platform, current story area, manually entered game clock, saved Excalibur II route splits, sparse objective marks, and warning acknowledgements. Normalization adds empty checkpoint and acknowledgement maps to older backups. The Excalibur II timer compares the manual clock with the selected source checkpoint and keeps actual splits separate from target data. Platform choices distinguish the original PlayStation, Steam, PS4 release, Xbox One/Series/Windows app, Switch, iOS/iPadOS, and Android; early broad PlayStation/mobile values remain readable when restoring foundation backups.

Achievement sets are keyed to the product build and service: Steam achievements, PlayStation trophies, Xbox achievements, and mobile in-app or account-linked achievements must not be assumed to share a single list. Steam's 85 visible names and criteria now have stable local objective IDs and manual unlock marks; those IDs are not claimed to be Steam's internal API names. All 85 Steam entries have guide pointers, while some cumulative criteria only have general notes; trigger verification, complete missability review, and the per-entry PS4/Xbox catalogs remain open. The Switch listing remains unresolved until checked in-game. Record product features and achievement service evidence separately from audited criteria and walkthrough triggers.

Objective marks include `complete`, `updatedAt`, `deviceId`, and per-objective `revision`. An unchecked action is stored as `complete: false` rather than deleting the key, so a future sync can preserve an intentional uncheck. Equal-version ties need a deterministic policy, and clock skew must be considered before shipping Firestore synchronization.

The app currently persists to `localStorage` and supports JSON export/restore. Firebase Auth/Firestore sync is planned, not implemented.

## Availability and completion

Each objective should resolve to a state based on selected profile, route, platform, and progression. Missable records may carry explicit `warningChapterIds` and route constraints; objectives carry goal-profile and optional achievement-platform applicability. The current UI uses these links to show chapter warning counts, profile-specific missable rows, and the overview's next unacknowledged warning. Missables distinguish actionable, available-later, missed, recoverable, complete, unplaced, and excluded records. Moving forward past unacknowledged high/critical one-time warnings opens a gate review; confirming records acknowledgement separately from completion. Warnings without a selected current area or mapped chapter remain unplaced. For example, the Steam-only Getting Emotional objective is excluded when the selected profile is not Steam. Current area is manually selected and does not claim sub-area precision.

Availability states:

- achieved;
- available now/actionable;
- available later;
- temporarily unavailable;
- missed but recoverable;
- permanently missed;
- intentionally excluded by criteria;
- mutually exclusive with a selected outcome;
- not applicable to the selected version.

Completion percentages are computed from only the selected criteria. Incompatible outcomes must not share a denominator, and unknown or unverified data must not be counted as complete.

## Sync design target

Firestore should store per-user, per-guide, per-profile documents. Authenticated users may read/write only their own data. Cloud writes should be debounced, offline changes queued, and sync conflicts presented with a reviewable choice. Merge objective marks by their version metadata, preserving explicit false marks. Profile settings and imported libraries need a separate conflict policy; they must not be silently merged as though they were checkboxes.

Before sync is enabled, test first sign-in, same-account multi-device edits, concurrent check/uncheck conflicts, offline sign-out/in, profile creation/deletion, schema migration, export restore, and Firestore rules using a local emulator.

## Walkthrough data validation

The data audit checks that each authored chapter maps to a known area and has a non-planned coverage state. Every section must have steps and at least one valid source ID; every step's objective IDs must exist. Content coverage remains partial until the chapter's research and route checks pass—the existence of valid structured content alone does not imply verification.
