# Final Fantasy IX — Interactive Completion Guide

An offline-first, source-linked completion guide for *Final Fantasy IX*. The project includes its research inventory, progress model, responsive application shell, and 44 partially authored walkthrough chapters: Alexandria, Evil Forest, Ice Cavern, Village of Dali, Cargo Ship, Lindblum, Exploring Lindblum Kingdom, Journey to Burmecia, Burmecia, Journey to Treno, Treno, Journey to Cleyra, Cleyra, Return to Alexandria, Pinnacle Rocks, Return to Lindblum, Journey to the Outer Continent, Outer Continent, Magdalene Forest, Conde Petie Mountain Path, Madain Sari, Journey to the Iifa Tree, Iifa Tree, Return to Madain Sari, Battle of the Iifa Tree, The Home Front, Card Tournament, Trouble on the Home Front, The Aftermath, On the High Seas, Picking Up the Trail, Forgotten Continent, Desert Palace, Lost Continent, Aerial Exploration, Ipsen's Castle, Breaking the Seal, Preparing to Leave, Portal to Another World, Return to Gaia, Second Battle of the Iifa Tree, Memoria, Final Preparations, and The Final Battle. Every story heading now has authored content, but chapters remain partial pending full route and version verification.

Expected public URL: <https://appl3tree.github.io/FFIX-Guide/>

Project tracking: [task backlog](TASK_BACKLOG.md) · [coverage matrix](CONTENT_COVERAGE.md) · [project plan](PROJECT_PLAN.md) · [user setup checklist](USER_SETUP_CHECKLIST.md)

## Current state

- React, TypeScript, and Vite application scaffolded for GitHub Pages.
- Route Map shows the 44 source-ordered chapter headings and provides chapter navigation; its separate, source-linked game-route graph covers 22 story gates, one optional detour, three optional returns, and three explicit rejoins through the party's return to Madain Sari after the first Iifa Tree descent. Later route coverage remains open.
- Individual ATE tracker catalogs 83 scenes, excludes the three tutorials from Movie Critic, counts 79 of 80 eligible choices for one save, and handles Vivi's mutually exclusive Treno outcomes.
- A reusable prerequisite graph currently covers 14 documented ATE dependencies; the tracker shows linked objectives' marks per playthrough without guessing prompt availability.
- Four-disc chapter inventory based on the table of contents of the GameFAQs PlayStation walkthrough.
- Alexandria chapter authored from the Tantalus opening through the Prima Vista crash, with pickup directions, optional activities, source notes, cutoff rewards, and interactive objectives.
- Evil Forest chapter authored from the crash site through Plant Brain and the campsite, with the Prima Vista backtrack, pickup sweep, six Movie Critic-eligible ATEs, separately tracked Mogster Lesson 1, boss steals, Mognet, escape preparation, and item-recovery warnings. Lesson 2 is correctly placed in Ice Cavern; all three tutorials are excluded from the 79-event achievement count.
- Ice Cavern chapter authored room by room with all eight chests, the hidden Potion path, Mois's tutorial and Mognet letter, the solo boss battle, its steal window, optional Nolrich Heights stops, and the return cutoff at leaving Dali.
- Village of Dali chapter covers all six listed ATEs, the Color Fortune achievement, the 11-pickup underground route, Kumop's letter, the one-time factory cutoff, the Skeleton encounter warning, and Black Waltz 2 at the cargo-ship loading area.
- Cargo Ship chapter documents the empty ship, the Black Waltz 3 battle and steals, the airborne attack pattern, and the chase to Lindblum; disputed weakness and steal-rate claims remain explicit.
- Lindblum chapter routes the city pickups and Mognet, all six local ATEs (five achievement-eligible scenes plus the separately tracked Lesson 3 tutorial), the Autograph/Moogle Suit cutoff, the timed Festival of the Hunt, Zaghnol's steals, the winner tradeoff, and the Base Level exit sweep.
- Exploring Lindblum Kingdom covers Quina, frog catching, available regional Blue Magic, Choco's recruitment, the first two Chocograph treasures, Bohden Arch's Moccha Coffee and Ether, and the early Pinnacle Rocks pickups.
- Journey to Burmecia covers the Lindblum pre-Grotto cutoff, Gizamaluke's Grotto bell route and hidden gear, Mognet checks, boss steals and recovery sources, the South Gate party split, Chocograph #4, and Quina's Night skill.
- Burmecia covers the street and balcony route, the crumbling-floor Germinas Boots chest, Wei and Kal's later ATE prerequisite, Atla's Mognet handoff and Mogshop, Stiltzkin's first bundle, and Beatrix's short steal window. Later Atla access is kept separate from uncertain access to every city treasure room.
- Journey to Treno covers the Summit Station shop and Mognet exchange, Black Waltz 3's second battle and steals, South Gate's later Gil chest, the optional Dali return, and nearby friendly Ghost and Quan's Dwelling stops.
- Treno covers the ordered seven-ATE route, Four-Armed Man's Power Belt, first-visit treasure and Stellazzio route, Mogrich, Griffin challenge, Supersoft, and the final Crime and Punishment ATE. Conflicting ATE order and shop-cutoff claims remain visible.
- Journey to Cleyra covers Gargan Roo's Mognet stop and chests, the Ralvurahva steal window, the return to Zidane's party, and optional Kupo Nut and Qu's Marsh stops before entering Cleyra.
- Cleyra covers the Trunk and settlement pickups, Quina's ATE and rubbish-pit sequence, Blue Magic opportunities, Mognet, the Antlion rewards and steals, Stiltzkin #2, the evacuation route, and Beatrix's one-time steals. Pickup labels, ATE order, final cutoff, and later steal-item sources remain under review.
- Return to Alexandria covers Serino's Mognet handoff, the 30-minute castle escape, its Tent and Ice Brand chests, Zorn and Thorn, the Friendship ATE, Beatrix's third battle, Mosh's letter, and Ralvuimago. Tantarian's first fight can be deferred to its later library window; enemy-value and item-recovery conflicts remain labeled.
- Pinnacle Rocks covers Monty's Mognet handoff, the five Ramuh manifestations, the three interior chests, the optional Peridot reward, Stiltzkin's post-Ramuh letter, and the final jump to Lindblum. Fragment routes and item recovery remain partial where sources differ.
- Return to Lindblum covers The Third Jewel, the post-attack city pickups, Serino/Moodon/Moonte's Mognet letters, the Kupo Nut exchange route, updated shop preparation, automatic departure ATEs, and the Dragon's Gate Bandana. The ATE total and perfect-inventory stock guidance remain partial.
- Journey to the Outer Continent covers Quina's return, the frog pond, Chocograph #5, Lani's steal window, Fossil Roo's route and treasures, Stiltzkin #3, Kuppo's letter, mining objectives, and the one-way exit. Treasure replacement paths, frog-pond advice, achievement trigger/missability detail, and some enemy details remain under review.
- Outer Continent covers the Chocograph #5 treasure, Outer Continent frogs and Blue Magic, the Friendly Ladybug, the ordered first-visit Conde Petie ATEs, town pickups and shops, Mogmatt's letter for Suzuna, and the Disc III Diamond checkpoint. ATE screen directions, item replacement, and achievement route detail remain partial.
- Magdalene Forest covers the owl-sign route through the Dead Forest, Black Mage Village's six first-visit ATEs, Mogryo's time-limited letter to Mocchi, the village pickup sweep, Virgo, shop/synthesis options, and Mogryo's post-rest Stiltzkin letter. The forest's one-way status and full shop inventory remain under review; the Movie Critic count is verified while the complete trigger route remains in progress.
- Conde Petie Mountain Path covers the second-visit Nuptial Joy ATE, Diamond recovery, Eiko's party entry, three chests, the Oglop card detour, Mogmatt's delivery to Suzuna, Stiltzkin #4, Hilgigars, and the four-stone Moonstone. Mogryo's letter to Mocchi is held for delivery at the Iifa Tree; path re-entry and the complete Movie Critic trigger route remain under review.
- Madain Sari covers the five first-visit ATEs, Libra and room pickups, Eiko's dinner choices, Kirman Coffee, the Eidolon Wall story scene, the mandatory rest and party change, and Morrison's return-visit shop. ATE trigger order, cooking-choice wording, the second-visit item refresh, and the global event-by-event Movie Critic route remain under review.
- Journey to the Iifa Tree covers the return through Mountain Path, the forest-only friendly Nymph and its Ore/Emerald reward, and the route to the tree entrance. The interior letter handoff, treasure route, and story cutoff belong to the next chapter.
- Iifa Tree covers Eiko's seal and Ruby reward, Mogryo's letter delivery to Mocchi, both hidden switches, the eight fixed chests, scripted descent battles, Soulcage's steal window and Fire Blades counter, and the story return to Madain Sari. The hidden Ether and exact lower-root access cutoff remain source disputes.
- Return to Madain Sari covers the return route, two hidden-room chests, Eidolon Wall rewards and healing, Zidane's solo Scarlet Hair battle, the recoverable steal opportunity, Memory Earring, Dagger's song scene, Amarant's recruitment, and the first party selection. Conflicting HP values are omitted.
- Battle of the Iifa Tree covers the Disc II return route, party prompts, sleep preparation, scripted Mistodon fights, Mocchi's save and Stiltzkin letter, the Aquamarine reward, and the Disc III transition. Repeat access to the Mistodon steals remains disputed.
- The Home Front covers Alexandria's defense, Hippaul's racing and cards, the Nero shuffle, Stiltzkin's fifth bundle, Tantarian's final library window, and the Disc III progression cutoff.
- Card Tournament covers the nine Treno ATE slots and Vivi branch, card rounds, the optional Chimera Armlet and Namingway Card, the Dali return for Burman Coffee and Mayor's Key, Treno side stops, and the early Rebirth Ring. Exact ATE timing and several recovery paths remain under review.
- Trouble on the Home Front covers the one-time Knights of Pluto reward, seven Mistodon fights, the Alexander story route, and the final Tantarian library window. The intermediate reward ladder and later Angel Earrings sources remain partial.
- The Aftermath covers Lindblum's return ATE sequence, castle and district pickups, the Mognet letter, Sagittarius, Cid's three potions, the under-50-Gil condition, and departure aboard the Blue Narciss. Conditional ATE prerequisites and recovery remain partial.
- On the High Seas covers Blue Narciss party setup, regional Quina Blue Magic and frog catching, Moguta's Extension reward, Esto Gaza's limited Mythril Sword stock, Alexandria's accessible ruins and Mognet letter, Chocobo ability progression and currently reachable treasures, the first Mountain Crack, four Dive Spots, South Gate chests, and Treno's updated auction stock. The three Tantalus Gil chests are collected only after Give Me My Money has triggered.
- Picking Up the Trail covers No. 288's Black Mage Village directions, the eastern sandpit route, the temporary story lock-in, and role-based party preparation for Oeilvert and the Desert Palace.
- Forgotten Continent covers the Blairsurpass landing, Chocobo detours, both local Mountain Cracks, Friendly Jabberwock, Oeilvert's one-way treasure route, Stiltzkin #6, and Ark.
- Desert Palace covers Cid's two escape puzzles, the six bloodstones, Fairy Earrings, Mognet and Kupo Nut timing, Blue Magic, Valia Pira, and the Namingway Card fallback.
- Lost Continent covers the Friendly Feather Circle, restocked Esto Gaza shop, Mognet letters, Mount Gulug's one-pass treasure route and fixed Red Dragons, Meltigemini, and the Lindblum return.
- Aerial Exploration covers the Hilda Garde 3, Sky Chocobo, Air Garden, Friendly Yan, Treno returns, and Daguerreo's Disc III shop window.
- Ipsen's Castle covers the inverted weapon rule, Kumool's Mognet stop, the ladder and puzzle treasure routes, four mirrors, Taharka, and the Amarant reunion.
- Breaking the Seal covers the fixed character assignments at all four shrines, Earth Guardian preparation and steals, Quina's Earth Shake opportunity, and the regroup before Terra.
- Preparing to Leave covers the last Disc III coffee, Treno monster, colored-stone, Oglop, shop-stock, and area-cutoff checks before Shimmering Island.
- Portal to Another World now covers Terra, Bran Bal, Pandemonium's forced fights and five pickups, the timed orb and elevator route, Mozme's Mognet exchange, the Silver Dragon/Garland/Kuja sequence, and the Disc IV story handoff. Boss-value disputes and item-specific recovery paths remain under review.
- Return to Gaia covers the open Disc IV world-map window and its late sidequests, including the final Stiltzkin bundle, Mognet Central, the Eidolon Wall, Magical Fingertip, and Nero Family checkpoint start.
- Second Battle of the Iifa Tree covers the portal route, preparation, Nova Dragon's attacks and steals, the conditional Grand Armor synthesis fallback, and the Memoria handoff.
- Memoria covers the hidden weapons and card Phantoms, optional Hades encounter and synthesis shop, the four guardians, Nero Family checkpoints 2–18, Excalibur II, and Deathguise. Its post-Deathguise return window is routed through Final Preparations.
- Final Preparations routes the post-Deathguise return window, optional leveling/AP/Gil preparation, Ozma, Hades's final Running Shoes source, and the Hammer ending-scene choice.
- The Final Battle covers Trance Kuja's steals and counters, Necron's status-heavy battle, the ending, and the final supported-release story achievement.
- Chapter checklist controls reuse profile-scoped progress IDs and connect the current chapter to the warning system across all 44 authored slices.
- Product-specific achievement coverage: source-linked manual trackers contain all 85 Steam criteria, all 51 shared PS4/Xbox gameplay criteria, and the PS4 Platinum trophy. Progress IDs stay separate by platform; linked missable cutoffs appear beside affected entries. Trigger details and full missability review remain in progress.
- A source-backed Excalibur II deadline record, manual save-clock countdown, 45 source-target comparisons, and profile-saved route splits for the baseline NTSC schedule.
- Local playthrough profiles, manual game-clock entry, progress export, and restore. The app does not read a game save file.
- Stable progress IDs and a merge-ready per-objective mark model.
- Profile-aware warning states, separate warning acknowledgements, and a confirmation gate before moving past known high/critical cutoff windows.
- Data integrity audit and unit tests for progress normalization and mark merging.
- Firebase authentication and Firestore synchronization are **not wired yet**. The UI is clear that progress currently stays on the device.

See [PROJECT_PLAN.md](PROJECT_PLAN.md) and [CONTENT_COVERAGE.md](CONTENT_COVERAGE.md) for the phased work and coverage state.
See [ROUTE_SIMULATION.md](ROUTE_SIMULATION.md) for the static chapter-by-chapter playthrough simulation log and remaining route checkpoints.
See [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md) for the consolidated GitHub, Firebase, authentication, Firestore, and production acceptance actions that require the project owner's account.

## Local development

Requires Node.js 22 or later and npm.

```sh
npm ci
npm run dev
```

Before proposing a change, run:

```sh
npm run lint
npm run typecheck
npm test
npm run audit:data
npm run build
```

The Vite base path is set to `/FFIX-Guide/`. The build copies `index.html` to `404.html` for GitHub Pages route fallback.

## Progress and profiles

Progress is stored in the browser under `FFIX-Guide.progress`. A profile contains its goal, route, specific platform release, optional manually entered game clock, recorded Excalibur II checkpoint times, objective marks, and warning acknowledgements. Missable records show actionable, available-later, missed, recoverable, complete, unplaced, or excluded status. Before advancing the current area past known high/critical warning windows, the guide asks the player to review and acknowledge them. Acknowledgement is separate from objective completion. The timer shows time remaining to 12 hours and compares the entered clock with the selected source checkpoint; it warns when the clock is more than five minutes behind that target. The 45 checkpoint targets are source-reported for original PlayStation NTSC baseline paths A, B, and Level 1; they have not been independently timed and are not verified for other releases or alternate stat paths. The app does not read game save files. Older broad PlayStation/mobile profile values remain readable in restored backups. Export downloads all profiles as JSON; restore replaces the browser library with a validated backup.

Objective IDs are stable domain identifiers, not list positions or UI labels. An unchecked change is represented as a timestamped `false` mark, so a future sync merge can preserve removals instead of treating every checkbox as an add-only set. Cloud conflict resolution and cross-device validation are still outstanding work.

## Firebase and security

Firebase is not yet initialized by the application. The dependency and blank `.env.example` are scaffolding only; progress currently remains in the browser. Do not configure Firebase or add GitHub Actions values until the integration, data schema, security rules, and emulator tests are ready.

The eventual web-app configuration is public client configuration, not a password or service-account credential. Authentication, per-user Firestore rules, authorized domains, API-key restrictions, and optional App Check provide security. See [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md) for the ordered account-side actions and current status; Codex will fill in exact provider, rules, index, and variable instructions after implementation.

## GitHub Pages deployment

`.github/workflows/deploy.yml` validates pull requests and deploys the `main` branch to GitHub Pages. It runs lint, typecheck, unit tests, data audit, and production build before uploading `dist/`.

Enable GitHub Pages with **GitHub Actions** as the source. The checkout now has local Git history on `main` (root commit `4838e55`) but no remote, and GitHub returned 404 for the expected `Appl3Tree/FFIX-Guide` repository. The owner-side repository creation step is documented in [USER_SETUP_CHECKLIST.md](USER_SETUP_CHECKLIST.md). No push or live deployment is claimed.

## Architecture

- `src/data/guide.ts` — game scope, source records, missable records, objective records, and chapter inventory.
- `src/data/walkthrough.ts` — authored walkthrough sections and source-linked steps; current partial coverage spans nine Disc I chapters, sixteen Disc II chapters, fourteen Disc III chapters, and five Disc IV chapters through Necron and the ending.
- `src/domain/progress.ts` — versioned local library, stable profiles, checkpoint split persistence, and merge-ready objective marks.
- `src/data/excalibur2.ts` — source-target checkpoint schedule and manual save-clock parsing/formatting.
- `src/data/ates.ts` — source-linked ATE scene records, individual progress IDs, prerequisites, and the Movie Critic target/branch data.
- `src/App.tsx` and `src/styles.css` — responsive guide workspace.
- `scripts/audit-data.ts` — duplicate-ID and source/objective/chapter relationship checks; incomplete research is reported as a warning, never as completion.
- Root-level project documents — research sources, audit strategy, current coverage, architecture, and testing records.

## Source use

Reference guides inform facts and scope, not copied walkthrough prose. Facts are represented as structured records with source IDs and a verification state. See [RESEARCH_SOURCES.md](RESEARCH_SOURCES.md) for the initial source register and unresolved claims.
