# Project task backlog

Last updated: 2026-10-24

This backlog tracks the full guide objective. A working feature or an inventory count is not completion evidence by itself. Keep the [project plan](PROJECT_PLAN.md), [coverage matrix](CONTENT_COVERAGE.md), [research register](RESEARCH_SOURCES.md), and [user setup checklist](USER_SETUP_CHECKLIST.md) aligned as tasks move.

## Current execution order

### B01 — Verify the main route and model real progression gates

- **Priority:** Critical
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** All 44 walkthrough headings are authored and source-linked; the Route Map follows the registered GameFAQs contents order with 43 `guide-order` links. A separate, source-backed graph maps all 44 chapter headings and follows the main story through the final battle, with 41 required story transitions, two optional detours (Lindblum exploration and the post-Deathguise return to Gaia), twelve optional returns (three Kupo Nut deliveries, the Disc I Dali/Ice Cavern cleanup, the Disc II Dali/Observatory return and pre-Cleyra Qu's Marsh stop, the Pinnacle Rocks pickup return, the Disc III Dali coffee/key-item return, the two-leg Disc IV Mognet route, and Disc IV returns to Treno and Madain Sari), and eleven explicit rejoins. It includes the forced Oeilvert/Desert Palace party split and tests the post-Ark Gulug Stone handoff to Cid's segment, the Lindblum city cutoff at Gizamaluke's Grotto entry, the Disc III Alexandria-to-Treno cutoff with its closure disagreement, and Cleyra's departure cutoff with the exact last safe action marked as disputed. The Disc IV Burmecia return is scoped to Atla's Vault; access to the Suburb and Uptown pickup rooms remains unverified. The objective graph has 31 ATE-order links and two objective-access links; the latter track No Yummy-Yummies! and There A Mushroom! as access to the Cleyra rubbish-pit chests. Static route tests verify these boundaries with registered sources, the affected Alexandria warnings, Dali's return cutoff and disputed letter handling, the Disc IV Atla Vault access boundary and Mognet rejoin, and the Cleyra-to-Lindblum Basin frog detour and rejoin. A graph-level regression test traverses the required story path through the ending and checks that optional branches and returns can rejoin. These remain partial route and objective graphs, not the complete in-game progression model.
- **Next work:** Audit the full route graph for optional branches, party splits, cutoffs, and area returns; connect relevant ATE/objective prerequisites and reconcile warnings with actual in-game cutoffs instead of guide-order positions. Then continue the item, enemy, ability, achievement, level/preparation, cloud-sync, and release QA work tracked below.
- **Completion evidence:** Source-backed graph covers every story chapter, branch/return route, and structured prerequisite; IDs and edge semantics pass the data audit; standard and supported alternate routes have simulated end-to-end without false “missed” or “available” states.
- **Dependencies:** Source review and richer chapter/area data; coordinate with B02/B03 for shared one-way windows.

### B02 — Complete missable inventory, recovery paths, and cutoff review

- **Priority:** Critical
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** 129 profile-scoped missable records, warning acknowledgements, and high/critical cutoff review gates are implemented. Disc III's final-stock shop paths link to the Preparing to Leave cutoff objective, and the data audit checks that each limited-window path with a recommended cutoff has a warning and checklist step at that checkpoint. Diamond Armor has its own item objective and version-scoped warning: the reviewed PlayStation sources identify Daguerreo as its only source, and the Disc IV stock omits it. Rune Blade and Obelisk have a separate warning for their documented final Disc III purchase/learning opportunity; Hamelin and Black Hood have source-caveated warnings for Jewel and Death, and a final-checkpoint review covers Luna, Power Break, Magic Break, and Six Dragons. These ability warnings do not claim permanent skill loss.
- **Next work:** Continue the item-level recovery audit across the other Disc III last-stock items and unique treasure, pickup, steal/drop, ATE, letter, sidequest, card, minigame, ending, and achievement windows; verify each exact cutoff and latest warning point, then record later recovery by item/record and build version.
- **Completion evidence:** Reconciled source-backed registry with correct permanent/recoverable/limited/conditional/version-specific classification; every mapped warning appears before the relevant action; player route simulations confirm no false permanent-loss warnings or silently skipped high-risk items.
- **Dependencies:** B01 for route order; B03/B04/B05/B06 for category inventories and replacement paths.

### B03 — Verify ATE triggers and single-save Movie Critic route

- **Priority:** Critical
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** 83 named events, 80 eligible choices, 3 non-achievement tutorials, the mutually exclusive Treno pair, a 79-scene target, 31 ATE-order links, and two separate objective-access links are structured and linked to the tracker. Dali's six-event route records the opening choice, Cat's Eye → Cat's Eye 2, Dagger Tries → Dagger Tries Harder, and the Weapon Shop warning. Disc III Treno now places Hippo's Prize before Memories By The Water on Vivi's stay branch and Home Sweet Home after Good Old Days and Lessons of Life on the home branch; the route test locks all ten named scenes, prerequisites, and four sources per event. Treno's first-six ATE route follows the four-source entrance → west → stairs → south → right-hand stairs → north sequence, with the Auction House cutoff and TrueAchievements ordering conflict documented. Conde Petie's five-event route records the shared order, three screen-order dependencies, the conflicting compass directions for Quina Accused, and the Item Shop warning. Black Mage Village records the three-source Everyday Life → Life On The Run → Gourmand's Nose → Different Language → Visitor, Not Invader → Life Cycle sequence, the Mogryo letter checkpoint after the first three, and conflicting directions for Different Language. Cleyra's four event records have explicit sources; the route test follows Jegged's pond-entry → pond-re-entry → observatory sequence while preserving the GameFAQs/Gamer Guides alternative without encoding uncertain hard prerequisites. The two Quina ATEs now link to the optional rubbish-pit chest objective in a separate access relationship, surfaced in the tracker; the test checks sources and the Cleyra walkthrough link. Bran Bal, Pandemonium, Lindblum, and Madain Sari routes retain their source-backed prerequisites and documented conflicts. A static test produces 79 planned views for Steam, PS4, and Xbox under either Treno choice, while live verification remains pending.
- **Next work:** Continue the source/version audit for each event's exact trigger, screen sequence, choice, deadline, reward, and platform eligibility. Add verified conditional gates to the static route model and establish release-specific behavior before treating the plan as a complete single-save proof.
- **Completion evidence:** Audited event table and chronological contextual walkthrough route per supported build; graph and achievement mappings pass source/ID checks; an end-to-end 79-scene simulation proves a feasible 79-of-80 single-save plan for each confirmed platform set.
- **Dependencies:** B01 and B06.

### B04 — Build the enemy, encounter, and boss reference

- **Priority:** Required
- **Status:** Not started
- **Owner:** Codex
- **Next work:** Establish complete enemy/variant inventory and source hierarchy; capture location, encounter group, stats by version where relevant, steals, drops, Blue Magic, status/element interactions, fixed/scripted behavior, and boss strategies. Cross-link every record to route windows and missables.
- **Completion evidence:** Source-backed records for every enemy, encounter variant, and boss; version scope and disagreements are explicit; every one-time steal/drop window links to B02 and walkthrough context.
- **Dependencies:** B01, B02, B05.

### B05 — Build the item, equipment, shop, synthesis, and acquisition database

- **Priority:** Required
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** The partial catalog has 93 item records and 154 acquisition paths across 20 chapter slices. It includes two Cleyra item records—Magician Shoes and Silk Robe—with three paths for the normal Trunk chest and two ATE-gated rubbish-pit chests, plus the Disc III Home Front dock/castle/West Tower pickups, Leo Stellazzio, and the three item paths for Stiltzkin #5’s shared 777-Gil bundle; the original Burmecia/early-game paths, individual paths for all eight Oeilvert chests plus Stiltzkin's sixth bundle, Mimoza's Kupo Nut, and Ark's steals/drop; Mount Gulug's one-pass pickups, Mognet rewards, Red Dragon Ether drops, Meltigemini steals/drop, and both local Wing Edge pickups; Disc III final-stock shops; the Disc IV Black Mage Village and Daguerreo shop refresh; frog reward routes for Silver Fork and Bistro Fork; Grand Armor's steal/synthesis alternatives; and all five source-backed Battle Boots routes through the 45-frog reward, Daguerreo synthesis, Pandemonium chest, Garland steal, and Hades steal. The catalog tracks 24 source-specific inventory targets and 19 partial equipment-ability claims, including Silk Robe's Ability Up claim. Two synthesis recipes are modeled with ingredient quantities, shops, and costs; Grand Armor's recipe also records its retained-Mythril-Sword condition. Replaced shop stock, Oeilvert room-label and Mount Gulug item/steal-name differences, the Tiger Fangs price conflict, and the Rune Blade/Obelisk, Hamelin, Octagon Rod, and Grand Armor ingredient disagreements are recorded. Diamond Armor has an item-specific cutoff objective and Ability Up claim; Hamelin, Black Hood, Octagon Rod, and the final-stock ability items have source-caveated opportunity warnings. The audit checks catalog relationships, quantities, costs, shop metadata, targets, recipes, and ability provenance.
- **Next work:** Continue growing the deduplicated inventory by disc and item class, adding remaining pickup, steal/drop, shop, synthesis, auction, minigame, quest, and replacement paths. Reconcile shop cutoffs and prices against direct game/version evidence; capture exact quantities, costs, earliest/latest access, ability sources, and version differences only when sourced. Expand recipe and ability coverage beyond the current source-backed slices, then add a reference UI after coverage is meaningful.
- **Completion evidence:** Every obtainable item has sourced acquisition paths and availability/recovery status; one-copy and limited-quantity constraints are reconciled; shops/synthesis have time-aware stock and ingredient requirements; walkthrough and missable trackers share stable IDs.
- **Dependencies:** B01, B02, B04, B06.

### B06 — Complete platform achievements, abilities, and side-content mapping

- **Priority:** Required
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** Steam (85), PS4 (51 gameplay criteria plus Platinum), and Xbox (51) catalogs are imported with walkthrough pointers. Trigger conditions and missability are incomplete; Switch and mobile achievement services are unresolved. Ability, Blue Magic, summon, card, minigame, and sidequest references are partial.
- **Next work:** Audit native identifiers and triggers for supported catalogues; establish Switch/mobile support from platform evidence; finish abilities/Blue Magic/summons and side-content inventories with acquisition, prerequisite, availability, and reward paths.
- **Completion evidence:** Exact supported platform/service catalogs; every criterion has a trigger route, missability/recovery analysis, stable shared objective mapping, and verified platform applicability. Every learnable/stealable/quest ability and meaningful side activity is inventoried and route-linked.
- **Dependencies:** B01–B05.

### B07 — Add evidence-based levels, difficulty, and preparation guidance

- **Priority:** Required
- **Status:** Not started
- **Owner:** Codex
- **Next work:** Establish a source-backed standard for expected level ranges, difficulty, party configuration, equipment/ability preparation, and optional grinding at meaningful milestones; keep Excalibur II/low-experience routes distinct.
- **Completion evidence:** Every chapter and meaningful boss has guidance grounded in comparable version/route evidence or is explicitly labeled when sources cannot support a recommendation; no guessed level values.
- **Dependencies:** B01, B04, B05, B06.

### B08 — Complete Excalibur II and advanced perfect-game routes

- **Priority:** Required for selected challenge goals
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** Static PS1 NTSC source trace reaches Excalibur II after Lich at 11:13:07; the profile timer contains 45 baseline checkpoint targets. The source route lists four Burmecia item targets before skipping other local pickups; how to combine that timed branch with the full exploration objective, including later room access, remains unverified. Alternative path budgets, platform timer behavior, and live validation remain open.
- **Next work:** Resolve disputed route instructions, calculate each supported detour/stat path, test timer/pause/booster behavior by build, and separate standard-game route from exploit/mod routes.
- **Completion evidence:** Source-linked itinerary and independently checked budget for each route; checkpoint/timer semantics verified on supported builds or explicitly bounded; full route simulation reaches Excalibur II within the target and lists incompatible completion goals.
- **Dependencies:** B01–B07 and platform access/evidence.

### B09 — Finish local profile and accessibility workflows

- **Priority:** Required
- **Status:** In progress
- **Owner:** Codex
- **Current evidence:** Local profile-scoped marks, route selection, current-area warnings, manual timer/checkpoints, and JSON export/restore exist. Profile editing/deletion, category selection, full scenarios, accessibility review, and content responsiveness remain.
- **Next work:** Complete profile management and per-profile goal categories; review keyboard/screen-reader semantics, focus, contrast, zoom/reflow, reduced motion, tap targets, and responsive behavior at 320/375/768/1024/1440 CSS px; automate accessibility checks.
- **Completion evidence:** Manual and automated accessibility evidence plus multi-profile/export/restore scenarios; no horizontal overflow or clipped controls across target widths; all user progress actions persist and remain recoverable.
- **Dependencies:** B01–B08 for finished interface/data scope.

### B10 — Implement Firebase authentication and synchronization

- **Priority:** Required for full cross-device functionality
- **Status:** Blocked until Codex has authored and locally tested the implementation contract
- **Owner:** Codex, then user for Firebase account configuration
- **Next work:** Define provider, Firebase initialization/config contract, profile ownership schema, rules/indexes, migrations, offline queue, merge/conflict review, emulator tests, and secrets/environment handling. Update [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md) before asking for any account-side action.
- **Completion evidence:** Emulator security/migration/sync tests, offline and conflict scenarios, and production-origin authentication/multi-device smoke tests pass; no credentials are committed.
- **Dependencies:** B09 and a stable profile schema. User steps remain in the setup checklist and must not be requested one at a time.

### B11 — Publish and verify the production guide

- **Priority:** Required for public delivery
- **Status:** Blocked on repository owner setup
- **Owner:** Codex and user
- **Current evidence:** GitHub Pages workflow and base path exist locally. No remote repository or live deployment has been verified.
- **Next work:** Codex completes and tests autonomous implementation first. User creates the documented public repository and configures Pages when the setup checklist marks each action Ready for User; Codex then pushes/verifies the existing history, CI, deployed site, and release smoke tests.
- **Completion evidence:** Green deployment workflow, live Pages URL serving the verified build, end-to-end product/auth/sync/mobile acceptance, and no required setup tasks left undocumented.
- **Dependencies:** B01–B10; user actions are sequenced in [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md).

## User-owned actions

Do not ask the user to complete blocked setup early. The ordered Firebase, GitHub, authorization, and final-acceptance actions—with exact values and verification steps—are maintained in [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md). Codex must finish the corresponding implementation and mark the task **Ready for User** before requesting account configuration.
